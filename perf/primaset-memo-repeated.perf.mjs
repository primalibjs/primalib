/**
 * Repeated Access Test
 * 
 * Tests memoization performance for repeated access patterns (the actual use case).
 */

import { primes, primaSet } from '../primalib.mjs'
import { time, formatTime } from './benchmark-utils.mjs'

console.log('\n' + '='.repeat(70))
console.log('🔄 Repeated Access Performance Test')
console.log('='.repeat(70))

const COUNT = 1000
const ITERATIONS = 5

// ============================================================================
// Test 1: Sequential Access (First Time)
// ============================================================================

function test1_sequential_first() {
  const memo = primaSet(primes, { memo: true })
  const result = []
  for (let i = 0; i < COUNT; i++) {
    result.push(memo[i])  // First access - materializes
  }
  return result
}

// ============================================================================
// Test 2: Sequential Access (Second Time - Should be Cached)
// ============================================================================

function test2_sequential_second() {
  const memo = primaSet(primes, { memo: true })
  // First pass: materialize
  for (let i = 0; i < COUNT; i++) {
    memo[i]
  }
  // Second pass: should be cached
  const result = []
  for (let i = 0; i < COUNT; i++) {
    result.push(memo[i])  // Should be O(1) cached access
  }
  return result
}

// ============================================================================
// Test 3: Random Access (First Time)
// ============================================================================

function test3_random_first() {
  const memo = primaSet(primes, { memo: true })
  const indices = Array.from({ length: COUNT }, (_, i) => i)
  // Shuffle for random access
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]]
  }
  const result = []
  for (const i of indices) {
    result.push(memo[i])  // Random access - materializes as needed
  }
  return result
}

// ============================================================================
// Test 4: Random Access (Second Time - Should be Cached)
// ============================================================================

function test4_random_second() {
  const memo = primaSet(primes, { memo: true })
  // First pass: materialize sequentially
  for (let i = 0; i < COUNT; i++) {
    memo[i]
  }
  // Second pass: random access (should be cached)
  const indices = Array.from({ length: COUNT }, (_, i) => i)
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]]
  }
  const result = []
  for (const i of indices) {
    result.push(memo[i])  // Should be O(1) cached access
  }
  return result
}

// ============================================================================
// Test 5: Baseline - Direct Array Access
// ============================================================================

function test5_baseline() {
  const arr = primes.take(COUNT).toArray()
  const result = []
  for (let i = 0; i < COUNT; i++) {
    result.push(arr[i])  // Direct array access
  }
  return result
}

// ============================================================================
// Test 6: Eager Materialization + Sequential Access
// ============================================================================

function test6_eager_sequential() {
  const memo = primaSet(primes, { memo: true })
  // Eager: materialize everything first
  memo[COUNT - 1]  // This materializes up to COUNT-1
  // Then access sequentially
  const result = []
  for (let i = 0; i < COUNT; i++) {
    result.push(memo[i])  // All should be cached
  }
  return result
}

// ============================================================================
// Test 7: Eager Materialization + Random Access
// ============================================================================

function test7_eager_random() {
  const memo = primaSet(primes, { memo: true })
  // Eager: materialize everything first
  memo[COUNT - 1]  // This materializes up to COUNT-1
  // Then random access
  const indices = Array.from({ length: COUNT }, (_, i) => i)
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]]
  }
  const result = []
  for (const i of indices) {
    result.push(memo[i])  // All should be cached
  }
  return result
}

// ============================================================================
// Run Tests
// ============================================================================

console.log(`\n📊 Testing ${COUNT} prime accesses (${ITERATIONS} iterations each)\n`)

const tests = [
  { name: 'Sequential (First Access)', fn: test1_sequential_first },
  { name: 'Sequential (Second Access - Cached)', fn: test2_sequential_second },
  { name: 'Random (First Access)', fn: test3_random_first },
  { name: 'Random (Second Access - Cached)', fn: test4_random_second },
  { name: 'Baseline (Direct Array)', fn: test5_baseline },
  { name: 'Eager + Sequential', fn: test6_eager_sequential },
  { name: 'Eager + Random', fn: test7_eager_random }
]

const results = {}

for (const test of tests) {
  console.log(`🔍 Testing: ${test.name}`)
  const result = time(test.fn, ITERATIONS)
  results[test.name] = result
  console.log(`   ⏱️  Average: ${formatTime(result.avg)}`)
  console.log(`   📈 Min: ${formatTime(result.min)}, Max: ${formatTime(result.max)}`)
}

// ============================================================================
// Analysis
// ============================================================================

console.log('\n' + '='.repeat(70))
console.log('📊 Performance Analysis')
console.log('='.repeat(70))

const baseline = results['Baseline (Direct Array)']
const firstAccess = results['Sequential (First Access)']
const secondAccess = results['Sequential (Second Access - Cached)']

console.log(`\nBaseline (Direct Array): ${formatTime(baseline.avg)}`)

console.log(`\n🔍 First Access (Materialization):`)
console.log(`   Sequential: ${formatTime(firstAccess.avg)} (${(firstAccess.avg / baseline.avg).toFixed(2)}x slower)`)
console.log(`   Eager: ${formatTime(results['Eager + Sequential'].avg)} (${(results['Eager + Sequential'].avg / baseline.avg).toFixed(2)}x slower)`)

console.log(`\n🔍 Second Access (Should be Cached):`)
console.log(`   Sequential: ${formatTime(secondAccess.avg)} (${(secondAccess.avg / baseline.avg).toFixed(2)}x slower)`)
console.log(`   Expected: Should be close to baseline if caching works`)

const speedup = firstAccess.avg / secondAccess.avg
console.log(`\n📈 Caching Speedup: ${speedup.toFixed(2)}x`)
if (speedup < 2) {
  console.log(`   ⚠️  Warning: Caching should provide >2x speedup for repeated access`)
}

console.log(`\n🔍 Random Access:`)
console.log(`   First: ${formatTime(results['Random (First Access)'].avg)}`)
console.log(`   Second (Cached): ${formatTime(results['Random (Second Access - Cached)'].avg)}`)
const randomSpeedup = results['Random (First Access)'].avg / results['Random (Second Access - Cached)'].avg
console.log(`   Speedup: ${randomSpeedup.toFixed(2)}x`)

console.log(`\n🔍 Eager Materialization:`)
console.log(`   Sequential: ${formatTime(results['Eager + Sequential'].avg)}`)
console.log(`   Random: ${formatTime(results['Eager + Random'].avg)}`)
console.log(`   vs Baseline: ${(results['Eager + Sequential'].avg / baseline.avg).toFixed(2)}x slower`)

// ============================================================================
// Recommendations
// ============================================================================

console.log('\n' + '='.repeat(70))
console.log('💡 Findings & Recommendations')
console.log('='.repeat(70))

if (secondAccess.avg > baseline.avg * 2) {
  console.log(`
❌ **Problem Identified**: Cached access is still slow
   - Second access: ${formatTime(secondAccess.avg)}
   - Baseline: ${formatTime(baseline.avg)}
   - Issue: Proxy overhead is significant even for cached access
   
🔧 **Solution**: Bypass Proxy when accessing materialized array
   - Check if index < _memoized.length before Proxy handler
   - Use direct array access: _memoized[index]
   - Only use Proxy for lazy materialization
`)
}

if (speedup < 3) {
  console.log(`
⚠️  **Caching Not Effective**: Speedup is only ${speedup.toFixed(2)}x
   - Expected: >3x speedup for cached vs first access
   - Current: ${speedup.toFixed(2)}x
   - Issue: Proxy overhead negates caching benefits
`)
}

if (results['Eager + Sequential'].avg < firstAccess.avg) {
  console.log(`
✅ **Eager Materialization is Better**: ${(firstAccess.avg / results['Eager + Sequential'].avg).toFixed(2)}x faster
   - Pre-materialize on first access
   - Then all accesses are O(1)
   - Reduces incremental materialization overhead
`)
}

console.log('\n✅ Repeated access test complete!')

