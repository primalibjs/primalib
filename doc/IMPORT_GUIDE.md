# 📦 PrimaLib Import Guide

## Simple Import Structure

PrimaLib uses a clean, simple import structure:

- **Main package**: `primalib` (not scoped)
- **Submodules**: `@primalib/*` (scoped)
- **Web module**: `@primalib/web` (optional, for dev/tests)

## Main Package: `primalib`

Install and import everything (except web):

```bash
npm install primalib
```

```javascript
import { N, sq, sum, primes, primaSet, point, vector, matrix } from 'primalib'
```

**Includes all modules**:
- Core (primaset, primaops, errors)
- Geometry
- Number theory
- Statistics
- Linear algebra
- Topology
- Tree handling

**Excludes**:
- Web module (optional, see below)

## Submodules: `@primalib/*`

Install individual submodules if you only need specific functionality:

```bash
npm install @primalib/core
npm install @primalib/geo
npm install @primalib/num
```

```javascript
import { primaSet } from '@primalib/core'
import { point } from '@primalib/geo'
import { primes } from '@primalib/num'
```

## Web Module: `@primalib/web` (Optional)

The web module is **optional** and mainly for development/testing:

```bash
npm install @primalib/web
```

```javascript
import { PrimaWeb, say, on, send } from '@primalib/web'
```

**Why separate?**
- Web module is a dev tool for demos/examples
- Keeps main package focused on core math functionality
- Users who don't need web features don't install it

## Package Exports

The main package also exports submodules for convenience:

```javascript
// Main import
import { N, sq, sum } from 'primalib'

// Submodule imports via main package
import { primaSet } from 'primalib/core'
import { point } from 'primalib/geo'
```

## Benefits

1. **Simple**: `import { ... } from 'primalib'` - no scoped name needed
2. **Organized**: Submodules use `@primalib/*` for clear structure
3. **Flexible**: Use main package or individual submodules
4. **Clean**: Web module separate (optional, for dev/tests)

## Examples

### Basic Usage
```javascript
import { N, sq, sum } from 'primalib'
console.log(sum(sq(N(10))))  // → 385
```

### Individual Submodules
```javascript
import { primaSet } from '@primalib/core'
import { primes } from '@primalib/num'
```

### With Web (Optional)
```javascript
import { N, sq, sum } from 'primalib'
import { PrimaWeb } from '@primalib/web'

const { say } = PrimaWeb('#content')
say('# Hello World')
```

