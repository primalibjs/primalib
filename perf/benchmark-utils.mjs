/**
 * Benchmark Utilities
 * 
 * Provides timing, memory, and comparison utilities for benchmarking PrimaLib operations.
 */

/**
 * Measure execution time of a function
 */
export function time(fn, iterations = 1) {
  const times = []
  
  for (let i = 0; i < iterations; i++) {
    const start = performance.now()
    const result = fn()
    const end = performance.now()
    times.push(end - start)
  }
  
  const avg = times.reduce((a, b) => a + b, 0) / times.length
  const min = Math.min(...times)
  const max = Math.max(...times)
  
  return {
    avg,
    min,
    max,
    total: times.reduce((a, b) => a + b, 0),
    iterations,
    result: fn() // Return actual result from last run
  }
}

/**
 * Measure memory usage (if available)
 */
export function memory() {
  if (typeof process !== 'undefined' && process.memoryUsage) {
    return process.memoryUsage()
  }
  if (typeof performance !== 'undefined' && performance.memory) {
    return {
      usedJSHeapSize: performance.memory.usedJSHeapSize,
      totalJSHeapSize: performance.memory.totalJSHeapSize,
      jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
    }
  }
  return null
}

/**
 * Format bytes to human-readable string
 */
export function formatBytes(bytes) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

/**
 * Format time in milliseconds
 */
export function formatTime(ms) {
  if (ms < 1) return `${(ms * 1000).toFixed(2)}μs`
  if (ms < 1000) return `${ms.toFixed(2)}ms`
  return `${(ms / 1000).toFixed(2)}s`
}

/**
 * Compare two benchmark results
 */
export function compare(name1, result1, name2, result2) {
  const speedup = result1.avg / result2.avg
  const faster = speedup > 1 ? name2 : name1
  const ratio = speedup > 1 ? speedup : 1 / speedup
  
  return {
    faster,
    speedup: ratio,
    improvement: `${(Math.abs(1 - speedup) * 100).toFixed(1)}%`,
    [name1]: result1.avg,
    [name2]: result2.avg
  }
}

/**
 * Run benchmark suite
 */
export async function runSuite(suite) {
  console.log(`\n${'='.repeat(60)}`)
  console.log(`📊 ${suite.name}`)
  console.log('='.repeat(60))
  
  const results = {}
  
  for (const test of suite.tests) {
    console.log(`\n🔍 ${test.name}`)
    console.log(`   ${test.description || ''}`)
    
    try {
      const memBefore = memory()
      const result = time(test.fn, test.iterations || 1)
      const memAfter = memory()
      
      results[test.name] = result
      
      console.log(`   ⏱️  Average: ${formatTime(result.avg)}`)
      console.log(`   📈 Min: ${formatTime(result.min)}, Max: ${formatTime(result.max)}`)
      
      if (memBefore && memAfter) {
        const memDiff = memAfter.usedJSHeapSize - memBefore.usedJSHeapSize
        if (memDiff > 0) {
          console.log(`   💾 Memory: +${formatBytes(memDiff)}`)
        }
      }
      
      if (test.expected) {
        const match = JSON.stringify(result.result) === JSON.stringify(test.expected)
        console.log(`   ${match ? '✅' : '❌'} Result: ${match ? 'Correct' : 'Mismatch'}`)
        if (!match) {
          console.log(`      Expected: ${JSON.stringify(test.expected)}`)
          console.log(`      Got: ${JSON.stringify(result.result)}`)
        }
      }
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`)
      results[test.name] = { error: error.message }
    }
  }
  
  // Comparisons
  if (suite.compare) {
    console.log(`\n📊 Comparisons:`)
    for (const comp of suite.compare) {
      const r1 = results[comp[0]]
      const r2 = results[comp[1]]
      if (r1 && r2 && !r1.error && !r2.error) {
        const comparison = compare(comp[0], r1, comp[1], r2)
        console.log(`   ${comp[0]} vs ${comp[1]}: ${comparison.faster} is ${comparison.speedup.toFixed(2)}x faster`)
      }
    }
  }
  
  return results
}

/**
 * Warmup function to avoid cold start issues
 */
export function warmup(fn, iterations = 10) {
  for (let i = 0; i < iterations; i++) {
    fn()
  }
}

