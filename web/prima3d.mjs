/**
 * Prima3D - Three.js Visualizer for PrimaLib Geometries
 * Converts PrimaLib geometries to Three.js meshes for visualization
 * Works standalone with Three.js CDN
 */

// Helper to safely get coordinates
const getCoords = (obj) => {
  if (obj.coords) return obj.coords
  if (Array.isArray(obj)) return obj
  if (obj.x !== undefined && obj.y !== undefined) {
    return [obj.x, obj.y, obj.z ?? 0]
  }
  return [0, 0, 0]
}

// Object mapping for geometry type converters
const GEOMETRY_CONVERTERS = {
  point: (p, options = {}) => {
    const size = options.size ?? 0.05
    const color = options.color ?? 0xffffff
    const geometry = new THREE.SphereGeometry(size, 8, 8)
    const material = new THREE.MeshBasicMaterial({ color })
    const mesh = new THREE.Mesh(geometry, material)
    const coords = getCoords(p)
    mesh.position.set(
      coords[0] ?? 0,
      coords[1] ?? 0,
      coords[2] ?? 0
    )
    return mesh
  },

  complex: (z, options = {}) => {
    const size = options.size ?? 0.05
    const color = options.color ?? 0x00ff00
    const geometry = new THREE.SphereGeometry(size, 8, 8)
    const material = new THREE.MeshBasicMaterial({ color })
    const mesh = new THREE.Mesh(geometry, material)
    const vec3 = z.toVector3?.() ?? { x: z.re ?? z[0] ?? 0, y: z.im ?? z[1] ?? 0, z: 0 }
    mesh.position.set(vec3.x, vec3.y, vec3.z)
    return mesh
  },

  quaternion: (q, options = {}) => {
    const size = options.size ?? 0.05
    const color = options.color ?? 0x0000ff
    const geometry = new THREE.SphereGeometry(size, 8, 8)
    const material = new THREE.MeshBasicMaterial({ color })
    const mesh = new THREE.Mesh(geometry, material)
    const vec3 = q.toVector3?.() ?? { x: q.x ?? q[1] ?? 0, y: q.y ?? q[2] ?? 0, z: q.z ?? q[3] ?? 0 }
    mesh.position.set(vec3.x, vec3.y, vec3.z)
    return mesh
  },

  octonion: (o, options = {}) => {
    const size = options.size ?? 0.05
    const color = options.color ?? 0xff00ff
    const geometry = new THREE.SphereGeometry(size, 8, 8)
    const material = new THREE.MeshBasicMaterial({ color })
    const mesh = new THREE.Mesh(geometry, material)
    const vec3 = o.toVector3?.() ?? { x: o.e1 ?? o[1] ?? 0, y: o.e2 ?? o[2] ?? 0, z: o.e3 ?? o[3] ?? 0 }
    mesh.position.set(vec3.x, vec3.y, vec3.z)
    return mesh
  },

  hypercube: (h, options = {}) => {
    const showVertices = options.showVertices ?? true
    const showEdges = options.showEdges ?? true
    const showFaces = options.showFaces ?? false
    const vertexSize = options.vertexSize ?? 0.15  // Default larger
    const edgeColor = options.edgeColor ?? 0xffffff
    const vertexColor = options.vertexColor ?? 0x00ff00
    const group = new THREE.Group()

    const verts = h.vertices ? h.vertices() : []
    const vertices3D = verts.map(v => {
      const coords = getCoords(v).slice(0, 3)
      while (coords.length < 3) coords.push(0)
      // Scale up for visibility
      return new THREE.Vector3(coords[0] * 2, coords[1] * 2, coords[2] * 2)
    })

    // Add vertices
    if (showVertices) {
      vertices3D.forEach(v => {
        const geometry = new THREE.SphereGeometry(vertexSize, 8, 8)
        const material = new THREE.MeshBasicMaterial({ color: vertexColor })
        const mesh = new THREE.Mesh(geometry, material)
        mesh.position.copy(v)
        group.add(mesh)
      })
    }

    // Add edges (for 3D hypercube)
    if (showEdges && h.dim <= 3) {
      const edges = []
      for (let i = 0; i < vertices3D.length; i++) {
        for (let j = i + 1; j < vertices3D.length; j++) {
          const v1 = vertices3D[i]
          const v2 = vertices3D[j]
          // Check if vertices differ in exactly one coordinate (edge)
          const dx = Math.abs(v1.x - v2.x)
          const dy = Math.abs(v1.y - v2.y)
          const dz = Math.abs(v1.z - v2.z)
          const diffCount = (dx > 0.01 ? 1 : 0) + (dy > 0.01 ? 1 : 0) + (dz > 0.01 ? 1 : 0)
          // Edge: exactly one coordinate differs significantly
          if (diffCount === 1) {
            edges.push([v1, v2])
          }
        }
      }
      edges.forEach(([v1, v2]) => {
        const geometry = new THREE.BufferGeometry().setFromPoints([v1, v2])
        const material = new THREE.LineBasicMaterial({ color: edgeColor, opacity: 0.5, transparent: true })
        const line = new THREE.Line(geometry, material)
        group.add(line)
      })
    }

    // Add faces (for 3D cube)
    if (showFaces && h.dim === 3) {
      const faces = [
        [0, 1, 3, 2], [4, 5, 7, 6], // front/back
        [0, 1, 5, 4], [2, 3, 7, 6], // top/bottom
        [0, 2, 6, 4], [1, 3, 7, 5]  // left/right
      ]
      faces.forEach(faceIndices => {
        const faceVerts = faceIndices.map(i => vertices3D[i])
        const geometry = new THREE.BufferGeometry().setFromPoints(faceVerts)
        geometry.computeVertexNormals()
        const material = new THREE.MeshBasicMaterial({ 
          color: 0x444444, 
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.3
        })
        const face = new THREE.Mesh(geometry, material)
        group.add(face)
      })
    }

    return group
  },

  hyperplane: (hp, options = {}) => {
    const bounds = options.bounds ?? [-5, 5, -5, 5]
    const resolution = options.resolution ?? 10
    const color = options.color ?? 0xffff00
    const group = new THREE.Group()

    // Sample points on hyperplane
    const samples = hp.sample?.(bounds, resolution) ?? []
    samples.forEach(p => {
      const mesh = GEOMETRY_CONVERTERS.point(p, { size: 0.02, color })
      group.add(mesh)
    })

    return group
  }
}

// Object mapping for material types
const MATERIAL_TYPES = {
  basic: (color, opacity) => new THREE.MeshBasicMaterial({ color, transparent: opacity < 1, opacity }),
  phong: (color, opacity) => new THREE.MeshPhongMaterial({ color, transparent: opacity < 1, opacity }),
  lambert: (color, opacity) => new THREE.MeshLambertMaterial({ color, transparent: opacity < 1, opacity })
}

/**
 * Convert PrimaLib geometry to Three.js mesh
 * @param {Object} geometry - PrimaLib geometry (point, complex, quaternion, hypercube, etc.)
 * @param {Object} options - Visualization options
 * @returns {THREE.Object3D} Three.js mesh or group
 */
export const toThreeMesh = (geometry, options = {}) => {
  if (!THREE) {
    throw new Error('Three.js not loaded. Include Three.js before using Prima3D.')
  }

  const type = geometry.type ?? 'point'
  const converter = GEOMETRY_CONVERTERS[type]
  
  if (!converter) {
    console.warn(`No converter for geometry type: ${type}. Using point converter.`)
    return GEOMETRY_CONVERTERS.point(geometry, options)
  }

  return converter(geometry, options)
}

/**
 * Convert PrimaSet of geometries to Three.js group
 * @param {PrimaSet} geometrySet - Set of geometries
 * @param {Object} options - Visualization options
 * @returns {THREE.Group} Three.js group containing all meshes
 */
export const toThreeGroup = (geometrySet, options = {}) => {
  if (!THREE) {
    throw new Error('Three.js not loaded. Include Three.js before using Prima3D.')
  }

  const group = new THREE.Group()
  const items = geometrySet.toArray ? geometrySet.toArray() : [...geometrySet]
  
  items.forEach((item, index) => {
    const mesh = toThreeMesh(item, { ...options, index })
    group.add(mesh)
  })

  return group
}

/**
 * Create Three.js scene with default setup
 * @param {Object} options - Scene options
 * @returns {Object} { scene, camera, renderer, controls }
 */
export const createScene = (options = {}) => {
  if (!THREE) {
    throw new Error('Three.js not loaded. Include Three.js before using Prima3D.')
  }

  const container = options.container ?? document.body
  const width = options.width ?? window.innerWidth
  const height = options.height ?? window.innerHeight
  const cameraPos = options.cameraPos ?? [5, 5, 5]

  // Scene
  const scene = new THREE.Scene()
  scene.background = options.background ?? new THREE.Color(0x000000)

  // Camera
  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
  camera.position.set(...cameraPos)

  // Renderer with standard settings
  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(width, height)
  renderer.setPixelRatio(window.devicePixelRatio)
  if (typeof container === 'string') {
    const el = document.querySelector(container)
    if (el) el.appendChild(renderer.domElement)
  } else {
    container.appendChild(renderer.domElement)
  }

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
  scene.add(ambientLight)
  const pointLight = new THREE.PointLight(0xffffff, 1)
  pointLight.position.set(10, 10, 10)
  scene.add(pointLight)

  // Controls (if OrbitControls available)
  let controls = null
  if (typeof window !== 'undefined' && window.OrbitControls) {
    controls = new window.OrbitControls(camera, renderer.domElement)
    controls.update()
  }

  // Animation loop
  const animate = () => {
    requestAnimationFrame(animate)
    if (controls) controls.update()
    renderer.render(scene, camera)
  }
  animate()

  // Handle resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  })

  return { scene, camera, renderer, controls, animate }
}

/**
 * Visualize PrimaLib geometry in Three.js scene
 * @param {Object} geometry - PrimaLib geometry or PrimaSet
 * @param {Object} options - Visualization options
 * @returns {Object} { scene, camera, renderer, mesh }
 */
export const visualize = (geometry, options = {}) => {
  const { scene, camera, renderer, controls } = createScene(options)
  
  // Check if geometry is a PrimaSet
  const isSet = geometry.toArray || (typeof geometry[Symbol.iterator] === 'function')
  const mesh = isSet ? toThreeGroup(geometry, options) : toThreeMesh(geometry, options)
  
  scene.add(mesh)

  return { scene, camera, renderer, controls, mesh }
}

// Export all converters for advanced usage
export { GEOMETRY_CONVERTERS, MATERIAL_TYPES }

