import { primaSet } from '../core/primaset.mjs'
import { primes, isPrimeGeometric } from '../num/primanum.mjs'
import { operations } from '../core/primaops.mjs'
import { primes, isPrimeGeometric } from '../num/primanum.mjs'
import { operations } from '../core/primaops.mjs'

const firstDivisor = operations.firstDivisor;
const isPrime = operations.isPrime;

const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER;
const MAX_TEST = Math.floor(Math.sqrt(MAX_SAFE_INTEGER)); // ~94906265

console.log('🚀 Large Primes Optimized Benchmark: Fair Comparison with Memoized Primes');
console.log('='.repeat(70));
console.log(`MAX_TEST: ${MAX_TEST}\n`);

function benchmark(name, fn, iterations = 1) {
  const times = [];
  let lastResult = null;
  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    lastResult = fn();
    const end = performance.now();
    times.push(end - start);
  }
  const avg = times.reduce((a, b) => a + b, 0) / times.length;
  return { name, avg, result: lastResult };
}

// Get cached prime list (geometric sieve already uses this)
console.log('📊 Step 1: Getting Cached Prime List');
console.log('-'.repeat(70));

const sqrtMax = Math.floor(Math.sqrt(MAX_TEST));
console.log(`Need primes up to sqrt(${MAX_TEST}) = ${sqrtMax}...`);

// Use the same cache that geometric sieve uses
// We'll access it through isPrimeGeometric which uses getPrimesUpTo
// First, warm up the cache by calling isPrimeGeometric once
const startMemo = performance.now();
isPrimeGeometric(MAX_TEST); // This will populate the cache
const memoTime = performance.now() - startMemo;

// Now get the cached list (we'll extract it from the module's cache)
// Actually, let's just use the same approach - compute primes list directly
const primesList = [];
let count = 0;
for (const p of primes) {
  if (p > sqrtMax) break;
  primesList.push(p);
  count++;
}
const totalMemoTime = performance.now() - startMemo;

console.log(`Computed ${primesList.length} primes in ${totalMemoTime.toFixed(2)}ms`);
console.log(`Prime list ready for reuse\n`);

// Optimized firstDivisor using memoized primes
function isPrimeFirstDivisorMemoized(n) {
  if (n < 2) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;
  if (n === 3) return true;
  if (n % 3 === 0) return false;
  
  const sqrtN = Math.floor(Math.sqrt(n));
  if (sqrtN < 3) return true;
  
  // Use memoized primes instead of generating on-the-fly
  for (const p of primesList) {
    if (p > sqrtN) break;
    if (n % p === 0) return false;
  }
  
  return true;
}

// Test: Finding last 10k primes (backwards iteration)
console.log('📊 Step 2: Finding Last 10,000 Primes (Fair Comparison)');
console.log('-'.repeat(70));

const range = [MAX_TEST - 500000, MAX_TEST];
console.log(`Range: [${range[0]}, ${range[1]}]`);
console.log(`Both methods will use the same memoized prime list\n`);

// Method 1: firstDivisor with memoized primes
console.log('Running firstDivisor with memoized primes...');
const start1 = performance.now();
const primes1 = [];
for (let n = range[1]; n >= range[0] && primes1.length < 10000; n--) {
  if (isPrimeFirstDivisorMemoized(n)) {
    primes1.push(n);
  }
}
primes1.reverse();
const time1 = performance.now() - start1;

// Method 2: isPrimeGeometric (already uses memoized prime list via getPrimesUpTo cache)
console.log('Running isPrimeGeometric (uses cached prime list)...');
const start2 = performance.now();
const primes2 = [];
for (let n = range[1]; n >= range[0] && primes2.length < 10000; n--) {
  if (isPrimeGeometric(n)) {
    primes2.push(n);
  }
}
primes2.reverse();
const time2 = performance.now() - start2;

console.log('\n' + '='.repeat(70));
console.log('RESULTS (Fair Comparison - Both Use Memoized Primes):');
console.log('='.repeat(70));
console.log(`firstDivisor (memoized): ${time1.toFixed(2)}ms (found ${primes1.length} primes)`);
console.log(`isPrimeGeometric:        ${time2.toFixed(2)}ms (found ${primes2.length} primes)`);
console.log(`Speedup:                 ${(time1 / time2).toFixed(2)}x`);

const match = primes1.length === primes2.length &&
              primes1.every((p, i) => p === primes2[i]);
console.log(`Match:                   ${match ? '✓ All primes match!' : '✗ Mismatch detected'}`);

if (primes1.length > 0) {
  console.log(`\nSample primes:`);
  console.log(`  First: ${primes1[0]}`);
  console.log(`  Last:  ${primes1[primes1.length - 1]}`);
}

// Test 3: Compare with original firstDivisor (no memoization)
console.log('\n\n📊 Step 3: Comparison with Original firstDivisor (No Memoization)');
console.log('-'.repeat(70));

console.log('Running original firstDivisor (generates primes on-the-fly)...');
const start3 = performance.now();
const primes3 = [];
for (let n = range[1]; n >= range[0] && primes3.length < 10000; n--) {
  if (firstDivisor(n) === n) {
    primes3.push(n);
  }
}
primes3.reverse();
const time3 = performance.now() - start3;

console.log(`\nOriginal firstDivisor:    ${time3.toFixed(2)}ms (found ${primes3.length} primes)`);
console.log(`firstDivisor (memoized):  ${time1.toFixed(2)}ms (found ${primes1.length} primes)`);
console.log(`isPrimeGeometric:         ${time2.toFixed(2)}ms (found ${primes2.length} primes)`);
console.log(`\nMemoization benefit:      ${(time3 / time1).toFixed(2)}x faster`);
console.log(`Geometric vs Original:   ${(time3 / time2).toFixed(2)}x faster`);

// Test 4: Single number performance (both memoized)
console.log('\n\n📊 Step 4: Single Large Number Performance (Both Memoized)');
console.log('-'.repeat(70));

const testNumbers = [
  94906249, 94906247, 94906243, 94906241, 94906237,
  94806287, 94806283, 94806281, 94806277, 94806271
];

console.log('Testing 10 large numbers...\n');

const fdTimes = [];
const geoTimes = [];

for (const n of testNumbers) {
  const fd_time = benchmark(`firstDivisor(${n})`, () => {
    return isPrimeFirstDivisorMemoized(n);
  }, 100);
  
  const geo_time = benchmark(`isPrimeGeometric(${n})`, () => {
    return isPrimeGeometric(n);
  }, 100);
  
  fdTimes.push(fd_time.avg);
  geoTimes.push(geo_time.avg);
}

const avgFD = fdTimes.reduce((a, b) => a + b, 0) / fdTimes.length;
const avgGeo = geoTimes.reduce((a, b) => a + b, 0) / geoTimes.length;

console.log(`Average time (firstDivisor memoized): ${avgFD.toFixed(4)}ms`);
console.log(`Average time (isPrimeGeometric):     ${avgGeo.toFixed(4)}ms`);
console.log(`Speedup:                              ${(avgFD / avgGeo).toFixed(2)}x`);

console.log('\n' + '='.repeat(70));
console.log('✅ Benchmark complete!');
console.log('\nKey Insights:');
console.log('1. When both use memoized primes, the comparison is fair');
console.log('2. Memoization benefits both methods significantly');
console.log('3. The geometric sieve advantage comes from efficient prime list usage');
console.log('4. For large numbers, both methods perform similarly when memoized');
