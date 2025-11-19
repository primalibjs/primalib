/**
 * Linear Algebra Benchmarks
 * 
 * Benchmarks vector, matrix, and polynomial operations.
 */

import { vector, matrix, polynomial, dotProduct, crossProduct } from '../primalib.mjs'
import { runSuite, warmup } from './benchmark-utils.mjs'

// Warmup
warmup(() => vector(1, 2, 3).norm(), 10)

const suite = {
  name: 'Linear Algebra Operations',
  tests: [
    {
      name: 'vector(1,2,3).norm()',
      description: 'Vector norm (3D)',
      fn: () => vector(1, 2, 3).norm(),
      expected: Math.sqrt(14),
      iterations: 10000
    },
    {
      name: 'vector(1,2,3).dot(vector(4,5,6))',
      description: 'Dot product',
      fn: () => vector(1, 2, 3).dot(vector(4, 5, 6)),
      expected: 32,
      iterations: 10000
    },
    {
      name: 'vector(1,2,3).cross(vector(4,5,6))',
      description: 'Cross product (3D)',
      fn: () => vector(1, 2, 3).cross(vector(4, 5, 6)),
      iterations: 10000
    },
    {
      name: 'vector(1,2,3).normalize()',
      description: 'Normalize vector',
      fn: () => vector(1, 2, 3).normalize(),
      iterations: 10000
    },
    {
      name: 'matrix([[1,2],[3,4]]).det()',
      description: '2x2 determinant',
      fn: () => matrix([[1, 2], [3, 4]]).det(),
      expected: -2,
      iterations: 10000
    },
    {
      name: 'matrix([[1,2,3],[4,5,6],[7,8,9]]).det()',
      description: '3x3 determinant',
      fn: () => matrix([[1, 2, 3], [4, 5, 6], [7, 8, 9]]).det(),
      expected: 0,
      iterations: 5000
    },
    {
      name: 'matrix([[1,2],[3,4]]).inv()',
      description: '2x2 inverse',
      fn: () => matrix([[1, 2], [3, 4]]).inv(),
      iterations: 5000
    },
    {
      name: 'matrix([[1,2],[3,4]]).mul(matrix([[5,6],[7,8]]))',
      description: '2x2 matrix multiplication',
      fn: () => matrix([[1, 2], [3, 4]]).mul(matrix([[5, 6], [7, 8]])),
      iterations: 5000
    },
    {
      name: 'matrix([[1,2],[3,4]]).mulVec(vector(1,2))',
      description: 'Matrix-vector multiplication',
      fn: () => matrix([[1, 2], [3, 4]]).mulVec(vector(1, 2)),
      iterations: 5000
    },
    {
      name: 'polynomial([1,2,3]).eval(5)',
      description: 'Polynomial evaluation',
      fn: () => polynomial([1, 2, 3]).eval(5),
      expected: 1 + 2*5 + 3*25, // 86
      iterations: 10000
    },
    {
      name: 'polynomial([1,2,3]).derivative()',
      description: 'Polynomial derivative',
      fn: () => polynomial([1, 2, 3]).derivative(),
      iterations: 5000
    },
    {
      name: 'polynomial([1,2,3]).roots()',
      description: 'Find polynomial roots',
      fn: () => polynomial([1, 2, 3]).roots(),
      iterations: 100
    },
    {
      name: 'Large matrix operations',
      description: '10x10 matrix operations',
      fn: () => {
        const data = Array.from({ length: 10 }, (_, i) =>
          Array.from({ length: 10 }, (_, j) => i * 10 + j + 1)
        )
        const m = matrix(data)
        return m.det()
      },
      iterations: 100
    }
  ],
  compare: [
    ['vector(1,2,3).dot(vector(4,5,6))', 'vector(1,2,3).cross(vector(4,5,6))'],
    ['matrix([[1,2],[3,4]]).det()', 'matrix([[1,2],[3,4]]).inv()']
  ]
}

runSuite(suite)
console.log('\n✅ Linear algebra benchmarks complete!')

