# Geometric Sieve Analysis: Why It Doesn't Add Advantage

## Executive Summary

After comprehensive benchmarking and analysis, we've discovered that **the geometric sieve does not provide a performance advantage** over optimized trial division (`firstDivisor`). The apparent speedup was due to memoization, not the geometric algorithm itself.

**Key Finding**: When using modulo operations (`n % p === 0`), we are **already sieving entire primal space slices**. The geometric representation (CRT address space) doesn't add computational value beyond what trial division already accomplishes.

---

## The Fundamental Insight

### What We Thought Geometric Sieve Would Do

We envisioned that representing numbers as addresses in CRT space would allow us to:
1. **Filter entire hyperplanes** at once (all numbers where `address[i] === 0`)
2. **Skip entire residue classes** efficiently
3. **Batch process** regions of the address space

### What Actually Happens

When we check `n % p === 0`, we are **already filtering an entire residue class**:
- All numbers where `n % p === 0` are multiples of `p`
- This is equivalent to filtering the hyperplane `{addr: addr[i] === 0}` in address space
- **The geometric representation adds no computational advantage**

### The Modulo Operation Already Sieves

```javascript
// Traditional trial division
if (n % p === 0) return false;  // Already sieving: filters all multiples of p

// Geometric sieve (what we implemented)
const addr = primeList.map(p => n % p);  // Computes same modulo operations!
if (addr.some(r => r === 0)) return false;  // Same check, just in array form
```

**Both approaches do the same thing**: Check if `n` is divisible by any prime `p`. The geometric representation is just a different way to store the same information.

---

## Benchmark Results

### Fair Comparison (Both Using Memoized Primes)

**Finding last 10,000 primes near MAX_SAFE_INTEGER:**

| Method | Time | Speedup |
|--------|------|---------|
| firstDivisor (memoized) | 293.93ms | 1.0x (baseline) |
| isPrimeGeometric | 557.48ms | 0.53x (slower) |

**Result**: When both use memoized primes, `firstDivisor` is **1.9x faster**.

### Single Number Performance (Both Memoized)

| Method | Average Time | Speedup |
|--------|--------------|---------|
| firstDivisor (memoized) | 0.0138ms | 1.0x (baseline) |
| isPrimeGeometric | 0.0165ms | 0.84x (slower) |

**Result**: `firstDivisor` is **1.2x faster** for single number checks.

### Memoization Benefit

| Method | Without Memo | With Memo | Speedup |
|--------|-------------|-----------|---------|
| firstDivisor | 1,139ms | 294ms | 3.88x |

**Key Insight**: The apparent geometric sieve advantage was **entirely due to memoization**, not the algorithm.

---

## Why Geometric Sieve Doesn't Help

### 1. Modulo Operations Already Sieve

When we compute `n % p`, we're checking if `n` is in the residue class `0 mod p`:
- This is equivalent to checking if `n` lies on the hyperplane `{addr: addr[i] === 0}`
- **No additional information is gained** by representing it as an address

### 2. Early Termination Works the Same

Both methods can stop at the first divisor:

```javascript
// firstDivisor: stops at first zero
if (n % p === 0) return false;  // ← Stops here

// Geometric sieve: stops at first zero
if (n % p === 0) return false;  // ← Same thing!
```

**The geometric representation doesn't enable better early termination** - both methods check primes in order and stop at the first match.

### 3. Array Overhead Adds Cost

The geometric sieve creates arrays and uses array methods:

```javascript
// Geometric sieve overhead
const addr = primeList.map(p => n % p);  // Creates array
if (addr.some(r => r === 0)) return false;  // Iterates through array

// firstDivisor: direct check
if (n % p === 0) return false;  // Direct, no array overhead
```

**Array operations add overhead** without providing computational benefit.

### 4. Prime List Computation is the Same

Both methods need primes up to `√n`:
- **firstDivisor**: Generates primes on-the-fly using 6k±1 pattern
- **Geometric sieve**: Uses cached prime list

**The advantage comes from caching, not geometry**.

---

## What "Sieving" Actually Means

### True Sieving (Eratosthenes)

```javascript
// Mark all multiples of each prime as composite
const sieve = new Array(n + 1).fill(true);
for (const p of primes) {
  for (let m = p * 2; m <= n; m += p) {
    sieve[m] = false;  // Mark entire hyperplane!
  }
}
```

**This actually sieves**: It marks entire residue classes (multiples) at once.

### Trial Division (What We're Doing)

```javascript
// Check each number individually
for (let n = start; n <= end; n++) {
  for (const p of primes) {
    if (n % p === 0) break;  // Check if divisible
  }
}
```

**This doesn't sieve**: It checks each number individually, even though modulo operations conceptually filter residue classes.

### Geometric Sieve (What We Implemented)

```javascript
// Check each number, compute address
for (let n = start; n <= end; n++) {
  const addr = primes.map(p => n % p);  // Same modulo operations!
  if (addr.some(r => r === 0)) break;  // Same check!
}
```

**This also doesn't sieve**: It's just trial division with array overhead.

---

## The Real Advantage: Memoization

### Why Geometric Sieve Seemed Faster

1. **Uses cached prime list**: `getPrimesUpTo()` caches primes
2. **Original firstDivisor**: Generates primes on-the-fly (slower)
3. **Apparent speedup**: Actually from caching, not geometry

### Fair Comparison Reveals Truth

When both use memoized primes:
- **firstDivisor**: 294ms
- **Geometric**: 557ms
- **firstDivisor wins**: 1.9x faster

**Conclusion**: The geometric representation adds overhead without benefit.

---

## When Would Geometric Sieve Help?

### Theoretical Advantages (Not Realized)

1. **True hyperplane marking**: If we could mark entire residue classes at once
   - But we'd need to iterate through all numbers anyway
   - Eratosthenes sieve already does this better

2. **Residual space iteration**: If we could iterate only through residual addresses
   - Would require CRT reconstruction for each address
   - More expensive than just checking numbers directly

3. **Batch address computation**: If we could compute addresses in parallel
   - But modulo operations are already fast
   - Parallelization overhead would outweigh benefits

### Practical Reality

**None of these theoretical advantages materialize** because:
- Modulo operations are already fast
- Early termination works the same way
- Array overhead adds cost
- True sieving (Eratosthenes) is better for ranges

---

## Recommendations

### 1. Use firstDivisor for Primality Testing

```javascript
// Recommended: firstDivisor with memoized primes
function isPrimeOptimized(n) {
  if (n < 2) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;
  if (n === 3) return true;
  if (n % 3 === 0) return false;
  
  const sqrtN = Math.floor(Math.sqrt(n));
  const primes = getPrimesUpTo(sqrtN);  // Cached
  
  for (const p of primes) {
    if (p * p > n) break;
    if (n % p === 0) return false;  // Direct check, no arrays
  }
  return true;
}
```

### 2. Use Eratosthenes Sieve for Ranges

```javascript
// For finding many primes in a range
function sieveRange(start, end) {
  const composite = new Set();
  const sqrtEnd = Math.floor(Math.sqrt(end));
  const primes = getPrimesUpTo(sqrtEnd);
  
  // Mark multiples (true sieving)
  for (const p of primes) {
    const startMultiple = Math.max(p * 2, Math.ceil(start / p) * p);
    for (let m = startMultiple; m <= end; m += p) {
      composite.add(m);
    }
  }
  
  // Yield primes
  for (let n = start; n <= end; n++) {
    if (n >= 2 && !composite.has(n)) {
      yield n;
    }
  }
}
```

### 3. Keep Geometric Sieve for Educational Value

The geometric sieve is still valuable for:
- **Understanding**: CRT address space representation
- **Education**: Teaching number theory concepts
- **Research**: Exploring geometric interpretations
- **Integration**: PrimaSet composability

But **not for performance**.

---

## Conclusion

### Key Findings

1. **Geometric sieve doesn't add performance advantage**
   - When both use memoized primes, firstDivisor is faster
   - Array overhead makes geometric sieve slower

2. **Modulo operations already sieve**
   - `n % p === 0` filters entire residue classes
   - Geometric representation adds no computational value

3. **Memoization was the real advantage**
   - Cached prime lists help both methods
   - The apparent geometric advantage was from caching

4. **True sieving is different**
   - Eratosthenes sieve marks multiples (true sieving)
   - Trial division checks individually (not true sieving)
   - Geometric sieve is just trial division with arrays

### Final Recommendation

**Use firstDivisor with memoized primes** for primality testing. The geometric sieve is an interesting mathematical concept but doesn't provide practical performance benefits.

---

## Files

- **Benchmark**: `tests/large-primes-optimized.mjs`
- **Analysis**: This document
- **Implementation**: `primanum.mjs` (geometricSieve, isPrimeGeometric)

---

## References

- [Geometric Sieve Strategy](./GEOMETRIC_SIEVE_STRATEGY.md)
- [Why Geometric Sieve is Slower](./WHY_GEOMETRIC_SIEVE_IS_SLOWER.md)
- [Large Primes Benchmark Results](./LARGE_PRIMES_BENCHMARK_RESULTS.md)

