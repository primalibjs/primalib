/**
 * Prime Generation Benchmarks
 * 
 * Benchmarks prime generation and primality testing methods.
 */

import { primes, address, operations } from '../primalib.mjs'
import { primaSet } from '../primalib.mjs'

const { firstDivisor, isPrime } = operations
import { runSuite, warmup } from './benchmark-utils.mjs'

// Warmup
warmup(() => primes.take(100).toArray(), 3)

const suite = {
  name: 'Prime Generation & Testing',
  tests: [
    {
      name: 'primes.take(100)',
      description: 'First 100 primes',
      fn: () => primes.take(100).toArray(),
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
      name: 'isPrime(1000003)',
      description: 'Check large prime',
      fn: () => isPrime(1000003),
      expected: true,
      iterations: 100
    },
    {
      name: 'firstDivisor(1000003)',
      description: 'Find first divisor of large prime',
      fn: () => firstDivisor(1000003),
      expected: 1000003,
      iterations: 100
    },
    {
      name: 'isPrime(composite)',
      description: 'Check composite number',
      fn: () => isPrime(1000000),
      expected: false,
      iterations: 100
    },
    {
      name: 'firstDivisor(composite)',
      description: 'Find first divisor of composite',
      fn: () => firstDivisor(1000000),
      expected: 2,
      iterations: 100
    },
    {
      name: 'address(1000003)',
      description: 'Compute CRT address',
      fn: () => address(1000003),
      iterations: 50
    },
    {
      name: 'Filter primes in range',
      description: 'Filter primes 1M to 1.1M',
      fn: () => {
        const range = primaSet(function* () {
          for (let n = 1000000; n <= 1100000; n++) {
            yield n
          }
        })
        return range.filter(n => isPrime(n)).toArray()
      },
      iterations: 1
    },
    {
      name: 'Batch primality check',
      description: 'Check 1000 numbers for primality',
      fn: () => {
        const numbers = Array.from({ length: 1000 }, (_, i) => 1000000 + i)
        return numbers.map(n => isPrime(n))
      },
      iterations: 3
    }
  ],
  compare: [
    ['isPrime(1000003)', 'firstDivisor(1000003)'],
    ['primes.take(1000)', 'Filter primes in range']
  ]
}

runSuite(suite)
console.log('\n✅ Prime generation benchmarks complete!')

