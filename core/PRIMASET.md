# PrimaSet - The Shining Star ⭐

> **"Everything is a set - numbers, arrays, infinite streams, objects, trees, DOM elements. One abstraction, infinite possibilities."**

PrimaSet is the **shining star** ⭐ at the heart of PrimaLib - a unified abstraction that treats everything as a lazy, iterable set. It enables you to work with infinite sequences (primes, naturals, etc.) exactly like you work with finite arrays, with zero memory overhead and maximum flexibility.

## 🌟 **Philosophy: Everything is a Set**

PrimaSet embodies a simple yet powerful philosophy: **everything is a set**. Whether it's a single number, a finite array, an infinite stream of primes, a DOM element, or a nested tree structure - PrimaSet treats them all uniformly as lazy, iterable sets.

### The Core Insight

```javascript
// All of these are sets:
primaSet(42)                    // → {42} (singleton)
primaSet([1,2,3])               // → {1,2,3} (finite)
primaSet(primes)                // → {2,3,5,7,11,...} (infinite)
primaSet({a:1, b:2})            // → {{a:1, b:2}} (object)
primaSet(document.querySelectorAll('div'))  // → {div1, div2, ...} (DOM)
```

**The magic**: One abstraction, infinite possibilities. No special cases, no type checking, just pure set operations.

## 🎯 **Core Principles**

### 1. **Lazy by Default**

PrimaSet never materializes more than necessary. Operations are lazy - they only compute when you iterate or access values.

```javascript
import { primaSet, primes } from 'primalib'

// Infinite primes - no memory explosion!
const P = primaSet(primes)
P.take(10)  // → Only computes first 10 primes
P.get(100)  // → Only computes up to 100th prime

// Lazy operations chain
P.map(p => p * 2).filter(p => p > 10).take(5)
// → Only computes what's needed
```

### 2. **Infinite as Natural**

Infinite sequences work exactly like finite arrays. No special syntax, no different APIs - just natural iteration.

```javascript
import { N, primes } from 'primalib'

// Infinite naturals - browse freely!
N().get(0)      // → 1
N().get(99)     // → 100
N().take(10)    // → [1,2,3,4,5,6,7,8,9,10]

// Infinite primes - same thing!
primes.get(0)   // → 2
primes.get(4)   // → 11
primes.take(10) // → [2,3,5,7,11,13,17,19,23,29]
```

### 3. **Unified Abstraction**

One API for all data types. Scalars, arrays, infinite streams, objects, trees - they all work the same way.

```javascript
import { primaSet } from 'primalib'

// Scalar
primaSet(5).map(x => x * 2)  // → [10]

// Array
primaSet([1,2,3]).map(x => x * 2)  // → [2,4,6]

// Infinite stream
primaSet(N()).map(x => x * 2).take(5)  // → [2,4,6,8,10]

// DOM elements
primaSet(document.querySelectorAll('div'))
  .map(el => el.textContent)
  .filter(text => text.length > 10)
```

### 4. **Composable Operations**

Operations compose naturally. Build pipelines, then apply to any data.

```javascript
import { primaSet, N } from 'primalib'

// Build pipeline
const pipeline = (set) => set
  .map(x => x * 2)
  .filter(x => x > 10)
  .take(5)

// Apply to anything
pipeline(primaSet([1,2,3,4,5,6,7,8,9,10]))  // → [12,14,16,18,20]
pipeline(N())  // → [12,14,16,18,20] (infinite!)
```

## 🔄 **Versatility: What PrimaSet Handles**

### Numbers & Scalars

```javascript
import { primaSet } from 'primalib'

primaSet(42)           // → {42}
primaSet(3.14)         // → {3.14}
primaSet(BigInt(100))  // → {100n}
```

### Arrays & Lists

```javascript
primaSet([1, 2, 3])           // → {1,2,3}
primaSet(['a', 'b', 'c'])     // → {'a','b','c'}
primaSet([[1,2], [3,4]])      // → {[1,2], [3,4]}
```

### Infinite Sequences

```javascript
import { N, primes, evens } from 'primalib'

primaSet(N())          // → {1,2,3,4,5,...}
primaSet(primes)       // → {2,3,5,7,11,...}
primaSet(evens())      // → {2,4,6,8,10,...}
```

### Objects & Trees

```javascript
primaSet({a: 1, b: 2})        // → {{a:1, b:2}}
primaSet({x: {y: {z: 1}}})   // → {{x:{y:{z:1}}}}
```

### DOM Elements

```javascript
primaSet(document.querySelectorAll('div'))
primaSet(document.getElementsByTagName('p'))
```

### Generators & Iterables

```javascript
primaSet(function* () {
  let i = 0
  while (true) yield i++
})

primaSet(new Set([1, 2, 3]))
primaSet(new Map([['a', 1], ['b', 2]]))
```

### Functions

```javascript
primaSet({next: (x) => x + 1})  // Custom iterator
```

## ⚡ **Lazy Evaluation**

PrimaSet's lazy evaluation means operations only compute when needed, enabling infinite sequences without memory issues.

### How It Works

```javascript
import { primaSet, N } from 'primalib'

// Create infinite sequence
const naturals = primaSet(N())

// No computation yet - just a generator
const doubled = naturals.map(x => x * 2)

// Still lazy - no computation
const filtered = doubled.filter(x => x > 10)

// NOW it computes - only what's needed
const result = filtered.take(5)  // → [12, 14, 16, 18, 20]
```

### Memory Efficiency

```javascript
// This doesn't explode memory - it's lazy!
const allPrimes = primaSet(primes)
allPrimes.take(1000000)  // → Computes only first million

// Even this is safe - only computes when accessed
allPrimes.get(999999)    // → Millionth prime (computed on demand)
```

### Caching Options

```javascript
// Default: pure lazy (no caching)
const lazy = primaSet(primes)
lazy.get(100)  // → Computes every time

// Memo mode: cache computed values
const memo = primaSet(primes, { memo: true })
memo[100]      // → Computes once, caches
memo[100]      // → Returns cached value (fast!)

// Sliding window cache: efficient for large sequences
const cached = primaSet(primes, { cache: true, cacheSize: 1000 })
```

## 🎨 **Multiple Calling Styles**

PrimaSet supports multiple programming styles - choose what fits your codebase.

### Object-Oriented Chaining

```javascript
import { N } from 'primalib'

N(10).map(x => x * 2).filter(x => x > 5).take(3)
// → [6, 8, 10]
```

### Functional Composition

```javascript
import { primaSet, N } from 'primalib'

primaSet(N(10))
  .map(x => x * 2)
  .filter(x => x > 5)
  .take(3)
```

### Free Functions

```javascript
import { primaSet, N } from 'primalib'
const { map, filter, take } = primaSet

take(filter(map(N(10), x => x * 2), x => x > 5), 3)
```

### Pipeline Style

```javascript
import { primaSet, pipe } from 'primalib'

pipe(
  N,
  take(10),
  map(x => x * 2),
  filter(x => x > 5),
  take(3)
)()
```

**All styles work the same way** - pick what feels natural!

## 🔌 **Plugin System**

PrimaSet is extensible through its plugin system. Add your own operations and they automatically work everywhere.

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
primaSet([1,2,3]).cube()        // → [1, 8, 27]
primaSet([1,2,3]).squares()     // → [1, 4, 9]

// Free functions too!
const { cube, squares } = primaSet
cube([1,2,3])                   // → [1, 8, 27]
```

### Auto-Detection

PrimaSet automatically detects whether a function is a method (uses `this`) or a free function, and creates both styles automatically.

```javascript
primaSet.plugin({
  // Method (uses this)
  *evens() {
    for (const x of this) {
      if (x % 2 === 0) yield x
    }
  },
  
  // Free function (no this)
  double: x => x * 2
})

// Both work!
primaSet([1,2,3,4]).evens()     // → [2, 4] (method)
primaSet.double([1,2,3])        // → [2, 4, 6] (free function)
```

## 📋 **Core Operations**

### Transformation

```javascript
import { primaSet, N } from 'primalib'

// Map: transform each element
primaSet([1,2,3]).map(x => x * 2)  // → [2,4,6]

// Filter: keep matching elements
primaSet([1,2,3,4,5]).filter(x => x % 2 === 0)  // → [2,4]

// Take: get first n elements (lazy)
N().take(5)  // → [1,2,3,4,5]

// Skip: skip first n elements
N(10).skip(3)  // → [4,5,6,7,8,9,10]
```

### Reduction

```javascript
// Reduce: fold operation
primaSet([1,2,3,4,5]).reduce((a, b) => a + b, 0)  // → 15

// Sum: built-in reduction
primaSet([1,2,3,4,5]).sum()  // → 15
```

### Query

```javascript
// Get: materialize element by index
primes.get(4)  // → 11 (5th prime)

// First: get first element
primes.first()  // → 2

// Count: count elements
primaSet([1,2,3]).count()  // → 3

// IsEmpty: check if empty
primaSet([]).isEmpty()  // → true
```

### Combination

```javascript
// Zip: pair with another set
primaSet([1,2]).zip([10,20])  // → [[1,10], [2,20]]

// Concat: combine sets
primaSet([1,2]).concat([3,4])  // → [1,2,3,4]

// Mix: compose sets (bag of sets)
primaSet([1,2]).mix([3,4])  // → [1,2,3,4]
```

### Materialization

```javascript
// ToArray: convert to array
primaSet([1,2,3]).toArray()  // → [1,2,3]

// ValueOf: unwrap singletons
primaSet(42).valueOf()  // → 42

// ToString: string representation
primaSet([1,2,3]).toString()  // → "1,2,3"
```

## 🔗 **Integration with PrimaLib**

PrimaSet is the foundation for all PrimaLib modules. Everything builds on PrimaSet's lazy evaluation.

### With Number Sequences

```javascript
import { primaSet, N, primes } from 'primalib'

// PrimaSet works seamlessly with number generators
primaSet(N(10)).map(x => x * x).sum()  // → 385
primaSet(primes).take(10).toArray()    // → [2,3,5,7,11,13,17,19,23,29]
```

### With Geometry

```javascript
import { primaSet, hypercube } from 'primalib'

// Hypercube vertices as PrimaSet
const vertices = hypercube([0,0,0], [1,1,1]).vertices()
primaSet(vertices).map(v => v.norm()).toArray()
```

### With Linear Algebra

```javascript
import { primaSet, vector } from 'primalib'

// Vectors as PrimaSet
const vectors = primaSet([
  vector(1, 0),
  vector(0, 1),
  vector(1, 1)
])
vectors.map(v => v.norm()).toArray()  // → [1, 1, 1.414...]
```

### With Statistics

```javascript
import { primaSet, mean, stddev } from 'primalib'

const data = primaSet([1,2,3,4,5])
mean(data.toArray())    // → 3
stddev(data.toArray())  // → 1.58...
```

### With Trees

```javascript
import { primaSet, node, tree } from 'primalib'

// Tree nodes as PrimaSet
const root = tree({ a: 1, b: { c: 2 } })
primaSet(root.walk()).map(n => n.address()).toArray()
```

## 🎯 **Use Cases**

### 1. **Mathematical Sequences**

```javascript
import { primaSet, N, primes } from 'primalib'

// Infinite sequences
const squares = primaSet(N()).map(x => x * x)
squares.take(10)  // → [1,4,9,16,25,36,49,64,81,100]

// Prime operations
primaSet(primes).take(100).filter(p => p % 4 === 1).take(10)
```

### 2. **Data Processing**

```javascript
import { primaSet } from 'primalib'

// Process arrays lazily
const data = primaSet([1,2,3,4,5,6,7,8,9,10])
data
  .filter(x => x % 2 === 0)
  .map(x => x * x)
  .take(3)
  .toArray()  // → [4, 16, 36]
```

### 3. **DOM Manipulation**

```javascript
import { primaSet } from 'primalib'

// DOM elements as sets
primaSet(document.querySelectorAll('.item'))
  .map(el => el.textContent)
  .filter(text => text.length > 10)
  .forEach(text => console.log(text))
```

### 4. **Tree Traversal**

```javascript
import { primaSet, tree } from 'primalib'

// Tree nodes as sets
const root = tree({ a: 1, b: { c: 2 } })
primaSet(root.walk())
  .filter(n => n.isLeaf())
  .map(n => n._treeValue)
  .toArray()  // → [1, 2]
```

### 5. **Stream Processing**

```javascript
import { primaSet } from 'primalib'

// Process streams lazily
const stream = primaSet(function* () {
  let i = 0
  while (true) {
    yield fetch(`/api/data/${i++}`).then(r => r.json())
  }
})

stream.take(10).forEach(promise => promise.then(console.log))
```

## 🏗️ **Architecture**

### Proxy-Based Design

PrimaSet uses JavaScript Proxies to provide a seamless API that adapts to the input type.

```javascript
// PrimaSet automatically adapts:
primaSet(42)        // → Singleton set
primaSet([1,2,3])   // → Array-backed set (fast)
primaSet(N())       // → Generator-backed set (lazy)
```

### Sliding Window Cache

For large sequences, PrimaSet uses a sliding window cache to balance memory and performance.

```javascript
const cached = primaSet(primes, {
  cache: true,
  cacheSize: 1000,    // Keep last 1000 values
  windowSize: 100     // Emit events every 100 values
})

cached._cache.on('window', ({ size, start }) => {
  console.log(`Cached ${size} values starting at ${start}`)
})
```

### Memoization Mode

Memo mode materializes the entire sequence for fast random access.

```javascript
const memo = primaSet(primes, { memo: true })
memo[0]   // → 2 (fast array access)
memo[99]  // → 541 (cached)
```

## 📊 **Performance Characteristics**

### Lazy Evaluation

- **Memory**: O(1) for infinite sequences (only computes what's needed)
- **Time**: O(n) for n elements accessed
- **Overhead**: Minimal - just generator function calls

### Caching

- **Memo Mode**: O(n) memory, O(1) access after materialization
- **Sliding Window**: O(windowSize) memory, O(1) access for cached values
- **No Cache**: O(1) memory, O(n) access (recomputes)

### Array-Backed Sets

- **Memory**: O(n) for n elements
- **Time**: O(1) access, O(n) for operations
- **Use When**: Small, finite sequences

## 🎓 **Philosophical Foundations**

### 1. **Uniformity**

Everything is a set. No special cases, no type checking, just pure set operations.

```javascript
// Same operations work everywhere:
primaSet(5).map(x => x * 2)           // → [10]
primaSet([1,2,3]).map(x => x * 2)     // → [2,4,6]
primaSet(N()).map(x => x * 2).take(5) // → [2,4,6,8,10]
```

### 2. **Composability**

Operations compose naturally. Build pipelines, then apply to any data.

```javascript
const pipeline = (set) => set
  .map(x => x * 2)
  .filter(x => x > 10)
  .take(5)

// Works with anything!
pipeline(primaSet([1,2,3,4,5,6,7,8,9,10]))
pipeline(N())
pipeline(primes)
```

### 3. **Laziness**

Compute only what's needed. Infinite sequences without memory issues.

```javascript
// This is safe - only computes first 10
primaSet(primes).take(10)

// This too - only computes up to 100th prime
primaSet(primes).get(100)
```

### 4. **Extensibility**

Add your own operations through the plugin system.

```javascript
primaSet.plugin({
  cube: x => x * x * x,
  *squares() {
    for (const x of this) yield x * x
  }
})

// Now available everywhere!
primaSet([1,2,3]).cube()     // → [1, 8, 27]
primaSet([1,2,3]).squares()  // → [1, 4, 9]
```

## 🔬 **Advanced Features**

### Custom Generators

```javascript
// Create custom infinite sequences
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
```

### Iterator Protocol

PrimaSet implements the iterator protocol, so it works with standard JavaScript features.

```javascript
// Works with for...of
for (const value of primaSet([1,2,3])) {
  console.log(value)
}

// Works with spread
[...primaSet([1,2,3])]  // → [1,2,3]

// Works with destructuring
const [first, second] = primaSet([1,2,3])
```

### Array-Like Access

With memo mode, PrimaSet behaves like an array.

```javascript
const memo = primaSet([1,2,3], { memo: true })
memo[0]  // → 1
memo.length  // → 3
memo.forEach(x => console.log(x))
```

## 🎨 **Examples**

### Example 1: Infinite Primes

```javascript
import { primaSet, primes } from 'primalib'

// Infinite primes - browse freely!
const P = primaSet(primes)
P.get(0)      // → 2
P.get(4)      // → 11
P.take(10)    // → [2,3,5,7,11,13,17,19,23,29]

// Operations on infinite primes
P.map(p => p * 2).take(5)  // → [4,6,10,14,22]
P.filter(p => p % 4 === 1).take(5)  // → [5,13,17,29,37]
```

### Example 2: Mathematical Series

```javascript
import { primaSet, N } from 'primalib'

// Sum of squares: 1² + 2² + ... + 10²
const squares = primaSet(N(10)).map(x => x * x)
squares.sum()  // → 385

// Alternating series
const alternating = primaSet(N()).map((x, i) => 
  (i % 2 === 0 ? 1 : -1) / x
)
alternating.take(10).sum()  // → Harmonic series approximation
```

### Example 3: DOM Processing

```javascript
import { primaSet } from 'primalib'

// Process DOM elements lazily
primaSet(document.querySelectorAll('.item'))
  .map(el => ({
    text: el.textContent,
    id: el.id,
    classes: Array.from(el.classList)
  }))
  .filter(item => item.text.length > 10)
  .take(5)
  .forEach(item => console.log(item))
```

### Example 4: Tree Operations

```javascript
import { primaSet, tree } from 'primalib'

// Tree as PrimaSet
const root = tree({
  a: 1,
  b: {
    c: 2,
    d: 3
  }
})

// Traverse and filter
primaSet(root.walk())
  .filter(n => n.isLeaf())
  .map(n => n.address())
  .toArray()  // → ['a', 'b.c', 'b.d']
```

### Example 5: Custom Sequences

```javascript
import { primaSet } from 'primalib'

// Custom sequence: powers of 2
const powersOf2 = primaSet(function* () {
  let n = 1
  while (true) {
    yield n
    n *= 2
  }
})

powersOf2.take(10)  // → [1,2,4,8,16,32,64,128,256,512]
```

## 📋 **Complete API Reference**

### Factory

| Function | Description | Example |
|----------|-------------|---------|
| `primaSet(src, opts?)` | Create set from any source | `primaSet([1,2,3])` |
| `primaSet.plugin(functions)` | Add operations | `primaSet.plugin({cube: x=>x³})` |
| `primaSet.listOps()` | List available operations | `primaSet.listOps()` |

### Core Methods

| Method | Description | Example |
|--------|-------------|---------|
| `*map(f)` | Transform elements | `set.map(x => x*2)` |
| `*filter(p)` | Filter elements | `set.filter(x => x>5)` |
| `*take(n)` | Take first n | `set.take(5)` |
| `takeRange(start, stop)` | Take range | `set.takeRange(1,5)` |
| `*skip(n)` | Skip first n | `set.skip(3)` |
| `reduce(f, init)` | Fold operation | `set.reduce((a,b)=>a+b, 0)` |
| `get(index)` | Get element | `set.get(0)` |
| `first()` | First element | `set.first()` |
| `isEmpty()` | Check empty | `set.isEmpty()` |
| `count()` | Count elements | `set.count()` |
| `toArray()` | Materialize | `set.toArray()` |
| `valueOf()` | Unwrap singleton | `set.valueOf()` |
| `toString(maxlen?)` | String representation | `set.toString()` |

### Combination Methods

| Method | Description | Example |
|--------|-------------|---------|
| `*zip(other, f?)` | Pair elements | `set.zip(other)` |
| `*concat(...others)` | Concatenate | `set.concat(other)` |
| `*mix(...others)` | Compose sets | `set.mix(other)` |
| `*flatten()` | Flatten nested | `set.flatten()` |
| `*unique()` | Remove duplicates | `set.unique()` |
| `sort()` | Sort elements | `set.sort()` |
| `*chunk(size)` | Split into chunks | `set.chunk(3)` |
| `*window(size)` | Sliding window | `set.window(3)` |
| `*cycle()` | Infinite cycle | `set.cycle()` |

### Options

| Option | Description | Example |
|--------|-------------|---------|
| `memo: true` | Enable memoization | `primaSet(src, {memo: true})` |
| `cache: true` | Enable sliding cache | `primaSet(src, {cache: true})` |
| `cacheSize: n` | Cache size | `primaSet(src, {cacheSize: 1000})` |
| `windowSize: n` | Window size | `primaSet(src, {windowSize: 100})` |

## 🎯 **Best Practices**

### When to Use PrimaSet

✅ **Use PrimaSet for:**
- Infinite sequences (primes, naturals, etc.)
- Large datasets (lazy evaluation saves memory)
- Composable pipelines
- Uniform API across data types
- Custom sequences and generators

❌ **Consider alternatives for:**
- Small, frequently accessed arrays (direct array access may be faster)
- Real-time performance-critical code (lazy evaluation has overhead)
- Simple operations on small datasets (may be overkill)

### Performance Tips

1. **Use memo mode** for frequently accessed sequences
2. **Use cache mode** for large sequences with random access
3. **Prefer `take()` over materializing** entire sequences
4. **Chain operations** - PrimaSet optimizes lazy chains
5. **Use array-backed sets** for small, finite data

## 🔗 **Integration**

PrimaSet integrates seamlessly with all PrimaLib modules:

```javascript
import { primaSet, N, primes, hypercube, vector, tree } from 'primalib'

// Number sequences
primaSet(N(10)).map(x => x * x).sum()

// Primes
primaSet(primes).take(100).filter(p => p % 4 === 1)

// Geometry
primaSet(hypercube([0,0,0], [1,1,1]).vertices())
  .map(v => v.norm())

// Vectors
primaSet([vector(1,0), vector(0,1)])
  .map(v => v.norm())

// Trees
primaSet(tree({a:1, b:2}).walk())
  .map(n => n.address())
```

## 🔗 **See Also**

- **[PRIMAOPS.md](../doc/PRIMAOPS.md)** - Extended operations and methods
- **[PRIMANUM.md](../num/PRIMANUM.md)** - Number theory using PrimaSet
- **[PRIMAGEO.md](../geo/PRIMAGEO.md)** - Geometry with PrimaSet
- **[PRIMALIB.md](../doc/PRIMALIB.md)** - Complete documentation overview
- **[QUICKREF.md](../doc/QUICKREF.md)** - Quick reference guide

## 🎓 **Mathematical Foundations**

PrimaSet is inspired by mathematical set theory:

- **Set Operations**: Union, intersection, cartesian product (via `mix`, `zip`)
- **Lazy Evaluation**: Inspired by functional programming and lazy sequences
- **Infinite Sets**: Mathematical sets can be infinite - PrimaSet makes them computable
- **Uniformity**: Mathematical sets treat all elements uniformly - PrimaSet does too

## ✨ **The Magic**

PrimaSet's magic comes from three principles:

1. **Everything is a set** - Uniform abstraction
2. **Lazy by default** - Infinite sequences without memory issues
3. **Composable operations** - Build pipelines, apply anywhere

**Result**: One API, infinite possibilities. Work with primes, arrays, DOM elements, trees - all the same way.

---

**PrimaSet** ⭐ - *The shining star that makes infinite sequences as natural as arrays, and arrays as powerful as infinite sequences.* ✨

