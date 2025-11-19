# PrimaLib Summary

## Core Philosophy

**PrimaLib is a mathematical tool for defining and manipulating infinite sets as naturally as finite ones.** At its heart is **`primaSet`** ⭐ - the shining star that treats everything as a set: numbers, objects, trees, DOM elements, or infinite streams of primes.

> **"Because math should feel like poetry, not paperwork."**

### Key Insight: Prime Numbers at the Core

**PrimaSet has prime numbers at its bones.** Hence the name. You can say `P = primes` and handle that infinite set as a single thing - free browseable, just like a normal array. Primes, Naturals, Integers - all are infinite arrays that you can work with naturally.

```javascript
import { primes, primaSet, N } from 'primalib'

// Primes as an infinite array - free browseable!
const P = primes  // primes is already a primaSet (infinite array)
P.get(0)  // → 2 (first prime, get() materializes the element)
P.get(4)  // → 11 (5th prime)
P.take(10)  // → [2,3,5,7,11,13,17,19,23,29]
P.takeRange(10, 20)  // → [31,37,41,43,47,53,59,61,67,71,73] (range)

// Memo option - makes set accessible as array []
const Pmemo = primaSet(primes, { memo: true })
Pmemo[0]  // → 2 (fast cached access)
Pmemo[99]  // → 541 (100th prime, cached)
```

## Architecture

### 1. Foundation: primaSet (Core Lazy Set Factory)

**PrimaSet is the shining star** - it treats **everything as a set**, whether it's:
- A single number: `5` → `{5}`
- A finite array: `[1,2,3]` → `{1,2,3}`
- An infinite stream: `primes` → `{2,3,5,7,11,...}` (free browseable infinite array!)
- A function: `{next(x){return x+1}}` → infinite sequence
- Objects and trees: `{a:1, b:[2,3]}` → `{{a:1, b:[2,3]}}`
- DOM elements: `document.querySelectorAll('div')` → `{div1, div2, ...}`

**The magic**: `primaSet` handles infinite sequences as naturally as finite arrays - no memory explosions, no precomputation, just pure lazy evaluation.

### 2. Lazy Evaluation & Memoization

**Lazy by default**: Sequences are not materialized until needed. This allows working with infinite sequences without memory issues.

**Memoization option**: When `memo: true` is set, values are cached for fast repeated access:

```javascript
const Pmemo = primaSet(primes, { memo: true })

// First pass: materializes and caches (slow)
for (let i = 0; i < 100000; i++) {
  Pmemo[i]  // Materializes primes up to index i
}

// Second pass: uses cache (fast - 6-10x faster)
for (let i = 99999; i >= 0; i--) {
  Pmemo[i]  // Instant - already cached
}
```

**Performance**: 
- 1M primes: ~138ms (under 1 second target)
- 10K primes: ~52ms (for memoization tests)
- Memoization provides 6-10x speedup on cached access

### 3. Materialization: `get()` Method

**`get(index)` materializes the element** at a given index. This is the key to working with infinite sequences:

```javascript
primes.get(0)  // Materializes first prime: 2
primes.get(100)  // Materializes 101st prime: 547
```

After `get()`, elements are cached for fast access (if memo mode is enabled).

### 4. Core Operations

#### Set Operations (Lazy Methods)

- **`*map(f)`** - Transform each element
- **`*filter(p)`** - Keep elements where predicate true
- **`*take(n)`** - Take first n elements
- **`takeRange(start, stop)`** - Take elements from start to stop (inclusive)
- **`*skip(n)`** - Skip first n elements
- **`reduce(f, init)`** - Fold with function
- **`get(index)`** - Get element by index (materializes the element)
- **`*zip(other, f)`** - Pair with another set
- **`*unique()`** - Remove duplicates
- **`sort()`** - Sort elements
- **`count()`** - Count elements
- **`*cycle()`** - Repeat infinitely
- **`*flatten()`** - Flatten nested structures
- **`*mix(...others)`** - Compose sets (bag of sets - combine into one)
- **`shrink()`** - Reduce to simpler type (BigInt→Number, nested→flat)
- **`*chunk(size)`** - Split into chunks
- **`sample(n)`** - Random sample

#### Key Operations Explained

**`mix(...others)`**: Compose multiple sets into one unified set (bag of sets). Like composing web elements to form another, or combining sets into a single collection.

```javascript
primaSet([1,2]).mix([10,20], [100,200])  // → [1,2,10,20,100,200]
```

**`shrink()`**: Reduce complex types to simpler forms:
- BigInt → Number (when safe, within Number.MAX_SAFE_INTEGER)
- Nested arrays → single value: `[[[1]]]` → `1`
- Wrapped primaSet → unwrapped

```javascript
primaSet([[[1]]]).shrink()  // → 1
primaSet([9007199254740991n]).shrink()  // → 9007199254740991 (BigInt → Number)
```

**`takeRange(start, stop)`**: Take elements within a specified range (inclusive).

```javascript
primes.takeRange(10, 20)  // → [31,37,41,43,47,53,59,61,67,71,73]
```

### 5. Number Theory: Prime Generation

**Optimized `firstDivisor` algorithm**: Uses increment-by-6 pattern (6k±1) for optimal performance:

```javascript
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
}
```

**Performance comparison**:
- Increment by 6: ~225ms for 1M primes (fastest)
- Increment by 2: ~319ms for 1M primes (41% slower)

**Prime generation performance**:
- 1M primes: ~138ms (under 1 second target ✅)
- 10M primes: ~3.88s (target: <1s, needs sieve algorithm for further optimization)

### 6. Generator Iterator Optimization

**Critical optimization**: Reuse a single generator iterator instead of creating new ones. This prevents recomputing values:

```javascript
// Before (slow - recreates generator each time):
const it = target._gen()  // Creates new generator
for (let i = 0; i < currentIndex; i++) {
  it.next()  // Still computes values!
}

// After (fast - reuses iterator):
if (!target._genIterator) {
  target._genIterator = target._gen()  // Create once
}
// Iterator maintains state, no recomputation needed
```

This optimization improved performance by **35x** for small prime counts.

### 7. Memoization Implementation

**Memo mode** (`memo: true`):
- Initializes `_memoized` array for fast access
- Materializes values incrementally as needed
- Caches values in both `_memoized` and `_cache` (SlidingWindowCache)
- Iterator materializes on first iteration and caches for subsequent iterations

**Key insight**: Don't materialize infinite sequences eagerly - only materialize what's needed when accessing specific indices.

### 8. Test Framework

**Synchronous test execution**: Tests run sequentially (not in parallel) for accurate timing:

```javascript
// Sequential execution (accurate timing)
for (const { name, fn } of test.tests) {
  const start = performance.now()
  await fn(check)
  const duration = performance.now() - start
  // Each test's time is measured independently
}
```

**Performance targets**:
- Memoization test: <100ms (defaults to 10K primes)
- Can override via `MEMO_TEST_COUNT` env var or `window.MEMO_TEST_COUNT` in browser

### 9. Examples

**Example: Infinite Sets of Primes** (`05-primes.js`):
- Demonstrates primes as infinite array
- Shows `get()`, `memo`, `takeRange()`, and operations
- Free browseable, just like a normal array

**Example: Memoization Performance** (`06-memoize-performance.js`):
- Tests from 1K to 10M primes with 10-fold increases
- Shows speedup on cached access (6-10x faster)
- Restarts on each test for clean measurements

**Example: Primes Sum Performance** (`07-primes-sum-performance.js`):
- Compares primaSet with direct for loop
- Shows 28-47x speedup over direct loop
- Demonstrates correctness (sums match)

**Example: firstDivisor Comparison** (`08-firstdivisor-comparison.js`):
- Compares 7 different algorithms
- Shows increment-by-6 is fastest
- Validates correctness across all algorithms

## Key Design Decisions

1. **Lazy by default**: Infinite sequences don't materialize until needed
2. **Memoization as opt-in**: Use `memo: true` when you need fast repeated access
3. **Generator iterator reuse**: Critical optimization for performance
4. **Materialization via `get()`**: Explicit control over when values are computed
5. **Everything is a set**: Unified API for finite arrays, infinite sequences, objects, trees, DOM
6. **Prime numbers at core**: The library's name and primary use case
7. **Performance targets**: 1M primes <1s, memoization tests <100ms

## Performance Characteristics

- **Prime generation**: O(n√n) with optimized trial division
- **Memoization**: O(1) access after materialization, O(n) for first materialization
- **Lazy operations**: O(1) to create, O(n) when materialized
- **Memory**: O(n) for memoized sequences, O(1) for lazy sequences

## Future Optimizations

1. **Sieve algorithm**: For 10M+ primes to meet <1s target
2. **Parallel prime generation**: For very large prime counts
3. **Streaming materialization**: For better memory efficiency

## Conclusion

PrimaLib demonstrates that **infinite sets can be handled as naturally as finite arrays**. The core insight is that lazy evaluation + memoization allows working with infinite sequences without memory issues, while providing fast access when needed. `primaSet` is the foundation that makes this possible - treating everything as a set, whether it's a number, an array, an infinite sequence, or a DOM tree.

