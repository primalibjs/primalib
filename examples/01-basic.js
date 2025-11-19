/**
 * Example 1: Basic Usage
 * 
 * Simple examples showing PrimaLib's core features
 */

import { N, pipe, primaSet } from 'primalib'
const { sq, sum, take } = primaSet

console.log('=== Example 1: Basic Usage ===\n')

// Sum of squares of first 10 naturals
console.log('Sum of squares (1² + 2² + ... + 10²):')
console.log(sum(sq(N(10))))  // → 385

// Using pipe
const sumOfSquares = pipe(N, take(10), sq, sum)
console.log('\nUsing pipe:')
console.log(sumOfSquares())  // → 385

// Works with arrays too
console.log('\nWith arrays:')
console.log(sum(sq([1, 2, 3, 4, 5])))  // → 55

// Lazy sets
console.log('\nLazy infinite sequence:')
const squares = N().sq()
console.log([...squares.take(5)])  // → [1, 4, 9, 16, 25]

