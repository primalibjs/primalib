/**
 * PrimaGeo - Geometry module for PrimaLib
 * Geometric primitives and helpers (points/spaces imported from core)
 */

import { primaSet, point, complex, quaternion, octonion, space } from '@primalib/core';

// ---------- Power-of-2 Constants ----------
const POWER2_DIMS = [2, 4, 8, 16, 32]

// Split space into even/odd cells (2D case: mod 2)
const splitEvenOdd = (h) => {
  if (h.dim !== 2) throw new Error('splitEvenOdd requires 2D space')
  const verts = h.vertices()
  return {
    // Performance: use .coords[i] in loops (14x faster than Proxy [i])
    even: verts.filter(v => (v.coords[0] + v.coords[1]) % 2 === 0),
    odd: verts.filter(v => (v.coords[0] + v.coords[1]) % 2 === 1)
  }
}

// Split space into mod 4 classes (4D case)
const splitMod4 = (h) => {
  if (h.dim !== 4) throw new Error('splitMod4 requires 4D space')
  const verts = h.vertices()
  const classes = { 0: [], 1: [], 2: [], 3: [] }
  verts.forEach(v => {
    const sum = v.coords.reduce((s, c) => s + c, 0)
    classes[sum % 4].push(v)
  })
  return classes
}

// Split space into mod 8 classes (8D case)
const splitMod8 = (h) => {
  if (h.dim !== 8) throw new Error('splitMod8 requires 8D space')
  const verts = h.vertices()
  const classes = {}
  for (let i = 0; i < 8; i++) classes[i] = []
  verts.forEach(v => {
    const sum = v.coords.reduce((s, c) => s + c, 0)
    classes[sum % 8].push(v)
  })
  return classes
}

// Object mapping for power-of-2 splitters
const POWER2_SPLITTERS = {
  2: splitEvenOdd,
  4: splitMod4,
  8: splitMod8
}

// ---------- Geometric Helpers (using unified Space API) ----------

// ---------- Ergonomic One-liners ----------
const line = (start, end) => space(start, Array.isArray(end) ? end.map((e, i) => e - (Array.isArray(start) ? start[i] : start)) : [end - start])
const rectangle = (w, h) => space([0, 0], [w, h])
const square = (side) => rectangle(side, side)
const cube = (side) => space([0, 0, 0], [side, side, side])
const slice = (s, hp) => s.sample([1,1,1]).filter(p => hp.distance(p) < 1e-3)

// Export: re-export point/complex/quaternion/octonion from core, plus geo-specific helpers
export { 
  // Re-export from core
  point, complex, quaternion, octonion,
  // Geometric helpers
  line, rectangle, square, cube, 
  slice, splitEvenOdd, splitMod4, splitMod8,
  POWER2_DIMS
}
