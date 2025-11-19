/**
 * Example 7: Primes Sum Performance
 * 
 * Compares primaSet prime generation with direct for loop using firstDivisor.
 * Tests summing all primes from 2 to 1M (and optionally 10M).
 */

import { primes, primaSet } from '../primalib.mjs'

// Get firstDivisor from primaSet operations
const { firstDivisor } = primaSet

console.log('🌟 PrimaSet: Primes Sum Performance Comparison\n')

// ============================================================================
// Helper: Sum primes up to maxPrime using direct for loop
// ============================================================================

function sumPrimesDirect(maxPrime) {
  let sum = 0
  let count = 0
  
  // Start from 2 (first prime)
  for (let n = 2; n <= maxPrime; n++) {
    // Use firstDivisor: if firstDivisor(n) === n, then n is prime
    if (firstDivisor(n) === n) {
      sum += n
      count++
    }
  }
  
  return { sum, count }
}

// ============================================================================
// Helper: Sum primes up to maxPrime using primaSet
// ============================================================================

function sumPrimesPrimaSet(maxPrime) {
  const P = primes
  let sum = 0
  let count = 0
  
  for (const p of P) {
    if (p > maxPrime) break
    sum += p
    count++
  }
  
  return { sum, count }
}

// ============================================================================
// Performance Test
// ============================================================================

const testCases = [
  { maxPrime: 1000000, label: '1M', testDirect: true },
  { maxPrime: 10000000, label: '10M', testDirect: false } // Skip direct loop for 10M (too slow)
]

for (const { maxPrime, label, testDirect } of testCases) {
  console.log(`\n📊 Testing primes up to ${label} (${maxPrime.toLocaleString()}):`)
  
  let result1 = null
  let time1 = 0
  
  // Test 1: Direct for loop with firstDivisor (only for 1M)
  if (testDirect) {
    console.log(`\n   Method 1: Direct for loop with firstDivisor`)
    const start1 = performance.now()
    result1 = sumPrimesDirect(maxPrime)
    time1 = performance.now() - start1
    console.log(`   Time: ${time1.toFixed(2)}ms`)
    console.log(`   Primes found: ${result1.count.toLocaleString()}`)
    console.log(`   Sum: ${result1.sum.toLocaleString()}`)
  } else {
    console.log(`\n   Method 1: Direct for loop (skipped - too slow for ${label})`)
  }
  
  // Test 2: primaSet primes generator
  console.log(`\n   Method 2: primaSet primes generator`)
  const start2 = performance.now()
  const result2 = sumPrimesPrimaSet(maxPrime)
  const time2 = performance.now() - start2
  console.log(`   Time: ${time2.toFixed(2)}ms`)
  console.log(`   Primes found: ${result2.count.toLocaleString()}`)
  console.log(`   Sum: ${result2.sum.toLocaleString()}`)
  
  // Comparison (only if we tested direct loop)
  if (testDirect && result1) {
    const speedup = time1 / time2
    const faster = time1 < time2 ? 'Direct loop' : 'PrimaSet'
    console.log(`\n   📈 Comparison:`)
    console.log(`   ${faster} is faster by ${Math.abs(speedup - 1).toFixed(1)}x`)
    console.log(`   Speedup: ${speedup.toFixed(2)}x`)
    
    // Verify results match
    if (result1.sum === result2.sum && result1.count === result2.count) {
      console.log(`   ✅ Results match!`)
    } else {
      console.log(`   ⚠️  Results differ!`)
      console.log(`      Direct: sum=${result1.sum}, count=${result1.count}`)
      console.log(`      PrimaSet: sum=${result2.sum}, count=${result2.count}`)
    }
  }
  
  // Check if 10M target is met (< 1 second)
  if (maxPrime === 10000000) {
    if (time2 < 1000) {
      console.log(`\n   ✅ 10M target met: ${time2.toFixed(2)}ms < 1000ms`)
    } else {
      console.log(`\n   ⚠️  10M target not met: ${time2.toFixed(2)}ms >= 1000ms`)
      console.log(`      (${((time2 / 1000 - 1) * 100).toFixed(1)}% over target)`)
    }
  }
}

console.log('\n✅ Performance comparison complete!')

