import { test } from '../test/test.mjs';
import { point, line, rectangle, square, cube } from './primageo.mjs'
import { space } from '@primalib/core'

// ---------- Geometry ----------
test('🧪 primageo.test.mjs — point ops and space', ({check}) => {
  check(point(1, 2).add(point(3, 4)).coords, [4, 6])
  check(point(3, 4).norm(), "5")
  check(space([0], [10]).dim, 1)
  check(space([0, 0, 0], [1, 1, 1]).vertices().length, 8)
  const h2 = space([0, 0], [1, 1]).sample(2)
  check(h2.count(), 9)
})

test('space primal slice', ({check}) => {
  const h = space([0, 0, 0], [2, 3, 5])
  const slice = h.subdivide(0, 2).take(2).toArray()[1]
  const corner = slice.sample(1).toArray()[0]
  check(corner.coords, [1, 0, 0])
})

test('Geometry: line', ({check}) => {
  const l = line(0, 5)
  check(l.dim, 1)
  check(l.vertices().length, 2)
  check(l.vertices()[0].coords, [0])
  check(l.vertices()[1].coords, [5])
})

test('Geometry: rectangle', ({check}) => {
  const r = rectangle(3, 4)
  check(r.dim, 2)
  check(r.vertices().length, 4)
  check(r.vertices()[0].coords, [0, 0])
  check(r.vertices()[3].coords, [3, 4])
})

test('Geometry: square', ({check}) => {
  const s = square(5)
  check(s.dim, 2)
  check(s.vertices().length, 4)
  check(s.vertices()[0].coords, [0, 0])
  check(s.vertices()[3].coords, [5, 5])
})

test('Geometry: cube', ({check}) => {
  const c = cube(2)
  check(c.dim, 3)
  check(c.vertices().length, 8)
  check(c.vertices()[0].coords, [0, 0, 0])
  check(c.vertices()[7].coords, [2, 2, 2])
})

test('Point: numeric indexing (point[0] works)', ({check}) => {
  const p = point(1, 2, 3)
  check(p[0], 1)
  check(p[1], 2)
  check(p[2], 3)
  check(p.coords, [1, 2, 3]) // Backward compatibility
  check(p.dim, 3)
})

test('Point: destructuring support', ({check}) => {
  const p = point(5, 10, 15)
  const [x, y, z] = p
  check(x, 5)
  check(y, 10)
  check(z, 15)
})

test('Point: numeric indexing with operations', ({check}) => {
  const p1 = point(1, 2)
  const p2 = point(3, 4)
  const sum = p1.add(p2)
  check(sum[0], 4)
  check(sum[1], 6)
  check(sum.coords, [4, 6]) // Both work
})

test('Integration: Space with primageo', ({check}) => {
  // Test that Space works with primageo exports
  const s = space([0, 0], [1, 1])
  check(s.dim, 2)
  check(s.isAlgebraic, true)
  
  // Test space still works (legacy alias)
  const h = space([0, 0, 0], [1, 1, 1])
  check(h.dim, 3)
  check(h.vertices().length, 8)
})

test('Integration: Space.point() creates Complex', ({check}) => {
  const s = space([0, 0], [1, 1])
  const z = s.point(3, 4)
  check(z.type, 'complex')
  check(z.re, 3)
  check(z.im, 4)
})


