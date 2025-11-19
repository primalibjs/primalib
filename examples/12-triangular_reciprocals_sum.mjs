/**
 * Example 12: Triangular Numbers and Sum of Reciprocals
 * 
 * Demonstrates:
 * - Triangular numbers: T(n) = n*(n+1)/2
 * - Sum of reciprocals: Σ 2/(n*(n+1)) = 2*Σ(1/n - 1/(n+1))
 * - Partial sums at powers of 2 up to 10⁶
 * 
 * The sum telescopes: 2/(n*(n+1)) = 2*(1/n - 1/(n+1))
 * Partial sum up to N: 2*(1 - 1/(N+1)) = 2*N/(N+1)
 * As N → ∞, the sum converges to 2
 */

import { N, primaSet } from '../primalib.mjs'
const { sum } = primaSet

console.log('=== Example 12: Triangular Reciprocals Sum ===\n')

// Triangular numbers: T(n) = n*(n+1)/2
const triangular = n => n * (n + 1) / 2

// Reciprocal of triangular numbers: 2/(n*(n+1))
const triangularReciprocal = n => 2 / (n * (n + 1))

console.log('Triangular numbers T(n) = n*(n+1)/2:')
const firstTriangulars = N(10).map(triangular).toArray()
console.log(`T(1..10): [${firstTriangulars.join(', ')}]`)

console.log('\nReciprocals 2/(n*(n+1)):')
const firstReciprocals = N(10).map(triangularReciprocal).toArray()
console.log(`R(1..10): [${firstReciprocals.map(r => r.toFixed(6)).join(', ')}]`)

// Calculate partial sums at powers of 2
console.log('\nPartial sums Σ 2/(n*(n+1)) at powers of 2:')
console.log('─'.repeat(70))
console.log('  n      |  T(n)  |  Sum up to n  |  Theoretical (2n/(n+1))')
console.log('─'.repeat(70))

const maxN = 1_000_000
let power = 1

while (power <= maxN) {
  const triangularN = triangular(power)
  // Use theoretical formula (exact due to telescoping)
  const partialSum = 2 * power / (power + 1)
  const theoretical = partialSum
  
  console.log(
    `  ${power.toString().padStart(7)} | ${triangularN.toString().padStart(7)} | ${partialSum.toFixed(10).padStart(14)} | ${theoretical.toFixed(10).padStart(20)}`
  )
  
  power *= 2
}

// Show convergence to 2
console.log('\n' + '─'.repeat(70))
console.log('As n → ∞, the sum converges to 2')
const finalSum = 2 * maxN / (maxN + 1)
console.log(`Final sum (n=${maxN}): ${finalSum.toFixed(10)}`)
console.log(`Theoretical limit: 2.0000000000`)

// Verify by computing actual sum for a smaller value
console.log('\nVerification: Computing actual sum for n=1000')
const verifyN = 1000
const computedSum = sum(N(verifyN).map(triangularReciprocal).toArray())
const theoreticalSum = 2 * verifyN / (verifyN + 1)
console.log(`  Computed sum:   ${computedSum.toFixed(10)}`)
console.log(`  Theoretical:    ${theoreticalSum.toFixed(10)}`)
console.log(`  Match: ${Math.abs(computedSum - theoreticalSum) < 1e-10 ? '✓' : '✗'}`)

// Verify telescoping property
console.log('\nVerifying telescoping property:')
console.log('2/(n*(n+1)) = 2*(1/n - 1/(n+1))')
const n = 5
const direct = triangularReciprocal(n)
const telescoped = 2 * (1/n - 1/(n+1))
console.log(`For n=${n}:`)
console.log(`  Direct: ${direct.toFixed(10)}`)
console.log(`  Telescoped: ${telescoped.toFixed(10)}`)
console.log(`  Match: ${Math.abs(direct - telescoped) < 1e-10 ? '✓' : '✗'}`)
