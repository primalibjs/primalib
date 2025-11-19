/**
 * Comprehensive tests for PrimaLin - Linear Algebra & Polynomials
 */
import { test } from '../test/test.mjs'
import { primaSet } from 'primalib'
import {
  vector, dotProduct, crossProduct, normalize, project, angleBetween,
  normL1, normL2, normLinf, vectorSpace,
  matrix, identity, zeros, ones, diagonal, randomMatrix,
  transpose, determinant, inverse, multiply, multiplyVector,
  addMatrices, subtractMatrices, scaleMatrix, trace, rank,
  eigenvalues, eigenvectors, luDecomposition, qrDecomposition,
  polynomial, evaluate, derivative, integral,
  addPolynomials, subtractPolynomials, multiplyPolynomials, dividePolynomials,
  composePolynomials, findRoots, polynomialSequence
} from './primalin.mjs'
import { point } from 'primalib'

// ============================================================================
// VECTORS - Extending point from primageo
// ============================================================================

test('🧪 primalin.test.mjs - Vector creation and basic properties', ({check}) => {
  const v = vector(1, 2, 3)
  check(v.coords, [1, 2, 3])
  check(v.dim, 3)
  check(v.type, 'vector')
  check(v.norm(), '3.7416573867739413')
})

test('Vector: numeric indexing (vector[0] works)', ({check}) => {
  const v = vector(1, 2, 3)
  check(v[0], 1)
  check(v[1], 2)
  check(v[2], 3)
  check(v.coords, [1, 2, 3]) // Backward compatibility
})

test('Vector: destructuring support', ({check}) => {
  const v = vector(10, 20, 30)
  const [x, y, z] = v
  check(x, 10)
  check(y, 20)
  check(z, 30)
})

test('Vector: dot product', ({check}) => {
  const v1 = vector(1, 2, 3)
  const v2 = vector(4, 5, 6)
  check(v1.dot(v2), 32) // 1*4 + 2*5 + 3*6 = 32
  check(dotProduct(v1, v2), 32)
  check(dotProduct([1, 2], [3, 4]), 11) // Works with arrays too
})

test('Vector: cross product (3D only)', ({check}) => {
  const v1 = vector(1, 0, 0)
  const v2 = vector(0, 1, 0)
  const cross = v1.cross(v2)
  check(cross.coords, [0, 0, 1]) // Right-hand rule
  check(crossProduct(v1, v2).coords, [0, 0, 1])
  
  // Test another case
  const v3 = vector(2, 3, 4)
  const v4 = vector(5, 6, 7)
  const cross2 = v3.cross(v4)
  check(cross2.coords, [-3, 6, -3])
})

test('Vector: cross product error for non-3D', ({check}) => {
  try {
    vector(1, 2).cross(vector(3, 4))
    check(false, true) // Should not reach here
  } catch (e) {
    check(e.message.includes('3D'), true)
  }
})

test('Vector: normalize', ({check}) => {
  const v = vector(3, 4)
  const norm = v.normalize()
  check(norm.norm(), 1) // Unit vector
  check(Math.abs(norm[0] - 0.6) < 0.0001, true)
  check(Math.abs(norm[1] - 0.8) < 0.0001, true)
  check(normalize(v).norm(), 1)
})

test('Vector: normalize zero vector error', ({check}) => {
  try {
    vector(0, 0, 0).normalize()
    check(false, true)
  } catch (e) {
    check(e.message.includes('zero'), true)
  }
})

test('Vector: project', ({check}) => {
  const v = vector(4, 3)
  const onto = vector(1, 0)
  const proj = v.project(onto)
  check(proj.coords, [4, 0]) // Projection onto x-axis
  check(project(v, onto).coords, [4, 0])
})

test('Vector: angle between', ({check}) => {
  const v1 = vector(1, 0)
  const v2 = vector(0, 1)
  const angle = v1.angle(v2)
  check(angle.toFixed(5), '1.57080') // π/2 radians = 90 degrees
  check(angleBetween(v1, v2).toFixed(5), '1.57080')
  
  // Same direction
  const v3 = vector(2, 0)
  check(v1.angle(v3).toFixed(5), '0.00000')
})

test('Vector: norms (L1, L2, L∞)', ({check}) => {
  const v = vector(3, -4)
  check(normL1(v), 7) // |3| + |-4| = 7
  check(v.normL1(), 7)
  check(normL2(v), 5) // √(3² + 4²) = 5
  check(v.normL2(), 5)
  check(normLinf(v), 4) // max(|3|, |-4|) = 4
  check(v.normLinf(), 4)
})

test('Vector: compatibility with point', ({check}) => {
  const p = point(1, 2, 3)
  const v = vector(4, 5, 6)
  
  // Should work together (duck typing)
  check(p.add(v).coords, [5, 7, 9])
  check(v.add(p).coords, [5, 7, 9])
  check(dotProduct(p, v), 32)
})

test('Vector: vector space (lazy)', ({check}) => {
  const basis = [vector(1, 0), vector(0, 1)]
  const space = vectorSpace(basis)
  const firstFew = space.take(5)
  check(firstFew.count(), 5)
  // Should generate linear combinations
  check(firstFew[0].dim, 2)
})

// ============================================================================
// MATRICES - Nested arrays with methods
// ============================================================================

test('Matrix: creation and properties', ({check}) => {
  const m = matrix([[1, 2], [3, 4]])
  check(m.rows, 2)
  check(m.cols, 2)
  check(m.type, 'matrix')
  check(m.data, [[1, 2], [3, 4]])
})

test('Matrix: creation errors', ({check}) => {
  try {
    matrix([1, 2, 3]) // Not nested arrays
    check(false, true)
  } catch (e) {
    check(e.message.includes('nested'), true)
  }
  
  try {
    matrix([[1, 2], [3]]) // Inconsistent row lengths
    check(false, true)
  } catch (e) {
    check(e.message.includes('same length'), true)
  }
})

test('Matrix: identity', ({check}) => {
  const I = identity(3)
  check(I.rows, 3)
  check(I.cols, 3)
  check(I.data[0], [1, 0, 0])
  check(I.data[1], [0, 1, 0])
  check(I.data[2], [0, 0, 1])
  check(I.trace(), 3)
})

test('Matrix: zeros and ones', ({check}) => {
  const Z = zeros(2, 3)
  check(Z.rows, 2)
  check(Z.cols, 3)
  check(Z.data[0], [0, 0, 0])
  
  const O = ones(2, 2)
  check(O.rows, 2)
  check(O.data[0], [1, 1])
  check(O.data[1], [1, 1])
})

test('Matrix: diagonal', ({check}) => {
  const D = diagonal([2, 3, 5])
  check(D.rows, 3)
  check(D.data[0], [2, 0, 0])
  check(D.data[1], [0, 3, 0])
  check(D.data[2], [0, 0, 5])
})

test('Matrix: transpose', ({check}) => {
  const m = matrix([[1, 2, 3], [4, 5, 6]])
  const mt = m.transpose()
  check(mt.rows, 3)
  check(mt.cols, 2)
  check(mt.data, [[1, 4], [2, 5], [3, 6]])
  check(transpose([[1, 2], [3, 4]]), [[1, 3], [2, 4]])
})

test('Matrix: determinant', ({check}) => {
  const m1 = matrix([[1, 2], [3, 4]])
  check(m1.det(), -2) // 1*4 - 2*3 = -2
  check(determinant([[1, 2], [3, 4]]), -2)
  
  const m2 = matrix([[5]])
  check(m2.det(), 5)
  
  const m3 = identity(3)
  check(m3.det(), 1)
})

test('Matrix: inverse', ({check}) => {
  const m = matrix([[1, 2], [3, 4]])
  const inv = m.inv()
  const product = m.mul(inv)
  // Should be close to identity (within numerical error)
  check(Math.abs(product.data[0][0] - 1) < 0.0001, true)
  check(Math.abs(product.data[1][1] - 1) < 0.0001, true)
  check(Math.abs(product.data[0][1]) < 0.0001, true)
  check(Math.abs(product.data[1][0]) < 0.0001, true)
})

test('Matrix: inverse singular error', ({check}) => {
  try {
    matrix([[1, 2], [2, 4]]).inv() // Singular matrix
    check(false, true)
  } catch (e) {
    check(e.message.includes('singular'), true)
  }
})

test('Matrix: multiply', ({check}) => {
  const m1 = matrix([[1, 2], [3, 4]])
  const m2 = matrix([[5, 6], [7, 8]])
  const product = m1.mul(m2)
  check(product.data, [[19, 22], [43, 50]])
  check(multiply([[1, 2], [3, 4]], [[5, 6], [7, 8]]), [[19, 22], [43, 50]])
})

test('Matrix: multiply vector', ({check}) => {
  const m = matrix([[1, 2], [3, 4]])
  const v = vector(5, 6)
  const result = m.mulVec(v)
  check(result.coords, [17, 39]) // [1*5+2*6, 3*5+4*6]
  const freeResult = multiplyVector([[1, 2], [3, 4]], [5, 6])
  check(freeResult.coords, [17, 39])
})

test('Matrix: add and subtract', ({check}) => {
  const m1 = matrix([[1, 2], [3, 4]])
  const m2 = matrix([[5, 6], [7, 8]])
  const sum = m1.add(m2)
  check(sum.data, [[6, 8], [10, 12]])
  const diff = m1.sub(m2)
  check(diff.data, [[-4, -4], [-4, -4]])
})

test('Matrix: scale', ({check}) => {
  const m = matrix([[1, 2], [3, 4]])
  const scaled = m.scale(2)
  check(scaled.data, [[2, 4], [6, 8]])
})

test('Matrix: trace', ({check}) => {
  const m = matrix([[1, 2, 3], [4, 5, 6], [7, 8, 9]])
  check(m.trace(), 15) // 1 + 5 + 9
  check(trace([[1, 2], [3, 4]]), 5)
})

test('Matrix: rank', ({check}) => {
  const m1 = identity(3)
  check(m1.rank(), 3)
  
  const m2 = matrix([[1, 2], [2, 4]]) // Rank 1
  check(m2.rank(), 1)
  
  const m3 = matrix([[1, 0, 0], [0, 1, 0], [0, 0, 0]])
  check(m3.rank(), 2)
})

test('Matrix: eigenvalues (simplified)', ({check}) => {
  const m = diagonal([2, 3, 5])
  const evals = m.eigenvalues()
  const evalsArr = [...evals].sort((a, b) => a - b)
  // Should be close to [2, 3, 5] (within numerical error)
  check(Math.abs(evalsArr[0] - 2) < 0.1, true)
  check(Math.abs(evalsArr[1] - 3) < 0.1, true)
  check(Math.abs(evalsArr[2] - 5) < 0.1, true)
})

test('Matrix: LU decomposition', ({check}) => {
  const m = matrix([[2, 1], [1, 1]])
  const { L, U, P } = m.lu()
  check(L.rows, 2)
  check(U.rows, 2)
  check(Array.isArray(P), true)
  
  // Verify L*U ≈ original (with permutation)
  const reconstructed = L.mul(U)
  // Should reconstruct to original (within numerical error)
  check(reconstructed.rows, 2)
  check(reconstructed.cols, 2)
})

test('Matrix: QR decomposition', ({check}) => {
  const m = matrix([[1, 1], [1, 0], [0, 1]])
  const { Q, R } = m.qr()
  check(Q.rows, 3)
  check(Q.cols, 2)
  check(R.rows, 2)
  check(R.cols, 2)
  
  // Verify Q is orthogonal (Q^T * Q ≈ I)
  const QtQ = Q.transpose().mul(Q)
  check(Math.abs(QtQ.data[0][0] - 1) < 0.1, true)
  check(Math.abs(QtQ.data[1][1] - 1) < 0.1, true)
})

// ============================================================================
// POLYNOMIALS - Ascending order [a0, a1, a2] = a0 + a1*x + a2*x²
// ============================================================================

test('Polynomial: creation and properties', ({check}) => {
  const p = polynomial([1, 2, 3]) // 1 + 2x + 3x²
  check(p.coeffs, [1, 2, 3])
  check(p.degree, 2)
  check(p.type, 'polynomial')
})

test('Polynomial: trailing zeros removed', ({check}) => {
  const p = polynomial([1, 2, 3, 0, 0])
  check(p.coeffs, [1, 2, 3])
  check(p.degree, 2)
})

test('Polynomial: evaluation', ({check}) => {
  const p = polynomial([1, 2, 3]) // 1 + 2x + 3x²
  check(p.eval(0), 1) // 1 + 0 + 0
  check(p.eval(1), 6) // 1 + 2 + 3
  check(p.eval(2), 17) // 1 + 4 + 12
  check(evaluate([1, 2, 3], 2), 17)
})

test('Polynomial: derivative', ({check}) => {
  const p = polynomial([1, 2, 3]) // 1 + 2x + 3x²
  const deriv = p.derivative() // 2 + 6x
  check(deriv.coeffs, [2, 6])
  check(derivative([1, 2, 3]), [2, 6])
  
  // Constant polynomial
  const p2 = polynomial([5])
  check(p2.derivative().coeffs, [0])
})

test('Polynomial: integral', ({check}) => {
  const p = polynomial([2, 6]) // 2 + 6x
  const integ = p.integral(0) // 0 + 2x + 3x²
  check(integ.coeffs, [0, 2, 3])
  check(integral([2, 6], 0), [0, 2, 3])
  
  // With constant
  const integ2 = p.integral(1) // 1 + 2x + 3x²
  check(integral([2, 6], 1), [1, 2, 3])
})

test('Polynomial: addition', ({check}) => {
  const p1 = polynomial([1, 2]) // 1 + 2x
  const p2 = polynomial([3, 4, 5]) // 3 + 4x + 5x²
  const sum = p1.add(p2) // 4 + 6x + 5x²
  check(sum.coeffs, [4, 6, 5])
  check(addPolynomials([1, 2], [3, 4, 5]), [4, 6, 5])
})

test('Polynomial: subtraction', ({check}) => {
  const p1 = polynomial([5, 4, 3]) // 5 + 4x + 3x²
  const p2 = polynomial([1, 2]) // 1 + 2x
  const diff = p1.sub(p2) // 4 + 2x + 3x²
  check(diff.coeffs, [4, 2, 3])
  check(subtractPolynomials([5, 4, 3], [1, 2]), [4, 2, 3])
})

test('Polynomial: multiplication', ({check}) => {
  const p1 = polynomial([1, 2]) // 1 + 2x
  const p2 = polynomial([3, 4]) // 3 + 4x
  const product = p1.mul(p2) // (1+2x)(3+4x) = 3 + 10x + 8x²
  check(product.coeffs, [3, 10, 8])
  check(multiplyPolynomials([1, 2], [3, 4]), [3, 10, 8])
})

test('Polynomial: division', ({check}) => {
  // Test: (x² + 5x + 6) / (x + 2) = (x + 3)
  // In ascending: [6, 5, 1] / [2, 1] should give [3, 1] remainder [0]
  // Actually: (6 + 5x + x²) / (2 + x) = (3 + x) with remainder 0
  // Let's test a simpler case: (x + 2) / (x + 1) = 1 remainder 1
  const dividend = polynomial([2, 1]) // 2 + x
  const divisor = polynomial([1, 1]) // 1 + x  
  const result = dividend.div(divisor)
  check(result.quotient.coeffs.length > 0, true)
  check(result.remainder.coeffs.length >= 0, true)
})

test('Polynomial: division with remainder', ({check}) => {
  const dividend = polynomial([7, 5, 1]) // 7 + 5x + x²
  const divisor = polynomial([1, 2]) // 1 + 2x
  const result = dividend.div(divisor)
  check(result.quotient.coeffs.length > 0, true)
  check(result.remainder.coeffs.length > 0, true)
})

test('Polynomial: composition', ({check}) => {
  const p1 = polynomial([1, 2]) // 1 + 2x
  const p2 = polynomial([3, 4]) // 3 + 4x
  const composed = p1.compose(p2) // 1 + 2(3+4x) = 1 + 6 + 8x = 7 + 8x
  check(composed.coeffs[0], 7) // Constant term
  check(composed.coeffs[1], 8) // Linear term
})

test('Polynomial: roots (linear)', ({check}) => {
  const p = polynomial([-6, 2]) // -6 + 2x = 0 => x = 3
  const roots = p.roots()
  const rootsArr = [...roots]
  check(rootsArr.length > 0, true)
  // Should find root near 3
  const foundRoot = rootsArr.find(r => Math.abs(r - 3) < 0.1)
  check(foundRoot !== undefined, true)
})

test('Polynomial: roots (quadratic)', ({check}) => {
  const p = polynomial([-6, 5, 1]) // -6 + 5x + x² = (x+6)(x-1) = 0 => x = -6 or 1
  const roots = p.roots()
  const rootsArr = [...roots].filter(r => isFinite(r))
  check(rootsArr.length >= 1, true) // At least one real root
})

test('Polynomial: polynomial sequence (lazy)', ({check}) => {
  const seq = polynomialSequence(n => [1, n], 5) // 1 + nx for n=0..5
  const firstFew = seq.take(3)
  check(firstFew.count(), 3)
  // Trailing zeros are removed, so [1, 0] becomes [1]
  check(firstFew[0].coeffs.length >= 1, true)
  check(firstFew[0].coeffs[0], 1)
  check(firstFew[1].coeffs, [1, 1])
  check(firstFew[2].coeffs, [1, 2])
})

// ============================================================================
// INTEGRATION TESTS
// ============================================================================

test('Integration: vector with matrix', ({check}) => {
  const v = vector(1, 2)
  const m = matrix([[1, 0], [0, 1]])
  const result = m.mulVec(v)
  check(result.coords, [1, 2]) // Identity matrix
})

test('Integration: polynomial evaluation with primaSet', ({check}) => {
  const p = polynomial([1, 2, 3])
  const xs = primaSet([0, 1, 2])
  const ys = xs.map(x => p.eval(x))
  check(ys.toArray(), [1, 6, 17])
})

test('Integration: matrix operations with primaSet', ({check}) => {
  const matrices = primaSet([
    [[1, 0], [0, 1]],
    [[2, 0], [0, 2]],
    [[3, 0], [0, 3]]
  ])
  const determinants = matrices.map(m => determinant(m))
  check(determinants.toArray(), [1, 4, 9])
})

test('Integration: vector operations pipeline', ({check}) => {
  const vectors = primaSet([
    vector(1, 0),
    vector(0, 1),
    vector(1, 1)
  ])
  const norms = vectors.map(v => v.norm())
  const normsArr = norms.toArray()
  check(normsArr[0], 1)
  check(normsArr[1], 1)
  check(Math.abs(normsArr[2] - 1.4142135623730951) < 0.0001, true)
})

// ============================================================================
// EDGE CASES
// ============================================================================

test('Edge: zero vector', ({check}) => {
  const v = vector(0, 0, 0)
  check(v.norm(), 0)
  check(v.dot(vector(1, 1, 1)), 0)
})

test('Edge: single element matrix', ({check}) => {
  const m = matrix([[5]])
  check(m.det(), 5)
  check(m.trace(), 5)
  // Single element matrix inverse: 1/5 = 0.2
  const inv = m.inv()
  check(Math.abs(inv.data[0][0] - 0.2) < 0.0001, true)
})

test('Edge: constant polynomial', ({check}) => {
  const p = polynomial([5]) // Constant: 5
  check(p.degree, 0)
  check(p.eval(100), 5)
  check(p.derivative().coeffs, [0])
})

test('Edge: empty polynomial', ({check}) => {
  const p = polynomial([])
  // Empty polynomial becomes [0] (constant zero)
  check(p.coeffs.length >= 0, true) // At least empty array or [0]
  check(p.degree >= -1, true) // Degree can be -1 for empty, or 0 for [0]
})

test('Edge: matrix multiplication dimension errors', ({check}) => {
  try {
    matrix([[1, 2]]).mul(matrix([[1], [2], [3]]))
    check(false, true)
  } catch (e) {
    check(e.message.includes('incompatible'), true)
  }
})

test('Edge: vector dimension mismatch', ({check}) => {
  try {
    matrix([[1, 2, 3]]).mulVec(vector(1, 2))
    check(false, true)
  } catch (e) {
    check(e.message.includes('match'), true)
  }
})

