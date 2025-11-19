# PrimaLib Benchmarks

> **"Performance benchmarks for PrimaLib operations - identify bottlenecks before release."**

This directory contains comprehensive benchmarks for PrimaLib operations to identify performance bottlenecks and optimize critical paths.

## 📊 **Benchmark Suites**

### 1. **PrimaSet Operations** (`primalib-primaset.mjs`)
- Materialization performance
- Lazy operation chains
- Map, filter, reduce operations
- Memoization vs caching performance

### 2. **Prime Generation** (`primalib-primes.mjs`)
- Prime sequence generation
- Primality testing (`isPrime`, `firstDivisor`)
- CRT address computation
- Batch primality checks

### 3. **Linear Algebra** (`primalib-linear.mjs`)
- Vector operations (norm, dot, cross, normalize)
- Matrix operations (determinant, inverse, multiplication)
- Polynomial operations (evaluation, derivative, roots)
- Large matrix performance

### 4. **Geometry** (`primalib-geometry.mjs`)
- Point operations (norm, add, scale)
- Hypercube operations (vertices, sampling)
- Hyperplane distance calculations
- Numeric indexing and destructuring performance

### 5. **Tree Operations** (`primalib-tree.mjs`)
- Tree creation and traversal
- Depth-first, breadth-first, leaves-only walks
- Node finding by address
- Large tree performance

### 6. **Memory Usage** (`primalib-memory.mjs`)
- Lazy vs materialized memory consumption
- Memoization memory overhead
- Caching memory usage
- Chained operations memory

## 🚀 **Running Benchmarks**

### Run Individual Suite

```bash
# PrimaSet operations
node primalib/benchmarks/primalib-primaset.mjs

# Prime generation
node primalib/benchmarks/primalib-primes.mjs

# Linear algebra
node primalib/benchmarks/primalib-linear.mjs

# Memory usage
node primalib/benchmarks/primalib-memory.mjs
```

### Run All Suites

```bash
node primalib/benchmarks/primalib-all.mjs
```

## 📈 **Understanding Results**

### Timing Metrics

- **Average**: Mean execution time across iterations
- **Min/Max**: Best and worst case performance
- **Total**: Cumulative time for all iterations

### Memory Metrics

- **Memory Used**: Heap memory increase during operation
- **Total Heap**: Total JavaScript heap size
- **Memory Tracking**: Only available in Node.js or Chrome DevTools

### Comparisons

Benchmarks automatically compare related operations:
- Lazy vs materialized
- Memoization vs caching
- Different algorithms for same operation

## 🎯 **Key Performance Areas**

### Critical Paths

1. **Prime Generation**: Core operation, used frequently
2. **PrimaSet Materialization**: Affects all lazy operations
3. **Vector Operations**: Used in geometry and linear algebra
4. **Matrix Operations**: Determinant and inverse are expensive

### Optimization Targets

- **Memoization overhead**: Should be < 10% for cached access
- **Lazy operations**: Should have minimal overhead vs direct computation
- **Memory usage**: Lazy sequences should use O(1) memory
- **Large operations**: Should scale linearly with input size

## 📋 **Benchmark Structure**

Each benchmark suite follows this structure:

```javascript
const suite = {
  name: 'Suite Name',
  tests: [
    {
      name: 'Test Name',
      description: 'What this tests',
      fn: () => { /* operation */ },
      expected: expectedResult,  // Optional
      iterations: 10  // Number of runs
    }
  ],
  compare: [
    ['Test 1', 'Test 2']  // Compare these tests
  ]
}
```

## 🔧 **Custom Benchmarks**

To add a new benchmark:

1. Create a new file: `primalib/benchmarks/primalib-<name>.mjs`
2. Import utilities: `import { runSuite, warmup } from './benchmark-utils.mjs'`
3. Define suite with tests
4. Run: `node primalib/benchmarks/primalib-<name>.mjs`

Example:

```javascript
import { runSuite, warmup } from './benchmark-utils.mjs'
import { yourFunction } from '../primalib.mjs'

warmup(() => yourFunction(), 5)

const suite = {
  name: 'Your Benchmark',
  tests: [
    {
      name: 'test1',
      description: 'Test description',
      fn: () => yourFunction(),
      iterations: 10
    }
  ]
}

runSuite(suite)
```

## 📊 **Interpreting Results**

### Good Performance

- ✅ Lazy operations: < 5% overhead vs direct
- ✅ Memoized access: > 3x faster than materialization
- ✅ Memory: Lazy sequences use O(1) memory
- ✅ Scaling: Linear time complexity

### Performance Issues

- ⚠️ High overhead: > 20% slower than baseline
- ⚠️ Memory leaks: Memory not released after operation
- ⚠️ Non-linear scaling: Quadratic or worse complexity
- ⚠️ Slow operations: > 1s for reasonable inputs

## 🔍 **Bottleneck Identification**

### Common Bottlenecks

1. **Proxy Overhead**: Numeric indexing via Proxy can be slow
   - **Solution**: Use `.coords[i]` in performance-critical loops

2. **Materialization**: Converting lazy sequences to arrays
   - **Solution**: Keep lazy when possible, use memoization for repeated access

3. **Prime Generation**: Generating large prime lists
   - **Solution**: Use memoization, cache results

4. **Matrix Operations**: Large matrix determinants/inverses
   - **Solution**: Use optimized algorithms, consider LU decomposition

## 📝 **Benchmark Results**

Results are printed to console with:
- ⏱️ Timing information
- 💾 Memory usage (when available)
- ✅/❌ Correctness verification
- 📊 Comparison metrics

## 📊 **Performance Assessment**

After running benchmarks, see **[PERFORMANCE_ASSESSMENT.md](./PERFORMANCE_ASSESSMENT.md)** for:
- Detailed performance analysis
- Critical bottlenecks identified
- Recommendations for optimization
- Release readiness assessment

## 🔗 **Related Documentation**

- **[PRIMASET.md](../doc/PRIMASET.md)** - Core lazy set operations
- **[PRIMANUM.md](../doc/PRIMANUM.md)** - Prime generation
- **[PRIMALIN.md](../doc/PRIMALIN.md)** - Linear algebra
- **[PERFORMANCE_ASSESSMENT.md](./PERFORMANCE_ASSESSMENT.md)** - Performance assessment

---

**Benchmarks** - *Measure, optimize, release.* 📊

