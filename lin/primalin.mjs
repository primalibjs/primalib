/**
 * PrimaLin - Linear Algebra & Polynomials module for PrimaLib
 * Vectors (extending point), Matrices, and Polynomials
 * Architecture: Extends primageo.point, uses primaset for lazy operations
 */

import { primaSet } from '@primalib/core'
import { point } from '@primalib/geo'
import { vector } from '@primalib/core'

// ============================================================================
// VECTORS - Using vector from point.mjs (already extends point)
// ============================================================================

// Vector is imported from @primalib/geo (point.mjs)
// It already has: dot, cross, normalize, project, angle, normL1, normL2, normLinf

// Free functions for vector operations
const dotProduct = (v1, v2) => {
  const c1 = v1.coords || v1
  const c2 = v2.coords || v2
  return c1.reduce((sum, c, i) => sum + c * (c2[i] || 0), 0)
}

const crossProduct = (v1, v2) => {
  const c1 = v1.coords || v1
  const c2 = v2.coords || v2
  if (c1.length !== 3 || c2.length !== 3) {
    throw new Error('Cross product requires 3D vectors')
  }
  return vector(
    c1[1] * c2[2] - c1[2] * c2[1],
    c1[2] * c2[0] - c1[0] * c2[2],
    c1[0] * c2[1] - c1[1] * c2[0]
  )
}

const normalize = (v) => {
  const n = v.norm ? v.norm() : normL2(v)
  if (n === 0) throw new Error('Cannot normalize zero vector')
  return v.scale ? v.scale(1 / n) : vector(...(v.coords || v).map(c => c / n))
}

const project = (v, onto) => {
  const dot = dotProduct(v, onto)
  const ontoNorm2 = dotProduct(onto, onto)
  if (ontoNorm2 === 0) throw new Error('Cannot project onto zero vector')
  const scale = dot / ontoNorm2
  return onto.scale ? onto.scale(scale) : vector(...(onto.coords || onto).map(c => c * scale))
}

const angleBetween = (v1, v2) => {
  const dot = dotProduct(v1, v2)
  const n1 = v1.norm ? v1.norm() : normL2(v1)
  const n2 = v2.norm ? v2.norm() : normL2(v2)
  if (n1 === 0 || n2 === 0) throw new Error('Cannot compute angle with zero vector')
  return Math.acos(Math.max(-1, Math.min(1, dot / (n1 * n2))))
}

const normL1 = (v) => {
  const c = v.coords || v
  return c.reduce((sum, x) => sum + Math.abs(x), 0)
}

const normL2 = (v) => {
  const c = v.coords || v
  return Math.sqrt(c.reduce((sum, x) => sum + x * x, 0))
}

const normLinf = (v) => {
  const c = v.coords || v
  return Math.max(...c.map(Math.abs))
}

// Vector space operations (lazy)
const vectorSpace = (basis) => {
  return primaSet(function* () {
    // Generate all linear combinations (lazy)
    // For finite basis, generate combinations up to some limit
    const dim = basis.length
    const maxCoeff = 10 // Configurable
    for (let i = 0; i < maxCoeff ** dim; i++) {
      const coeffs = []
      let temp = i
      for (let j = 0; j < dim; j++) {
        coeffs.push((temp % maxCoeff) - Math.floor(maxCoeff / 2))
        temp = Math.floor(temp / maxCoeff)
      }
      const combo = basis.reduce((acc, vec, idx) => {
        const v = vec.coords || vec
        return acc.add ? acc.add(vec.scale(coeffs[idx])) : vector(...v.map((c, i) => (acc.coords?.[i] || 0) + c * coeffs[idx]))
      }, vector(...new Array(basis[0]?.coords?.length || basis[0]?.length || 0).fill(0)))
      yield combo
    }
  })
}

// ============================================================================
// MATRICES - Nested arrays with methods
// ============================================================================

const matrix = (data) => {
  if (!Array.isArray(data) || !data.every(row => Array.isArray(row))) {
    throw new Error('Matrix data must be nested arrays')
  }
  const rows = data.length
  const cols = data[0]?.length || 0
  if (!data.every(row => row.length === cols)) {
    throw new Error('All matrix rows must have same length')
  }
  
  const matObj = {
    data, rows, cols, type: 'matrix',
    transpose: () => matrix(transpose(data)),
    det: () => determinant(data),
    inv: () => matrix(inverse(data)),
    mul: (other) => {
      if (other.type === 'matrix') return matrix(multiply(data, other.data))
      if (other.coords) return multiplyVector(data, other)
      return matrix(multiply(data, other))
    },
    mulVec: (v) => multiplyVector(data, v),
    add: (other) => matrix(addMatrices(data, other.type === 'matrix' ? other.data : other)),
    sub: (other) => matrix(subtractMatrices(data, other.type === 'matrix' ? other.data : other)),
    scale: (s) => matrix(scaleMatrix(data, s)),
    trace: () => trace(data),
    rank: () => rank(data),
    eigenvalues: () => eigenvalues(data),
    eigenvectors: () => eigenvectors(data),
    lu: () => luDecomposition(matObj),
    qr: () => qrDecomposition(matObj),
    toArray: () => data
  }
  return matObj
}

// Matrix creation functions
const identity = (n) => {
  const data = Array(n).fill(null).map((_, i) => 
    Array(n).fill(0).map((_, j) => i === j ? 1 : 0)
  )
  return matrix(data)
}

const zeros = (m, n = m) => {
  const data = Array(m).fill(null).map(() => Array(n).fill(0))
  return matrix(data)
}

const ones = (m, n = m) => {
  const data = Array(m).fill(null).map(() => Array(n).fill(1))
  return matrix(data)
}

const diagonal = (diag) => {
  const n = diag.length
  const data = Array(n).fill(null).map((_, i) => 
    Array(n).fill(0).map((_, j) => i === j ? diag[i] : 0)
  )
  return matrix(data)
}

const randomMatrix = (m, n = m, min = 0, max = 1) => {
  const data = Array(m).fill(null).map(() => 
    Array(n).fill(0).map(() => Math.random() * (max - min) + min)
  )
  return matrix(data)
}

// Matrix operations
const transpose = (m) => {
  const rows = m.length, cols = m[0]?.length || 0
  return Array(cols).fill(null).map((_, i) => 
    Array(rows).fill(0).map((_, j) => m[j][i])
  )
}

const determinant = (m) => {
  const n = m.length
  if (n !== m[0]?.length) throw new Error('Determinant requires square matrix')
  if (n === 1) return m[0][0]
  if (n === 2) return m[0][0] * m[1][1] - m[0][1] * m[1][0]
  if (n === 3) {
    // Sarrus rule for 3x3 (faster than recursive)
    return m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) -
           m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) +
           m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0])
  }
  
  // For large matrices (n > 3), use LU decomposition (O(n³) vs O(n!) for recursive)
  if (n > 3) {
    try {
      const { L, U, P } = luDecomposition(m)
      // det = det(L) * det(U) * sign(P)
      // L is lower triangular with 1s on diagonal, so det(L) = 1
      const Udata = U.data || U
      let detU = 1
      for (let i = 0; i < n; i++) {
        detU *= Udata[i][i]
      }
      // Count inversions in permutation
      let inversions = 0
      for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
          if (P[i] > P[j]) inversions++
        }
      }
      return detU * (inversions % 2 === 0 ? 1 : -1)
    } catch (error) {
      // If LU fails (singular matrix), fall back to recursive (but warn)
      if (error.message.includes('singular')) {
        // For singular matrices, determinant is 0
        return 0
      }
      // For other errors, fall back to recursive
    }
  }
  
  // Fallback: recursive expansion (only for small matrices or when LU fails)
  let det = 0
  for (let i = 0; i < n; i++) {
    const minor = m.slice(1).map(row => row.filter((_, j) => j !== i))
    det += (i % 2 === 0 ? 1 : -1) * m[0][i] * determinant(minor)
  }
  return det
}

const inverse = (m) => {
  const n = m.length
  if (n !== m[0]?.length) throw new Error('Inverse requires square matrix')
  
  // For small matrices (1x1, 2x2), use direct formula
  if (n === 1) {
    if (Math.abs(m[0][0]) < 1e-10) throw new Error('Matrix is singular (non-invertible)')
    return [[1 / m[0][0]]]
  }
  
  if (n === 2) {
    const det = m[0][0] * m[1][1] - m[0][1] * m[1][0]
    if (Math.abs(det) < 1e-10) throw new Error('Matrix is singular (non-invertible)')
    return [[m[1][1] / det, -m[0][1] / det],
            [-m[1][0] / det, m[0][0] / det]]
  }
  
  // For large matrices (n > 2), use LU decomposition + forward/backward substitution
  if (n > 2) {
    try {
      const { L, U, P } = luDecomposition(m)
      
      // Solve L * U * x = I (identity matrix) for each column
      const I = identity(n).data
      const inv = Array(n).fill(null).map(() => Array(n).fill(0))
      
      const Ldata = L.data || L
      const Udata = U.data || U
      for (let col = 0; col < n; col++) {
        // Forward substitution: L * y = P * I[col]
        const y = Array(n).fill(0)
        for (let i = 0; i < n; i++) {
          let sum = I[P[i]][col]
          for (let j = 0; j < i; j++) {
            sum -= Ldata[i][j] * y[j]
          }
          y[i] = sum / Ldata[i][i]
        }
        
        // Backward substitution: U * x = y
        for (let i = n - 1; i >= 0; i--) {
          let sum = y[i]
          for (let j = i + 1; j < n; j++) {
            sum -= Udata[i][j] * inv[j][col]
          }
          inv[i][col] = sum / Udata[i][i]
        }
      }
      
      return inv
    } catch (error) {
      // If LU fails, fall back to adjugate method
      if (error.message.includes('singular')) {
        throw new Error('Matrix is singular (non-invertible)')
      }
    }
  }
  
  // Fallback: adjugate method (slower but works for all cases)
  const det = determinant(m)
  if (Math.abs(det) < 1e-10) throw new Error('Matrix is singular (non-invertible)')
  const adj = adjugate(m)
  return adj.map(row => row.map(x => x / det))
}

const adjugate = (m) => {
  const n = m.length
  if (n === 1) {
    // For 1x1 matrix, adjugate is [[1]]
    return [[1]]
  }
  const adj = Array(n).fill(null).map(() => Array(n).fill(0))
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const minor = m.filter((_, ri) => ri !== i).map(row => row.filter((_, rj) => rj !== j))
      adj[j][i] = ((i + j) % 2 === 0 ? 1 : -1) * determinant(minor)
    }
  }
  return adj
}

const multiply = (m1, m2) => {
  const rows = m1.length, cols = m2[0]?.length || 0, inner = m1[0]?.length || 0
  if (inner !== m2.length) throw new Error('Matrix dimensions incompatible for multiplication')
  
  const result = Array(rows).fill(null).map(() => Array(cols).fill(0))
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      for (let k = 0; k < inner; k++) {
        result[i][j] += m1[i][k] * m2[k][j]
      }
    }
  }
  return result
}

const multiplyVector = (m, v) => {
  const coords = v.coords || v
  if (m[0]?.length !== coords.length) {
    throw new Error('Matrix columns must match vector dimension')
  }
  const result = m.map(row => 
    row.reduce((sum, val, i) => sum + val * coords[i], 0)
  )
  return vector(...result)
}

const addMatrices = (m1, m2) => {
  if (m1.length !== m2.length || m1[0]?.length !== m2[0]?.length) {
    throw new Error('Matrices must have same dimensions for addition')
  }
  return m1.map((row, i) => row.map((val, j) => val + m2[i][j]))
}

const subtractMatrices = (m1, m2) => {
  if (m1.length !== m2.length || m1[0]?.length !== m2[0]?.length) {
    throw new Error('Matrices must have same dimensions for subtraction')
  }
  return m1.map((row, i) => row.map((val, j) => val - m2[i][j]))
}

const scaleMatrix = (m, s) => {
  return m.map(row => row.map(val => val * s))
}

const trace = (m) => {
  const n = Math.min(m.length, m[0]?.length || 0)
  let sum = 0
  for (let i = 0; i < n; i++) sum += m[i][i]
  return sum
}

const rank = (m) => {
  // Gaussian elimination to find rank
  const rref = reducedRowEchelonForm([...m.map(row => [...row])])
  return rref.filter(row => row.some(x => Math.abs(x) > 1e-10)).length
}

const reducedRowEchelonForm = (m) => {
  let lead = 0
  const rows = m.length, cols = m[0]?.length || 0
  
  for (let r = 0; r < rows; r++) {
    if (cols <= lead) return m
    
    let i = r
    while (Math.abs(m[i][lead]) < 1e-10) {
      i++
      if (rows === i) {
        i = r
        lead++
        if (cols === lead) return m
      }
    }
    
    [m[i], m[r]] = [m[r], m[i]]
    
    const div = m[r][lead]
    if (Math.abs(div) > 1e-10) {
      m[r] = m[r].map(x => x / div)
    }
    
    for (let i = 0; i < rows; i++) {
      if (i !== r) {
        const mult = m[i][lead]
        m[i] = m[i].map((x, j) => x - mult * m[r][j])
      }
    }
    lead++
  }
  return m
}

// Eigenvalues using QR algorithm (iterative)
const eigenvalues = (m, maxIter = 100, tol = 1e-10) => {
  // Handle both matrix objects and arrays
  const data = m.data || m
  const n = data.length
  if (n !== data[0]?.length) throw new Error('Eigenvalues require square matrix')
  
  let A = data.map(row => [...row])
  
  for (let iter = 0; iter < maxIter; iter++) {
    const { Q, R } = qrDecomposition(A)
    // Extract data from matrix objects if needed
    const Qdata = Q.data || Q
    const Rdata = R.data || R
    A = multiply(Rdata, Qdata)
    
    // Check convergence (off-diagonal elements small)
    let converged = true
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (i !== j && Math.abs(A[i][j]) > tol) {
          converged = false
          break
        }
      }
      if (!converged) break
    }
    if (converged) break
  }
  
  return primaSet(A.map((_, i) => A[i][i]))
}

// Eigenvectors (simplified - for distinct eigenvalues)
const eigenvectors = (m) => {
  const evals = [...eigenvalues(m)]
  return primaSet(function* () {
    for (const lambda of evals) {
      // Solve (A - lambda*I) * v = 0
      const n = m.length
      const A_minus_lambdaI = m.map((row, i) => 
        row.map((val, j) => val - (i === j ? lambda : 0))
      )
      
      // Find null space (simplified - return first non-zero solution)
      const rref = reducedRowEchelonForm(A_minus_lambdaI.map(row => [...row]))
      const vec = Array(n).fill(1) // Start with all ones
      
      // Back-substitute (simplified)
      for (let i = n - 1; i >= 0; i--) {
        const row = rref[i]
        const pivot = row.findIndex(x => Math.abs(x) > 1e-10)
        if (pivot >= 0 && pivot < n - 1) {
          let sum = 0
          for (let j = pivot + 1; j < n; j++) {
            sum += row[j] * vec[j]
          }
          vec[pivot] = -sum / row[pivot]
        }
      }
      
      // Normalize
      const norm = Math.sqrt(vec.reduce((s, x) => s + x * x, 0))
      if (norm > 1e-10) {
        yield vector(...vec.map(x => x / norm))
      }
    }
  })
}

// LU Decomposition
const luDecomposition = (m) => {
  // Handle both matrix objects and arrays
  const data = m.data || m
  const n = data.length
  if (n !== data[0]?.length) throw new Error('LU decomposition requires square matrix')
  
  const L = Array(n).fill(null).map(() => Array(n).fill(0))
  let U = data.map(row => [...row])
  const P = Array(n).fill(null).map((_, i) => i) // Permutation
  
  for (let i = 0; i < n; i++) {
    L[i][i] = 1
    
    // Partial pivoting
    let maxRow = i
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(U[k][i]) > Math.abs(U[maxRow][i])) {
        maxRow = k
      }
    }
    
    // Swap rows using temporary variable to avoid destructuring issues
    const tempU = U[i]
    U[i] = U[maxRow]
    U[maxRow] = tempU
    
    const tempP = P[i]
    P[i] = P[maxRow]
    P[maxRow] = tempP
    
    // Gaussian elimination
    for (let j = i + 1; j < n; j++) {
      if (Math.abs(U[i][i]) < 1e-10) throw new Error('Matrix is singular')
      L[j][i] = U[j][i] / U[i][i]
      for (let k = i; k < n; k++) {
        U[j][k] -= L[j][i] * U[i][k]
      }
    }
  }
  
  return { L: matrix(L), U: matrix(U), P }
}

// QR Decomposition (Gram-Schmidt)
const qrDecomposition = (m) => {
  // Handle both matrix objects and arrays
  const data = m.data || m
  const rows = data.length, cols = data[0]?.length || 0
  const Q = Array(rows).fill(null).map(() => Array(cols).fill(0))
  const R = Array(cols).fill(null).map(() => Array(cols).fill(0))
  
  for (let j = 0; j < cols; j++) {
    let v = data.map(row => row[j])
    
    for (let i = 0; i < j; i++) {
      const qi = Q.map(row => row[i])
      const r = dotProduct(v, qi)
      R[i][j] = r
      v = v.map((val, k) => val - r * qi[k])
    }
    
    const norm = Math.sqrt(v.reduce((s, x) => s + x * x, 0))
    if (norm < 1e-10) throw new Error('Matrix columns are linearly dependent')
    R[j][j] = norm
    Q.forEach((row, k) => row[j] = v[k] / norm)
  }
  
  return { Q: matrix(Q), R: matrix(R) }
}

// ============================================================================
// POLYNOMIALS - Ascending order [a0, a1, a2] for a0 + a1*x + a2*x²
// ============================================================================

const polynomial = (coeffs) => {
  const c = Array.isArray(coeffs) ? [...coeffs] : [...arguments]
  // Handle empty array
  if (c.length === 0) {
    c.push(0)
  }
  // Remove trailing zeros (but keep at least one)
  while (c.length > 1 && Math.abs(c[c.length - 1]) < 1e-10) {
    c.pop()
  }
  
  return {
    coeffs: c,
    degree: c.length - 1,
    type: 'polynomial',
    eval: (x) => evaluate(c, x),
    derivative: () => polynomial(derivative(c)),
    integral: (C = 0) => polynomial(integral(c, C)),
    add: (other) => polynomial(addPolynomials(c, other.coeffs || other)),
    sub: (other) => polynomial(subtractPolynomials(c, other.coeffs || other)),
    mul: (other) => polynomial(multiplyPolynomials(c, other.coeffs || other)),
    div: (other) => dividePolynomials(c, other.coeffs || other),
    roots: () => findRoots(c),
    compose: (other) => polynomial(composePolynomials(c, other.coeffs || other)),
    toArray: () => c
  }
}

// Polynomial operations
const evaluate = (coeffs, x) => {
  let result = 0
  for (let i = 0; i < coeffs.length; i++) {
    result += coeffs[i] * Math.pow(x, i)
  }
  return result
}

const derivative = (coeffs) => {
  if (coeffs.length <= 1) return [0]
  return coeffs.slice(1).map((c, i) => c * (i + 1))
}

const integral = (coeffs, C = 0) => {
  return [C, ...coeffs.map((c, i) => c / (i + 1))]
}

const addPolynomials = (p1, p2) => {
  const maxLen = Math.max(p1.length, p2.length)
  return Array(maxLen).fill(0).map((_, i) => 
    (p1[i] || 0) + (p2[i] || 0)
  )
}

const subtractPolynomials = (p1, p2) => {
  const maxLen = Math.max(p1.length, p2.length)
  return Array(maxLen).fill(0).map((_, i) => 
    (p1[i] || 0) - (p2[i] || 0)
  )
}

const multiplyPolynomials = (p1, p2) => {
  const result = Array(p1.length + p2.length - 1).fill(0)
  for (let i = 0; i < p1.length; i++) {
    for (let j = 0; j < p2.length; j++) {
      result[i + j] += p1[i] * p2[j]
    }
  }
  return result
}

const dividePolynomials = (dividend, divisor) => {
  const d = [...dividend]
  const s = [...divisor]
  
  // Remove trailing zeros (ascending order: highest degree is last)
  while (d.length > 1 && Math.abs(d[d.length - 1]) < 1e-10) d.pop()
  while (s.length > 1 && Math.abs(s[s.length - 1]) < 1e-10) s.pop()
  
  if (s.length === 0 || (s.length === 1 && Math.abs(s[0]) < 1e-10)) {
    throw new Error('Division by zero polynomial')
  }
  if (d.length < s.length) return { quotient: polynomial([0]), remainder: polynomial(d) }
  
  const quotient = []
  const remainder = [...d]
  
  // Polynomial long division (ascending order)
  // We work from highest degree (end of array) to lowest
  while (remainder.length >= s.length) {
    const degDiff = remainder.length - s.length
    const q = remainder[remainder.length - 1] / s[s.length - 1]
    quotient.push(q)
    
    // Subtract q * divisor * x^degDiff from remainder
    for (let i = 0; i < s.length; i++) {
      const idx = degDiff + i
      if (idx < remainder.length) {
        remainder[idx] -= q * s[i]
      }
    }
    
    // Remove trailing zeros
    while (remainder.length > 1 && Math.abs(remainder[remainder.length - 1]) < 1e-10) {
      remainder.pop()
    }
  }
  
  // Quotient is in reverse order (highest degree first), reverse it
  quotient.reverse()
  
  // Ensure remainder has at least one element
  if (remainder.length === 0) remainder.push(0)
  
  return {
    quotient: polynomial(quotient),
    remainder: polynomial(remainder)
  }
}

const composePolynomials = (p1, p2) => {
  // Compose p1(p2(x)) = p1 evaluated at p2
  let result = [0]
  for (let i = 0; i < p1.length; i++) {
    if (Math.abs(p1[i]) > 1e-10) {
      let term = [p1[i]]
      for (let j = 0; j < i; j++) {
        term = multiplyPolynomials(term, p2)
      }
      result = addPolynomials(result, term)
    }
  }
  return result
}

// Root finding using Durand-Kerner method (simplified for real roots)
const findRoots = (coeffs, initialGuess = null, maxIter = 100, tol = 1e-10) => {
  const degree = coeffs.length - 1
  if (degree === 0) return primaSet([])
  if (degree === 1) {
    const root = -coeffs[0] / (coeffs[1] || 1)
    return primaSet([root])
  }
  
  const n = degree
  
  // Initial guesses on unit circle (real part only for now)
  let guesses = initialGuess || Array(n).fill(null).map((_, i) => {
    const angle = (2 * Math.PI * i) / n
    return Math.cos(angle) + (Math.random() - 0.5) * 0.1
  })
  
  // Durand-Kerner iteration
  for (let iter = 0; iter < maxIter; iter++) {
    const newGuesses = []
    for (let i = 0; i < n; i++) {
      const num = evaluate(coeffs, guesses[i])
      let denom = 1
      for (let j = 0; j < n; j++) {
        if (i !== j) {
          denom *= (guesses[i] - guesses[j])
        }
      }
      if (Math.abs(denom) < tol) {
        newGuesses.push(guesses[i])
      } else {
        newGuesses.push(guesses[i] - num / denom)
      }
    }
    
    // Check convergence
    let converged = true
    for (let i = 0; i < n; i++) {
      if (Math.abs(newGuesses[i] - guesses[i]) > tol) {
        converged = false
        break
      }
    }
    guesses = newGuesses
    if (converged) break
  }
  
  // Filter out NaN/Infinity and return as primaSet
  return primaSet(guesses.filter(r => isFinite(r)))
}

// Polynomial sequences (lazy)
const polynomialSequence = (coeffsFn, maxDegree = 10) => {
  return primaSet(function* () {
    for (let deg = 0; deg <= maxDegree; deg++) {
      const coeffs = coeffsFn(deg)
      yield polynomial(coeffs)
    }
  })
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  // Vectors
  vector,
  dotProduct, crossProduct, normalize, project, angleBetween,
  normL1, normL2, normLinf,
  vectorSpace,
  
  // Matrices
  matrix, identity, zeros, ones, diagonal, randomMatrix,
  transpose, determinant, inverse, multiply, multiplyVector,
  addMatrices, subtractMatrices, scaleMatrix, trace, rank,
  eigenvalues, eigenvectors, luDecomposition, qrDecomposition,
  
  // Polynomials
  polynomial,
  evaluate, derivative, integral,
  addPolynomials, subtractPolynomials, multiplyPolynomials, dividePolynomials,
  composePolynomials, findRoots, polynomialSequence
}

