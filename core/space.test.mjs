// space.test.mjs - Tests for unified Space class

import { test } from '../test/test.mjs'
import { space, algebraicSpace, complexSpace, quaternionSpace, octonionSpace, ALGEBRAIC_DIMS } from './space.mjs'
import { point, complex, quaternion, octonion } from './point.mjs'
import { point, complex, quaternion, octonion } from './point.mjs'

// ============================================================================
// BASIC SPACE CREATION
// ============================================================================

test('🧪 space.test.mjs - Space creation', ({check}) => {
  const s = space([0, 0], [1, 1])
  check(s.dim, 2)
  check(s.isAlgebraic, true)
  check(s.algebra, 'complex')
})

test('Space: geometric space (non-algebraic)', ({check}) => {
  const s = space([0, 0, 0], [1, 1, 1])
  check(s.dim, 3)
  check(s.isAlgebraic, false)
  check(s.algebra, null)
})

test('Space: single value corner/sides', ({check}) => {
  const s = space(0, 1)
  check(s.dim, 1)
  check(s.isAlgebraic, false)
})

// ============================================================================
// GEOMETRIC OPERATIONS (Always available)
// ============================================================================

test('Space: vertices', ({check}) => {
  const s = space([0, 0], [1, 1])
  const verts = s.vertices()
  check(verts.length, 4)  // 2^2 = 4
  check(verts[0].coords, [0, 0])
  check(verts[3].coords, [1, 1])
})

test('Space: vertices for 3D', ({check}) => {
  const s = space([0, 0, 0], [1, 1, 1])
  const verts = s.vertices()
  check(verts.length, 8)  // 2^3 = 8
})

test('Space: sample', ({check}) => {
  const s = space([0, 0], [1, 1])
  const samples = s.sample(1)
  check(samples.count(), 4)  // (1+1)^2 = 4
})

test('Space: contains', ({check}) => {
  const s = space([0, 0], [2, 2])
  check(s.contains(point(1, 1)), true)
  check(s.contains(point(3, 3)), false)
  check(s.contains(point(1, 3)), false)
})

test('Space: subdivide', ({check}) => {
  const s = space([0, 0], [2, 2])
  const parts = s.subdivide(0, 2)
  check(parts.count(), 2)
  const first = parts.take(1).toArray()[0]
  check(first.vertices()[0].coords, [0, 0])
})

// ============================================================================
// ALGEBRAIC OPERATIONS (Power-of-2 only)
// ============================================================================

test('Space: split (2D)', ({check}) => {
  const s = space([0, 0], [1, 1])
  const split = s.split()
  check('even' in split, true)
  check('odd' in split, true)
  check(split.even.length, 2)
  check(split.odd.length, 2)
})

test('Space: split (4D)', ({check}) => {
  const s = space([0, 0, 0, 0], [1, 1, 1, 1])
  const split = s.split()
  check(Object.keys(split).length, 4)
  check(split[0].length, 1)  // [0,0,0,0]
  check(split[1].length, 4)  // vertices with sum mod 4 = 1
})

test('Space: split throws for non-algebraic', ({check}) => {
  const s = space([0, 0, 0], [1, 1, 1])
  try {
    s.split()
    check(false, true)  // Should throw
  } catch (e) {
    check(e.message.includes('algebraic'), true)
  }
})

test('Space: units (2D)', ({check}) => {
  const s = space([0, 0], [1, 1])
  const units = s.units()
  check(units.length, 2)  // [1,0] and [0,1]
  check(units[0].coords, [1, 0])
  check(units[1].coords, [0, 1])
})

test('Space: units (4D)', ({check}) => {
  const s = space([0, 0, 0, 0], [1, 1, 1, 1])
  const units = s.units()
  check(units.length, 4)  // [1,0,0,0], [0,1,0,0], [0,0,1,0], [0,0,0,1]
})

test('Space: units returns null for non-algebraic', ({check}) => {
  const s = space([0, 0, 0], [1, 1, 1])
  check(s.units(), null)
})

// ============================================================================
// PROJECTION & DISTANCE
// ============================================================================

test('Space: project (algebraic, no normal)', ({check}) => {
  const s = space([0, 0], [1, 1])
  const p = point(3, 4)
  const proj = s.project(p)
  check(proj.coords[0], 0)  // Projected onto first coordinate axis
  check(proj.coords[1], 4)
})

test('Space: distance (algebraic, no normal)', ({check}) => {
  const s = space([0, 0], [1, 1])
  const p = point(3, 4)
  check(s.distance(p), 3)  // Distance to first coordinate
})

test('Space: project (geometric, with normal)', ({check}) => {
  const s = space([0, 0, 0], [1, 1, 1])
  const p = point(1, 1, 1)
  const normal = [1, 0, 0]
  const proj = s.project(p, normal)
  check(proj.coords[0], 0)  // Projected onto plane normal to [1,0,0]
})

test('Space: project throws without normal for geometric', ({check}) => {
  const s = space([0, 0, 0], [1, 1, 1])
  const p = point(1, 1, 1)
  try {
    s.project(p)
    check(false, true)  // Should throw
  } catch (e) {
    check(e.message.includes('Normal'), true)
  }
})

// ============================================================================
// POINT CREATION (Direct relation with Point)
// ============================================================================

test('Space: point() creates Complex for 2D algebraic', ({check}) => {
  const s = space([0, 0], [1, 1])
  const z = s.point(3, 4)
  check(z.type, 'complex')
  check(z.re, 3)
  check(z.im, 4)
})

test('Space: point() creates Quaternion for 4D algebraic', ({check}) => {
  const s = space([0, 0, 0, 0], [1, 1, 1, 1])
  const q = s.point(1, 2, 3, 4)
  check(q.type, 'quaternion')
  check(q.w, 1)
  check(q.x, 2)
})

test('Space: point() creates Octonion for 8D algebraic', ({check}) => {
  const s = space(new Array(8).fill(0), new Array(8).fill(1))
  const o = s.point(1, 2, 3, 4, 5, 6, 7, 8)
  check(o.type, 'octonion')
  check(o.e0, 1)
  check(o.e7, 8)
})

test('Space: point() creates Point for geometric', ({check}) => {
  const s = space([0, 0, 0], [1, 1, 1])
  const p = s.point(1, 2, 3)
  check(p.type, 'point')
  check(p.coords, [1, 2, 3])
})

test('Space: point() throws for wrong dimension', ({check}) => {
  const s = space([0, 0], [1, 1])
  try {
    s.point(1, 2, 3)
    check(false, true)  // Should throw
  } catch (e) {
    check(e.message.includes('coordinates'), true)
  }
})

test('Space: vector() creates Vector', ({check}) => {
  const s = space([0, 0, 0], [1, 1, 1])
  const v = s.vector(1, 2, 3)
  check(v.type, 'vector')
  check(v.coords, [1, 2, 3])
})

// ============================================================================
// CONVENIENCE FACTORIES
// ============================================================================

test('Space: algebraicSpace(2)', ({check}) => {
  const s = algebraicSpace(2)
  check(s.dim, 2)
  check(s.isAlgebraic, true)
  check(s.algebra, 'complex')
})

test('Space: algebraicSpace throws for non-algebraic dim', ({check}) => {
  try {
    algebraicSpace(3)
    check(false, true)  // Should throw
  } catch (e) {
    check(e.message.includes('2, 4, 8'), true)
  }
})

test('Space: complexSpace()', ({check}) => {
  const s = complexSpace()
  check(s.dim, 2)
  check(s.algebra, 'complex')
})

test('Space: quaternionSpace()', ({check}) => {
  const s = quaternionSpace()
  check(s.dim, 4)
  check(s.algebra, 'quaternion')
})

test('Space: octonionSpace()', ({check}) => {
  const s = octonionSpace()
  check(s.dim, 8)
  check(s.algebra, 'octonion')
})

// ============================================================================
// UTILITY
// ============================================================================

test('Space: toArray()', ({check}) => {
  const s = space([0, 0], [1, 1])
  const arr = s.toArray()
  check(arr.length, 4)
  check(arr[0], [0, 0])
  check(arr[3], [1, 1])
})

test('Space: toThreeMesh()', ({check}) => {
  const s = space([0, 0, 0], [1, 1, 1])
  const mesh = s.toThreeMesh()
  check(mesh.length, 8)
  check(mesh[0].length, 3)  // Truncated to 3D
})

// ============================================================================
// CONSTANTS
// ============================================================================

test('Space: ALGEBRAIC_DIMS', ({check}) => {
  check(ALGEBRAIC_DIMS, [2, 4, 8])
})

