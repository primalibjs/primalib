/**
 * PrimaSet Operations Benchmarks
 * 
 * Benchmarks core PrimaSet operations: map, filter, take, reduce, etc.
 */

import { primaSet, N, primes } from '../primalib.mjs'
import { runSuite, warmup } from './benchmark-utils.mjs'

// Warmup
warmup(() => N(100).toArray(), 5)

const suite = {
  name: 'PrimaSet Operations',
  tests: [
    {
      name: 'N(1000).toArray()',
      description: 'Materialize 1000 naturals',
      fn: () => N(1000).toArray(),
      expected: Array.from({ length: 1000 }, (_, i) => i + 1)
    },
    {
      name: 'N(10000).map(x => x * 2).take(100)',
      description: 'Map and take (lazy)',
      fn: () => N(10000).map(x => x * 2).take(100).toArray(),
      iterations: 10
    },
    {
      name: 'N(1000).filter(x => x % 2 === 0)',
      description: 'Filter even numbers',
      fn: () => N(1000).filter(x => x % 2 === 0).toArray(),
      iterations: 10
    },
    {
      name: 'N(1000).reduce((a, b) => a + b, 0)',
      description: 'Reduce sum',
      fn: () => N(1000).reduce((a, b) => a + b, 0),
      expected: 500500
    },
    {
      name: 'N(1000).map(x => x * x).filter(x => x > 100).take(50)',
      description: 'Chain: map -> filter -> take',
      fn: () => N(1000).map(x => x * x).filter(x => x > 100).take(50).toArray(),
      iterations: 10
    },
    {
      name: 'primes.take(1000)',
      description: 'First 1000 primes',
      fn: () => primes.take(1000).toArray(),
      iterations: 5
    },
    {
      name: 'primes.take(10000)',
      description: 'First 10000 primes',
      fn: () => primes.take(10000).toArray(),
      iterations: 3
    },
    {
      name: 'primaSet([1..1000]).map(x => x * 2)',
      description: 'Array-backed set map',
      fn: () => primaSet(Array.from({ length: 1000 }, (_, i) => i + 1)).map(x => x * 2).toArray(),
      iterations: 10
    },
    {
      name: 'Memoized primes access (memo: 1000)',
      description: 'Access 1000 primes with memoization',
      fn: () => {
        const memo = primaSet(primes, { memo: 1000 })
        const result = []
        for (let i = 0; i < 1000; i++) {
          result.push(memo[i])
        }
        return result
      },
      iterations: 5
    },
    {
      name: 'Memoized primes access (repeated)',
      description: 'Repeated access to memoized primes',
      fn: () => {
        const memo = primaSet(primes, { memo: 1000 })
        // First pass: materialize
        for (let i = 0; i < 1000; i++) {
          memo[i]
        }
        // Second pass: should be fast (cached)
        const result = []
        for (let i = 0; i < 1000; i++) {
          result.push(memo[i])
        }
        return result
      },
      iterations: 5
    },
    {
      name: 'Cached primes access (cache: 1000)',
      description: 'Access 1000 primes with cache',
      fn: () => {
        const cached = primaSet(primes, { cache: 1000 })
        const result = []
        for (let i = 0; i < 1000; i++) {
          result.push(cached[i])  // Use array access, not .get()
        }
        return result
      },
      iterations: 5
    }
  ],
  compare: [
    ['primes.take(1000)', 'Memoized primes access (memo: 1000)'],
    ['Memoized primes access (memo: 1000)', 'Memoized primes access (repeated)'],
    ['primes.take(1000)', 'Cached primes access (cache: 1000)']
  ]
}

runSuite(suite)
console.log('\n✅ PrimaSet benchmarks complete!')

