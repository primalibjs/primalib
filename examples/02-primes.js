/**
 * Example 2: Prime Numbers
 * 
 * Working with infinite prime sequences
 */

import { primes, address, primaSet } from 'primalib'
const { sum } = primaSet

console.log('=== Example 2: Prime Numbers ===\n')

// First 10 primes
console.log('First 10 primes:')
console.log([...primes.take(10)])  // → [2, 3, 5, 7, 11, 13, 17, 19, 23, 29]

// Sum of first 100 primes
console.log('\nSum of first 100 primes:')
console.log(sum(primes.take(100)))  // → 24133

// Chinese Remainder Theorem addressing
console.log('\nCRT address for 77:')
console.log(address(77))  // → [1, 2, 2, 0]

// Reconstruct from address
console.log('\nReconstruct from address:')
console.log(address.toNumber([1, 2, 2, 0]))  // → 77

