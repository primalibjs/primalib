# PrimaTopo - Topology & Topological Invariants

> **"Topological analysis tools - genus, Euler characteristic, fiber bundles, and topological properties for geometric structures."**

PrimaTopo provides topological analysis tools for geometric structures, including genus calculation, Euler characteristic, fiber bundles, Betti numbers, and topological invariants. It enables the study of topological properties that remain invariant under continuous deformations.

## 🎯 **Architecture**

- **Topological Properties**: Genus, Euler characteristic, orientability, compactness, connectivity
- **Fiber Bundles**: Construct and analyze fiber bundles with base and fiber spaces
- **Cartesian Products**: Compute Cartesian products of geometric structures
- **Betti Numbers**: Homology groups and topological invariants
- **Topological Invariants**: Comprehensive analysis of topological properties

## 🔷 **Topological Properties**

### Genus

```javascript
import { genus } from 'primalib'
import { hypercube } from 'primalib'

// Genus of geometric structures
const h = hypercube([0, 0], [1, 1])
h.type = 'hypercube'
genus(h)  // → 0

// Supported types
genus({type: 'sphere'})   // → 0
genus({type: 'torus'})    // → 1
genus({type: 'hypercube'}) // → 0
genus({type: 'klein'})    // → 0
genus({type: 'mobius'})   // → 0
genus({type: 'cylinder'}) // → 0
genus({type: 'plane'})    // → 0
```

### Euler Characteristic

```javascript
import { eulerCharacteristic } from 'primalib'
import { hypercube } from 'primalib'

// Euler characteristic of hypercube
const h2 = hypercube([0, 0], [1, 1])
h2.type = 'hypercube'
h2.dim = 2
eulerCharacteristic(h2)  // → 4 (2D square: vertices - edges + faces)

const h3 = hypercube([0, 0, 0], [1, 1, 1])
h3.type = 'hypercube'
h3.dim = 3
eulerCharacteristic(h3)  // → 1 (3D cube: V - E + F - C = 8 - 12 + 6 - 1)

// Other geometries
eulerCharacteristic({type: 'sphere'})  // → 2
eulerCharacteristic({type: 'torus'})   // → 0
eulerCharacteristic({type: 'klein'})   // → 0
```

### Orientability

```javascript
import { isOrientable } from 'primalib'

// Check if geometry is orientable
isOrientable({type: 'sphere'})   // → true
isOrientable({type: 'torus'})    // → true
isOrientable({type: 'hypercube'}) // → true
isOrientable({type: 'mobius'})   // → false (Möbius strip)
isOrientable({type: 'klein'})    // → false (Klein bottle)
```

### Compactness

```javascript
import { isCompact } from 'primalib'

// Check if geometry is compact
isCompact({type: 'hypercube'}) // → true
isCompact({type: 'sphere'})    // → true
isCompact({type: 'torus'})     // → true
isCompact({type: 'klein'})    // → true
isCompact({type: 'cylinder'})  // → true
isCompact({type: 'plane'})     // → false (unbounded)
```

### Connectivity

```javascript
import { isConnected } from 'primalib'

// Check if geometry is connected
isConnected({type: 'sphere'})   // → true
isConnected({type: 'torus'})   // → true
isConnected({type: 'hypercube'}) // → true
isConnected({type: 'disjoint'}) // → false
```

### Simply Connected

```javascript
import { isSimplyConnected } from 'primalib'

// Check if geometry is simply connected
// (genus 0, orientable, and connected)
isSimplyConnected({type: 'sphere'})   // → true
isSimplyConnected({type: 'hypercube'}) // → true
isSimplyConnected({type: 'torus'})    // → false (genus 1)
isSimplyConnected({type: 'klein'})    // → false (non-orientable)
```

## 📦 **Fiber Bundles**

Fiber bundles are topological structures that locally look like a product space.

### Creating Fiber Bundles

```javascript
import { fiberBundle, hypercube, point } from 'primalib'

// Create fiber bundle: base × fiber with projection
const base = hypercube([0, 0], [1, 1])  // 2D base
const fiber = hypercube([0], [1])       // 1D fiber

const projection = (p) => {
  // Project total space point to base
  const coords = p.coords || p
  return point(coords[0], coords[1])  // First 2 coordinates
}

const bundle = fiberBundle(base, fiber, projection)
```

### Total Space

```javascript
// Get total space (base × fiber)
const total = bundle.totalSpace()
total.toArray()  // → All points in base × fiber
```

### Sections

```javascript
// Create a section: map from base to fiber
const sectionMap = (basePoint) => {
  // Return fiber point for given base point
  return point(basePoint[0] + basePoint[1])  // Example: sum of coordinates
}

const section = bundle.section(sectionMap)
section.toArray()  // → Points in total space following section
```

### Lifting Paths

```javascript
// Lift a path from base to total space
const path = [
  point(0, 0),
  point(0.5, 0.5),
  point(1, 1)
]

const lifted = bundle.lift(path)
lifted.toArray()
// → [
//     {base: point(0,0), fiber: point(0,0)},
//     {base: point(0.5,0.5), fiber: point(0.5,0.5)},
//     {base: point(1,1), fiber: point(1,1)}
//   ]
```

### Hypercube as Fiber Bundle

```javascript
import { hypercubeAsFiberBundle } from 'primalib'

// Decompose hypercube as fiber bundle
const bundle = hypercubeAsFiberBundle(4)  // 4D hypercube

bundle.base   // → 2D hypercube (base)
bundle.fiber  // → 2D hypercube (fiber)
bundle.projection  // → projection function

// Total space is 4D hypercube
const total = bundle.totalSpace()
total.toArray()  // → All vertices of 4D hypercube
```

## ✖️ **Cartesian Products**

Cartesian products combine geometric structures.

### Cartesian Product

```javascript
import { cartesianProduct, hypercube, point } from 'primalib'

// Product of two hypercubes
const h1 = hypercube([0], [1])  // 1D
const h2 = hypercube([0, 0], [1, 1])  // 2D

const product = cartesianProduct(h1, h2)
product.toArray()
// → All combinations: (h1 vertex) × (h2 vertex)
// → 2 × 4 = 8 points in 3D space

// Product of points
const p1 = point(1, 2)
const p2 = point(3, 4, 5)
const prod = cartesianProduct(p1, p2)
prod.toArray()  // → [point(1, 2, 3, 4, 5)]
```

## 🔢 **Betti Numbers**

Betti numbers are topological invariants representing the rank of homology groups.

### Betti Numbers

```javascript
import { bettiNumbers, hypercube } from 'primalib'

// Betti numbers of hypercube
const h3 = hypercube([0, 0, 0], [1, 1, 1])
h3.type = 'hypercube'
h3.dim = 3
bettiNumbers(h3)  // → [1, 0, 0, 1] (b₀=1, b₁=0, b₂=0, b₃=1)

// Betti numbers of sphere
bettiNumbers({type: 'sphere', dim: 2})  // → [1, 0, 1] (b₀=1, b₁=0, b₂=1)
bettiNumbers({type: 'sphere', dim: 3})  // → [1, 0, 0, 1]

// Betti numbers of torus
bettiNumbers({type: 'torus'})  // → [1, 2, 1] (b₀=1, b₁=2, b₂=1)
```

## 📊 **Topological Invariants**

Comprehensive analysis of all topological properties.

### Topological Invariants

```javascript
import { topologicalInvariants, hypercube } from 'primalib'

const h = hypercube([0, 0, 0], [1, 1, 1])
h.type = 'hypercube'
h.dim = 3

const invariants = topologicalInvariants(h)
// → {
//     genus: 0,
//     eulerCharacteristic: 1,
//     isOrientable: true,
//     isCompact: true,
//     isConnected: true,
//     isSimplyConnected: true,
//     bettiNumbers: [1, 0, 0, 1]
//   }
```

## 📋 **Complete API Reference**

### Topological Properties

| Function | Description | Example |
|----------|-------------|---------|
| `genus(geometry)` | Genus of geometry | `genus({type: 'torus'})` → `1` |
| `eulerCharacteristic(geometry)` | Euler characteristic | `eulerCharacteristic({type: 'sphere'})` → `2` |
| `isOrientable(geometry)` | Check orientability | `isOrientable({type: 'mobius'})` → `false` |
| `isCompact(geometry)` | Check compactness | `isCompact({type: 'plane'})` → `false` |
| `isConnected(geometry)` | Check connectivity | `isConnected({type: 'sphere'})` → `true` |
| `isSimplyConnected(geometry)` | Check simple connectivity | `isSimplyConnected({type: 'torus'})` → `false` |

### Fiber Bundles

| Function | Description | Example |
|----------|-------------|---------|
| `fiberBundle(base, fiber, projection)` | Create fiber bundle | `fiberBundle(base, fiber, proj)` |
| `bundle.totalSpace()` | Get total space | `bundle.totalSpace()` |
| `bundle.section(sectionMap)` | Create section | `bundle.section(map)` |
| `bundle.lift(path)` | Lift path | `bundle.lift(path)` |
| `hypercubeAsFiberBundle(dim)` | Hypercube as bundle | `hypercubeAsFiberBundle(4)` |

### Products

| Function | Description | Example |
|----------|-------------|---------|
| `cartesianProduct(geomA, geomB)` | Cartesian product | `cartesianProduct(h1, h2)` |

### Homology

| Function | Description | Example |
|----------|-------------|---------|
| `bettiNumbers(geometry)` | Betti numbers | `bettiNumbers({type: 'torus'})` → `[1,2,1]` |

### Comprehensive

| Function | Description | Example |
|----------|-------------|---------|
| `topologicalInvariants(geometry)` | All invariants | `topologicalInvariants(h)` |

## 🎨 **Usage Examples**

### Example 1: Basic Topological Properties

```javascript
import { genus, eulerCharacteristic, isOrientable } from 'primalib'
import { hypercube } from 'primalib'

const h = hypercube([0, 0, 0], [1, 1, 1])
h.type = 'hypercube'
h.dim = 3

genus(h)                // → 0
eulerCharacteristic(h)  // → 8
isOrientable(h)         // → true
```

### Example 2: Fiber Bundle Construction

```javascript
import { fiberBundle, hypercube, point } from 'primalib'

// Create circle bundle over sphere
const base = hypercube([0, 0], [1, 1])  // Base space
const fiber = hypercube([0], [1])       // Fiber (circle)

const projection = (p) => {
  const coords = p.coords || p
  return point(coords[0], coords[1])  // Project to base
}

const bundle = fiberBundle(base, fiber, projection)

// Get total space
const total = bundle.totalSpace()
total.toArray()  // → All points in base × fiber
```

### Example 3: Sections

```javascript
import { fiberBundle, hypercube, point } from 'primalib'

const base = hypercube([0, 0], [1, 1])
const fiber = hypercube([0], [1])

const projection = (p) => point((p.coords || p)[0], (p.coords || p)[1])
const bundle = fiberBundle(base, fiber, projection)

// Define section: constant section
const constantSection = bundle.section((basePoint) => {
  return point(0.5)  // Constant fiber value
})

constantSection.toArray()  // → Points with constant fiber

// Define section: linear section
const linearSection = bundle.section((basePoint) => {
  return point(basePoint[0] + basePoint[1])  // Sum of coordinates
})

linearSection.toArray()  // → Points with linear fiber
```

### Example 4: Hypercube Decomposition

```javascript
import { hypercubeAsFiberBundle } from 'primalib'

// Decompose 4D hypercube as 2D × 2D fiber bundle
const bundle = hypercubeAsFiberBundle(4)

console.log('Base dimension:', bundle.base.dim)   // → 2
console.log('Fiber dimension:', bundle.fiber.dim) // → 2

// Total space is 4D hypercube
const total = bundle.totalSpace()
const vertices = total.toArray()
console.log('Total vertices:', vertices.length)  // → 16 (2⁴)
```

### Example 5: Cartesian Products

```javascript
import { cartesianProduct, hypercube } from 'primalib'

// Product of 1D and 2D hypercubes
const line = hypercube([0], [1])      // 1D
const square = hypercube([0, 0], [1, 1])  // 2D

const product = cartesianProduct(line, square)
product.toArray()
// → [
//     point(0, 0, 0), point(0, 1, 0), point(0, 0, 1), point(0, 1, 1),
//     point(1, 0, 0), point(1, 1, 0), point(1, 0, 1), point(1, 1, 1)
//   ]
// → 2 × 4 = 8 points in 3D
```

### Example 6: Betti Numbers

```javascript
import { bettiNumbers, hypercube } from 'primalib'

// 3D cube
const cube = hypercube([0, 0, 0], [1, 1, 1])
cube.type = 'hypercube'
cube.dim = 3

const betti = bettiNumbers(cube)
// → [1, 0, 0, 1]
// b₀ = 1 (one connected component)
// b₁ = 0 (no 1-cycles)
// b₂ = 0 (no 2-cycles)
// b₃ = 1 (one 3-cycle)

// Torus
const torusBetti = bettiNumbers({type: 'torus'})
// → [1, 2, 1]
// b₀ = 1 (one connected component)
// b₁ = 2 (two independent 1-cycles)
// b₂ = 1 (one 2-cycle)
```

### Example 7: Comprehensive Analysis

```javascript
import { topologicalInvariants, hypercube } from 'primalib'

const h = hypercube([0, 0, 0], [1, 1, 1])
h.type = 'hypercube'
h.dim = 3

const invariants = topologicalInvariants(h)
console.log('Genus:', invariants.genus)                    // → 0
console.log('Euler characteristic:', invariants.eulerCharacteristic)  // → 1
console.log('Orientable:', invariants.isOrientable)        // → true
console.log('Compact:', invariants.isCompact)              // → true
console.log('Connected:', invariants.isConnected)          // → true
console.log('Simply connected:', invariants.isSimplyConnected)  // → true
console.log('Betti numbers:', invariants.bettiNumbers)     // → [1, 0, 0, 1]
```

### Example 8: Integration with PrimaSet

```javascript
import { primaSet, fiberBundle, hypercube } from 'primalib'

// Analyze multiple fiber bundles
const bundles = primaSet([2, 3, 4, 5]).map(dim => {
  return hypercubeAsFiberBundle(dim)
})

bundles.forEach(bundle => {
  const total = bundle.totalSpace()
  const vertices = total.toArray()
  console.log(`Dimension ${bundle.base.dim + bundle.fiber.dim}: ${vertices.length} vertices`)
})
```

### Example 9: Path Lifting

```javascript
import { fiberBundle, hypercube, point } from 'primalib'

const base = hypercube([0, 0], [1, 1])
const fiber = hypercube([0], [1])
const projection = (p) => point((p.coords || p)[0], (p.coords || p)[1])
const bundle = fiberBundle(base, fiber, projection)

// Define path in base space
const path = [
  point(0, 0),
  point(0.25, 0.25),
  point(0.5, 0.5),
  point(0.75, 0.75),
  point(1, 1)
]

// Lift path to total space
const lifted = bundle.lift(path)
lifted.toArray()
// → Path lifted to total space with fiber information
```

## ⚡ **Performance Notes**

- **Lazy Evaluation**: `totalSpace()`, `section()`, and `lift()` return lazy `primaSet`
- **Materialization**: Use `toArray()` carefully with large Cartesian products
- **Fiber Bundles**: Total space size grows as `|base| × |fiber|`
- **Cartesian Products**: Product size grows multiplicatively

## 🔗 **Integration**

PrimaTopo integrates seamlessly with other PrimaLib modules:

```javascript
import { topologicalInvariants, hypercube } from 'primalib'
import { primaSet } from 'primalib'

// Analyze hypercubes of different dimensions
const hypercubes = primaSet([2, 3, 4, 5]).map(dim => {
  const h = hypercube(new Array(dim).fill(0), new Array(dim).fill(1))
  h.type = 'hypercube'
  h.dim = dim
  return topologicalInvariants(h)
})

hypercubes.forEach(inv => {
  console.log(`Euler: ${inv.eulerCharacteristic}, Betti: ${inv.bettiNumbers}`)
})
```

## 🎓 **Mathematical Background**

### Genus
- **Definition**: Number of "holes" in a surface
- **Sphere**: Genus 0 (no holes)
- **Torus**: Genus 1 (one hole)
- **Formula**: For orientable surfaces, `g = (2 - χ) / 2` where χ is Euler characteristic

### Euler Characteristic
- **Definition**: `χ = V - E + F - C + ...` (alternating sum)
- **Hypercube**: `χ = Σ(-1)^k × C(n,k) × 2^(n-k)` for k-faces
- **Sphere**: `χ = 2`
- **Torus**: `χ = 0`
- **Invariant**: Remains constant under continuous deformations

### Betti Numbers
- **Definition**: Rank of k-th homology group `H_k`
- **b₀**: Number of connected components
- **b₁**: Number of independent 1-cycles (loops)
- **b₂**: Number of independent 2-cycles (surfaces)
- **Euler-Poincaré**: `χ = Σ(-1)^k × b_k`

### Fiber Bundles
- **Structure**: Locally `U × F` where `U` is base, `F` is fiber
- **Projection**: Maps total space to base
- **Section**: Continuous map from base to total space
- **Trivial Bundle**: `E = B × F` (product bundle)

### Orientability
- **Definition**: Consistent choice of orientation at every point
- **Orientable**: Sphere, torus, hypercube
- **Non-orientable**: Möbius strip, Klein bottle

### Compactness
- **Definition**: Every open cover has finite subcover
- **Compact**: Hypercube, sphere, torus
- **Non-compact**: Plane, open disk

---

**PrimaTopo** provides comprehensive topological analysis tools for exploring geometric structures and their topological invariants. 🎯

