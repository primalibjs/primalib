# Geometric Sieve Optimizations Using PrimaSet

## How PrimaSet Speeds Up the Geometric Sieve

### 1. Lazy Candidate Generation

**Traditional approach:**
```javascript
// Pre-compute all candidates (memory intensive)
const candidates = []
for (let n = start; n <= end; n++) {
  candidates.push(n)
}
```

**PrimaSet approach:**
```javascript
// Generate candidates lazily (no memory overhead)
const candidates = N(end).skip(start - 1)  // Lazy generator
```

**Benefit:** O(1) memory instead of O(n) for large ranges.

---

### 2. Lazy Address Computation

**Traditional approach:**
```javascript
// Compute all addresses upfront
const addresses = candidates.map(n => address(n, k))  // Materializes everything
```

**PrimaSet approach:**
```javascript
// Compute addresses on-demand
const addresses = candidates.map(n => address(n, k))  // Lazy - computes only when needed
```

**Benefit:** Only computes addresses for numbers we actually check.

---

### 3. Composable Filtering Pipeline

**Traditional approach:**
```javascript
// Sequential filtering
let results = []
for (const n of candidates) {
  const addr = address(n, k)
  if (!addr.some(r => r === 0)) {
    results.push(n)
  }
}
```

**PrimaSet approach:**
```javascript
// Composable pipeline
const primes = N(end)
  .skip(start - 1)
  .map(n => ({ n, addr: address(n, k) }))  // Lazy address computation
  .filter(({ addr }) => addr.every(r => r !== 0))  // Lazy filtering
  .map(({ n }) => n)  // Extract numbers
```

**Benefit:** Clean, composable, lazy evaluation throughout.

---

### 4. Batch Processing with `map`

**Traditional approach:**
```javascript
// Process one at a time
for (const n of range) {
  const addr = address(n, k)
  if (isResidual(addr)) {
    primes.push(n)
  }
}
```

**PrimaSet approach:**
```javascript
// Batch process entire range
const primes = range
  .map(n => address(n, k))  // Compute all addresses lazily
  .filter(addr => addr.every(r => r !== 0))  // Filter composites
  .map(addr => address.toNumber(addr))  // Reconstruct numbers
```

**Benefit:** Can be parallelized, vectorized, or optimized as a batch operation.

---

### 5. Caching Prime Lists

**Traditional approach:**
```javascript
// Recompute primes every time
function getPrimesUpTo(limit) {
  return computePrimes(limit)  // Expensive!
}
```

**PrimaSet approach:**
```javascript
// Cache prime lists using primaSet memoization
const primeLists = primaSet(function* () {
  let cache = new Map()
  while (true) {
    const limit = yield
    if (!cache.has(limit)) {
      cache.set(limit, primes.takeWhile(p => p <= limit).toArray())
    }
    yield cache.get(limit)
  }
}, { memo: true })
```

**Benefit:** Prime lists computed once, cached for reuse.

---

### 6. Early Termination with `take`

**Traditional approach:**
```javascript
// Always compute full address
const addr = address(n, k)  // Computes all k remainders
```

**PrimaSet approach:**
```javascript
// Early termination on first zero
const addr = address(n, k)
  .takeWhile(r => r !== 0)  // Stop at first zero
```

**Benefit:** Stops computing as soon as composite is detected.

---

### 7. Range-Based Sieving

**Traditional approach:**
```javascript
// Sieve entire range upfront
const allPrimes = sieveRange(1, 1000000)  // Expensive!
```

**PrimaSet approach:**
```javascript
// Sieve lazily, take only what you need
const somePrimes = sieveRange(1, 1000000)
  .take(100)  // Only compute first 100 primes
```

**Benefit:** Only computes what's needed.

---

### 8. Parallel Address Computation

**Traditional approach:**
```javascript
// Sequential computation
for (const n of candidates) {
  const addr = address(n, k)  // One at a time
}
```

**PrimaSet approach:**
```javascript
// Lazy evaluation enables parallelization
const addresses = candidates
  .map(n => address(n, k))  // Can be parallelized
  .toArray()  // Materialize when needed
```

**Benefit:** Lazy evaluation makes parallelization straightforward.

---

### 9. Memory-Efficient Sieving

**Traditional approach:**
```javascript
// Store all candidates and addresses
const candidates = []
const addresses = []
for (let n = start; n <= end; n++) {
  candidates.push(n)
  addresses.push(address(n, k))
}
```

**PrimaSet approach:**
```javascript
// Stream processing - no storage needed
const primes = N(end)
  .skip(start - 1)
  .map(n => ({ n, addr: address(n, k) }))
  .filter(({ addr }) => addr.every(r => r !== 0))
  .map(({ n }) => n)
  .take(needed)  // Only materialize what's needed
```

**Benefit:** O(1) memory for streaming, O(n) only when materialized.

---

### 10. Composable Sieve Components

**Traditional approach:**
```javascript
// Monolithic function
function sieve(n) {
  // All logic in one place
}
```

**PrimaSet approach:**
```javascript
// Composable components
const computeAddress = n => address(n, k)
const isResidual = addr => addr.every(r => r !== 0)
const extractNumber = ({ n }) => n

const sieve = candidates
  .map(computeAddress)
  .filter(isResidual)
  .map(extractNumber)
```

**Benefit:** Each component can be optimized independently, reused, and tested separately.

---

## Performance Comparison

### Traditional Geometric Sieve

```javascript
function sieveTraditional(start, end) {
  const primes = []
  const k = countPrimesUpTo(Math.sqrt(end))
  const primeList = getPrimesUpTo(Math.sqrt(end))
  
  for (let n = start; n <= end; n++) {
    const addr = primeList.map(p => n % p)
    if (addr.every(r => r !== 0)) {
      primes.push(n)
    }
  }
  return primes
}
```

**Complexity:**
- Time: O(n × k) where k ≈ √n / log n
- Memory: O(n) for storing results
- Operations: n × k modulo operations

### PrimaSet Geometric Sieve

```javascript
function sievePrimaSet(start, end) {
  const k = countPrimesUpTo(Math.sqrt(end))
  const primeList = getPrimesUpTo(Math.sqrt(end))  // Cached
  
  return N(end)
    .skip(start - 1)
    .map(n => primeList.map(p => n % p))  // Lazy address computation
    .filter(addr => addr.every(r => r !== 0))  // Lazy filtering
    .map((addr, i) => start + i)  // Reconstruct numbers
}
```

**Complexity:**
- Time: O(n × k) but with better constant factors
- Memory: O(1) lazy, O(n) when materialized
- Operations: n × k modulo operations (same) but:
  - Can be parallelized
  - Can be vectorized
  - Can be optimized as batch operations
  - Early termination possible

---

## Key Optimizations Summary

1. **Lazy Evaluation**: Compute only what's needed, when needed
2. **Composability**: Chain operations for clarity and optimization
3. **Caching**: Memoize prime lists and computed addresses
4. **Early Termination**: Stop at first zero coordinate
5. **Batch Processing**: Process ranges as units
6. **Memory Efficiency**: O(1) for streaming, O(n) only when materialized
7. **Parallelization**: Lazy evaluation enables parallel computation
8. **Reusability**: Components can be optimized independently

---

## Implementation Strategy

1. **Create `geometricSieve()` function** that uses primaSet pipeline
2. **Cache prime lists** using primaSet memoization
3. **Lazy address computation** using `map`
4. **Lazy filtering** using `filter` with zero-check
5. **Early termination** using `takeWhile` for first zero
6. **Batch processing** for ranges of numbers
7. **Integration** with existing `isPrime()` function

---

## Example Usage

```javascript
import { geometricSieve, N } from 'primalib'

// Sieve range lazily
const primes = geometricSieve(100, 200)
primes.take(10)  // Only compute first 10 primes in range

// Sieve with custom k
const primes = geometricSieve(1000, 2000, { k: 10 })

// Batch process
const ranges = [[100, 200], [300, 400], [500, 600]]
const allPrimes = ranges
  .map(([start, end]) => geometricSieve(start, end))
  .flatten()
  .take(50)  // First 50 primes across all ranges
```

