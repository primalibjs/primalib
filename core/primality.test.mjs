/**
 * Test both primality methods: firstDivisor (default) and isPrime (experimental)
 */

import { operations } from '../primaops.mjs'

const { firstDivisor, isPrime } = operations

console.log('✅ Method Metadata:')
console.log('  firstDivisor.method:', firstDivisor.method)
console.log('  isPrime.method:', isPrime.method)
console.log('  isPrime.experimental:', isPrime.experimental)
console.log('')

console.log('✅ Primality Tests:')
const testNumbers = [7, 11, 15, 77, 97, 100]

testNumbers.forEach(n => {
  const fd = firstDivisor(n)
  const ip = isPrime(n)
  const isPrimeByFD = fd === n
  const match = (isPrimeByFD && ip) || (!isPrimeByFD && !ip)
  console.log(`  ${n}: firstDivisor=${fd} (${isPrimeByFD ? 'prime' : 'composite'}), isPrime=${ip} ${match ? '✓' : '✗'}`)
})

console.log('')
console.log('✅ Default: firstDivisor (use until isPrime geometric sieve is fully tested)')
console.log('✅ Experimental: isPrime (geometric sieve)')

