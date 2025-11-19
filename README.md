# 🌟 PrimaLib: Math Made Magical ✨

> **"Because math should feel like poetry, not paperwork."**

PrimaLib is your friendly algebraic playground for **math operations, geometry, and infinite sequences using lazy sets**. Think of it as a magical transformer that makes scalars, arrays, and infinite streams all dance to the same tune.

At its heart is **`primaSet`** ⭐ - the shining star that treats everything as a set: numbers, objects, trees, DOM elements, or infinite streams of primes.

## 🚀 Quick Start

### Install
```bash
npm install primalib
```

Or install individual submodules:
```bash
npm install @primalib/core
npm install @primalib/num
npm install @primalib/geo
# etc.
```

For web development (optional, mainly for dev/tests):
```bash
npm install @primalib/web
```

### Hello World
```javascript
import { N, sq, sum } from 'primalib'

// Sum of squares of first 10 naturals: 1² + 2² + ... + 10² = 385
console.log(sum(sq(N(10))))  // → 385 ✨

// Works with arrays too!
console.log(sum(sq([1,2,3,4,5])))  // → 55
```

**That's it!** You're doing math like a wizard now. 🎩✨

## ⭐ Core Magic: `primaSet`

**`primaSet`** is PrimaLib's superpower - it treats **everything as a set**, seamlessly handling both finite and infinite sequences.

```javascript
import { primaSet, primes, N } from 'primalib'

// Everything is a set!
primaSet(42)                    // → {42}
primaSet([1,2,3])               // → {1,2,3}
primaSet(N())                   // → {1,2,3,...} (infinite!)
primaSet(primes)                // → {2,3,5,7,11,...} (infinite primes!)
primaSet(null)                  // → {} // empty

primes.get(0)                    // → 2 (first prime)
primes.take(10)                 // → [2,3,5,7,11,13,17,19,23,29]
// Infinite sequences work like arrays
N(10).sq().sum()                // → 385 (sum of squares)
```

**The magic**: `primaSet` handles infinite sequences as naturally as finite arrays - no memory explosions, no precomputation, just pure lazy evaluation.

## 📚 Documentation

### Quick Access
- **[QUICKREF.md](./doc/QUICKREF.md)** - Quick reference & cheat sheet ⚡
- **[PATTERNS.md](./doc/PATTERNS.md)** - Common patterns & recipes 🎯
- **[FAQ.md](./doc/FAQ.md)** - Frequently asked questions ❓
- **[INTEGRATION.md](./doc/INTEGRATION.md)** - Framework integration guide 🔗
- **[IMPORT_GUIDE.md](./doc/IMPORT_GUIDE.md)** - Package structure & import guide 📦
- **[PACKAGE_STRUCTURE.md](./doc/PACKAGE_STRUCTURE.md)** - Package structure details 📦
- **[PRIMALIB.md](./doc/PRIMALIB.md)** - Complete documentation with all modules
- **[PRIMAPROMPT.md](./doc/PRIMAPROMPT.md)** - AI reference guide (for LLMs/Copilot) 🤖

### Module Documentation
- **[PRIMASET.md](./core/PRIMASET.md)** - Core lazy set factory (the shining star ⭐)
- **[PRIMAOPS.md](./doc/PRIMAOPS.md)** - Extended operations & methods
- **[PRIMANUM.md](./num/PRIMANUM.md)** - Number theory & geometric primes
- **[PRIMAGEO.md](./geo/PRIMAGEO.md)** - Geometry & hyperdimensional structures
- **[PRIMASTAT.md](./stat/PRIMASTAT.md)** - Statistical analysis tools
- **[PRIMATOPO.md](./topo/PRIMATOPO.md)** - Topology & topological invariants
- **[PRIMALIN.md](./lin/PRIMALIN.md)** - Linear algebra (vectors, matrices, polynomials)
- **[PRIMATREE.md](./tree/PRIMATREE.md)** - Tree handling & Virtual DOM foundation
- **[PRIMAWEB.md](./web/PRIMAWEB.md)** - Universal web pipeline (the cherry on top 🍒)

## 🎯 What's Included

PrimaLib provides:

- **Infinite Sequences**: Primes, naturals, integers - all as lazy sets
- **Number Theory**: Prime constellations, geometric sieves, CRT addresses
- **Geometry**: Points, hypercubes, hyperplanes in n-dimensional space
- **Linear Algebra**: Vectors, matrices, polynomials
- **Statistics**: Descriptive stats, correlation, time series
- **Topology**: Simplicial complexes, homology groups, Euler characteristics
- **Trees**: Tree structures with Virtual DOM foundation
- **Web Pipeline**: Universal web tools for demos and examples

## 🎨 Examples

### Infinite Primes
```javascript
import { primes } from 'primalib'

primes.get(0)      // → 2
primes.get(4)     // → 11
primes.take(10)   // → [2,3,5,7,11,13,17,19,23,29]
```

### Geometry
```javascript
import { point, hypercube } from 'primalib'

point(1,2).add(point(3,4))  // → point(4,6)
hypercube([0,0,0], [1,1,1]).vertices()  // → 8 corner points
```

### Linear Algebra
```javascript
import { vector, matrix } from 'primalib'

vector(1,2,3).dot(vector(4,5,6))  // → 32
matrix([[1,2],[3,4]]).det()       // → -2
```

### Statistics
```javascript
import { mean, stddev, correlation } from 'primalib'

mean([1,2,3,4,5])  // → 3
correlation([1,2,3], [2,4,6])  // → 1.0
```

## 🔌 Plugin System

Add your own operations:

```javascript
import { primaSet } from 'primalib'

primaSet.plugin({
  cube: x => x * x * x
})


primaSet([1,2,3]).cube()  // → [1, 8, 27]
```

## 🧪 Testing

```bash
npm test
```

**163+ tests** covering all modules and operations.

## 📖 Learn More

- **Quick Reference**: See [QUICKREF.md](./doc/QUICKREF.md) for quick lookup ⚡
- **Getting Started**: See [PRIMALIB.md](./doc/PRIMALIB.md) for complete overview
- **Core Concepts**: Read [PRIMASET.md](./core/PRIMASET.md) to understand the foundation
- **Module Details**: Check individual module documentation for specific features
- **Examples**: See [examples/README.md](./examples/README.md) for example guide
- **Contributing**: See [CONTRIBUTING.md](./CONTRIBUTING.md) to contribute

## 🎓 Philosophy

PrimaLib believes **math should be playful**. It bridges:
- **Imperative & Functional**: Chain methods or compose functions
- **Finite & Infinite**: Work with arrays or never-ending streams
- **Simple & Complex**: Start with scalars, scale to hypercubes

**One abstraction. Infinite possibilities.** 🌌

---

**PrimaLib** — *Math as poetry. Sets as magic. Infinity as playground.* ✨

**Ready to explore?** Start with [PRIMALIB.md](./doc/PRIMALIB.md) for the complete guide, or dive into [PRIMASET.md](./core/PRIMASET.md) to understand the core magic.
