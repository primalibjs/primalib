import { geometricSieve, isPrimeGeometric, primes } from '../../num/primanum.mjs'
import { operations } from '../../core/primaops.mjs'
import { operations } from '../../core/primaops.mjs'

const firstDivisor = operations.firstDivisor;
const isPrime = operations.isPrime;

// Maximum safe integer in JavaScript
const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER; // 2^53 - 1
const MAX_TEST = Math.floor(Math.sqrt(MAX_SAFE_INTEGER)); // ~9.5e7

// Test numbers at various scales
const testNumbers = [
  // Small numbers
  2, 3, 5, 7, 11, 13, 17, 19, 23, 29,
  4, 6, 8, 9, 10, 12, 14, 15, 16, 18,
  
  // Medium numbers
  101, 103, 107, 109, 113, 127, 131, 137, 139, 149,
  100, 102, 104, 105, 106, 108, 110, 111, 112, 114,
  
  // Large numbers (1k - 10k)
  1009, 1013, 1019, 1021, 1031, 1033, 1039, 1049, 1051, 1061,
  1000, 1002, 1004, 1005, 1006, 1008, 1010, 1011, 1012, 1014,
  
  // Very large numbers (10k - 100k)
  10007, 10009, 10037, 10039, 10061, 10067, 10069, 10079, 10091, 10093,
  10000, 10002, 10004, 10005, 10006, 10008, 10010, 10011, 10012, 10014,
  
  // Huge numbers (100k - 1M)
  100003, 100019, 100043, 100049, 100057, 100069, 100103, 100109, 100129, 100151,
  100000, 100002, 100004, 100005, 100006, 100008, 100010, 100011, 100012, 100014,
  
  // Very huge numbers (1M - 10M)
  1000003, 1000033, 1000037, 1000039, 1000081, 1000099, 1000117, 1000121, 1000133, 1000151,
  1000000, 1000002, 1000004, 1000005, 1000006, 1000008, 1000010, 1000011, 1000012, 1000014,
  
  // Extreme numbers (10M - 100M)
  10000019, 10000079, 10000103, 10000121, 10000139, 10000141, 10000169, 10000189, 10000223, 10000241,
  10000000, 10000002, 10000004, 10000005, 10000006, 10000008, 10000010, 10000011, 10000012, 10000014,
  
  // Large numbers within sqrt(MAX_SAFE_INTEGER)
  94906249,  // Large prime < sqrt(2^53)
  94906250,  // Composite < sqrt(2^53)
];

// Benchmark function
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
  return { name, avg, min, max, times, result: lastResult };
}

// Test primality for a single number
function testPrimality(n, method) {
  try {
    return method(n);
  } catch (e) {
    return { error: e.message };
  }
}

// Compare methods for a single number
function compareMethods(n) {
  const firstDivisorResult = testPrimality(n, (n) => firstDivisor(n) === n);
  const isPrimeResult = testPrimality(n, isPrime);
  const geometricResult = testPrimality(n, isPrimeGeometric);
  
  return {
    n,
    firstDivisor: firstDivisorResult,
    isPrime: isPrimeResult,
    geometric: geometricResult,
    match: firstDivisorResult === geometricResult && isPrimeResult === geometricResult
  };
}

// Benchmark single number tests
function benchmarkSingleNumber(n, iterations = 100) {
  const results = {
    n,
    firstDivisor: benchmark(`firstDivisor(${n})`, () => firstDivisor(n) === n, iterations),
    isPrime: benchmark(`isPrime(${n})`, () => isPrime(n), iterations),
    geometric: benchmark(`isPrimeGeometric(${n})`, () => isPrimeGeometric(n), iterations)
  };
  
  // Verify all methods agree
  const fdResult = firstDivisor(n) === n;
  const ipResult = isPrime(n);
  const geoResult = isPrimeGeometric(n);
  
  results.accuracy = {
    firstDivisor: fdResult,
    isPrime: ipResult,
    geometric: geoResult,
    allMatch: fdResult === ipResult && ipResult === geoResult
  };
  
  return results;
}

// Benchmark range sieving
function benchmarkRange(start, end, iterations = 1) {
  console.log(`\n📊 Benchmarking range [${start}, ${end}]...`);
  
  // FirstDivisor method (traditional)
  const firstDivisorTime = benchmark('firstDivisor range', () => {
    const result = [];
    for (let n = start; n <= end; n++) {
      if (n < 2) continue;
      if (firstDivisor(n) === n) result.push(n);
    }
    return result;
  }, iterations);
  
  // Geometric sieve
  const geometricTime = benchmark('geometricSieve range', () => {
    const sieve = geometricSieve(start, end);
    return [...sieve];
  }, iterations);
  
  // Verify results match
  const fdPrimes = [];
  for (let n = start; n <= end; n++) {
    if (n < 2) continue;
    if (firstDivisor(n) === n) fdPrimes.push(n);
  }
  
  const geoPrimes = [...geometricSieve(start, end)];
  
  const match = fdPrimes.length === geoPrimes.length && 
                fdPrimes.every((p, i) => p === geoPrimes[i]);
  
  return {
    range: [start, end],
    firstDivisor: {
      time: firstDivisorTime.avg,
      count: fdPrimes.length,
      primes: fdPrimes.slice(0, 10) // First 10 for verification
    },
    geometric: {
      time: geometricTime.avg,
      count: geoPrimes.length,
      primes: geoPrimes.slice(0, 10)
    },
    match,
    speedup: firstDivisorTime.avg / geometricTime.avg
  };
}

// Benchmark prime generation (1 to 100k primes)
function benchmarkPrimeGeneration(count = 100000) {
  console.log(`\n📊 Benchmarking prime generation (first ${count} primes)...`);
  
  // Traditional method using firstDivisor
  const traditionalTime = benchmark('traditional primes', () => {
    const result = [];
    let n = 2;
    while (result.length < count) {
      if (firstDivisor(n) === n) {
        result.push(n);
      }
      n++;
    }
    return result;
  }, 1);
  
  // Using geometric sieve (generate range and take first count)
  // Estimate range needed: prime(n) ≈ n * ln(n) + n * ln(ln(n))
  const estimatedMax = Math.ceil(count * (Math.log(count) + Math.log(Math.log(count))) * 1.3);
  
  const geometricTime = benchmark('geometric sieve primes', () => {
    const sieve = geometricSieve(2, estimatedMax);
    const primes = [];
    for (const p of sieve) {
      primes.push(p);
      if (primes.length >= count) break;
    }
    return primes;
  }, 1);
  
  // Verify results match
  const traditionalPrimes = [];
  let n = 2;
  while (traditionalPrimes.length < count) {
    if (firstDivisor(n) === n) {
      traditionalPrimes.push(n);
    }
    n++;
  }
  
  const geometricPrimes = [];
  const sieve = geometricSieve(2, estimatedMax);
  for (const p of sieve) {
    geometricPrimes.push(p);
    if (geometricPrimes.length >= count) break;
  }
  
  const match = traditionalPrimes.length === geometricPrimes.length &&
                traditionalPrimes.every((p, i) => p === geometricPrimes[i]);
  
  return {
    count,
    traditional: {
      time: traditionalTime.avg,
      lastPrime: traditionalPrimes[count - 1],
      primes: traditionalPrimes.slice(0, 10)
    },
    geometric: {
      time: geometricTime.avg,
      lastPrime: geometricPrimes[count - 1] || 'N/A',
      primes: geometricPrimes.slice(0, 10)
    },
    match,
    speedup: traditionalTime.avg / geometricTime.avg
  };
}

// Run all benchmarks
async function runBenchmarks() {
  console.log('🚀 Geometric Sieve Benchmark Suite');
  console.log('=' .repeat(60));
  console.log(`Max safe integer: ${MAX_SAFE_INTEGER}`);
  console.log(`Max test value: ${MAX_TEST}`);
  
  // 1. Accuracy test - verify all methods agree
  console.log('\n✅ Step 1: Accuracy Verification');
  console.log('-'.repeat(60));
  let accuracyPass = 0;
  let accuracyFail = 0;
  
  for (const n of testNumbers.slice(0, 50)) { // Test first 50 for speed
    const result = compareMethods(n);
    if (result.match) {
      accuracyPass++;
    } else {
      accuracyFail++;
      if (accuracyFail <= 5) { // Show first 5 failures
        console.log(`❌ Mismatch at n=${n}:`, result);
      }
    }
  }
  console.log(`✓ Accuracy: ${accuracyPass} passed, ${accuracyFail} failed`);
  
  // 2. Single number performance
  console.log('\n⚡ Step 2: Single Number Performance');
  console.log('-'.repeat(60));
  const singleNumberTests = [
    101, 1009, 10007, 100003, 1000003, 10000019
  ];
  
  for (const n of singleNumberTests) {
    const result = benchmarkSingleNumber(n, 100);
    console.log(`\nn = ${n}:`);
    console.log(`  firstDivisor: ${result.firstDivisor.avg.toFixed(4)}ms (min: ${result.firstDivisor.min.toFixed(4)}, max: ${result.firstDivisor.max.toFixed(4)})`);
    console.log(`  isPrime:      ${result.isPrime.avg.toFixed(4)}ms (min: ${result.isPrime.min.toFixed(4)}, max: ${result.isPrime.max.toFixed(4)})`);
    console.log(`  geometric:    ${result.geometric.avg.toFixed(4)}ms (min: ${result.geometric.min.toFixed(4)}, max: ${result.geometric.max.toFixed(4)})`);
    console.log(`  Speedup:      ${(result.firstDivisor.avg / result.geometric.avg).toFixed(2)}x`);
    console.log(`  Accuracy:     ${result.accuracy.allMatch ? '✓' : '✗'}`);
  }
  
  // 3. Range sieving performance
  console.log('\n📈 Step 3: Range Sieving Performance');
  console.log('-'.repeat(60));
  const ranges = [
    [1, 1000],
    [1, 10000],
    [1, 100000],
    [100000, 200000],
    [1000000, 1100000]
  ];
  
  for (const [start, end] of ranges) {
    const result = benchmarkRange(start, end, 1);
    console.log(`\nRange [${start}, ${end}]:`);
    console.log(`  firstDivisor: ${result.firstDivisor.time.toFixed(2)}ms (${result.firstDivisor.count} primes)`);
    console.log(`  geometric:    ${result.geometric.time.toFixed(2)}ms (${result.geometric.count} primes)`);
    console.log(`  Speedup:      ${result.speedup.toFixed(2)}x`);
    console.log(`  Match:        ${result.match ? '✓' : '✗'}`);
  }
  
  // 4. Prime generation (1 to 100k primes)
  console.log('\n🔢 Step 4: Prime Generation (1 to 100k primes)');
  console.log('-'.repeat(60));
  
  const primeCounts = [100, 1000, 10000, 100000];
  
  for (const count of primeCounts) {
    console.log(`\nGenerating first ${count} primes...`);
    const result = benchmarkPrimeGeneration(count);
    console.log(`  Traditional: ${result.traditional.time.toFixed(2)}ms (last: ${result.traditional.lastPrime})`);
    console.log(`  Geometric:   ${result.geometric.time.toFixed(2)}ms (last: ${result.geometric.lastPrime})`);
    console.log(`  Speedup:     ${result.speedup.toFixed(2)}x`);
    console.log(`  Match:       ${result.match ? '✓' : '✗'}`);
  }
  
  // 5. Large number tests (up to sqrt(2^53))
  console.log('\n🌌 Step 5: Large Number Tests (up to sqrt(2^53))');
  console.log('-'.repeat(60));
  
  const largeNumbers = [
    1000003,     // ~1 million
    10000019,    // ~10 million
    100000007,   // ~100 million
    94906249,    // Large prime < sqrt(2^53)
    94906250     // Composite < sqrt(2^53)
  ];
  
  for (const n of largeNumbers) {
    if (n > MAX_TEST) {
      console.log(`\n⚠️  Skipping n=${n} (exceeds sqrt(MAX_SAFE_INTEGER)=${MAX_TEST})`);
      continue;
    }
    
    try {
      const result = benchmarkSingleNumber(n, 10);
      console.log(`\nn = ${n}:`);
      console.log(`  firstDivisor: ${result.firstDivisor.avg.toFixed(4)}ms`);
      console.log(`  geometric:    ${result.geometric.avg.toFixed(4)}ms`);
      const speedup = result.firstDivisor.avg / result.geometric.avg;
      console.log(`  Speedup:      ${speedup.toFixed(2)}x`);
      console.log(`  Accuracy:     ${result.accuracy.allMatch ? '✓' : '✗'}`);
    } catch (e) {
      console.log(`\n⚠️  Error testing n=${n}: ${e.message}`);
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('✅ Benchmark suite complete!');
}

// Run benchmarks
runBenchmarks().catch(console.error);

