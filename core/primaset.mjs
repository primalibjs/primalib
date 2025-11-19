// primaset.mjs v4 - Consistent naming, Array/String plugins, on() as transformer

import { ProxyError, handleError } from './errors.mjs'

// ============================================================================
// SlidingWindowCache (Class)
// ============================================================================

class SlidingWindowCache {
  constructor(maxSize = 1000, windowSize = 100) {
    this.maxSize = maxSize
    this.windowSize = windowSize
    this.cache = []
    this.start = 0
    this.events = []
  }

  get(index) {
    const actualIndex = index - this.start
    return actualIndex >= 0 && actualIndex < this.cache.length ? this.cache[actualIndex] : undefined
  }

  push(value) {
    this.cache.push(value)
    if (this.cache.length > this.maxSize) {
      const removeCount = this.cache.length - this.maxSize
      this.cache.splice(0, removeCount)
      this.start += removeCount
    }
    if (this.cache.length % this.windowSize === 0) {
      this.emit('window', { size: this.cache.length, start: this.start })
    }
  }

  on(event, handler) {
    if (!this.events[event]) this.events[event] = []
    this.events[event].push(handler)
  }

  emit(event, data) {
    this.events[event]?.forEach(handler => handler(data))
  }

  clear() {
    this.cache = []
    this.start = 0
  }

  get length() { return this.cache.length }
}

// ============================================================================
// generator (factory) - Transform any input to generator
// ============================================================================

const generator = src => {
  if (src == null) return function* () {}
  if (typeof src === 'function' && src.constructor?.name === 'GeneratorFunction') return src
  if (Array.isArray(src) || typeof src?.[Symbol.iterator] === 'function') {
    return function* () { yield* src }
  }
  return function* () { yield src }
}

// ============================================================================
// singleton (factory) - Detect singleton, cached
// ============================================================================

const singleton = (target) => {
  if (target._isSingleton !== undefined) return target._isSingleton
  if (target._sourceArray) {
    target._isSingleton = target._sourceArray.length === 1
    return target._isSingleton
  }
  const it = target[Symbol.iterator]()
  const first = it.next()
  if (first.done) {
    target._isSingleton = false
    target._isEmpty = true
    return false
  }
  const second = it.next()
  target._isSingleton = second.done
  return target._isSingleton
}

// ============================================================================
// Base Prototype
// ============================================================================

const baseProto = {
  [Symbol.iterator]: function () {
    const self = this
    if (self._sourceArray) return self._sourceArray[Symbol.iterator]()
    
    // For memo mode, materialize on first iteration and cache
    if (self._memoized) {
      // If already materialized, return cached array iterator
      if (self._memoized.length > 0) {
        return self._memoized[Symbol.iterator]()
      }
      
      // First iteration: materialize and cache
      if (!self._genIterator) {
        self._genIterator = self._gen()
      }
      while (true) {
        const { value, done } = self._genIterator.next()
        if (done) break
        self._memoized.push(value)
      }
      return self._memoized[Symbol.iterator]()
    }
    
    // Non-memo mode: use generator directly
    return self._gen()
  },

  valueOf() {
    if (this._sourceArray?.length === 1) return this._sourceArray[0]
    if (singleton(this)) {
      const it = this[Symbol.iterator]()
      const { value } = it.next()
      return value
    }
    return this.toArray()
  }
}

// ============================================================================
// accessHandler (factory) - Handle property access
// ============================================================================

const accessHandler = (target) => ({
  getIndex(index) {
    if (target._sourceArray) return target._sourceArray[index]
    
    // Initialize generator iterator if needed
    if (!target._genIterator) {
      target._genIterator = target._gen()
    }
    
    // Determine materialization strategy (use stored sizes if available)
    const memoSize = target._opts?._memoSize ?? 
                     (typeof target._opts?.memo === 'number' ? target._opts.memo : 
                      target._opts?.memo === true ? 1000 : 0)
    const cacheSize = target._opts?._cacheSize ?? 
                      (typeof target._opts?.cache === 'number' ? target._opts.cache : 
                       target._opts?.cache === true ? 1000 : 0)
    
    // Initialize memoized array if needed
    if (memoSize > 0 && !target._memoized) {
      target._memoized = []
    }
    
    // Initialize cache if needed
    if (cacheSize > 0 && !target._cache) {
      target._cache = new SlidingWindowCache(cacheSize, target._opts?.windowSize || 100)
      if (target._opts?.onWindow) target._cache.on('window', target._opts.onWindow)
    }
    
    // OPTIMIZATION: Eager materialization for memo mode
    // For primes and expensive sequences, pre-materialize first chunk on first access
    if (memoSize > 0 && target._memoized.length === 0) {
      // Eager materialization: pre-materialize first chunk (min 100, up to memoSize)
      // For larger indices, materialize more aggressively
      const eagerSize = index < 100 ? 100 : Math.min(memoSize, Math.max(index + 1, 500))
      while (target._memoized.length < eagerSize) {
        const { value, done } = target._genIterator.next()
        if (done) break
        target._memoized.push(value)
      }
      // Return directly from materialized array (bypasses further checks)
      if (index < target._memoized.length) {
        return target._memoized[index]
      }
    }
    
    // Check if already materialized (fast path)
    if (target._memoized && index < target._memoized.length) {
      return target._memoized[index]
    }
    
    // Check cache (for cache mode without memo)
    if (target._cache && !target._memoized) {
      const cached = target._cache.get(index)
      if (cached !== undefined) {
        return cached
      }
    }
    
    // Materialize up to index
    let currentIndex = target._memoized ? target._memoized.length : 0
    
    // For large indices (like primes), materialize in chunks to avoid blocking
    const chunkSize = index > 1000 ? 100 : index + 1
    const targetIndex = Math.min(index, currentIndex + chunkSize)
    
    while (currentIndex <= targetIndex) {
      const { value, done } = target._genIterator.next()
      if (done) break
      if (target._memoized) {
        target._memoized.push(value)
        // For memo mode, don't need cache (redundant)
        if (target._cache && !memoSize) {
          target._cache.push(value)
        }
      } else if (target._cache) {
        target._cache.push(value)
      }
      currentIndex++
    }
    
    // Return value if materialized
    if (target._memoized && index < target._memoized.length) {
      return target._memoized[index]
    }
    
    // Return from cache if available
    if (target._cache) {
      return target._cache.get(index)
    }
    
    return undefined
  },

  getProperty(prop) {
    if (target.hasOwnProperty(prop)) return target[prop]
    if (prop in baseProto) return baseProto[prop]
    return undefined
  }
})

// ============================================================================
// operationHandler (factory) - Handle operations, favor transformation
// ============================================================================

const operationHandler = (target) => ({
  applyUnary(fn, isSingleton) {
    return isSingleton ? fn(target.valueOf()) : primaSet(function* () {
      for (const x of target) yield fn(x)
    })
  },

  applyBinary(fn, other, isSingleton, otherIsSingleton) {
    const otherSet = primaSet(other)
    if (isSingleton && otherIsSingleton) return fn(target.valueOf(), otherSet.valueOf())
    if (isSingleton) {
      const val = target.valueOf()
      return primaSet(function* () { for (const x of otherSet) yield fn(val, x) })
    }
    if (otherIsSingleton) {
      const val = otherSet.valueOf()
      return primaSet(function* () { for (const x of target) yield fn(x, val) })
    }
    return primaSet(function* () {
      const it1 = target[Symbol.iterator](), it2 = otherSet[Symbol.iterator]()
      while (true) {
        const a = it1.next(), b = it2.next()
        if (a.done || b.done) break
        yield fn(a.value, b.value)
      }
    })
  },

  applyVariadic(fn, args) {
    if (args.length) return fn(target.valueOf(), ...args)   

    const arr = target.toArray()
    if (arr.length === 0) return fn()
    if (arr.length < 1000) return fn(...arr)    
    // Large sequence: avoid stack overflow by using reduce pattern
    // Note: This only works for reduction operations (sum, mean, min, max)
    // For other variadic functions, this is a best-effort fallback
    return arr.reduce((acc, val) => fn(acc, val), arr[0])
  }
})

// ============================================================================
// handler (factory) - Proxy handler, transformation over type enforcement
// ============================================================================

const handler = () => ({
  get(target, prop) {
    try {
      // Symbol.iterator - critical for iteration
      if (prop === Symbol.iterator) return baseProto[Symbol.iterator].bind(target)
      
      // Numeric index - OPTIMIZATION: Direct access bypass for materialized arrays
      if (typeof prop === 'string' && /^\d+$/.test(prop)) {
        const index = parseInt(prop, 10)
        // Fast path: Direct access to materialized array (bypasses Proxy overhead)
        if (target._memoized && index < target._memoized.length) {
          return target._memoized[index]
        }
        // Fast path: Direct access to source array
        if (target._sourceArray && index < target._sourceArray.length) {
          return target._sourceArray[index]
        }
        // Slow path: Lazy materialization
        return accessHandler(target).getIndex(index)
      }

      // Length
      if (prop === 'length') return target._sourceArray?.length

      // Direct property
      const direct = accessHandler(target).getProperty(prop)
      if (direct !== undefined) {
        // If it's a GeneratorFunction, bind and wrap
        if (typeof direct === 'function' && direct.constructor?.name === 'GeneratorFunction') {
          return function(...args) {
            const genFn = direct.bind(target)
            return primaSet(function* () { yield* genFn(...args) })
          }
        }
        // If it's a regular function that might return a GeneratorFunction, wrap it
        if (typeof direct === 'function') {
          return function(...args) {
            const result = direct.apply(target, args)
            // If result is a GeneratorFunction, bind it to target and execute
            if (typeof result === 'function' && result.constructor?.name === 'GeneratorFunction') {
              const genFn = result.bind(target)
              return primaSet(function* () { yield* genFn() })
            }
            return result
          }
        }
        return direct
      }

      // Array/String methods - transform, not enforce type
      const arrayMethods = new Set(['slice', 'splice', 'concat', 'join', 'indexOf', 'lastIndexOf', 'includes', 'every', 'some', 'find', 'findIndex', 'filter'])
      const stringMethods = new Set(['charAt', 'charCodeAt', 'substring', 'substr', 'split', 'trim', 'toLowerCase', 'toUpperCase'])
      if (arrayMethods.has(prop) || stringMethods.has(prop)) {
        const arr = target.toArray()
        const method = arr[prop]
        if (typeof method === 'function') return method.bind(arr)
        return method
      }

      // Operations
      const op = primaSet.ops[prop]
      if (!op) return undefined

      const arity = op.length
      const isVariadic = arity === 0 || (arity > 1 && /\[native code\]/.test(op.toString()))
      
      return (...args) => {
        const opHandler = operationHandler(target)
        const isSingleton = singleton(target)
        
        if (isVariadic && !args.length) return opHandler.applyVariadic(op, args)
        if (!args.length && (arity === 0 || arity === 1)) {
          return opHandler.applyUnary(op, isSingleton)
        }
        if (arity === 2 && args.length === 1) {
          const otherIsSingleton = singleton(primaSet(args[0]))
          return opHandler.applyBinary(op, args[0], isSingleton, otherIsSingleton)
        }
        return isSingleton ? op(target.valueOf(), ...args) : opHandler.applyUnary(x => op(x, ...args), false)
      }
    } catch (error) {
      throw handleError(new ProxyError(error.message, prop, target, { error }))
    }
  }
})

// ============================================================================
// primaSet (factory) - Returns PrimaSet proxy
// ============================================================================

const primaSet = (src, opts = {}) => {
  const gen = generator(src)
  const obj = Object.create(baseProto)
  
  obj._gen = gen
  obj._sourceArray = Array.isArray(src) ? src : null
  
  // For memo mode, create a single generator iterator that we'll reuse
  // This avoids recreating generators and recomputing values
  obj._genIterator = null  // Lazy initialization - only create when needed
  
  // Normalize options: support both {memo: true} and {memo: N}
  const memoSize = typeof opts.memo === 'number' ? opts.memo : 
                   opts.memo === true ? 1000 : 0
  const cacheSize = typeof opts.cache === 'number' ? opts.cache : 
                    opts.cache === true ? (opts.cacheSize || 1000) : 0
  
  // Initialize memoized array if memo is enabled
  if (memoSize > 0) {
    obj._memoized = []  // Initialize memoized array for fast access
    obj._cache = null  // Don't use cache when memoized (redundant)
  } else if (cacheSize > 0) {
    // Cache mode without memo
    obj._cache = new SlidingWindowCache(cacheSize, opts.windowSize || 100)
    if (opts.onWindow) obj._cache.on('window', opts.onWindow)
    obj._memoized = null
  } else {
    obj._cache = null
    obj._memoized = null
  }
  
  // Store normalized options
  obj._opts = {
    ...opts,
    memo: memoSize > 0 ? (memoSize === 1000 ? true : memoSize) : false,
    cache: cacheSize > 0 ? (cacheSize === 1000 ? true : cacheSize) : false
  }
  
  obj._it = null
  obj._isSingleton = undefined
  obj._isEmpty = undefined
  
  return new Proxy(obj, handler())
}

// ============================================================================
// freeFunction (factory) - Create free function from method
// ============================================================================

const freeFunction = (name) => (...args) => {
  if (args.length === 0) return (...moreArgs) => primaSet(...moreArgs)[name]()
 
  // Check if method supports currying (take, map, filter, etc.)
  // These methods accept (set, arg) or can be curried as (arg) => (set) => result
  const method = baseProto[name]
  if (method && method.length === 1) {
    // Method takes one arg - support currying: take(5) returns function
    const [firstArg, ...rest] = args
    if (rest.length === 0 && (typeof firstArg === 'number' || typeof firstArg === 'function')) {
      // Curried: return function that takes the set
      return (set) => primaSet(set)[name](firstArg)
    }
  }
  
  // Direct call: treat first arg as the set to operate on
  const [set, ...methodArgs] = args
  return primaSet(set)[name](...methodArgs)
}

// ============================================================================
// Plugin System - Functions as POJOs
// ============================================================================

primaSet.ops = {}
primaSet.listOps = () => Object.keys(primaSet.ops)

primaSet.plugin = function(functions) {
  if (typeof functions === 'function') {
    const name = functions.name || 'anonymous'
    const isGenerator = functions.constructor?.name === 'GeneratorFunction'
    const isMethod = isGenerator || /\bthis\b/.test(functions.toString())
    
    if (isMethod) {
      baseProto[name] = functions
      primaSet[name] = freeFunction(name)
    } else {
      primaSet.ops[name] = functions
      primaSet[name] = (...args) => {
        const [first, ...rest] = args
        if (first == null) return primaSet(null)
        if (rest.length && functions.length === 0) return functions(first, ...rest)
        return primaSet(first)[name](...rest)
      }
    }
    return primaSet
  }

  if (typeof functions === 'object' && functions !== null) {
    const names = Object.getOwnPropertyNames(functions)
    const symbols = Object.getOwnPropertySymbols(functions)
    const methodsToAdd = {}
    const opsToAdd = {}

    for (const key of [...names, ...symbols]) {
      const fn = functions[key]
      if (typeof fn === 'function') {
        const isGenerator = fn.constructor?.name === 'GeneratorFunction'
        const isMethod = isGenerator || /\bthis\b/.test(fn.toString())
        if (isMethod) methodsToAdd[key] = fn
        else opsToAdd[key] = fn
      }
    }

    Object.assign(primaSet.ops, opsToAdd)
    for (const [name, fn] of Object.entries(opsToAdd)) {
      primaSet[name] = (...args) => {
        const [first, ...rest] = args
        if (first == null) return primaSet(null)
        if (rest.length && fn.length === 0) return fn(first, ...rest)
        return primaSet(first)[name](...rest)
      }
    }

    Object.assign(baseProto, methodsToAdd)
    for (const name of Object.getOwnPropertyNames(methodsToAdd))
      primaSet[name] = freeFunction(name)
    for (const symbol of Object.getOwnPropertySymbols(methodsToAdd))
      primaSet[symbol] = freeFunction(symbol)

    return primaSet
  }

  throw new Error('plugin() expects function or object of functions')
}

// Load standard namespaces
primaSet.plugin(Math)
primaSet.plugin(Number)

// Plugin Array namespace with overloading
primaSet.plugin({
  // Overload Array methods that make sense for sets
  from: (...args) => primaSet(Array.from(...args)),
  isArray: Array.isArray,
  of: (...args) => primaSet(Array.of(...args))
})

// Plugin String namespace with overloading
primaSet.plugin({
  // Overload String methods that transform
  fromCharCode: (...args) => primaSet(String.fromCharCode(...args)),
  fromCodePoint: (...args) => primaSet(String.fromCodePoint(...args)),
  raw: (template, ...substitutions) => primaSet(String.raw(template, ...substitutions))
})

// Export pipe as part of primaSet
primaSet.pipe = (...fns) => {
  return (x) => {
    // If no argument and first function is a generator function, call it
    let startIdx = 0
    if (x === undefined && fns.length > 0) {
      const firstFn = fns[0]
      if (typeof firstFn === 'function') {
        x = firstFn()
        startIdx = 1 // Skip first function in reduce since we already called it
      }
    }
    const remainingFns = fns.slice(startIdx)
    const remainingLength = remainingFns.length
    return remainingFns.reduce((v, f, idx) => {
      // iif (if-then-else) pattern: shortCircuit is actually iif
      // - undefined: short-circuit (stop iteration)
      // - null: transform data and short-circuit
      // - function: transform and continue
      if (f?.shortCircuit || f?.iif) {
        const it = (v?.[Symbol.iterator] ? v : primaSet(v))[Symbol.iterator]()
        const result = []
        for (const x of it) {
          if (f.pred(x)) {
            const transformed = f.then(x)
            if (transformed === undefined) break  // Short-circuit: stop
            if (transformed === null) {
              result.push(x)  // Transform: use original value
              break  // Short-circuit after transform
            }
            result.push(transformed)  // Transform and continue
            if (f.else === undefined) break  // No else = short-circuit after then
          } else {
            if (f.else === undefined) {
              result.push(x)  // No else: pass through
            } else if (f.else === null) {
              break  // null else: short-circuit
            } else {
              const transformed = f.else(x)
              if (transformed === undefined) break  // Short-circuit
              if (transformed === null) {
                result.push(x)  // Transform: use original
                break
              }
              result.push(transformed)  // Transform and continue
            }
          }
        }
        return primaSet(result)
      }
      // Handle functions - operations, methods, or free functions
      if (typeof f === 'function') {
        // Check if this is a curried function call (function returned from partial application)
        // If f(v) returns a function, it's likely curried - call it with v
        let vSet = v
        if (v != null && typeof v === 'object' && (v[Symbol.iterator] || v.toArray)) {
          vSet = v // Already a primaSet or iterable
        } else if (v != null && typeof v !== 'object') {
          vSet = v // Number or primitive, pass as-is
        } else {
          vSet = primaSet(v) // Wrap null/undefined/other
        }
        
        // Call the function - curried functions like take(10) are already functions
        const result = f(vSet)
        
        // For variadic free functions (length === 0) like sum, mean, etc.
        // If called with a primaSet, always use the method instead
        const isLast = idx === remainingLength - 1
        const isVariadic = f.length === 0
        // For last variadic function on primaSet, always use method call
        if (isVariadic && vSet?.toArray && isLast && typeof vSet.sum === 'function') {
          return vSet.sum()
        }
        
        // Fallback: if result is wrong, try method call
        if (isLast && vSet?.toArray && isVariadic && typeof vSet.sum === 'function') {
          const arr = vSet.toArray()
          if (arr.length > 0) {
            const isEmpty = Array.isArray(result) && result.length === 0
            const isZero = result === 0
            const isNullPrimaSet = result?.toArray && result.toArray().length === 0
            if (isEmpty || isZero || isNullPrimaSet) {
              return vSet.sum()
            }
          }
        }
        return result
      }
      return f(v)
    }, x)
  }
}


import { operations, methods, generators } from './primaops.mjs'
// Register plugins synchronously - methods available immediately
// Store pipe before plugins (in case plugins overwrite it)
const pipeBackup = primaSet.pipe
primaSet.plugin(operations)
primaSet.plugin(methods)
primaSet.plugin(generators)
// Restore pipe if it was overwritten
if (primaSet.pipe !== pipeBackup) {
  primaSet.pipe = pipeBackup
}

// Export methods for direct access
export { primaSet, operations, methods, generators }
// Export pipe as standalone function
export const pipe = primaSet.pipe
// Export point structures (unified architecture)
export { point, complex, quaternion, octonion, vector } from './point.mjs'

// Export space (unified geometric and algebraic space)
export { space } from './space.mjs'
