/**
 * Memory Usage Benchmarks
 * 
 * Benchmarks memory consumption of PrimaLib operations.
 */

import { primaSet, N, primes } from '../primalib.mjs'
import { runSuite, memory, formatBytes } from './benchmark-utils.mjs'

const suite = {
  name: 'Memory Usage Analysis',
  tests: [
    {
      name: 'N(10000) lazy',
      description: 'Lazy sequence (no materialization)',
      fn: () => {
        const memBefore = memory()
        const seq = N(10000)
        const memAfter = memory()
        return { before: memBefore, after: memAfter, seq }
      }
    },
    {
      name: 'N(10000) materialized',
      description: 'Materialized array',
      fn: () => {
        const memBefore = memory()
        const arr = N(10000).toArray()
        const memAfter = memory()
        return { before: memBefore, after: memAfter, arr }
      }
    },
    {
      name: 'primes.take(1000) lazy',
      description: 'Lazy prime sequence',
      fn: () => {
        const memBefore = memory()
        const seq = primes.take(1000)
        const memAfter = memory()
        return { before: memBefore, after: memAfter, seq }
      }
    },
    {
      name: 'primes.take(1000) materialized',
      description: 'Materialized primes',
      fn: () => {
        const memBefore = memory()
        const arr = primes.take(1000).toArray()
        const memAfter = memory()
        return { before: memBefore, after: memAfter, arr }
      }
    },
    {
      name: 'Memoized primes (1000)',
      description: 'Memoized prime access',
      fn: () => {
        const memBefore = memory()
        const memo = primaSet(primes, { memo: true })
        for (let i = 0; i < 1000; i++) {
          memo[i]
        }
        const memAfter = memory()
        return { before: memBefore, after: memAfter, memo }
      }
    },
    {
      name: 'Cached primes (1000)',
      description: 'Cached prime access',
      fn: () => {
        const memBefore = memory()
        const cached = primaSet(primes, { cache: true, cacheSize: 1000 })
        for (let i = 0; i < 1000; i++) {
          cached.get(i)
        }
        const memAfter = memory()
        return { before: memBefore, after: memAfter, cached }
      }
    },
    {
      name: 'Chained operations lazy',
      description: 'Lazy chain without materialization',
      fn: () => {
        const memBefore = memory()
        const chain = N(10000).map(x => x * 2).filter(x => x % 3 === 0).take(100)
        const memAfter = memory()
        return { before: memBefore, after: memAfter, chain }
      }
    },
    {
      name: 'Chained operations materialized',
      description: 'Materialized chain',
      fn: () => {
        const memBefore = memory()
        const arr = N(10000).map(x => x * 2).filter(x => x % 3 === 0).take(100).toArray()
        const memAfter = memory()
        return { before: memBefore, after: memAfter, arr }
      }
    }
  ]
}

// Custom runner for memory benchmarks
console.log(`\n${'='.repeat(60)}`)
console.log(`📊 ${suite.name}`)
console.log('='.repeat(60))

for (const test of suite.tests) {
  console.log(`\n🔍 ${test.name}`)
  console.log(`   ${test.description || ''}`)
  
  try {
    const memBefore = memory()
    const result = test.fn()
    const memAfter = memory()
    
    if (memBefore && memAfter) {
      const memDiff = memAfter.usedJSHeapSize - memBefore.usedJSHeapSize
      const totalDiff = memAfter.totalJSHeapSize - memBefore.totalJSHeapSize
      
      console.log(`   💾 Memory used: ${formatBytes(Math.abs(memDiff))}`)
      console.log(`   💾 Total heap: ${formatBytes(Math.abs(totalDiff))}`)
      
      if (memDiff > 0) {
        console.log(`   ⚠️  Memory increase: +${formatBytes(memDiff)}`)
      } else {
        console.log(`   ✅ Memory decrease: ${formatBytes(Math.abs(memDiff))}`)
      }
    } else {
      console.log(`   ⚠️  Memory tracking not available`)
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`)
  }
}

console.log('\n✅ Memory benchmarks complete!')

