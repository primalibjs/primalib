# Prima3D - Three.js Visualizer for PrimaLib Geometries

> **"Visualize PrimaLib geometries in 3D space using Three.js - points, hypercubes, complex numbers, and more."**

Prima3D provides visualization capabilities for PrimaLib geometries using Three.js. It converts PrimaLib geometric structures (points, hypercubes, hyperplanes, complex numbers, quaternions, octonions) into Three.js meshes for interactive 3D visualization.

## 🎯 **Architecture**

- **Geometry Converters**: Convert PrimaLib geometries to Three.js meshes
- **Material Types**: Support for basic, phong, and lambert materials
- **Scene Management**: Create and manage Three.js scenes with cameras and lights
- **PrimaSet Integration**: Visualize sets of geometries as groups
- **Standalone**: Works with Three.js CDN, no build step required

## 📦 **Setup**

### Include Three.js

Prima3D requires Three.js to be loaded. Include it via CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js"></script>
<script type="module">
  import { toThreeMesh, visualize } from './primalib/prima3d.mjs'
  // Use Prima3D...
</script>
```

### Optional: OrbitControls

For interactive camera controls:

```html
<script src="https://cdn.jsdelivr.net/npm/three@0.160.0/examples/js/controls/OrbitControls.js"></script>
```

## 🎨 **Basic Usage**

### Convert Single Geometry

```javascript
import { toThreeMesh } from 'primalib/prima3d.mjs'
import { point } from 'primalib'

// Create PrimaLib point
const p = point(1, 2, 3)

// Convert to Three.js mesh
const mesh = toThreeMesh(p)

// Add to scene
scene.add(mesh)
```

### Visualize with Scene

```javascript
import { visualize } from 'primalib/prima3d.mjs'
import { point } from 'primalib'

// Create point
const p = point(1, 2, 3)

// Visualize (creates scene automatically)
const { scene, camera, renderer, mesh } = visualize(p, {
  container: '#canvas',
  width: 800,
  height: 600
})
```

## 📍 **Supported Geometries**

### Points

```javascript
import { toThreeMesh } from 'primalib/prima3d.mjs'
import { point } from 'primalib'

const p = point(1, 2, 3)
const mesh = toThreeMesh(p, {
  size: 0.1,      // Sphere size
  color: 0xffffff  // White
})
```

### Complex Numbers

```javascript
import { toThreeMesh } from 'primalib/prima3d.mjs'
import { complex } from 'primalib'

const z = complex(1, 2)  // 1 + 2i
const mesh = toThreeMesh(z, {
  size: 0.05,
  color: 0x00ff00  // Green (default)
})
```

### Quaternions

```javascript
import { toThreeMesh } from 'primalib/prima3d.mjs'
import { quaternion } from 'primalib'

const q = quaternion(1, 2, 3, 4)
const mesh = toThreeMesh(q, {
  size: 0.05,
  color: 0x0000ff  // Blue (default)
})
```

### Octonions

```javascript
import { toThreeMesh } from 'primalib/prima3d.mjs'
import { octonion } from 'primalib'

const o = octonion(1, 2, 3, 4, 5, 6, 7, 8)
const mesh = toThreeMesh(o, {
  size: 0.05,
  color: 0xff00ff  // Magenta (default)
})
```

### Hypercubes

```javascript
import { toThreeMesh } from 'primalib/prima3d.mjs'
import { hypercube } from 'primalib'

// 3D cube
const cube = hypercube([0, 0, 0], [1, 1, 1])
const group = toThreeMesh(cube, {
  showVertices: true,   // Show corner points
  showEdges: true,      // Show edges
  showFaces: false,     // Show faces (3D only)
  vertexSize: 0.15,
  vertexColor: 0x00ff00,
  edgeColor: 0xffffff
})
```

### Hyperplanes

```javascript
import { toThreeMesh } from 'primalib/prima3d.mjs'
import { hyperplane } from 'primalib'

const plane = hyperplane([1, 1, 1], 5)
const group = toThreeMesh(plane, {
  bounds: [-5, 5, -5, 5],  // Sampling bounds
  resolution: 10,           // Sampling resolution
  color: 0xffff00           // Yellow
})
```

## 🎬 **Scene Management**

### Create Scene

```javascript
import { createScene } from 'primalib/prima3d.mjs'

const { scene, camera, renderer, controls } = createScene({
  container: '#canvas',      // Container element or selector
  width: 800,
  height: 600,
  cameraPos: [5, 5, 5],     // Camera position
  background: 0x000000       // Background color
})
```

### Add Geometries

```javascript
import { createScene, toThreeMesh } from 'primalib/prima3d.mjs'
import { point, hypercube } from 'primalib'

const { scene } = createScene({ container: '#canvas' })

// Add point
const p = point(1, 2, 3)
scene.add(toThreeMesh(p))

// Add hypercube
const cube = hypercube([0, 0, 0], [1, 1, 1])
scene.add(toThreeMesh(cube))
```

## 📊 **Visualizing Sets**

### PrimaSet of Geometries

```javascript
import { toThreeGroup } from 'primalib/prima3d.mjs'
import { primaSet, point } from 'primalib'

// Create set of points
const points = primaSet([
  point(0, 0, 0),
  point(1, 1, 1),
  point(2, 2, 2)
])

// Convert to Three.js group
const group = toThreeGroup(points, {
  size: 0.1,
  color: 0xffffff
})

scene.add(group)
```

### Visualize Set Directly

```javascript
import { visualize } from 'primalib/prima3d.mjs'
import { primaSet, point } from 'primalib'

const points = primaSet([
  point(0, 0, 0),
  point(1, 1, 1),
  point(2, 2, 2)
])

// Automatically detects PrimaSet
const { scene, mesh } = visualize(points, {
  container: '#canvas'
})
```

## 🎨 **Customization Options**

### Point Options

```javascript
toThreeMesh(point(1, 2, 3), {
  size: 0.1,        // Sphere radius
  color: 0xff0000   // Red
})
```

### Hypercube Options

```javascript
toThreeMesh(hypercube([0,0,0], [1,1,1]), {
  showVertices: true,    // Show corner points
  showEdges: true,        // Show edges
  showFaces: false,       // Show faces (3D only)
  vertexSize: 0.15,      // Vertex sphere size
  vertexColor: 0x00ff00, // Vertex color
  edgeColor: 0xffffff    // Edge color
})
```

### Hyperplane Options

```javascript
toThreeMesh(hyperplane([1,1,1], 5), {
  bounds: [-5, 5, -5, 5],  // [xMin, xMax, yMin, yMax]
  resolution: 10,          // Sampling resolution
  color: 0xffff00          // Point color
})
```

### Scene Options

```javascript
createScene({
  container: '#canvas',     // Container element or selector
  width: 800,              // Scene width
  height: 600,             // Scene height
  cameraPos: [5, 5, 5],    // Camera position [x, y, z]
  background: 0x000000     // Background color
})
```

## 🔧 **Advanced Usage**

### Custom Converters

```javascript
import { GEOMETRY_CONVERTERS } from 'primalib/prima3d.mjs'

// Access converters directly
const pointConverter = GEOMETRY_CONVERTERS.point
const mesh = pointConverter(point(1, 2, 3), { size: 0.1 })
```

### Material Types

```javascript
import { MATERIAL_TYPES } from 'primalib/prima3d.mjs'

// Create custom material
const material = MATERIAL_TYPES.phong(0xff0000, 1.0)
```

### Manual Scene Setup

```javascript
import { toThreeMesh } from 'primalib/prima3d.mjs'
import { point } from 'primalib'

// Create Three.js scene manually
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, 800/600, 0.1, 1000)
const renderer = new THREE.WebGLRenderer()
renderer.setSize(800, 600)
document.body.appendChild(renderer.domElement)

// Add PrimaLib geometry
const p = point(1, 2, 3)
scene.add(toThreeMesh(p))

// Render
function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}
animate()
```

## 📋 **Complete API Reference**

### Core Functions

| Function | Description | Example |
|----------|-------------|---------|
| `toThreeMesh(geometry, options?)` | Convert geometry to mesh | `toThreeMesh(point(1,2,3))` |
| `toThreeGroup(geometrySet, options?)` | Convert set to group | `toThreeGroup(points)` |
| `createScene(options?)` | Create scene with setup | `createScene({container:'#canvas'})` |
| `visualize(geometry, options?)` | Visualize with scene | `visualize(point(1,2,3))` |

### Geometry Converters

| Type | Default Color | Description |
|------|---------------|-------------|
| `point` | White (0xffffff) | Points as spheres |
| `complex` | Green (0x00ff00) | Complex numbers |
| `quaternion` | Blue (0x0000ff) | Quaternions |
| `octonion` | Magenta (0xff00ff) | Octonions |
| `hypercube` | Green vertices, white edges | Hypercubes with vertices/edges |
| `hyperplane` | Yellow (0xffff00) | Hyperplanes as sampled points |

### Options

#### Point Options
- `size`: Sphere radius (default: 0.05)
- `color`: Color hex (default: 0xffffff)

#### Hypercube Options
- `showVertices`: Show corner points (default: true)
- `showEdges`: Show edges (default: true)
- `showFaces`: Show faces, 3D only (default: false)
- `vertexSize`: Vertex sphere size (default: 0.15)
- `vertexColor`: Vertex color (default: 0x00ff00)
- `edgeColor`: Edge color (default: 0xffffff)

#### Hyperplane Options
- `bounds`: Sampling bounds [xMin, xMax, yMin, yMax] (default: [-5, 5, -5, 5])
- `resolution`: Sampling resolution (default: 10)
- `color`: Point color (default: 0xffff00)

#### Scene Options
- `container`: Container element or selector (default: document.body)
- `width`: Scene width (default: window.innerWidth)
- `height`: Scene height (default: window.innerHeight)
- `cameraPos`: Camera position [x, y, z] (default: [5, 5, 5])
- `background`: Background color (default: 0x000000)

## 🎯 **Use Cases**

### 1. **Visualize Prime Points**

```javascript
import { visualize, toThreeGroup } from 'primalib/prima3d.mjs'
import { primes, address, point } from 'primalib'
import { primaSet } from 'primalib'

// Map primes to 3D points using CRT addresses
const primePoints = primaSet(primes)
  .take(100)
  .map(p => point(...address(p).slice(0, 3)))

// Visualize
const { scene, mesh } = visualize(primePoints, {
  container: '#canvas'
})
```

### 2. **Hypercube Visualization**

```javascript
import { visualize } from 'primalib/prima3d.mjs'
import { hypercube } from 'primalib'

// 3D cube
const cube = hypercube([0, 0, 0], [1, 1, 1])

visualize(cube, {
  container: '#canvas',
  showVertices: true,
  showEdges: true,
  showFaces: true
})
```

### 3. **Complex Plane Visualization**

```javascript
import { visualize, toThreeGroup } from 'primalib/prima3d.mjs'
import { complex, complexPlane } from 'primalib'
import { primaSet } from 'primalib'

// Sample complex plane
const plane = complexPlane([-2, 2, -2, 2], 20)
const points = primaSet(plane.sample(100))

visualize(points, {
  container: '#canvas',
  size: 0.05,
  color: 0x00ff00
})
```

### 4. **Hyperplane Sampling**

```javascript
import { visualize } from 'primalib/prima3d.mjs'
import { hyperplane } from 'primalib'

const plane = hyperplane([1, 1, 1], 5)

visualize(plane, {
  container: '#canvas',
  bounds: [-5, 5, -5, 5],
  resolution: 20,
  color: 0xffff00
})
```

## 🔗 **Integration with PrimaLib**

Prima3D works seamlessly with all PrimaLib geometry modules:

```javascript
import { visualize } from 'primalib/prima3d.mjs'
import { point, hypercube, complex, quaternion } from 'primalib'

// Points
visualize(point(1, 2, 3))

// Hypercubes
visualize(hypercube([0,0,0], [1,1,1]))

// Complex numbers
visualize(complex(1, 2))

// Quaternions
visualize(quaternion(1, 2, 3, 4))
```

## 🎓 **Best Practices**

### 1. **Performance**

- Use `toThreeGroup()` for sets of geometries (more efficient)
- Limit sampling resolution for hyperplanes
- Use appropriate vertex/edge visibility for hypercubes

### 2. **Visualization**

- Choose appropriate colors for different geometry types
- Adjust sizes based on scene scale
- Use OrbitControls for interactive exploration

### 3. **Scene Setup**

- Use `createScene()` for automatic setup
- Customize camera position for best view
- Add lights for better visibility (automatic in `createScene()`)

## 📊 **Limitations**

- **3D Projection**: Higher-dimensional geometries are projected to 3D
- **Hypercube Edges**: Only shown for 3D hypercubes
- **Hyperplane Sampling**: Limited to 2D/3D visualization
- **Three.js Dependency**: Requires Three.js to be loaded

## 🎯 **Summary**

Prima3D provides:

- **Geometry conversion** from PrimaLib to Three.js
- **Scene management** with automatic setup
- **PrimaSet integration** for visualizing sets
- **Customization options** for all geometry types
- **Standalone operation** with Three.js CDN

**Start with `visualize()` for quick visualization, or use `toThreeMesh()` for custom scenes.**

---

**Prima3D** - *Visualize PrimaLib geometries in 3D space. From points to hypercubes, see your mathematical structures come to life.* 🎨

