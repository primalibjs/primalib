# Pipes: Deep Investigation

## Overview

Pipes in PrimaLib enable functional composition with support for:
- **Curried functions**: `take(10)` returns a function
- **Short-circuit operations**: Early termination based on predicates
- **Transformation over type imposition**: Adapt inputs rather than reject them
- **Branching**: Conditional transformations via `on()` and short-circuit
- **Method chaining**: Seamless integration with primaSet methods

## Core Pipe Implementation

```javascript
primaSet.pipe = (...fns) => {
  return (x) => {
    // Auto-call first function if no argument provided
    let startIdx = 0
    if (x === undefined && fns.length > 0) {
      const firstFn = fns[0]
      if (typeof firstFn === 'function') {
        x = firstFn()
        startIdx = 1
      }
    }
    
    const remainingFns = fns.slice(startIdx)
    return remainingFns.reduce((v, f, idx) => {
      // Handle short-circuit operations
      if (f?.shortCircuit) {
        // ... short-circuit logic
      }
      // Handle regular functions
      return f(v)
    }, x)
  }
}
```

## Curried Functions

### The `take()` Pattern

`take()` demonstrates the curried function pattern:

```javascript
export const take = (setOrN, n) => {
  if (n === undefined) {
    // Curried: take(n) returns function
    return (set) => primaSet(set).take(setOrN)
  }
  // Direct: take(set, n)
  return primaSet(setOrN).take(n)
}
```

**Usage in pipes:**

```javascript
// Both styles work:
pipe(N, take(10), sq, sum)()        // ✅ Curried: take(10) returns function
pipe(N, (n) => n.take(10), sq, sum)() // ✅ Method chaining
```

**Why both?** Flexibility. Curried functions enable point-free style:

```javascript
// Point-free (no intermediate variables)
const sumOfSquares = pipe(N, take(10), sq, sum)

// vs explicit
const sumOfSquares = pipe(N, (n) => n.take(10), sq, sum)
```

## iif (if-then-else) / Short-Circuit Operations

`shortCircuit` is actually **`iif`** (if-then-else) with special return value semantics:

```javascript
const iif = (pred, then, else_) => {
  const fn = (x) => pred(x) ? then(x) : (else_ ? else_(x) : x)
  fn.iif = true
  fn.shortCircuit = true  // Alias for compatibility
  fn.pred = pred
  fn.then = then
  fn.else = else_
  return fn
}
```

### Return Value Semantics

- **`undefined`**: Short-circuit (stop iteration immediately)
- **`null`**: Transform data and short-circuit (use original value, then stop)
- **Function/Value**: Transform and continue

**In pipe:**

```javascript
pipe(
  N,
  take(20),
  iif(
    x => x > 10,  // predicate
    sq,           // then: square if > 10, continue
    x => x        // else: pass through, continue
  ),
  sum
)()
```

**Short-circuit with `undefined`:**

```javascript
pipe(
  primes,
  iif(
    x => x > 100,  // predicate
    x => x,        // then: yield and continue
    undefined      // else: undefined = stop iteration
  ),
  take(5)
)()
// Stops after first prime > 100
```

**Transform and short-circuit with `null`:**

```javascript
pipe(
  N(20),
  iif(
    x => x > 10,   // predicate
    x => null,     // then: transform (use original) and short-circuit
    x => x         // else: pass through
  ),
  sum
)()
// Takes values > 10, uses original value, then stops
```

**Helpers:**

```javascript
const when = (pred, fn) => iif(pred, fn)
const unless = (pred, fn) => iif(x => !pred(x), fn)

pipe(N(10), when(x => x % 2 === 0, sq), sum)()
// Squares evens, passes through odds
```

## `on()`: Observation and Event Transformation

`on()` is a **transformer** that observes transformations and events while preserving the stream:

```javascript
*on(f) { 
  for (const x of this) { 
    f(x);  // Observe/event: side effect
    yield x  // Transform: yield original value unchanged
  } 
}
```

**Key insight**: `on()` doesn't change values, it adds **observability** and **event handling**:

```javascript
// Debugging pipeline - observe transformations
pipe(
  N(10),
  on(x => console.log('Before sq:', x)),  // Observe: before transformation
  sq,
  on(x => console.log('After sq:', x)),   // Observe: after transformation
  filter(x => x > 10),
  sum
)()

// Event handling: multiple observation branches
pipe(
  primes,
  take(10),
  on(x => logger.info(x)),      // Branch 1: log event
  on(x => metrics.record(x)),   // Branch 2: metrics event
  on(x => cache.set(x)),        // Branch 3: cache event
  sq,                           // Continue transformation
  sum
)()
```

**Transformation principle**: `on()` transforms the **observability** and **event handling** of the stream, not the values themselves. This enables:
- **Debugging**: Insert `on(console.log)` anywhere to observe
- **Metrics**: Track values/events without breaking the pipeline
- **Event handling**: Multiple observation branches for logging, metrics, caching
- **Branching**: Observe transformations at different points

## Transformation Over Type Imposition

### Principle

**Instead of rejecting incompatible types, transform them to compatible forms.**

### Examples

**1. Generator Factory**

```javascript
const generator = src => {
  if (src == null) return function* () {}
  if (typeof src === 'function' && src.constructor?.name === 'GeneratorFunction') 
    return src
  if (Array.isArray(src) || typeof src?.[Symbol.iterator] === 'function') {
    return function* () { yield* src }
  }
  return function* () { yield src }  // Transform scalar → generator
}
```

**Not**: `if (typeof src !== 'function') throw Error('Must be function')`

**2. Array Methods**

```javascript
// Transform array methods to work on primaSet
const arrayMethods = new Set(['slice', 'splice', 'concat', ...])
if (arrayMethods.has(prop)) {
  const arr = target.toArray()  // Transform primaSet → array
  const method = arr[prop]
  return method.bind(arr)
}
```

**Not**: `if (!Array.isArray(target)) throw Error('Must be array')`

**3. Pipe Input Handling**

```javascript
let vSet = v
if (v != null && typeof v === 'object' && (v[Symbol.iterator] || v.toArray)) {
  vSet = v  // Already iterable
} else if (v != null && typeof v !== 'object') {
  vSet = v  // Primitive, pass as-is
} else {
  vSet = primaSet(v)  // Transform null/undefined → primaSet
}
```

**Not**: `if (!isIterable(v)) throw Error('Must be iterable')`

### Benefits

1. **Flexibility**: Accept diverse inputs, transform internally
2. **Composability**: Functions work together without type checks
3. **User-friendly**: No need to wrap/unwrap types manually
4. **Extensibility**: New types can be added by adding transformations

## Branching Patterns

### 1. Conditional Transformation

```javascript
pipe(
  N(10),
  shortCircuit(
    x => x > 5,
    sq,      // Branch A: square if > 5
    x => x   // Branch B: pass through
  ),
  sum
)()
```

### 2. Early Termination

```javascript
pipe(
  primes,
  shortCircuit(
    x => x > 100,
    x => x,
    undefined  // Break on else
  ),
  take(5)
)()
```

### 3. Multiple Branches with `on()`

```javascript
pipe(
  data,
  on(x => saveToDB(x)),      // Branch 1: persistence
  on(x => sendToAPI(x)),      // Branch 2: API
  transform,                  // Continue pipeline
  on(x => logResult(x))       // Branch 3: logging
)()
```

### 4. Route-Based Branching

```javascript
const route = (routes) => {
  const fn = (x) => {
    const match = Object.entries(routes).find(([pred]) => {
      const p = typeof pred === 'function' ? pred : (v => v === pred)
      return p(x)
    })
    return match ? match[1](x) : x
  }
  return fn
}

pipe(
  N(10),
  route({
    [x => x % 2 === 0]: sq,      // Branch A: evens → square
    [x => x % 3 === 0]: x => x*3, // Branch B: multiples of 3 → triple
    default: x => x               // Branch C: default → pass through
  }),
  sum
)()
```

## Advanced Patterns

### 1. Lazy Evaluation

```javascript
// Pipe creates lazy pipeline
const pipeline = pipe(N, take(10), sq, sum)

// Execution is deferred until called
const result = pipeline()  // Now executes
```

### 2. Partial Application

```javascript
// Create reusable pipeline
const sumOfSquares = pipe(take(10), sq, sum)

// Apply to different sources
sumOfSquares(N(20))()   // First 10 of N(20)
sumOfSquares(primes)()  // First 10 primes
```

### 3. Composition

```javascript
const square = pipe(sq)
const sumSquares = pipe(sq, sum)
const takeAndSquare = pipe(take(10), sq)

// Compose pipelines
pipe(
  N,
  takeAndSquare,
  sum
)()
```

### 4. Error Handling

```javascript
pipe(
  data,
  on(x => {
    try {
      validate(x)
    } catch (e) {
      logger.error(e)
      throw e  // Propagate or handle
    }
  }),
  transform
)()
```

## Method Chaining vs Pipe

**Both work seamlessly:**

```javascript
// Method chaining
N(10).take(10).sq().sum()

// Pipe
pipe(N, take(10), sq, sum)()

// Mixed
pipe(N, take(10))().sq().sum()
```

**Choose based on style:**
- **Method chaining**: OOP, fluent interface
- **Pipe**: Functional, point-free
- **Mixed**: Flexibility when needed

## Performance Considerations

1. **Lazy evaluation**: Pipelines don't execute until called
2. **Short-circuit**: Early termination saves computation
3. **Generator-based**: Memory efficient for infinite sequences
4. **Caching**: Optional memoization for repeated access

## Best Practices

1. **Use curried functions** for point-free style: `take(10)` not `(n) => n.take(10)`
2. **Use `on()` for side effects**, not transformations
3. **Use short-circuit for conditional logic**, not `filter` + `take`
4. **Transform, don't reject**: Accept diverse inputs, transform internally
5. **Compose small pipelines** into larger ones for reusability

## Examples

### Sum of Squares

```javascript
pipe(N, take(10), sq, sum)()
// → 385 (1² + 2² + ... + 10²)
```

### Conditional Processing

```javascript
pipe(
  N(20),
  when(x => x % 2 === 0, sq),
  unless(x => x > 100, x => x * 2),
  sum
)()
```

### Debugging Pipeline

```javascript
pipe(
  primes,
  take(10),
  on(x => console.log('Prime:', x)),
  sq,
  on(x => console.log('Squared:', x)),
  filter(x => x > 50),
  sum
)()
```

### Early Termination

```javascript
pipe(
  primes,
  shortCircuit(
    x => x > 1000,
    x => x,
    undefined  // Stop after first > 1000
  ),
  take(1)
)()
// → [1009] (first prime > 1000)
```

## Conclusion

Pipes in PrimaLib provide:
- **Flexibility**: Multiple calling styles (curried, method, mixed)
- **Power**: Short-circuit, branching, transformation
- **Simplicity**: Transform over type imposition
- **Composability**: Build complex pipelines from simple parts

The key insight: **Transform inputs to compatible forms, don't reject incompatible ones**. This enables seamless composition and user-friendly APIs.


