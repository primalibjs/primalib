/**
 * Example 3: Geometry
 * 
 * Working with geometric objects
 */

import { point, hypercube } from '../primalib.mjs'

console.log('=== Example 3: Geometry ===\n')

// Point operations
const p1 = point(1, 2)
const p2 = point(3, 4)
console.log('Point addition:')
console.log(p1.add(p2).coords)  // → [4, 6]

// Distance from origin
console.log('\nDistance from origin (3, 4):')
console.log(point(3, 4).norm())  // → "5"

// Hypercube vertices
console.log('\nUnit square vertices:')
const square = hypercube([0, 0], [1, 1])
console.log(square.vertices().length)  // → 4

// Unit cube vertices
console.log('\nUnit cube vertices:')
const cube = hypercube([0, 0, 0], [1, 1, 1])
console.log(cube.vertices().length)  // → 8

