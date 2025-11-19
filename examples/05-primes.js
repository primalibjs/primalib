/**
 * 05-primes.js - Showcase infinite sets of primes
 * 
 * Demonstrates how PrimaSet handles infinite sets of primes as naturally
 * as finite arrays - free browseable, just like a normal array.
 */

import { primes, primaSet, N } from 'primalib'
const { sq, sum, take } = primaSet

console.log('🌟 PrimaSet: Infinite Sets of Primes\n')

// ============================================================================
// Primes as Infinite Array - Free Browseable
// ============================================================================

console.log('1. Primes as infinite array - free browseable:')
const P = primes  // primes is already a primaSet (infinite array)

// Access primes like array indices
console.log(`   P[0] = ${P.get(0)}`)  // First prime (get() materializes)
console.log(`   P[4] = ${P.get(4)}`)  // 5th prime
console.log(`   P[9] = ${P.get(9)}`)  // 10th prime

// Use memo option for fast array-like access
const Pmemo = primaSet(primes, { memo: true })
console.log(`   Pmemo[0] = ${Pmemo[0]}`)  // Cached access
console.log(`   Pmemo[99] = ${Pmemo[99]}`)  // 100th prime (cached)

console.log('\n2. Take ranges of primes:')
console.log(`   First 10: ${[...P.take(10)]}`)
console.log(`   Range 10-20: ${[...P.takeRange(10, 20)]}`)
console.log(`   Range 50-60: ${[...P.takeRange(50, 60)]}`)

// ============================================================================
// Operations on Infinite Prime Sets
// ============================================================================

console.log('\n3. Operations on infinite prime sets:')

// Sum of squares of first 10 primes
const sumSquares = sum(sq(P.take(10)))
console.log(`   Sum of squares (first 10): ${sumSquares}`)

// Primes squared
const primesSquared = P.take(10).map(p => p * p)
console.log(`   First 10 primes squared: ${[...primesSquared]}`)

// Filter primes by properties
const largePrimes = P.filter(p => p > 100).take(5)
console.log(`   First 5 primes > 100: ${[...largePrimes]}`)

// ============================================================================
// Prime Patterns
// ============================================================================

console.log('\n4. Prime patterns:')

// Twin primes (primes with gap 2)
const twins = []
let prev = 2
for (const p of P.take(20)) {
  if (p - prev === 2) {
    twins.push([prev, p])
  }
  prev = p
}
console.log(`   Twin primes (first 20): ${twins.map(([a,b]) => `(${a},${b})`).join(', ')}`)

// Prime gaps
const gaps = []
prev = 2
for (const p of P.take(20)) {
  gaps.push(p - prev)
  prev = p
}
console.log(`   Prime gaps (first 20): ${gaps.join(', ')}`)

// ============================================================================
// Naturals and Integers - Same Thing!
// ============================================================================

console.log('\n5. Naturals and Integers - infinite arrays:')
const Naturals = N()
console.log(`   N[0] = ${Naturals.get(0)}`)  // First natural
console.log(`   N[99] = ${Naturals.get(99)}`)  // 100th natural
console.log(`   N.takeRange(10, 20) = ${[...Naturals.takeRange(10, 20)]}`)

// ============================================================================
// Memo Option - Array Access
// ============================================================================

console.log('\n6. Memo option - makes set accessible as array []:')
const memoizedPrimes = primaSet(primes, { memo: true })
console.log(`   memoizedPrimes[0] = ${memoizedPrimes[0]}`)  // Fast cached access
console.log(`   memoizedPrimes[50] = ${memoizedPrimes[50]}`)  // Cached after first access
console.log(`   memoizedPrimes[100] = ${memoizedPrimes[100]}`)  // All cached

// ============================================================================
// get() Materializes Elements
// ============================================================================

console.log('\n7. get() materializes elements:')
console.log(`   P.get(0) materializes first prime: ${P.get(0)}`)
console.log(`   P.get(100) materializes 101st prime: ${P.get(100)}`)
console.log(`   After get(), elements are cached for fast access`)

// ============================================================================
// Infinite Sets as Normal Arrays
// ============================================================================

console.log('\n8. Infinite sets work like normal arrays:')
console.log(`   primes.take(5) = ${[...primes.take(5)]}`)
console.log(`   primes.takeRange(10, 15) = ${[...primes.takeRange(10, 15)]}`)
console.log(`   primes.filter(p => p % 10 === 7).take(5) = ${[...primes.filter(p => p % 10 === 7).take(5)]}`)

console.log('\n✅ Infinite sets of primes handled as naturally as finite arrays!')
console.log('   Free browseable, just like a normal array. ✨')

