/**
 *  P R I M A L I B   v 0.4  — concise & clear
 *  One-file, test-first, Proxy-based plugin architecture
 *  Run:  node this-file.js
*/

import { test } from "../test/test.mjs"
import { primaSet } from "../core/primaset.mjs"
import { N, Z, R, primes, address } from "./primanum.mjs"
import { pipe } from "../core/primaset.mjs"
import { point } from "../geo/primageo.mjs"
const { sq, sqrt, inv, ln, abs, neg, add, sub, mul, div, scale, shift, mean, min, max, sum, take, gcd, mod } = primaSet

// ------ N Natural Numbers ---------
test('🧪 primanum.test.mjs N(4) — finite quantity', ({check}) => {
  check(N(4), [1, 2, 3, 4])
  check(N(4).count(), 4)
})

test('N().take(5) — infinite + take', ({check}) => {
  check(N().take(5), [1, 2, 3, 4, 5])
  check(N().take(5).count(), 5)
})

test('N — chaining', ({check}) => {
  check(N(10).map(x => x * x).sum(), 385)
  check(N().take(4).reduce((a, b) => a + b, 0), 10)
})

// ------ Z Integers ---------
test('Z(-2,2) — symmetric range', ({check}) => {
  check(Z(-2, 2), [-2, -1, 0, 1, 2])
  check(Z(-2, 2).count(), 5)
})
test('Z(5,10) — positive range', ({check}) => {
  check(Z(5, 10), [5, 6, 7, 8, 9, 10])
  check(Z(5, 10).count(), 6)
})
test('Z — infinite + take', ({check}) => {
  check(Z().take(3), [0, 1, 2])
  check(Z(-10).take(5), [-10, -9, -8, -7, -6])
})
test('R — real grid', ({check}) => {
  check(R(0, 0.05, 2), [0, 0.01, 0.02, 0.03, 0.04, 0.05]);   // 2-digit string
  check(R(0, 0.5, 1), [0, 0.1, 0.2, 0.3, 0.4, 0.5]);   // ✅ 1-digit, half-open, includes 0.5
  check(R(0, 5, 0), [0, 1, 2, 3, 4, 5]);                 // ✅ integers, includes 5
})

// ------ R Real ---------
test('R — chaining', ({check}) => {
  check(R(0, 1, 1).map(x => Number((x * x).toFixed(2))).take(5), [0, 0.01, 0.04, 0.09, 0.16]); // 2-digit precision
})

test('Sets — finite, infinite, quantity param', ({check}) => {
  check(N(4), [1, 2, 3, 4]);                          // finite via argument
  check(N().take(5), [1, 2, 3, 4, 5]);                // infinite + take
  check(Z(-2, 2), [-2, -1, 0, 1, 2]);                 // integers range
})

// ------ Custom Operations ---------

test('gcd — positives', ({check}) => {
  check(gcd(77, 21), 7)
  check(gcd(0, 5), 5)
  check(gcd(5, 0), 5)
  check(gcd(0, 0), 0)
})

test('mod — Euclidean (always ≥ 0)', ({check}) => {
  check(mod(5, 3), 2)
  check(mod(-5, 3), 1)
  check(mod(10, 4), 2)
  check(mod(-10, 4), 2)
  check(mod(0, 7), 0)
})

test('zip — stops at shorter, lazy', ({check}) => {
  const a = [1, 2, 3], b = [10, 20]
  const z = primaSet(a).zip(b, (x, y) => x + y)
  check(z, [11, 22])
  check(z.count(), 2)
})

test('zip — infinite + take (3 pairs)', ({check}) => {
  const inf = N()
  const fin = [100, 200, 300]
  const z = inf.zip(fin, (x, y) => x + y)
  check(z.take(3), [101, 202, 303])
})

// ----- N, Z, R with operations -----
test('N + gcd — twin primes ≤ 20', ({check}) => {
  const twins = N().filter(n => n > 2 && (n % 6 === 1 || n % 6 === 5)).take(4)
  check(twins, [5, 7, 11, 13])
})

test('N + mod — squares mod 4', ({check}) => {
  const sqMod4 = N(10).map(x => x * x).map(x => mod(x, 4))
  check(sqMod4.take(5), [1, 0, 1, 0, 1])
})

test('N + zip — harmonic partial', ({check}) => {
  let h = N().zip(N(), (a, b) => a / b).take(5)
  check(h.map(Math.round), [1, 1, 1, 1, 1])

  h = N().zip(N(), (a, b) => a / (b * b * b)).take(5)
  check(h.map(x => x.toFixed(2)), ["1.00", "0.25", "0.11", "0.06", "0.04"])
})

test('Z + gcd — coprime pairs in [-5,5]', ({check}) => {
  const z = Z(-5, 5)
  const pairs = z.filter(n => gcd(n, 6) === 1)
  check(pairs.take(6), [-5, -1, 1, 5])
})

test('Z + mod — negatives become positive', ({check}) => {
  const rem = Z(-3, 3).map(x => mod(x, 3))
  check(rem, [0, 1, 2, 0, 1, 2, 0])
})

test('R + zip — density field', ({check}) => {
  const dens = R(0, 1, 1).zip(R(0, 1, 1), (x, y) => x * y).take(5)
  check(dens.map(x => x.toFixed(4)), ["0.0000", "0.0100", "0.0400", "0.0900", "0.1600"])
})

//  ----- Unary and Binary Operations ----- 
test('Unary ops — square, root, inverse, log', ({check}) => {
  check(sq(2), 4)
  check(Math.sqrt(2).toFixed(4), '1.4142')
  check(inv(2), 0.5)
  check(Math.log(2).toFixed(4), '0.6931')

  // lazy variants - NO toArray() needed!
  check([0, 1, 2, 3, 4].map(x => x * x), [0, 1, 4, 9, 16])
  check(N(5).sq(), [1, 4, 9, 16, 25])
  check(N(3).inv().map(x => x.toFixed(4)), ["1.0000", "0.5000", "0.3333"])
})

test('Binary ops — element-wise arithmetic', ({check}) => {
  check([1, 2].map((x, i) => x + [10, 20][i]), [11, 22])
  check([10, 20].map((x, i) => x - [1, 2][i]), [9, 18])
  check([1, 2, 3].map((x, i) => x * [2, 2, 2][i]), [2, 4, 6])
  check([1, 2, 3].map((x, i) => x / [2, 2, 2][i]), [0.5, 1, 1.5])

  // lazy variants using new operations
  check(primaSet([1, 2]).add([10, 20]), [11, 22])
  check(primaSet([1, 2, 3]).mul([2, 2, 2]), [2, 4, 6])
})

test('Utility ops — abs, neg, scale, shift, stats', ({check}) => {
  check(primaSet([-3, 0, 2]).abs(), [3, 0, 2])
  check(abs([-3, 0, 2]), [3, 0, 2])
  check(primaSet([1, -2, 3]).neg(), [-1, 2, -3])
  check(primaSet([1, 2, 3]).scale(3), [3, 6, 9])
  check(primaSet([1, 2, 3]).map(x => x + 10), [11, 12, 13])
  check(primaSet([1, 2, 3, 4, 5]).reduce((a, b) => a + b, 0) / 5, 3)

  check(N(5).abs(), [1, 2, 3, 4, 5])
  check(N(3).scale(10), [10, 20, 30])
  check(N(5).sum(), 15)
})

//  ----- PRIMES -----
test('Primes — first divisor and stream', ({check}) => {
  check(primaSet.firstDivisor(77), 7)
  check(primes.take(7), [2, 3, 5, 7, 11, 13, 17])
})

//  ----- CRT (Chinese Remainder Theorem) -----
test('CRT — address and reconstruct', ({check}) => {
  check(address(30030), [0, 0, 0, 0, 0, 0, 8]) // 2*3*5*7*11*13
  check(address.toNumber([0, 0, 0, 0, 0, 0, 8]), 30030)

  check(address(30031), [1, 1, 1, 1, 1, 1, 9]) // 59*509
  check(address.toNumber([1, 1, 1, 1, 1, 1, 9]), 30031) // 59*509

  const samples = [0, 1, 2, 4, 6, 7, 10, 13, 26, 49, 101, 210, 211, 1000]
  samples.forEach(n => check(address.toNumber(address(n)), n))
})

//  ----- COMPOSITION -----
// ============================================================================

test('Calling styles — functional, OO, callable, piping', ({check}) => {
  // --- OO only first --------------------------------------
  check(N(10).sq().sum(), 385)

  // --- free function later --------------------------------
  const f = sum(sq(N(10)))
  check(f, 385)

  // --- pipe later -----------------------------------------
  const p = pipe(N, take(10), sq, sum)
  check(p(), 385)
})

// ============================================================================
//  MINI-STORIES
// ============================================================================
test('Prime cloud centroid', ({check}) => {
  const pts = primes.take(100).map(p => point(...address(p)))
  const raw = pts.reduce((a, b) => a.add(b), point(0, 0, 0, 0))
  const cnt = point(...raw.coords.map(c => c / 100))
  check(cnt.coords.map(x => x.toFixed(2)), ["0.99","1.51","2.48","3.47"])
})

// ============================================================================
// primanum.advanced.test.mjs - Test primal geometry constructs
// ============================================================================
import { 
  evens, odds, multiplesOf,
  twins, cousins, sexy,
  residualSpace, residualDensity,
  goldbachPairs, goldbachVectors, goldbachTable,
  primalDistance, twinDistances,
  dimensionStats, twinAdmissibility
} from './primanum.mjs'

// LAYER 1: PARITY TESTS

test('Parity: evens are multiples of 2', ({check}) => {
  check(evens(10), [2, 4, 6, 8, 10])
  check(evens().take(5), [2, 4, 6, 8, 10])
})

test('Parity: odds are residual after removing evens', ({check}) => {
  check(odds(9), [1, 3, 5, 7, 9])
  check(odds().take(5), [1, 3, 5, 7, 9])
})

test('Parity: multiplesOf generalizes', ({check}) => {
  check(multiplesOf(3)(15), [3, 6, 9, 12, 15])
  check(multiplesOf(5)().take(4), [5, 10, 15, 20])
})

// LAYER 4: CONSTELLATION TESTS
test('Constellations: twins (gap=2)', ({check}) => {
  const twinList = twins.take(5)
  check(twinList[0], [3, 5])
  check(twinList[1], [5, 7])
  check(twinList[2], [11, 13])
})

test('Constellations: cousins (gap=4)', ({check}) => {
  const cousinList = cousins.take(3)
  check(cousinList[0], [3, 7])
  check(cousinList[1], [7, 11])
})

test('Constellations: sexy (gap=6)', ({check}) => {
  const sexyList = sexy.take(3)
  check(sexyList[0], [5, 11])
  check(sexyList[1], [7, 13])
})

// LAYER 5: ADDRESS TESTS
test('Primes: primorial computation', ({check}) => {
  check(primes.primorial(3), 30)  // 2*3*5
  check(primes.primorial(4), 210) // 2*3*5*7
})

test('Address: isResidual identifies coprime numbers', ({check}) => {
  check(address.isResidual([1, 1, 1]))  // coprime to 2,3,5
  check(address.isResidual([0, 1, 1]), false) // divisible by 2
  check(address.isResidual([1, 0, 1]), false) // divisible by 3
})

// LAYER 6: RESIDUAL SPACE TESTS
test('Residual: density decreases with dimension', ({check}) => {
  const d2 = residualDensity(2) // remove multiples of 2,3
  const d3 = residualDensity(3) // remove multiples of 2,3,5
  const d4 = residualDensity(4) // remove multiples of 2,3,5,7
  
  check(d2 > d3)
  check(d3 > d4)
  check(d2.toFixed(4), '0.3333') // (1-1/2)(1-1/3) = 1/3
})

test('Residual: space contains only coprimes', ({check}) => {
  const r3 = residualSpace(3, 30)
  
  // Should not contain multiples of 2, 3, or 5
  check(r3.every(n => n % 2 !== 0))
  check(r3.every(n => n % 3 !== 0))
  check(r3.every(n => n % 5 !== 0))
  
  // Should contain 1, 7, 11, 13, 17, 19, 23, 29
  check(r3.includes(1))
  check(r3.includes(7))
  check(r3.includes(11))
})

// LAYER 7: GOLDBACH TESTS

test('Goldbach: pairs for n=10', ({check}) => {
  const pairs = [...goldbachPairs(10)]
  check(pairs.length > 0)
  check(pairs[0], { p: 3, q: 7, sum: 10 })
  check(pairs[1], { p: 5, q: 5, sum: 10 })
})

// test('Goldbach: linearity in hypercube', ({check}) => {
//   const vectors = goldbachVectors(20, 4)
  
//   // All should satisfy address(p+q) = address(p) ⊕ address(q)
//   check(vectors.every(v => v.linearityHolds))
// })

// test('Goldbach: no failures up to 1000', ({check}) => {
//   const results = goldbachTable(1000)
//   const failures = results.filter(r => r.count === 0)
  
//   check(failures.count(), 0)
//   check(results.every(r => r.count > 0))
// })

// ============================================================================
// LAYER 8: GEOMETRY TESTS
// ============================================================================

test('Geometry: twin distances are small', ({check}) => {
  const distances = [...twinDistances(10, 3)]
  // Twin primes should be close in hypercube
  const avgDist = distances.reduce((s, d) => s + d.distance, 0) / distances.length
  check(avgDist < 1) // Should be < 1 in unit hypercube
})

test('Geometry: distance is symmetric', ({check}) => {
  const d1 = primalDistance(5, 7, 3)
  const d2 = primalDistance(7, 5, 3)
  check(d1.toFixed(6), d2.toFixed(6))
})

// ============================================================================
// LAYER 9: DIMENSIONAL ANALYSIS TESTS
// ============================================================================

// test('Dimension: stats scale correctly', ({check}) => {
//   const stats2 = dimensionStats(2, 100)
//   const stats3 = dimensionStats(3, 100)
  
//   check(stats2.M, 6)   // 2*3
//   check(stats3.M, 30)  // 2*3*5
  
//   check(stats3.residualVolume < stats2.residualVolume)
// })

// test('Twin admissibility: HL ratio near 1', ({check}) => {
//   const adm = twinAdmissibility(6, 1000)
  
//   // Ratio should be reasonably close to 1
//   check(adm.ratio > 0.5 && adm.ratio < 2)
//   check(adm.actualTwins > 0)
// })