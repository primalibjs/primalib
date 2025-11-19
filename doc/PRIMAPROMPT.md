# PrimaLib AI Reference

> **"Compact, high-density reference for AI/LLMs to use PrimaLib correctly following its standards and conventions."**

## 🎯 **Core Philosophy**

**Everything is a set.** PrimaLib treats numbers, arrays, infinite sequences, objects, trees, and DOM elements uniformly as lazy, iterable sets via `primaSet`. Operations are lazy by default—compute only what's needed.

```javascript
primaSet(42)           // → {42} (singleton)
primaSet([1,2,3])      // → {1,2,3} (finite)
primaSet(primes)       // → {2,3,5,7,11,...} (infinite, lazy)
```

## 📦 **Main Constructs**

### PrimaSet Factory

```javascript
import { primaSet } from 'primalib'

// Accepts: numbers, arrays, iterables, generators, objects, DOM
primaSet(value)        // Universal factory
primaSet([1,2,3])      // Array → lazy set
primaSet(N())          // Infinite sequence → lazy set
primaSet(42)           // Scalar → singleton set {42}
```

**Key properties**: Lazy, iterable, composable. Never materializes more than needed.

### Number Sequences

```javascript
import { N, Z, R, primes } from 'primalib'

N()                    // Naturals: 1,2,3,... (infinite)
N(10)                  // 1..10 (finite)
Z()                    // Integers: 0,1,-1,2,-2,... (infinite)
Z(-5, 5)               // -5..5 (finite)
R(0, 1, 2)             // Reals: 0.00,0.01,...,1.00 (step 0.01)
primes                 // Infinite primes: 2,3,5,7,11,...
```

**Convention**: `N()`, `Z()`, `R()` are generators. `primes` is a generator. All return lazy sequences.

### Operations (Free Functions)

```javascript
import { sq, sqrt, add, mul, sum, mean, min, max } from 'primalib'

sq(x)                  // Square
sqrt(x)                 // Square root
add(a, b)               // Addition
mul(a, b)               // Multiplication
sum(arr)                // Sum all elements
mean(arr)               // Average
min(arr)                // Minimum
max(arr)                // Maximum
```

**Convention**: Free functions work on arrays/iterables. Use with `primaSet` for lazy evaluation.

### Methods (Chaining)

```javascript
import { primaSet, N } from 'primalib'

// All primaSet instances have methods
N(10).map(x => x * 2)           // → [2,4,6,8,10,12,14,16,18,20]
N(10).filter(x => x % 2 === 0)  // → [2,4,6,8,10]
N(10).take(5)                   // → [1,2,3,4,5]
N(10).sum()                     // → 55
N(10).sq()                      // → [1,4,9,16,25,36,49,64,81,100]
```

**Convention**: Methods return `primaSet` instances (chainable) except materialization methods (`.toArray()`, `.get()`, `.count()`).

### Geometry

```javascript
import { point, vector, space, line, rectangle, square, cube } from 'primalib'

point(1, 2, 3)                  // 3D point
point(1, 2).add(point(3, 4))     // → point(4, 6)
point(3, 4).norm()              // → 5 (Euclidean norm)

vector(1, 2, 3)                  // Vector (extends point)
vector(1, 2).dot(vector(3, 4))   // → 11 (dot product)
vector(1, 2, 3).cross(vector(4, 5, 6))  // → cross product (3D only)

space([0,0], [1,1])          // 2D square
space([0,0,0], [1,1,1])      // 3D cube
line(0, 5)                       // 1D line segment
rectangle([0,0], [2,3])          // 2D rectangle
square([0,0], 2)                 // 2D square
cube([0,0,0], 2)                 // 3D cube
```

**Convention**: `point` and `vector` support numeric indexing (`p[0]`, `p[1]`) and destructuring (`const [x,y] = point(1,2)`). Use `.coords` for backward compatibility.

### Linear Algebra

```javascript
import { matrix, polynomial } from 'primalib'

// Matrices: nested arrays [[row1], [row2], ...]
const m = matrix([[1,2], [3,4]])
m.det()                          // Determinant
m.inv()                          // Inverse
m.mul(matrix([[5],[6]]))         // Matrix multiplication
m.transpose()                    // Transpose
m.trace()                        // Trace

// Polynomials: coefficients in ascending order [a0, a1, a2, ...]
const p = polynomial([1, 2, 3])  // 1 + 2x + 3x²
p.eval(2)                        // → 17
p.derivative()                   // → polynomial([2, 6]) (2 + 6x)
p.roots()                        // → [roots...] (Durand-Kerner)
```

**Convention**: Matrix data is `[[row1], [row2], ...]`. Polynomial coefficients are `[a0, a1, a2, ...]` (ascending order).

### Tree Handling

```javascript
import { node, tree, treeFromArray, treeFromObject, vdom } from 'primalib'

// Node factory
const root = node({ a: 1, b: { c: 2 } })
root.children()                  // → iterator of child nodes
root.walk('depth')               // → depth-first traversal
root.walk('breadth')             // → breadth-first traversal
root.walk('leaves')              // → leaves only
root.address()                   // → "root" (dot notation)
root.find('b.c')                 // → node with value 2

// Tree builders
tree({ a: 1, b: 2 })             // → tree node
treeFromArray([1, [2, 3]])       // → tree from nested array
treeFromObject({ a: 1, b: 2 })   // → tree from object
vdom({ tag: 'div', children: [...] })  // → Virtual DOM node
```

**Convention**: Trees are `primaSet` instances with `.parent`, `.key`, `.children()`, `.walk()`, `.address()`, `.find()`.

## 🔄 **Conventions & Patterns**

### Lazy Evaluation

**Always lazy by default.** Materialize only when needed:

```javascript
// ✅ Good: Lazy
const squares = N().map(x => x * x)  // Infinite, lazy
squares.take(10)                      // Materializes only 10

// ❌ Avoid: Premature materialization
const squares = N().map(x => x * x).toArray()  // Materializes all (infinite!)

// ✅ Good: Materialize when needed
const first100 = primes.take(100).toArray()    // Materialize 100
```

### Method Chaining

**Methods return `primaSet` instances** (except materialization):

```javascript
// ✅ Good: Chainable
N(10).filter(x => x % 2 === 0).map(x => x * x).take(5)

// ✅ Good: Materialize at end
N(10).filter(x => x % 2 === 0).map(x => x * x).take(5).toArray()

// ❌ Avoid: Materialize in middle
N(10).filter(x => x % 2 === 0).toArray().map(x => x * x)  // Loses laziness
```

### Free Functions vs Methods

**Use free functions for composition, methods for chaining:**

```javascript
// Free functions (composition)
import { sum, sq } from 'primalib'
sum(sq(N(10)))                    // → 385

// Methods (chaining)
N(10).sq().sum()                  // → 385

// ✅ Both work, choose based on style
```

### Materialization Methods

**Materialize with**: `.toArray()`, `.get(index)`, `.count()`, `.valueOf()`, iteration (`for...of`, `[...set]`)

```javascript
primes.take(10).toArray()         // → [2,3,5,7,11,13,17,19,23,29]
primes.get(4)                     // → 11 (5th prime, 0-indexed)
primes.take(100).count()          // → 100
[...primes.take(5)]               // → [2,3,5,7,11]
```

### Memoization & Caching

**Use for repeated access:**

```javascript
// Memoize for repeated access
const memo = primaSet(primes, { memo: 1000 })  // Materialize first 1000
memo[0]                                        // Fast (cached)
memo[500]                                      // Fast (cached)

// Cache for sliding window
const cached = primaSet(primes, { cache: 5000 })  // Window of 5000
```

**Convention**: `memo: N` or `memo: true` (defaults to 1000). `cache: N` for sliding window.

### Numeric Indexing

**Points and vectors support numeric indexing:**

```javascript
const p = point(1, 2, 3)
p[0]                              // → 1
p[1]                              // → 2
p.coords                          // → [1, 2, 3] (backward compatibility)

const [x, y, z] = point(1, 2, 3)  // Destructuring works
```

**Performance**: Use `.coords[i]` in performance-critical loops (bypasses Proxy overhead).

## 📚 **Module Overview**

### Core Modules

- **`primaset.mjs`**: Core lazy set factory (`primaSet`)
- **`primaops.mjs`**: Operations, methods, generators (`sq`, `sum`, `mean`, etc.)
- **`primanum.mjs`**: Number sequences (`N`, `Z`, `R`, `primes`)
- **`primageo.mjs`**: Geometry (`point`, `vector`, `space`, etc.)
- **`primalin.mjs`**: Linear algebra (`matrix`, `polynomial`, `vector` operations)
- **`primatree.mjs`**: Tree handling (`node`, `tree`, `vdom`)
- **`primastat.mjs`**: Statistics (`mean`, `stddev`, `variance`, etc.)
- **`primatopo.mjs`**: Topology (`eulerCharacteristic`, `bettiNumbers`, etc.)
- **`primaweb.mjs`**: Web pipeline (`PrimaWeb`, `el`, `on`, `send`)
- **`prima3d.mjs`**: Three.js visualization

### Import Patterns

```javascript
// Unified namespace (recommended)
import { N, primes, point, matrix, primaSet } from 'primalib'

// Module-specific (if needed)
import { primaSet } from 'primalib/primaset.mjs'
import { point } from 'primalib/primageo.mjs'
```

## 🎨 **Code Generation Guidelines**

### When Generating PrimaLib Code

1. **Always use lazy evaluation** unless materialization is explicitly needed
2. **Prefer method chaining** for readability: `N(10).filter(...).map(...).take(5)`
3. **Use free functions** for composition: `sum(sq(N(10)))`
4. **Materialize at the end**: `.toArray()`, `.get()`, `.count()`
5. **Use `primaSet()` for everything**: numbers, arrays, sequences, objects
6. **Memoize for repeated access**: `{ memo: 1000 }` for large sequences
7. **Points/vectors**: Use numeric indexing `p[0]` or `.coords[0]` (performance-critical)
8. **Matrices**: Nested arrays `[[row1], [row2], ...]`
9. **Polynomials**: Ascending coefficients `[a0, a1, a2, ...]`

### Common Patterns

```javascript
// Sum of squares
sum(sq(N(10)))                    // → 385
N(10).sq().sum()                  // → 385

// Filter and transform
N(20).filter(x => x % 2 === 0).map(x => x * x).take(5)

// Infinite sequences
primes.take(100)                  // First 100 primes
N().take(50)                     // First 50 naturals

// Geometry
point(1, 2).add(point(3, 4))     // → point(4, 6)
vector(1, 2, 3).norm()           // → √14

// Linear algebra
matrix([[1,2],[3,4]]).det()      // → -2
polynomial([1,2,3]).eval(2)       // → 17

// Tree traversal
node({a:1, b:2}).walk('depth')   // Depth-first iterator
```

## ⚠️ **Important Gotchas**

1. **Lazy by default**: Don't materialize infinite sequences prematurely
2. **Method chaining**: Methods return `primaSet`, materialize at end
3. **Polynomial order**: Coefficients in ascending order `[a0, a1, a2, ...]`
4. **Matrix format**: Nested arrays `[[row1], [row2], ...]`
5. **Numeric indexing**: Points/vectors support `p[0]`, but use `.coords[i]` in tight loops
6. **Memoization**: Use `{ memo: N }` for repeated access, not for single-pass
7. **Infinite sequences**: Always use `.take(n)` or `.get(i)` to bound
8. **Tree nodes**: Created via `node()`, not `primaSet()` directly

## 🔗 **Quick Reference**

- **Core**: `primaSet(value)` - Universal factory
- **Sequences**: `N()`, `Z()`, `R()`, `primes` - Infinite generators
- **Operations**: `sq`, `sum`, `mean`, `min`, `max` - Free functions
- **Methods**: `.map()`, `.filter()`, `.take()`, `.sum()` - Chainable
- **Geometry**: `point()`, `vector()`, `space()` - Geometric objects
- **Linear**: `matrix()`, `polynomial()` - Linear algebra
- **Tree**: `node()`, `tree()`, `vdom()` - Tree structures
- **Materialize**: `.toArray()`, `.get(i)`, `.count()`, `[...set]`

## 📖 **Full Documentation**

- **[PRIMASET.md](../core/PRIMASET.md)** - Core lazy set factory
- **[PRIMAOPS.md](./PRIMAOPS.md)** - Operations & methods
- **[PRIMANUM.md](../num/PRIMANUM.md)** - Number sequences
- **[PRIMAGEO.md](../geo/PRIMAGEO.md)** - Geometry
- **[PRIMALIN.md](../lin/PRIMALIN.md)** - Linear algebra
- **[PRIMATREE.md](../tree/PRIMATREE.md)** - Tree handling
- **[QUICKREF.md](./QUICKREF.md)** - Quick syntax reference
- **[PATTERNS.md](./PATTERNS.md)** - Common patterns

---

**AI Reference** - *Use PrimaLib correctly, following its conventions.* 🤖

