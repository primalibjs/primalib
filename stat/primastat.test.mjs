/**
 * primastat.test.mjs - Test statistical analysis tools
 */

import { test } from '../test/test.mjs'
import {
  range, histogram,
  mean, median, stddev, variance, percentile,
  entropy, relativeEntropy, uniformity,
  correlation, linearRegression,
  movingAverage, differences,
  goodnessOfFit, hlComparison, summary
} from './primastat.mjs'
import { primes, primeGaps, twins } from 'primalib'

// ============================================================================
// BASIC STATISTICS
// ============================================================================

test('🧪 primastat.test.mjs - Statistics: mean calculation', ({check}) => {
  check(mean([1, 2, 3, 4, 5]), 3)
  check(mean([10, 20, 30]), 20)
})

test('Statistics: median for odd/even length', ({check}) => {
  check(median([1, 2, 3, 4, 5]), 3)
  check(median([1, 2, 3, 4]), 2.5)
})

test('Statistics: standard deviation', ({check}) => {
  const data = [2, 4, 4, 4, 5, 5, 7, 9]
  const sd = stddev(data)
  check(sd > 2 && sd < 2.2) // Approximately 2.138
})

test('Statistics: percentile', ({check}) => {
  const data = range(1, 100, 1)
  check(percentile(data, 50), 50) // Median
  check(percentile(data, 25), 25) // Q1
  check(percentile(data, 75), 75) // Q3
})

// ============================================================================
// INFORMATION THEORY
// ============================================================================

test('Entropy: uniform distribution has max entropy', ({check}) => {
  const uniform = [1, 2, 3, 4, 5, 6, 7, 8] // All unique
  const h = entropy(uniform)
  check(h, Math.log2(8)) // log2(8) = 3
})

test('Entropy: concentrated distribution has low entropy', ({check}) => {
  const concentrated = [1, 1, 1, 1, 1, 2]
  const h = entropy(concentrated)
  check(h < 1) // Much less than log2(2)
})

test('Uniformity: detects non-uniform distribution', ({check}) => {
  const uniform = [1, 1, 2, 2, 3, 3]
  const skewed = [1, 1, 1, 1, 2, 3]

  check(uniformity(skewed) > uniformity(uniform))
})

test('Relative entropy: measures distribution difference', ({check}) => {
  const data1 = [0, 0, 1, 1]  // Uniform
  const data2 = [0, 0, 0, 1]  // Skewed
  const relEnt1 = relativeEntropy(data1, 2)  // maxVal = 2 (0 or 1)
  const relEnt2 = relativeEntropy(data2, 2)
  check(relEnt1 >= relEnt2)  // Uniform should have higher or equal relative entropy
  check(typeof relEnt1, 'number')
})

test('Goodness of fit: chi-square test', ({check}) => {
  const observed = [50, 30, 20]
  const expected = [40, 40, 20]
  const gof = goodnessOfFit(observed, expected)
  check(gof.chiSquare > 0)  // Should have some chi-square difference
  check(gof.degreesOfFreedom, 2)
})

test('HL comparison: Hardy-Littlewood constant approximation', ({check}) => {
  const twinCounts = [0, 1, 1, 2, 2, 3]  // Example twin prime counts
  const nValues = [10, 20, 30, 40, 50, 60]  // Corresponding n values
  const hl = hlComparison(twinCounts, nValues)
  check(typeof hl, 'object')
  check(Array.isArray(hl.actual))
  check(Array.isArray(hl.predicted))
})

// ============================================================================
// CORRELATION & REGRESSION
// ============================================================================

test('Correlation: perfect positive correlation', ({check}) => {
  const x = [1, 2, 3, 4, 5]
  const y = [2, 4, 6, 8, 10]
  check(correlation(x, y).toFixed(4), '1.0000')
})

test('Correlation: perfect negative correlation', ({check}) => {
  const x = [1, 2, 3, 4, 5]
  const y = [10, 8, 6, 4, 2]
  check(correlation(x, y).toFixed(4), '-1.0000')
})

test('Linear regression: finds correct slope', ({check}) => {
  const x = [1, 2, 3, 4, 5]
  const y = [2, 4, 6, 8, 10]
  const reg = linearRegression(x, y)
  
  check(reg.slope, 2)
  check(reg.intercept, 0)
  check(reg.r2, 1) // Perfect fit
})

// ============================================================================
// TIME SERIES
// ============================================================================

test('Moving average: smooths data', ({check}) => {
  const data = [1, 2, 3, 4, 5]
  const ma = movingAverage(data, 3)
  const maArray = ma.toArray()

  check(maArray.length, 3) // 3 windows of size 3
  check(maArray[0], 2) // (1+2+3)/3
  check(maArray[1], 3) // (2+3+4)/3
  check(maArray[2], 4) // (3+4+5)/3
})

test('Differences: computes successive differences', ({check}) => {
  const data = [1, 3, 6, 10, 15]
  const diffs = differences(data)
  
  check(diffs, [2, 3, 4, 5])
})

// ============================================================================
// PRIMAL GEOMETRY APPLICATIONS
// ============================================================================

test('Gap distribution: analyzes prime gaps', ({check}) => {
  const gaps = primeGaps.take(100).map(g => g.gap)
  const dist = summary(gaps)
  
  check(dist.count, 100)
  check(dist.min >= 2) // Minimum gap is 2 (twins)
  check(dist.mean > 0)
})

test('Twin distances: entropy of distances', ({check}) => {
  const twinList = [...twins.take(50)].map(([p, q]) => q - p)
  
  // All twins have gap = 2
  check(entropy(twinList), 0) // Zero entropy (all same)
  check(mean(twinList), 2)
})

test('Summary: provides complete statistics', ({check}) => {
  const data = primes.take(100)
  const stats = summary(data)
  
  check(stats.count, 100)
  check(stats.min, 2)
  check(stats.mean > 0)
  check(stats.median > 0)
  check(stats.stddev > 0)
})

// ============================================================================
// HISTOGRAM
// ============================================================================

test('Histogram: bins data correctly', ({check}) => {
  const data = range(1, 100, 1)
  const hist = histogram(data, 10)
  
  check(hist.length, 10)
  check(hist.every(bin => bin.count === 10)) // Uniform distribution
})

test('Histogram: handles empty data', ({check}) => {
  const hist = histogram([], 10)
  check(hist.length, 0)
})