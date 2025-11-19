# PrimaLib Examples

> **"Learn PrimaLib through practical examples - from basics to advanced use cases."**

This directory contains examples demonstrating PrimaLib's capabilities, organized from simple to advanced.

## 📚 **Examples Overview**

### Beginner Examples

#### [01-basic.js](./01-basic.js)
**Basic Usage** - Introduction to PrimaLib's core features

**What you'll learn:**
- Sum of squares calculation
- Using `pipe()` for composition
- Working with arrays and infinite sequences
- Lazy evaluation basics

**Run:**
```bash
node examples/01-basic.js
```

**Key concepts:**
- `N()` - Natural numbers
- `sq()` - Square operation
- `sum()` - Sum operation
- `pipe()` - Function composition
- `primaSet()` - Creating sets

---

#### [02-primes.js](./02-primes.js)
**Prime Numbers** - Working with infinite prime sequences

**What you'll learn:**
- Accessing infinite prime sequences
- Summing primes
- Chinese Remainder Theorem (CRT) addressing
- Reconstructing numbers from CRT addresses

**Run:**
```bash
node examples/02-primes.js
```

**Key concepts:**
- `primes` - Infinite prime sequence
- `take()` - Limiting infinite sequences
- `address()` - CRT representation
- `address.toNumber()` - Reconstructing from CRT

---

#### [03-geometry.js](./03-geometry.js)
**Geometry** - Working with points and spaces

**What you'll learn:**
- Creating and manipulating points
- Point addition and distance calculations
- Hypercube creation and vertex enumeration
- Working in 2D and 3D space

**Run:**
```bash
node examples/03-geometry.js
```

**Key concepts:**
- `point()` - Creating points
- `point.add()` - Vector addition
- `point.norm()` - Euclidean distance
- `space()` - Creating spaces
- `space.vertices()` - Getting corners

---

#### [04-pipeline.js](./04-pipeline.js)
**Pipeline Composition** - Building reusable mathematical pipelines

**What you'll learn:**
- Creating reusable pipelines
- Composing operations
- Method chaining vs functional composition
- Applying pipelines to different data sources

**Run:**
```bash
node examples/04-pipeline.js
```

**Key concepts:**
- `pipe()` - Pipeline composition
- Reusable function creation
- Method chaining
- Functional composition

---

### Intermediate Examples

#### [05-primes.js](./05-primes.js)
**Advanced Primes** - More complex prime number operations

**What you'll learn:**
- Advanced prime operations
- Prime constellations
- Geometric interpretations

**Run:**
```bash
node examples/05-primes.js
```

---

### Performance Examples

#### [06-memoize-performance.js](./06-memoize-performance.js)
**Memoization Performance** - Comparing memoized vs non-memoized access

**What you'll learn:**
- Performance impact of memoization
- When to use `memo: true` option
- Caching strategies

**Run:**
```bash
node examples/06-memoize-performance.js
```

**Key concepts:**
- `primaSet(src, { memo: true })` - Memoization
- Performance benchmarking
- Cache efficiency

---

#### [07-primes-sum-performance.js](./07-primes-sum-performance.js)
**Prime Sum Performance** - Optimizing prime sum calculations

**What you'll learn:**
- Performance optimization techniques
- Efficient prime operations
- Benchmarking strategies

**Run:**
```bash
node examples/07-primes-sum-performance.js
```

---

#### [08-firstdivisor-comparison.js](./08-firstdivisor-comparison.js)
**Primality Test Comparison** - Comparing different primality testing methods

**What you'll learn:**
- Different primality testing approaches
- Performance characteristics
- Accuracy trade-offs

**Run:**
```bash
node examples/08-firstdivisor-comparison.js
```

---

### Advanced Examples

#### [09-large-primes-batch.mjs](./09-large-primes-batch.mjs)
**Large Prime Batches** - Processing large batches of primes

**What you'll learn:**
- Handling large datasets
- Batch processing strategies
- Memory management

**Run:**
```bash
node examples/09-large-primes-batch.mjs
```

---

#### [10-large-primes-benchmark.mjs](./10-large-primes-benchmark.mjs)
**Prime Benchmarking** - Comprehensive prime operation benchmarks

**What you'll learn:**
- Benchmarking methodology
- Performance profiling
- Optimization techniques

**Run:**
```bash
node examples/10-large-primes-benchmark.mjs
```

---

#### [11-large-primes-optimized.mjs](./11-large-primes-optimized.mjs)
**Optimized Prime Operations** - Optimized implementations

**What you'll learn:**
- Optimization strategies
- Efficient algorithms
- Performance best practices

**Run:**
```bash
node examples/11-large-primes-optimized.mjs
```

---

#### [12-geometric-sieve-benchmark.mjs](./12-geometric-sieve-benchmark.mjs)
**Geometric Sieve Benchmark** - Benchmarking geometric sieve algorithms

**What you'll learn:**
- Geometric sieve implementation
- Performance characteristics
- Comparison with traditional sieves

**Run:**
```bash
node examples/12-geometric-sieve-benchmark.mjs
```

---

## 🎯 **Learning Path**

### Step 1: Basics
Start with the beginner examples to understand core concepts:

1. **01-basic.js** - Core operations and lazy evaluation
2. **02-primes.js** - Infinite sequences
3. **03-geometry.js** - Geometric structures
4. **04-pipeline.js** - Function composition

### Step 2: Intermediate
Explore more complex use cases:

5. **05-primes.js** - Advanced prime operations

### Step 3: Performance
Learn optimization techniques:

6. **06-memoize-performance.js** - Caching strategies
7. **07-primes-sum-performance.js** - Optimization techniques
8. **08-firstdivisor-comparison.js** - Algorithm comparison

### Step 4: Advanced
Master advanced topics:

9. **09-large-primes-batch.mjs** - Large dataset handling
10. **10-large-primes-benchmark.mjs** - Benchmarking
11. **11-large-primes-optimized.mjs** - Optimized implementations
12. **12-geometric-sieve-benchmark.mjs** - Advanced algorithms

## 🔧 **Running Examples**

### All Examples

```bash
# Run all examples sequentially
for file in examples/*.js examples/*.mjs; do
  [ -f "$file" ] && node "$file" && echo ""
done
```

### Specific Example

```bash
# Run a specific example
node examples/01-basic.js

# Or with Node.js ESM
node examples/09-large-primes-batch.mjs
```

### Interactive Mode

```bash
# Start Node.js REPL with PrimaLib
node --input-type=module
> import { N, sq, sum } from './primalib.mjs'
> sum(sq(N(10)))
385
```

## 📝 **Example Patterns**

### Pattern 1: Basic Calculation

```javascript
import { N, sq, sum } from 'primalib'

// Sum of squares
console.log(sum(sq(N(10))))  // → 385
```

### Pattern 2: Infinite Sequences

```javascript
import { primes } from 'primalib'

// First 10 primes
console.log(primes.take(10))  // → [2,3,5,7,11,13,17,19,23,29]
```

### Pattern 3: Pipeline

```javascript
import { N, pipe } from 'primalib'
import { primaSet } from 'primalib'
const { take, sq, sum } = primaSet

const pipeline = pipe(N, take(10), sq, sum)
console.log(pipeline())  // → 385
```

### Pattern 4: Geometry

```javascript
import { point, space } from 'primalib'

const p1 = point(1, 2)
const p2 = point(3, 4)
console.log(p1.add(p2).coords)  // → [4, 6]

const cube = space([0,0,0], [1,1,1])
console.log(cube.vertices().length)  // → 8
```

## 🎨 **Creating Your Own Examples**

### Example Template

```javascript
/**
 * Example: Your Example Name
 * 
 * Description of what this example demonstrates
 */

import { /* imports */ } from '../primalib.mjs'
import { primaSet } from '../primaset.mjs'

console.log('=== Example: Your Example ===\n')

// Your code here
const result = yourOperation()
console.log('Result:', result)
```

### Best Practices

1. **Clear Comments**: Explain what each section does
2. **Progressive Complexity**: Start simple, add complexity
3. **Show Output**: Use `console.log()` to show results
4. **Error Handling**: Include error cases if relevant
5. **Documentation**: Add header comment explaining the example

## 🔗 **Related Documentation**

- **[README.md](../README.md)** - Quick start guide
- **[PRIMALIB.md](../doc/PRIMALIB.md)** - Complete documentation
- **[QUICKREF.md](../doc/QUICKREF.md)** - Quick reference
- **[ERRORS.md](../doc/ERRORS.md)** - Error handling guide

## 💡 **Tips**

- **Start Simple**: Begin with `01-basic.js` to understand fundamentals
- **Experiment**: Modify examples to see how they work
- **Read Code**: Study the implementation to learn patterns
- **Check Output**: Verify results match expectations
- **Extend Examples**: Add your own variations

## 🚀 **Next Steps**

After running the examples:

1. **Read Documentation**: See [PRIMALIB.md](../doc/PRIMALIB.md) for complete API
2. **Try Quick Reference**: Use [QUICKREF.md](../doc/QUICKREF.md) for quick lookup
3. **Build Something**: Create your own examples
4. **Explore Tests**: See `tests/` directory for more examples
5. **Contribute**: Share your examples with the community

---

**Examples** - *Learn by doing. From basics to advanced, explore PrimaLib's capabilities.* 🎓

