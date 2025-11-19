/**
 * Unified Point Architecture
 * Point → Complex → Quaternion → Octonion
 * All inherit from Point, creating a coherent hierarchy
 * 
 * Mathematical insight:
 * - Complex: 2D algebraic structure (power-of-2: 2¹)
 * - Quaternion: 4D = 2 Complexes (Cayley-Dickson: 2²)
 * - Octonion: 8D = 2 Quaternions (Cayley-Dickson: 2³)
 * - Hyperplane: Creates the "membranes" where these structures live
 */

// ============================================================================
// BASE POINT - Foundational n-dimensional coordinate structure
// ============================================================================

const point = (...coords) => {
  const p = {
    coords, 
    dim: coords.length,
    type: 'point',
    
    // Basic operations
    add(q) { 
      return point(...this.coords.map((c, i) => c + (q.coords?.[i] || q[i] || 0))) 
    },
    subtract(q) { 
      return point(...this.coords.map((c, i) => c - (q.coords?.[i] || q[i] || 0))) 
    },
    scale(f) { 
      return point(...this.coords.map(c => c * f)) 
    },
    norm() { 
      return Math.sqrt(this.coords.reduce((s, c) => s + c * c, 0)) 
    },
    distance(q) {
      return this.subtract(q).norm()
    }
  }
  
  // Proxy for numeric indexing and coordinate aliases
  return new Proxy(p, {
    get(target, prop) {
      // Coordinate aliases: p.x → p.coords[0], p.y → p.coords[1], etc.
      const coordAliases = { x: 0, y: 1, z: 2, t: 3 }
      if (coordAliases.hasOwnProperty(prop)) {
        const idx = coordAliases[prop]
        return idx < target.coords.length ? target.coords[idx] : undefined
      }
      // Numeric indexing: point[0] → point.coords[0]
      if (typeof prop === 'string' && /^\d+$/.test(prop)) {
        const idx = parseInt(prop, 10)
        return target.coords[idx]
      }
      // Symbol.iterator for destructuring: const [x, y] = point(1, 2)
      if (prop === Symbol.iterator) {
        return function* () {
          yield* target.coords
        }
      }
      // All other properties (methods, coords, dim, etc.)
      return target[prop]
    },
    has(target, prop) {
      // Support 'in' operator: 0 in point
      if (typeof prop === 'string' && /^\d+$/.test(prop)) {
        const idx = parseInt(prop, 10)
        return idx >= 0 && idx < target.coords.length
      }
      return prop in target
    },
    ownKeys(target) {
      // Include numeric indices in Object.keys()
      return [
        ...Object.keys(target),
        ...target.coords.map((_, i) => String(i))
      ]
    },
    getOwnPropertyDescriptor(target, prop) {
      if (typeof prop === 'string' && /^\d+$/.test(prop)) {
        const idx = parseInt(prop, 10)
        if (idx >= 0 && idx < target.coords.length) {
          return {
            enumerable: true,
            configurable: true,
            value: target.coords[idx]
          }
        }
      }
      return Object.getOwnPropertyDescriptor(target, prop)
    }
  })
}

// ============================================================================
// COMPLEX - Extends Point (2D algebraic structure)
// ============================================================================

const complex = (re = 0, im = 0) => {
  // Inherit from Point using prototype chain
  const z = Object.create(point(re, im))
  z.re = re
  z.im = im
  z.type = 'complex'
  
  // Override norm to use complex-specific calculation (same result, but explicit)
  z.norm = () => Math.sqrt(z.re * z.re + z.im * z.im)
  
  // Complex-specific operations
  // Multiplication: (a+bi)(c+di) = (ac-bd) + (ad+bc)i
  z.mul = (other) => {
    const a = z.re, b = z.im
    const c = other.re ?? other[0] ?? 0
    const d = other.im ?? other[1] ?? 0
    return complex(a * c - b * d, a * d + b * c)
  }
  
  // Conjugate: a - bi
  z.conj = () => complex(z.re, -z.im)
  
  // Inverse: 1/z = conj(z) / |z|²
  z.inv = () => {
    const n2 = z.norm() ** 2
    if (n2 === 0) throw new Error('Cannot invert zero complex number')
    return z.conj().scale(1 / n2)
  }
  
  // Exponential: e^z = e^a(cos b + i sin b)
  z.exp = () => {
    const ea = Math.exp(z.re)
    return complex(ea * Math.cos(z.im), ea * Math.sin(z.im))
  }
  
  // Logarithm: ln(z) = ln|z| + i arg(z)
  z.log = () => complex(Math.log(z.norm()), Math.atan2(z.im, z.re))
  
  // Power: z^n using De Moivre's theorem
  z.pow = (n) => {
    const r = z.norm()
    const theta = Math.atan2(z.im, z.re)
    const rn = Math.pow(r, n)
    return complex(rn * Math.cos(n * theta), rn * Math.sin(n * theta))
  }
  
  // Three.js integration
  z.toVector3 = () => ({ x: z.re, y: z.im, z: 0 })
  z.toArray = () => [z.re, z.im]
  
  return z
}

// ============================================================================
// QUATERNION - Extends Complex (4D = 2 Complexes via Cayley-Dickson)
// ============================================================================

const quaternion = (w = 0, x = 0, y = 0, z = 0) => {
  // Represent as: q = c1 + c2·j where c1 = w+xi, c2 = y+zi
  const c1 = complex(w, x)  // First complex part
  const c2 = complex(y, z)  // Second complex part
  
  // Inherit from Point (4D point)
  const q = Object.create(point(w, x, y, z))
  q.w = w
  q.x = x
  q.y = y
  q.z = z
  q.type = 'quaternion'
  q.c1 = c1  // Store as complexes for Cayley-Dickson operations
  q.c2 = c2
  
  // Override norm
  q.norm = () => Math.sqrt(q.w*q.w + q.x*q.x + q.y*q.y + q.z*q.z)
  
  // Quaternion multiplication
  // Can be viewed as: q = c1 + c2·j where c1 = w+xi, c2 = y+zi
  // But for efficiency, use direct formula (Cayley-Dickson conceptually)
  q.mul = (other) => {
    const w1 = q.w, x1 = q.x, y1 = q.y, z1 = q.z
    const w2 = other.w ?? other[0] ?? 0
    const x2 = other.x ?? other[1] ?? 0
    const y2 = other.y ?? other[2] ?? 0
    const z2 = other.z ?? other[3] ?? 0
    
    // Direct quaternion multiplication formula
    return quaternion(
      w1*w2 - x1*x2 - y1*y2 - z1*z2,
      w1*x2 + x1*w2 + y1*z2 - z1*y2,
      w1*y2 - x1*z2 + y1*w2 + z1*x2,
      w1*z2 + x1*y2 - y1*x2 + z1*w2
    )
  }
  
  // Conjugate: w - xi - yj - zk
  q.conj = () => quaternion(q.w, -q.x, -q.y, -q.z)
  
  // Inverse: q⁻¹ = conj(q) / |q|²
  q.inv = () => {
    const n2 = q.norm() ** 2
    if (n2 === 0) throw new Error('Cannot invert zero quaternion')
    return q.conj().scale(1 / n2)
  }
  
  // Rotate 3D vector by quaternion: v' = q v q⁻¹
  q.rotate = (v) => {
    const vq = quaternion(0, v[0] ?? v.x ?? 0, v[1] ?? v.y ?? 0, v[2] ?? v.z ?? 0)
    const rotated = q.mul(vq).mul(q.inv())
    return point(rotated.x, rotated.y, rotated.z)
  }
  
  // Convert to rotation matrix
  q.toRotationMatrix = () => {
    const w = q.w, x = q.x, y = q.y, z = q.z
    return [
      [1-2*(y*y+z*z), 2*(x*y-w*z), 2*(x*z+w*y)],
      [2*(x*y+w*z), 1-2*(x*x+z*z), 2*(y*z-w*x)],
      [2*(x*z-w*y), 2*(y*z+w*x), 1-2*(x*x+y*y)]
    ]
  }
  
  // Three.js integration
  q.toVector3 = () => ({ x: q.x, y: q.y, z: q.z })
  q.toArray = () => [q.w, q.x, q.y, q.z]
  
  return q
}

// ============================================================================
// OCTONION - Extends Quaternion (8D = 2 Quaternions via Cayley-Dickson)
// ============================================================================

const octonion = (e0 = 0, e1 = 0, e2 = 0, e3 = 0, e4 = 0, e5 = 0, e6 = 0, e7 = 0) => {
  // Represent as: o = q1 + q2·l where q1 = e0+e1i+e2j+e3k, q2 = e4+e5i+e6j+e7k
  const q1 = quaternion(e0, e1, e2, e3)  // First quaternion part
  const q2 = quaternion(e4, e5, e6, e7)  // Second quaternion part
  
  // Inherit from Point (8D point)
  const o = Object.create(point(e0, e1, e2, e3, e4, e5, e6, e7))
  o.e0 = e0; o.e1 = e1; o.e2 = e2; o.e3 = e3
  o.e4 = e4; o.e5 = e5; o.e6 = e6; o.e7 = e7
  o.type = 'octonion'
  o.q1 = q1  // Store as quaternions for Cayley-Dickson operations
  o.q2 = q2
  
  // Override norm
  o.norm = () => Math.sqrt(
    o.e0*o.e0 + o.e1*o.e1 + o.e2*o.e2 + o.e3*o.e3 + 
    o.e4*o.e4 + o.e5*o.e5 + o.e6*o.e6 + o.e7*o.e7
  )
  
  // Octonion multiplication
  // Can be viewed as: o = q1 + q2·l where q1 = e0+e1i+e2j+e3k, q2 = e4+e5i+e6j+e7k
  // But for efficiency, use direct formula (Cayley-Dickson conceptually)
  o.mul = (other) => {
    const a = [o.e0, o.e1, o.e2, o.e3, o.e4, o.e5, o.e6, o.e7]
    const b = [
      other.e0 ?? other[0] ?? 0,
      other.e1 ?? other[1] ?? 0,
      other.e2 ?? other[2] ?? 0,
      other.e3 ?? other[3] ?? 0,
      other.e4 ?? other[4] ?? 0,
      other.e5 ?? other[5] ?? 0,
      other.e6 ?? other[6] ?? 0,
      other.e7 ?? other[7] ?? 0
    ]
    
    // Octonion multiplication using Fano plane structure
    // (same as current implementation, but conceptually uses quaternion representation)
    const octonionMultTable = [
      [0,1,2,3,4,5,6,7], [1,0,3,2,5,4,7,6],
      [2,3,0,1,6,7,4,5], [3,2,1,0,7,6,5,4],
      [4,5,6,7,0,1,2,3], [5,4,7,6,1,0,3,2],
      [6,7,4,5,2,3,0,1], [7,6,5,4,3,2,1,0]
    ]
    const octonionSignTable = [
      [1,1,1,1,1,1,1,1], [1,-1,1,-1,1,-1,-1,1],
      [1,-1,-1,1,1,1,-1,-1], [1,1,-1,-1,1,-1,1,-1],
      [1,-1,-1,-1,-1,1,1,1], [1,1,-1,1,-1,-1,-1,1],
      [1,1,1,-1,-1,1,-1,-1], [1,-1,1,1,-1,-1,1,-1]
    ]
    
    const result = new Array(8).fill(0)
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const k = octonionMultTable[i][j]
        const sign = octonionSignTable[i][j]
        result[k] += sign * a[i] * b[j]
      }
    }
    return octonion(...result)
  }
  
  // Conjugate: negate all imaginary parts
  o.conj = () => octonion(o.e0, -o.e1, -o.e2, -o.e3, -o.e4, -o.e5, -o.e6, -o.e7)
  
  // Three.js integration
  o.toVector3 = () => ({ x: o.e1, y: o.e2, z: o.e3 })
  o.toArray = () => [o.e0, o.e1, o.e2, o.e3, o.e4, o.e5, o.e6, o.e7]
  
  return o
}

// ============================================================================
// VECTOR - Extends Point (nD with vector operations)
// ============================================================================

const vector = (...coords) => {
  // Inherit from Point
  const v = Object.create(point(...coords))
  v.type = 'vector'
  
  // Vector-specific operations
  v.dot = (w) => {
    const c1 = v.coords || v
    const c2 = w.coords || w
    return c1.reduce((sum, c, i) => sum + c * (c2[i] || 0), 0)
  }
  
  v.cross = (w) => {
    const c1 = v.coords || v
    const c2 = w.coords || w
    if (c1.length !== 3 || c2.length !== 3) {
      throw new Error('Cross product requires 3D vectors')
    }
    return vector(
      c1[1] * c2[2] - c1[2] * c2[1],
      c1[2] * c2[0] - c1[0] * c2[2],
      c1[0] * c2[1] - c1[1] * c2[0]
    )
  }
  
  v.normalize = () => {
    const n = v.norm()
    if (n === 0) throw new Error('Cannot normalize zero vector')
    return v.scale(1 / n)
  }
  
  v.project = (onto) => {
    const dot = v.dot(onto)
    const norm2 = onto.norm() ** 2
    if (norm2 === 0) throw new Error('Cannot project onto zero vector')
    return onto.scale(dot / norm2)
  }
  
  v.angle = (w) => {
    const dot = v.dot(w)
    const norms = v.norm() * w.norm()
    if (norms === 0) throw new Error('Cannot compute angle with zero vector')
    return Math.acos(Math.max(-1, Math.min(1, dot / norms)))
  }
  
  v.normL1 = () => v.coords.reduce((sum, c) => sum + Math.abs(c), 0)
  v.normL2 = () => v.norm()  // Alias
  v.normLinf = () => Math.max(...v.coords.map(c => Math.abs(c)))
  
  return v
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  point,
  complex,
  quaternion,
  octonion,
  vector
}

