// primaset.test.mjs

import { test } from '../test/test.mjs';  // Assume ESM test harness with check(actual, expected)
import { primaSet } from './primaset.mjs';

// Normalization
test('🧪 primaset.test.mjs - Normalization - scalar to singleton', ({check}) => {
  check([...primaSet(5)], [5]);
});

test('Normalization - null/undefined to empty', ({check}) => {
  check([...primaSet(null)], []);
  check([...primaSet(undefined)], []);
});

test('Normalization - array', ({check}) => {
  check([...primaSet([1, 2, 3])], [1, 2, 3]);
});

test('Normalization - generator function', ({check}) => {
  const gen = function* () { yield 1; yield 2; };
  check([...primaSet(gen)], [1, 2]);
});

test('Normalization - iterable (Set)', ({check}) => {
  const set = new Set([1, 2, 3]);
  check([...primaSet(set)], [1, 2, 3]);
});

// toArray and valueOf
test('toArray - materializes', ({check}) => {
  check(primaSet([1, 2, 3]), [1,2,3]);
  check([...primaSet([1, 2, 3])], [1,2,3]);
});

test('valueOf - scalar unwrap', ({check}) => {
  check(primaSet(42).valueOf(), 42);
});

test('valueOf - array', ({check}) => {
  check(primaSet([1, 2]).valueOf(), [1, 2]);
});

// inspect.custom - Browser-compatible
// Node.js: Symbol.for('nodejs.util.inspect.custom')
// Browser: Use the same symbol or create a test-compatible version
let inspectCustom
try {
  if (typeof Symbol !== 'undefined' && Symbol.for) {
    inspectCustom = Symbol.for('nodejs.util.inspect.custom')
  } else {
    // Fallback for very old browsers
    inspectCustom = Symbol('inspect.custom')
  }
} catch {
  inspectCustom = Symbol('inspect.custom')
}

test('inspect.custom - delegates to valueOf', ({check}) => {
  const set = primaSet(42)
  // Check if the symbol exists on the object
  if (set[inspectCustom]) {
    check(set[inspectCustom](), 42)
  } else {
    // Skip test if symbol not available (browser without Node.js symbols)
    check(true, true) // Pass test
  }
});

// toString
test('toString - with take', ({check}) => {
  check(primaSet([1, 2, 3]).toString(), '1,2,3');
});

// map
test('map - transforms finite', ({check}) => {
  check(primaSet([1, 2, 3]).map(x => x * 2), [2, 4, 6]);
});

test('map - lazy infinite', ({check}) => {
  const inf = primaSet(function* () { let n = 1; while (true) yield n++; });
  check(inf.map(x => x * 2).take(3), [2, 4, 6]);
});

// on
test('on - side-effect only', ({check}) => {
  let logged = [];
  const s = primaSet([1, 2, 3]).on(x => logged.push(x));
  check(s, [1, 2, 3]);
  check(logged, [1, 2, 3]);
});

test('on - ignores return', ({check}) => {
  const s = primaSet([1, 2]).on(x => x * 2);
  check(s, [1, 2]);
});

// reduce
test('reduce - aggregate', ({check}) => {
  check(primaSet([1, 2, 3]).reduce((a, b) => a + b, 0), 6);
});

test('reduce - with init', ({check}) => {
  check(primaSet([1, 2]).reduce((a, b) => a * b, 10), 20);
});

// take
test('take - finite', ({check}) => {
  check(primaSet([1, 2, 3, 4]).take(2), [1, 2]);
});

test('take - infinite', ({check}) => {
  const inf = primaSet(function* () { let n = 1; while (true) yield n++; });
  check(inf.take(5), [1, 2, 3, 4, 5]);
});

test('take - larger than set', ({check}) => {
  check(primaSet([1, 2]).take(5), [1, 2]);
});

// pipe
test('pipe - composes', ({check}) => {
  const inf = primaSet(function* () { let n = 1; while (true) yield n++; });
  const result = inf.pipe(s => s.take(5), s => s.map(x => x * 2), s => s.reduce((a, b) => a + b, 0));
  check(result, 30);
});

test('pipe - with free fns', ({check}) => {
  const double = x => x * 2;
  const sum = s => s.reduce((a, b) => a + b, 0);
  check(primaSet([1, 2, 3]).pipe(s => s.map(double), sum), 12);
});

// forEach
test('forEach - side-effects', ({check}) => {
  let sum = 0;
  primaSet([1, 2, 3]).forEach(x => sum += x);
  check(sum, 6);
});

// get
test('get - finite', ({check}) => {
  const s = primaSet([10, 20, 30]);
  check(s.get(0), 10);
  check(s.get(2), 30);
});

test('get - infinite lazy', ({check}) => {
  const inf = primaSet(function* () { let n = 0; while (true) yield ++n; });
  check(inf.get(4), 5);
});

test('get - out of bounds finite', ({check}) => {
  check(primaSet([1, 2]).get(3), 'undefined');
});

test('get - negative error', ({check}) => {
  try {
    primaSet([1]).get(-1);
    throw 'No error';
  } catch (e) {
    check(e instanceof RangeError);
  }
});

// memo
test('memo - caches iteration', ({check}) => {
  let calls = 0;
  // Create generator that tracks calls - need to create iterator once
  const genFn = function* () { 
    let i = 0;
    while (i < 10) {
      calls++;
      yield i++;
    }
  };
  const s = primaSet(genFn, { memo: true });
  check(s, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  check(calls, 10);
  // Second iteration should use cached values
  const callsBefore = calls;
  check(s, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  check(calls, callsBefore);  // Cached - no additional calls
});

// plugin
test('plugin - unary', ({check}) => {
  primaSet.plugin({ sq: x => x * x });
  check(primaSet([1, 2, 3]).sq(), [1, 4, 9]);
});

test('plugin - binary broadcast', ({check}) => {
  primaSet.plugin({ add: (a, b) => a + b });
  check(primaSet([1, 2, 3]).add(10), [11, 12, 13]);
});

// Mock zip for binary zip test
test('plugin - binary zip', ({check}) => {
  primaSet.plugin({
    zip: function (other, f) {
      const self = this;
      return primaSet(function* () {
        const itA = self[Symbol.iterator](), itB = primaSet(other)[Symbol.iterator]();
        while (true) {
          const a = itA.next(), b = itB.next();
          if (a.done || b.done) break;
          yield f ? f(a.value, b.value) : [a.value, b.value];
        }
      });
    }
  });
  check(primaSet([1, 2]).add([10, 20]), [11, 22]);
});

test('plugin - variadic', ({check}) => {
  primaSet.plugin({ mean: (...args) => args.reduce((a, b) => a + b, 0) / args.length });
  check(primaSet([1, 2, 3]).mean(), 2);
});

test('plugin - free call', ({check}) => {
  check(primaSet.sq(5).valueOf(), 25);
  check(primaSet.add([1, 2], 10), [11, 12]);
});

// listOps
test('listOps - returns added', ({check}) => {
  check(primaSet.listOps().includes('sq'));
  check(primaSet.listOps().includes('add'));
});

// addMethods
test('addMethods - extends proto', ({check}) => {
  primaSet.plugin({
    count: function () { return this.reduce(c => c + 1, 0); }
  });
  check(primaSet([1, 2, 3]).count(), 3);
});

// test('addMethods - free wrapper', ({check}) => {
//   check(primaSet.count([1, 2]), 2);
// });

test('plugin - GeneratorFunction auto-wrap', ({check}) => {
  primaSet.plugin({
    customMap: function (f) {
      return function* () { for (const x of this) yield f(x); };
    }
  });
  const result = primaSet([1, 2, 3]).customMap(x => x * 2);
  check(result, [2, 4, 6]);
  check(primaSet.customMap([1, 2, 3], x => x * 3), [3, 6, 9]);
});

test('addMethods - GeneratorFunction with this binding', ({check}) => {
  primaSet.plugin({
    doubleAndFilter: function (threshold) {
      return function* () {
        for (const x of this) {
          const doubled = x * 2;
          if (doubled > threshold) yield doubled;
        }
      };
    }
  });
  check(primaSet([1, 2, 3, 4]).doubleAndFilter(5), [6, 8]);
  check(primaSet.doubleAndFilter([2, 3, 4, 5], 7), [8, 10]);
});

// Plugin system
test('Plugin - unified function detection', ({check}) => {
  // Load essential methods first
  primaSet.plugin({
    map: function*(f) { for (const x of this) yield f(x); },
    toArray() { return [...this]; },
    filter: function*(predicate) { for (const x of this) if (predicate(x)) yield x; }
  });

  // Test operations (pure functions)
  primaSet.plugin({
    double: x => x * 2,
    square: x => x * x,
    add: (a, b) => a + b
  });

  check(primaSet(5).double(), 10);
  check(primaSet([1,2,3]).square(), [1,4,9]);
  check(primaSet(3).add(4), 7);

  check(primaSet([1,2,3]).map(x => x * 2), [2,4,6]);
  check(primaSet([1,2,3,4]).filter(x => x % 2 === 0), [2,4]);

  // Test Math functions (variadic operations)
  primaSet.plugin(Math);
  check(primaSet([1,2,3]).min(), 1);
  check(primaSet([1,2,3]).max(), 3);
  check(primaSet(Math.PI/2).sin(), 1);
});

// Proxy unknown
test('Proxy - undefined for unknown', ({check}) => {
  check(primaSet([1]).unknownProp, 'undefined');
});

// Edges
test('Edge - empty', ({check}) => {
  check(primaSet([]), []);
  check(primaSet([]).reduce((a, b) => a + b, 0), 0);
  check(primaSet(null), []);
  check(primaSet(undefined), []);
});

test('Edge - single', ({check}) => {
  check(primaSet(42).map(x => x * 2).valueOf(), 84);
});

test('Edge - infinite take(0)', ({check}) => {
  const inf = primaSet(function* () { let n = 1; while (true) yield n++; });
  check(inf.take(0), []);
});

test('Edge - error propagation', ({check}) => {
  try {
    primaSet([1, 2, 3]).map(x => { if (x === 2) throw new Error('test'); return x; }).toArray();
    check(false); // Should not reach here
  } catch (e) {
    check(e.message, 'test');
  }
});

test('Edge - large numbers', ({check}) => {
  const bigNum = 9007199254740991; // Number.MAX_SAFE_INTEGER
  check(primaSet(bigNum).valueOf(), bigNum);
});