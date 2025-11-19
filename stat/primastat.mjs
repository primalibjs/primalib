/**
 *  P R I M A S T A T   v 0.5
 *  Statistical analysis tools for Primal Geometry
 *  Advanced analytics for prime distribution, hypercube properties, and conjectures
 */

import { primaSet } from "@primalib/core"

// ============================================================================
// BASIC UTILITIES
// ============================================================================

const range = (start, end, step = 1) =>
  primaSet(function* () {
    let x = start
    while (x <= end + 1e-12) {
      yield Number(x.toFixed(10))
      x += step
    }
  })

const histogram = (set, bins = 10) => {
  const arr = [...set]
  if (arr.length === 0) return []
  
  const minVal = Math.min(...arr)
  const maxVal = Math.max(...arr)
  const binWidth = (maxVal - minVal) / bins || 1
  const counts = Array(bins).fill(0)
  
  for (const x of arr) { 
    const idx = Math.min(Math.floor((x - minVal) / binWidth), bins - 1)
    counts[idx]++
  }
  
  return counts.map((cnt, i) => ({ 
    low: minVal + i * binWidth, 
    high: minVal + (i + 1) * binWidth, 
    count: cnt 
  }))
}

// ============================================================================
// STATISTICAL MEASURES
// ============================================================================

// Mean of dataset
const mean = (arr) => {
  return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0
}

// Standard deviation
const stddev = (arr) => {
  if (arr.length < 2) return 0
  const avg = mean(arr)
  const variance = arr.reduce((sum, x) => sum + (x - avg) ** 2, 0) / (arr.length - 1)
  return Math.sqrt(variance)
}

// Variance
const variance = (arr) => {
  if (arr.length < 2) return 0
  const avg = mean(arr)
  return arr.reduce((sum, x) => sum + (x - avg) ** 2, 0) / (arr.length - 1)
}

// Median
const median = (data) => {
  const arr = [...data].sort((a, b) => a - b)
  if (arr.length === 0) return 0
  const mid = Math.floor(arr.length / 2)
  return arr.length % 2 ? arr[mid] : (arr[mid - 1] + arr[mid]) / 2
}

// Percentile
const percentile = (data, p) => {
  const arr = [...data].sort((a, b) => a - b)
  if (arr.length === 0) return 0
  const idx = Math.ceil((p / 100) * arr.length) - 1
  return arr[Math.max(0, idx)]
}

// ============================================================================
// INFORMATION THEORY
// ============================================================================

// Shannon entropy in bits
const entropy = (data) => {
  const arr = [...data]
  if (arr.length === 0) return 0

  const freq = {}
  for (const x of arr) {
    freq[x] = (freq[x] || 0) + 1
  }

  let h = 0
  const total = arr.length
  for (const count of Object.values(freq)) {
    const p = count / total
    h -= p * Math.log2(p)
  }

  return h
}

// Relative entropy (compared to uniform distribution)
const relativeEntropy = (data, maxVal) => {
  const h = entropy(data)
  const maxH = Math.log2(maxVal)
  return maxH > 0 ? h / maxH : 0
}

// Distribution uniformity score (0 = uniform, higher = less uniform)
const uniformity = (arr) => {
  if (arr.length === 0) return 1

  const freq = {}
  for (const x of arr) freq[x] = (freq[x] || 0) + 1

  const counts = Object.values(freq)
  const expected = arr.length / counts.length
  const chiSq = counts.reduce((sum, count) =>
    sum + ((count - expected) ** 2) / expected, 0)

  return chiSq / counts.length  // Normalized
}

// ============================================================================
// CORRELATION & REGRESSION
// ============================================================================

// Pearson correlation coefficient
const correlation = (arr1, arr2) => {
  const n = Math.min(arr1.length, arr2.length)
  if (n < 2) return 0

  const mean1 = mean(arr1.slice(0, n))
  const mean2 = mean(arr2.slice(0, n))

  let num = 0, denom1 = 0, denom2 = 0
  for (let i = 0; i < n; i++) {
    const diff1 = arr1[i] - mean1
    const diff2 = arr2[i] - mean2
    num += diff1 * diff2
    denom1 += diff1 ** 2
    denom2 += diff2 ** 2
  }

  return denom1 && denom2 ? num / Math.sqrt(denom1 * denom2) : 0
}

// Linear regression (returns {slope, intercept, r2})
const linearRegression = (dataX, dataY) => {
  const x = [...dataX]
  const y = [...dataY]
  const n = Math.min(x.length, y.length)
  if (n < 2) return { slope: 0, intercept: 0, r2: 0 }

  const meanX = mean(x.slice(0, n))
  const meanY = mean(y.slice(0, n))

  let num = 0, denom = 0
  for (let i = 0; i < n; i++) {
    num += (x[i] - meanX) * (y[i] - meanY)
    denom += (x[i] - meanX) ** 2
  }

  const slope = denom ? num / denom : 0
  const intercept = meanY - slope * meanX
  const r = correlation(x.slice(0, n), y.slice(0, n))

  return { slope, intercept, r2: r ** 2 }
}

// ============================================================================
// TIME SERIES ANALYSIS
// ============================================================================

// Moving average
const movingAverage = (data, windowSize) => {
  return primaSet(function* () {
    const buffer = []
    for (const x of primaSet(data)) {
      buffer.push(x)
      if (buffer.length > windowSize) buffer.shift()
      if (buffer.length === windowSize) {
        yield buffer.reduce((a, b) => a + b, 0) / windowSize
      }
    }
  })
}

// Exponential moving average
const ema = (data, alpha = 0.2) => {
  return primaSet(function* () {
    let ema = null
    for (const x of primaSet(data)) {
      ema = ema === null ? x : alpha * x + (1 - alpha) * ema
      yield ema
    }
  })
}

// Differences (x[i+1] - x[i])
const differences = (data) => {
  return primaSet(function* () {
    let prev = null
    for (const x of primaSet(data)) {
      if (prev !== null) yield x - prev
      prev = x
    }
  })
}

// ============================================================================
// DISTRIBUTION FITTING
// ============================================================================

// Test if data follows expected distribution
const goodnessOfFit = (observed, expected) => {
  const obs = [...observed]
  const exp = [...expected]
  const n = Math.min(obs.length, exp.length)

  let chiSq = 0
  for (let i = 0; i < n; i++) {
    if (exp[i] > 0) {
      chiSq += ((obs[i] - exp[i]) ** 2) / exp[i]
    }
  }

  return { chiSquare: chiSq, degreesOfFreedom: n - 1 }
}

// Compare distribution to Hardy-Littlewood prediction
const hlComparison = (actualCounts, nValues, C2 = 0.66) => {
  const predicted = nValues.map(n => 2 * C2 * n / (Math.log(n) ** 2))
  return {
    actual: actualCounts,
    predicted,
    ratios: actualCounts.map((a, i) => a / predicted[i]),
    chiSquare: goodnessOfFit(actualCounts, predicted).chiSquare
  }
}

// ============================================================================
// PRIMAL GEOMETRY SPECIFIC
// ============================================================================

// Analyze residual space coverage as dimension increases
const residualCoverageAnalysis = async (dimensions, limit = 1000) => {
  const { primes, address } = await import('@primalib/num')
  
  return primaSet(dimensions).map(k => {
    const primeBases = primes.take(k)
    const M = primeBases.reduce((a, b) => a * b, 1)
    const density = primeBases.reduce((d, p) => d * (1 - 1/p), 1)
    
    let residualCount = 0
    for (let n = 1; n <= Math.min(M, limit); n++) {
      const addr = address(n, k)
      if (addr.every(r => r !== 0)) residualCount++
    }
    
    return {
      dimension: k,
      primorial: M,
      theoreticalDensity: density,
      actualCount: residualCount,
      expectedCount: M * density,
      ratio: residualCount / (M * density)
    }
  })
}

// Gap distribution analysis
const gapDistribution = (gaps) => {
  const freq = {}

  for (const gap of gaps) {
    freq[gap] = (freq[gap] || 0) + 1
  }

  const sorted = Object.entries(freq)
    .map(([gap, count]) => ({ gap: Number(gap), count }))
    .sort((a, b) => a.gap - b.gap)

  return {
    distribution: sorted,
    mostCommon: sorted.reduce((max, x) => x.count > max.count ? x : max, sorted[0]),
    meanGap: mean(gaps),
    medianGap: median(gaps),
    maxGap: Math.max(...gaps),
    entropy: entropy(gaps)
  }
}

// Twin prime density by dimension
const twinDensityByDimension = async (maxDim = 10, limit = 5000) => {
  const { twinAdmissibility } = await import('@primalib/num')
  return primaSet(range(2, maxDim, 1)).map(k => {
    return twinAdmissibility(k, limit)
  })
}

// Goldbach pair distribution
const goldbachDistribution = async (maxEven = 1000, step = 2) => {
  const { goldbachPairs } = await import('@primalib/num')
  
  const data = []
  for (let n = 4; n <= maxEven; n += step) {
    const pairs = goldbachPairs(n)
    data.push({
      n,
      count: pairs.length,
      density: pairs.length / (n / 2)  // Normalized by n
    })
  }
  
  return {
    data,
    mean: mean(data.map(d => d.count)),
    stddev: stddev(data.map(d => d.count)),
    minCount: Math.min(...data.map(d => d.count)),
    maxCount: Math.max(...data.map(d => d.count)),
    failures: data.filter(d => d.count === 0)
  }
}

// Spectral analysis of address coordinates
const addressSpectrum = async (numbers, dimension = 6) => {
  const { primes, address } = await import('@primalib/num')
  const primeBases = primes.take(dimension)

  const addresses = [...numbers].map(n => address(n, dimension))

  // Analyze each coordinate dimension
  const spectra = primeBases.map((prime, dim) => {
    const residues = addresses.map(addr => addr[dim])
    const freq = {}

    for (let r = 0; r < prime; r++) {
      freq[r] = residues.filter(res => res === r).length
    }

    return {
      prime,
      dimension: dim,
      frequencies: freq,
      entropy: entropy(residues),
      maxEntropy: Math.log2(prime),
      uniformity: relativeEntropy(residues, prime)
    }
  })

  return {
    dimension,
    spectra,
    avgEntropy: mean(spectra.map(s => s.entropy)),
    avgUniformity: mean(spectra.map(s => s.uniformity))
  }
}

// ============================================================================
// COMPARATIVE ANALYSIS
// ============================================================================

// Compare multiple datasets
const compareDistributions = async (...datasets) => {
  const stats = datasets.map(data => ({
    mean: mean(data),
    median: median(data),
    stddev: stddev(data),
    entropy: entropy(data)
  }))
  
  return {
    individual: stats,
    correlations: datasets.length > 1 
      ? correlation(datasets[0], datasets[1])
      : null
  }
}

// Summary statistics
const summary = (data) => {
  const arr = [...data]
  return {
    count: arr.length,
    mean: mean(arr),
    median: median(arr),
    stddev: stddev(arr),
    min: Math.min(...arr),
    max: Math.max(...arr),
    q25: percentile(arr, 25),
    q75: percentile(arr, 75),
    entropy: entropy(arr)
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  // Basic utilities
  range, histogram,
  
  // Statistical measures
  mean, median, stddev, variance, percentile,
  
  // Information theory
  entropy, relativeEntropy, uniformity,
  
  // Correlation
  correlation, linearRegression,
  
  // Time series
  movingAverage, ema, differences,
  
  // Distribution fitting
  goodnessOfFit, hlComparison,
  
  // Primal geometry specific
  residualCoverageAnalysis, gapDistribution,
  twinDensityByDimension, goldbachDistribution,
  addressSpectrum,
  
  // Comparative
  compareDistributions, summary
}

