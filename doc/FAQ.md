# PrimaLib FAQ

> **"Frequently asked questions about PrimaLib - philosophy, design decisions, and common questions."**

## 🎯 **Philosophy & Design**

### Q: Why a custom test framework instead of Jest/Mocha/Vitest?

**A**: PrimaLib uses a custom test framework (`test.mjs`) for several reasons:

1. **Zero Dependencies**: No external testing libraries required
2. **PrimaSet Awareness**: Automatically materializes lazy sets in assertions
3. **Simplicity**: Minimal API (`test()`, `check()`) - easy to understand
4. **Performance Tracking**: Built-in slow test detection
5. **Coverage Tracking**: Automatic test coverage reporting
6. **Browser Compatible**: Works in both Node.js and browsers without configuration

**See**: [PRIMATEST.md](./PRIMATEST.md) - Testing philosophy

---

### Q: Why lazy by default?

**A**: Lazy evaluation enables:

1. **Infinite Sequences**: Work with infinite sequences without memory issues
2. **Memory Efficiency**: Only compute what's needed
3. **Composability**: Operations compose naturally
4. **Performance**: Avoid unnecessary computation

PrimaLib treats infinite sequences (primes, naturals) as naturally as finite arrays.

**See**: [PRIMASET.md](./PRIMASET.md) - Lazy evaluation

---

### Q: Why "everything is a set"?

**A**: This unified abstraction provides:

1. **Consistency**: One API for all data types
2. **Flexibility**: Works with numbers, arrays, infinite streams, objects, trees, DOM
3. **Composability**: Operations work everywhere
4. **Simplicity**: No special cases, no type checking

**See**: [PRIMASET.md](./PRIMASET.md) - Philosophy

---

### Q: Why not use TypeScript directly?

**A**: PrimaLib is written in JavaScript with TypeScript definitions:

1. **Flexibility**: JavaScript allows dynamic patterns PrimaLib uses
2. **Type Definitions**: `primalib.d.ts` provides type safety
3. **Zero Build Step**: Works everywhere without compilation
4. **Future**: TypeScript/AssemblyScript ports are planned

**See**: [TYPES.md](./TYPES.md) - Type system

---

### Q: How does PrimaLib compare to other math libraries?

**A**: PrimaLib is unique in several ways:

1. **Lazy Infinite Sequences**: Handle infinite sequences as naturally as arrays
2. **Unified Abstraction**: Everything is a set - one API for all
3. **Zero Dependencies**: Pure JavaScript, no external dependencies
4. **Composable**: Operations compose naturally
5. **Extensible**: Plugin system for custom operations

**Comparison**:
- **Lodash/Ramda**: Focus on array/object operations, not infinite sequences
- **Math.js**: Traditional math operations, not lazy evaluation
- **NumPy (Python)**: Array-based, not lazy
- **Haskell**: Lazy but different paradigm

**See**: [PRIMALIB.md](./PRIMALIB.md) - Complete overview

---

## 🔧 **Usage Questions**

### Q: When should I use `memo: true` vs `cache: true`?

**A**: 

- **`memo: true`**: Use when you need fast random access to computed values
  - Materializes entire sequence for array-like access
  - Best for: Frequently accessed sequences, random access patterns
  - Memory: O(n) for n elements

- **`cache: true`**: Use for large sequences with sliding window
  - Keeps last N values in cache
  - Best for: Large sequences, sequential access
  - Memory: O(cacheSize)

**Example**:
```javascript
// Memo: Fast random access
const memo = primaSet(primes, { memo: true })
memo[100]  // → Fast cached access

// Cache: Efficient for large sequences
const cached = primaSet(N(), { cache: true, cacheSize: 1000 })
```

**See**: [PRIMASET.md](./PRIMASET.md) - Caching options, [PERFORMANCE.md](./PERFORMANCE.md) - Performance guide

---

### Q: How do I handle infinite sequences safely?

**A**: Always use `.take()` to limit infinite sequences:

```javascript
// ❌ Don't do this - hangs!
N().toArray()
primes.toArray()

// ✅ Do this - limits size
N().take(100).toArray()
primes.take(100).toArray()

// ✅ Or use get() for single elements
primes.get(99)  // → 100th prime
```

**See**: [PRIMASET.md](./PRIMASET.md) - Infinite sequences, [ERRORS.md](./ERRORS.md) - Common errors

---

### Q: What's the difference between method chaining and free functions?

**A**: They're equivalent - use what feels natural:

```javascript
// Method chaining (OO style)
N(10).sq().sum()  // → 385

// Free functions (functional style)
sum(sq(N(10)))    // → 385

// Pipeline (composition style)
pipe(N, take(10), sq, sum)()  // → 385
```

All three produce the same result. Choose based on your preference or codebase style.

**See**: [PRIMASET.md](./PRIMASET.md) - Calling styles, [PATTERNS.md](./PATTERNS.md) - Patterns

---

### Q: How do I add my own operations?

**A**: Use the plugin system:

```javascript
import { primaSet } from 'primalib'

primaSet.plugin({
  cube: x => x * x * x
})

// Now available everywhere!
primaSet([1,2,3]).cube()  // → [1, 8, 27]
cube([1,2,3])             // → [1, 8, 27] (free function)
```

**See**: [PRIMASET.md](./PRIMASET.md) - Plugin system, [CONTRIBUTING.md](./CONTRIBUTING.md) - Contributing

---

### Q: Can I use PrimaLib in browsers?

**A**: Yes! PrimaLib works in both Node.js and browsers:

```html
<script type="module">
  import { N, sq, sum } from './primalib.mjs'
  console.log(sum(sq(N(10))))  // → 385
</script>
```

For production, use the minified build:
```html
<script type="module" src="./dist/primalib.min.mjs"></script>
```

**See**: [PRIMAWEB.md](./PRIMAWEB.md) - Web integration

---

### Q: How do I handle errors?

**A**: PrimaLib provides clear error messages and error types:

```javascript
try {
  vector(1, 2).cross(vector(3, 4))  // Error: needs 3D
} catch (error) {
  if (error instanceof DimensionError) {
    console.error('Dimension error:', error.message)
    console.error('Expected:', error.expected)
  }
}
```

**See**: [ERRORS.md](./ERRORS.md) - Error handling guide

---

## 🚀 **Performance Questions**

### Q: Is PrimaLib fast?

**A**: PrimaLib is optimized for:

1. **Lazy Evaluation**: Only computes what's needed
2. **Memory Efficiency**: O(1) memory for infinite sequences
3. **Caching**: Memo and cache options for performance
4. **Direct Access**: Array-backed sets for fast access

For performance-critical code, use:
- `memo: true` for random access
- Direct array operations for small datasets
- Lazy evaluation for large/infinite sequences

**See**: [PERFORMANCE.md](./PERFORMANCE.md) - Performance guide

---

### Q: When should I materialize vs keep lazy?

**A**: 

- **Keep Lazy**: When processing large/infinite sequences
  ```javascript
  N().filter(x => x % 2 === 0).take(100)  // Lazy
  ```

- **Materialize**: When you need array operations or random access
  ```javascript
  N(100).toArray()  // Materialize for array methods
  ```

**See**: [PRIMASET.md](./PRIMASET.md) - Materialization, [PERFORMANCE.md](./PERFORMANCE.md) - Performance

---

### Q: How do I optimize prime operations?

**A**: 

- **Use `firstDivisor`** for single number checks
- **Use `geometricSieve`** for batch operations on large numbers
- **Use memoization** for frequently accessed primes
- **Use `.take()`** to limit sequence size

**See**: [PRIMANUM.md](./PRIMANUM.md) - Prime operations, [PERFORMANCE.md](./PERFORMANCE.md) - Performance

---

## 🔗 **Integration Questions**

### Q: Can I use PrimaLib with React/Vue/Svelte?

**A**: Yes! PrimaLib is framework-agnostic:

```javascript
// React example
import { useState, useEffect } from 'react'
import { N, sq, sum } from 'primalib'

function Component() {
  const [result, setResult] = useState(null)
  useEffect(() => {
    setResult(sum(sq(N(10))))
  }, [])
  return <div>{result}</div>
}
```

**See**: [PATTERNS.md](./PATTERNS.md) - Integration patterns

---

### Q: Can I use PrimaLib in Node.js servers?

**A**: Yes! PrimaLib works in Node.js:

```javascript
// Express example
import express from 'express'
import { primes } from 'primalib'

const app = express()
app.get('/primes/:count', (req, res) => {
  const count = parseInt(req.params.count)
  res.json({ primes: primes.take(count).toArray() })
})
```

**See**: [PATTERNS.md](./PATTERNS.md) - Server patterns

---

### Q: Does PrimaLib work with TypeScript?

**A**: Yes! TypeScript definitions are included:

```typescript
import { N, sq, sum } from 'primalib'

const result: number = sum(sq(N(10)))  // Type-safe!
```

**See**: [TYPES.md](./TYPES.md) - Type definitions

---

## 🐛 **Troubleshooting**

### Q: "Method not found" or "undefined is not a function"

**A**: Check your imports:

```javascript
// ✅ Correct
import { primaSet, N } from 'primalib'
import { sq, sum } from 'primalib'

// ❌ Incorrect - methods are on primaSet
import { map, filter } from 'primalib'  // These don't exist as free functions
```

Use:
```javascript
import { primaSet } from 'primalib'
const { map, filter } = primaSet  // Destructure from primaSet
```

**See**: [ERRORS.md](./ERRORS.md) - Troubleshooting

---

### Q: Code hangs or runs out of memory

**A**: You're likely materializing an infinite sequence:

```javascript
// ❌ Problem
N().toArray()  // Hangs!

// ✅ Fix
N().take(100).toArray()  // Limits size
```

**See**: [ERRORS.md](./ERRORS.md) - Common errors

---

### Q: "Matrix dimensions incompatible"

**A**: Check matrix dimensions before operations:

```javascript
// ❌ Error
matrix([[1,2]]).mul(matrix([[1,2],[3,4]]))  // 1×2 × 2×2 (inner dims don't match)

// ✅ Fix
matrix([[1,2]]).mul(matrix([[1,2]]))  // 1×2 × 1×2 (needs transpose or different dimensions)
```

**See**: [ERRORS.md](./ERRORS.md) - Matrix errors

---

### Q: Floating point precision issues

**A**: Use tolerance for comparisons:

```javascript
// ✅ Use tolerance
const det = matrix([[1,2],[2,4]]).det()
if (Math.abs(det) < 1e-10) {
  // Effectively zero
}
```

**See**: [ERRORS.md](./ERRORS.md) - Floating point issues

---

## 📚 **Documentation Questions**

### Q: Where do I start?

**A**: Recommended learning path:

1. **Quick Start**: [README.md](../README.md) - 5 minute intro
2. **Quick Reference**: [QUICKREF.md](./QUICKREF.md) - Syntax lookup
3. **Patterns**: [PATTERNS.md](./PATTERNS.md) - Common use cases
4. **Complete Guide**: [PRIMALIB.md](./PRIMALIB.md) - Full documentation
5. **Module Docs**: Individual module documentation

**See**: [PRIMALIB.md](./PRIMALIB.md) - Learning path

---

### Q: Where are the examples?

**A**: Examples are in the `examples/` directory:

- [examples/README.md](../examples/README.md) - Examples guide
- `examples/01-basic.js` - Basic usage
- `examples/02-primes.js` - Prime numbers
- `examples/03-geometry.js` - Geometry
- `examples/04-pipeline.js` - Pipelines

**See**: [examples/README.md](../examples/README.md) - Examples guide

---

### Q: How do I contribute?

**A**: See the contributing guide:

1. Read [CONTRIBUTING.md](../CONTRIBUTING.md)
2. Follow code style guidelines
3. Write tests for new code
4. Update documentation
5. Submit a pull request

**See**: [CONTRIBUTING.md](../CONTRIBUTING.md) - Contributing guide

---

## 🎯 **Best Practices**

### Q: What are PrimaLib's best practices?

**A**: 

1. **Use `.take()` with infinite sequences**
2. **Keep operations lazy when possible**
3. **Use memoization for frequently accessed data**
4. **Check dimensions before operations**
5. **Use error handling for edge cases**

**See**: [PRIMASET.md](./PRIMASET.md) - Best practices, [ERRORS.md](./ERRORS.md) - Error prevention

---

### Q: When should I use PrimaSet vs direct arrays?

**A**: 

- **Use PrimaSet**: For infinite sequences, lazy processing, composable pipelines
- **Use Arrays**: For small, frequently accessed datasets, when you need array methods directly

**Example**:
```javascript
// PrimaSet: Infinite sequence
primes.take(100)  // Lazy, efficient

// Array: Small dataset
const small = [1, 2, 3]
small.map(x => x * 2)  // Direct array method
```

**See**: [PRIMASET.md](./PRIMASET.md) - When to use PrimaSet

---

## 🔮 **Future Questions**

### Q: Will there be a TypeScript version?

**A**: TypeScript definitions are available (`primalib.d.ts`). A full TypeScript port is planned for the future.

**See**: [TYPES.md](./TYPES.md) - Type system

---

### Q: Will PrimaLib support WebAssembly?

**A**: AssemblyScript port is being considered for performance-critical operations.

**See**: [SPRINT_PLAN.md](./SPRINT_PLAN.md) - Future plans

---

### Q: How do I request a feature?

**A**: 

1. Check if it already exists
2. Open a GitHub issue with:
   - Clear description
   - Use case
   - Examples
3. Discuss with maintainers

**See**: [CONTRIBUTING.md](../CONTRIBUTING.md) - Feature requests

---

## 📋 **Quick Answers**

| Question | Quick Answer |
|----------|--------------|
| **Infinite sequences?** | Use `.take()` to limit |
| **Performance?** | Use `memo: true` for random access |
| **Errors?** | Check [ERRORS.md](./ERRORS.md) |
| **Examples?** | See [examples/README.md](../examples/README.md) |
| **Contributing?** | See [CONTRIBUTING.md](../CONTRIBUTING.md) |
| **Quick syntax?** | See [QUICKREF.md](./QUICKREF.md) |
| **Patterns?** | See [PATTERNS.md](./PATTERNS.md) |
| **Performance?** | See [PERFORMANCE.md](./PERFORMANCE.md) |

---

## 🔗 **Related Documentation**

- **[QUICKREF.md](./QUICKREF.md)** - Quick syntax reference
- **[PATTERNS.md](./PATTERNS.md)** - Common patterns and recipes
- **[PRIMALIB.md](./PRIMALIB.md)** - Complete documentation
- **[PRIMASET.md](./PRIMASET.md)** - Core concepts
- **[ERRORS.md](./ERRORS.md)** - Error handling
- **[PRIMATEST.md](./PRIMATEST.md)** - Testing approach
- **[CONTRIBUTING.md](../CONTRIBUTING.md)** - Contributing guide

---

**FAQ** - *Common questions and answers about PrimaLib.* ❓

