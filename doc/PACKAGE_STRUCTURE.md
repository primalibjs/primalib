# 📦 PrimaLib Package Structure

## Package Overview

PrimaLib uses a simple, clean package structure:

- **Main package**: `primalib` (not scoped) - includes all modules except web
- **Submodules**: `@primalib/*` (scoped) - individual modules
- **Web module**: `@primalib/web` (optional) - for dev/tests

## Dependency Graph

```
primalib (main package)
  ├── @primalib/core (foundation)
  │   ├── @primalib/geo (depends on core)
  │   │   ├── @primalib/num (depends on core, geo)
  │   │   ├── @primalib/lin (depends on core, geo)
  │   │   └── @primalib/topo (depends on core, geo)
  │   ├── @primalib/stat (depends on core)
  │   └── @primalib/tree (depends on core)
  └── @primalib/web (optional, depends on core, primalib)
```

## Package Structure

### 1. `@primalib/core`
**Files**: `primaset.mjs`, `primaops.mjs`, `errors.mjs`  
**Dependencies**: None  
**Exports**: `primaSet`, `operations`, `methods`, `generators`, error utilities

### 2. `@primalib/geo`
**Files**: `primageo.mjs`  
**Dependencies**: `@primalib/core`  
**Exports**: `point`, `hypercube`, `hyperplane`, `complex`, `quaternion`, `octonion`, etc.

### 3. `@primalib/num`
**Files**: `primanum.mjs`  
**Dependencies**: `@primalib/core`, `@primalib/geo`  
**Exports**: `N`, `Z`, `R`, `primes`, `address`, `twins`, `goldbachPairs`, etc.

### 4. `@primalib/stat`
**Files**: `primastat.mjs`  
**Dependencies**: `@primalib/core`  
**Exports**: `mean`, `stddev`, `correlation`, `entropy`, etc.

### 5. `@primalib/lin`
**Files**: `primalin.mjs`  
**Dependencies**: `@primalib/core`, `@primalib/geo`  
**Exports**: `vector`, `matrix`, `polynomial`, etc.

### 6. `@primalib/topo`
**Files**: `primatopo.mjs`  
**Dependencies**: `@primalib/core`, `@primalib/geo`  
**Exports**: `genus`, `eulerCharacteristic`, `bettiNumbers`, etc.

### 7. `@primalib/tree`
**Files**: `primatree.mjs`  
**Dependencies**: `@primalib/core`  
**Exports**: `node`, `tree`, `vdom`, etc.

### 8. `primalib` (Main Package)
**Files**: `primalib.mjs` (re-exports from all submodules)  
**Dependencies**: All `@primalib/*` submodules (except web)  
**Exports**: Everything from core, geo, num, stat, lin, topo, tree

**Note**: Web module (`@primalib/web`) is optional and not included in main package.

### 9. `@primalib/web` (Optional)
**Files**: `primaweb.mjs`, `primaenv.mjs`, `prima3d.mjs`  
**Dependencies**: `@primalib/core`, `primalib`  
**Exports**: `PrimaWeb`, `say`, `on`, `send`, `el`, `client`, `server`, `include`

**Note**: Web module is optional and mainly for development/testing.

## Installation

### Main Package (Recommended)
```bash
npm install primalib
```

```javascript
import { N, sq, sum, primes, primaSet, point, vector } from 'primalib'
```

### Individual Submodules
```bash
npm install @primalib/core
npm install @primalib/geo
# etc.
```

```javascript
import { primaSet } from '@primalib/core'
import { point } from '@primalib/geo'
```

### Web Module (Optional)
```bash
npm install @primalib/web
```

```javascript
import { PrimaWeb, say, on } from '@primalib/web'
```

