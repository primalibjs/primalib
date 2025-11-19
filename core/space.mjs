/**
 * Space - Unified geometric and algebraic space
 * 
 * By default, Space is geometric.
 * When dimension is power-of-2 (2, 4, 8), Space is algebraic (division algebra lives here).
 * 
 * This is the fundamental environment where Points live.
 */

import { primaSet } from './primaset.mjs'
import { point, complex, quaternion, octonion, vector } from './point.mjs'

// Algebraic dimensions (power-of-2: where division algebras exist)
const ALGEBRAIC_DIMS = [2, 4, 8]

/**
 * Create a space of given dimension
 * @param {Array|number} corner - Corner coordinates or single value
 * @param {Array|number} sides - Side lengths or single value
 * @returns {Object} Space object with geometric and algebraic operations
 */
const space = (corner, sides) => {
  const c = Array.isArray(corner) ? corner : [corner]
  const s = Array.isArray(sides) ? sides : [sides]
  const dim = s.length
  const isAlgebraic = ALGEBRAIC_DIMS.includes(dim)
  const algebra = isAlgebraic 
    ? (dim === 2 ? 'complex' : dim === 4 ? 'quaternion' : 'octonion')
    : null

  const sp = {
    dim,
    isAlgebraic,
    algebra,
    
    // ========================================================================
    // GEOMETRIC OPERATIONS (Always available)
    // ========================================================================
    
    vertices() {
      const verts = []
      for (let i = 0; i < 1 << dim; i++) {
        const v = c.map((cc, j) => cc + ((i >> j) & 1) * s[j])
        verts.push(point(...v))
      }
      return verts
    },
    
    sample(res = 10) {
      function* recurse(d, pos) {
        if (d === dim) { yield point(...pos); return }
        for (let i = 0; i <= res; i++) {
          const p = c[d] + (i / res) * s[d]
          yield* recurse(d + 1, [...pos, p])
        }
      }
      return primaSet(recurse(0, []))
    },
    
    contains(p) {
      return p.coords.every((coord, i) => 
        coord >= c[i] && coord <= c[i] + s[i]
      )
    },
    
    subdivide(dimIdx, parts) {
      return primaSet(function* () {
        for (let i = 0; i < parts; i++) {
          const newC = [...c]
          const newS = [...s]
          newC[dimIdx] = c[dimIdx] + i * s[dimIdx] / parts
          newS[dimIdx] = s[dimIdx] / parts
          yield space(newC, newS)
        }
      })
    },
    
    // ========================================================================
    // PROJECTION & DISTANCE (Behavior depends on isAlgebraic)
    // ========================================================================
    
    project(p, normal = null) {
      if (isAlgebraic && !normal) {
        // Algebraic projection (onto the "plane")
        const n = point(1, ...new Array(dim - 1).fill(0))
        const dot = p.coords.reduce((sum, coord, i) => sum + coord * n[i], 0)
        return p.subtract(n.scale(dot))
      }
      
      // Geometric projection (requires normal)
      if (!normal) throw new Error('Normal vector required for geometric projection')
      const n = point(...normal)
      const norm = n.norm()
      if (norm === 0) throw new Error('Normal vector cannot be zero')
      const normalized = n.scale(1 / norm)
      const dot = p.coords.reduce((sum, coord, i) => sum + coord * normalized[i], 0)
      return p.subtract(normalized.scale(dot))
    },
    
    distance(p, normal = null) {
      if (isAlgebraic && !normal) {
        // Algebraic distance (to the "plane")
        return Math.abs(p.coords[0] - c[0])
      }
      
      // Geometric distance (requires normal)
      if (!normal) throw new Error('Normal vector required for geometric distance')
      const n = point(...normal)
      const norm = n.norm()
      if (norm === 0) throw new Error('Normal vector cannot be zero')
      const normalized = n.scale(1 / norm)
      const dot = p.coords.reduce((sum, coord, i) => sum + coord * normalized[i], 0)
      const originDot = c.reduce((sum, coord, i) => sum + coord * normalized[i], 0)
      return Math.abs(dot - originDot)
    },
    
    // ========================================================================
    // ALGEBRAIC OPERATIONS (Available only for algebraic spaces: 2D, 4D, 8D)
    // ========================================================================
    
    split() {
      if (!isAlgebraic) throw new Error('split() only for algebraic spaces (2D, 4D, 8D)')
      
      const verts = sp.vertices()
      
      // 2D: even/odd
      if (dim === 2) {
        return {
          even: verts.filter(v => (v.coords[0] + v.coords[1]) % 2 === 0),
          odd: verts.filter(v => (v.coords[0] + v.coords[1]) % 2 === 1)
        }
      }
      
      // 4D: mod 4
      if (dim === 4) {
        const classes = { 0: [], 1: [], 2: [], 3: [] }
        verts.forEach(v => {
          const sum = v.coords.reduce((s, c) => s + c, 0)
          classes[sum % 4].push(v)
        })
        return classes
      }
      
      // 8D: mod 8
      const classes = {}
      for (let i = 0; i < 8; i++) classes[i] = []
      verts.forEach(v => {
        const sum = v.coords.reduce((s, c) => s + c, 0)
        classes[sum % 8].push(v)
      })
      return classes
    },
    
    units() {
      if (!isAlgebraic) return null
      return sp.vertices().filter(v => {
        const ones = v.coords.filter(c => c === 1).length
        const zeros = v.coords.filter(c => c === 0).length
        return ones === 1 && zeros === dim - 1
      })
    },
    
    // ========================================================================
    // POINT CREATION (Direct relation with Point)
    // ========================================================================
    
    point(...coords) {
      if (coords.length !== dim) {
        throw new Error(`Expected ${dim} coordinates, got ${coords.length}`)
      }
      
      // Algebraic spaces create algebraic elements
      if (isAlgebraic) {
        if (dim === 2) return complex(...coords)
        if (dim === 4) return quaternion(...coords)
        if (dim === 8) return octonion(...coords)
      }
      
      // Geometric spaces create geometric points
      return point(...coords)
    },
    
    vector(...coords) {
      if (coords.length !== dim) {
        throw new Error(`Expected ${dim} coordinates, got ${coords.length}`)
      }
      return vector(...coords)
    },
    
    // ========================================================================
    // UTILITY
    // ========================================================================
    
    toArray() {
      return sp.vertices().map(v => v.coords)
    },
    
    toThreeMesh() {
      return sp.vertices().map(v => v.coords.slice(0, 3))
    }
  }
  
  return sp
}

// ============================================================================
// CONVENIENCE FACTORIES
// ============================================================================

export { space, ALGEBRAIC_DIMS }
