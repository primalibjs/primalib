/**
 * Tree Operations Benchmarks
 * 
 * Benchmarks tree operations: node creation, traversal, address system.
 */

import { node, tree, walkTree } from '../primalib.mjs'
import { runSuite, warmup } from './benchmark-utils.mjs'

// Warmup
warmup(() => tree({ a: 1, b: 2 }), 5)

const suite = {
  name: 'Tree Operations',
  tests: [
    {
      name: 'tree({a:1, b:2})',
      description: 'Create simple tree',
      fn: () => tree({ a: 1, b: 2 }),
      iterations: 1000
    },
    {
      name: 'tree(nested object)',
      description: 'Create nested tree',
      fn: () => tree({
        files: {
          src: { 'index.js': '...', 'app.js': '...' },
          'package.json': '...'
        }
      }),
      iterations: 1000
    },
    {
      name: 'root.walk()',
      description: 'Depth-first traversal',
      fn: () => {
        const root = tree({
          a: 1,
          b: { c: 2, d: 3 },
          e: 4
        })
        return [...root.walk()].length
      },
      iterations: 100
    },
    {
      name: 'root.walk("breadth")',
      description: 'Breadth-first traversal',
      fn: () => {
        const root = tree({
          a: 1,
          b: { c: 2, d: 3 },
          e: 4
        })
        return [...root.walk('breadth')].length
      },
      iterations: 100
    },
    {
      name: 'root.walk("leaves")',
      description: 'Leaves-only traversal',
      fn: () => {
        const root = tree({
          a: 1,
          b: { c: 2, d: 3 },
          e: 4
        })
        return [...root.walk('leaves')].length
      },
      iterations: 100
    },
    {
      name: 'root.find("a.b.c")',
      description: 'Find node by address',
      fn: () => {
        const root = tree({
          a: { b: { c: 1 } }
        })
        return root.find('a.b.c')
      },
      iterations: 1000
    },
    {
      name: 'root.address()',
      description: 'Get node address',
      fn: () => {
        const root = tree({
          a: { b: { c: 1 } }
        })
        const node = root.find('a.b.c')
        return node ? node.address() : null
      },
      expected: 'a.b.c',
      iterations: 1000
    },
    {
      name: 'root.descendants()',
      description: 'Get all descendants',
      fn: () => {
        const root = tree({
          a: 1,
          b: { c: 2, d: 3 },
          e: 4
        })
        return [...root.descendants()].length
      },
      iterations: 100
    },
    {
      name: 'Large tree traversal',
      description: 'Traverse large tree (100 nodes)',
      fn: () => {
        const data = {}
        for (let i = 0; i < 10; i++) {
          data[`level1_${i}`] = {}
          for (let j = 0; j < 10; j++) {
            data[`level1_${i}`][`level2_${j}`] = i * 10 + j
          }
        }
        const root = tree(data)
        return [...root.walk()].length
      },
      iterations: 10
    }
  ],
  compare: [
    ['root.walk()', 'root.walk("breadth")'],
    ['root.walk()', 'root.walk("leaves")']
  ]
}

runSuite(suite)
console.log('\n✅ Tree benchmarks complete!')

