/**
 * Example 6: Memoization Performance
 * 
 * Demonstrates how memoization dramatically speeds up repeated access to
 * infinite sequences. Measures performance from 1K to 10M primes with
 * 10-fold increases, restarting on each test.
 */

import { primes, primaSet } from 'primalib'

console.log('🌟 PrimaSet: Memoization Performance\n')

// ============================================================================
// Performance Test: Multiple Scales
// ============================================================================

const scales = [1000, 10000, 100000, 1000000] // 1K to 1M

console.log('📊 Memoization Performance Test:')
console.log('   Testing from 1K to 10M primes with 10-fold increases\n')

for (const count of scales) {
  // Create a fresh primaSet for each test (restart)
  const Pmemo = primaSet(primes, { memo: true })
  
  console.log(`\n🔢 Testing with ${count.toLocaleString()} primes:`)
  
  // Benchmark: Direct generator iteration (baseline)
  const genStart = performance.now()
  const gen = primes
  const directPrimes = []
  let genCount = 0
  for (const p of gen) {
    directPrimes.push(p)
    if (++genCount >= count) break
  }
  const genTime = performance.now() - genStart
  console.log(`   📊 Baseline (direct generator): ${genTime.toFixed(2)}ms`)
  
  // First pass: materialize primes via index access
  const start1 = performance.now()
  for (let i = 0; i < count; i++) {
    Pmemo[i]  // Access via array index - materializes and caches
  }
  const time1 = performance.now() - start1
  console.log(`   First pass (index access): ${time1.toFixed(2)}ms`)
  if (genTime > 0) {
    const overhead = time1 - genTime
    const overheadPct = ((time1 / genTime - 1) * 100).toFixed(1)
    console.log(`   ⚠️  Overhead: ${overhead.toFixed(2)}ms (${overheadPct}% slower)`)
  }
  
  // Second pass: access backwards (should be fast - cached)
  const start2 = performance.now()
  for (let i = count - 1; i >= 0; i--) {
    Pmemo[i]  // Should be instant - already cached
  }
  const time2 = performance.now() - start2
  console.log(`   Second pass (backward): ${time2.toFixed(2)}ms`)
  
  const speedup = time1 / time2
  console.log(`   Speedup: ${speedup.toFixed(1)}x faster`)
  
  // Verify we got primes (access after both passes to ensure cached)
  const firstPrime = Pmemo[0]
  const lastPrime = Pmemo[count - 1]
  const samplePrime = count >= 10 ? Pmemo[9] : Pmemo[count - 1]
  console.log(`   First prime: ${firstPrime}, Sample (index 9): ${samplePrime}, Last prime (index ${count - 1}): ${lastPrime}`)
  
  if (speedup >= 3.0) {
    console.log(`   ✅ Memoization working! (${speedup.toFixed(1)}x speedup)`)
  } else {
    console.log(`   ⚠️  Speedup below 3x threshold (${speedup.toFixed(1)}x)`)
  }
}

console.log('\n✅ Memoization performance test complete!')
console.log('   Cached access is significantly faster than materialization. ✨')

