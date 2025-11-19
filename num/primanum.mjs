/**
 *  P R I M A N U M   v 0.6  - Hybrid Architecture Edition
 *  Sliding Window Cache meets 2D Power Space Geometry
 *  Plugin <-> FreeFunction symmetry through composition
 */

import { primaSet, operations, point, space, complex, quaternion, octonion } from "../core/primaset.mjs"

// Remove validate helper - use type system instead
// No more validate functions - rely on primaSet(typecheck)

// ============================================================================
// LAYER 0: FOUNDATION WITH HYBRID STRUCTURE
// ============================================================================

const N = (last = Infinity) => primaSet(function* () { 
  let n = 1
  while (n <= last) yield n++
})

const Z = (first = 0, last = Infinity) => primaSet(function* () { 
  let n = first
  while (n <= last) yield n++
})

const R = (start = 0, end = 1, digits = 2) => {
  const step = 10 ** -digits
  return primaSet(function* () {
    let x = start
    while (x <= end + 1e-12) { 
      yield +x.toFixed(digits)
      x += step
    }
  })
}

// =======================================================================
// LAYER 1: DIRECT ACCESS FOR CORE NUMBERS (FreeFunction alternative)
// =======================================================================

const n = Array.from({length: 100}, (_, i) => i + 1)
const z = Array.from({length: 201}, (_, i) => i - 100)
const r = Array.from({length: 100}, (_, i) => i / 100)

// Make these arrays behave like primaSets
primaSet.plugin(Array, {
  map: Array.prototype.map,
  filter: Array.prototype.filter,
  take: function(n) { return primaSet(this.slice(0, n), {memo: true}) },
  reduce: (arr, f, init) => arr.reduce(f, init)
})

// ============================================================================
// LAYER 1: PARITY PARTITION
// ============================================================================

const evens = (last = Infinity) => primaSet(function* () {
  let n = 2
  while (n <= last) { yield n; n += 2 }
})

const odds = (last = Infinity) => primaSet(function* () {
  let n = 1
  while (n <= last) { yield n; n += 2 }
})

const multiplesOf = (k) => (last = Infinity) => primaSet(function* () {
  let n = k
  while (n <= last) { yield n; n += k }
})

// ============================================================================
// LAYER 2: PRIME CONSTELLATIONS (defined after primes)
// ============================================================================

// ============================================================================
// LAYER 3: PRIMAL ADDRESS SYSTEM
// ============================================================================

// CRT address using new geometric interpretation
// Uses firstDivisor as default primality test (isPrime is experimental)
const address = (n, k = 4) => {
  // Get first k primes using collection handling
  const P = [...primes.take(k)]
  const addr = P.map(p => n % p)
  
  // If default k=4, check if we need more primes for unique representation
  // (e.g., 30030 needs k=7, 1234 needs k=7 to be uniquely represented)
  if (k === 4) {
    const M = P.reduce((a, b) => a * b, 1)
    // If n >= M, we need more primes for unique representation
    if (n >= M) {
      // Find minimum k such that product of first k primes > n
      let neededK = 4
      let product = M
      const additionalPrimes = primaSet(function* () {
        let count = 0
        for (const p of primes) {
          if (count++ < 4) continue
          yield p
        }
      })
      for (const p of additionalPrimes) {
        product *= p
        neededK++
        if (product > n) break
      }
      if (neededK > 4) {
        return address(n, neededK)
      }
    }
    // Also check if result is all zeros and n is large
    if (addr.every(r => r === 0) && n > 0) {
      let primeCount = 0
      for (const p of primes) {
        if (n % p === 0) primeCount++
        else if (p > Math.sqrt(n)) break
        if (primeCount > 4) {
          return address(n, Math.max(7, primeCount + 1))
        }
      }
    }
  }
  
  return addr
}

address.isResidual = (addr) => addr.every(r => r !== 0)

// CRT reconstruction: convert address back to number
address.toNumber = (addr, k) => {
  // Infer k from address length if not provided
  if (k === undefined) k = addr.length
  // Get first k primes to match address function
  const P = []
  let count = 0
  for (const p of primes) {
    if (count++ >= k) break
    P.push(p)
  }
  // Ensure address length matches primes count
  if (addr.length !== P.length && k === addr.length) {
    // Already correct
  } else if (addr.length !== P.length) {
    // Use address length to infer k
    k = addr.length
    P.length = 0
    count = 0
    for (const p of primes) {
      if (count++ >= k) break
      P.push(p)
    }
  }
  // Chinese Remainder Theorem reconstruction
  let result = 0
  const M = P.reduce((a, b) => a * b, 1)
  for (let i = 0; i < P.length; i++) {
    const mi = Math.floor(M / P[i])
    // Find modular inverse: miInv such that (mi * miInv) % P[i] === 1
    let miInv = 1
    for (let x = 1; x < P[i]; x++) {
      if ((mi * x) % P[i] === 1) {
        miInv = x
        break
      }
    }
    result += addr[i] * mi * miInv
  }
  return result % M
}

// ============================================================================
// LAYER 4: GEOMETRIC PRIMES IN 2D POWER SPACE
// ============================================================================

// Prime cloud in complex plane using modular arithmetic positions
const primeComplex = (count = 100) => {
  const primesGen = primaSet.primes || primes
  return primaSet(function* () {
    let c = 0
    for (const p of primesGen) {
      if (c++ >= count) break
      yield complex(p % 13, p % 17)
    }
  })
}

// Quadratic residue geometry
const quadraticCurve = (a = 1, b = 0, c = 0) =>
  R(-10, 10).map(x => complex(x, a*x*x + b*x + c))

// ============================================================================
// LAYER 5: TWIN PRIMES IN COMPLEX SPACE
// ============================================================================

// Twin primes as complex conjugate pairs
const twinComplex = (count = 50) => {
  const twinsGen = primaSet.twins || twins
  return primaSet(function* () {
    let c = 0
    for (const [p, q] of twinsGen) {
      if (c++ >= count) break
      yield complex(p, q - p)
    }
  })
}

// ============================================================================
// LAYER 6: DIMENSIONAL SIEVE WITH 2D GEOMETRY
// ============================================================================

// ============================================================================
// GEOMETRIC SIEVE - Production implementation using PrimaSet optimizations
// ============================================================================

// Cache for prime lists (memoized using primaSet pattern)
const primeListCache = new Map()

// Get primes up to limit (cached, using collection handling)
const getPrimesUpTo = (limit) => {
  if (primeListCache.has(limit)) return primeListCache.get(limit)
  const P = [...primes.filter(p => p <= limit)]
  primeListCache.set(limit, P)
  return P
}

// Count primes up to limit (cached)
const countPrimesUpTo = (limit) => {
  const P = getPrimesUpTo(limit)
  return P.length
}

// Geometric sieve using CRT address with PrimaSet lazy evaluation
const geometricSieve = (start = 1, end = 1000, options = {}) => {
  const { k: customK } = options
  const sqrtEnd = Math.floor(Math.sqrt(end))
  const k = customK || countPrimesUpTo(sqrtEnd)
  const primeList = getPrimesUpTo(sqrtEnd)
  
  // Lazy candidate generation
  const candidates = N(end).skip(start - 1)
  
  // Lazy address computation and filtering pipeline
  return primaSet(function* () {
    for (const n of candidates) {
      if (n < 2) continue  // Skip 0 and 1
      if (n === 2) {
        yield n  // 2 is prime
        continue
      }
      if (n % 2 === 0) continue  // Skip even numbers
      
      // For very small numbers, use Set lookup instead of if chain
      const smallPrimes = new Set([3, 5, 7])
      if (n < 10 && smallPrimes.has(n)) {
        yield n
        continue
      }
      
      // Compute address with EARLY TERMINATION (critical optimization!)
      // Check remainders one at a time, stop at first zero
      const sqrtN = Math.floor(Math.sqrt(n))
      let isPrime = true
      
      for (const p of primeList) {
        if (p > sqrtN) break  // Only check up to sqrt(n)
        if (n % p === 0) {
          isPrime = false
          break  // Early termination: found a divisor!
        }
      }
      
      if (isPrime) {
        yield n  // Residual space = prime candidate
      }
    }
  })
}

// Optimized isPrime using geometric sieve with early termination
const isPrimeGeometric = (n) => {
  // Use object mapping instead of if chain
  const smallPrimes = new Set([2, 3, 5, 7])
  if (n < 2) return false
  if (smallPrimes.has(n)) return true
  if (n % 2 === 0) return false
  
  const sqrtN = Math.floor(Math.sqrt(n))
  if (sqrtN < 3) return true  // n is 3, 5, or 7
  
  // Quick check for small primes (avoid prime list computation overhead)
  if (n % 3 === 0) return false
  
  const primeList = getPrimesUpTo(sqrtN)
  
  // Check remainders one at a time with EARLY TERMINATION
  // Skip 2 and 3 (already checked)
  for (let i = 2; i < primeList.length; i++) {
    const p = primeList[i]
    if (p * p > n) break  // Only check up to sqrt(n)
    if (n % p === 0) {
      return false  // Found a divisor - composite!
    }
  }
  
  return true  // No divisors found - prime!
}

// Batch geometric sieve for multiple numbers (PrimaSet optimized)
const geometricSieveBatch = (numbers) => {
  if (!numbers || numbers.length === 0) return primaSet([])
  
  const maxN = Math.max(...numbers)
  const sqrtMaxN = Math.max(2, Math.floor(Math.sqrt(maxN)))
  const primeList = getPrimesUpTo(sqrtMaxN)
  
  // Use primaSet for lazy batch processing
  return primaSet(function* () {
    for (const n of numbers) {
      if (n < 2) continue
      if (n === 2 || n === 3) {
        yield n
        continue
      }
      if (n % 2 === 0) continue
      
      // For very small numbers, use Set lookup instead of if chain
      const smallPrimes = new Set([5, 7])
      if (n < 10 && smallPrimes.has(n)) {
        yield n
        continue
      }
      
      // Compute address
      const addr = primeList.map(p => n % p)
      
      // Check for zeros
      if (addr.every(r => r !== 0)) {
        yield n
      }
    }
  })
}

// Legacy geometric sieve using hyperplanes (kept for compatibility)
const geometricSieveLegacy = (limit = 1000) => {
  const planes = primalPlane(2, 3, 5, 7) // First 4 primes create planes
  const nums = N(limit)
  return primaSet(function* () {
    for (const n of nums) {
      if (planes.every(plane => plane.distance(complex(n, 0)) > 0)) yield n
    }
  })
}

// Helper for creating sieve spaces (2D algebraic spaces for each prime)
const primalPlane = (...primes) => primes.map(p => 
  space([0, 0], [p, 0])) // Each prime creates a 2D algebraic space

// ============================================================================
// LAYER 6: RESIDUAL SPACE
// ============================================================================

const residualSpace = (k = 3, limit = 100) => primaSet(function* () {
  for (let n = 1; n <= limit; n++) {
    const addr = address(n, k)
    if (address.isResidual(addr)) yield n
  }
})

const residualDensity = (k) => {
  const primeBases = [...primes.take(k)]
  return primeBases.reduce((density, p) => density * (1 - 1/p), 1)
}

// ============================================================================
// LAYER 7: GOLDBACH STRUCTURES
// ============================================================================

const goldbachPairs = (n) => {
  if (n % 2 !== 0 || n <= 2) return primaSet([])
  return primaSet(function* () {
    const primeList = []
    for (const p of primes) {
      if (p >= n) break
      primeList.push(p)
    }
    for (const p of primeList) {
      const q = n - p
      if (q >= p && operations.isPrime(q)) yield { p, q, sum: n }
    }
  })
}

const goldbachTable = (maxEven = 100) => primaSet(function* () {
  for (let n = 4; n <= maxEven; n += 2) {
    const pairs = [...goldbachPairs(n)]
    yield { n, count: pairs.length, pairs: pairs.slice(0, 3) }
  }
})

const goldbachVectors = (n, k = 6) => {
  if (n % 2 !== 0 || n <= 2) return primaSet([])
  return primaSet(function* () {
    const pairs = goldbachPairs(n)
    const primeBases = [...primes].slice(0, k)
    for (const {p, q} of pairs) {
      const addr_p = address(p, k), addr_q = address(q, k), addr_n = address(n, k)
      const addr_sum = addr_p.map((r, i) => (r + addr_q[i]) % primeBases[i])
      yield { p, q, n, addr_p, addr_q, addr_n, addr_sum, linearityHolds: addr_sum.every((r, i) => r === addr_n[i]) }
    }
  })
}

// ============================================================================
// LAYER 8: GEOMETRY
// ============================================================================

const primalPosition = (n, dimensions = 3) => {
  const residues = address(n, dimensions)
  const primeList = [...primes.take(dimensions)]
  const coords = residues.map((r, i) => r / primeList[i])
  // Return point instead of complex for distance method
  return point(...coords)
}

const primalDistance = (n1, n2, dimensions = 3) => {
  const p1 = primalPosition(n1, dimensions)
  const p2 = primalPosition(n2, dimensions)
  return p1.distance(p2)
}

const twinDistances = (count = 100, dimensions = 3) => {
  return primaSet(function* () {
    let c = 0
    for (const [p, q] of twins) {
      if (c++ >= count) break
      yield { pair: [p, q], distance: primalDistance(p, q, dimensions) }
    }
  })
}

// ============================================================================
// LAYER 9: DIMENSIONAL ANALYSIS
// ============================================================================

const dimensionStats = (k, limit = 1000) => {
  const primeBases = [...primes.take(k)]
  const M = primeBases.reduce((prod, p) => prod * p, 1)
  const residualVol = residualDensity(k)
  const residualCount = [...residualSpace(k, Math.min(M, limit))].length
  return { k, primes: primeBases, M, residualVolume: residualVol, residualCount, theoreticalCount: M * residualVol }
}

const twinAdmissibility = (k, limit = 1000) => {
  const primeBases = [...primes.take(k)]
  let admissibleCount = 0, actualTwins = 0
  for (let n = 1; n < limit - 1; n++) {
    const addr_n = address(n, k), addr_n2 = address(n + 2, k)
    if (address.isResidual(addr_n) && address.isResidual(addr_n2)) {
      admissibleCount++
      if (operations.isPrime(n) && operations.isPrime(n + 2)) actualTwins++
    }
  }
  const C2 = primeBases.slice(1).reduce((acc, p) => acc * (1 - 1/(p-1)**2), 1)
  const hlPrediction = 2 * C2 * limit / Math.log(limit)**2
  return { k, limit, admissibleCount, actualTwins, hardyLittlewood: hlPrediction, ratio: actualTwins / hlPrediction }
}

// ============================================================================
// LAYER 10: PRIMES AND CONSTELLATIONS (must be defined before exports)
// ============================================================================

// Legacy compatibility exports - create primes generator if needed
const createPrimes = () => {
  const { isPrime } = operations
  return primaSet(function* () {
    yield 2; yield 3
    let n = 5
    while (true) {
      if (isPrime(n)) yield n
      n += 2
    }
  })
}
const primes = createPrimes()

// Attach primes to primaSet for global access
primaSet.primes = primes

// Add primorial method to primes generator
primes.primorial = (n) => {
  let result = 1
  let count = 0
  for (const p of primes) {
    if (count++ >= n) break
    result *= p
  }
  return result
}

// Define prime constellations after primes is available
const twins = primaSet(function* () {
  let prev = 2
  for (const p of primes) {
    if (p - prev === 2) yield [prev, p]
    prev = p
  }
})
primaSet.twins = twins

const cousins = primaSet(function* () {
  for (const p of primes) {
    if (operations.isPrime(p + 4)) yield [p, p + 4]
  }
})

const sexy = primaSet(function* () {
  for (const p of primes) {
    if (operations.isPrime(p + 6)) yield [p, p + 6]
  }
})

const primeGaps = primaSet(function* () {
  let prev = 2
  for (const p of primes) {
    if (prev > 2) yield { gap: p - prev, after: prev }
    prev = p
  }
})

// Export all public functions individually
export { 
  N, Z, R, 
  evens, odds, multiplesOf,
  twins, cousins, sexy, primeGaps,
  primeComplex, twinComplex, quadraticCurve,
  geometricSieve, geometricSieveBatch, geometricSieveLegacy, isPrimeGeometric, primalPlane,
  address,
  residualSpace, residualDensity,
  goldbachPairs, goldbachVectors, goldbachTable,
  primalPosition, primalDistance, twinDistances,
  dimensionStats, twinAdmissibility,
  primes
}