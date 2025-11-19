# PrimaGeo - Geometry & Hyperdimensional Structures

> **"Points, spaces, and geometric primitives - exploring n-dimensional space with lazy evaluation."**

PrimaGeo provides geometric primitives for n-dimensional space, including points, spaces (geometric and algebraic), and power-of-2 algebras (complex, quaternion, octonion). All structures support lazy evaluation and integrate seamlessly with PrimaSet.

> 📖 **See also**: [SPACE.md](./SPACE.md) for detailed information about Space as hyperplanes, the `isAlgebraic` property, and the Frobenius Theorem.

## 🎯 **Architecture**

- **Space**: Unified geometric and algebraic space (single class, no inheritance)
  - Geometric by default (any dimension)
  - Algebraic when power-of-2 (2D, 4D, 8D) - where division algebras live
  - Direct relation with Point: `space.point()` creates the right type
  - See [SPACE.md](./SPACE.md) for details about Space as hyperplanes and the Frobenius Theorem
- **Points**: n-dimensional points with numeric indexing and destructuring support
  - Unified hierarchy: `point` → `complex` → `quaternion` → `octonion`
- **Complex Numbers**: Full algebraic operations (multiplication, division, exponentiation)
- **Quaternions**: 4D rotations and non-commutative algebra
- **Octonions**: 8D non-associative algebra

## 📍 **Points**

Points are n-dimensional coordinates with convenient access patterns.

### Creation

```javascript
import { point } from 'primalib'

// Create points
const p = point(1, 2, 3)
p[0]        // → 1 (numeric indexing)
p[1]        // → 2
p.coords    // → [1, 2, 3] (backward compatible)
p.dim       // → 3
```

### Numeric Indexing & Destructuring

```javascript
const p = point(1, 2, 3)

// Numeric indexing
p[0]  // → 1
p[1]  // → 2
p[2]  // → 3

// Destructuring
const [x, y, z] = p  // → x=1, y=2, z=3

// 'in' operator
0 in p  // → true
3 in p  // → false

// Object.keys includes indices
Object.keys(p)  // → ['coords', 'dim', 'add', 'subtract', 'scale', 'norm', '0', '1', '2']
```

### Basic Operations

```javascript
const p1 = point(1, 2, 3)
const p2 = point(4, 5, 6)

// Addition
p1.add(p2)      // → point(5, 7, 9)

// Subtraction
p1.subtract(p2) // → point(-3, -3, -3)

// Scalar multiplication
p1.scale(2)     // → point(2, 4, 6)

// Euclidean norm (distance from origin)
p1.norm()       // → 3.7416573867739413

// Distance between two points
p1.distance(p2) // → 5.196152422706632
```

### Compatibility

Points work with vectors and other point-like objects:

```javascript
import { point, vector } from 'primalib'

const p = point(1, 2, 3)
const v = vector(4, 5, 6)

// Duck typing - they work together!
p.add(v)  // → point(5, 7, 9)
```

## 🌌 **Space**

Space is the unified geometric and algebraic environment where Points live. By default, Space is geometric. When dimension is power-of-2 (2D, 4D, 8D), Space is algebraic (division algebra lives here).

### Creation

```javascript
import { space, algebraicSpace, complexSpace } from '@primalib/core'

// Geometric space (any dimension)
const cube = space([0, 0, 0], [1, 1, 1])  // 3D
cube.isAlgebraic  // → false
cube.algebra      // → null

// Algebraic space (power-of-2: 2D, 4D, 8D)
const C = space([0, 0], [1, 1])  // 2D
C.isAlgebraic  // → true
C.algebra      // → 'complex'

// Convenience factories
const C2 = complexSpace()        // 2D algebraic space
const H = algebraicSpace(4)      // 4D algebraic space
const O = algebraicSpace(8)      // 8D algebraic space
```

### Direct Relation with Point

```javascript
const C = space([0, 0], [1, 1])  // 2D algebraic space
const z = C.point(3, 4)  // → complex(3, 4) ✓

const cube = space([0, 0, 0], [1, 1, 1])  // 3D geometric space
const p = cube.point(1, 2, 3)  // → point(1, 2, 3) ✓
```

### Geometric Operations (Always Available)

```javascript
const s = space([0, 0], [2, 2])

// Vertices
s.vertices()  // → [point(0,0), point(2,0), point(0,2), point(2,2)]

// Sampling
s.sample(5)  // → primaSet of 36 points (6×6 grid)

// Containment
s.contains(point(1, 1))  // → true
s.contains(point(3, 3))  // → false

// Subdivision
s.subdivide(0, 2)  // → primaSet of 2 spaces along dimension 0
```

### Algebraic Operations (Power-of-2 Only)

```javascript
const C = space([0, 0], [1, 1])  // 2D algebraic

// Split by modular classes
C.split()  // → { even: [...], odd: [...] }

// Get basis vectors
C.units()  // → [point(1,0), point(0,1)]

// Create algebraic element
const z = C.point(3, 4)  // → complex(3, 4)
```

### Projection & Distance

```javascript
// Algebraic spaces: automatic projection
const C = space([0, 0], [1, 1])
C.project(point(3, 4))  // → algebraic projection (no normal needed)
C.distance(point(3, 4))  // → algebraic distance

// Geometric spaces: require normal vector
const cube = space([0, 0, 0], [1, 1, 1])
cube.project(point(1,1,1), [1,0,0])  // → geometric projection
cube.distance(point(1,1,1), [1,0,0])  // → geometric distance
```

## 📐 **Ergonomic Helpers**

Convenience functions for common space shapes:

```javascript
import { space } from '@primalib/core'

// 1D line
const line = (start, end) => space([start], [end - start])

// 2D rectangle
const rectangle = (w, h) => space([0, 0], [w, h])

// 2D square
const square = (side) => space([0, 0], [side, side])

// 3D cube
const cube = (side) => space([0, 0, 0], [side, side, side])

// Usage
line(0, 10)        // → 1D space from 0 to 10
rectangle(5, 3)    // → 2D space 5×3
square(4)          // → 2D space 4×4
cube(3)            // → 3D space 3×3×3
```

## 🔢 **Complex Numbers**

Complex numbers with full algebraic operations.

### Creation

```javascript
import { complex, C } from 'primalib'

// Create complex numbers
const z = complex(3, 4)  // → 3 + 4i
const z2 = C(1, 2)       // → alias for complex(1, 2)

z.re  // → 3 (real part)
z.im  // → 4 (imaginary part)
z.coords  // → [3, 4]
z.type  // → 'complex'
```

### Basic Operations

```javascript
const z1 = complex(3, 4)
const z2 = complex(1, 2)

// Addition (inherited from point)
z1.add(z2)  // → complex(4, 6)

// Subtraction (inherited from point)
z1.subtract(z2)  // → complex(2, 2)

// Scalar multiplication (inherited from point)
z1.scale(2)  // → complex(6, 8)

// Norm (magnitude)
z1.norm()  // → 5 (√(3² + 4²))
```

### Complex-Specific Operations

```javascript
const z = complex(3, 4)

// Multiplication: (a+bi)(c+di) = (ac-bd) + (ad+bc)i
z.mul(complex(1, 2))  // → complex(-5, 10)

// Conjugate: a - bi
z.conj()  // → complex(3, -4)

// Inverse: 1/z = conj(z) / |z|²
z.inv()  // → complex(0.12, -0.16)

// Exponential: e^z = e^a(cos b + i sin b)
complex(0, Math.PI).exp()  // → complex(-1, 0) (Euler's identity)

// Logarithm: ln(z) = ln|z| + i arg(z)
z.log()  // → complex(ln(5), atan2(4,3))

// Power: z^n using De Moivre's theorem
z.pow(2)  // → complex(-7, 24)
```

### Three.js Integration

```javascript
const z = complex(3, 4)

z.toVector3()  // → {x: 3, y: 4, z: 0}
z.toArray()    // → [3, 4]
```

## 🔄 **Quaternions**

Quaternions for 3D rotations and 4D algebra.

### Creation

```javascript
import { quaternion, H } from 'primalib'

// Create quaternions: w + xi + yj + zk
const q = quaternion(1, 2, 3, 4)  // → 1 + 2i + 3j + 4k
const q2 = H(0, 1, 0, 0)          // → alias for quaternion(0, 1, 0, 0)

q.w  // → 1 (scalar part)
q.x  // → 2 (i component)
q.y  // → 3 (j component)
q.z  // → 4 (k component)
q.type  // → 'quaternion'
```

### Basic Operations

```javascript
const q1 = quaternion(1, 2, 3, 4)
const q2 = quaternion(0, 1, 0, 0)

// Addition (inherited from point)
q1.add(q2)  // → quaternion(1, 3, 3, 4)

// Subtraction (inherited from point)
q1.subtract(q2)  // → quaternion(1, 1, 3, 4)

// Scalar multiplication (inherited from point)
q1.scale(2)  // → quaternion(2, 4, 6, 8)

// Norm (magnitude)
q1.norm()  // → √30
```

### Quaternion-Specific Operations

```javascript
const q = quaternion(1, 0, 0, 0)  // Unit quaternion

// Multiplication (non-commutative!)
const i = quaternion(0, 1, 0, 0)
const j = quaternion(0, 0, 1, 0)
i.mul(j)  // → quaternion(0, 0, 0, 1) (k)
j.mul(i)  // → quaternion(0, 0, 0, -1) (-k) - different!

// Conjugate: w - xi - yj - zk
q.conj()  // → quaternion(1, -2, -3, -4)

// Inverse: q⁻¹ = conj(q) / |q|²
q.inv()  // → inverse quaternion

// Rotate 3D vector: v' = q v q⁻¹
const v = point(1, 0, 0)
q.rotate(v)  // → rotated vector
```

### Rotation Matrix

```javascript
const q = quaternion(1, 0, 0, 0)  // Unit quaternion

// Convert to rotation matrix
q.toRotationMatrix()
// → [
//     [1, 0, 0],
//     [0, 1, 0],
//     [0, 0, 1]
//   ]
```

### Three.js Integration

```javascript
const q = quaternion(1, 2, 3, 4)

q.toVector3()  // → {x: 2, y: 3, z: 4}
q.toArray()    // → [1, 2, 3, 4]
```

## 🎭 **Octonions**

Octonions for 8D non-associative algebra.

### Creation

```javascript
import { octonion, O } from 'primalib'

// Create octonions: e0 + e1i + e2j + e3k + e4l + e5m + e6n + e7o
const o = octonion(1, 2, 3, 4, 5, 6, 7, 8)
const o2 = O(0, 1, 0, 0, 0, 0, 0, 0)  // → alias

o.e0  // → 1
o.e1  // → 2
// ... e2 through e7
o.type  // → 'octonion'
```

### Basic Operations

```javascript
const o = octonion(1, 2, 3, 4, 5, 6, 7, 8)

// Addition (inherited from point)
o.add(octonion(1, 1, 1, 1, 1, 1, 1, 1))

// Subtraction (inherited from point)
o.subtract(octonion(1, 1, 1, 1, 1, 1, 1, 1))

// Scalar multiplication (inherited from point)
o.scale(2)

// Norm (magnitude)
o.norm()  // → √(1² + 2² + ... + 8²)
```

### Octonion-Specific Operations

```javascript
const o1 = octonion(1, 0, 0, 0, 0, 0, 0, 0)
const o2 = octonion(0, 1, 0, 0, 0, 0, 0, 0)

// Multiplication (non-associative!)
// (o1 * o2) * o3 ≠ o1 * (o2 * o3) in general
o1.mul(o2)  // → octonion multiplication using Fano plane

// Conjugate: negate all imaginary parts
o.conj()  // → octonion(1, -2, -3, -4, -5, -6, -7, -8)

// Norm: |o| = √(Σeᵢ²)
o.norm()
```

### Three.js Integration

```javascript
const o = octonion(1, 2, 3, 4, 5, 6, 7, 8)

o.toVector3()  // → {x: 2, y: 3, z: 4} (first 3 imaginary parts)
o.toArray()    // → [1, 2, 3, 4, 5, 6, 7, 8]
```

## ✈️ **Hyperplanes**

Hyperplanes for geometric projections and distance calculations.

### Creation

```javascript
import { hyperplane, plane } from 'primalib'

// Create hyperplane: origin + normal vector
const hp = hyperplane([0, 0, 0], [1, 0, 0])  // Plane through origin, normal to x-axis

// Ergonomic helper for 3D planes
const p = plane([1, 1, 1], 0)  // Plane with normal [1,1,1], offset 0
```

### Projection

```javascript
const hp = hyperplane([0, 0, 0], [1, 0, 0])
const pt = point(5, 3, 2)

// Project point onto hyperplane
hp.project(pt)  // → point projected onto plane
```

### Distance

```javascript
const hp = hyperplane([0, 0, 0], [1, 0, 0])
const pt = point(5, 3, 2)

// Distance from point to hyperplane
hp.distance(pt)  // → 5 (distance along normal)
```

### Sampling

```javascript
const hp = hyperplane([0, 0, 0], [1, 0, 0])

// Sample points on hyperplane (lazy)
hp.sample([-1, 1, -1, 1], 5)  // → primaSet of points on plane
```

### Slicing

```javascript
import { slice, space } from '@primalib/core'

// Slice space with hyperplane
const s = space([0,0,0], [1,1,1])
const hp = hyperplane([0.5, 0, 0], [1, 0, 0])
slice(s, hp)  // → points near the hyperplane
```

## 🔧 **Power-of-2 Helpers**

Special functions for power-of-2 dimensions (2, 4, 8).

### Splitting Algebraic Spaces

```javascript
import { space } from '@primalib/core'

// Split algebraic space
const C = space([0, 0], [1, 1])  // 2D algebraic
C.split()  // → {even: [...], odd: [...]}
```

## 📋 **Complete API Reference**

### Points

| Function | Description | Example |
|----------|-------------|---------|
| `point(...coords)` | Create n-dimensional point | `point(1, 2, 3)` |
| `p[i]` | Numeric indexing | `p[0]` → `1` |
| `p.coords` | Coordinates array | `p.coords` → `[1, 2, 3]` |
| `p.dim` | Dimension | `p.dim` → `3` |
| `p.add(q)` | Add points | `p1.add(p2)` |
| `p.subtract(q)` | Subtract points | `p1.subtract(p2)` |
| `p.scale(f)` | Scalar multiply | `p.scale(2)` |
| `p.norm()` | Euclidean norm | `p.norm()` → `3.74...` |
| `p.distance(q)` | Distance between points | `p1.distance(p2)` |

### Spaces

| Function | Description | Example |
|----------|-------------|---------|
| `space(corner, sides)` | Create space | `space([0,0], [1,1])` |
| `s.dim` | Dimension | `s.dim` → `2` |
| `s.isAlgebraic` | Is algebraic? | `s.isAlgebraic` → `true` |
| `s.algebra` | Algebra type | `s.algebra` → `'complex'` |
| `s.vertices()` | Get vertices | `s.vertices()` |
| `s.sample(res)` | Sample interior | `s.sample(10)` |
| `s.contains(p)` | Check containment | `s.contains(p)` |
| `s.subdivide(dim, parts)` | Subdivide | `s.subdivide(0, 2)` |
| `s.project(p, normal?)` | Project point | `s.project(p)` |
| `s.distance(p, normal?)` | Distance to space | `s.distance(p)` |
| `s.split()` | Split (algebraic) | `s.split()` |
| `s.units()` | Basis vectors | `s.units()` |
| `s.point(...coords)` | Create point | `s.point(3, 4)` |
| `s.vector(...coords)` | Create vector | `s.vector(1, 2, 3)` |
| `s.toThreeMesh()` | Three.js format | `s.toThreeMesh()` |
| `s.toArray()` | Array format | `s.toArray()` |

### Complex Numbers

| Function | Description | Example |
|----------|-------------|---------|
| `complex(re, im)` | Create complex | `complex(3, 4)` |
| `C(re, im)` | Alias | `C(3, 4)` |
| `z.re`, `z.im` | Real/imaginary | `z.re` → `3` |
| `z.mul(w)` | Multiply | `z.mul(w)` |
| `z.conj()` | Conjugate | `z.conj()` |
| `z.inv()` | Inverse | `z.inv()` |
| `z.exp()` | Exponential | `z.exp()` |
| `z.log()` | Logarithm | `z.log()` |
| `z.pow(n)` | Power | `z.pow(2)` |
| `z.norm()` | Magnitude | `z.norm()` |
| `z.toVector3()` | Three.js format | `z.toVector3()` |
| `z.toArray()` | Array format | `z.toArray()` |

### Quaternions

| Function | Description | Example |
|----------|-------------|---------|
| `quaternion(w, x, y, z)` | Create quaternion | `quaternion(1,2,3,4)` |
| `H(w, x, y, z)` | Alias | `H(1,2,3,4)` |
| `q.w`, `q.x`, `q.y`, `q.z` | Components | `q.w` → `1` |
| `q.mul(r)` | Multiply | `q.mul(r)` |
| `q.conj()` | Conjugate | `q.conj()` |
| `q.inv()` | Inverse | `q.inv()` |
| `q.rotate(v)` | Rotate vector | `q.rotate(v)` |
| `q.norm()` | Magnitude | `q.norm()` |
| `q.toRotationMatrix()` | Rotation matrix | `q.toRotationMatrix()` |
| `q.toVector3()` | Three.js format | `q.toVector3()` |
| `q.toArray()` | Array format | `q.toArray()` |

### Octonions

| Function | Description | Example |
|----------|-------------|---------|
| `octonion(e0, ..., e7)` | Create octonion | `octonion(1,...,8)` |
| `O(e0, ..., e7)` | Alias | `O(1,...,8)` |
| `o.e0`, ..., `o.e7` | Components | `o.e0` → `1` |
| `o.mul(p)` | Multiply | `o.mul(p)` |
| `o.conj()` | Conjugate | `o.conj()` |
| `o.norm()` | Magnitude | `o.norm()` |
| `o.toVector3()` | Three.js format | `o.toVector3()` |
| `o.toArray()` | Array format | `o.toArray()` |

### Hyperplanes

| Function | Description | Example |
|----------|-------------|---------|
| `hyperplane(origin, normal)` | Create hyperplane | `hyperplane([0,0,0], [1,0,0])` |
| `plane(normal, offset)` | 3D plane helper | `plane([1,1,1], 0)` |
| `hp.project(p)` | Project point | `hp.project(p)` |
| `hp.distance(p)` | Distance to point | `hp.distance(p)` |
| `hp.sample(bounds, res)` | Sample plane | `hp.sample([-1,1,-1,1], 5)` |
| `slice(space, hp)` | Slice space | `slice(space, hp)` |

### Algebraic Space Helpers

| Function | Description | Example |
|----------|-------------|---------|
| `algebraicSpace(dim)` | Create algebraic space | `algebraicSpace(2)` |
| `complexSpace()` | Complex space | `complexSpace()` |
| `quaternionSpace()` | Quaternion space | `quaternionSpace()` |
| `octonionSpace()` | Octonion space | `octonionSpace()` |
| `ALGEBRAIC_DIMS` | Supported dims | `[2, 4, 8]` |

## 🎨 **Usage Examples**

### Example 1: Basic Points

```javascript
import { point } from 'primalib'

const p = point(1, 2, 3)
console.log(p[0], p[1], p[2])  // → 1, 2, 3

// Destructuring
const [x, y, z] = p
console.log(x, y, z)  // → 1, 2, 3

// Operations
const p2 = point(4, 5, 6)
p.add(p2)      // → point(5, 7, 9)
p.scale(2)     // → point(2, 4, 6)
p.norm()       // → 3.7416573867739413
```

### Example 2: Spaces

```javascript
import { space } from '@primalib/core'

// 2D algebraic space
const C = space([0, 0], [1, 1])
C.isAlgebraic  // → true
C.algebra      // → 'complex'
C.vertices()   // → 4 vertices
C.split()      // → {even: [...], odd: [...]}

// 3D geometric space
const cube = space([0, 0, 0], [2, 2, 2])
cube.isAlgebraic  // → false
cube.vertices()   // → 8 vertices

// Sample interior
cube.sample(5).take(10)  // → first 10 interior points
```

### Example 3: Complex Numbers

```javascript
import { complex, C } from 'primalib'

const z1 = complex(3, 4)
const z2 = C(1, 2)

// Operations
z1.mul(z2)     // → complex(-5, 10)
z1.conj()      // → complex(3, -4)
z1.inv()       // → complex(0.12, -0.16)
z1.exp()       // → exponential
z1.log()       // → logarithm
z1.pow(2)      // → power
z1.norm()      // → 5
```

### Example 4: Quaternion Rotations

```javascript
import { quaternion, point } from 'primalib'

// Rotation around z-axis by 90°
const q = quaternion(
  Math.cos(Math.PI/4),  // w
  0,                    // x
  0,                    // y
  Math.sin(Math.PI/4)   // z
)

const v = point(1, 0, 0)
q.rotate(v)  // → rotated vector

// Rotation matrix
q.toRotationMatrix()  // → 3×3 rotation matrix
```

### Example 5: Hyperplanes

```javascript
import { hyperplane, point } from 'primalib'

// Plane through origin, normal to x-axis
const hp = hyperplane([0, 0, 0], [1, 0, 0])

const pt = point(5, 3, 2)
hp.distance(pt)    // → 5
hp.project(pt)     // → point(0, 3, 2)

// Sample plane
hp.sample([-1, 1, -1, 1], 5)  // → points on plane
```

### Example 6: Integration with PrimaSet

```javascript
import { primaSet, space, point } from '@primalib/core'

// Sample space and filter
const s = space([0, 0, 0], [1, 1, 1])
s.sample(10)
  .filter(p => p.norm() < 0.5)
  .take(20)
  .toArray()

// Map points
primaSet([point(1,2), point(3,4), point(5,6)])
  .map(p => p.scale(2))
  .toArray()
```

### Example 7: Algebraic Space Splitting

```javascript
import { space, ALGEBRAIC_DIMS } from '@primalib/core'

// Create 2D algebraic space
const C = space([0, 0], [1, 1])

// Split into even/odd classes
const classes = C.split()
classes.even  // → vertices with even coordinate sum
classes.odd   // → vertices with odd coordinate sum

// Supported dimensions
ALGEBRAIC_DIMS  // → [2, 4, 8]
```

## ⚡ **Performance Notes**

### Numeric Indexing

- **Use `[i]`** for convenience in external code (acceptable overhead)
- **Use `.coords[i]`** in loops and internal methods (14x faster)

```javascript
// Fast: Direct access in loops
verts.filter(v => (v.coords[0] + v.coords[1]) % 2 === 0)

// Convenient: Numeric indexing for user code
const p = point(1, 2, 3)
p[0]  // → 1 (convenient, acceptable overhead)
```

### Lazy Evaluation

- **Sampling**: `sample()` returns lazy `primaSet` - only computes when needed
- **Vertices**: Materialized array - use `take()` or `filter()` for large spaces
- **Power-of-2**: Optimized splitting for 2D, 4D, 8D dimensions

## 🔗 **Integration**

PrimaGeo integrates seamlessly with other PrimaLib modules:

```javascript
import { point, space, complex, primaSet, N } from '@primalib/core'

// Geometry + Sequences
N(10).map(n => point(n, n*2, n*3))  // → points from sequence

// Geometry + Linear Algebra
import { vector } from 'primalib'
const p = point(1, 2, 3)
const v = vector(4, 5, 6)
p.add(v)  // → point(5, 7, 9)

// Geometry + Number Theory
import { primes } from 'primalib'
primes.take(10).map(p => point(p % 13, p % 17))  // → prime positions
```

## 🎓 **Mathematical Background**

### Complex Numbers
- **Multiplication**: `(a+bi)(c+di) = (ac-bd) + (ad+bc)i`
- **Conjugate**: `a - bi`
- **Inverse**: `1/z = conj(z) / |z|²`
- **Exponential**: `e^z = e^a(cos b + i sin b)`
- **De Moivre**: `z^n = |z|^n (cos(nθ) + i sin(nθ))`

### Quaternions
- **Non-commutative**: `i*j = k`, but `j*i = -k`
- **Rotation**: `v' = q v q⁻¹` rotates vector `v` by quaternion `q`
- **Norm**: `|q| = √(w² + x² + y² + z²)`

### Octonions
- **Non-associative**: `(a*b)*c ≠ a*(b*c)` in general
- **Fano plane**: Multiplication table based on Fano plane structure
- **Cayley-Dickson**: Constructed from quaternions

### Hyperplanes
- **Distance**: `d = |n·(p - o)| / |n|` where `n` is normal, `o` is origin
- **Projection**: `p' = p - (n·(p - o)) / |n|² * n`

---

**PrimaGeo** provides comprehensive geometric primitives for n-dimensional space, enabling powerful mathematical computations with lazy evaluation. 🎯

