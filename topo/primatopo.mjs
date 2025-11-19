/**
 * PrimaTopo - Topology module for PrimaLib
 * Genus, Euler characteristic, fiber bundles, and topological properties
 */

import { primaSet, point, space } from '../core/primaset.mjs';

// ---------- Genus Mapping ----------
const GENUS_MAP = {
  sphere: 0,
  torus: 1,
  space: 0,
  klein: 0,
  mobius: 0,
  cylinder: 0,
  plane: 0
}

// ---------- Topological Properties ----------

const genus = (geometry) => {
  if (!geometry || !geometry.type) return 0
  return GENUS_MAP[geometry.type] ?? 0
}

const eulerCharacteristic = (geometry) => {
  if (!geometry || !geometry.type) return null
  
  // Space (geometric or algebraic)
  if ((geometry.type === 'power2' || geometry.type === 'hypercube' || geometry.type === 'space') && geometry.dim !== undefined) {
    const dim = geometry.dim
    return primaSet(function* () {
      for (let k = 0; k <= dim; k++) {
        const kFaces = binomial(dim, k) * 2 ** (dim - k)
        yield (k % 2 === 0 ? 1 : -1) * kFaces
      }
    }).reduce((sum, val) => sum + val, 0)
  }
  
  // Type-based mapping (avoid if branching)
  const eulerMap = { sphere: 2, torus: 0, klein: 0 }
  return eulerMap[geometry.type] ?? null
}

const binomial = (n, k) => {
  if (k > n || k < 0) return 0
  if (k === 0 || k === n) return 1
  // Use collection handling instead of loop
  return Math.round(
    primaSet(function* () {
      for (let i = 0; i < k; i++) yield (n - i) / (i + 1)
    }).reduce((prod, val) => prod * val, 1)
  )
}

const isOrientable = (geometry) => {
  if (!geometry || !geometry.type) return true
  const nonOrientable = new Set(['mobius', 'klein'])
  return !nonOrientable.has(geometry.type)
}

const isCompact = (geometry) => {
  if (!geometry || !geometry.type) return false
  const compact = new Set(['power2', 'hypercube', 'space', 'sphere', 'torus', 'klein', 'cylinder'])
  return compact.has(geometry.type)
}

const isConnected = (geometry) => {
  if (!geometry || !geometry.type) return true
  return geometry.type !== 'disjoint'
}

const isSimplyConnected = (geometry) => {
  return genus(geometry) === 0 && isOrientable(geometry) && isConnected(geometry)
}

// ---------- Topological Structures ----------

const fiberBundle = (base, fiber, projection) => {
  if (!base || !fiber || !projection) {
    throw new Error('fiberBundle requires base, fiber, and projection')
  }
  
  return {
    type: 'fiber_bundle',
    base,
    fiber,
    projection,
    totalSpace() {
      return cartesianProduct(base, fiber)
    },
    section(sectionMap) {
      return primaSet(function* () {
        for (const b of base.vertices ? base.vertices() : base) {
          const f = sectionMap(b)
          yield point(...(b.coords || b), ...(f.coords || f))
        }
      })
    },
    lift(path) {
      return primaSet(function* () {
        for (const p of path) {
          const basePoint = projection(p)
          yield { base: basePoint, fiber: p }
        }
      })
    }
  }
}

const cartesianProduct = (geomA, geomB) => {
  const vertsA = geomA.vertices ? geomA.vertices() : (Array.isArray(geomA) ? geomA : [geomA])
  const vertsB = geomB.vertices ? geomB.vertices() : (Array.isArray(geomB) ? geomB : [geomB])
  
  return primaSet(function* () {
    for (const ptA of vertsA) {
      for (const ptB of vertsB) {
        const coordsA = ptA.coords || (Array.isArray(ptA) ? ptA : [ptA])
        const coordsB = ptB.coords || (Array.isArray(ptB) ? ptB : [ptB])
        yield point(...coordsA, ...coordsB)
      }
    }
  })
}

const spaceAsFiberBundle = (dim) => {
  if (dim < 2) throw new Error('Dimension must be at least 2')
  
  const s = space(new Array(dim).fill(0), new Array(dim).fill(1))
  const baseDim = Math.floor(dim / 2)
  const fiberDim = dim - baseDim
  
  const base = space(new Array(baseDim).fill(0), new Array(baseDim).fill(1))
  const fiber = space(new Array(fiberDim).fill(0), new Array(fiberDim).fill(1))
  
  const projection = (p) => {
    const coords = p.coords || p
    return point(...coords.slice(0, baseDim))
  }
  
  return fiberBundle(base, fiber, projection)
}

// ---------- Betti Numbers (Homology) ----------

const bettiNumbers = (geometry) => {
  if (!geometry || !geometry.type) return null
  
  // Space (geometric or algebraic)
  if ((geometry.type === 'power2' || geometry.type === 'hypercube' || geometry.type === 'space') && geometry.dim !== undefined) {
    const dim = geometry.dim
    return primaSet(function* () {
      for (let i = 0; i <= dim; i++) {
        yield i === 0 || i === dim ? 1 : 0
      }
    }).toArray()
  }
  
  // Type-based mapping (avoid if branching)
  const bettiMap = {
    sphere: (dim = 2) => primaSet(function* () {
      for (let i = 0; i <= dim; i++) {
        yield i === 0 || i === dim ? 1 : 0
      }
    }).toArray(),
    torus: () => [1, 2, 1]
  }
  
  const bettiFn = bettiMap[geometry.type]
  return bettiFn ? bettiFn(geometry.dim) : null
}

// ---------- Topological Invariants ----------

const topologicalInvariants = (geometry) => {
  return {
    genus: genus(geometry),
    eulerCharacteristic: eulerCharacteristic(geometry),
    isOrientable: isOrientable(geometry),
    isCompact: isCompact(geometry),
    isConnected: isConnected(geometry),
    isSimplyConnected: isSimplyConnected(geometry),
    bettiNumbers: bettiNumbers(geometry)
  }
}

export {
  genus,
  eulerCharacteristic,
  isOrientable,
  isCompact,
  isConnected,
  isSimplyConnected,
  fiberBundle,
  cartesianProduct,
  spaceAsFiberBundle,
  bettiNumbers,
  topologicalInvariants
}

