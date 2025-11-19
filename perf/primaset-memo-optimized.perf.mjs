/**
 * Optimized Memoization Test
 * 
 * Tests the new optimized implementation with simplified API.
 */

import { primes, primaSet } from '../primalib.mjs'
import { time, formatTime, compare } from './benchmark-utils.mjs'

console.log('\n' + '='.repeat(70))
console.log('🚀 Optimized Memoization Performance Test')
console.log('='.repeat(70))

const COUNT = 1000
const ITERATIONS = 5

// ============================================================================
// Test New API: memo: N
// ============================================================================

function test_memo_N() {
  const memo = primaSet(primes, { memo: COUNT })
  const result = []
  for (let i = 0; i < COUNT; i++) {
    result.push(memo[i])
  }
  return result
}

function test_memo_true() {
  const memo = primaSet(primes, { memo: true })
  const result = []
  for (let i = 0; i < COUNT; i++) {
    result.push(memo[i])
  }
  return result
}

function test_memo_large() {
  // For large primes, use larger cache
  const memo = primaSet(primes, { memo: 5000 })
  const result = []
  for (let i = 0; i < COUNT; i++) {
    result.push(memo[i])
  }
  return result
}

// ============================================================================
// Test Repeated Access
// ============================================================================

function test_repeated_access() {
  const memo = primaSet(primes, { memo: COUNT })
  // First pass
  for (let i = 0; i < COUNT; i++) {
    memo[i]
  }
  // Second pass (should be fast - direct access)
  const result = []
  for (let i = 0; i < COUNT; i++) {
    result.push(memo[i])
  }
  return result
}

// ============================================================================
// Baseline
// ============================================================================

function test_baseline() {
  return primes.take(COUNT).toArray()
}

// ============================================================================
// Run Tests
// ============================================================================

console.log(`\n📊 Testing ${COUNT} prime accesses (${ITERATIONS} iterations each)\n`)

const tests = [
  { name: 'Baseline (Direct take)', fn: test_baseline },
  { name: 'memo: true (default 1000)', fn: test_memo_true },
  { name: `memo: ${COUNT}`, fn: test_memo_N },
  { name: 'memo: 5000 (large cache)', fn: test_memo_large },
  { name: 'Repeated Access (Cached)', fn: test_repeated_access }
]

const results = {}

for (const test of tests) {
  console.log(`🔍 Testing: ${test.name}`)
  const result = time(test.fn, ITERATIONS)
  results[test.name] = result
  console.log(`   ⏱️  Average: ${formatTime(result.avg)}`)
  console.log(`   📈 Min: ${formatTime(result.min)}, Max: ${formatTime(result.max)}`)
  
  // Verify correctness
  const expected = primes.take(COUNT).toArray()
  const match = JSON.stringify(result.result) === JSON.stringify(expected)
  console.log(`   ${match ? '✅' : '❌'} Correctness: ${match ? 'Match' : 'Mismatch'}`)
}

// ============================================================================
// Analysis
// ============================================================================

console.log('\n' + '='.repeat(70))
console.log('📊 Performance Comparison')
console.log('='.repeat(70))

const baseline = results['Baseline (Direct take)']
console.log(`\nBaseline: ${formatTime(baseline.avg)}`)

for (const [name, result] of Object.entries(results)) {
  if (name === 'Baseline (Direct take)') continue
  const ratio = result.avg / baseline.avg
  const status = ratio < 1.5 ? '✅ Excellent' : ratio < 3 ? '✅ Good' : ratio < 5 ? '⚠️  Moderate' : '❌ Slow'
  console.log(`${name}: ${formatTime(result.avg)} (${ratio.toFixed(2)}x baseline) ${status}`)
}

const firstAccess = results[`memo: ${COUNT}`]
const repeatedAccess = results['Repeated Access (Cached)']
const speedup = firstAccess.avg / repeatedAccess.avg

console.log(`\n📈 Caching Speedup: ${speedup.toFixed(2)}x`)
if (speedup >= 3) {
  console.log(`   ✅ Excellent: Caching provides >3x speedup`)
} else if (speedup >= 2) {
  console.log(`   ✅ Good: Caching provides >2x speedup`)
} else {
  console.log(`   ⚠️  Warning: Caching should provide >2x speedup`)
}

console.log('\n✅ Optimized memoization test complete!')

