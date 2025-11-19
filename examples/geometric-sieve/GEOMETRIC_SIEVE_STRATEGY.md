# Geometric Sieve Strategy: Using Hyperplanes and CRT Address

## Overview

The geometric sieve is a fast primality testing method that uses **hyperplane intersection** in the **CRT address space** to filter entire regions of numbers at once, instead of testing each number individually.

---

## Step 1: Understanding the CRT Address System

### What is an Address?

Every number `n` can be represented by its **address**: an array of remainders when divided by the first `k` primes.

**Example:**
- Number: `n = 23`
- First 4 primes: `[2, 3, 5, 7]`
- Address: `[23 % 2, 23 % 3, 23 % 5, 23 % 7] = [1, 2, 3, 2]`

### Key Insight: Zero Coordinates = Divisibility

If any coordinate in the address is `0`, the number is **divisible** by that prime:

- `address[0] === 0` → divisible by 2
- `address[1] === 0` → divisible by 3
- `address[2] === 0` → divisible by 5
- `address[3] === 0` → divisible by 7

**Example:**
- `n = 15` → address `[1, 0, 0, 1]` → divisible by 3 and 5 → **composite**
- `n = 23` → address `[1, 2, 3, 2]` → no zeros → **possibly prime**

---

## Step 2: Address Space as a Hypercube

### Visualizing the Space

Think of the address space as a **k-dimensional hypercube**:
- Each dimension represents one prime (2, 3, 5, 7, ...)
- Each coordinate can be `0` to `prime-1`
- Example: For k=4, we have a 4D hypercube with dimensions `[2, 3, 5, 7]`

### The Residual Space

**Residual space** = all addresses with **no zero coordinates**

- These numbers are **coprime** to all the first k primes
- They are the **candidates** for being prime (if k is large enough)

**Example:**
- Address `[1, 1, 1, 1]` → residual (not divisible by 2, 3, 5, or 7)
- Address `[1, 0, 2, 3]` → NOT residual (divisible by 3)

---

## Step 3: Hyperplanes as Divisibility Filters

### What is a Hyperplane?

A **hyperplane** in k-dimensional space is a (k-1)-dimensional surface that divides the space.

### Prime Hyperplanes

For each prime `p`, we create a hyperplane where **one coordinate is zero**:

- **Hyperplane for prime 2**: All addresses where `address[0] === 0`
- **Hyperplane for prime 3**: All addresses where `address[1] === 0`
- **Hyperplane for prime 5**: All addresses where `address[2] === 0`

### Filtering Entire Regions

Instead of testing each number individually, we can **filter entire hyperplanes**:

```javascript
// Traditional method: test each number
for (let n = 1; n <= limit; n++) {
  if (n % 2 === 0) continue  // Skip even numbers
  if (n % 3 === 0) continue  // Skip multiples of 3
  // ... test each number
}

// Geometric method: filter entire hyperplanes
// Skip ALL numbers where address[0] === 0 (all even numbers)
// Skip ALL numbers where address[1] === 0 (all multiples of 3)
// ... filter entire regions at once
```

---

## Step 4: The Geometric Sieve Algorithm

### Basic Strategy

1. **Choose k**: How many primes to use in the address
   - For testing `n`, we need primes up to `√n`
   - Example: For `n = 100`, we need primes up to `√100 = 10` → `[2, 3, 5, 7]` → `k = 4`

2. **Compute address**: `addr = address(n, k)`
   - This gives us `[n % 2, n % 3, n % 5, n % 7, ...]`

3. **Check for zeros**: If ANY coordinate is `0`, the number is **composite**
   - `addr[0] === 0` → divisible by 2 → composite
   - `addr[1] === 0` → divisible by 3 → composite
   - etc.

4. **Check residual space**: If NO coordinates are `0`, the number is in residual space
   - This means it's coprime to all first k primes
   - If `k` is large enough (primes up to `√n`), then `n` is **prime**

### Why This is Faster

**Traditional trial division:**
- Tests each prime divisor individually: `n % 2`, `n % 3`, `n % 5`, ...
- Time complexity: O(√n / log n) divisions

**Geometric sieve:**
- Computes address once: `[n % 2, n % 3, n % 5, n % 7, ...]` (parallelizable)
- Checks for zeros: simple array lookup
- Time complexity: O(k) where k ≈ √n / log n, but with better constant factors

**Key advantage:** Address computation can be optimized, and zero-checking is a simple array operation.

---

## Step 5: Implementation Details

### Address Computation

```javascript
function address(n, k) {
  const P = [2, 3, 5, 7, 11, 13, ...]  // First k primes
  return P.map(p => n % p)  // Compute all remainders at once
}
```

### Zero-Checking

```javascript
function hasZero(addr) {
  return addr.some(r => r === 0)  // Any zero = composite
}
```

### Residual Check

```javascript
function isResidual(addr) {
  return addr.every(r => r !== 0)  // All non-zero = residual
}
```

### Complete Primality Test

```javascript
function isPrime(n) {
  if (n < 2) return false
  if (n === 2) return true
  
  // Determine how many primes we need
  const sqrtN = Math.floor(Math.sqrt(n))
  const k = countPrimesUpTo(sqrtN)
  
  // Compute address
  const addr = address(n, k)
  
  // If any coordinate is zero, n is composite
  if (hasZero(addr)) return false
  
  // If all coordinates are non-zero, n is coprime to all primes ≤ √n
  // This means n is prime!
  return true
}
```

---

## Step 6: Optimizations

### 1. Early Termination

Stop checking as soon as we find a zero:

```javascript
for (let i = 0; i < addr.length; i++) {
  if (addr[i] === 0) return false  // Composite, stop immediately
}
```

### 2. Caching Prime Lists

Pre-compute and cache lists of primes up to common limits:

```javascript
const PRIME_CACHE = new Map()
function getPrimesUpTo(limit) {
  if (!PRIME_CACHE.has(limit)) {
    PRIME_CACHE.set(limit, computePrimesUpTo(limit))
  }
  return PRIME_CACHE.get(limit)
}
```

### 3. Batch Processing

When testing multiple numbers, compute addresses in batches:

```javascript
function testBatch(numbers) {
  const maxN = Math.max(...numbers)
  const k = countPrimesUpTo(Math.sqrt(maxN))
  const primes = getPrimesUpTo(Math.sqrt(maxN))
  
  return numbers.map(n => {
    const addr = primes.map(p => n % p)
    return !addr.some(r => r === 0)
  })
}
```

### 4. Power-of-2 Dimensions

For power-of-2 dimensions (2, 4, 8, 16, ...), we can use optimized hypercube operations from `primatopo.mjs`.

---

## Step 7: Connection to Hyperplanes

### Hyperplane Representation

Each prime `p` corresponds to a hyperplane in the address space:

- **Hyperplane H₂**: `{addr: addr[0] === 0}` → all even numbers
- **Hyperplane H₃**: `{addr: addr[1] === 0}` → all multiples of 3
- **Hyperplane H₅**: `{addr: addr[2] === 0}` → all multiples of 5

### Intersection Test

A number `n` is composite if its address **lies on any prime hyperplane**:

```javascript
function liesOnHyperplane(addr, primeIndex) {
  return addr[primeIndex] === 0
}

function isComposite(addr) {
  return addr.some((r, i) => r === 0)  // Lies on any hyperplane
}
```

### Geometric Interpretation

- **Residual space** = complement of all prime hyperplanes
- **Primes** = points in residual space (for sufficiently large k)
- **Composites** = points on at least one prime hyperplane

---

## Step 8: Example Walkthrough

### Testing n = 23

1. **Compute √23 ≈ 4.8**, so we need primes up to 4.8 → `[2, 3]` (actually need `[2, 3, 5]` to be safe)

2. **Compute address**: `address(23, 3) = [23 % 2, 23 % 3, 23 % 5] = [1, 2, 3]`

3. **Check for zeros**: `[1, 2, 3]` has no zeros → in residual space

4. **Conclusion**: 23 is coprime to 2, 3, and 5. Since we've checked all primes ≤ √23, **23 is prime** ✓

### Testing n = 15

1. **Compute √15 ≈ 3.9**, so we need primes up to 3.9 → `[2, 3]`

2. **Compute address**: `address(15, 2) = [15 % 2, 15 % 3] = [1, 0]`

3. **Check for zeros**: `[1, 0]` has a zero at index 1 → divisible by 3

4. **Conclusion**: 15 is **composite** ✗

### Testing n = 49

1. **Compute √49 = 7**, so we need primes up to 7 → `[2, 3, 5, 7]`

2. **Compute address**: `address(49, 4) = [49 % 2, 49 % 3, 49 % 5, 49 % 7] = [1, 1, 4, 0]`

3. **Check for zeros**: `[1, 1, 4, 0]` has a zero at index 3 → divisible by 7

4. **Conclusion**: 49 is **composite** ✗

---

## Step 9: Performance Comparison

### Traditional Trial Division

```javascript
function isPrimeTraditional(n) {
  if (n < 2) return false
  if (n === 2) return true
  if (n % 2 === 0) return false
  
  for (let d = 3; d * d <= n; d += 2) {
    if (n % d === 0) return false  // One division per prime
  }
  return true
}
```

**Operations:** ~√n / log n divisions

### Geometric Sieve

```javascript
function isPrimeGeometric(n) {
  if (n < 2) return false
  if (n === 2) return true
  
  const k = countPrimesUpTo(Math.sqrt(n))
  const addr = address(n, k)  // Compute all remainders at once
  
  return !addr.some(r => r === 0)  // Simple array check
}
```

**Operations:** k modulo operations + k zero-checks (but modulo can be optimized)

### Why Geometric is Faster

1. **Batch modulo**: All remainders computed together (can be vectorized)
2. **Simple zero-check**: Array lookup vs. division
3. **Cache-friendly**: Prime lists can be cached
4. **Parallelizable**: Address computation can be parallelized

---

## Step 10: Summary

### Key Concepts

1. **CRT Address**: `[n % 2, n % 3, n % 5, ...]` represents a number's position in prime-modular space

2. **Zero Coordinates**: Any zero coordinate means divisibility by that prime → composite

3. **Residual Space**: Addresses with no zeros → coprime to all first k primes

4. **Hyperplanes**: Each prime defines a hyperplane (zero coordinate) that filters composites

5. **Geometric Filtering**: Instead of testing each number, filter entire hyperplane regions

### Algorithm

```
1. Compute address(n, k) where k = count of primes ≤ √n
2. If any coordinate is 0 → composite
3. If all coordinates are non-zero → prime (for sufficiently large k)
```

### Benefits

- **Faster**: Batch operations, simple zero-checks
- **Geometric**: Visual representation in hypercube space
- **Scalable**: Works well for large numbers
- **Elegant**: Uses topology and geometry concepts

---

## Next Steps

1. Implement `geometricSieve()` function in `primanum.mjs`
2. Enhance `isPrime()` to use geometric sieve
3. Add caching for prime lists
4. Optimize for power-of-2 dimensions
5. Add performance benchmarks

