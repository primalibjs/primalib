/**
 * Geometry Benchmarks
 * 
 * Benchmarks geometric operations: points, hypercubes, hyperplanes.
 */

import { point, hypercube, hyperplane } from '../primalib.mjs'
import { runSuite, warmup } from './benchmark-utils.mjs'

// Warmup
warmup(() => point(1, 2, 3).norm(), 10)

const suite = {
  name: 'Geometry Operations',
  tests: [
    {
      name: 'point(1,2,3).norm()',
      description: 'Point norm (3D)',
      fn: () => point(1, 2, 3).norm(),
      expected: Math.sqrt(14),
      iterations: 10000
    },
    {
      name: 'point(1,2,3).add(point(4,5,6))',
      description: 'Point addition',
      fn: () => point(1, 2, 3).add(point(4, 5, 6)),
      iterations: 10000
    },
    {
      name: 'point(1,2,3).scale(2)',
      description: 'Point scaling',
      fn: () => point(1, 2, 3).scale(2),
      iterations: 10000
    },
    {
      name: 'hypercube([0,0,0], [1,1,1]).vertices()',
      description: '3D cube vertices',
      fn: () => hypercube([0, 0, 0], [1, 1, 1]).vertices(),
      iterations: 1000
    },
    {
      name: 'hypercube([0,0,0,0], [1,1,1,1]).vertices()',
      description: '4D hypercube vertices',
      fn: () => hypercube([0, 0, 0, 0], [1, 1, 1, 1]).vertices(),
      iterations: 100
    },
    {
      name: 'hypercube([0,0,0], [1,1,1]).sample(10)',
      description: 'Sample 10 points from cube',
      fn: () => hypercube([0, 0, 0], [1, 1, 1]).sample(10),
      iterations: 1000
    },
    {
      name: 'hyperplane([0,0,0], [1,1,1]).distance(point(1,2,3))',
      description: 'Distance to hyperplane',
      fn: () => hyperplane([0, 0, 0], [1, 1, 1]).distance(point(1, 2, 3)),
      iterations: 10000
    },
    {
      name: 'Numeric indexing point[0]',
      description: 'Access via numeric index',
      fn: () => {
        const p = point(1, 2, 3)
        return [p[0], p[1], p[2]]
      },
      expected: [1, 2, 3],
      iterations: 10000
    },
    {
      name: 'Destructuring point',
      description: 'Destructure point coordinates',
      fn: () => {
        const p = point(1, 2, 3)
        const [x, y, z] = p
        return [x, y, z]
      },
      expected: [1, 2, 3],
      iterations: 10000
    }
  ],
  compare: [
    ['Numeric indexing point[0]', 'Destructuring point'],
    ['point(1,2,3).norm()', 'point(1,2,3).add(point(4,5,6))']
  ]
}

runSuite(suite)
console.log('\n✅ Geometry benchmarks complete!')

