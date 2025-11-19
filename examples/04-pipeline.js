/**
 * Example 4: Pipeline Composition
 * 
 * Building reusable mathematical pipelines
 */

import { N, pipe, primaSet } from 'primalib'
const { sq, inv, take, sum } = primaSet

console.log('=== Example 4: Pipeline Composition ===\n')

// Build a reusable pipeline
const sumOfSquares = pipe(take(10), sq, sum)
console.log('Sum of squares pipeline:')
console.log(sumOfSquares(N()))  // → 385
console.log(sumOfSquares([1, 2, 3, 4, 5]))  // → 55

// More complex pipeline
const invOfSquares = pipe(sq, inv, take(5))
console.log('\nInverse of squares:')
console.log([...invOfSquares(N())])  // → [1, 0.25, 0.111..., 0.0625, 0.04]

// Method chaining
console.log('\nMethod chaining:')
console.log(N(10).sq().sum())  // → 385

