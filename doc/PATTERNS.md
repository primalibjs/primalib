# PrimaLib Patterns & Recipes

> **"Common patterns and recipes for real-world PrimaLib usage - copy, paste, and adapt."**

This document provides practical patterns and recipes for common use cases. Each pattern includes working code examples you can copy and adapt.

**See also**: [QUICKREF.md](./QUICKREF.md) for quick syntax lookup, [PRIMALIB.md](./PRIMALIB.md) for complete API reference.

## 🎯 **Mathematical Patterns**

### Pattern 1: Sum of Squares

**Use Case**: Calculate sum of squares (1² + 2² + ... + n²)

```javascript
import { N, sq, sum } from 'primalib'

// Method 1: Functional style
const result = sum(sq(N(10)))  // → 385

// Method 2: Method chaining
const result2 = N(10).sq().sum()  // → 385

// Method 3: Pipeline
import { pipe } from 'primalib'
const sumOfSquares = pipe(N, take(10), sq, sum)
const result3 = sumOfSquares()  // → 385
```

**Variations**:
```javascript
// Sum of cubes
sum(cube(N(10)))  // If cube plugin exists

// Sum of first n primes squared
sum(sq(primes.take(10)))  // → 2397

// Sum of even numbers squared
sum(sq(N(20).filter(x => x % 2 === 0)))  // → 1540
```

**Related**: [PRIMAOPS.md](./PRIMAOPS.md) - Operations, [PRIMASET.md](./PRIMASET.md) - Lazy evaluation

---

### Pattern 2: Series Calculations

**Use Case**: Calculate mathematical series

```javascript
import { N, primes } from 'primalib'
import { primaSet } from 'primalib'
const { sum, mean } = primaSet

// Harmonic series approximation
const harmonic = N().map(n => 1 / n).take(100).sum()

// Alternating series
const alternating = N().map((n, i) => 
  (i % 2 === 0 ? 1 : -1) / n
).take(100).sum()

// Prime series
const primeSum = primes.take(100).sum()  // → 24133
const primeMean = mean(primes.take(100).toArray())  // → 241.33
```

**Related**: [PRIMANUM.md](./PRIMANUM.md) - Number sequences, [PRIMASTAT.md](./PRIMASTAT.md) - Statistics

---

### Pattern 3: Filter & Transform Pipeline

**Use Case**: Process data with multiple transformations

```javascript
import { primaSet, N } from 'primalib'
const { filter, map, take } = primaSet

// Even numbers, squared, first 5
const result = N(20)
  .filter(x => x % 2 === 0)
  .map(x => x * x)
  .take(5)
  .toArray()  // → [4, 16, 36, 64, 100]

// Primes that are 1 mod 4, squared
const primes1mod4 = primaSet(primes)
  .filter(p => p % 4 === 1)
  .map(p => p * p)
  .take(10)
  .toArray()
```

**Related**: [PRIMASET.md](./PRIMASET.md) - Lazy operations, [PRIMAOPS.md](./PRIMAOPS.md) - Methods

---

### Pattern 4: Reusable Pipeline

**Use Case**: Create reusable mathematical pipelines

```javascript
import { N, pipe } from 'primalib'
import { primaSet } from 'primalib'
const { take, sq, sum, filter } = primaSet

// Build pipeline once
const sumOfSquares = pipe(take(10), sq, sum)

// Apply to different sources
sumOfSquares(N())        // → 385
sumOfSquares(primes)     // → 2397
sumOfSquares([1,2,3,4,5])  // → 55

// More complex pipeline
const evenSquares = pipe(
  filter(x => x % 2 === 0),
  sq,
  take(5)
)
evenSquares(N(20))  // → [4, 16, 36, 64, 100]
```

**Related**: [PRIMASET.md](./PRIMASET.md) - Pipeline composition, [PRIMAOPS.md](./PRIMAOPS.md) - Operations

---

## 🔢 **Number Theory Patterns**

### Pattern 5: Prime Analysis

**Use Case**: Analyze prime numbers

```javascript
import { primes, address } from 'primalib'
import { primaSet } from 'primalib'
const { take, map, filter } = primaSet

// First 100 primes
const first100 = primes.take(100).toArray()

// Primes that are 1 mod 4
const primes1mod4 = primaSet(primes)
  .filter(p => p % 4 === 1)
  .take(20)
  .toArray()

// CRT addresses of primes
const primeAddresses = primaSet(primes)
  .take(10)
  .map(p => address(p))
  .toArray()

// Twin primes
import { twins } from 'primalib'
const twinPairs = twins.take(10).toArray()
```

**Related**: [PRIMANUM.md](./PRIMANUM.md) - Prime sequences, [QUICKREF.md](./QUICKREF.md) - Quick syntax

---

### Pattern 6: Number Sequence Generation

**Use Case**: Generate custom number sequences

```javascript
import { N, Z, R, evens, odds } from 'primalib'

// Naturals up to n
const naturals = N(10)  // → [1,2,3,4,5,6,7,8,9,10]

// Integers in range
const integers = Z(-5, 5)  // → [-5,-4,-3,-2,-1,0,1,2,3,4,5]

// Real numbers with precision
const reals = R(0, 1, 2)  // → [0.00,0.01,0.02,...,1.00]

// Even/odd numbers
const evensUpTo20 = evens(20)  // → [2,4,6,8,10,12,14,16,18,20]
const oddsUpTo19 = odds(19)    // → [1,3,5,7,9,11,13,15,17,19]
```

**Related**: [PRIMANUM.md](./PRIMANUM.md) - Number sequences

---

## 📐 **Geometry Patterns**

### Pattern 7: Point Operations

**Use Case**: Work with geometric points

```javascript
import { point } from 'primalib'

// Create points
const p1 = point(1, 2, 3)
const p2 = point(4, 5, 6)

// Vector operations
const sum = p1.add(p2)        // → point(5, 7, 9)
const diff = p2.subtract(p1)  // → point(3, 3, 3)
const scaled = p1.scale(2)    // → point(2, 4, 6)
const distance = p1.norm()    // → 3.741...

// Numeric indexing
const x = p1[0]  // → 1
const y = p1[1]  // → 2
const z = p1[2]  // → 3

// Destructuring
const [x, y, z] = p1  // → x=1, y=2, z=3
```

**Related**: [PRIMAGEO.md](./PRIMAGEO.md) - Geometry, [PRIMALIN.md](./PRIMALIN.md) - Vectors

---

### Pattern 8: Hypercube Operations

**Use Case**: Work with n-dimensional hypercubes

```javascript
import { hypercube } from 'primalib'
import { primaSet } from 'primalib'

// 2D square
const square = hypercube([0, 0], [1, 1])
const vertices2D = square.vertices()  // → 4 corners

// 3D cube
const cube = hypercube([0, 0, 0], [1, 1, 1])
const vertices3D = cube.vertices()  // → 8 corners

// Sample interior points
const samples = cube.sample(10)  // → 10 interior points

// Process vertices with PrimaSet
const vertexNorms = primaSet(cube.vertices())
  .map(v => v.norm())
  .toArray()
```

**Related**: [PRIMAGEO.md](./PRIMAGEO.md) - Hypercubes, [PRIMASET.md](./PRIMASET.md) - Set operations

---

### Pattern 9: Distance Calculations

**Use Case**: Calculate distances between points

```javascript
import { point } from 'primalib'

// Distance from origin
const p = point(3, 4)
const dist = p.norm()  // → 5

// Distance between two points
const p1 = point(1, 2)
const p2 = point(4, 6)
const distance = p2.subtract(p1).norm()  // → 5

// Multiple points
import { primaSet } from 'primalib'
const points = [point(0,0), point(1,1), point(2,2)]
const distances = primaSet(points)
  .map(p => p.norm())
  .toArray()  // → [0, 1.414..., 2.828...]
```

**Related**: [PRIMAGEO.md](./PRIMAGEO.md) - Points, [PRIMALIN.md](./PRIMALIN.md) - Vector operations

---

## 📊 **Statistics Patterns**

### Pattern 10: Descriptive Statistics

**Use Case**: Calculate basic statistics

```javascript
import { mean, median, stddev, variance } from 'primalib'

const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// Basic statistics
const avg = mean(data)        // → 5.5
const med = median(data)      // → 5.5
const std = stddev(data)      // → 3.027...
const var = variance(data)    // → 9.166...

// With PrimaSet
import { primaSet } from 'primalib'
const stats = primaSet(data)
  .map(x => ({ value: x, squared: x * x }))
  .toArray()
```

**Related**: [PRIMASTAT.md](./PRIMASTAT.md) - Statistics, [PRIMASET.md](./PRIMASET.md) - Data processing

---

### Pattern 11: Time Series Analysis

**Use Case**: Analyze time series data

```javascript
import { movingAverage, ema, differences } from 'primalib'

const series = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// Moving average
const ma = movingAverage(series, 3)  // → [2, 3, 4, 5, 6, 7, 8, 9]

// Exponential moving average
const emaValues = ema(series, 0.5)  // → Exponential smoothing

// Differences (rate of change)
const diff = differences(series)  // → [1, 1, 1, 1, 1, 1, 1, 1, 1]
```

**Related**: [PRIMASTAT.md](./PRIMASTAT.md) - Time series

---

### Pattern 12: Correlation Analysis

**Use Case**: Find relationships between datasets

```javascript
import { correlation, linearRegression } from 'primalib'

const x = [1, 2, 3, 4, 5]
const y = [2, 4, 6, 8, 10]

// Correlation coefficient
const corr = correlation(x, y)  // → 1.0 (perfect correlation)

// Linear regression
const regression = linearRegression(x, y)
// → { slope: 2, intercept: 0, r2: 1.0 }
```

**Related**: [PRIMASTAT.md](./PRIMASTAT.md) - Correlation

---

## 🔗 **Linear Algebra Patterns**

### Pattern 13: Vector Operations

**Use Case**: Vector calculations

```javascript
import { vector } from 'primalib'

// Create vectors
const v1 = vector(1, 2, 3)
const v2 = vector(4, 5, 6)

// Dot product
const dot = v1.dot(v2)  // → 32

// Cross product (3D only)
const cross = v1.cross(v2)  // → vector(-3, 6, -3)

// Normalize
const unit = v1.normalize()  // → Unit vector
unit.norm()  // → 1

// Projection
const proj = v1.project(v2)  // → Projection of v1 onto v2

// Angle between vectors
const angle = v1.angle(v2)  // → Angle in radians
```

**Related**: [PRIMALIN.md](./PRIMALIN.md) - Vectors, [PRIMAGEO.md](./PRIMAGEO.md) - Points

---

### Pattern 14: Matrix Operations

**Use Case**: Matrix calculations

```javascript
import { matrix, identity, zeros, ones } from 'primalib'

// Create matrices
const m = matrix([[1, 2], [3, 4]])
const I = identity(3)  // 3×3 identity
const Z = zeros(2, 3)  // 2×3 zeros
const O = ones(2, 2)    // 2×2 ones

// Basic operations
const transposed = m.transpose()  // → [[1,3],[2,4]]
const det = m.det()               // → -2
const inv = m.inv()               // → Inverse matrix
const trace = m.trace()           // → 5

// Matrix multiplication
const m1 = matrix([[1, 2], [3, 4]])
const m2 = matrix([[5, 6], [7, 8]])
const product = m1.mul(m2)  // → [[19,22],[43,50]]

// Matrix-vector multiplication
const v = vector(1, 2)
const result = m.mulVec(v)  // → vector(5, 11)
```

**Related**: [PRIMALIN.md](./PRIMALIN.md) - Matrices

---

### Pattern 15: Polynomial Operations

**Use Case**: Work with polynomials

```javascript
import { polynomial } from 'primalib'

// Create polynomial: x² - 1 (coefficients in ascending order)
const p = polynomial([-1, 0, 1])  // [a₀, a₁, a₂] = [-1, 0, 1]

// Evaluate
p.eval(2)  // → 3 (2² - 1)

// Derivative
const pPrime = p.derivative()  // → polynomial([0, 2]) = 2x

// Integral
const pInt = p.integral(0)  // → polynomial([0, -1, 0, 1/3]) = x³/3 - x

// Roots
const roots = p.roots()  // → [-1, 1]

// Operations
const p1 = polynomial([1, 2])  // x + 2
const p2 = polynomial([3, 4])  // 4x + 3
const sum = p1.add(p2)         // → polynomial([4, 6])
const product = p1.mul(p2)     // → polynomial([3, 10, 8])
```

**Related**: [PRIMALIN.md](./PRIMALIN.md) - Polynomials

---

## 🌳 **Tree Patterns**

### Pattern 16: Tree Traversal

**Use Case**: Traverse and process tree structures

```javascript
import { tree, walkTree } from 'primalib'
import { primaSet } from 'primalib'

// Create tree
const root = tree({
  files: {
    src: {
      'index.js': '...',
      'app.js': '...'
    },
    'package.json': '...'
  }
})

// Find nodes
const index = root.find('files.src.index.js')
index.address()  // → 'files.src.index.js'

// Traverse all nodes
const allNodes = walkTree(root).toArray()

// Filter leaves
const leaves = primaSet(root.walk())
  .filter(n => n.isLeaf())
  .map(n => n.path().join('/'))
  .toArray()  // → ['files/src/index.js', 'files/src/app.js', 'files/package.json']
```

**Related**: [PRIMATREE.md](./PRIMATREE.md) - Tree handling

---

### Pattern 17: Virtual DOM

**Use Case**: Create and render Virtual DOM structures

```javascript
import { vdom } from 'primalib'

// Create Virtual DOM
const app = vdom({
  tag: 'div',
  props: { id: 'app', className: 'container' },
  children: [
    { tag: 'h1', children: ['Hello World'] },
    { tag: 'p', children: ['Welcome to PrimaLib'] },
    {
      tag: 'button',
      props: { onClick: () => console.log('Clicked!') },
      children: ['Click me']
    }
  ]
})

// Render (browser)
if (typeof document !== 'undefined') {
  const el = app.render()
  document.body.appendChild(el)
}
```

**Related**: [PRIMATREE.md](./PRIMATREE.md) - Virtual DOM, [PRIMAWEB.md](./PRIMAWEB.md) - Web pipeline

---

## 🍒 **Web Patterns**

### Pattern 18: Markdown Rendering

**Use Case**: Render markdown content

```javascript
import { PrimaWeb, say } from 'primalib'

// Create context
const { say } = PrimaWeb('#content')

// Render markdown
say('# Hello World')
say('**Bold** and *italic* text')
say('```javascript\nconst x = 1\n```')

// With PrimaLib results
import { N, sq, sum } from 'primalib'
say(`# Sum of Squares\n\n${sum(sq(N(10)))}`)
```

**Related**: [PRIMAWEB.md](./PRIMAWEB.md) - Web pipeline

---

### Pattern 19: Event Handling

**Use Case**: Handle DOM events

```javascript
import { on, send } from 'primalib'

// Listen for clicks
on('click', '#button', () => {
  console.log('Button clicked!')
  send('button-clicked', { timestamp: Date.now() })
})

// Listen for custom events
on('button-clicked', (data) => {
  console.log('Received:', data)
})
```

**Related**: [PRIMAWEB.md](./PRIMAWEB.md) - Event handling

---

### Pattern 20: DOM as PrimaSet

**Use Case**: Process DOM elements as sets

```javascript
import { el } from 'primalib'
import { primaSet } from 'primalib'

// Get elements as PrimaSet
const items = el('.item')

// Process lazily
items
  .map(el => el.textContent)
  .filter(text => text.length > 10)
  .take(5)
  .forEach(text => console.log(text))
```

**Related**: [PRIMAWEB.md](./PRIMAWEB.md) - DOM operations, [PRIMASET.md](./PRIMASET.md) - Set operations

---

## 🎨 **Integration Patterns**

### Pattern 21: React Integration

**Use Case**: Use PrimaLib in React components

```javascript
import { useState, useEffect } from 'react'
import { N, sq, sum } from 'primalib'

function SumOfSquares({ n }) {
  const [result, setResult] = useState(null)
  
  useEffect(() => {
    const value = sum(sq(N(n)))
    setResult(value)
  }, [n])
  
  return <div>Sum: {result}</div>
}
```

**Related**: [PRIMALIB.md](./PRIMALIB.md) - Integration examples

---

### Pattern 22: Node.js Server

**Use Case**: Use PrimaLib in Node.js servers

```javascript
import express from 'express'
import { primes, N, sq, sum } from 'primalib'

const app = express()

app.get('/primes/:count', (req, res) => {
  const count = parseInt(req.params.count)
  const result = primes.take(count).toArray()
  res.json({ primes: result })
})

app.get('/sum-squares/:n', (req, res) => {
  const n = parseInt(req.params.n)
  const result = sum(sq(N(n)))
  res.json({ sum: result })
})
```

**Related**: [PRIMALIB.md](./PRIMALIB.md) - Integration examples

---

### Pattern 23: Web Workers

**Use Case**: Use PrimaLib in Web Workers

```javascript
// worker.js
import { primes } from 'primalib'

self.onmessage = (e) => {
  const { count } = e.data
  const result = primes.take(count).toArray()
  self.postMessage({ primes: result })
}

// main.js
const worker = new Worker('worker.js')
worker.postMessage({ count: 1000 })
worker.onmessage = (e) => {
  console.log('Primes:', e.data.primes)
}
```

**Related**: [PRIMASET.md](./PRIMASET.md) - Lazy evaluation benefits

---

## ⚡ **Performance Patterns**

### Pattern 24: Memoization

**Use Case**: Cache computed values for fast access

```javascript
import { primaSet, primes } from 'primalib'

// Enable memoization
const memoized = primaSet(primes, { memo: true })

// Fast array-like access
memoized[0]   // → 2 (cached)
memoized[99]  // → 541 (cached after first access)
memoized[100] // → 547 (computed and cached)
```

**Related**: [PRIMASET.md](./PRIMASET.md) - Memoization, [PERFORMANCE.md](./PERFORMANCE.md) - Performance guide

---

### Pattern 25: Sliding Window Cache

**Use Case**: Efficient caching for large sequences

```javascript
import { primaSet, N } from 'primalib'

// Enable sliding window cache
const cached = primaSet(N(), {
  cache: true,
  cacheSize: 1000,    // Keep last 1000 values
  windowSize: 100     // Emit events every 100 values
})

// Listen for cache events
cached._cache.on('window', ({ size, start }) => {
  console.log(`Cached ${size} values starting at ${start}`)
})
```

**Related**: [PRIMASET.md](./PRIMASET.md) - Caching, [PERFORMANCE.md](./PERFORMANCE.md) - Performance

---

### Pattern 26: Lazy Processing

**Use Case**: Process large datasets without materializing

```javascript
import { primaSet, N } from 'primalib'

// Process lazily - only computes what's needed
const result = primaSet(N())
  .filter(x => x % 2 === 0)
  .map(x => x * x)
  .take(10)
  .toArray()  // → [4, 16, 36, 64, 100, 144, 196, 256, 324, 400]

// Never materializes entire sequence
```

**Related**: [PRIMASET.md](./PRIMASET.md) - Lazy evaluation, [PERFORMANCE.md](./PERFORMANCE.md) - Performance

---

## 🔌 **Plugin Patterns**

### Pattern 27: Adding Custom Operations

**Use Case**: Extend PrimaLib with custom operations

```javascript
import { primaSet } from 'primalib'

// Add simple operation
primaSet.plugin({
  cube: x => x * x * x
})

// Use everywhere
primaSet([1, 2, 3]).cube()  // → [1, 8, 27]
cube([1, 2, 3])             // → [1, 8, 27] (free function)

// Add lazy generator method
primaSet.plugin({
  *squares() {
    for (const x of this) {
      yield x * x
    }
  }
})

primaSet([1, 2, 3]).squares()  // → [1, 4, 9]
```

**Related**: [PRIMASET.md](./PRIMASET.md) - Plugin system, [CONTRIBUTING.md](./CONTRIBUTING.md) - Contributing

---

## 🎯 **Data Processing Patterns**

### Pattern 28: Batch Processing

**Use Case**: Process data in batches

```javascript
import { primaSet } from 'primalib'

const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// Process in chunks
const chunks = primaSet(data).chunk(3).toArray()
// → [[1,2,3], [4,5,6], [7,8,9], [10]]

// Process each chunk
chunks.forEach(chunk => {
  const sum = chunk.reduce((a, b) => a + b, 0)
  console.log('Chunk sum:', sum)
})
```

**Related**: [PRIMAOPS.md](./PRIMAOPS.md) - Methods, [PRIMASET.md](./PRIMASET.md) - Operations

---

### Pattern 29: Grouping Data

**Use Case**: Group data by key

```javascript
import { primaSet, N } from 'primalib'

// Group by modulo
const grouped = N(20).groupBy(x => x % 5)
// → { 0: [5,10,15,20], 1: [1,6,11,16], 2: [2,7,12,17], ... }

// Process groups
Object.entries(grouped).forEach(([key, values]) => {
  console.log(`Modulo ${key}:`, values)
})
```

**Related**: [PRIMAOPS.md](./PRIMAOPS.md) - Grouping, [PRIMASET.md](./PRIMASET.md) - Operations

---

### Pattern 30: Window Operations

**Use Case**: Sliding window analysis

```javascript
import { primaSet, N } from 'primalib'

// Sliding window of size 3
const windows = N(10).window(3).toArray()
// → [[1,2,3], [2,3,4], [3,4,5], ..., [8,9,10]]

// Calculate window averages
const averages = windows.map(w => 
  w.reduce((a, b) => a + b, 0) / w.length
)
```

**Related**: [PRIMAOPS.md](./PRIMAOPS.md) - Window operations, [PRIMASTAT.md](./PRIMASTAT.md) - Time series

---

## 🔗 **Cross-Module Patterns**

### Pattern 31: Geometry + Statistics

**Use Case**: Statistical analysis of geometric data

```javascript
import { hypercube, point } from 'primalib'
import { mean, stddev } from 'primalib'
import { primaSet } from 'primalib'

// Analyze hypercube vertices
const cube = hypercube([0,0,0], [1,1,1])
const vertices = cube.vertices()

// Calculate statistics of vertex norms
const norms = primaSet(vertices)
  .map(v => v.norm())
  .toArray()

const avgNorm = mean(norms)
const stdNorm = stddev(norms)
```

**Related**: [PRIMAGEO.md](./PRIMAGEO.md) - Geometry, [PRIMASTAT.md](./PRIMASTAT.md) - Statistics

---

### Pattern 32: Primes + Geometry

**Use Case**: Map primes to geometric structures

```javascript
import { primes, address, point } from 'primalib'
import { primaSet } from 'primalib'

// Map primes to points using CRT addresses
const primePoints = primaSet(primes)
  .take(100)
  .map(p => point(...address(p).slice(0, 3)))
  .toArray()

// Calculate centroid
const centroid = primePoints.reduce((acc, p) => 
  acc.add(p), point(0, 0, 0)
).scale(1 / primePoints.length)
```

**Related**: [PRIMANUM.md](./PRIMANUM.md) - Primes, [PRIMAGEO.md](./PRIMAGEO.md) - Geometry

---

### Pattern 33: Linear Algebra + Statistics

**Use Case**: Statistical analysis of vectors

```javascript
import { vector } from 'primalib'
import { mean, stddev } from 'primalib'
import { primaSet } from 'primalib'

// Collection of vectors
const vectors = [
  vector(1, 2, 3),
  vector(4, 5, 6),
  vector(7, 8, 9)
]

// Statistics of vector norms
const norms = primaSet(vectors)
  .map(v => v.norm())
  .toArray()

const avgNorm = mean(norms)
const stdNorm = stddev(norms)
```

**Related**: [PRIMALIN.md](./PRIMALIN.md) - Vectors, [PRIMASTAT.md](./PRIMASTAT.md) - Statistics

---

## 🎨 **Advanced Patterns**

### Pattern 34: Custom Sequence Generator

**Use Case**: Create custom infinite sequences

```javascript
import { primaSet } from 'primalib'

// Fibonacci sequence
const fibonacci = primaSet(function* () {
  let [a, b] = [0, 1]
  yield a
  yield b
  while (true) {
    [a, b] = [b, a + b]
    yield b
  }
})

fibonacci.take(10)  // → [0,1,1,2,3,5,8,13,21,34]

// Powers of 2
const powersOf2 = primaSet(function* () {
  let n = 1
  while (true) {
    yield n
    n *= 2
  }
})

powersOf2.take(10)  // → [1,2,4,8,16,32,64,128,256,512]
```

**Related**: [PRIMASET.md](./PRIMASET.md) - Custom generators

---

### Pattern 35: Conditional Processing

**Use Case**: Process data conditionally

```javascript
import { primaSet, N } from 'primalib'
const { iif, when, unless } = primaSet

// Conditional processing
const result = primaSet([1, 2, 3, 4, 5])
  .map(x => iif(x % 2 === 0, x * 2, x * 3))
  .toArray()  // → [3, 4, 9, 8, 15]

// When/unless
const filtered = primaSet([1, 2, 3, 4, 5])
  .filter(x => when(x > 2, x < 5))
  .toArray()  // → [3, 4]
```

**Related**: [PRIMAOPS.md](./PRIMAOPS.md) - Control flow

---

## 📋 **Pattern Summary**

| Pattern | Category | Use Case |
|---------|----------|----------|
| Sum of Squares | Math | Calculate Σ(n²) |
| Series Calculations | Math | Mathematical series |
| Filter & Transform | Data | Process with pipeline |
| Reusable Pipeline | Composition | Build reusable functions |
| Prime Analysis | Number Theory | Analyze primes |
| Number Sequences | Sequences | Generate sequences |
| Point Operations | Geometry | Vector math |
| Hypercube Operations | Geometry | n-dimensional cubes |
| Distance Calculations | Geometry | Calculate distances |
| Descriptive Statistics | Statistics | Basic stats |
| Time Series | Statistics | Analyze trends |
| Correlation | Statistics | Find relationships |
| Vector Operations | Linear Algebra | Vector math |
| Matrix Operations | Linear Algebra | Matrix math |
| Polynomial Operations | Linear Algebra | Polynomial math |
| Tree Traversal | Trees | Navigate trees |
| Virtual DOM | Trees/Web | Render UI |
| Markdown Rendering | Web | Display content |
| Event Handling | Web | Handle events |
| DOM as PrimaSet | Web | Process DOM |
| React Integration | Integration | React components |
| Node.js Server | Integration | Server-side |
| Web Workers | Integration | Background processing |
| Memoization | Performance | Cache values |
| Sliding Window | Performance | Efficient caching |
| Lazy Processing | Performance | Memory efficient |
| Custom Operations | Extensibility | Add plugins |
| Batch Processing | Data | Process in chunks |
| Grouping | Data | Group by key |
| Window Operations | Data | Sliding windows |
| Cross-Module | Integration | Combine modules |
| Custom Sequences | Advanced | Infinite sequences |
| Conditional | Advanced | Conditional logic |

---

## 🔗 **Related Documentation**

- **[QUICKREF.md](./QUICKREF.md)** - Quick syntax reference
- **[PRIMALIB.md](./PRIMALIB.md)** - Complete API documentation
- **[PRIMASET.md](./PRIMASET.md)** - Core lazy set operations
- **[PRIMAOPS.md](./PRIMAOPS.md)** - Extended operations
- **[PRIMANUM.md](./PRIMANUM.md)** - Number theory
- **[PRIMAGEO.md](./PRIMAGEO.md)** - Geometry
- **[PRIMASTAT.md](./PRIMASTAT.md)** - Statistics
- **[PRIMALIN.md](./PRIMALIN.md)** - Linear algebra
- **[PRIMATREE.md](./PRIMATREE.md)** - Tree handling
- **[PRIMAWEB.md](./PRIMAWEB.md)** - Web pipeline
- **[PERFORMANCE.md](./PERFORMANCE.md)** - Performance guide
- **[ERRORS.md](./ERRORS.md)** - Error handling

---

**Patterns & Recipes** - *Copy, paste, and adapt. Real-world patterns for common use cases.* 🎯

