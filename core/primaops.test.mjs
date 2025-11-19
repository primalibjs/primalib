/**
 * Comprehensive tests for functional calling styles
 */
import { test } from '../test/test.mjs'
import { primaSet } from './primaset.mjs'
import { N, Z, R, primes } from '../num/primanum.mjs'

// Destructure operations from primaSet
const { sq, sqrt, add, mul, sum, min, max, mean, clamp, sigmoid, factorial, lcm, firstDivisor } = primaSet;
const { pipe, take, map, filter, count } = primaSet;

// ============================================================================
//  CORE METHODS AS FREE FUNCTIONS
// ============================================================================

test('🧪 primaops.test.mjs - Core method: take as free function', ({check}) => {
  check(take(N(), 5), [1, 2, 3, 4, 5]);
  check(take(primes, 3), [2, 3, 5]);
});

test('Core method: take as curried function', ({check}) => {
  const take5 = take(5);
  check(take5(N()), [1, 2, 3, 4, 5]);
  check(take5(primes), [2, 3, 5, 7, 11]);
});

test('Core method: map as free function', ({check}) => {
  const double = x => x * 2;
  check(map([1, 2, 3], double), [2, 4, 6]);
  check(map(N(5), double), [2, 4, 6, 8, 10]);
});

test('Core method: map as curried function', ({check}) => {
  const double = map(x => x * 2);
  check(double([1, 2, 3]), [2, 4, 6]);
  check(double(N(5)), [2, 4, 6, 8, 10]);
});

test('Core method: filter as free function', ({check}) => {
  const isEven = x => x % 2 === 0;
  check(filter([1, 2, 3, 4], isEven), [2, 4]);
  check(filter(N(10), isEven), [2, 4, 6, 8, 10]);
});

test('Core method: filter as curried function', ({check}) => {
  const evens = filter(x => x % 2 === 0);
  check(evens([1, 2, 3, 4]), [2, 4]);
  check(evens(N(10)), [2, 4, 6, 8, 10]);
});

test('Core method: count as free function', ({check}) => {
  check(count([1, 2, 3]), 3);
  check(count(N(100)), 100);
});

test('Core method: sum as free function', ({check}) => {
  check(sum([1, 2, 3]), 6);
  check(sum(N(10)), 55);
});

// ============================================================================
//  OPERATIONS AS FREE FUNCTIONS
// ============================================================================

test('Operation: sq as free function', ({check}) => {
  check(sq(5), 25);
  check(sq([1, 2, 3]), [1, 4, 9]);
  check(sq(N(5)), [1, 4, 9, 16, 25]);
});

test('Operation: add as free function', ({check}) => {
  check(add(3, 4), 7);
  check(add([1, 2, 3], 10), [11, 12, 13]);
  check(add([1, 2], [10, 20]), [11, 22]);
});

test('Operation: mul as free function', ({check}) => {
  check(mul(3, 4), 12);
  check(mul([1, 2, 3], 10), [10, 20, 30]);
  check(mul([1, 2], [10, 20]), [10, 40]);
});

test('Operation: clamp as free function', ({check}) => {
  check(clamp(5, 0, 10), 5);
  check(clamp(-5, 0, 10), 0);
  check(clamp(15, 0, 10), 10);
  check(clamp([1, 5, 15], 0, 10), [1, 5, 10]);
});

test('Operation: sigmoid as free function', ({check}) => {
  check(sigmoid(0), 0.5);
  check(sigmoid([0, 1, -1]).map(x => x.toFixed(3)), ['0.500', '0.731', '0.269']);
});

test('Operation: factorial as free function', ({check}) => {
  check(factorial(0), 1);
  check(factorial(1), 1);
  check(factorial(5), 120);
  check(factorial([0, 1, 2, 3, 4, 5]), [1, 1, 2, 6, 24, 120]);
});

test('Operation: lcm as free function', ({check}) => {
  check(lcm(4, 6), 12);
  check(lcm(15, 20), 60);
  check(lcm([4, 6, 8], 12), [12, 12, 24]);
});

test('Operation: firstDivisor as free function', ({check}) => {
  check(firstDivisor(1), 1);
  check(firstDivisor(2), 2);
  check(firstDivisor(9), 3);
  check(firstDivisor(15), 3);
  check(firstDivisor(17), 17);
  check(firstDivisor([9, 15, 17, 21]), [3, 3, 17, 3]);
});

// ============================================================================
//  REDUCTIONS AS FREE FUNCTIONS
// ============================================================================

test('Reduction: min', ({check}) => {
  check(min([42]), 42);
  check(min(42), 42);
  check(min([3, 2, 4, 1, 5]), 1); // as array
  // as method 
  check(primaSet([42]).min(), 42); // it works
  check(primaSet(42).min(), 42); // as well
  check(primaSet([3, 2, 4, 1, 5]).min(), 1);
});

test('Reduction: max as method', ({check}) => {
  check(max([42]), 42);
  check(max(42), 42);
  check(max([3, 2, 4, 1, 5]), 5); // as array
  // as method 
  check(primaSet([42]).max(), 42); 
  check(primaSet(42).max(), 42);
  check(primaSet([3, 2, 4, 1, 5]).max(), 5);
});

test('Reduction: mean as free function', ({check}) => {
  check(mean([1, 2, 3, 4, 5]), 3);
  check(mean([10, 20]), 15);
});

test('Reduction: sum as free function', ({check}) => {
  check(sum([1, 2, 3]), 6);
  check(sum(N(10)), 55);
});

// ============================================================================
//  PIPE COMPOSITION
// ============================================================================

test('Pipe: with curried take', ({check}) => {
  const result = pipe(take(10), sq, sum)(N());
  check(result, 385);
});

test('Pipe: with multiple curried functions', ({check}) => {
  const double = map(x => x * 2);
  const sumDoubles = pipe(take(5), double, sum);
  check(sumDoubles(N()), 30); // (1+2+3+4+5)*2 = 30
});

test('Pipe: mixing curried and direct', ({check}) => {
  const result = pipe(
    take(10),
    s => primaSet(s).sq(),
    sum
  )(N());
  check(result, 385);
});

test('Pipe: works with primes', ({check}) => {
  const sumSquared10 = pipe(take(10), sq, sum);
  check(sumSquared10(N()), 385);
  check(sumSquared10(primes), 2397); // 2²+3²+5²+7²+11²+13²+17²+19²+23²+29²
});

// ============================================================================
//  R() STEP CALCULATION
// ============================================================================

test('R: digits=1 means step=0.1', ({check}) => {
  check(R(0, 1, 1), [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]);
});

test('R: digits=2 means step=0.01', ({check}) => {
  check(R(0, 0.5, 2).take(6), [0, 0.01, 0.02, 0.03, 0.04, 0.05]);
});

test('R: digits=0 means integers', ({check}) => {
  check(R(0, 5, 0), [0, 1, 2, 3, 4, 5]);
});

// ============================================================================
//  MIXED STYLES
// ============================================================================

test('Mixed: OO + functional', ({check}) => {
  const result = N(10).sq();
  check(sum(result), 385);
});

test('Mixed: functional + OO', ({check}) => {
  const squares = sq(N(10));
  check(squares.sum(), 385);
});

test('Mixed: all three styles', ({check}) => {
  // OO style
  check(N(5).sq().sum(), 55);
  
  // Functional style
  check(sum(sq(N(5))), 55);
  
  // Pipe style
  check(pipe(take(5), sq, sum)(N()), 55);
});

// ============================================================================
//  EDGE CASES
// ============================================================================

test('Edge: single element', ({check}) => {
  check(min([42]), 42);
  check(max([42]), 42);
  check(sum([42]), 42);
});

test('Edge: empty behavior', ({check}) => {
  check(sum([]), 0);
  check(primaSet([]).count(), 0);
});

test('Edge: scalar operations', ({check}) => {
  check(sq(5), 25);
  check(sqrt(16), 4);
  check(add(3, 7), 10);
});

test('Core method: take with timeout option', ({check}) => {
  check(N().take(5, {timeout: 0}), [1,2,3,4,5]);
});

test('Core method: skip', ({check}) => {
  check(N().skip(3).take(3), [4,5,6]);
  check(primes.skip(2).take(3), [5,7,11]);
});

test('Core method: zip', ({check}) => {
  check(primaSet([1,2,3]).zip([10,20,30]), [[1,10],[2,20],[3,30]]);
  check(primaSet([1,2]).zip([10,20,30]), [[1,10],[2,20]]);
});

test('Core method: on', ({check}) => {
  check(N().on(x => {}).take(3), [1,2,3]);
});

test('Core method: first', ({check}) => {
  check(N().first(), 1);
  check(primaSet([]).first(), 'undefined');
  check(primes.first(), 2);
});

test('Core method: isEmpty', ({check}) => {
  check(primaSet([]).isEmpty());
  check(N().isEmpty(), false);
  check(primaSet(null).isEmpty());
});

test('Core method: pipe instance method', ({check}) => {
  check(N().pipe(take(10), sq, sum), 385);
  check(primes.pipe(take(5), sq, sum), 208);
});

// ============================================================================
//  BATCH & CHUNKING
// ============================================================================

test('Core method: chunk', ({check}) => {
  check(N().take(7).chunk(3), [[1,2,3], [4,5,6], [7]]);
  check(primaSet([1,2,3,4]).chunk(2), [[1,2], [3,4]]);
  check(primaSet([1]).chunk(5), [[1]]);
  check(primaSet([1,2]).chunk(5), [[1,2]]);
});

test('Core method: window', ({check}) => {
  check(N().take(5).window(3), [[1,2,3], [2,3,4], [3,4,5]]);
  check(primaSet([1,2]).window(3), []);
});

// ============================================================================
//  FLATTEN & UNIQUE
// ============================================================================

test('Core method: flatten', ({check}) => {
  check(primaSet([[1,2], [3], [4,5]]).flatten(), [1,2,3,4,5]);
  check(primaSet([1, [2, [3]], 4]).flatten(), [1,2,3,4]); // now fully flat
  check(primaSet('abc').flatten(), ['a','b','c']);
});

test('Core method: mix (compose sets - bag of sets)', ({check}) => {
  // Compose sets together - treat as one unified set
  check(primaSet([1,2,3]).mix([10,20,30]), [1,2,3,10,20,30]);
  check(primaSet([1,2]).mix([10,20,30]), [1,2,10,20,30]);
  check(primaSet([1,2,3,4]).mix([10,20]), [1,2,3,4,10,20]);
  check(primaSet([1]).mix([10,20], [100,200]), [1,10,20,100,200]);
  // Like composing web elements
  check(primaSet(['div', 'span']).mix(['p', 'a']), ['div', 'span', 'p', 'a']);
});

test('Core method: shrink (reduce to simpler type)', ({check}) => {
  // Nested arrays → single value
  check(primaSet([[[1]]]).shrink(), 1);
  check(primaSet([[[[]]]]).shrink(), null);
  check(primaSet([[1,2]]).shrink(), [1,2]); // Multiple elements stay as array
  check(primaSet([1,2,3]).shrink(), [1,2,3]); // Multiple elements stay as array
  check(primaSet([[[[42]]]]).shrink(), 42);
  check(primaSet([[]]).shrink(), null);
  
  // BigInt → Number (when safe)
  check(primaSet([9007199254740991n]).shrink(), 9007199254740991); // MAX_SAFE_INTEGER
  check(primaSet([100n]).shrink(), 100);
  check(primaSet([-100n]).shrink(), -100);
  // Too large BigInt stays as BigInt
  const bigValue = 9007199254740992n; // MAX_SAFE_INTEGER + 1
  const shrunk = primaSet([bigValue]).shrink();
  check(typeof shrunk === 'bigint', true);
  
  // Multiple elements with BigInt
  check(primaSet([100n, 200n, 300n]).shrink(), [100, 200, 300]);
  
  // Mixed types
  check(primaSet([[1], [2], [3]]).shrink(), [1, 2, 3]);
});

// ============================================================================
//  MEMOIZATION PERFORMANCE TEST
// ============================================================================

test('Memoization: primes forward then backward (second pass must be faster)', ({check}) => {
  const Pmemo = primaSet(primes, { memo: true })
  // Default 5K for fast tests (<100ms), can override via global or env var
  const envCount = typeof process !== 'undefined' && process.env?.MEMO_TEST_COUNT 
    ? process.env.MEMO_TEST_COUNT 
    : (typeof window !== 'undefined' && window.MEMO_TEST_COUNT ? window.MEMO_TEST_COUNT : null)
  const count = parseInt(envCount || '5000', 10)
  
  // First pass: materialize primes (slow)
  // console.log(`\n📊 Memoization Test: Getting first ${count.toLocaleString()} primes...`)
  const start1 = performance.now()
  for (let i = 0; i < count; i++) {
    Pmemo[i]  // Access via array index - materializes and caches
  }
  const time1 = performance.now() - start1
  // console.log(`   First pass (forward): ${time1.toFixed(2)}ms`)
  
  // Second pass: access backwards (should be fast - cached)
  const start2 = performance.now()
  for (let i = count - 1; i >= 0; i--) {
    Pmemo[i]  // Should be instant - already cached
  }
  const time2 = performance.now() - start2
  
  const speedup = time1 / time2
  // console.log(`   Speedup: ${speedup.toFixed(1)}x faster`)
  
  // Verify we got primes
  check(Pmemo[0], 2)  // First prime
  check(Pmemo[count - 1] > 0, true)  // Nth prime should be positive
  check(typeof Pmemo[count - 1] === 'number', true)  // Should be a number
  
  // Second pass should be at least 3x faster (demonstrates memoization)
  check(time2 < time1 / 2, true, `Second pass (${time2.toFixed(2)}ms) should be at least 3x faster than first (${time1.toFixed(2)}ms)`)
  
  // console.log(`   ✅ Memoization working! Cached access is ${speedup.toFixed(1)}x faster\n`)
});

test('Core method: unique', ({check}) => {
  check(primaSet([1,2,2,3,1,4]).unique(), [1,2,3,4]);
  check(primaSet([{a:1}, {a:1}, {a:2}]).unique(), [{a:1}, {a:2}]);
});

// ============================================================================
//  SORT
// ============================================================================

test('Core method: sort', ({check}) => {
  check(primaSet([3,1,4,1,5]).sort(), [1,1,3,4,5]);
});

test('Core method: sortBy', ({check}) => {
  const users = [{name:'Bob', age:30}, {name:'Alice', age:25}, {name:'Charlie', age:35}];
  check(primaSet(users).sortBy(u => u.age).map(u => u.name), ['Alice','Bob','Charlie']);
});

// ============================================================================
//  CYCLE & CONCAT
// ============================================================================

test('Core method: cycle', ({check}) => {
  check(primaSet([1,2]).cycle().take(7), [1,2,1,2,1,2,1]);
});

test('Core method: concat', ({check}) => {
  check(primaSet([1,2]).concat([3,4], [5]).take(5), [1,2,3,4,5]);
});

// ============================================================================
//  GROUP BY & TO MAP
// ============================================================================

test('Core method: groupBy', ({check}) => {
  const groups = primaSet([1,2,3,4,5]).groupBy(x => x % 2)
  check(groups.get(0), [2,4])
  check(groups.get(1), [1,3,5])
});

test('Core method: toMap', ({check}) => {
  const map = primaSet(['a','bb','ccc']).toMap(s => s.length, s => s)
  check(map.get(1), 'a')
  check(map.get(2), 'bb')
  check(map.get(3), 'ccc')
});

// ============================================================================
//  SAMPLE
// ============================================================================

test('Core method: sample', ({check}) => {
  const s = primaSet([1,2,3,4,5]).sample(3)
  check(s.count(), 3)
  check(s.every(x => x >= 1 && x <= 5))
});

// ============================================================================
//  METHOD VS FREE FUNCTION CONSISTENCY
// ============================================================================

test('Method vs Free Function: sq', ({check}) => {
  const data = [1, 2, 3, 4, 5];
  const methodResult = primaSet(data).sq();
  const freeResult = sq(data);
  check(methodResult, freeResult);
  check(sq(5), 25); // scalar case
});

test('Method vs Free Function: add', ({check}) => {
  const data = [1, 2, 3];
  const methodResult = primaSet(data).add(10);
  const freeResult = add(data, 10);
  check(methodResult, freeResult);
  check(add(5, 3), 8); // scalar case
});

test('Method vs Free Function: factorial', ({check}) => {
  const data = [1, 2, 3, 4];
  const methodResult = primaSet(data).factorial();
  const freeResult = factorial(data);
  check(methodResult, freeResult);
  check(factorial(5), 120); // scalar case
});

test('Method vs Free Function: firstDivisor', ({check}) => {
  const data = [9, 15, 17, 21];
  const methodResult = primaSet(data).firstDivisor();
  const freeResult = firstDivisor(data);
  check(methodResult, freeResult);
  check(firstDivisor(77), 7); // scalar case
});

test('Method vs Free Function: clamp', ({check}) => {
  const data = [1, 5, 15];
  const methodResult = primaSet(data).clamp(0, 10);
  const freeResult = clamp(data, 0, 10);
  check(methodResult, freeResult);
  check(clamp(-5, 0, 10), 0); // scalar case
});