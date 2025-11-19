# PrimaLib Integration Guide

> **"How to integrate PrimaLib with popular frameworks and environments - React, Vue, Node.js, and more."**

This guide shows how to use PrimaLib with various frameworks, build tools, and environments. Each section includes working examples you can copy and adapt.

**See also**: [PATTERNS.md](./PATTERNS.md) for common patterns, [PRIMALIB.md](./PRIMALIB.md) for complete API reference.

---

## 🎯 **Quick Start**

### Installation

```bash
npm install primalib
# or
yarn add primalib
# or
pnpm add primalib
```

### Basic Import

```javascript
// ES Modules (recommended)
import { N, sq, sum, primes, primaSet } from 'primalib'

// CommonJS (Node.js)
const { N, sq, sum, primes, primaSet } = require('primalib')
```

---

## ⚛️ **React Integration**

### Basic React Component

```jsx
import React, { useState, useEffect } from 'react'
import { N, sq, sum } from 'primalib'

function SumOfSquares({ n = 10 }) {
  const [result, setResult] = useState(null)
  
  useEffect(() => {
    const value = sum(sq(N(n)))
    setResult(value)
  }, [n])
  
  return (
    <div>
      <h2>Sum of Squares (1² + 2² + ... + {n}²)</h2>
      <p>Result: {result}</p>
    </div>
  )
}

export default SumOfSquares
```

### React Hook for PrimaLib

```jsx
import { useState, useEffect } from 'react'
import { primes } from 'primalib'

function usePrimes(count) {
  const [primesList, setPrimesList] = useState([])
  
  useEffect(() => {
    const result = primes.take(count).toArray()
    setPrimesList(result)
  }, [count])
  
  return primesList
}

// Usage
function PrimeList({ count }) {
  const primes = usePrimes(count)
  
  return (
    <ul>
      {primes.map(p => <li key={p}>{p}</li>)}
    </ul>
  )
}
```

### React with Hooks and Memoization

```jsx
import React, { useState, useMemo } from 'react'
import { primaSet, primes } from 'primalib'

function PrimeStats({ count }) {
  const memoized = useMemo(
    () => primaSet(primes, { memo: true }),
    []
  )
  
  const primeList = useMemo(
    () => memoized.take(count).toArray(),
    [memoized, count]
  )
  
  return (
    <div>
      <h3>First {count} Primes</h3>
      <ul>
        {primeList.map(p => <li key={p}>{p}</li>)}
      </ul>
    </div>
  )
}
```

### React with Custom Hooks

```jsx
import { useState, useEffect } from 'react'
import { N, sq, sum, mean, stddev } from 'primalib'
import { primaSet } from 'primalib'

// Custom hook for statistical analysis
function useStats(data) {
  const [stats, setStats] = useState(null)
  
  useEffect(() => {
    if (!data || data.length === 0) return
    
    const values = Array.isArray(data) ? data : data.toArray()
    setStats({
      mean: mean(values),
      stddev: stddev(values),
      count: values.length
    })
  }, [data])
  
  return stats
}

// Usage
function DataAnalysis({ data }) {
  const stats = useStats(data)
  
  if (!stats) return <div>Loading...</div>
  
  return (
    <div>
      <p>Mean: {stats.mean.toFixed(2)}</p>
      <p>Std Dev: {stats.stddev.toFixed(2)}</p>
      <p>Count: {stats.count}</p>
    </div>
  )
}
```

### React + Vite Setup

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['primalib']
  }
})
```

**See**: [PATTERNS.md](./PATTERNS.md) - React patterns

---

## 🟢 **Vue Integration**

### Vue 3 Composition API

```vue
<template>
  <div>
    <h2>Sum of Squares (1² + 2² + ... + {{ n }}²)</h2>
    <p>Result: {{ result }}</p>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { N, sq, sum } from 'primalib'

const props = defineProps({
  n: { type: Number, default: 10 }
})

const result = computed(() => sum(sq(N(props.n))))
</script>
```

### Vue 3 with Composables

```javascript
// composables/usePrimes.js
import { ref, computed } from 'vue'
import { primes } from 'primalib'

export function usePrimes(count) {
  const primesList = ref([])
  
  const loadPrimes = () => {
    primesList.value = primes.take(count.value).toArray()
  }
  
  const primeCount = computed(() => primesList.value.length)
  
  return {
    primesList,
    primeCount,
    loadPrimes
  }
}

// Usage in component
<script setup>
import { usePrimes } from '@/composables/usePrimes'
import { ref } from 'vue'

const count = ref(100)
const { primesList, primeCount, loadPrimes } = usePrimes(count)

loadPrimes()
</script>
```

### Vue 3 with Reactive Data

```vue
<template>
  <div>
    <input v-model.number="n" type="number" />
    <p>Sum of squares: {{ sumOfSquares }}</p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { N, sq, sum } from 'primalib'

const n = ref(10)
const sumOfSquares = computed(() => sum(sq(N(n.value))))
</script>
```

**See**: [PATTERNS.md](./PATTERNS.md) - Vue patterns

---

## 🎨 **Svelte Integration**

### Svelte Component

```svelte
<script>
  import { N, sq, sum } from 'primalib'
  
  export let n = 10
  
  $: result = sum(sq(N(n)))
</script>

<div>
  <h2>Sum of Squares (1² + 2² + ... + {n}²)</h2>
  <p>Result: {result}</p>
</div>
```

### Svelte with Stores

```javascript
// stores/primes.js
import { writable, derived } from 'svelte/store'
import { primes } from 'primalib'

function createPrimesStore() {
  const { subscribe, set, update } = writable([])
  
  return {
    subscribe,
    load: (count) => {
      const result = primes.take(count).toArray()
      set(result)
    }
  }
}

export const primesStore = createPrimesStore()

// Usage
<script>
  import { primesStore } from './stores/primes'
  import { onMount } from 'svelte'
  
  onMount(() => {
    primesStore.load(100)
  })
  
  $: primeList = $primesStore
</script>
```

### Svelte with Reactive Statements

```svelte
<script>
  import { primaSet, N } from 'primalib'
  
  let count = 10
  let filter = 'even'
  
  $: numbers = primaSet(N(count))
    .filter(x => filter === 'even' ? x % 2 === 0 : x % 2 === 1)
    .toArray()
</script>

<input type="number" bind:value={count} />
<select bind:value={filter}>
  <option value="even">Even</option>
  <option value="odd">Odd</option>
</select>

<ul>
  {#each numbers as num}
    <li>{num}</li>
  {/each}
</ul>
```

**See**: [PATTERNS.md](./PATTERNS.md) - Svelte patterns

---

## 🟦 **Node.js / Express Integration**

### Basic Express Server

```javascript
// server.js
import express from 'express'
import { N, sq, sum, primes } from 'primalib'

const app = express()
app.use(express.json())

// API endpoint: Sum of squares
app.get('/api/sum-squares/:n', (req, res) => {
  const n = parseInt(req.params.n)
  const result = sum(sq(N(n)))
  res.json({ n, result })
})

// API endpoint: Primes
app.get('/api/primes/:count', (req, res) => {
  const count = parseInt(req.params.count)
  const result = primes.take(count).toArray()
  res.json({ count, primes: result })
})

// API endpoint: Prime statistics
app.get('/api/primes/:count/stats', (req, res) => {
  const count = parseInt(req.params.count)
  const primeList = primes.take(count).toArray()
  
  const stats = {
    count: primeList.length,
    sum: primeList.reduce((a, b) => a + b, 0),
    average: primeList.reduce((a, b) => a + b, 0) / primeList.length,
    largest: primeList[primeList.length - 1]
  }
  
  res.json({ count, stats })
})

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000')
})
```

### Express with Middleware

```javascript
import express from 'express'
import { primaSet, primes } from 'primalib'
import { mean, stddev } from 'primalib'

const app = express()

// Middleware: Parse query parameters
app.use((req, res, next) => {
  req.query.count = parseInt(req.query.count) || 100
  req.query.limit = parseInt(req.query.limit) || 1000
  next()
})

// Endpoint: Filtered primes
app.get('/api/primes/filtered', (req, res) => {
  const { count, limit, modulo } = req.query
  
  const filtered = primaSet(primes)
    .filter(p => p < limit && (modulo ? p % modulo === 0 : true))
    .take(count)
    .toArray()
  
  res.json({ count: filtered.length, primes: filtered })
})

// Endpoint: Prime statistics
app.get('/api/primes/stats', (req, res) => {
  const { count } = req.query
  const primeList = primes.take(count).toArray()
  
  res.json({
    count: primeList.length,
    mean: mean(primeList),
    stddev: stddev(primeList),
    min: primeList[0],
    max: primeList[primeList.length - 1]
  })
})

app.listen(3000)
```

### Express with Error Handling

```javascript
import express from 'express'
import { N, sq, sum } from 'primalib'
import { DimensionError, MaterializationError } from 'primalib'

const app = express()

app.get('/api/sum-squares/:n', (req, res, next) => {
  try {
    const n = parseInt(req.params.n)
    
    if (n < 1 || n > 10000) {
      return res.status(400).json({ 
        error: 'n must be between 1 and 10000' 
      })
    }
    
    const result = sum(sq(N(n)))
    res.json({ n, result })
  } catch (error) {
    if (error instanceof MaterializationError) {
      return res.status(500).json({ 
        error: 'Computation error', 
        message: error.message 
      })
    }
    next(error)
  }
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Internal server error' })
})

app.listen(3000)
```

**See**: [PATTERNS.md](./PATTERNS.md) - Server patterns, [ERRORS.md](./ERRORS.md) - Error handling

---

## 🔧 **Web Workers Integration**

### Basic Web Worker

```javascript
// worker.js
import { primes, N, sq, sum } from 'primalib'

self.onmessage = (e) => {
  const { type, data } = e.data
  
  try {
    let result
    
    switch (type) {
      case 'primes':
        result = primes.take(data.count).toArray()
        break
      
      case 'sum-squares':
        result = sum(sq(N(data.n)))
        break
      
      case 'filter':
        result = N(data.max)
          .filter(x => x % data.modulo === 0)
          .toArray()
        break
      
      default:
        throw new Error(`Unknown type: ${type}`)
    }
    
    self.postMessage({ success: true, result })
  } catch (error) {
    self.postMessage({ success: false, error: error.message })
  }
}
```

### Main Thread Usage

```javascript
// main.js
const worker = new Worker(new URL('./worker.js', import.meta.url))

// Request primes
worker.postMessage({ type: 'primes', data: { count: 1000 } })

worker.onmessage = (e) => {
  const { success, result, error } = e.data
  
  if (success) {
    console.log('Primes:', result)
  } else {
    console.error('Error:', error)
  }
}
```

### Web Worker with Progress

```javascript
// worker-with-progress.js
import { primes } from 'primalib'

self.onmessage = (e) => {
  const { count } = e.data
  const result = []
  
  let i = 0
  for (const prime of primes) {
    result.push(prime)
    i++
    
    // Report progress every 100 primes
    if (i % 100 === 0) {
      self.postMessage({ 
        type: 'progress', 
        progress: i / count,
        current: prime 
      })
    }
    
    if (i >= count) break
  }
  
  self.postMessage({ type: 'complete', result })
}
```

**See**: [PATTERNS.md](./PATTERNS.md) - Web Workers, [PRIMASET.md](./PRIMASET.md) - Lazy evaluation

---

## 🦕 **Deno Integration**

### Deno Basic Usage

```typescript
// main.ts
import { N, sq, sum, primes } from 'https://deno.land/x/primalib/mod.ts'

// Sum of squares
const result = sum(sq(N(10)))
console.log('Sum of squares:', result)

// Primes
const first100 = primes.take(100).toArray()
console.log('First 100 primes:', first100)
```

### Deno with HTTP Server

```typescript
// server.ts
import { serve } from 'https://deno.land/std/http/server.ts'
import { N, sq, sum, primes } from 'https://deno.land/x/primalib/mod.ts'

serve(async (req) => {
  const url = new URL(req.url)
  
  if (url.pathname === '/api/sum-squares') {
    const n = parseInt(url.searchParams.get('n') || '10')
    const result = sum(sq(N(n)))
    
    return new Response(JSON.stringify({ n, result }), {
      headers: { 'Content-Type': 'application/json' }
    })
  }
  
  if (url.pathname === '/api/primes') {
    const count = parseInt(url.searchParams.get('count') || '100')
    const result = primes.take(count).toArray()
    
    return new Response(JSON.stringify({ count, primes: result }), {
      headers: { 'Content-Type': 'application/json' }
    })
  }
  
  return new Response('Not Found', { status: 404 })
})

console.log('Server running on http://localhost:8000')
```

### Deno with TypeScript

```typescript
// types.ts
import type { PrimaSet } from 'https://deno.land/x/primalib/mod.ts'

export interface PrimeResponse {
  count: number
  primes: number[]
}

export function getPrimes(count: number): PrimeResponse {
  const { primes } = await import('https://deno.land/x/primalib/mod.ts')
  return {
    count,
    primes: primes.take(count).toArray()
  }
}
```

---

## 🛠️ **Build Tools Integration**

### Vite Configuration

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['primalib']
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'primalib': ['primalib']
        }
      }
    }
  }
})
```

### Webpack Configuration

```javascript
// webpack.config.js
module.exports = {
  resolve: {
    extensions: ['.js', '.mjs', '.json']
  },
  module: {
    rules: [
      {
        test: /\.mjs$/,
        type: 'javascript/auto',
        resolve: {
          fullySpecified: false
        }
      }
    ]
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        primalib: {
          test: /[\\/]node_modules[\\/]primalib[\\/]/,
          name: 'primalib',
          priority: 10
        }
      }
    }
  }
}
```

### Rollup Configuration

```javascript
// rollup.config.js
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

export default {
  input: 'src/main.js',
  output: {
    file: 'dist/bundle.js',
    format: 'es'
  },
  plugins: [
    nodeResolve({
      preferBuiltins: false
    }),
    commonjs()
  ],
  external: ['primalib'] // Or bundle it
}
```

### Parcel Configuration

```json
{
  "name": "my-app",
  "version": "1.0.0",
  "source": "src/index.html",
  "targets": {
    "default": {
      "distDir": "./dist"
    }
  }
}
```

Parcel automatically handles ES modules, no configuration needed!

---

## 📘 **TypeScript Integration**

### TypeScript Setup

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM"],
    "moduleResolution": "node",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true
  }
}
```

### TypeScript Usage

```typescript
// main.ts
import { N, sq, sum, primes, primaSet } from 'primalib'

// Type-safe operations
const result: number = sum(sq(N(10)))

// Type-safe sequences
const primeList: number[] = primes.take(100).toArray()

// Type-safe sets
const numbers: number[] = primaSet([1, 2, 3, 4, 5])
  .map((x: number) => x * 2)
  .toArray()
```

### TypeScript with Generics

```typescript
import { primaSet } from 'primalib'

function processData<T>(data: T[]): T[] {
  return primaSet(data)
    .filter((x: T) => x !== null)
    .toArray()
}

// Usage
const numbers = processData<number>([1, 2, null, 4])
const strings = processData<string>(['a', 'b', null, 'd'])
```

### TypeScript Definitions

PrimaLib includes TypeScript definitions (`primalib.d.ts`). Types are automatically available when you import:

```typescript
import type { PrimaSet, Point, Vector, Matrix } from 'primalib'

// Use types
function processSet<T>(set: PrimaSet<T>): T[] {
  return set.toArray()
}
```

**See**: [TYPES.md](./TYPES.md) - Type definitions (if exists)

---

## 🌐 **Browser (Vanilla JS) Integration**

### ES Modules in Browser

```html
<!DOCTYPE html>
<html>
<head>
  <title>PrimaLib Example</title>
</head>
<body>
  <div id="app"></div>
  
  <script type="module">
    import { N, sq, sum, primes } from './node_modules/primalib/primalib.mjs'
    
    // Sum of squares
    const result = sum(sq(N(10)))
    document.getElementById('app').textContent = `Sum: ${result}`
    
    // Primes
    const first10 = primes.take(10).toArray()
    console.log('First 10 primes:', first10)
  </script>
</body>
</html>
```

### Browser with CDN

```html
<!DOCTYPE html>
<html>
<head>
  <title>PrimaLib CDN Example</title>
</head>
<body>
  <div id="app"></div>
  
  <script type="module">
    // Import from CDN (when available)
    import { N, sq, sum } from 'https://cdn.jsdelivr.net/npm/primalib@latest/primalib.mjs'
    
    const result = sum(sq(N(10)))
    document.getElementById('app').textContent = `Sum: ${result}`
  </script>
</body>
</html>
```

### Browser with PrimaWeb

```html
<!DOCTYPE html>
<html>
<head>
  <title>PrimaWeb Example</title>
</head>
<body>
  <div id="content"></div>
  
  <script type="module">
    import { PrimaWeb, N, sq, sum } from './node_modules/primalib/primalib.mjs'
    
    const { say } = PrimaWeb('#content')
    
    // Render markdown
    say('# PrimaLib Example')
    say('## Sum of Squares')
    
    const result = sum(sq(N(10)))
    say(`Result: **${result}**`)
    
    // Render primes
    import { primes } from './node_modules/primalib/primalib.mjs'
    const first10 = primes.take(10).toArray()
    say(`\nFirst 10 primes: ${first10.join(', ')}`)
  </script>
</body>
</html>
```

**See**: [PRIMAWEB.md](./PRIMAWEB.md) - Web pipeline

---

## 🖥️ **Server-Side Rendering (SSR)**

### Next.js (React SSR)

```javascript
// pages/api/primes.js
import { primes } from 'primalib'

export default function handler(req, res) {
  const count = parseInt(req.query.count) || 100
  const result = primes.take(count).toArray()
  res.json({ count, primes: result })
}

// pages/primes.js
import { useState, useEffect } from 'react'
import { primes } from 'primalib'

export default function PrimesPage() {
  const [primeList, setPrimeList] = useState([])
  
  useEffect(() => {
    // Client-side only
    if (typeof window !== 'undefined') {
      const result = primes.take(100).toArray()
      setPrimeList(result)
    }
  }, [])
  
  return (
    <div>
      <h1>Primes</h1>
      <ul>
        {primeList.map(p => <li key={p}>{p}</li>)}
      </ul>
    </div>
  )
}
```

### Nuxt.js (Vue SSR)

```vue
<!-- pages/primes.vue -->
<template>
  <div>
    <h1>Primes</h1>
    <ul>
      <li v-for="p in primes" :key="p">{{ p }}</li>
    </ul>
  </div>
</template>

<script setup>
import { primes } from 'primalib'

// Server-side rendering
const primeList = primes.take(100).toArray()

// Client-side reactive
const primes = ref(primeList)
</script>
```

### SvelteKit SSR

```javascript
// src/routes/primes/+page.server.js
import { primes } from 'primalib'

export async function load({ url }) {
  const count = parseInt(url.searchParams.get('count')) || 100
  const primeList = primes.take(count).toArray()
  
  return {
    primes: primeList
  }
}
```

---

## 🔄 **State Management Integration**

### Redux Integration

```javascript
// actions/primes.js
import { primes } from 'primalib'

export const loadPrimes = (count) => (dispatch) => {
  const primeList = primes.take(count).toArray()
  dispatch({ type: 'PRIMES_LOADED', payload: primeList })
}
```

### Zustand Integration

```javascript
// store/primes.js
import create from 'zustand'
import { primes } from 'primalib'

export const usePrimesStore = create((set) => ({
  primes: [],
  loading: false,
  loadPrimes: async (count) => {
    set({ loading: true })
    const primeList = primes.take(count).toArray()
    set({ primes: primeList, loading: false })
  }
}))
```

### Jotai Integration

```javascript
// atoms/primes.js
import { atom } from 'jotai'
import { primes } from 'primalib'

export const primesAtom = atom([])

export const loadPrimesAtom = atom(
  null,
  async (get, set, count) => {
    const primeList = primes.take(count).toArray()
    set(primesAtom, primeList)
  }
)
```

---

## 🧪 **Testing Integration**

### Jest Configuration

```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.mjs$': 'babel-jest'
  },
  moduleFileExtensions: ['js', 'mjs', 'json']
}
```

### Vitest Configuration

```javascript
// vitest.config.js
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true
  }
})
```

### Test Example

```javascript
// test/primes.test.js
import { describe, it, expect } from 'vitest'
import { primes } from 'primalib'

describe('Primes', () => {
  it('should generate first 10 primes', () => {
    const result = primes.take(10).toArray()
    expect(result).toEqual([2, 3, 5, 7, 11, 13, 17, 19, 23, 29])
  })
})
```

**See**: [PRIMATEST.md](./PRIMATEST.md) - Testing approach

---

## 📦 **Package Manager Integration**

### npm

```bash
npm install primalib
```

### yarn

```bash
yarn add primalib
```

### pnpm

```bash
pnpm add primalib
```

### Bun

```bash
bun add primalib
```

---

## 🔗 **Cross-References**

- **[PATTERNS.md](./PATTERNS.md)** - Common patterns and recipes
- **[PRIMALIB.md](./PRIMALIB.md)** - Complete API documentation
- **[PRIMASET.md](./PRIMASET.md)** - Core lazy set operations
- **[PRIMAWEB.md](./PRIMAWEB.md)** - Web pipeline
- **[ERRORS.md](./ERRORS.md)** - Error handling
- **[FAQ.md](./FAQ.md)** - Frequently asked questions

---

**Integration Guide** - *PrimaLib works everywhere - React, Vue, Node.js, and more.* 🔗

