# PrimaLib Type Inventory

## Core Types

### PrimaSet
- `PrimaSet<T>` - Lazy iterable set
- `PrimaSetConstructor` - Factory and plugin system

### Sequences
- `N` - Natural numbers generator
- `Z` - Integers generator  
- `R` - Real numbers generator
- `primes` - Prime numbers generator
- `primes6k` - Primes in 6k±1 pattern
- `evens` - Even numbers
- `odds` - Odd numbers
- `multiplesOf(k)` - Multiples generator

### Prime Constellations
- `twins` - Twin primes
- `cousins` - Cousin primes
- `sexy` - Sexy primes
- `primeGaps` - Prime gap sequence

## Operations

### Algebraic (Unary)
- `sq` - Square
- `inv` - Inverse (1/x)
- `neg` - Negate

### Algebraic (Binary)
- `add` - Addition
- `sub` - Subtraction
- `mul` - Multiplication
- `div` - Division
- `mod` - Euclidean modulo
- `scale` - Scalar multiply
- `shift` - Scalar add

### Statistical (Variadic)
- `sum` - Sum
- `mean` - Average
- `min` - Minimum
- `max` - Maximum

### Utilities
- `clamp` - Clamp value
- `sigmoid` - Sigmoid function
- `factorial` - Factorial (with bignum)
- `gcd` - Greatest common divisor
- `lcm` - Least common multiple
- `firstDivisor` - First prime divisor

## Methods

### Transformations
- `map(f)` - Transform each element
- `filter(p)` - Filter elements
- `take(n, opts?)` - Take first n (lazy)
- `skip(n)` - Skip first n
- `reduce(f, init)` - Fold operation

### Combinators
- `zip(other, f?)` - Pair with another set
- `concat(...others)` - Concatenate sets
- `flatten()` - Flatten nested sets

### Utilities
- `toArray()` - Materialize to array
- `get(index)` - Get element by index
- `first()` - First element
- `count()` - Count elements
- `isEmpty()` - Check if empty
- `pipe(...fns)` - Compose functions

### Grouping
- `groupBy(fn)` - Group by key
- `chunk(size)` - Split into chunks
- `window(size)` - Sliding window

### Ordering
- `sort(opts?)` - Sort (lazy)
- `sortBy(f, opts?)` - Sort by function
- `unique()` - Remove duplicates

### Sampling
- `sample(n)` - Random sample
- `cycle()` - Infinite cycle

## Geometry Types

### Point
- `point(...coords)` - Create point
- `Point.add(p)` - Vector addition
- `Point.subtract(p)` - Vector subtraction
- `Point.scale(f)` - Scalar multiply
- `Point.norm()` - Euclidean norm

### Hypercube
- `hypercube(corner, sides)` - Create hypercube
- `Hypercube.vertices()` - Get vertices
- `Hypercube.sample(res)` - Sample points
- `Space.subdivide(dimIdx, parts)` - Subdivide space along dimension

## Number Theory Types

### Address (CRT)
- `address(n, dims?)` - Get CRT address
- `address.toNumber(rem)` - Reconstruct number
- `address.isResidual(addr)` - Check residual

### Primal Geometry
- `primalPosition(n, dims)` - Position in hypercube
- `primalDistance(n1, n2, dims)` - Distance
- `primalCloud(numbers, dims)` - Cloud of points
- `primeCloud(count, dims)` - Prime cloud

### Goldbach
- `goldbachPairs(n)` - Goldbach pairs
- `goldbachTable(maxEven)` - Table of pairs
- `goldbachVectors(n, k)` - Vector representation

### Residual Space
- `residualSpace(k, limit)` - Residual numbers
- `residualDensity(k)` - Density ratio

### Analysis
- `dimensionStats(k, limit)` - Dimension statistics
- `twinAdmissibility(k, limit)` - Twin prime admissibility

## Statistical Types

### Basic Stats
- `mean(arr)` - Mean
- `median(arr)` - Median
- `stddev(arr)` - Standard deviation
- `variance(arr)` - Variance
- `percentile(arr, p)` - Percentile

### Information Theory
- `entropy(data)` - Shannon entropy
- `relativeEntropy(data, max)` - Relative entropy
- `uniformity(arr)` - Uniformity score

### Correlation
- `correlation(arr1, arr2)` - Pearson correlation
- `linearRegression(x, y)` - Linear regression

### Time Series
- `movingAverage(data, window)` - Moving average
- `ema(data, alpha)` - Exponential moving average
- `differences(data)` - Differences

### Distribution
- `goodnessOfFit(obs, exp)` - Chi-square test
- `hlComparison(actual, nVals, C2)` - Hardy-Littlewood comparison

### Primal-Specific
- `residualCoverageAnalysis(dims, limit)` - Coverage analysis
- `gapDistribution(gaps)` - Gap distribution
- `twinDensityByDimension(maxDim, limit)` - Twin density
- `goldbachDistribution(maxEven, step)` - Goldbach distribution
- `addressSpectrum(numbers, dim)` - Address spectrum

### Comparative
- `compareDistributions(...datasets)` - Compare multiple
- `summary(data)` - Summary statistics

## Utility Types

### Sequences
- `range(start, end, step)` - Range generator
- `histogram(set, bins)` - Histogram

### Functions
- `pipe(...fns)` - Function composition
- `isPrime(n)` - Prime check

## Error Types

- `PrimaError` - Base error
- `ProxyError` - Proxy access error
- `InfiniteLoopError` - Timeout error
- `DimensionError` - Dimension mismatch
- `MaterializationError` - Materialization error

