# PrimaLib Naming Conventions

## Principle: Transformation Over Type Enforcement

PrimaLib favors **transformation** over strict type enforcement. We transform data structures rather than enforcing types.

## Naming Pattern

### Lowercase = Factory Functions
- `generator(src)` - Transform input to generator function
- `singleton(target)` - Detect singleton (cached)
- `handler()` - Create proxy handler
- `accessHandler(target)` - Create access handler
- `operationHandler(target)` - Create operation handler
- `freeFunction(name)` - Create free function

### CamelCase = Classes
- `SlidingWindowCache` - Cache class
- `Handler` (if needed) - Handler class
- `Generator` (if needed) - Generator class

### Factory Returns Proxy
- `primaset(src, opts)` - Factory function returning PrimaSet proxy
- Not `PrimaSetConstructor` - just `primaset` (the factory)

## Examples

### Generator Factory
```javascript
// Transform any input to generator
const gen = generator([1, 2, 3])  // → generator function
const gen2 = generator(42)        // → generator yielding 42
const gen3 = generator(null)      // → empty generator
```

### Singleton Detection
```javascript
// Detect singleton, cached
const isSingle = singleton(primaSet(42))  // → true
const isMulti = singleton(primaSet([1,2,3]))  // → false
```

### Handler Factory
```javascript
// Create proxy handler (transformation, not type enforcement)
const h = handler()  // → proxy handler object
```

### Access Handler Factory
```javascript
// Handle property access
const acc = accessHandler(target)
acc.getIndex(5)      // → get element at index 5
acc.getProperty('map')  // → get 'map' property
```

### Operation Handler Factory
```javascript
// Handle operations (favor transformation)
const op = operationHandler(target)
op.applyUnary(sq, true)  // → apply sq to singleton
op.applyBinary(add, other, false, true)  // → binary op
```

### Free Function Factory
```javascript
// Create free function from method
const sqFree = freeFunction('sq')
sqFree([1,2,3])  // → [1,4,9]
```

## Array/String Namespace Plugins

### Array Plugin
```javascript
primaSet.plugin({
  from: (...args) => primaSet(Array.from(...args)),
  isArray: Array.isArray,
  of: (...args) => primaSet(Array.of(...args))
})

// Usage
primaSet.from([1,2,3])  // → PrimaSet
primaSet.isArray([1,2,3])  // → true
primaSet.of(1,2,3)  // → PrimaSet([1,2,3])
```

### String Plugin
```javascript
primaSet.plugin({
  fromCharCode: (...args) => primaSet(String.fromCharCode(...args)),
  fromCodePoint: (...args) => primaSet(String.fromCodePoint(...args)),
  raw: (template, ...substitutions) => primaSet(String.raw(template, ...substitutions))
})

// Usage
primaSet.fromCharCode(65, 66, 67)  // → PrimaSet(['A', 'B', 'C'])
```

## on() as Transformer

`on()` is a **transformer** - it applies a side effect and yields the value:

```javascript
// on() preserves the stream while adding side effects
primaSet([1,2,3])
  .on(x => console.log('Processing:', x))  // Side effect
  .map(x => x * 2)  // Transformation continues
  .toArray()
// → [2, 4, 6]
// Console: Processing: 1, Processing: 2, Processing: 3

// Can be used in pipe
primaSet.pipe(
  on(x => console.log(x)),
  map(x => x * 2),
  filter(x => x > 4)
)([1,2,3,4,5])
```

## Transformation Over Type Enforcement

Instead of:
```javascript
// Type enforcement (bad)
if (typeof x !== 'number') throw new Error('Must be number')
```

We do:
```javascript
// Transformation (good)
const num = Number(x) || 0  // Transform to number
```

### Examples in Code

```javascript
// Transform input to generator (not enforce type)
const generator = src => {
  if (src == null) return function* () {}
  if (typeof src === 'function' && src.constructor?.name === 'GeneratorFunction') return src
  if (Array.isArray(src) || typeof src?.[Symbol.iterator] === 'function') {
    return function* () { yield* src }
  }
  return function* () { yield src }  // Transform scalar to generator
}

// Transform array methods (not enforce array type)
if (arrayMethods.has(prop)) {
  const arr = target.toArray()  // Transform to array
  const method = arr[prop]
  return typeof method === 'function' ? method.bind(arr) : method
}
```

## Benefits

1. **Flexibility** - Works with any input type
2. **Composability** - Transformations compose naturally
3. **Expressiveness** - Code reads like transformations
4. **No Type Errors** - Transform, don't reject
5. **Consistent Naming** - Lowercase = factory, CamelCase = class

## Migration Guide

### Old Names → New Names
- `normalizeToGenerator` → `generator`
- `createHandler` → `handler`
- `createFreeFunction` → `freeFunction`
- `createAccessHandler` → `accessHandler`
- `createOperationHandler` → `operationHandler`
- `detectSingleton` → `singleton`
- `PrimaSetConstructor` → `primaset` (the factory itself)

### Usage
```javascript
// Old
const gen = normalizeToGenerator([1,2,3])
const h = createHandler()

// New
const gen = generator([1,2,3])
const h = handler()
```

