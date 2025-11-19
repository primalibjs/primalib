# Space: Geometric and Algebraic Environments

> **"Space is where Points live. By default geometric, algebraic when power-of-2 (2D, 4D, 8D)."**

## 🎯 Overview

**Space** is the unified geometric and algebraic environment where Points live. 

- **Geometric Space**: Any dimension (1D, 3D, 5D, etc.) - pure geometry
- **Algebraic Space**: Power-of-2 dimensions (2D, 4D, 8D) - where division algebras live

The `isAlgebraic` property indicates whether a space supports algebraic operations.

## 🔢 Frobenius Theorem: Why Only 2D, 4D, 8D?

**Frobenius Theorem** (1877): The only finite-dimensional real division algebras are:
- **R** (1D) - Real numbers (commutative, associative)
- **C** (2D) - Complex numbers (commutative, associative) - 2¹
- **H** (4D) - Quaternions (non-commutative, associative) - 2²
- **O** (8D) - Octonions (non-commutative, non-associative) - 2³

**All are power-of-2 dimensions!**

This is why we don't have 3D, 5D, 6D, or 7D numbers - **no division algebras exist in these dimensions**.

## 🔄 Cayley-Dickson Construction

Each algebra is constructed by **doubling** the previous one:

```
R (1D) → C (2D) → H (4D) → O (8D) → S (16D) ❌ (loses division)
```

**At each step**:
- Dimension doubles: 1 → 2 → 4 → 8
- A property is lost:
  - R → C: Nothing lost (both commutative, associative)
  - C → H: Commutativity lost
  - H → O: Associativity lost
  - O → S: Division property lost ❌

**The pattern**: 2ⁿ dimensions, where n = 0, 1, 2, 3

## 🌌 Space as Hyperplane

In power-of-2 dimensions, **Hyperplane** - a geometric spatial "membrane" where division algebras live.

### Complex Space (2D = 2¹)

**Space View**:
- 2D space with `isAlgebraic: true`
- Creates the **complex plane**
- The space IS the complex plane!

**Structure**:
- 2² = 4 vertices: {0, 1, i, 1+i}
- Units: {1, i}
- Algebra: `'complex'`

### Quaternion Space (4D = 2²)

**Space View**:
- 4D space with `isAlgebraic: true`
- Creates the **quaternion space**
- The space IS the quaternion space!

**Structure**:
- 2⁴ = 16 vertices: All combinations of {1, i, j, k}
- Units: {1, i, j, k}
- Algebra: `'quaternion'`

### Octonion Space (8D = 2³)

**Space View**:
- 8D space with `isAlgebraic: true`
- Creates the **octonion space**
- The space IS the octonion space!

**Structure**:
- 2⁸ = 256 vertices: All combinations of {e₀, e₁, ..., e₇}
- Units: {e₀, e₁, ..., e₇}
- Algebra: `'octonion'`

## ❌ Why Odd Dimensions Don't Work

### 3D Space

**Problem**: No division algebra exists in 3D!

**Why?**:
- Can't construct a 3D division algebra
- Frobenius theorem: Only 1D, 2D, 4D, 8D work
- The hyperplane-algebra duality only works in power-of-2 dimensions

### 5D, 6D, 7D Spaces

Same problem - no division algebras exist!

**The pattern**: Only power-of-2 dimensions (2ⁿ) have division algebras

## 🎯 The Deep Connection

### Geometry = Algebra

In power-of-2 dimensions:
- **Space** (geometric object) = **The environment where the algebra lives**
- **Vertices** (geometric structure) = **The structure of the algebra's units**
- **They're unified!**

### Why This Matters

1. **Explains the pattern**: Why 2, 4, 8? Because of the hyperplane-algebra duality!
2. **Unifies geometry and algebra**: They're not separate - they're the same thing!
3. **Predicts the structure**: The geometry predicts the algebra, and vice versa

## 🚀 Implementation

### Creating Spaces

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

const C2 = Space(2)        // 2D algebraic space
const H = Space(4)      // 4D algebraic space
const O = Space(8)       // 8D algebraic space
```

### Direct Relation with Point

```javascript
const C = space([0, 0], [1, 1])  // 2D algebraic space
const z = C.point(3, 4)  // → complex(3, 4) ✓

const cube = space([0, 0, 0], [1, 1, 1])  // 3D geometric space
const p = cube.point(1, 2, 3)  // → point(1, 2, 3) ✓
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

## 📚 Mathematical Foundation

### Division Algebra Property

A **division algebra** allows division (except by zero):
- R: Yes ✅
- C: Yes ✅
- H: Yes ✅
- O: Yes ✅
- 3D: No ❌
- 5D, 6D, 7D: No ❌

### Why Power-of-2?

**Cayley-Dickson construction**:
- Each step doubles the dimension
- Creates: 1 → 2 → 4 → 8
- Pattern: 2ⁿ where n = 0, 1, 2, 3

**Hyperplane-algebra duality**:
- Only works in power-of-2 dimensions
- The duality IS the division algebra property
- Geometry and algebra are unified! 
- Algebra is Geometry on Power of 2 dimensions

## 🎯 Conclusion

**Hyperplane is Space** in power-of-2 dimensions because:
1. It represents the environment where division algebras live
2. The space IS the algebraic structure (complex plane, quaternion space, octonion space)
3. The vertices represent the algebra's units
4. This duality explains why only 2D, 4D, 8D have division algebras
5. **Geometry and algebra are unified!**

This is a beautiful example of how **deep mathematical structures reveal connections** between seemingly different domains.

