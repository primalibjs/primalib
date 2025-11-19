// point.test.mjs - Tests for unified point architecture

import { test } from '../test/test.mjs'
import { point, complex, quaternion, octonion, vector } from 'primalib'

// ============================================================================
// BASE POINT
// ============================================================================

test('🧪 point.test.mjs - Point creation', ({check}) => {
  const p = point(1, 2, 3)
  check(p.coords, [1, 2, 3])
  check(p.dim, 3)
  check(p.type, 'point')
})

test('Point: numeric indexing', ({check}) => {
  const p = point(1, 2, 3)
  check(p[0], 1)
  check(p[1], 2)
  check(p[2], 3)
  check(p.coords, [1, 2, 3])
})

test('Point: destructuring', ({check}) => {
  const p = point(5, 10, 15)
  const [x, y, z] = p
  check(x, 5)
  check(y, 10)
  check(z, 15)
})

test('Point: basic operations', ({check}) => {
  const p1 = point(1, 2, 3)
  const p2 = point(4, 5, 6)
  
  check(p1.add(p2).coords, [5, 7, 9])
  check(p1.subtract(p2).coords, [-3, -3, -3])
  check(p1.scale(2).coords, [2, 4, 6])
  check(Math.round(p1.norm() * 100) / 100, 3.74)
})

// ============================================================================
// COMPLEX
// ============================================================================

test('Complex: creation and properties', ({check}) => {
  const z = complex(3, 4)
  check(z.re, 3)
  check(z.im, 4)
  check(z.type, 'complex')
  check(z.dim, 2)
  check(z.coords, [3, 4])
})

test('Complex: multiplication', ({check}) => {
  const z1 = complex(1, 2)
  const z2 = complex(3, 4)
  const prod = z1.mul(z2)
  check(prod.re, -5)  // 1*3 - 2*4
  check(prod.im, 10)  // 1*4 + 2*3
})

test('Complex: conjugate', ({check}) => {
  const z = complex(3, 4)
  const conj = z.conj()
  check(conj.re, 3)
  check(conj.im, -4)
})

test('Complex: norm', ({check}) => {
  const z = complex(3, 4)
  check(z.norm(), 5)
})

test('Complex: inverse', ({check}) => {
  const z = complex(3, 4)
  const inv = z.inv()
  check(Math.round(inv.re * 100) / 100, 0.12)  // 3/25
  check(Math.round(inv.im * 100) / 100, -0.16)  // -4/25
})

test('Complex: alias C', ({check}) => {
  const z = C(1, 2)
  check(z.type, 'complex')
  check(z.re, 1)
  check(z.im, 2)
})

// ============================================================================
// QUATERNION
// ============================================================================

test('Quaternion: creation and properties', ({check}) => {
  const q = quaternion(1, 2, 3, 4)
  check(q.w, 1)
  check(q.x, 2)
  check(q.y, 3)
  check(q.z, 4)
  check(q.type, 'quaternion')
  check(q.dim, 4)
  check(q.coords, [1, 2, 3, 4])
})

test('Quaternion: multiplication', ({check}) => {
  const q1 = quaternion(1, 0, 0, 0)  // 1
  const q2 = quaternion(0, 1, 0, 0)  // i
  const prod = q1.mul(q2)
  check(prod.w, 0)
  check(prod.x, 1)
  check(prod.y, 0)
  check(prod.z, 0)
})

test('Quaternion: conjugate', ({check}) => {
  const q = quaternion(1, 2, 3, 4)
  const conj = q.conj()
  check(conj.w, 1)
  check(conj.x, -2)
  check(conj.y, -3)
  check(conj.z, -4)
})

test('Quaternion: norm', ({check}) => {
  const q = quaternion(1, 2, 3, 4)
  check(Math.round(q.norm() * 100) / 100, 5.48)  // √30
})

test('Quaternion: alias H', ({check}) => {
  const q = H(1, 0, 0, 0)
  check(q.type, 'quaternion')
  check(q.w, 1)
})

// ============================================================================
// OCTONION
// ============================================================================

test('Octonion: creation and properties', ({check}) => {
  const o = octonion(1, 2, 3, 4, 5, 6, 7, 8)
  check(o.e0, 1)
  check(o.e1, 2)
  check(o.e7, 8)
  check(o.type, 'octonion')
  check(o.dim, 8)
  check(o.coords, [1, 2, 3, 4, 5, 6, 7, 8])
})

test('Octonion: conjugate', ({check}) => {
  const o = octonion(1, 2, 3, 4, 5, 6, 7, 8)
  const conj = o.conj()
  check(conj.e0, 1)
  check(conj.e1, -2)
  check(conj.e7, -8)
})

test('Octonion: alias O', ({check}) => {
  const o = O(1, 0, 0, 0, 0, 0, 0, 0)
  check(o.type, 'octonion')
  check(o.e0, 1)
})

// ============================================================================
// VECTOR
// ============================================================================

test('Vector: creation and properties', ({check}) => {
  const v = vector(1, 2, 3)
  check(v.type, 'vector')
  check(v.dim, 3)
  check(v.coords, [1, 2, 3])
})

test('Vector: dot product', ({check}) => {
  const v1 = vector(1, 2, 3)
  const v2 = vector(4, 5, 6)
  check(v1.dot(v2), 32)  // 1*4 + 2*5 + 3*6
})

test('Vector: cross product', ({check}) => {
  const v1 = vector(1, 0, 0)
  const v2 = vector(0, 1, 0)
  const cross = v1.cross(v2)
  check(cross.coords, [0, 0, 1])
})

test('Vector: normalize', ({check}) => {
  const v = vector(3, 4, 0)
  const norm = v.normalize()
  check(Math.round(norm.norm() * 100) / 100, 1)
})

test('Vector: norm variants', ({check}) => {
  const v = vector(3, 4)
  check(v.normL1(), 7)  // |3| + |4|
  check(v.normL2(), 5)  // √(3² + 4²)
  check(v.normLinf(), 4)  // max(|3|, |4|)
})

// ============================================================================
// INHERITANCE & POLYMORPHISM
// ============================================================================

test('Point inheritance: Complex extends Point', ({check}) => {
  const z = complex(3, 4)
  // Complex inherits Point operations
  check(z.add(complex(1, 1)).coords, [4, 5])
  check(z.scale(2).coords, [6, 8])
  check(z.norm(), 5)
})

test('Point inheritance: Quaternion extends Point', ({check}) => {
  const q = quaternion(1, 2, 3, 4)
  // Quaternion inherits Point operations
  check(q.add(quaternion(1, 1, 1, 1)).coords, [2, 3, 4, 5])
  check(q.scale(2).coords, [2, 4, 6, 8])
})

