import { test } from '../../test/test.mjs';
import { geometricSieve, geometricSieveBatch, isPrimeGeometric, N } from '../../primanum.mjs';

test('🧪 geometric-sieve.test.mjs — geometric sieve basic', {check} => {
  const sieve = geometricSieve(1, 100)
  const primes = [...sieve.take(10)]
  check(primes[0], 2)
  check(primes.includes(23), true)
  check(primes.includes(15), false)
  check(primes.includes(1), false)
})

test('Geometric sieve range', {check} => {
  const sieve = geometricSieve(100, 200)
  const primes = [...sieve]
  check(primes.length > 0, true)
  check(primes[0] >= 100, true)
  check(primes[primes.length - 1] <= 200, true)
})

test('isPrimeGeometric - small primes', {check} => {
  check(isPrimeGeometric(2), true)
  check(isPrimeGeometric(3), true)
  check(isPrimeGeometric(5), true)
  check(isPrimeGeometric(7), true)
  check(isPrimeGeometric(11), true)
  check(isPrimeGeometric(13), true)
  check(isPrimeGeometric(17), true)
  check(isPrimeGeometric(19), true)
  check(isPrimeGeometric(23), true)
})

test('isPrimeGeometric - composites', {check} => {
  check(isPrimeGeometric(1), false)
  check(isPrimeGeometric(4), false)
  check(isPrimeGeometric(6), false)
  check(isPrimeGeometric(8), false)
  check(isPrimeGeometric(9), false)
  check(isPrimeGeometric(10), false)
  check(isPrimeGeometric(15), false)
  check(isPrimeGeometric(21), false)
  check(isPrimeGeometric(25), false)
  check(isPrimeGeometric(49), false)
})

test('isPrimeGeometric - larger numbers', {check} => {
  check(isPrimeGeometric(101), true)
  check(isPrimeGeometric(103), true)
  check(isPrimeGeometric(107), true)
  check(isPrimeGeometric(109), true)
  check(isPrimeGeometric(113), true)
  check(isPrimeGeometric(100), false)
  check(isPrimeGeometric(102), false)
  check(isPrimeGeometric(105), false)
})

test('Geometric sieve batch', {check} => {
  const numbers = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
  const result = geometricSieveBatch(numbers)
  const primes = [...result]
  check(primes.includes(2), true)
  check(primes.includes(3), true)
  check(primes.includes(5), true)
  check(primes.includes(7), true)
  check(primes.includes(11), true)
  check(primes.includes(13), true)
  check(primes.includes(17), true)
  check(primes.includes(19), true)
  check(primes.includes(4), false)
  check(primes.includes(6), false)
  check(primes.includes(8), false)
  check(primes.includes(9), false)
  check(primes.includes(10), false)
})

test('Geometric sieve with PrimaSet pipeline', {check} => {
  const primes = geometricSieve(1, 1000)
    .take(25)  // Only compute first 25 primes
  const result = [...primes]
  check(result.length, 25)
  check(result[0], 2)
  check(result[24] > 90, true)
})

test('Geometric sieve lazy evaluation', {check} => {
  const sieve = geometricSieve(1, 10000)
  const first10 = [...sieve.take(10)]
  check(first10.length, 10)
  check(first10[0], 2)
  check(first10[9] > 20, true)
})

