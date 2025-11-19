/**
 * Memoization Strategy Comparison
 * 
 * Tests different memoization strategies to identify the best approach.
 */

import { primes, primaSet } from '../primalib.mjs'
import { time, formatTime, compare } from './benchmark-utils.mjs'

console.log('\n' + '='.repeat(70))
console.log('🔬 Memoization Strategy Analysis')
console.log('='.repeat(70))

const COUNT = 1000
const ITERATIONS = 5

// ============================================================================
// Strategy 1: Current Implementation (Incremental Materialization)
// ============================================================================

function strategy1_current() {
  const memo = primaSet(primes, { memo: true })
  const result = []
  for (let i = 0; i < COUNT; i++) {
    result.push(memo[i])  // Incremental materialization
  }
  return result
}

// ============================================================================
// Strategy 2: Pre-materialize (Eager Materialization)
// ============================================================================

function strategy2_eager() {
  const memo = primaSet(primes, { memo: true })
  // Pre-materialize by accessing last index
  memo[COUNT - 1]  // This materializes everything up to COUNT-1
  const result = []
  for (let i = 0; i < COUNT; i++) {
    result.push(memo[i])  // All cached now
  }
  return result
}

// ============================================================================
// Strategy 3: Direct Materialization (Baseline)
// ============================================================================

function strategy3_baseline() {
  return primes.take(COUNT).toArray()
}

// ============================================================================
// Strategy 4: Manual Caching with Array
// ============================================================================

function strategy4_manualArray() {
  const cache = []
  const gen = primes[Symbol.iterator]()
  const result = []
  for (let i = 0; i < COUNT; i++) {
    if (i < cache.length) {
      result.push(cache[i])
    } else {
      // Materialize up to i
      while (cache.length <= i) {
        const { value, done } = gen.next()
        if (done) break
        cache.push(value)
      }
      result.push(cache[i])
    }
  }
  return result
}

// ============================================================================
// Strategy 5: Batch Materialization (Materialize in chunks)
// ============================================================================

function strategy5_batch() {
  const cache = []
  const gen = primes[Symbol.iterator]()
  const CHUNK_SIZE = 100
  const result = []
  
  for (let i = 0; i < COUNT; i++) {
    if (i < cache.length) {
      result.push(cache[i])
    } else {
      // Materialize next chunk
      const target = Math.ceil((i + 1) / CHUNK_SIZE) * CHUNK_SIZE
      while (cache.length < target) {
        const { value, done } = gen.next()
        if (done) break
        cache.push(value)
      }
      result.push(cache[i])
    }
  }
  return result
}

// ============================================================================
// Strategy 6: Map-based Sparse Caching
// ============================================================================

function strategy6_map() {
  const cache = new Map()
  const gen = primes[Symbol.iterator]()
  let currentIndex = 0
  const result = []
  
  for (let i = 0; i < COUNT; i++) {
    if (cache.has(i)) {
      result.push(cache.get(i))
    } else {
      // Materialize up to i
      while (currentIndex <= i) {
        const { value, done } = gen.next()
        if (done) break
        cache.set(currentIndex, value)
        currentIndex++
      }
      result.push(cache.get(i))
    }
  }
  return result
}

// ============================================================================
// Strategy 7: Two-Pass (Materialize then Access)
// ============================================================================

function strategy7_twopass() {
  // First pass: materialize
  const materialized = primes.take(COUNT).toArray()
  
  // Second pass: access (simulating repeated access)
  const result = []
  for (let i = 0; i < COUNT; i++) {
    result.push(materialized[i])
  }
  return result
}

// ============================================================================
// Run Benchmarks
// ============================================================================

console.log(`\n📊 Testing ${COUNT} prime accesses (${ITERATIONS} iterations each)\n`)

const strategies = [
  { name: 'Current (Incremental)', fn: strategy1_current },
  { name: 'Eager (Pre-materialize)', fn: strategy2_eager },
  { name: 'Baseline (Direct take)', fn: strategy3_baseline },
  { name: 'Manual Array Cache', fn: strategy4_manualArray },
  { name: 'Batch Materialization', fn: strategy5_batch },
  { name: 'Map-based Cache', fn: strategy6_map },
  { name: 'Two-Pass (Materialize+Access)', fn: strategy7_twopass }
]

const results = {}

for (const strategy of strategies) {
  console.log(`🔍 Testing: ${strategy.name}`)
  const result = time(strategy.fn, ITERATIONS)
  results[strategy.name] = result
  console.log(`   ⏱️  Average: ${formatTime(result.avg)}`)
  console.log(`   📈 Min: ${formatTime(result.min)}, Max: ${formatTime(result.max)}`)
  
  // Verify correctness
  const expected = primes.take(COUNT).toArray()
  const match = JSON.stringify(result.result) === JSON.stringify(expected)
  console.log(`   ${match ? '✅' : '❌'} Correctness: ${match ? 'Match' : 'Mismatch'}`)
}

// ============================================================================
// Comparison Analysis
// ============================================================================

console.log('\n' + '='.repeat(70))
console.log('📊 Performance Comparison')
console.log('='.repeat(70))

const baseline = results['Baseline (Direct take)']
console.log(`\nBaseline: ${formatTime(baseline.avg)}`)

for (const [name, result] of Object.entries(results)) {
  if (name === 'Baseline (Direct take)') continue
  const speedup = baseline.avg / result.avg
  const status = speedup > 1 ? '✅ Faster' : speedup > 0.8 ? '⚠️  Similar' : '❌ Slower'
  console.log(`${name}: ${formatTime(result.avg)} (${speedup.toFixed(2)}x vs baseline) ${status}`)
}

// ============================================================================
// Detailed Analysis
// ============================================================================

console.log('\n' + '='.repeat(70))
console.log('🔬 Strategy Analysis')
console.log('='.repeat(70))

console.log(`
1. **Current (Incremental)**: ${formatTime(results['Current (Incremental)'].avg)}
   - Materializes incrementally on each access
   - Proxy overhead + cache checks
   - Issue: Each access triggers materialization check

2. **Eager (Pre-materialize)**: ${formatTime(results['Eager (Pre-materialize)'].avg)}
   - Materializes everything on first access
   - Then all subsequent accesses are cached
   - Should be faster for sequential access

3. **Baseline (Direct take)**: ${formatTime(results['Baseline (Direct take)'].avg)}
   - Single pass materialization
   - No Proxy overhead
   - This is the fastest approach

4. **Manual Array Cache**: ${formatTime(results['Manual Array Cache'].avg)}
   - Direct array caching without Proxy
   - Minimal overhead
   - Should be close to baseline

5. **Batch Materialization**: ${formatTime(results['Batch Materialization'].avg)}
   - Materializes in chunks (100 at a time)
   - Reduces number of materialization calls
   - Trade-off between memory and speed

6. **Map-based Cache**: ${formatTime(results['Map-based Cache'].avg)}
   - Uses Map for sparse access patterns
   - Good for random access, not sequential
   - Overhead for sequential access

7. **Two-Pass**: ${formatTime(results['Two-Pass (Materialize+Access)'].avg)}
   - Materialize once, then access
   - Simulates repeated access scenario
   - Shows cost of materialization vs access
`)

// ============================================================================
// Recommendations
// ============================================================================

console.log('\n' + '='.repeat(70))
console.log('💡 Recommendations')
console.log('='.repeat(70))

const fastest = Object.entries(results).reduce((a, b) => 
  a[1].avg < b[1].avg ? a : b
)

console.log(`\n✅ Fastest Strategy: ${fastest[0]} (${formatTime(fastest[1].avg)})`)

if (results['Eager (Pre-materialize)'].avg < results['Current (Incremental)'].avg) {
  console.log(`
🔧 **Fix for Memoization**:
   - Pre-materialize on first access instead of incremental
   - Access last index first to materialize everything
   - Then all subsequent accesses are O(1)
`)
}

if (results['Manual Array Cache'].avg < results['Current (Incremental)'].avg) {
  console.log(`
🔧 **Alternative Fix**:
   - Remove Proxy overhead for cached access
   - Use direct array access when materialized
   - Only use Proxy for lazy materialization
`)
}

console.log('\n✅ Strategy analysis complete!')

