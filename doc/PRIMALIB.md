# PrimaLib - Complete Documentation

> **"Math made magical with lazy sets - infinite sequences as natural as arrays, arrays as powerful as infinite sequences."**

PrimaLib is a comprehensive mathematical library built around **`primaSet`** ⭐ - a unified abstraction that treats everything as a lazy, iterable set. From infinite prime sequences to geometric structures, from linear algebra to tree traversal, PrimaLib provides a consistent, composable API for mathematical computation.

## 📚 **Documentation Index**

This document provides an overview of all PrimaLib modules. For detailed documentation, see:

- **[PRIMASET.md](./PRIMASET.md)** - Core lazy set factory (the shining star ⭐)
- **[PRIMAOPS.md](./PRIMAOPS.md)** - Extended operations & methods
- **[PRIMANUM.md](./PRIMANUM.md)** - Number theory & geometric primes
- **[PRIMAGEO.md](./PRIMAGEO.md)** - Geometry & hyperdimensional structures
- **[PRIMASTAT.md](./PRIMASTAT.md)** - Statistical analysis tools
- **[PRIMATOPO.md](./PRIMATOPO.md)** - Topology & topological invariants
- **[PRIMALIN.md](./PRIMALIN.md)** - Linear algebra (vectors, matrices, polynomials)
- **[PRIMATREE.md](./PRIMATREE.md)** - Tree handling & Virtual DOM foundation
- **[PRIMAWEB.md](./PRIMAWEB.md)** - Universal web pipeline (the cherry on top 🍒)
- **[PRIMA3D.md](./PRIMA3D.md)** - Three.js visualizer for PrimaLib geometries
- **[PRIMATEST.md](./PRIMATEST.md)** - Testing philosophy & approach
- **[ERRORS.md](./ERRORS.md)** - Errors & troubleshooting guide
- **[QUICKREF.md](./QUICKREF.md)** - Quick reference & cheat sheet
- **[PATTERNS.md](./PATTERNS.md)** - Common patterns & recipes
- **[FAQ.md](./FAQ.md)** - Frequently asked questions
- **[INTEGRATION.md](./INTEGRATION.md)** - Framework integration guide
- **[IMPORT_GUIDE.md](./IMPORT_GUIDE.md)** - Package structure & import guide
- **[PACKAGE_STRUCTURE.md](./PACKAGE_STRUCTURE.md)** - Package structure details
- **[PRIMAPROMPT.md](./PRIMAPROMPT.md)** - AI/LLM reference guide (compact, high-density)

## 🏗️ **Architecture Overview**

PrimaLib follows a layered architecture where everything builds on `primaSet`:

```
┌─────────────────────────────────────────┐
│  PrimaWeb 🍒 (Web Pipeline)            │
├─────────────────────────────────────────┤
│  PrimaTree (Tree Handling)              │
├─────────────────────────────────────────┤
│  PrimaLin (Linear Algebra)              │
│  PrimaTopo (Topology)                   │
│  PrimaStat (Statistics)                 │
│  PrimaGeo (Geometry)                     │
│  PrimaNum (Number Theory)                │
│  PrimaOps (Operations)                  │
├─────────────────────────────────────────┤
│  PrimaSet ⭐ (Core Lazy Set Factory)     │
└─────────────────────────────────────────┘
```

**Core Principle**: Everything is a set. All modules use `primaSet` as their foundation, enabling lazy evaluation, infinite sequences, and unified operations.

## ⭐ **1. PrimaSet - The Shining Star**

**Module**: `primaset.mjs`  
**Documentation**: [PRIMASET.md](./PRIMASET.md)

PrimaSet is the foundation of PrimaLib - a unified abstraction that treats everything as a lazy, iterable set.

### Key Features

- **Everything is a set**: Numbers, arrays, infinite streams, objects, trees, DOM elements
- **Lazy by default**: Infinite sequences without memory issues
- **Unified abstraction**: One API for all data types
- **Composable operations**: Build pipelines, apply anywhere
- **Plugin system**: Extensible through plugins

### Quick Example

```javascript
import { primaSet, N, primes } from 'primalib'

// Infinite sequences work like arrays
primaSet(primes).take(10)  // → [2,3,5,7,11,13,17,19,23,29]
primaSet(N()).map(x => x * x).take(5)  // → [1,4,9,16,25]

// Everything is a set
primaSet(42).map(x => x * 2)  // → [84]
primaSet([1,2,3]).map(x => x * 2)  // → [2,4,6]
```

### Philosophy

- **Uniformity**: Everything is a set - no special cases
- **Laziness**: Compute only what's needed
- **Composability**: Operations compose naturally
- **Extensibility**: Add operations through plugins

**See [PRIMASET.md](./PRIMASET.md) for complete documentation.**

## 🔧 **2. PrimaOps - Extended Operations**

**Module**: `primaops.mjs`  
**Documentation**: [PRIMAOPS.md](./PRIMAOPS.md)

PrimaOps extends PrimaSet with comprehensive operations, methods, and generators for lazy computation.

### Key Features

- **Algebraic operations**: `sq`, `inv`, `neg`, `add`, `sub`, `mul`, `div`, `mod`
- **Statistical functions**: `mean`, `sum`, `min`, `max`, `stddev`, `variance`
- **Number theory utilities**: `factorial`, `gcd`, `lcm`, `isPrime`, `firstDivisor`
- **Control flow**: `iif`, `when`, `unless`, `route` for conditional processing
- **Extended generators**: `skip`, `zip`, `chunk`, `window`, `flatten`, `unique`

### Quick Example

```javascript
import { primaSet, N } from 'primalib'
const { sq, sum, mean } = primaSet

// Algebraic operations
sq([1,2,3])  // → [1,4,9]
sum([1,2,3,4,5])  // → 15

// Statistical operations
mean([1,2,3,4,5])  // → 3

// Number theory
factorial(5)  // → 120
gcd(12, 18)  // → 6
```

**See [PRIMAOPS.md](./PRIMAOPS.md) for complete documentation.**

## 🔢 **3. PrimaNum - Number Theory & Geometric Primes**

**Module**: `primanum.mjs`  
**Documentation**: [PRIMANUM.md](./PRIMANUM.md)

PrimaNum provides number sequences, prime constellations, geometric sieves, and advanced number theory operations using CRT (Chinese Remainder Theorem) addresses and 2D power space geometry.

### Key Features

- **Number sequences**: `N()`, `Z()`, `R()`, `evens()`, `odds()`, `multiplesOf()`
- **Prime sequences**: `primes` (infinite), `twins`, `cousins`, `sexy`, `primeGaps`
- **Geometric interpretation**: Primes as points in complex/quaternion/octonion spaces
- **CRT address system**: Represent numbers using Chinese Remainder Theorem
- **Geometric sieve**: Optimized prime finding using 2D geometry
- **Goldbach structures**: Goldbach pairs, vectors, and tables

### Quick Example

```javascript
import { N, primes, twins, address, geometricSieve } from 'primalib'

// Number sequences
N(10)  // → [1,2,3,4,5,6,7,8,9,10]
primes.take(10)  // → [2,3,5,7,11,13,17,19,23,29]

// Prime constellations
twins.take(5)  // → [[3,5], [5,7], [11,13], [17,19], [29,31]]

// CRT addresses
address(30)  // → [0,0,0,0] (30 = 2×3×5×7)

// Geometric sieve
geometricSieve(100)  // → Primes up to 100 using geometric methods
```

**See [PRIMANUM.md](./PRIMANUM.md) for complete documentation.**

## 📐 **4. PrimaGeo - Geometry & Hyperdimensional Structures**

**Module**: `primageo.mjs`  
**Documentation**: [PRIMAGEO.md](./PRIMAGEO.md)

PrimaGeo provides geometric structures in n-dimensional space, including points, hypercubes, hyperplanes, and conversions between number systems (complex, quaternion, octonion).

### Key Features

- **Points**: n-dimensional points with vector operations
- **Hypercubes**: n-dimensional hypercubes with vertex enumeration and sampling
- **Hyperplanes**: n-dimensional hyperplanes with distance calculations
- **Number system conversions**: Complex, quaternion, octonion representations
- **Geometric operations**: Distance, norm, scaling, addition, subtraction

### Quick Example

```javascript
import { point, hypercube, hyperplane } from 'primalib'

// Points in n-dimensional space
const p1 = point(1, 2, 3)
const p2 = point(4, 5, 6)
p1.add(p2)  // → point(5, 7, 9)
p1.norm()   // → 3.741... (Euclidean distance)

// Hypercubes
const cube = hypercube([0,0,0], [1,1,1])
cube.vertices()  // → 8 corner points
cube.sample(10)  // → 10 interior points

// Hyperplanes
const plane = hyperplane([1,1,1], 5)  // Normal [1,1,1], distance 5
plane.distance(point(1,1,1))  // → Distance from point to plane
```

**See [PRIMAGEO.md](./PRIMAGEO.md) for complete documentation.**

## 📊 **5. PrimaStat - Statistical Analysis**

**Module**: `primastat.mjs`  
**Documentation**: [PRIMASTAT.md](./PRIMASTAT.md)

PrimaStat provides statistical analysis tools for data analysis, including descriptive statistics, information theory, correlation, time series, and distribution fitting.

### Key Features

- **Descriptive statistics**: `mean`, `median`, `stddev`, `variance`, `percentile`
- **Information theory**: `entropy`, `relativeEntropy`, `uniformity`
- **Correlation**: `correlation`, `linearRegression`
- **Time series**: `movingAverage`, `ema`, `differences`
- **Distribution fitting**: `goodnessOfFit`, `hlComparison`
- **Primal geometry specific**: `residualCoverageAnalysis`, `gapDistribution`, `twinDensityByDimension`

### Quick Example

```javascript
import { mean, stddev, correlation, movingAverage } from 'primalib'

// Descriptive statistics
const data = [1,2,3,4,5,6,7,8,9,10]
mean(data)  // → 5.5
stddev(data)  // → 3.027...

// Correlation
correlation([1,2,3,4,5], [2,4,6,8,10])  // → 1.0 (perfect correlation)

// Time series
movingAverage([1,2,3,4,5,6,7,8,9,10], 3)  // → [2,3,4,5,6,7,8,9]
```

**See [PRIMASTAT.md](./PRIMASTAT.md) for complete documentation.**

## 🔗 **6. PrimaTopo - Topology**

**Module**: `primatopo.mjs`  
**Documentation**: [PRIMATOPO.md](./PRIMATOPO.md)

PrimaTopo provides topological structures and invariants, including simplicial complexes, homology groups, Euler characteristics, and fiber bundles.

### Key Features

- **Simplicial complexes**: Build and analyze simplicial complexes
- **Homology groups**: Compute homology groups and Betti numbers
- **Euler characteristic**: Calculate Euler characteristic for complexes
- **Fiber bundles**: Construct fiber bundles with projection maps
- **Topological invariants**: Dimension, connectivity, orientability

### Quick Example

```javascript
import { simplicialComplex, eulerCharacteristic, fiberBundle } from 'primalib'

// Simplicial complex
const complex = simplicialComplex({
  vertices: [[0], [1], [2]],
  edges: [[0,1], [1,2], [2,0]],
  faces: [[0,1,2]]
})

// Euler characteristic
eulerCharacteristic(complex)  // → 1 (V-E+F)

// Fiber bundle
const bundle = fiberBundle(
  base => point(base[0], base[1]),
  fiber => point(fiber[0], fiber[1], 0)
)
```

**See [PRIMATOPO.md](./PRIMATOPO.md) for complete documentation.**

## 📏 **7. PrimaLin - Linear Algebra**

**Module**: `primalin.mjs`  
**Documentation**: [PRIMALIN.md](./PRIMALIN.md)

PrimaLin provides linear algebra operations including vectors, matrices, and polynomials, all built on `primaSet` for lazy evaluation.

### Key Features

- **Vectors**: Extends `point` from PrimaGeo with vector operations (`dot`, `cross`, `normalize`, `project`, `angle`)
- **Matrices**: Matrix operations (`transpose`, `det`, `inv`, `mul`, `add`, `sub`, `scale`, `trace`, `rank`, `eigenvalues`, `eigenvectors`, `lu`, `qr`)
- **Polynomials**: Polynomial operations (`eval`, `derivative`, `integral`, `add`, `sub`, `mul`, `div`, `compose`, `roots`)

### Quick Example

```javascript
import { vector, matrix, polynomial } from 'primalib'

// Vectors
const v1 = vector(1, 2, 3)
const v2 = vector(4, 5, 6)
v1.dot(v2)  // → 32
v1.cross(v2)  // → vector(-3, 6, -3) (3D only)

// Matrices
const m = matrix([[1,2],[3,4]])
m.det()  // → -2
m.inv()  // → matrix([[-2,1],[1.5,-0.5]])

// Polynomials
const p = polynomial([1, 0, -1])  // x² - 1
p.eval(2)  // → 3
p.roots()  // → [-1, 1]
```

**See [PRIMALIN.md](./PRIMALIN.md) for complete documentation.**

## 🌳 **8. PrimaTree - Tree Handling**

**Module**: `primatree.mjs`  
**Documentation**: [PRIMATREE.md](./PRIMATREE.md)

PrimaTree provides tree handling capabilities with parent/key tracking, traversal, and address systems. It serves as the foundation for Virtual DOM integration.

### Key Features

- **Tree nodes**: `node()` factory creates PrimaSet with tree capabilities
- **Address system**: Path from root using dot/slash notation
- **Traversal**: `walk()` with depth/breadth/leaves modes
- **Relationships**: `parent`, `children`, `ancestors`, `descendants`, `siblings`
- **Virtual DOM foundation**: `vdom()` builder and `.render()` method
- **Integration**: Works seamlessly with PrimaSet operations

### Quick Example

```javascript
import { tree, vdom, walkTree, findNode } from 'primalib'

// Tree structure
const root = tree({ a: 1, b: { c: 2 } })
root.find('b.c').address()  // → 'b.c'
root.find('b.c').path()     // → ['b', 'c']

// Virtual DOM
const vnode = vdom({
  tag: 'div',
  props: { id: 'app' },
  children: [
    { tag: 'h1', children: ['Hello'] }
  ]
})
vnode.render()  // → DOM element (browser) or structure (server)
```

**See [PRIMATREE.md](./PRIMATREE.md) for complete documentation.**

## 🍒 **9. PrimaWeb - Universal Web Pipeline**

**Module**: `primaweb.mjs`  
**Documentation**: [PRIMAWEB.md](./PRIMAWEB.md)

PrimaWeb provides a universal web pipeline for demos, examples, and interactive applications. It's the **cherry on top** 🍒 that makes PrimaLib shine in web environments.

### Key Features

- **Universal API**: Works in browser, Node.js, WebSocket, and standalone contexts
- **Markdown rendering**: `say()` for automatic markdown-to-HTML conversion
- **Event handling**: `on()` / `send()` for unified event handling
- **WebSocket pipeline**: `client()` / `server()` for WebSocket communication
- **DOM as PrimaSet**: `el()` for accessing DOM elements as lazy sets
- **Context factory**: `PrimaWeb()` for creating contexts with default targets

### Quick Example

```javascript
import { PrimaWeb, say, on, el } from 'primalib'

// Create context
const { say } = PrimaWeb('#content')

// Render markdown
say('# Hello World')
say('**Bold** and *italic* text')

// Event handling
on('click', '#button', () => console.log('Clicked!'))

// DOM as PrimaSet
el('div.item').map(el => el.textContent).toArray()
```

**See [PRIMAWEB.md](./PRIMAWEB.md) for complete documentation.**

## 🎨 **10. Prima3D - Three.js Visualizer**

**Module**: `prima3d.mjs`  
**Documentation**: [PRIMA3D.md](./PRIMA3D.md)

Prima3D provides visualization capabilities for PrimaLib geometries using Three.js, converting geometric structures into interactive 3D meshes.

### Key Features

- **Geometry conversion**: Convert PrimaLib geometries to Three.js meshes
- **Scene management**: Create and manage Three.js scenes with cameras and lights
- **PrimaSet integration**: Visualize sets of geometries as groups
- **Multiple geometry types**: Points, hypercubes, hyperplanes, complex numbers, quaternions, octonions
- **Standalone**: Works with Three.js CDN, no build step required

### Quick Example

```javascript
import { visualize } from 'primalib/prima3d.mjs'
import { point, hypercube } from 'primalib'

// Visualize point
visualize(point(1, 2, 3), { container: '#canvas' })

// Visualize hypercube
visualize(hypercube([0,0,0], [1,1,1]), {
  container: '#canvas',
  showVertices: true,
  showEdges: true
})
```

**See [PRIMA3D.md](./PRIMA3D.md) for complete documentation.**

## 🎯 **Module Dependencies**

```
PrimaSet ⭐ (Foundation)
  ├── PrimaOps (Operations)
  ├── PrimaNum (Number Theory)
  ├── PrimaGeo (Geometry)
  ├── PrimaStat (Statistics)
  ├── PrimaTopo (Topology - uses PrimaGeo)
  ├── PrimaLin (Linear Algebra - uses PrimaGeo)
  ├── PrimaTree (Tree Handling)
  ├── PrimaWeb 🍒 (Web Pipeline)
  └── Prima3D (Three.js Visualizer - uses PrimaGeo)
```

**All modules build on PrimaSet**, enabling lazy evaluation, infinite sequences, and unified operations.

## 🚀 **Quick Start**

### Installation

```bash
npm install primalib
```

### Basic Usage

```javascript
import { N, sq, sum, primes, primaSet } from 'primalib'

// Infinite sequences
N(10).sq().sum()  // → 385 (sum of squares)
primes.take(10)   // → [2,3,5,7,11,13,17,19,23,29]

// Everything is a set
primaSet([1,2,3]).map(x => x * 2)  // → [2,4,6]
```

### Module-Specific Imports

```javascript
// Number theory
import { N, primes, twins, address } from 'primalib'

// Geometry
import { point, hypercube, hyperplane } from 'primalib'

// Linear algebra
import { vector, matrix, polynomial } from 'primalib'

// Statistics
import { mean, stddev, correlation } from 'primalib'

// Trees
import { tree, vdom, walkTree } from 'primalib'

// Web
import { PrimaWeb, say, on } from 'primalib'
```

## 🎨 **Design Principles**

### 1. **Everything is a Set**

PrimaSet treats everything uniformly as a lazy, iterable set:
- Numbers → `{5}`
- Arrays → `{1,2,3}`
- Infinite streams → `{2,3,5,7,11,...}`
- Objects → `{{a:1, b:2}}`
- DOM elements → `{div1, div2, ...}`

### 2. **Lazy by Default**

Operations are lazy - they only compute when needed:
- Infinite sequences without memory issues
- Composable pipelines
- On-demand materialization

### 3. **Composable Operations**

Operations compose naturally:
- Build pipelines, apply anywhere
- Mix and match modules
- Unified API across all modules

### 4. **Extensible**

Add your own operations through plugins:
- `primaSet.plugin({ cube: x => x³ })`
- Works everywhere automatically
- Both methods and free functions

## 📖 **Complete API Reference**

### Core

- **PrimaSet**: `primaSet(src, opts?)` - Create set from any source
- **Plugin System**: `primaSet.plugin(functions)` - Add operations

### Number Theory (PrimaNum)

- **Sequences**: `N()`, `Z()`, `R()`, `evens()`, `odds()`, `multiplesOf()`
- **Primes**: `primes`, `twins`, `cousins`, `sexy`, `primeGaps`
- **Geometry**: `complex()`, `quaternion()`, `octonion()`, `geometricSieve()`
- **CRT**: `address()`, `address.toNumber()`

### Geometry (PrimaGeo)

- **Points**: `point(...coords)`, `point.add()`, `point.scale()`, `point.norm()`
- **Hypercubes**: `hypercube(corner, sides)`, `hypercube.vertices()`, `hypercube.sample()`
- **Hyperplanes**: `hyperplane(normal, distance)`, `hyperplane.distance()`

### Statistics (PrimaStat)

- **Descriptive**: `mean()`, `median()`, `stddev()`, `variance()`, `percentile()`
- **Information**: `entropy()`, `relativeEntropy()`, `uniformity()`
- **Correlation**: `correlation()`, `linearRegression()`
- **Time Series**: `movingAverage()`, `ema()`, `differences()`

### Topology (PrimaTopo)

- **Complexes**: `simplicialComplex()`, `eulerCharacteristic()`
- **Homology**: `homologyGroups()`, `bettiNumbers()`
- **Bundles**: `fiberBundle()`, `projection()`

### Linear Algebra (PrimaLin)

- **Vectors**: `vector(...coords)`, `dotProduct()`, `crossProduct()`, `normalize()`
- **Matrices**: `matrix(data)`, `transpose()`, `determinant()`, `inverse()`, `multiply()`
- **Polynomials**: `polynomial(coeffs)`, `evaluate()`, `derivative()`, `integral()`, `roots()`

### Trees (PrimaTree)

- **Nodes**: `node(value, opts?)`, `tree()`, `vdom()`
- **Traversal**: `walk(mode)`, `walkTree()`, `leaves()`, `descendants()`
- **Relationships**: `parent`, `children()`, `ancestors()`, `siblings()`
- **Address**: `address(separator?)`, `path()`, `find()`

### Web (PrimaWeb)

- **Rendering**: `say(content, target?)` - Markdown/HTML renderer
- **Events**: `on(event, selector, handler)`, `send(event, data)`
- **WebSocket**: `client(url)`, `server(port)`
- **DOM**: `el(selector)` - DOM as PrimaSet
- **Context**: `PrimaWeb(target?)` - Create context

## 🔗 **Integration Examples**

### Example 1: Prime Analysis

```javascript
import { primes, mean, stddev, address } from 'primalib'

// Analyze first 100 primes
const first100 = primes.take(100).toArray()
mean(first100)  // → Average prime
stddev(first100)  // → Standard deviation

// CRT addresses
primes.take(10).map(p => address(p))
```

### Example 2: Geometric Visualization

```javascript
import { hypercube, point, vector } from 'primalib'

// 3D cube
const cube = hypercube([0,0,0], [1,1,1])
const vertices = cube.vertices()

// Convert to vectors
vertices.map(v => vector(...v.coords))
```

### Example 3: Statistical Analysis

```javascript
import { N, mean, correlation, movingAverage } from 'primalib'

// Time series
const series = N(100).toArray()
const smoothed = movingAverage(series, 5)

// Correlation
correlation(series, smoothed)
```

### Example 4: Linear Algebra

```javascript
import { vector, matrix, polynomial } from 'primalib'

// Vector operations
const v1 = vector(1, 2, 3)
const v2 = vector(4, 5, 6)
v1.dot(v2)  // → 32

// Matrix operations
const m = matrix([[1,2],[3,4]])
m.det()  // → -2

// Polynomial roots
polynomial([1, 0, -1]).roots()  // → [-1, 1]
```

### Example 5: Tree Traversal

```javascript
import { tree, walkTree, primaSet } from 'primalib'

// Tree structure
const root = tree({ a: 1, b: { c: 2, d: 3 } })

// Traverse with PrimaSet
primaSet(root.walk())
  .filter(n => n.isLeaf())
  .map(n => n.address())
  .toArray()  // → ['a', 'b.c', 'b.d']
```

### Example 6: Web Integration

```javascript
import { PrimaWeb, N, sq, sum } from 'primalib'

// Create web context
const { say } = PrimaWeb('#content')

// Render mathematical results
say(`# Sum of Squares\n\n${sum(sq(N(10)))}`)
```

## 🎓 **Learning Path**

### Beginner

1. **Start with PrimaSet**: Understand the core abstraction
   - Read [PRIMASET.md](./PRIMASET.md)
   - Try: `primaSet([1,2,3]).map(x => x * 2)`

2. **Explore Number Sequences**: Work with infinite sequences
   - Read [PRIMANUM.md](./PRIMANUM.md)
   - Try: `N(10).sq().sum()`, `primes.take(10)`

3. **Basic Operations**: Use algebraic and statistical operations
   - Read [PRIMAOPS.md](./PRIMAOPS.md)
   - Try: `sq([1,2,3])`, `mean([1,2,3,4,5])`

### Intermediate

4. **Geometry**: Work with points and hypercubes
   - Read [PRIMAGEO.md](./PRIMAGEO.md)
   - Try: `point(1,2).add(point(3,4))`, `hypercube([0,0], [1,1])`

5. **Statistics**: Analyze data
   - Read [PRIMASTAT.md](./PRIMASTAT.md)
   - Try: `correlation([1,2,3], [2,4,6])`, `movingAverage([1,2,3,4,5], 3)`

6. **Linear Algebra**: Vectors and matrices
   - Read [PRIMALIN.md](./PRIMALIN.md)
   - Try: `vector(1,2,3).dot(vector(4,5,6))`, `matrix([[1,2],[3,4]]).det()`

### Advanced

7. **Topology**: Simplicial complexes and homology
   - Read [PRIMATOPO.md](./PRIMATOPO.md)
   - Try: `simplicialComplex()`, `eulerCharacteristic()`

8. **Trees**: Tree structures and Virtual DOM
   - Read [PRIMATREE.md](./PRIMATREE.md)
   - Try: `tree({a:1, b:2})`, `vdom({tag:'div'})`

9. **Web Integration**: Build interactive applications
   - Read [PRIMAWEB.md](./PRIMAWEB.md)
   - Try: `PrimaWeb('#content')`, `say('# Hello')`

## 🧪 **Testing**

PrimaLib includes comprehensive test suites for all modules:

```bash
npm test
```

**Test Coverage**:
- PrimaSet: Core lazy set operations
- PrimaOps: All operations and methods
- PrimaNum: Number sequences and primes
- PrimaGeo: Geometric structures
- PrimaStat: Statistical functions
- PrimaTopo: Topological invariants
- PrimaLin: Linear algebra operations
- PrimaTree: Tree traversal and Virtual DOM
- PrimaWeb: Web pipeline functionality

## 🔌 **Extending PrimaLib**

### Adding Operations

```javascript
import { primaSet } from 'primalib'

// Add custom operation
primaSet.plugin({
  cube: x => x * x * x,
  
  // Lazy generator method
  *squares() {
    for (const x of this) {
      yield x * x
    }
  }
})

// Use everywhere!
primaSet([1,2,3]).cube()  // → [1, 8, 27]
primaSet([1,2,3]).squares()  // → [1, 4, 9]
```

### Creating Modules

All PrimaLib modules follow the same pattern:
1. Build on `primaSet` for lazy evaluation
2. Export functions and factories
3. Integrate with other modules where appropriate
4. Provide comprehensive test coverage

## 📝 **Additional Resources**

### Internal Documentation

- **Architecture**: See module-specific documentation for architecture details
- **Plugin System**: See [PRIMASET.md](./PRIMASET.md) for plugin API
- **Integration**: See module documentation for integration examples

### External Resources

- **GitHub**: Source code and issues
- **npm**: Package distribution
- **Examples**: See `/examples/` directory for usage examples

## 🎯 **Summary**

PrimaLib provides a comprehensive mathematical library built around **PrimaSet** ⭐ - a unified abstraction for lazy, iterable sets. All modules build on this foundation, enabling:

- **Infinite sequences** as natural as arrays
- **Unified operations** across all data types
- **Lazy evaluation** for memory efficiency
- **Composable pipelines** for complex computations
- **Extensible architecture** through plugins

**Start with [PRIMASET.md](./PRIMASET.md) to understand the core, then explore modules based on your needs.**

---

**PrimaLib** - *Math made magical with lazy sets. Infinite sequences as natural as arrays, arrays as powerful as infinite sequences.* ✨

