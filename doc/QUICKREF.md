# PrimaLib Quick Reference

> **"Quick lookup for common operations, patterns, and syntax."**

A concise reference guide for PrimaLib's most commonly used features and patterns.

## 🚀 **Quick Start**

```javascript
import { N, sq, sum, primes, primaSet } from 'primalib'

// Sum of squares
sum(sq(N(10)))  // → 385

// Infinite sequences
primes.take(10)  // → [2,3,5,7,11,13,17,19,23,29]

// Everything is a set
primaSet([1,2,3]).map(x => x * 2)  // → [2,4,6]
```

## 📋 **Core Functions**

### PrimaSet

```javascript
primaSet(value)              // Create set from anything
primaSet([1,2,3])            // Array → set
primaSet(N())                // Infinite sequence → set
primaSet(42)                 // Scalar → singleton set
```

### Number Sequences

```javascript
N()                          // Naturals: 1,2,3,...
N(10)                        // 1..10
Z()                          // Integers: 0,1,-1,2,-2,...
Z(-5, 5)                     // -5..5
R(0, 1, 2)                   // Reals: 0.00,0.01,...,1.00
primes                       // Infinite primes
```

### Operations

```javascript
sq(x)                        // Square
inv(x)                       // Inverse (1/x)
neg(x)                       // Negate (-x)
add(a, b)                    // Addition
mul(a, b)                    // Multiplication
sum(arr)                     // Sum all
mean(arr)                    // Average
```

## 🎯 **Common Patterns**

### Pattern 1: Sum of Squares

```javascript
sum(sq(N(10)))              // → 385
N(10).sq().sum()            // → 385 (method chaining)
```

### Pattern 2: Filter & Map

```javascript
N(20).filter(x => x % 2 === 0).map(x => x * x)
// → [4,16,36,64,100,144,196,256,324,400]
```

### Pattern 3: Pipeline

```javascript
pipe(N, take(10), sq, sum)()  // → 385
```

### Pattern 4: Infinite Sequences

```javascript
primes.take(100)            // First 100 primes
N().take(50)                // First 50 naturals
```

### Pattern 5: Materialization

```javascript
primaSet([1,2,3]).toArray()  // → [1,2,3]
primes.get(4)                // → 11 (5th prime)
```

## 📐 **Geometry**

```javascript
point(1, 2, 3)              // Create point
point(1,2).add(point(3,4))  // → point(4,6)
point(3,4).norm()           // → 5

space([0,0], [1,1])         // 2D square
space([0,0,0], [1,1,1])     // 3D cube
```

## 🔢 **Vectors & Matrices**

```javascript
vector(1, 2, 3)             // Create vector
v1.dot(v2)                  // Dot product
v1.cross(v2)                // Cross product (3D)
v1.normalize()              // Unit vector

matrix([[1,2],[3,4]])       // Create matrix
m.det()                     // Determinant
m.inv()                     // Inverse
m.mul(other)                // Multiply
```

## 📊 **Statistics**

```javascript
mean([1,2,3,4,5])          // → 3
stddev([1,2,3,4,5])        // → 1.58...
correlation([1,2,3], [2,4,6])  // → 1.0
```

## 🌳 **Trees**

```javascript
tree({a:1, b:{c:2}})       // Create tree
root.find('b.c')            // Find node
walkTree(root)              // Traverse
vdom({tag:'div'})          // Virtual DOM
```

## 🍒 **Web**

```javascript
PrimaWeb('#content')        // Create context
say('# Hello')              // Render markdown
on('click', '#btn', fn)     // Event handler
```

## 🔧 **Method Chaining**

```javascript
N(10).sq().sum()            // → 385
primes.take(10).map(p => p * 2)
[1,2,3].sq().sum()         // Works on arrays too
```

## 🎨 **Free Functions**

```javascript
const { sq, sum, mean } = primaSet
sq([1,2,3])                // → [1,4,9]
sum([1,2,3])               // → 6
mean([1,2,3])              // → 2
```

## 🔌 **Plugins**

```javascript
primaSet.plugin({
  cube: x => x * x * x
})

primaSet([1,2,3]).cube()   // → [1,8,27]
```

## 📝 **One-Liners**

```javascript
// Sum of first 10 squares
sum(sq(N(10)))  // → 385

// First 10 primes
primes.take(10)  // → [2,3,5,7,11,13,17,19,23,29]

// Even numbers squared
N(10).filter(x => x % 2 === 0).sq()  // → [4,16,36,64,100]

// Distance between points
point(1,2).subtract(point(3,4)).norm()  // → 2.828...

// Matrix determinant
matrix([[1,2],[3,4]]).det()  // → -2

// Vector dot product
vector(1,2,3).dot(vector(4,5,6))  // → 32
```

## 🎯 **By Use Case**

### Mathematical Sequences

```javascript
N(10)                       // Naturals 1..10
primes.take(10)             // First 10 primes
evens(20)                   // Even numbers up to 20
```

### Data Processing

```javascript
primaSet(data).map(fn).filter(pred).take(n)
```

### Geometry

```javascript
point(x, y, z)              // Points
space(corner, sides)        // Geometric/algebraic spaces
```

### Linear Algebra

```javascript
vector(...coords)           // Vectors
matrix([[...], [...]])     // Matrices
polynomial([coeffs])       // Polynomials
```

### Statistics

```javascript
mean(data)                  // Average
stddev(data)                // Standard deviation
correlation(x, y)           // Correlation
```

## 🔍 **Common Operations**

| Operation | Syntax | Example |
|-----------|--------|---------|
| Square | `sq(x)` | `sq(5)` → `25` |
| Inverse | `inv(x)` | `inv(2)` → `0.5` |
| Negate | `neg(x)` | `neg(5)` → `-5` |
| Sum | `sum(arr)` | `sum([1,2,3])` → `6` |
| Mean | `mean(arr)` | `mean([1,2,3])` → `2` |
| Take | `take(n)` | `N().take(5)` → `[1,2,3,4,5]` |
| Filter | `filter(pred)` | `N(10).filter(x => x%2)` |
| Map | `map(fn)` | `[1,2,3].map(x => x*2)` |
| Get | `get(i)` | `primes.get(4)` → `11` |

## 🎨 **Calling Styles**

### Object-Oriented

```javascript
N(10).sq().sum()            // → 385
```

### Functional

```javascript
sum(sq(N(10)))             // → 385
```

### Pipeline

```javascript
pipe(N, take(10), sq, sum)()  // → 385
```

## 📚 **Module Quick Access**

```javascript
// Core
import { primaSet, N, primes } from 'primalib'

// Operations
import { sq, sum, mean } from 'primalib'

// Geometry
import { point, space } from 'primalib'

// Linear Algebra
import { vector, matrix, polynomial } from 'primalib'

// Statistics
import { mean, stddev, correlation } from 'primalib'

// Trees
import { tree, vdom } from 'primalib'

// Web
import { PrimaWeb, say } from 'primalib'
```

## 🚨 **Common Gotchas**

```javascript
// ❌ Don't materialize infinite sequences
N().toArray()  // Hangs!

// ✅ Use take() instead
N().take(100).toArray()

// ❌ Cross product needs 3D
vector(1,2).cross(vector(3,4))  // Error

// ✅ Use 3D vectors
vector(1,2,0).cross(vector(3,4,0))

// ❌ Matrix dimensions must match
matrix([[1,2]]).add(matrix([[1,2],[3,4]]))  // Error

// ✅ Same dimensions
matrix([[1,2]]).add(matrix([[3,4]]))
```

## 💡 **Tips**

- Use `.take()` with infinite sequences
- Method chaining works on arrays too
- Everything is a set - use PrimaSet operations
- Lazy by default - materialize when needed
- Check dimensions before operations (vectors, matrices)

---

**Quick Reference** - *Fast lookup for common operations and patterns.* ⚡

