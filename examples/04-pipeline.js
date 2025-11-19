/**
 * Example 4: Pipeline Composition
 * 
 * Building reusable mathematical pipelines
 */

import { N, pipe } from '../primalib.mjs'
import { primaSet } from '../primaset.mjs'
const { sq, sqrt, take, sum } = primaSet

console.log('=== Example 4: Pipeline Composition ===\n')

// Build a reusable pipeline
const sumOfSquares = pipe(take(10), sq, sum)
console.log('Sum of squares pipeline:')
console.log(sumOfSquares(N()))  // → 385
console.log(sumOfSquares([1, 2, 3, 4, 5]))  // → 55

// More complex pipeline
const sqrtOfSquares = pipe(sq, sqrt, take(5))
console.log('\nSquare root of squares:')
console.log([...sqrtOfSquares(N())])  // → [1, 2, 3, 4, 5]

// Method chaining
console.log('\nMethod chaining:')
console.log(N(10).sq().sum())  // → 385

