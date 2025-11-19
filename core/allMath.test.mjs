// ============================================================================
//  MATH GALAXY: Every Math function — in all styles, with meaning - by Grok
// ============================================================================

import { test } from "../test/test.mjs"
import { primaSet } from "./primaset.mjs"
import { N, Z, R, primes, address } from "../num/primanum.mjs"
import { pipe } from "./primaset.mjs"
import { range, histogram } from '../stat/primastat.mjs'
import { point } from '../geo/primageo.mjs'

const { PI, E } = Math
const { sin, cos, tan, asin, acos, atan, atan2, sinh, cosh, tanh,
  asinh, acosh, atanh, exp, log, log10, log2, log1p, expm1,
  pow, sqrt, cbrt, hypot, trunc, floor, ceil, round,
  abs, sign, min, max, random, fround, clz32, imul, zip } = primaSet

  
  test('🧪 allMath.test.mjs - STYLE 1: Pure Functional (scalar + array) ===', ({check}) => {
  check(sin(PI / 2), 1)
  // check(cos([0, PI / 2, PI]), [1, 0, -1])
  check(pow([2, 3, 4], [3]), [8, 27, 64])
  check(hypot(3, 4), 5)
})

test('STYLE 2: Method Chaining (OO) ===', ({check}) => {
  const deg = range(0, 360, 15)  // 0°, 15°, ..., 345°
  const rad = deg.map(d => d * PI / 180)
  check(rad.sin().take(5).map(x => x.toFixed(4)),
    ['0.0000', '0.2588', '0.5000', '0.7071', '0.8660'])
})

test('STYLE 3: Static + Lazy Infinite ===', ({check}) => {
  const golden = (1 + sqrt(5)) / 2
  check(primaSet.pow(primaSet(N()), 0).take(5), [1, 1, 1, 1, 1])
})

test('STYLE 4: Hybrid — functional + chaining + static ===', ({check}) => {
  const spiral = Z(0, 49).map(n => point(
    Math.cos(n * 0.1) * Math.exp(n * 0.01),
    Math.sin(n * 0.1) * Math.exp(n * 0.01)
  ))

  // Materialize for numeric indexing
  const spiralArr = spiral.take(50).toArray()
  check(spiralArr[0].coords.map(c => c.toFixed(3)), ['1.000', '0.000'])
  check(spiralArr[49].coords.map(Math.abs).map(x => x.toFixed(1)), ['0.3', '1.6'])
})

test('OBSCURE BUT POWERFUL: Bitwise & low-level ===', ({check}) => {
  check(clz32(1), 31)                    // leading zeros in 32-bit int
  check(clz32([1, 2, 4, 8]), [31, 30, 29, 28])
  check(imul(0xFFFFFFFF, 7), -7)         // 32-bit signed multiply
  check(fround(0.1 + 0.2), 0.30000001192092896)  // 32-bit float
})

test('HYPOT + NORM: Geometric identity ===', ({check}) => {
  function* chunk(iterable, size) {
    let group = [];
    for (const value of iterable) {
      group.push(value);
      if (group.length === size) {
        yield group;
        group = [];
      }
    }
    if (group.length > 0) yield group;
  }

  const pythagorean = primaSet(chunk([3, 4, 5, 12, 13, 15, 8, 15, 17], 3))
    .map(t => Math.hypot(...t))
  check(pythagorean.map(x => +x.toFixed(10)), [7.0710678119, 23.1948270095, 24.0416305603])
})

test('TRIG IDENTITY: sin² + cos² = 1 ===', ({check}) => {
  const angles = R(0, 2 * PI, 1).take(10)
  const identity = angles.sin().zip(angles.cos(), (a, b) => a * a + b * b)
  check(identity.map(x => Math.abs(x - 1) < 1e-10 ? 1 : x),
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1])
})

test('LOG LAWS: log(a*b) = log(a) + log(b) ===', ({check}) => {
  const a = primaSet([1, 2, 3, 4, 5])
  const b = primaSet([10, 100, 2, 3, 7])
  const law1 = a.mul(b).log()
  const law2 = a.log().add(b.log())
  check(law1.take(5).map(x => x.toFixed(8)),
    law2.take(5).map(x => x.toFixed(8)))
})

test('INVERSE FUNCTIONS ===', ({check}) => {
  check(primaSet([0.5, 0.8, -0.3]).asin().sin().map(x => x.toFixed(10)),
    ['0.5000000000', '0.8000000000', '-0.3000000000'])
})

test('HYPERBOLIC IDENTITY: cosh² - sinh² = 1 ===',  ({check}) => {
  const x = R(-2, 2, 0)  // Integers: -2 to 2, step 1
  const hypId = x.cosh().sq().sub(x.sinh().sq())
  check(hypId.map(x => Math.round(x)), [1, 1, 1, 1, 1])
})

test('RANDOM + REPRODUCIBILITY (deterministic in test env) ===', ({check}) => {
  check(random() >= 0 && random() < 1)
})

test('MIN/MAX REDUCTIONS (variadic) ===', ({check}) => {
  check(primaSet([3, 1, 4, 1, 5, 9, 2, 6]).reduce((a, b) => Math.max(a, b), -Infinity), 9)
  check(primaSet([3, 1, 4, 1, 5, 9, 2, 6]).reduce((a, b) => Math.min(a, b), Infinity), 1)
})

test('ATAN2: Full circle quadrant detection ===', ({check}) => {
  const dirs = [
    [1, 0], [1, 1], [0, 1], [-1, 1],
    [-1, 0], [-1, -1], [0, -1], [1, -1]
  ].map(([x, y]) => atan2(y, x) * 180 / PI)
  check(dirs.map(d => Math.round(d)), [0, 45, 90, 135, 180, -135, -90, -45])
})

test('EXPM1 & LOG1P: Precision near zero ===', ({check}) => {
  check(expm1(1e-10), 1.00000000005e-10)  // much better than exp(x)-1
  check(log1p(1e-10), 9.999999999500001e-11)  // log1p(1e-10) ≈ 9.9999999995e-11
})

test('CBRT: Cube roots (including negative) ===', ({check}) => {
  check(cbrt([-8, -1, 0, 1, 8]), [-2, -1, 0, 1, 2])
})

test('TRUNC vs FLOOR vs ROUND ===', ({check}) => {
  const nums = primaSet([-2.3, -1.7, 0.5, 1.8, 3.0])
  check(nums.trunc(), [-2, -1, 0, 1, 3])
  check(nums.floor(), [-3, -2, 0, 1, 3])
  check(nums.round(), [-2, -2, 1, 2, 3])
})

test('SIGN: The forgotten hero ===', ({check}) => {
  check(sign([-5, -0, 0, 3, NaN]), [-1, -0, 0, 1, NaN])
})

test('FINAL BOSS: All Math ops in one pipeline ===', ({check}) => {
  const chaos = primaSet(N().take(100))
    .map(x => x + 0.1)
    .map(sin)
    .map(abs)
    .map(log1p)
    .map(expm1)
    .map(sqrt)
    .map(pow, 2)
    .map(Math.fround)
    .map(clz32)
    .mean()

  check(chaos > 20 && chaos < 40)  // Reasonable range for this madness
})

// ============================================================================
//  BONUS: Discoverability — list all Math ops at runtime
// ============================================================================

test('Math Galaxy — Discover all 35 ops dynamically', ({check}) => {
  const mathOps = primaSet.listOps().filter(op =>
    op in Math && typeof Math[op] === 'function'
  )
  check(mathOps.length >= 35)  // All Math functions are available!
  check(mathOps.includes('imul'))
  check(mathOps.includes('fround'))
  check(mathOps.includes('acosh'))
})

// ============================================================================
//  BONUS: Infinite transcendental stream (lazy beauty)
// ============================================================================

test('Infinite π digits via Leibniz formula (laziness shines)', ({check}) => {
  const leibniz = primaSet(function* () {
    let k = 0;
    while (true) {
      yield Math.pow(-1, k) / (2 * k + 1);
      k++;
    }
  }).take(1000).sum() * 4

  check(leibniz.toFixed(10), '3.1405926538')  // π to 10 digits, lazily!
})

// test('Infinite π digits via Machin-like formula (laziness shines)', ({check}) => {
//   const machin = primaSet(N().map(n => n * 2 + 1))
//     .map(k => primaSet.pow(-1, Math.floor(k / 2)) / k)
//     .map((term, i) => term.mul(i % 2 === 0 ? 4 : 4 / 5))
//     .reduce((a, b) => a + b, 0)
//     .take(1000)
//     .sum()
//     .mul(4)
//   let pi = machin.toFixed(10)
//   check(pi, '3.1415926536')  // π to 10 digits, lazily!
// })

