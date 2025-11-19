/**
 * Example 8: firstDivisor Algorithm Comparison
 * 
 * Compares different firstDivisor implementations to find the fastest one.
 * Tests with primes up to 1M.
 */

console.log('🌟 PrimaSet: firstDivisor Algorithm Comparison\n')

// ============================================================================
// Algorithm 1: Increment by 2 (check odd numbers only)
// ============================================================================

function firstDivisor_v1(n) {
  if (n < 2) return n;
  if (n % 2 === 0) return 2;
  const sq = Math.trunc(Math.sqrt(n));
  for (let d = 3; d <= sq; d += 2) {
    if (n % d === 0) return d;
  }
  return n;
}

// ============================================================================
// Algorithm 2: Increment by 6 (current implementation from primaops.mjs)
// ============================================================================

function firstDivisor_v2(n) {
  if (n < 2) return n;
  if (n % 2 === 0) return 2;
  if (n % 3 === 0) return 3;
  let sq = Math.trunc(Math.sqrt(n));
  for (let d = 5; d <= sq; d += 6) {
    if (n % d === 0) return d;
    const d2 = d + 2;
    if (d2 <= sq && n % d2 === 0) return d2;
  }
  return n;
}

// ============================================================================
// Algorithm 2b: Increment by 6 (avoid d2 variable creation)
// ============================================================================

function firstDivisor_v2b(n) {
  if (n < 2) return n;
  if (n % 2 === 0) return 2;
  if (n % 3 === 0) return 3;
  const sq = Math.trunc(Math.sqrt(n));
  for (let d = 5; d <= sq; d += 6) {
    if (n % d === 0) return d;
    if (d + 2 <= sq && n % (d + 2) === 0) return d + 2;
  }
  return n;
}

// ============================================================================
// Algorithm 3: Increment by 6 (optimized - avoid d2 check if not needed)
// ============================================================================

function firstDivisor_v3(n) {
  if (n < 2) return n;
  if (n % 2 === 0) return 2;
  if (n % 3 === 0) return 3;
  const sq = Math.trunc(Math.sqrt(n));
  for (let d = 5; d <= sq; d += 6) {
    if (n % d === 0) return d;
    if (n % (d + 2) === 0) return d + 2;
  }
  return n;
}

// ============================================================================
// Algorithm 4: Increment by 2 (with early sqrt optimization)
// ============================================================================

function firstDivisor_v4(n) {
  if (n < 2) return n;
  if (n % 2 === 0) return 2;
  const limit = Math.trunc(Math.sqrt(n));
  for (let d = 3; d <= limit; d += 2) {
    if (n % d === 0) return d;
  }
  return n;
}

// ============================================================================
// Algorithm 5: Increment by 6 (with explicit 6k±1 pattern)
// ============================================================================

function firstDivisor_v5(n) {
  if (n < 2) return n;
  if (n % 2 === 0) return 2;
  if (n % 3 === 0) return 3;
  const limit = Math.trunc(Math.sqrt(n));
  // Check 6k-1 and 6k+1 pattern: 5, 7, 11, 13, 17, 19, ...
  for (let k = 1; ; k++) {
    const d1 = 6 * k - 1;  // 5, 11, 17, 23, ...
    if (d1 > limit) break;
    if (n % d1 === 0) return d1;
    
    const d2 = 6 * k + 1;  // 7, 13, 19, 25, ...
    if (d2 > limit) break;
    if (n % d2 === 0) return d2;
  }
  return n;
}

// ============================================================================
// Algorithm 6: Increment by 30 (wheel factorization - check 30k±1,±7,±11,±13)
// ============================================================================

function firstDivisor_v6(n) {
  if (n < 2) return n;
  if (n % 2 === 0) return 2;
  if (n % 3 === 0) return 3;
  if (n % 5 === 0) return 5;
  const limit = Math.trunc(Math.sqrt(n));
  // Only check numbers coprime to 30: 7, 11, 13, 17, 19, 23, 29, 31 (mod 30)
  const offsets = [7, 11, 13, 17, 19, 23, 29, 31];
  for (let base = 0; base <= limit; base += 30) {
    for (const offset of offsets) {
      const d = base + offset;
      if (d > limit) break;
      if (n % d === 0) return d;
    }
  }
  return n;
}

// ============================================================================
// Test: Sum primes up to maxPrime using a specific firstDivisor function
// ============================================================================

function sumPrimesWithAlgorithm(maxPrime, firstDivisorFn, label) {
  let sum = 0;
  let count = 0;
  
  for (let n = 2; n <= maxPrime; n++) {
    if (firstDivisorFn(n) === n) {
      sum += n;
      count++;
    }
  }
  
  return { sum, count, label };
}

// ============================================================================
// Performance Comparison
// ============================================================================

const maxPrime = 1000000; // 1M
const algorithms = [
  { fn: firstDivisor_v1, label: 'Increment by 2 (odd only)' },
  { fn: firstDivisor_v2, label: 'Increment by 6 (current - 6k±1)' },
  { fn: firstDivisor_v2b, label: 'Increment by 6 (no d2 variable)' },
  { fn: firstDivisor_v3, label: 'Increment by 6 (optimized)' },
  { fn: firstDivisor_v4, label: 'Increment by 2 (sqrt optimized)' },
  { fn: firstDivisor_v5, label: 'Increment by 6 (explicit 6k±1)' },
  { fn: firstDivisor_v6, label: 'Wheel 30 (30k±offsets)' }
];

console.log(`📊 Comparing firstDivisor algorithms for primes up to ${maxPrime.toLocaleString()}:\n`);

const results = [];

for (const { fn, label } of algorithms) {
  console.log(`\n🔍 Testing: ${label}`);
  const start = performance.now();
  const result = sumPrimesWithAlgorithm(maxPrime, fn, label);
  const time = performance.now() - start;
  
  result.time = time;
  results.push(result);
  
  console.log(`   Time: ${time.toFixed(2)}ms`);
  console.log(`   Primes found: ${result.count.toLocaleString()}`);
  console.log(`   Sum: ${result.sum.toLocaleString()}`);
}

// Find fastest
results.sort((a, b) => a.time - b.time);
const fastest = results[0];

console.log(`\n\n📈 Results Summary:`);
console.log(`\n   Fastest: ${fastest.label} (${fastest.time.toFixed(2)}ms)`);
console.log(`\n   All algorithms:`);
results.forEach((r, i) => {
  const speedup = r.time / fastest.time;
  const rank = i + 1;
  console.log(`   ${rank}. ${r.label.padEnd(40)} ${r.time.toFixed(2).padStart(8)}ms  (${speedup.toFixed(2)}x)`);
});

// Verify all algorithms produce the same result
const referenceSum = results[0].sum;
const referenceCount = results[0].count;
const allMatch = results.every(r => r.sum === referenceSum && r.count === referenceCount);

if (allMatch) {
  console.log(`\n   ✅ All algorithms produce the same result!`);
  console.log(`      Sum: ${referenceSum.toLocaleString()}`);
  console.log(`      Count: ${referenceCount.toLocaleString()}`);
} else {
  console.log(`\n   ⚠️  Results differ!`);
  results.forEach(r => {
    console.log(`      ${r.label}: sum=${r.sum}, count=${r.count}`);
  });
}

console.log('\n✅ Algorithm comparison complete!');

