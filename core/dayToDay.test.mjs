/**
dayToDay.test.js  – bullet-proof edition
*/
import { test } from '../test/test.mjs';  // Assume ESM test harness with check(actual, expected)
import { primaSet, N, Z, R, primes, address, pipe } from "primalib"
import { range, histogram } from "@primalib/stat"
import { point, space } from "@primalib/core"
const { sq, sqrt, inv, ln, gcd, mod, abs, neg, add, sub, mul, div, scale, shift, mean, min, max, sum, take } = primaSet

test('🧪 dayToDay.test.mjs Calling styles — functional, OO, callable, piping', ({check}) => {
  // --- OO only first --------------------------------------
  check(N(10).sq().sum(), 385)

  // --- free function later --------------------------------
  const f = sum(sq(N(10)))
  check(f, 385)

  // --- pipe later -----------------------------------------
  const p = pipe(N, take(10), sq, sum)
  check(p(), 385)
})

test('pipe: Composition', ({check}) => {
  const sum10Squares = pipe(take(10), sq, sum);
  check(sum10Squares(N()), 385)
  check(sum10Squares(primes), 2397)
})

// 1.  Naturals -------------------------------------------------------------
test('First 5 squares', ({check}) => check(N().take(5).sq(), [1, 4, 9, 16, 25]))
test('Sum of first 10 naturals', ({check}) => check(N(10).sum(), 55))

// 2.  Integers -------------------------------------------------------------
test('Symmetric range', ({check}) => check(Z(-2, 2), [-2, -1, 0, 1, 2]))
test('Even integers starting at -10', ({check}) => check(Z(-10).filter(x => x % 2 === 0).take(4), [-10, -8, -6, -4]))

// 3.  Reals  –  step 0.2 needs digits = 1  --------------------------------
test('Count 0 → 1 in 0.2 steps', ({check}) => check(R(0, 1, 1).take(6).mul(2), [0, 0.2, 0.4, 0.6, 0.8, 1]))
test('Square-roots of those', ({check}) => check(R(0, 1, 1).sqrt().take(5).map(x => +x.toFixed(2)), [0, 0.32, 0.45, 0.55, 0.63]))

// 4.  Functional style -----------------------------------------------------
test('sqrt(sq([3,4,5])) back to itself', ({check}) => check(sqrt(sq([3, 4, 5])), [3, 4, 5]))
test('add([1,2,3], 10) broadcast', ({check}) => check(add([1, 2, 3], 10), [11, 12, 13]))

// 5.  OO chain  –  round to 2 digits  -------------------------------------
test('[1,2,3].sq().add(10).sqrt() rounded', ({check}) =>
  check([1, 2, 3].map(x => x * x).map(x => x + 10).map(x => +Math.sqrt(x).toFixed(2)), [3.32, 3.74, 4.36]))

// 6.  Primes ---------------------------------------------------------------
test('Primes take 5', ({check}) => check(primes.take(5), [2, 3, 5, 7, 11]))

// 7.  Pipe style  –  curried helpers  -------------------------------------
test('pipe: first 10 → square → sum', ({check}) => check(pipe(take(10), sq, sum)(N()), 385))

// 8.  Geometry  ------------------------------------------------------------
test('Point (1,2) + (3,4)', ({check}) => check(point(1, 2).add(point(3, 4)).coords, [4, 6]))
test('Unit-square vertices', ({check}) => check(space([0, 0], [1, 1]).vertices().length, 4))
test('Distance from origin', ({check}) => check(point(3, 4).norm(), '5'))

// 9.  CRT  -----------------------------------------------------------------
test('address(77)', ({check}) => check(address(77), [1, 2, 2, 0]))
test('CRT round-trip 1234', ({check}) => check(address.toNumber(address(1234)), 1234))

// 10.  Broadcast vs zip  ---------------------------------------------------
test('Scale up: [1,2,3] * 100', ({check}) => check(mul([1, 2, 3], 100), [100, 200, 300]))
test('Element-wise div: [10,20,30] / [2,4,5]', ({check}) => check(div([10, 20, 30], [2, 4, 5]), [5, 5, 6]))

// 11.  Stats  --------------------------------------------------------------
test('Mean of first 100 naturals', ({check}) => check(N(100).mean(), 50.5))
test('Sum of logs of first 5 primes', ({check}) => {
  const expected = [2, 3, 5, 7, 11].reduce((a, p) => a + Math.log(p), 0)
  check(primes.take(5).log().sum(), +expected.toFixed(10))
})

// 12.  Infinite + lazy  ----------------------------------------------------
test('Even squares from infinity', ({check}) => check(N().sq().filter(x => x % 2 === 0).take(4), [4, 16, 36, 64]))

// 13.  Scalar auto-unwrap  -------------------------------------------------
test('Single value unwrapped', ({check}) => check(sq(5) + 1, 26))

// 14.  Edge cases  ---------------------------------------------------------
test('Empty set sum is 0', ({check}) => check([].reduce((a, b) => a + b, 0), 0))
test('Single-element chain', ({check}) => check([42].map(x => x * x).map(x => x / 2), [882]))

// console.clear()
// const ok = test.run()
// console.log(ok ? '\n✅  All day-to-day tricks green — ready for production!\n'
//   : '\n❌  Something feels off — check above\n')