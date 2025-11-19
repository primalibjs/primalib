import { test } from '../test/test.mjs';
import { space, point } from "@primalib/core";
import {
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
} from "@primalib/topo";

test('🧪 primatopo.test.mjs — genus', ({check}) => {
  const h = space([0, 0], [1, 1])
  h.type = 'space'
  check(genus(h), 0)
  
  const sphere = { type: 'sphere' }
  check(genus(sphere), 0)
  
  const torus = { type: 'torus' }
  check(genus(torus), 1)
})

test('Euler characteristic for space', ({check}) => {
  const h2 = space([0, 0], [1, 1])
  h2.type = 'space'
  h2.dim = 2
  check(eulerCharacteristic(h2), 1)
  
  const h3 = space([0, 0, 0], [1, 1, 1])
  h3.type = 'space'
  h3.dim = 3
  check(eulerCharacteristic(h3), 1)
  
  const h4 = space([0, 0, 0, 0], [1, 1, 1, 1])
  h4.type = 'space'
  h4.dim = 4
  check(eulerCharacteristic(h4), 1)
})

test('Euler characteristic for sphere and torus', ({check}) => {
  const sphere = { type: 'sphere' }
  check(eulerCharacteristic(sphere), 2)
  
  const torus = { type: 'torus' }
  check(eulerCharacteristic(torus), 0)
})

test('Orientability', ({check}) => {
  const h = space([0, 0], [1, 1])
  h.type = 'space'
  check(isOrientable(h), true)
  
  const mobius = { type: 'mobius' }
  check(isOrientable(mobius), false)
  
  const klein = { type: 'klein' }
  check(isOrientable(klein), false)
})

test('Compactness', ({check}) => {
  const h = space([0, 0], [1, 1])
  h.type = 'space'
  check(isCompact(h), true)
  
  const sphere = { type: 'sphere' }
  check(isCompact(sphere), true)
  
  const plane = { type: 'plane' }
  check(isCompact(plane), false)
})

test('Connectedness', ({check}) => {
  const h = space([0, 0], [1, 1])
  h.type = 'space'
  check(isConnected(h), true)
  
  const disjoint = { type: 'disjoint' }
  check(isConnected(disjoint), false)
})

test('Simple connectedness', ({check}) => {
  const h = space([0, 0], [1, 1])
  h.type = 'space'
  check(isSimplyConnected(h), true)
  
  const torus = { type: 'torus' }
  check(isSimplyConnected(torus), false)
  
  const mobius = { type: 'mobius' }
  check(isSimplyConnected(mobius), false)
})

test('Cartesian product', ({check}) => {
  const h1 = space([0], [1])
  const h2 = space([0, 0], [1, 1])
  const prod = cartesianProduct(h1, h2)
  const verts = [...prod]
  check(verts.length, 8)
  check(verts[0].dim, 3)
})

test('Fiber bundle', ({check}) => {
  const base = space([0], [1])
  const fiber = space([0], [1])
  const projection = (p) => point(p[0])
  
  const bundle = fiberBundle(base, fiber, projection)
  check(bundle.type, 'fiber_bundle')
  check(bundle.base, base)
  check(bundle.fiber, fiber)
})

test('space as fiber bundle', ({check}) => {
  const bundle = spaceAsFiberBundle(4)
  check(bundle.type, 'fiber_bundle')
  check(bundle.base.dim, 2)
  check(bundle.fiber.dim, 2)
})

test('Betti numbers', ({check}) => {
  const h3 = space([0, 0, 0], [1, 1, 1])
  h3.type = 'space'
  h3.dim = 3
  const betti = bettiNumbers(h3)
  check(betti[0], 1)
  check(betti[3], 1)
  
  const sphere = { type: 'sphere', dim: 2 }
  const bettiSphere = bettiNumbers(sphere)
  check(bettiSphere[0], 1)
  check(bettiSphere[2], 1)
  
  const torus = { type: 'torus' }
  const bettiTorus = bettiNumbers(torus)
  check(bettiTorus[0], 1)
  check(bettiTorus[1], 2)
  check(bettiTorus[2], 1)
})

test('Topological invariants', ({check}) => {
  const h = space([0, 0], [1, 1])
  h.type = 'space'
  h.dim = 2
  const inv = topologicalInvariants(h)
  check(inv.genus, 0)
  check(inv.eulerCharacteristic, 1)
  check(inv.isOrientable, true)
  check(inv.isCompact, true)
  check(inv.isConnected, true)
  check(inv.isSimplyConnected, true)
})

