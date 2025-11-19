# PrimaLin - Linear Algebra & Polynomials

> **"Vectors, matrices, and polynomials - the building blocks of mathematical computation."**

PrimaLin extends PrimaLib with linear algebra operations (vectors, matrices) and polynomial arithmetic. Vectors extend `point` from `primageo` for seamless integration, while matrices and polynomials provide powerful mathematical tools.

## 🎯 **Architecture**

- **Vectors**: Extend `point` from `primageo` (DRY principle, high coupling)
- **Matrices**: Nested arrays with methods (`[[1,2],[3,4]]`)
- **Polynomials**: Ascending coefficient order (`[a0, a1, a2]` = `a0 + a1*x + a2*x²`)
- **Lazy evaluation**: Operations return `primaSet` where applicable

## 📐 **Vectors** (Extending Point)

Vectors are enhanced points with vector-specific operations. They support numeric indexing `[i]` and backward-compatible `.coords` access.

### Creation

```javascript
import { vector } from 'primalib'

const v = vector(1, 2, 3)
v[0]        // → 1 (numeric indexing)
v.coords    // → [1, 2, 3] (backward compatible)
v.dim       // → 3
v.type      // → 'vector'
```

### Basic Operations

```javascript
const v1 = vector(1, 2, 3)
const v2 = vector(4, 5, 6)

v1.add(v2)      // → vector(5, 7, 9)
v1.subtract(v2) // → vector(-3, -3, -3)
v1.scale(2)     // → vector(2, 4, 6)
v1.norm()       // → 3.7416573867739413 (L2 norm)
```

### Vector-Specific Operations

```javascript
// Dot product
v1.dot(v2)      // → 32 (1*4 + 2*5 + 3*6)

// Cross product (3D only)
const v3 = vector(1, 0, 0)
const v4 = vector(0, 1, 0)
v3.cross(v4)    // → vector(0, 0, 1) (right-hand rule)

// Normalize
v1.normalize()  // → unit vector in same direction

// Project
const onto = vector(1, 0, 0)
v1.project(onto) // → projection onto x-axis

// Angle between vectors
v1.angle(v2)    // → angle in radians

// Norms
v1.normL1()     // → 6 (L1: |1|+|2|+|3|)
v1.normL2()     // → 3.74... (L2: Euclidean)
v1.normLinf()   // → 3 (L∞: max(|1|,|2|,|3|))
```

### Free Functions

```javascript
import { dotProduct, crossProduct, normalize, project, angleBetween } from 'primalib'

dotProduct(v1, v2)        // → 32
crossProduct(v1, v2)       // → vector(-3, 6, -3)
normalize(v1)              // → unit vector
project(v1, onto)          // → projection
angleBetween(v1, v2)        // → angle in radians
```

### Compatibility with Point

```javascript
import { point, vector } from 'primalib'

const p = point(1, 2, 3)
const v = vector(4, 5, 6)

// Duck typing - they work together!
p.add(v)        // → point(5, 7, 9)
v.add(p)        // → vector(5, 7, 9)
dotProduct(p, v) // → 32
```

### Vector Spaces (Lazy)

```javascript
import { vectorSpace } from 'primalib'

const basis = [vector(1, 0), vector(0, 1)]
const space = vectorSpace(basis)  // Lazy generator
space.take(5)  // → First 5 linear combinations
```

## 🔢 **Matrices**

Matrices are nested arrays with mathematical operations. They support both method chaining and free functions.

### Creation

```javascript
import { matrix, identity, zeros, ones, diagonal, randomMatrix } from 'primalib'

// From nested array
const m = matrix([[1, 2], [3, 4]])

// Special matrices
identity(3)              // → 3×3 identity matrix
zeros(2, 3)              // → 2×3 zero matrix
ones(2, 2)               // → 2×2 ones matrix
diagonal([2, 3, 5])      // → diagonal matrix
randomMatrix(3, 3)       // → 3×3 random matrix
```

### Basic Operations

```javascript
const m1 = matrix([[1, 2], [3, 4]])
const m2 = matrix([[5, 6], [7, 8]])

m1.add(m2)      // → [[6, 8], [10, 12]]
m1.sub(m2)      // → [[-4, -4], [-4, -4]]
m1.scale(2)     // → [[2, 4], [6, 8]]
m1.transpose()  // → [[1, 3], [2, 4]]
```

### Matrix Multiplication

```javascript
// Matrix × Matrix
const product = m1.mul(m2)  // → [[19, 22], [43, 50]]

// Matrix × Vector
const v = vector(1, 2)
m1.mulVec(v)    // → vector(5, 11)

// Free function
import { multiply, multiplyVector } from 'primalib'
multiply([[1,2],[3,4]], [[5,6],[7,8]])  // → [[19, 22], [43, 50]]
multiplyVector([[1,2],[3,4]], [1, 2])   // → [5, 11]
```

### Determinant & Inverse

```javascript
m1.det()        // → -2 (1*4 - 2*3)
m1.inv()        // → inverse matrix

// Free functions
import { determinant, inverse } from 'primalib'
determinant([[1,2],[3,4]])  // → -2
inverse([[1,2],[3,4]])      // → [[-2, 1], [1.5, -0.5]]
```

### Advanced Operations

```javascript
m1.trace()      // → 5 (sum of diagonal)
m1.rank()       // → 2 (matrix rank)

// Eigenvalues & Eigenvectors
m1.eigenvalues()    // → primaSet of eigenvalues
m1.eigenvectors()   // → primaSet of eigenvectors

// Decompositions
const { L, U, P } = m1.lu()  // LU decomposition
const { Q, R } = m1.qr()      // QR decomposition
```

### Matrix Properties

```javascript
m.rows           // → 2 (number of rows)
m.cols           // → 2 (number of columns)
m.data           // → [[1, 2], [3, 4]] (raw data)
m.toArray()      // → [[1, 2], [3, 4]]
```

## 📊 **Polynomials**

Polynomials use ascending coefficient order: `[a0, a1, a2]` represents `a0 + a1*x + a2*x²`.

### Creation

```javascript
import { polynomial } from 'primalib'

// p(x) = 1 + 2x + 3x²
const p = polynomial([1, 2, 3])

p.coeffs         // → [1, 2, 3]
p.degree          // → 2
p.type            // → 'polynomial'
```

### Evaluation

```javascript
p.eval(0)        // → 1 (1 + 0 + 0)
p.eval(1)        // → 6 (1 + 2 + 3)
p.eval(2)        // → 17 (1 + 4 + 12)

// Free function
import { evaluate } from 'primalib'
evaluate([1, 2, 3], 2)  // → 17
```

### Basic Operations

```javascript
const p1 = polynomial([1, 2])      // 1 + 2x
const p2 = polynomial([3, 4, 5])   // 3 + 4x + 5x²

p1.add(p2)      // → [4, 6, 5] (4 + 6x + 5x²)
p1.sub(p2)      // → [-2, -2, -5]
p1.mul(p2)      // → [3, 10, 13, 10] (3 + 10x + 13x² + 10x³)

// Free functions
import { addPolynomials, multiplyPolynomials } from 'primalib'
addPolynomials([1, 2], [3, 4, 5])  // → [4, 6, 5]
```

### Division

```javascript
const dividend = polynomial([6, 5, 1])  // 6 + 5x + x²
const divisor = polynomial([1, 2])       // 1 + 2x

const result = dividend.div(divisor)
result.quotient   // → polynomial([3, 1]) (3 + x)
result.remainder  // → polynomial([0]) (no remainder)
```

### Calculus

```javascript
// Derivative
p.derivative()   // → [2, 6] (2 + 6x)

// Integral
p.integral(0)    // → [0, 1, 1, 1] (x + x² + x³/3)
p.integral(1)    // → [1, 1, 1, 1] (1 + x + x² + x³/3)

// Free functions
import { derivative, integral } from 'primalib'
derivative([1, 2, 3])  // → [2, 6]
integral([2, 6], 0)    // → [0, 2, 3]
```

### Composition & Roots

```javascript
// Compose: p1(p2(x))
p1.compose(p2)   // → polynomial composition

// Find roots
p.roots()         // → primaSet of roots (Durand-Kerner method)

// Free functions
import { composePolynomials, findRoots } from 'primalib'
composePolynomials([1, 2], [3, 4])  // → composition
findRoots([-6, 5, 1])              // → roots of 6 - 5x - x²
```

### Polynomial Sequences (Lazy)

```javascript
import { polynomialSequence } from 'primalib'

// Generate sequence: 1 + nx for n=0..5
const seq = polynomialSequence(n => [1, n], 5)
seq.take(3)  // → [polynomial([1,0]), polynomial([1,1]), polynomial([1,2])]
```

## 🔄 **Integration with PrimaSet**

All operations integrate seamlessly with `primaSet` for lazy evaluation:

```javascript
import { primaSet, vector, matrix, polynomial } from 'primalib'

// Vector operations pipeline
const vectors = primaSet([vector(1,0), vector(0,1), vector(1,1)])
vectors.map(v => v.norm())  // → [1, 1, 1.414...]

// Matrix operations pipeline
const matrices = primaSet([
  [[1,0],[0,1]],
  [[2,0],[0,2]],
  [[3,0],[0,3]]
])
matrices.map(m => determinant(m))  // → [1, 4, 9]

// Polynomial evaluation pipeline
const p = polynomial([1, 2, 3])
const xs = primaSet([0, 1, 2])
xs.map(x => p.eval(x))  // → [1, 6, 17]
```

## 📋 **Complete API Reference**

### Vectors

| Function | Description | Example |
|----------|-------------|---------|
| `vector(...coords)` | Create vector | `vector(1, 2, 3)` |
| `v.dot(w)` | Dot product | `v.dot(w)` → `32` |
| `v.cross(w)` | Cross product (3D) | `v.cross(w)` → `vector(...)` |
| `v.normalize()` | Unit vector | `v.normalize()` → `vector(...)` |
| `v.project(onto)` | Projection | `v.project(onto)` → `vector(...)` |
| `v.angle(w)` | Angle in radians | `v.angle(w)` → `0.785...` |
| `v.normL1()` | L1 norm | `v.normL1()` → `6` |
| `v.normL2()` | L2 norm | `v.normL2()` → `3.74...` |
| `v.normLinf()` | L∞ norm | `v.normLinf()` → `3` |
| `dotProduct(v, w)` | Free function | `dotProduct(v, w)` |
| `crossProduct(v, w)` | Free function | `crossProduct(v, w)` |
| `normalize(v)` | Free function | `normalize(v)` |
| `project(v, onto)` | Free function | `project(v, onto)` |
| `angleBetween(v, w)` | Free function | `angleBetween(v, w)` |
| `normL1(v)`, `normL2(v)`, `normLinf(v)` | Free functions | `normL1(v)` |
| `vectorSpace(basis)` | Generate vector space | `vectorSpace([v1, v2])` |

### Matrices

| Function | Description | Example |
|----------|-------------|---------|
| `matrix(data)` | Create matrix | `matrix([[1,2],[3,4]])` |
| `identity(n)` | Identity matrix | `identity(3)` |
| `zeros(m, n)` | Zero matrix | `zeros(2, 3)` |
| `ones(m, n)` | Ones matrix | `ones(2, 2)` |
| `diagonal([...])` | Diagonal matrix | `diagonal([2,3,5])` |
| `randomMatrix(m, n)` | Random matrix | `randomMatrix(3, 3)` |
| `m.transpose()` | Transpose | `m.transpose()` |
| `m.det()` | Determinant | `m.det()` → `-2` |
| `m.inv()` | Inverse | `m.inv()` |
| `m.mul(other)` | Multiply | `m1.mul(m2)` |
| `m.mulVec(v)` | Matrix×Vector | `m.mulVec(v)` |
| `m.add(other)` | Add | `m1.add(m2)` |
| `m.sub(other)` | Subtract | `m1.sub(m2)` |
| `m.scale(s)` | Scale | `m.scale(2)` |
| `m.trace()` | Trace | `m.trace()` → `5` |
| `m.rank()` | Rank | `m.rank()` → `2` |
| `m.eigenvalues()` | Eigenvalues | `m.eigenvalues()` → `primaSet` |
| `m.eigenvectors()` | Eigenvectors | `m.eigenvectors()` → `primaSet` |
| `m.lu()` | LU decomposition | `m.lu()` → `{L, U, P}` |
| `m.qr()` | QR decomposition | `m.qr()` → `{Q, R}` |
| `transpose(m)` | Free function | `transpose([[1,2],[3,4]])` |
| `determinant(m)` | Free function | `determinant([[1,2],[3,4]])` |
| `inverse(m)` | Free function | `inverse([[1,2],[3,4]])` |
| `multiply(m1, m2)` | Free function | `multiply(m1, m2)` |
| `multiplyVector(m, v)` | Free function | `multiplyVector(m, v)` |
| `trace(m)` | Free function | `trace([[1,2],[3,4]])` |
| `rank(m)` | Free function | `rank([[1,2],[3,4]])` |
| `eigenvalues(m)` | Free function | `eigenvalues([[1,2],[3,4]])` |
| `eigenvectors(m)` | Free function | `eigenvectors([[1,2],[3,4]])` |
| `luDecomposition(m)` | Free function | `luDecomposition(m)` |
| `qrDecomposition(m)` | Free function | `qrDecomposition(m)` |

### Polynomials

| Function | Description | Example |
|----------|-------------|---------|
| `polynomial([...])` | Create polynomial | `polynomial([1,2,3])` |
| `p.eval(x)` | Evaluate | `p.eval(2)` → `17` |
| `p.derivative()` | Derivative | `p.derivative()` → `[2,6]` |
| `p.integral(C)` | Integral | `p.integral(0)` → `[0,1,1,1]` |
| `p.add(q)` | Add | `p1.add(p2)` |
| `p.sub(q)` | Subtract | `p1.sub(p2)` |
| `p.mul(q)` | Multiply | `p1.mul(p2)` |
| `p.div(q)` | Divide | `p.div(q)` → `{quotient, remainder}` |
| `p.compose(q)` | Compose | `p1.compose(p2)` |
| `p.roots()` | Find roots | `p.roots()` → `primaSet` |
| `evaluate(coeffs, x)` | Free function | `evaluate([1,2,3], 2)` |
| `derivative(coeffs)` | Free function | `derivative([1,2,3])` |
| `integral(coeffs, C)` | Free function | `integral([2,6], 0)` |
| `addPolynomials(p1, p2)` | Free function | `addPolynomials([1,2], [3,4])` |
| `subtractPolynomials(p1, p2)` | Free function | `subtractPolynomials([1,2], [3,4])` |
| `multiplyPolynomials(p1, p2)` | Free function | `multiplyPolynomials([1,2], [3,4])` |
| `dividePolynomials(p1, p2)` | Free function | `dividePolynomials([6,5,1], [1,2])` |
| `composePolynomials(p1, p2)` | Free function | `composePolynomials([1,2], [3,4])` |
| `findRoots(coeffs)` | Free function | `findRoots([-6,5,1])` |
| `polynomialSequence(fn, max)` | Generate sequence | `polynomialSequence(n => [1,n], 5)` |

## 🎨 **Usage Examples**

### Example 1: Vector Operations

```javascript
import { vector, dotProduct, crossProduct } from 'primalib'

const v1 = vector(1, 2, 3)
const v2 = vector(4, 5, 6)

// Dot product
const dot = v1.dot(v2)  // → 32

// Cross product
const cross = v1.cross(v2)  // → vector(-3, 6, -3)

// Normalize
const unit = v1.normalize()  // → unit vector

// Projection
const onto = vector(1, 0, 0)
const proj = v1.project(onto)  // → vector(1, 0, 0)
```

### Example 2: Matrix Operations

```javascript
import { matrix, identity, determinant, inverse } from 'primalib'

// Create matrices
const A = matrix([[1, 2], [3, 4]])
const I = identity(2)

// Operations
const det = A.det()           // → -2
const inv = A.inv()           // → inverse matrix
const product = A.mul(I)      // → A (identity property)

// Matrix × Vector
const v = vector(1, 2)
const result = A.mulVec(v)    // → vector(5, 11)
```

### Example 3: Polynomial Arithmetic

```javascript
import { polynomial } from 'primalib'

// p(x) = 1 + 2x + 3x²
const p = polynomial([1, 2, 3])

// Evaluate
p.eval(0)  // → 1
p.eval(1)  // → 6
p.eval(2)  // → 17

// Derivative: 2 + 6x
const deriv = p.derivative()  // → polynomial([2, 6])

// Integral: x + x² + x³
const integ = p.integral(0)   // → polynomial([0, 1, 1, 1])
```

### Example 4: Linear System Solving

```javascript
import { matrix, vector } from 'primalib'

// Solve Ax = b using inverse
const A = matrix([[2, 1], [1, 1]])
const b = vector(3, 2)

const x = A.inv().mulVec(b)  // → vector(1, 1)
```

### Example 5: Eigenvalue Decomposition

```javascript
import { matrix, diagonal } from 'primalib'

// Diagonal matrix has eigenvalues on diagonal
const D = diagonal([2, 3, 5])
const evals = D.eigenvalues()
[...evals]  // → [2, 3, 5] (approximately)
```

### Example 6: Polynomial Root Finding

```javascript
import { polynomial } from 'primalib'

// p(x) = x² - 5x + 6 = (x-2)(x-3)
const p = polynomial([6, -5, 1])
const roots = p.roots()
[...roots]  // → [2, 3] (approximately)
```

### Example 7: Integration with PrimaSet

```javascript
import { primaSet, vector, matrix, polynomial } from 'primalib'

// Vector operations pipeline
const vectors = primaSet([
  vector(1, 0),
  vector(0, 1),
  vector(1, 1)
])
vectors.map(v => v.norm())  // → [1, 1, 1.414...]

// Matrix operations pipeline
const matrices = primaSet([
  [[1,0],[0,1]],
  [[2,0],[0,2]],
  [[3,0],[0,3]]
])
matrices.map(m => determinant(m))  // → [1, 4, 9]

// Polynomial evaluation pipeline
const p = polynomial([1, 2, 3])
const xs = primaSet([0, 1, 2])
xs.map(x => p.eval(x))  // → [1, 6, 17]
```

## ⚡ **Performance Notes**

### Numeric Indexing

- **Use `[i]`** for convenience in external code (acceptable overhead)
- **Use `.coords[i]`** in loops and internal methods (14x faster)

```javascript
// Fast: Direct access in loops
verts.filter(v => (v.coords[0] + v.coords[1]) % 2 === 0)

// Convenient: Numeric indexing for user code
const v = vector(1, 2, 3)
v[0]  // → 1 (convenient, acceptable overhead)
```

### Internal Optimization

- Point/vector methods use `this.coords` directly (no Proxy overhead)
- Mathematical operations extract `coords` first, then use array access
- Proxy handler uses `target.coords[idx]` directly

## 🔗 **Integration**

PrimaLin integrates seamlessly with other PrimaLib modules:

```javascript
import { point, vector, matrix, polynomial, primaSet, N } from 'primalib'

// Geometry + Linear Algebra
const p = point(1, 2, 3)
const v = vector(4, 5, 6)
p.add(v)  // → point(5, 7, 9)

// Linear Algebra + Sequences
const vectors = N(10).map(n => vector(n, n*2, n*3))
vectors.map(v => v.norm())  // → norms of vectors

// Matrices + Polynomials
const coeffs = matrix([[1,2],[3,4]]).eigenvalues()
const poly = polynomial([...coeffs])
```

## 📚 **Namespace**

All functions are exported from `primalib`:

```javascript
import {
  // Vectors
  vector, dotProduct, crossProduct, normalize, project, angleBetween,
  normL1, normL2, normLinf, vectorSpace,
  
  // Matrices
  matrix, identity, zeros, ones, diagonal, randomMatrix,
  transpose, determinant, inverse, multiply, multiplyVector,
  addMatrices, subtractMatrices, scaleMatrix, trace, rank,
  eigenvalues, eigenvectors, luDecomposition, qrDecomposition,
  
  // Polynomials
  polynomial, evaluate, derivative, integral,
  addPolynomials, subtractPolynomials, multiplyPolynomials, dividePolynomials,
  composePolynomials, findRoots, polynomialSequence
} from 'primalib'
```

## 🎓 **Mathematical Background**

### Vectors
- **Dot product**: `v·w = Σ(vᵢ × wᵢ)`
- **Cross product**: Right-hand rule, 3D only
- **Norms**: L1 (Manhattan), L2 (Euclidean), L∞ (Chebyshev)

### Matrices
- **Determinant**: Recursive expansion (Laplace)
- **Inverse**: Adjugate method
- **Eigenvalues**: QR algorithm (iterative)
- **LU/QR**: Standard decompositions

### Polynomials
- **Coefficient order**: Ascending `[a₀, a₁, a₂]` = `a₀ + a₁x + a₂x²`
- **Root finding**: Durand-Kerner method
- **Division**: Polynomial long division

## 🚀 **Quick Start**

```javascript
import { vector, matrix, polynomial } from 'primalib'

// Create a vector
const v = vector(1, 2, 3)
console.log(v[0], v[1], v[2])  // → 1, 2, 3

// Create a matrix
const m = matrix([[1, 2], [3, 4]])
console.log(m.det())  // → -2

// Create a polynomial
const p = polynomial([1, 2, 3])  // 1 + 2x + 3x²
console.log(p.eval(2))  // → 17
```

---

**PrimaLin** completes PrimaLib's mathematical toolkit, providing vectors, matrices, and polynomials with seamless integration and lazy evaluation support. 🎯

