import { geometricSieve, isPrimeGeometric } from 'primalib';
import { operations } from 'primalib';

const firstDivisor = operations.firstDivisor;
const isPrime = operations.isPrime;

const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER; // 2^53 - 1 = 9007199254740991
const MAX_TEST = Math.floor(Math.sqrt(MAX_SAFE_INTEGER)); // ~94906265

console.log('🚀 Large Primes Benchmark: Finding Last 10k Primes Near MAX_SAFE_INTEGER');
console.log('='.repeat(70));
console.log(`MAX_SAFE_INTEGER: ${MAX_SAFE_INTEGER}`);
console.log(`MAX_TEST (sqrt): ${MAX_TEST}`);
console.log(`Target: Find last 10,000 primes near MAX_SAFE_INTEGER\n`);

// Estimate range needed for 10k primes
// Prime density near n is approximately 1 / ln(n)
// For n ≈ 9e15, density ≈ 1 / ln(9e15) ≈ 1 / 36.5 ≈ 0.027
// So we need roughly 10,000 / 0.027 ≈ 370,000 numbers
// But we'll test a smaller range first to see performance

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
  const min = Math.min(...times);
  const max = Math.max(...times);
  return { name, avg, min, max, result: lastResult };
}

// Find primes in a range using firstDivisor
function findPrimesFirstDivisor(start, end, limit = Infinity) {
  const primes = [];
  for (let n = end; n >= start && primes.length < limit; n--) {
    if (firstDivisor(n) === n) {
      primes.push(n);
    }
  }
  return primes.reverse(); // Return in ascending order
}

// Find primes in a range using geometric sieve
function findPrimesGeometric(start, end, limit = Infinity) {
  const sieve = geometricSieve(start, end);
  const primes = [];
  // Iterate backwards through sieve results
  const allPrimes = [...sieve];
  for (let i = allPrimes.length - 1; i >= 0 && primes.length < limit; i--) {
    primes.push(allPrimes[i]);
  }
  return primes.reverse(); // Return in ascending order
}

// Test 1: Find last 100 primes near MAX_TEST
console.log('📊 Test 1: Last 100 primes near sqrt(MAX_SAFE_INTEGER)');
console.log('-'.repeat(70));

const testRange1 = [MAX_TEST - 100000, MAX_TEST];
console.log(`Range: [${testRange1[0]}, ${testRange1[1]}]`);

const result1_fd = benchmark('firstDivisor (last 100)', () => {
  return findPrimesFirstDivisor(testRange1[0], testRange1[1], 100);
}, 1);

const result1_geo = benchmark('geometricSieve (last 100)', () => {
  return findPrimesGeometric(testRange1[0], testRange1[1], 100);
}, 1);

console.log(`\nfirstDivisor: ${result1_fd.avg.toFixed(2)}ms (found ${result1_fd.result.length} primes)`);
console.log(`geometric:    ${result1_geo.avg.toFixed(2)}ms (found ${result1_geo.result.length} primes)`);
console.log(`Speedup:      ${(result1_fd.avg / result1_geo.avg).toFixed(2)}x`);
console.log(`Match:        ${result1_fd.result.length === result1_geo.result.length ? '✓' : '✗'}`);
if (result1_fd.result.length > 0 && result1_geo.result.length > 0) {
  console.log(`Last prime (FD):  ${result1_fd.result[result1_fd.result.length - 1]}`);
  console.log(`Last prime (Geo): ${result1_geo.result[result1_geo.result.length - 1]}`);
}

// Test 2: Find last 1000 primes in larger range
console.log('\n📊 Test 2: Last 1000 primes in larger range');
console.log('-'.repeat(70));

const testRange2 = [MAX_TEST - 1000000, MAX_TEST];
console.log(`Range: [${testRange2[0]}, ${testRange2[1]}]`);

const result2_fd = benchmark('firstDivisor (last 1000)', () => {
  return findPrimesFirstDivisor(testRange2[0], testRange2[1], 1000);
}, 1);

const result2_geo = benchmark('geometricSieve (last 1000)', () => {
  return findPrimesGeometric(testRange2[0], testRange2[1], 1000);
}, 1);

console.log(`\nfirstDivisor: ${result2_fd.avg.toFixed(2)}ms (found ${result2_fd.result.length} primes)`);
console.log(`geometric:    ${result2_geo.avg.toFixed(2)}ms (found ${result2_geo.result.length} primes)`);
console.log(`Speedup:      ${(result2_fd.avg / result2_geo.avg).toFixed(2)}x`);
console.log(`Match:        ${result2_fd.result.length === result1_geo.result.length ? '✓' : '✗'}`);

// Test 3: Single large number performance
console.log('\n📊 Test 3: Single Large Number Performance');
console.log('-'.repeat(70));

const largePrimes = [
  94906249,  // Large prime < sqrt(2^53)
  94906247,
  94906243,
  94906241,
  94906237
];

for (const n of largePrimes) {
  if (n > MAX_TEST) continue;
  
  const fd_time = benchmark(`firstDivisor(${n})`, () => {
    return firstDivisor(n) === n;
  }, 100);
  
  const geo_time = benchmark(`isPrimeGeometric(${n})`, () => {
    return isPrimeGeometric(n);
  }, 100);
  
  console.log(`\nn = ${n}:`);
  console.log(`  firstDivisor: ${fd_time.avg.toFixed(4)}ms`);
  console.log(`  geometric:    ${geo_time.avg.toFixed(4)}ms`);
  console.log(`  Speedup:      ${(fd_time.avg / geo_time.avg).toFixed(2)}x`);
  console.log(`  Match:        ${fd_time.result === geo_time.result ? '✓' : '✗'}`);
}

// Test 4: Finding last 10k primes (this will take time!)
console.log('\n📊 Test 4: Finding Last 10,000 Primes (Large Range)');
console.log('-'.repeat(70));
console.log('⚠️  This may take several minutes...\n');

// Estimate: For 10k primes near MAX_TEST, we need roughly:
// Density ≈ 1/ln(MAX_TEST) ≈ 1/18.4 ≈ 0.054
// Range needed ≈ 10,000 / 0.054 ≈ 185,000 numbers
// But let's use a larger range to be safe
const rangeFor10k = [MAX_TEST - 500000, MAX_TEST];
console.log(`Range: [${rangeFor10k[0]}, ${rangeFor10k[1]}] (${rangeFor10k[1] - rangeFor10k[0]} numbers)`);

console.log('\nRunning firstDivisor method...');
const start_fd = performance.now();
const primes_fd = findPrimesFirstDivisor(rangeFor10k[0], rangeFor10k[1], 10000);
const time_fd = performance.now() - start_fd;

console.log(`\nRunning geometric sieve method...`);
const start_geo = performance.now();
const primes_geo = findPrimesGeometric(rangeFor10k[0], rangeFor10k[1], 10000);
const time_geo = performance.now() - start_geo;

console.log('\n' + '='.repeat(70));
console.log('RESULTS:');
console.log('='.repeat(70));
console.log(`firstDivisor: ${time_fd.toFixed(2)}ms (found ${primes_fd.length} primes)`);
console.log(`geometric:    ${time_geo.toFixed(2)}ms (found ${primes_geo.length} primes)`);
console.log(`Speedup:      ${(time_fd / time_geo).toFixed(2)}x`);

if (primes_fd.length > 0 && primes_geo.length > 0) {
  console.log(`\nFirst prime found (FD):  ${primes_fd[0]}`);
  console.log(`First prime found (Geo): ${primes_geo[0]}`);
  console.log(`Last prime found (FD):   ${primes_fd[primes_fd.length - 1]}`);
  console.log(`Last prime found (Geo):  ${primes_geo[primes_geo.length - 1]}`);
  
  // Verify they match
  const match = primes_fd.length === primes_geo.length &&
                primes_fd.every((p, i) => p === primes_geo[i]);
  console.log(`\nMatch: ${match ? '✓ All primes match!' : '✗ Mismatch detected'}`);
  
  if (!match && primes_fd.length === primes_geo.length) {
    // Find first mismatch
    for (let i = 0; i < Math.min(primes_fd.length, primes_geo.length); i++) {
      if (primes_fd[i] !== primes_geo[i]) {
        console.log(`First mismatch at index ${i}: FD=${primes_fd[i]}, Geo=${primes_geo[i]}`);
        break;
      }
    }
  }
}

console.log('\n' + '='.repeat(70));
console.log('✅ Benchmark complete!');

