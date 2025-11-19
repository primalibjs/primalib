# PrimaStat - Statistical Analysis Tools

> **"Statistical analysis tools for Primal Geometry - advanced analytics for prime distribution, hypercube properties, and mathematical conjectures."**

PrimaStat provides comprehensive statistical analysis tools for analyzing mathematical data, prime distributions, and geometric structures. It includes basic statistics, information theory, correlation analysis, time series, and specialized functions for primal geometry.

## 🎯 **Architecture**

- **Basic Statistics**: Mean, median, standard deviation, variance, percentiles
- **Information Theory**: Entropy, relative entropy, uniformity measures
- **Correlation & Regression**: Pearson correlation, linear regression
- **Time Series**: Moving averages, exponential moving averages, differences
- **Distribution Fitting**: Goodness-of-fit tests, Hardy-Littlewood comparisons
- **Primal Geometry**: Specialized analysis for primes, twins, Goldbach, addresses

## 📊 **Basic Utilities**

### Range

```javascript
import { range } from 'primalib'

// Generate numeric range
range(0, 10, 1)    // → 0, 1, 2, ..., 10
range(0, 1, 0.1)   // → 0, 0.1, 0.2, ..., 1.0
range(-5, 5, 0.5)  // → -5, -4.5, -4, ..., 5

// Use with PrimaSet operations
range(0, 10, 1)
  .filter(x => x % 2 === 0)
  .map(x => x * x)
  .toArray()
```

### Histogram

```javascript
import { histogram } from 'primalib'

const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// Create histogram with default 10 bins
histogram(data)
// → [
//     {low: 1, high: 1.9, count: 1},
//     {low: 1.9, high: 2.8, count: 1},
//     ...
//   ]

// Custom number of bins
histogram(data, 5)  // → 5 bins

// Empty data
histogram([])  // → []
```

## 📈 **Statistical Measures**

### Mean

```javascript
import { mean } from 'primalib'

mean([1, 2, 3, 4, 5])  // → 3
mean([10, 20, 30])     // → 20
mean([])               // → 0
```

### Median

```javascript
import { median } from 'primalib'

median([1, 2, 3, 4, 5])     // → 3 (odd length)
median([1, 2, 3, 4, 5, 6]) // → 3.5 (even length)
median([5, 2, 8, 1, 9])    // → 5 (sorted: 1,2,5,8,9)
```

### Standard Deviation

```javascript
import { stddev } from 'primalib'

stddev([1, 2, 3, 4, 5])  // → 1.5811388300841898
stddev([10, 20, 30])     // → 10
stddev([1])              // → 0 (single value)
stddev([])               // → 0 (empty)
```

### Variance

```javascript
import { variance } from 'primalib'

variance([1, 2, 3, 4, 5])  // → 2.5
variance([10, 20, 30])     // → 100
variance([1])              // → 0
variance([])               // → 0
```

### Percentile

```javascript
import { percentile } from 'primalib'

const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

percentile(data, 25)  // → 3 (25th percentile)
percentile(data, 50)  // → 5 (median)
percentile(data, 75)  // → 8 (75th percentile)
percentile(data, 90)  // → 9 (90th percentile)
```

## 🔬 **Information Theory**

### Entropy

```javascript
import { entropy } from 'primalib'

// Shannon entropy in bits
entropy([1, 1, 2, 2, 2, 3])  // → ~1.459 (bits)
entropy([1, 1, 1, 1, 1])     // → 0 (no uncertainty)
entropy([1, 2, 3, 4, 5])     // → ~2.322 (high entropy)

// Uniform distribution has maximum entropy
entropy([1, 2, 3, 4, 5, 6, 7, 8])  // → 3 (log2(8))
```

### Relative Entropy

```javascript
import { relativeEntropy } from 'primalib'

// Relative entropy compared to uniform distribution
relativeEntropy([1, 1, 2, 2, 2, 3], 3)  // → entropy / log2(3)
relativeEntropy([1, 2, 3, 4, 5], 5)    // → ~1.0 (close to uniform)
```

### Uniformity

```javascript
import { uniformity } from 'primalib'

// Measure distribution uniformity (0 = uniform, higher = less uniform)
uniformity([1, 2, 3, 4, 5])        // → ~0 (uniform)
uniformity([1, 1, 1, 2, 2])        // → higher (less uniform)
uniformity([1, 1, 1, 1, 1])        // → highest (completely non-uniform)
```

## 🔗 **Correlation & Regression**

### Correlation

```javascript
import { correlation } from 'primalib'

// Pearson correlation coefficient (-1 to 1)
const x = [1, 2, 3, 4, 5]
const y = [2, 4, 6, 8, 10]

correlation(x, y)  // → 1.0 (perfect positive correlation)

const y2 = [10, 8, 6, 4, 2]
correlation(x, y2)  // → -1.0 (perfect negative correlation)

const y3 = [1, 3, 2, 5, 4]
correlation(x, y3)  // → ~0.8 (strong positive correlation)
```

### Linear Regression

```javascript
import { linearRegression } from 'primalib'

const x = [1, 2, 3, 4, 5]
const y = [2, 4, 6, 8, 10]

const result = linearRegression(x, y)
// → {
//     slope: 2,
//     intercept: 0,
//     r2: 1.0
//   }

// Use regression line
const predict = (x) => result.slope * x + result.intercept
predict(6)  // → 12

// R² (coefficient of determination)
result.r2  // → 1.0 (perfect fit)
```

## ⏱️ **Time Series Analysis**

### Moving Average

```javascript
import { movingAverage } from 'primalib'

const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// Moving average with window size 3
movingAverage(data, 3).toArray()
// → [2, 3, 4, 5, 6, 7, 8, 9] (averages of [1,2,3], [2,3,4], ...)

// Window size 5
movingAverage(data, 5).toArray()
// → [3, 4, 5, 6, 7, 8] (averages of [1,2,3,4,5], [2,3,4,5,6], ...)
```

### Exponential Moving Average

```javascript
import { ema } from 'primalib'

const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// EMA with default alpha = 0.2
ema(data).toArray()
// → [1, 1.2, 1.56, 2.048, ...] (exponentially weighted)

// Custom alpha (smoothing factor)
ema(data, 0.5).toArray()  // → higher alpha = more responsive
ema(data, 0.1).toArray()  // → lower alpha = smoother
```

### Differences

```javascript
import { differences } from 'primalib'

const data = [1, 3, 6, 10, 15, 21]

// Compute differences: x[i+1] - x[i]
differences(data).toArray()
// → [2, 3, 4, 5, 6]

// Use for analyzing trends
differences([10, 12, 15, 20, 26]).toArray()
// → [2, 3, 5, 6] (increasing differences)
```

## 📉 **Distribution Fitting**

### Goodness of Fit

```javascript
import { goodnessOfFit } from 'primalib'

const observed = [10, 15, 12, 18, 20]
const expected = [12, 12, 12, 12, 12]

const result = goodnessOfFit(observed, expected)
// → {
//     chiSquare: 4.5,
//     degreesOfFreedom: 4
//   }

// Lower chi-square = better fit
```

### Hardy-Littlewood Comparison

```javascript
import { hlComparison } from 'primalib'

// Compare actual twin prime counts to Hardy-Littlewood prediction
const actualCounts = [2, 3, 5, 7, 11]
const nValues = [10, 20, 30, 40, 50]

const result = hlComparison(actualCounts, nValues, 0.66)
// → {
//     actual: [2, 3, 5, 7, 11],
//     predicted: [...],
//     ratios: [...],
//     chiSquare: ...
//   }
```

## 🔷 **Primal Geometry Specific**

### Residual Coverage Analysis

```javascript
import { residualCoverageAnalysis } from 'primalib'

// Analyze residual space coverage as dimension increases
const analysis = await residualCoverageAnalysis([2, 3, 4, 5], 1000)

analysis.toArray()
// → [
//     {
//       dimension: 2,
//       primorial: 6,
//       theoreticalDensity: 0.333...,
//       actualCount: 2,
//       expectedCount: 2,
//       ratio: 1.0
//     },
//     ...
//   ]
```

### Gap Distribution

```javascript
import { gapDistribution } from 'primalib'
import { primeGaps } from 'primalib'

// Analyze prime gap distribution
const gaps = primeGaps.take(100).map(g => g.gap)
const dist = gapDistribution(gaps)

// → {
//     distribution: [{gap: 2, count: 35}, {gap: 4, count: 20}, ...],
//     mostCommon: {gap: 2, count: 35},
//     meanGap: 4.2,
//     medianGap: 2,
//     maxGap: 14,
//     entropy: 2.1
//   }
```

### Twin Density by Dimension

```javascript
import { twinDensityByDimension } from 'primalib'

// Analyze twin prime density across dimensions
const analysis = await twinDensityByDimension(10, 5000)

analysis.toArray()
// → [
//     {
//       k: 2,
//       limit: 5000,
//       admissibleCount: 833,
//       actualTwins: 205,
//       hardyLittlewood: 180.5,
//       ratio: 1.135
//     },
//     ...
//   ]
```

### Goldbach Distribution

```javascript
import { goldbachDistribution } from 'primalib'

// Analyze Goldbach pair distribution
const analysis = await goldbachDistribution(1000, 2)

// → {
//     data: [
//       {n: 4, count: 1, density: 0.5},
//       {n: 6, count: 1, density: 0.333...},
//       ...
//     ],
//     mean: 5.2,
//     stddev: 3.1,
//     minCount: 1,
//     maxCount: 28,
//     failures: []  // Even numbers with no Goldbach pairs
//   }
```

### Address Spectrum

```javascript
import { addressSpectrum } from 'primalib'
import { primes } from 'primalib'

// Spectral analysis of CRT address coordinates
const numbers = primes.take(100)
const spectrum = await addressSpectrum(numbers, 6)

// → {
//     dimension: 6,
//     spectra: [
//       {
//         prime: 2,
//         dimension: 0,
//         frequencies: {0: 1, 1: 99},
//         entropy: 0.08,
//         maxEntropy: 1.0,
//         uniformity: 0.08
//       },
//       ...
//     ],
//     avgEntropy: 1.2,
//     avgUniformity: 0.6
//   }
```

## 📊 **Comparative Analysis**

### Compare Distributions

```javascript
import { compareDistributions } from 'primalib'

// Compare multiple datasets
const data1 = [1, 2, 3, 4, 5]
const data2 = [2, 4, 6, 8, 10]
const data3 = [1, 1, 1, 1, 1]

const result = await compareDistributions(data1, data2, data3)

// → {
//     individual: [
//       {mean: 3, median: 3, stddev: 1.58, entropy: 2.32},
//       {mean: 6, median: 6, stddev: 3.16, entropy: 2.32},
//       {mean: 1, median: 1, stddev: 0, entropy: 0}
//     ],
//     correlations: 1.0  // correlation between first two datasets
//   }
```

### Summary Statistics

```javascript
import { summary } from 'primalib'

const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

const stats = summary(data)
// → {
//     count: 10,
//     mean: 5.5,
//     median: 5.5,
//     stddev: 3.0276503540974917,
//     min: 1,
//     max: 10,
//     q25: 3,
//     q75: 8,
//     entropy: 3.321928094887362
//   }
```

## 📋 **Complete API Reference**

### Basic Utilities

| Function | Description | Example |
|----------|-------------|---------|
| `range(start, end, step?)` | Generate numeric range | `range(0, 10, 1)` |
| `histogram(set, bins?)` | Create histogram | `histogram([1,2,3], 5)` |

### Statistical Measures

| Function | Description | Example |
|----------|-------------|---------|
| `mean(arr)` | Arithmetic mean | `mean([1,2,3])` → `2` |
| `median(data)` | Median value | `median([1,2,3,4])` → `2.5` |
| `stddev(arr)` | Standard deviation | `stddev([1,2,3])` → `1.0` |
| `variance(arr)` | Variance | `variance([1,2,3])` → `1.0` |
| `percentile(data, p)` | Percentile value | `percentile([1..10], 75)` → `8` |

### Information Theory

| Function | Description | Example |
|----------|-------------|---------|
| `entropy(data)` | Shannon entropy (bits) | `entropy([1,1,2,2])` → `1.0` |
| `relativeEntropy(data, maxVal)` | Relative entropy | `relativeEntropy([1,2,3], 3)` |
| `uniformity(arr)` | Uniformity measure | `uniformity([1,2,3])` → `~0` |

### Correlation & Regression

| Function | Description | Example |
|----------|-------------|---------|
| `correlation(arr1, arr2)` | Pearson correlation | `correlation([1,2,3], [2,4,6])` → `1.0` |
| `linearRegression(dataX, dataY)` | Linear regression | `linearRegression([1,2,3], [2,4,6])` |

### Time Series

| Function | Description | Example |
|----------|-------------|---------|
| `movingAverage(data, windowSize)` | Moving average | `movingAverage([1..10], 3)` |
| `ema(data, alpha?)` | Exponential moving average | `ema([1..10], 0.2)` |
| `differences(data)` | Differences | `differences([1,3,6])` → `[2,3]` |

### Distribution Fitting

| Function | Description | Example |
|----------|-------------|---------|
| `goodnessOfFit(observed, expected)` | Chi-square test | `goodnessOfFit([10,15], [12,12])` |
| `hlComparison(actual, nValues, C2?)` | Hardy-Littlewood comparison | `hlComparison([2,3], [10,20])` |

### Primal Geometry

| Function | Description | Example |
|----------|-------------|---------|
| `residualCoverageAnalysis(dims, limit?)` | Residual coverage | `residualCoverageAnalysis([2,3,4])` |
| `gapDistribution(gaps)` | Prime gap analysis | `gapDistribution([2,4,2,6])` |
| `twinDensityByDimension(maxDim, limit?)` | Twin density | `twinDensityByDimension(10)` |
| `goldbachDistribution(maxEven, step?)` | Goldbach analysis | `goldbachDistribution(1000)` |
| `addressSpectrum(numbers, dimension?)` | Address spectrum | `addressSpectrum(primes.take(100))` |

### Comparative

| Function | Description | Example |
|----------|-------------|---------|
| `compareDistributions(...datasets)` | Compare datasets | `compareDistributions([1,2], [2,4])` |
| `summary(data)` | Summary statistics | `summary([1..10])` |

## 🎨 **Usage Examples**

### Example 1: Basic Statistics

```javascript
import { mean, median, stddev, summary } from 'primalib'

const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

mean(data)      // → 5.5
median(data)    // → 5.5
stddev(data)    // → 3.027...

const stats = summary(data)
// → {count: 10, mean: 5.5, median: 5.5, ...}
```

### Example 2: Information Theory

```javascript
import { entropy, relativeEntropy, uniformity } from 'primalib'

// High entropy (uniform distribution)
entropy([1, 2, 3, 4, 5, 6, 7, 8])  // → 3.0

// Low entropy (skewed distribution)
entropy([1, 1, 1, 1, 1, 2, 3])  // → ~1.25

// Uniformity measure
uniformity([1, 2, 3, 4, 5])  // → ~0 (uniform)
uniformity([1, 1, 1, 2, 2])  // → higher (less uniform)
```

### Example 3: Correlation & Regression

```javascript
import { correlation, linearRegression } from 'primalib'

const x = [1, 2, 3, 4, 5]
const y = [2, 4, 6, 8, 10]

correlation(x, y)  // → 1.0 (perfect correlation)

const reg = linearRegression(x, y)
// → {slope: 2, intercept: 0, r2: 1.0}

// Predict
const predict = (x) => reg.slope * x + reg.intercept
predict(6)  // → 12
```

### Example 4: Time Series

```javascript
import { movingAverage, ema, differences } from 'primalib'

const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// Moving average
movingAverage(data, 3).toArray()
// → [2, 3, 4, 5, 6, 7, 8, 9]

// Exponential moving average
ema(data, 0.2).toArray()
// → [1, 1.2, 1.56, 2.048, ...]

// Differences
differences(data).toArray()
// → [1, 1, 1, 1, 1, 1, 1, 1, 1]
```

### Example 5: Prime Gap Analysis

```javascript
import { gapDistribution } from 'primalib'
import { primeGaps } from 'primalib'

const gaps = primeGaps.take(1000).map(g => g.gap)
const dist = gapDistribution(gaps)

console.log('Most common gap:', dist.mostCommon.gap)  // → 2
console.log('Mean gap:', dist.meanGap)                // → ~4.2
console.log('Max gap:', dist.maxGap)                  // → varies
console.log('Entropy:', dist.entropy)                 // → ~2.1
```

### Example 6: Goldbach Analysis

```javascript
import { goldbachDistribution } from 'primalib'

const analysis = await goldbachDistribution(1000, 2)

console.log('Mean pairs:', analysis.mean)
console.log('Std dev:', analysis.stddev)
console.log('Failures:', analysis.failures)  // → [] (no failures up to 1000)

// Analyze density trend
analysis.data
  .filter(d => d.n % 100 === 0)
  .forEach(d => console.log(`${d.n}: ${d.count} pairs`))
```

### Example 7: Address Spectrum

```javascript
import { addressSpectrum } from 'primalib'
import { primes } from 'primalib'

const numbers = primes.take(1000)
const spectrum = await addressSpectrum(numbers, 6)

// Analyze each dimension
spectrum.spectra.forEach(spec => {
  console.log(`Prime ${spec.prime}:`)
  console.log(`  Entropy: ${spec.entropy.toFixed(3)} / ${spec.maxEntropy.toFixed(3)}`)
  console.log(`  Uniformity: ${spec.uniformity.toFixed(3)}`)
})
```

### Example 8: Integration with PrimaSet

```javascript
import { primaSet, mean, stddev, entropy } from 'primalib'
import { primes } from 'primalib'

// Analyze prime distribution
const primeData = primes.take(100).toArray()

mean(primeData)      // → ~50
stddev(primeData)    // → ~28.9
entropy(primeData)   // → ~6.64

// Moving average of prime gaps
import { primeGaps, movingAverage } from 'primalib'
const gaps = primeGaps.take(100).map(g => g.gap)
movingAverage(gaps, 5).take(10).toArray()
```

## ⚡ **Performance Notes**

- **Lazy Evaluation**: Time series functions (`movingAverage`, `ema`, `differences`) return lazy `primaSet`
- **Materialization**: Most functions materialize data arrays - use `take()` for large datasets
- **Async Functions**: Primal geometry functions are async - use `await` or `.then()`
- **Memory**: Histogram and distribution functions materialize data - be careful with large datasets

## 🔗 **Integration**

PrimaStat integrates seamlessly with other PrimaLib modules:

```javascript
import { mean, stddev, entropy } from 'primalib'
import { primes, primeGaps, twins } from 'primalib'
import { primaSet } from 'primalib'

// Analyze primes
const primeData = primes.take(100).toArray()
mean(primeData)
stddev(primeData)
entropy(primeData)

// Analyze gaps
const gaps = primeGaps.take(1000).map(g => g.gap)
import { gapDistribution } from 'primalib'
const dist = gapDistribution(gaps)

// Time series analysis
import { movingAverage } from 'primalib'
movingAverage(gaps, 10).take(50).toArray()
```

## 🎓 **Mathematical Background**

### Statistics
- **Mean**: `μ = Σx / n`
- **Variance**: `σ² = Σ(x - μ)² / (n-1)`
- **Standard Deviation**: `σ = √σ²`
- **Median**: Middle value when sorted
- **Percentile**: Value at p% of sorted data

### Information Theory
- **Shannon Entropy**: `H = -Σ p(x) log₂(p(x))`
- **Maximum Entropy**: `log₂(n)` for n equally likely outcomes
- **Relative Entropy**: `H / H_max` (normalized entropy)

### Correlation
- **Pearson Correlation**: `r = Σ(x-μₓ)(y-μᵧ) / √(Σ(x-μₓ)² Σ(y-μᵧ)²)`
- **R²**: Coefficient of determination (proportion of variance explained)

### Time Series
- **Moving Average**: `MA = Σx[i-k..i] / k`
- **EMA**: `EMA = α·x + (1-α)·EMA_prev`

### Distribution Fitting
- **Chi-square**: `χ² = Σ (O - E)² / E`
- **Hardy-Littlewood**: Twin prime density prediction

---

**PrimaStat** provides comprehensive statistical analysis tools for exploring mathematical data, prime distributions, and geometric structures with lazy evaluation support. 🎯

