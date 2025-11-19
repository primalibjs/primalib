# PrimaNum - Number Theory & Geometric Primes

> **"Numbers, primes, and geometry - exploring the mathematical universe through lazy sequences and geometric structures."**

PrimaNum provides number sequences, prime constellations, geometric sieves, and advanced number theory operations. It combines lazy evaluation with geometric interpretations of prime numbers using CRT (Chinese Remainder Theorem) addresses and 2D power space geometry.

## 🎯 **Architecture**

- **Hybrid Structure**: Direct array access (`prima`) and lazy sequences (`primo`)
- **Geometric Interpretation**: Primes as points in complex/quaternion/octonion spaces
- **CRT Address System**: Represent numbers using Chinese Remainder Theorem
- **Geometric Sieve**: Optimized prime finding using 2D geometry and early termination
- **Prime Constellations**: Twin primes, cousin primes, sexy primes, prime gaps
- **Goldbach Structures**: Goldbach pairs, vectors, and tables

## 🔢 **Number Sequences**

### Basic Sequences

```javascript
import { N, Z, R } from 'primalib'

// Natural numbers: 1, 2, 3, ...
N()           // → infinite sequence
N(10)         // → 1..10

// Integers: ..., -2, -1, 0, 1, 2, ...
Z()           // → infinite from 0
Z(-5, 5)      // → -5..5

// Real numbers: floating point sequence
R(0, 1, 2)    // → 0.00, 0.01, 0.02, ..., 1.00 (2 decimal places)
R(-1, 1, 1)   // → -1.0, -0.9, -0.8, ..., 1.0 (1 decimal place)
```

### Parity Partitions

```javascript
import { evens, odds, multiplesOf } from 'primalib'

// Even numbers: 2, 4, 6, 8, ...
evens()       // → infinite
evens(20)     // → 2, 4, 6, ..., 20

// Odd numbers: 1, 3, 5, 7, ...
odds()        // → infinite
odds(19)      // → 1, 3, 5, ..., 19

// Multiples: k, 2k, 3k, ...
multiplesOf(5)()  // → 5, 10, 15, 20, ...
multiplesOf(7)(70) // → 7, 14, 21, ..., 70
```

### Hybrid Access

```javascript
import { prima, primo } from 'primalib'

// Direct array access (FreeFunction style)
prima.N       // → [1, 2, 3, ..., 100] (pre-computed)
prima.Z       // → [-100, -99, ..., 100] (pre-computed)
prima.R       // → [0.00, 0.01, ..., 0.99] (pre-computed)

// Lazy sequences (Plugin style)
primo.N(10)   // → lazy sequence 1..10
primo.Z(-5, 5) // → lazy sequence -5..5
primo.R(0, 1, 2) // → lazy sequence 0.00..1.00
```

## 🔷 **Prime Sequences**

### Primes

```javascript
import { primes } from 'primalib'

// Infinite prime sequence: 2, 3, 5, 7, 11, ...
primes.take(10)  // → [2, 3, 5, 7, 11, 13, 17, 19, 23, 29]

// Primorial: product of first n primes
primes.primorial(3)  // → 2 * 3 * 5 = 30
```

### Prime Constellations

```javascript
import { twins, cousins, sexy, primeGaps } from 'primalib'

// Twin primes: pairs (p, p+2)
twins.take(5)  // → [[3, 5], [5, 7], [11, 13], [17, 19], [29, 31]]

// Cousin primes: pairs (p, p+4)
cousins.take(5)  // → [[3, 7], [7, 11], [13, 17], [19, 23], [37, 41]]

// Sexy primes: pairs (p, p+6)
sexy.take(5)  // → [[5, 11], [7, 13], [11, 17], [13, 19], [17, 23]]

// Prime gaps: {gap, after}
primeGaps.take(5)  // → [{gap: 2, after: 3}, {gap: 2, after: 5}, ...]
```

## 📍 **CRT Address System**

The Chinese Remainder Theorem (CRT) address system represents numbers using remainders modulo the first k primes.

### Address Creation

```javascript
import { address } from 'primalib'

// Address: [n mod 2, n mod 3, n mod 5, n mod 7, ...]
address(30)    // → [0, 0, 0, 2] (30 mod 2,3,5,7)
address(17)    // → [1, 2, 2, 3] (17 mod 2,3,5,7)
address(30, 4) // → [0, 0, 0, 2] (explicit k=4)

// Auto-expansion: automatically uses more primes for large numbers
address(30030) // → uses k=7 automatically (product of first 7 primes > 30030)
```

### Address Properties

```javascript
// Check if address is residual (all non-zero)
address.isResidual([1, 2, 3, 4])  // → true
address.isResidual([0, 1, 2, 3])  // → false (has zero)

// Reconstruct number from address
address.toNumber([0, 0, 0, 2])  // → 30
address.toNumber([1, 2, 2, 3])  // → 17
```

### Residual Space

```javascript
import { residualSpace, residualDensity } from 'primalib'

// Numbers with all non-zero residues (prime candidates)
residualSpace(4, 100).take(10)  // → [1, 11, 13, 17, 19, 23, 29, ...]

// Theoretical density of residual space
residualDensity(4)  // → ~0.228 (fraction of numbers that are residual)
```

## 🎨 **Geometric Primes**

### Complex Plane

```javascript
import { complex, primeComplex, twinComplex, quadraticCurve } from 'primalib'

// Complex numbers
const z = complex(3, 4)  // → 3 + 4i
z.coords                  // → [3, 4]

// Prime cloud in complex plane
primeComplex(10)  // → first 10 primes as complex numbers

// Twin primes as complex conjugate pairs
twinComplex(5)    // → twin pairs as complex numbers

// Quadratic curve: y = ax² + bx + c
quadraticCurve(1, 0, 0)  // → parabola y = x²
```

### Higher Dimensions

```javascript
import { quaternion, octonion, complexPlane, quaternionSpace, octonionVertices } from 'primalib'

// Quaternion: 4D
const q = quaternion(1, 2, 3, 4)  // → 1 + 2i + 3j + 4k

// Octonion: 8D
const o = octonion(1, 2, 3, 4, 5, 6, 7, 8)

// Sample spaces
complexPlane()        // → sample points in complex plane
quaternionSpace()     // → sample points in quaternion space
octonionVertices      // → vertices of octonion space
```

### Space Access

```javascript
import { space } from 'primalib'

space.C()  // → complex plane samples
space.H()  // → quaternion space samples
space.O    // → octonion vertices
```

## 🔍 **Geometric Sieve**

Optimized prime finding using geometric interpretation and early termination.

### Basic Sieve

```javascript
import { geometricSieve, isPrimeGeometric } from 'primalib'

// Find primes in range
geometricSieve(1, 100).take(25)  // → [2, 3, 5, 7, 11, ..., 97]

// With options
geometricSieve(1, 1000, { k: 5 })  // → use first 5 primes for sieving

// Single number primality test
isPrimeGeometric(17)  // → true
isPrimeGeometric(15)  // → false
```

### Batch Sieve

```javascript
import { geometricSieveBatch } from 'primalib'

// Check multiple numbers at once
geometricSieveBatch([17, 18, 19, 20, 21])  // → [17, 19] (primes only)
```

### Legacy Sieve

```javascript
import { geometricSieveLegacy, primalPlane } from 'primalib'

// Legacy hyperplane-based sieve
geometricSieveLegacy(1000)  // → primes up to 1000

// Create sieve planes
primalPlane(2, 3, 5, 7)  // → hyperplanes for first 4 primes
```

## 🏆 **Goldbach Structures**

Goldbach's Conjecture: every even number > 2 can be expressed as the sum of two primes.

### Goldbach Pairs

```javascript
import { goldbachPairs } from 'primalib'

// Find all pairs (p, q) such that p + q = n
goldbachPairs(10)  // → [{p: 3, q: 7, sum: 10}, {p: 5, q: 5, sum: 10}]
goldbachPairs(20)  // → [{p: 3, q: 17, sum: 20}, {p: 7, q: 13, sum: 20}, ...]
```

### Goldbach Vectors

```javascript
import { goldbachVectors } from 'primalib'

// Goldbach pairs with CRT address analysis
goldbachVectors(20, 4)  // → pairs with address analysis and linearity checks
```

### Goldbach Table

```javascript
import { goldbachTable } from 'primalib'

// Table of Goldbach pairs for even numbers
goldbachTable(20)  // → [{n: 4, count: 1, pairs: [...]}, {n: 6, count: 1, ...}, ...]
```

## 📐 **Geometric Functions**

### Primal Position & Distance

```javascript
import { primalPosition, primalDistance, twinDistances } from 'primalib'

// Position of number in geometric space
primalPosition(30, 3)  // → complex number representing position

// Distance between two numbers
primalDistance(17, 19, 3)  // → geometric distance

// Distances between twin primes
twinDistances(10, 3)  // → [{pair: [3,5], distance: ...}, ...]
```

### Dimensional Analysis

```javascript
import { dimensionStats, twinAdmissibility } from 'primalib'

// Statistics for k-dimensional space
dimensionStats(4, 1000)  // → {k, primes, M, residualVolume, residualCount, ...}

// Twin prime admissibility analysis
twinAdmissibility(4, 1000)  // → {k, limit, admissibleCount, actualTwins, hardyLittlewood, ratio}
```

## 🔗 **Geometric Mapping**

```javascript
import { geo } from 'primalib'

geo.primeComplex(10)      // → prime complex
geo.twinComplex(5)         // → twin complex
geo.quadraticCurve(1,0,0)  // → quadratic curve
geo.address(30)            // → CRT address
geo.geometricSieve(1, 100) // → geometric sieve
geo.isPrimeGeometric(17)   // → primality test
```

## 📋 **Complete API Reference**

### Number Sequences

| Function | Description | Example |
|----------|-------------|---------|
| `N(last?)` | Natural numbers | `N(10)` → `1..10` |
| `Z(first?, last?)` | Integers | `Z(-5, 5)` → `-5..5` |
| `R(start, end, digits)` | Real numbers | `R(0, 1, 2)` → `0.00..1.00` |
| `evens(last?)` | Even numbers | `evens(20)` → `2,4,6,...,20` |
| `odds(last?)` | Odd numbers | `odds(19)` → `1,3,5,...,19` |
| `multiplesOf(k)(last?)` | Multiples of k | `multiplesOf(5)(50)` → `5,10,...,50` |

### Primes

| Function | Description | Example |
|----------|-------------|---------|
| `primes` | Infinite prime sequence | `primes.take(10)` |
| `primes.primorial(n)` | Product of first n primes | `primes.primorial(3)` → `30` |
| `twins` | Twin prime pairs | `twins.take(5)` |
| `cousins` | Cousin prime pairs | `cousins.take(5)` |
| `sexy` | Sexy prime pairs | `sexy.take(5)` |
| `primeGaps` | Prime gaps | `primeGaps.take(5)` |

### CRT Address

| Function | Description | Example |
|----------|-------------|---------|
| `address(n, k?)` | CRT address | `address(30)` → `[0,0,0,2]` |
| `address.isResidual(addr)` | Check if residual | `address.isResidual([1,2,3])` → `true` |
| `address.toNumber(addr, k?)` | Reconstruct number | `address.toNumber([0,0,0,2])` → `30` |
| `residualSpace(k, limit)` | Residual numbers | `residualSpace(4, 100)` |
| `residualDensity(k)` | Theoretical density | `residualDensity(4)` → `~0.228` |

### Geometric Primes

| Function | Description | Example |
|----------|-------------|---------|
| `complex(re, im)` | Complex number | `complex(3, 4)` |
| `quaternion(...coords)` | Quaternion | `quaternion(1,2,3,4)` |
| `octonion(...coords)` | Octonion | `octonion(1,...,8)` |
| `primeComplex(count)` | Prime cloud | `primeComplex(10)` |
| `twinComplex(count)` | Twin primes | `twinComplex(5)` |
| `quadraticCurve(a, b, c)` | Quadratic curve | `quadraticCurve(1,0,0)` |
| `complexPlane(bounds?)` | Sample complex plane | `complexPlane()` |
| `quaternionSpace(bounds?)` | Sample quaternion space | `quaternionSpace()` |
| `octonionVertices` | Octonion vertices | `octonionVertices` |

### Geometric Sieve

| Function | Description | Example |
|----------|-------------|---------|
| `geometricSieve(start, end, options?)` | Find primes in range | `geometricSieve(1, 100)` |
| `geometricSieveBatch(numbers)` | Batch primality test | `geometricSieveBatch([17,18,19])` |
| `isPrimeGeometric(n)` | Single primality test | `isPrimeGeometric(17)` → `true` |
| `geometricSieveLegacy(limit)` | Legacy sieve | `geometricSieveLegacy(1000)` |
| `primalPlane(...primes)` | Create sieve planes | `primalPlane(2,3,5,7)` |

### Goldbach Structures

| Function | Description | Example |
|----------|-------------|---------|
| `goldbachPairs(n)` | Goldbach pairs for n | `goldbachPairs(10)` |
| `goldbachVectors(n, k?)` | Goldbach with addresses | `goldbachVectors(20, 4)` |
| `goldbachTable(maxEven)` | Table for even numbers | `goldbachTable(20)` |

### Geometry

| Function | Description | Example |
|----------|-------------|---------|
| `primalPosition(n, dimensions?)` | Position in space | `primalPosition(30, 3)` |
| `primalDistance(n1, n2, dimensions?)` | Distance between numbers | `primalDistance(17, 19, 3)` |
| `twinDistances(count, dimensions?)` | Twin prime distances | `twinDistances(10, 3)` |
| `dimensionStats(k, limit?)` | Dimensional statistics | `dimensionStats(4, 1000)` |
| `twinAdmissibility(k, limit?)` | Twin admissibility | `twinAdmissibility(4, 1000)` |

### Hybrid Access

| Object | Description | Example |
|--------|-------------|---------|
| `prima` | Direct array access | `prima.N`, `prima.Z`, `prima.R` |
| `primo` | Lazy sequences | `primo.N(10)`, `primo.Z(-5,5)` |
| `space` | Geometric spaces | `space.C()`, `space.H()`, `space.O` |
| `geo` | Geometric functions | `geo.primeComplex(10)`, `geo.address(30)` |

## 🎨 **Usage Examples**

### Example 1: Number Sequences

```javascript
import { N, evens, odds, primes } from 'primalib'

// Natural numbers
N(10).toArray()  // → [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// Evens and odds
evens(20).toArray()  // → [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]
odds(19).toArray()   // → [1, 3, 5, 7, 9, 11, 13, 15, 17, 19]

// Primes
primes.take(10).toArray()  // → [2, 3, 5, 7, 11, 13, 17, 19, 23, 29]
```

### Example 2: CRT Address System

```javascript
import { address, residualSpace } from 'primalib'

// Address representation
address(30)  // → [0, 0, 0, 2] (30 mod 2,3,5,7)
address(17)  // → [1, 2, 2, 3] (17 mod 2,3,5,7)

// Reconstruct
address.toNumber([0, 0, 0, 2])  // → 30

// Residual space (prime candidates)
residualSpace(4, 100).take(10).toArray()
// → [1, 11, 13, 17, 19, 23, 29, 31, 37, 41]
```

### Example 3: Geometric Primes

```javascript
import { primeComplex, twinComplex, complex } from 'primalib'

// Prime cloud in complex plane
primeComplex(5).toArray()
// → [complex(2%13, 2%17), complex(3%13, 3%17), ...]

// Twin primes as complex numbers
twinComplex(3).toArray()
// → [complex(3, 2), complex(5, 2), complex(11, 2)]

// Complex arithmetic
const z1 = complex(3, 4)
const z2 = complex(1, 2)
z1.add(z2)  // → complex(4, 6)
```

### Example 4: Geometric Sieve

```javascript
import { geometricSieve, isPrimeGeometric } from 'primalib'

// Find primes in range
geometricSieve(1, 100).take(25).toArray()
// → [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97]

// Single number test
isPrimeGeometric(17)  // → true
isPrimeGeometric(15)  // → false

// Batch test
geometricSieveBatch([17, 18, 19, 20, 21]).toArray()  // → [17, 19]
```

### Example 5: Goldbach Structures

```javascript
import { goldbachPairs, goldbachTable } from 'primalib'

// Goldbach pairs for 20
goldbachPairs(20).toArray()
// → [{p: 3, q: 17, sum: 20}, {p: 7, q: 13, sum: 20}]

// Goldbach table
goldbachTable(20).take(5).toArray()
// → [
//   {n: 4, count: 1, pairs: [{p: 2, q: 2}]},
//   {n: 6, count: 1, pairs: [{p: 3, q: 3}]},
//   ...
// ]
```

### Example 6: Geometric Analysis

```javascript
import { primalPosition, primalDistance, dimensionStats } from 'primalib'

// Position in geometric space
primalPosition(30, 3)  // → complex number

// Distance between numbers
primalDistance(17, 19, 3)  // → geometric distance

// Dimensional statistics
dimensionStats(4, 1000)
// → {
//     k: 4,
//     primes: [2, 3, 5, 7],
//     M: 210,
//     residualVolume: 0.228571...,
//     residualCount: 48,
//     theoreticalCount: 48
//   }
```

### Example 7: Integration with PrimaSet

```javascript
import { primaSet, primes, address, operations } from 'primalib'

// Filter primes by address pattern
primes
  .take(100)
  .filter(p => {
    const addr = address(p, 4)
    return addr[0] === 1 && addr[1] === 2  // mod 2 = 1, mod 3 = 2
  })
  .take(10)
  // → primes matching pattern

// Map primes to their addresses
primes
  .take(10)
  .map(p => ({ prime: p, address: address(p, 4) }))
  .toArray()

// Reduce with operations
primes
  .take(10)
  .reduce(operations.sum, 0)  // → sum of first 10 primes
```

## ⚡ **Performance Notes**

- **Lazy Evaluation**: All sequences are lazy - only compute when needed
- **Early Termination**: Geometric sieve uses early termination for efficiency
- **Caching**: Prime lists are cached for repeated use
- **Hybrid Access**: Use `prima` for small pre-computed arrays, `primo` for large/lazy sequences

## 🔗 **Integration**

PrimaNum integrates seamlessly with other PrimaLib modules:

```javascript
import { primaSet, primes, address, geometricSieve, operations } from 'primalib'

// Use with PrimaOps
primes.take(10).map(operations.sq)  // → squares of first 10 primes

// Use with PrimaGeo
import { point, vector } from 'primalib'
const p = primalPosition(30, 3)  // → complex (extends point)

// Use with PrimaSet
primes.take(100).filter(p => isPrimeGeometric(p))
```

## 🎓 **Mathematical Background**

### CRT Address System
- **Chinese Remainder Theorem**: Represent numbers using remainders modulo coprime moduli
- **Residual Space**: Numbers with all non-zero residues (prime candidates)
- **Density**: Theoretical density of residual space: `Π(1 - 1/p)` for primes p

### Geometric Sieve
- **Early Termination**: Stop checking divisors once one is found
- **Optimization**: Only check up to `√n` for primality
- **Caching**: Prime lists cached for efficiency

### Goldbach Conjecture
- **Conjecture**: Every even number > 2 is the sum of two primes
- **Address Analysis**: Check linearity of CRT addresses in Goldbach pairs
- **Hardy-Littlewood**: Theoretical prediction for twin primes

---

**PrimaNum** provides a comprehensive toolkit for number theory and geometric prime exploration, combining lazy evaluation with powerful mathematical structures. 🎯

