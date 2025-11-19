/**
 * PrimaOps - Extended operations and methods for PrimaSet
 * Adds algebraic operations and utilities beyond the basic core
 */

import { primaSet } from './primaset.mjs';

// ============================================================================
// iif (if-then-else) / Short-Circuit Operations
// ============================================================================

// iif: if-then-else pattern
// - undefined: short-circuit (stop iteration)
// - null: transform data and short-circuit
// - function: transform and continue
export const iif = (pred, then, else_) => {
  const fn = (x) => pred(x) ? then(x) : (else_ ? else_(x) : x)
  fn.iif = true
  fn.pred = pred
  fn.then = then
  fn.else = else_
  fn.help = 'iif: if pred(x) then f(x) else g(x). Returns undefined to short-circuit, null to transform and short-circuit'
  return fn
}

export const when = (pred, fn) => iif(pred, fn)
export const unless = (pred, fn) => iif(x => !pred(x), fn)

export const route = (routes) => {
  const fn = (x) => {
    const match = Object.entries(routes).find(([pred]) => {
      const p = typeof pred === 'function' ? pred : (v => v === pred)
      return p(x)
    })
    return match ? match[1](x) : x
  }
  fn.routes = routes
  fn.help = 'Route: match first predicate, apply function'
  return fn
}

// Custom operations
const operations = {
  // Basic algebraic operations
  sq: v => v * v,
  inv: v => 1 / v,
  neg: v => -v,

  // Arithmetic operations
  add: (a, b) => a + b,
  sub: (a, b) => a - b,
  mul: (a, b) => a * b,
  div: (a, b) => a / b,
  mod: (a, b) => ((a % b) + b) % b,
  scale: (a, b) => a * b,
  shift: (a, b) => a + b,

  // Statistical operations
  mean: (...args) => args.length ? args.reduce((a, b) => a + b, 0) / args.length : 0,
  sum: (...args) => args.reduce((a, b) => a + (+b || 0), 0),
  min: (...args) => args.length ? args.reduce((a, b) => Math.min(a, +b), Infinity) : Infinity,
  max: (...args) => args.length ? args.reduce((a, b) => Math.max(a, +b), -Infinity) : -Infinity,

  // Utility operations
  clamp: (v, min, max) => Math.min(max, Math.max(v, min)),
  sigmoid: x => 1 / (1 + Math.exp(-x)),

  // Advanced math
  factorial: (() => {
    const memo = new Map();
    return function fact(n) {
      if (n < 0) throw new Error('factorial requires n >= 0');
      if (n > 170) throw new Error('factorial overflow');
      if (n < 2) return 1;
      if (memo.has(n)) return memo.get(n);
      const res = n * fact(n - 1);
      memo.set(n, res);
      return res;
    };
  })(),

  // Number theory
  gcd: function gcd(a, b) { return b ? gcd(b, Math.abs(a % b)) : Math.abs(a); },

  lcm: (a, b) => Math.abs(a * b) / primaSet.gcd(a, b || 1),

  firstDivisor: (n) => {
    if (n < 2) return n;
    if (n % 2 === 0) return 2;
    if (n % 3 === 0) return 3;
    const sq = Math.trunc(Math.sqrt(n));
    for (let d = 5; d <= sq; d += 6) {
      if (n % d === 0) return d;
      if (n % (d + 2) === 0) return d + 2;
    }
    return n;
  },

  // Primality test - use firstDivisor as default (geometric sieve available via isPrimeGeometric)
  isPrime: (n) => {
    if (n < 2) return false;
    return operations.firstDivisor(n) === n;
  },

  // Advanced operations
};

// Base operations - fundamental lazy set operations
const methods = {
  // Core lazy operations
  *map(f) { for (const x of this) yield f(x); },
  reduce(f, init) { let acc = init; for (const x of this) acc = f(acc, x); return acc; },
  take(n) {
    const result = [];
    let c = 0;
    for (const x of this) {
      if (c++ >= n) break;
      result.push(x);
    }
    // Return primaSet backed by materialized array
    return primaSet(result);
  },

  takeWhile(pred) {
    const result = [];
    for (const x of this) {
      if (!pred(x)) break;
      result.push(x);
    }
    return primaSet(result);
  },

  takeRange(start, stop) {
    // Take elements from start to stop (inclusive)
    const result = [];
    let index = 0;
    for (const x of this) {
      if (index >= start && index <= stop) {
        result.push(x);
      }
      if (index > stop) break;
      index++;
    }
    return primaSet(result);
  },

  // Utility operations
  toArray() { return [...this]; },
  valueOf() { const arr = this.toArray(); return arr.length === 1 ? arr[0] : arr; },
  toString(maxlen = 100) { return [...this].slice(0, maxlen).join(','); },
  clearCache() { this._cache && (this._cache.length = 0); this._it = null; return this; },

  // Side effects & iteration
  *on(f) { for (const x of this) { f(x); yield x; } },
  forEach(fn) { for (const x of this) fn(x); },

  // Random access - materializes the element
  get(index) {
    if (index < 0) throw new RangeError('Index must be >= 0');

    // If this primaSet wraps a source array, access it directly
    if (this._sourceArray) {
      return this._sourceArray[index];
    }

    // Use the cached values if available (from memo or sliding window cache)
    if (this._cache) {
      const cached = this._cache.get(index);
      if (cached !== undefined) return cached;
    }

    // Otherwise, materialize the sequence up to the index
    // This will populate the cache if cache is enabled
    const arr = this.take(index + 1);
    const value = arr[index];
    
    // If memo mode, cache the value
    if (this._cache && this._memoized) {
      while (this._memoized.length <= index) {
        if (this._memoized.length < arr._sourceArray?.length) {
          this._memoized.push(arr._sourceArray[this._memoized.length]);
          this._cache.push(arr._sourceArray[this._memoized.length - 1]);
        } else {
          break;
        }
      }
    }
    
    return value;
  },

  // Special pipe function
  pipe(...fns) { return fns.reduce((acc, f) => f(acc), this); },

  // Node.js console inspection
  [Symbol.for('nodejs.util.inspect.custom')]() { return this.valueOf(); }
};

// Add extended methods
const generators = {
  *filter(p) { for (const x of this) if (p(x)) yield x; },

  *skip(n) {
    let c = 0;
    for (const x of this) if (c++ >= n) yield x;
  },

  *zip(other, f) {
    const itA = this[Symbol.iterator](), itB = primaSet(other)[Symbol.iterator]();
    while (true) {
      const a = itA.next(), b = itB.next();
      if (a.done || b.done) break;
      yield f ? f(a.value, b.value) : [a.value, b.value];
    }
  },

  debug(label = '') {
    return this.on(x => console.log(`[debug${label ? ' ' + label : ''}]`, x));
  },

  first() {
    const { value, done } = this[Symbol.iterator]().next();
    return done ? undefined : value;
  },

  isEmpty() {
    return this[Symbol.iterator]().next().done;
  },

  *chunk(size) {
    let buf = [];
    for (const x of this) {
      buf.push(x);
      if (buf.length === size) { yield [...buf]; buf = []; }
    }
    if (buf.length > 0) yield [...buf];
  },

  *window(size) {
    const buf = [];
    for (const x of this) {
      buf.push(x);
      if (buf.length > size) buf.shift();
      if (buf.length === size) yield [...buf];
    }
  },

  *flatten() {
    for (const x of this) {
      if (x?.[Symbol.iterator] && typeof x !== 'string') yield* primaSet(x).flatten();
      else yield x;
    }
  },

  *unique() {
    const seen = new Set();
    for (const x of this) {
      const key = typeof x === 'object' && x !== null ? JSON.stringify(x) : x;
      if (!seen.has(key)) { seen.add(key); yield x; }
    }
  },

  sort() {
    return primaSet([...this].sort((a, b) => a - b));
  },

  sortBy(f) {
    return primaSet([...this].sort((a, b) => {
      const fa = f(a), fb = f(b);
      return fa < fb ? -1 : fa > fb ? 1 : 0;
    }));
  },

  *cycle() {
    const cache = [...this];
    while (true) yield* cache;
  },

  *concat(...others) {
    yield* this;
    for (const other of others) yield* primaSet(other);
  },

  *mix(...others) {
    // Compose sets - treat multiple sets as one unified set (bag of sets)
    // Like composing web elements to form another, or combining sets into a single collection
    yield* this;
    for (const other of others) {
      yield* primaSet(other);
    }
  },

  shrink() {
    // Reduce to simpler type - unwrap complex types to their simplest form
    // BigInt → Number (when safe), nested arrays → single value, wrapped → unwrapped
    const arr = [...this];
    
    // Empty set → null
    if (arr.length === 0) return null;
    
    // Single element - try to simplify
    if (arr.length === 1) {
      let value = arr[0];
      
      // Nested arrays: [[[1]]] → 1, [[[]]] → null
      while (Array.isArray(value)) {
        if (value.length === 0) return null;
        if (value.length === 1) {
          value = value[0];
        } else {
          return value; // Multiple elements, return as-is
        }
      }
      
      // BigInt → Number (when safe, within Number.MAX_SAFE_INTEGER)
      if (typeof value === 'bigint') {
        const num = Number(value);
        if (num <= Number.MAX_SAFE_INTEGER && num >= Number.MIN_SAFE_INTEGER) {
          return num;
        }
        return value; // Too large, keep BigInt
      }
      
      // PrimaSet wrapper → unwrap
      if (value && typeof value === 'object' && value.valueOf && typeof value.valueOf === 'function') {
        const unwrapped = value.valueOf();
        if (unwrapped !== value) {
          return unwrapped;
        }
      }
      
      return value;
    }
    
    // Multiple elements - try to shrink each if possible
    return arr.map(x => {
      if (Array.isArray(x) && x.length === 1) {
        return x[0];
      }
      if (typeof x === 'bigint') {
        const num = Number(x);
        if (num <= Number.MAX_SAFE_INTEGER && num >= Number.MIN_SAFE_INTEGER) {
          return num;
        }
      }
      return x;
    });
  },

  groupBy(fn) {
    const map = new Map();
    for (const x of this) {
      const key = fn(x);
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(x);
    }
    return map;
  },

  toMap(keyFn, valFn = x => x) {
    const map = new Map();
    for (const x of this) map.set(keyFn(x), valFn(x));
    return map;
  },

  sample(n) {
    const arr = [...this], result = [];
    for (let i = 0; i < n && arr.length; i++) {
      const j = Math.floor(Math.random() * arr.length);
      result.push(arr[j]);
      arr[j] = arr[arr.length - 1]; arr.pop();
    }
    return primaSet(result);
  },

  count() { return this.reduce(c => c + 1, 0); },
  sum() { return this.reduce((a, b) => a + (+b || 0), 0); },
  mean() {
    const { sum, count } = this.reduce((acc, val) => ({ sum: acc.sum + val, count: acc.count + 1 }), { sum: 0, count: 0 })
    return count ? sum / count : 0
  },
  min() { return this.reduce((a, b) => Math.min(a, +b), Infinity); },
  max() { return this.reduce((a, b) => Math.max(a, +b), -Infinity); },

  toJSON() { return [...this]; },
};

export { operations, methods, generators };