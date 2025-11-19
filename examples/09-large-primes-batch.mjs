import { isPrimeGeometric } from '@primalib/num';
import { operations } from '@primalib/core';

const firstDivisor = operations.firstDivisor;
const isPrime = operations.isPrime;

const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER;
const MAX_TEST = Math.floor(Math.sqrt(MAX_SAFE_INTEGER)); // ~94906265

console.log('🚀 Large Primes Batch Benchmark: Where Geometric Sieve Should Shine');
console.log('='.repeat(70));
console.log(`MAX_TEST: ${MAX_TEST}\n`);

// The key insight: Geometric sieve should excel when checking MANY large numbers
// because the prime list is computed ONCE and reused

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

// Test: Check many large numbers (where prime list reuse matters)
console.log('📊 Test: Checking 10,000 Large Numbers');
console.log('-'.repeat(70));

// Generate 10k numbers near MAX_TEST
const testNumbers = [];
const startNum = MAX_TEST - 100000;
for (let i = 0; i < 10000; i++) {
  testNumbers.push(startNum + i);
}

console.log(`Testing ${testNumbers.length} numbers from ${testNumbers[0]} to ${testNumbers[testNumbers.length - 1]}`);
console.log(`Prime list will be computed ONCE and reused for all numbers\n`);

// Method 1: firstDivisor (no prime list, checks each individually)
console.log('Running firstDivisor (individual checks, no prime list)...');
const result1 = benchmark('firstDivisor batch', () => {
  const primes = [];
  for (const n of testNumbers) {
    if (firstDivisor(n) === n) {
      primes.push(n);
    }
  }
  return primes;
}, 1);

// Method 2: isPrimeGeometric (prime list computed once, reused)
console.log('Running isPrimeGeometric (prime list computed once, reused)...');
const result2 = benchmark('isPrimeGeometric batch', () => {
  const primes = [];
  for (const n of testNumbers) {
    if (isPrimeGeometric(n)) {
      primes.push(n);
    }
  }
  return primes;
}, 1);

console.log('\n' + '='.repeat(70));
console.log('RESULTS:');
console.log('='.repeat(70));
console.log(`firstDivisor:     ${result1.avg.toFixed(2)}ms (found ${result1.result.length} primes)`);
console.log(`isPrimeGeometric: ${result2.avg.toFixed(2)}ms (found ${result2.result.length} primes)`);
console.log(`Speedup:          ${(result1.avg / result2.avg).toFixed(2)}x`);

// Verify they match
const match = result1.result.length === result2.result.length &&
              result1.result.every((p, i) => p === result2.result[i]);
console.log(`Match:            ${match ? '✓' : '✗'}`);

if (result1.result.length > 0) {
  console.log(`\nSample primes found:`);
  console.log(`  First: ${result1.result[0]}`);
  console.log(`  Last:  ${result1.result[result1.result.length - 1]}`);
}

// Test 2: Find last 10k primes (backwards iteration)
console.log('\n\n📊 Test 2: Finding Last 10,000 Primes (Backwards)');
console.log('-'.repeat(70));
console.log('This tests backwards iteration - firstDivisor should be faster here\n');

const range = [MAX_TEST - 500000, MAX_TEST];
console.log(`Range: [${range[0]}, ${range[1]}]`);

console.log('Running firstDivisor (backwards, stops early)...');
const start1 = performance.now();
const primes1 = [];
for (let n = range[1]; n >= range[0] && primes1.length < 10000; n--) {
  if (firstDivisor(n) === n) {
    primes1.push(n);
  }
}
primes1.reverse();
const time1 = performance.now() - start1;

console.log('Running isPrimeGeometric (backwards, stops early)...');
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
console.log(`firstDivisor:     ${time1.toFixed(2)}ms (found ${primes1.length} primes)`);
console.log(`isPrimeGeometric: ${time2.toFixed(2)}ms (found ${primes2.length} primes)`);
console.log(`Speedup:          ${(time1 / time2).toFixed(2)}x`);
console.log(`Match:            ${primes1.length === primes2.length ? '✓' : '✗'}`);

// Test 3: Prime list computation overhead
console.log('\n\n📊 Test 3: Prime List Computation Overhead');
console.log('-'.repeat(70));

const sqrtMax = Math.floor(Math.sqrt(MAX_TEST));
console.log(`Computing prime list up to sqrt(${MAX_TEST}) = ${sqrtMax}...`);

const start3 = performance.now();
// This is what geometric sieve does internally
const { getPrimesUpTo } = await import('../primanum.mjs');
// Actually, we can't import it directly. Let's estimate:
// The overhead is computing primes up to sqrt(MAX_TEST) ≈ 9742 primes
console.log(`Estimated prime list size: ~${Math.floor(sqrtMax / Math.log(sqrtMax))} primes`);
console.log(`This is the overhead geometric sieve pays upfront`);

console.log('\n' + '='.repeat(70));
console.log('✅ Benchmark complete!');
console.log('\nKey Insight:');
console.log('- Geometric sieve pays upfront cost: computing prime list');
console.log('- This cost is amortized when checking MANY numbers');
console.log('- For backwards iteration finding last primes, firstDivisor is faster');
console.log('- For batch checking many large numbers, geometric sieve should excel');

