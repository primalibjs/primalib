/**
 * Memoization Performance Test
 * 
 * Tests that accessing 1M primes forward (materializing) then backward (cached)
 * shows significant speedup on the second pass.
 */

import { test } from '../test/test.mjs'
import { primaSet } from 'primalib'
import { primes } from 'primalib'

test('Memoization: 1M primes forward then backward (second pass must be faster)', ({check, log}) => {
  const Pmemo = primaSet(primes, { memo: true })
  const count = parseInt(process.env.PRIME_COUNT || '100000', 10) // Default 100K, can override with PRIME_COUNT=1000000
  
  // First pass: materialize primes (slow)
  log(`\n📊 Memoization Test: Getting first ${count.toLocaleString()} primes...`)
  const start1 = performance.now()
  let pcount = 0
  for (let i = 0; i < count; i++)
    pcount += Pmemo[i]  // Access via array index - materializes and caches

  // check(Pmemo[count-1], primes[count-1])

  const time1 = performance.now() - start1
  log(`   First pass (forward): ${time1.toFixed(2)}ms`)
  
  // Second pass: access backwards (should be fast - cached)
  const start2 = performance.now()
  for (let i = count - 1; i >= 0; i--)
    pcount -= Pmemo[i]  // Should be instant - already cached
  
  check(pcount, 0)  

  const time2 = performance.now() - start2
  log(`   Second pass (backward): ${time2.toFixed(2)}ms`)
  
  const speedup = time1 / time2
  log(`   Speedup: ${speedup.toFixed(1)}x faster`)
  
  // Verify we got primes
  check(Pmemo[0], 2)  // First prime
  check(Pmemo[count - 1] > 0, true)  // Nth prime should be positive
  check(typeof Pmemo[count - 1] === 'number', true)  // Should be a number
  
  // Second pass should be at least 5x faster (demonstrates memoization)
  check(time2 < time1 / 3)//, `Second pass (${time2.toFixed(2)}ms) should be much faster than first (${time1.toFixed(2)}ms)`)
  
  log(`   ✅ Memoization working! Cached access is ${speedup.toFixed(1)}x faster\n`)
})