# Universal Include - Maximum Flexibility

## Problem
Browsers block ES module imports with `file://` protocol due to CORS restrictions. This prevents standalone HTML files from loading local modules.

## Solution: Universal `include()`

The `include()` function in `primaenv.mjs` uses multiple strategies to load resources everywhere:

### Strategies (in priority order):

1. **WebSocket** (if connected)
   - Client requests file from server
   - Server responds with file content
   - Works across network boundaries

2. **Dynamic Import** (http://, https://)
   - Native ES module loading
   - Fastest, most reliable
   - Requires server

3. **Fetch + Blob URL** (file://)
   - Fetch file as text
   - Create Blob URL
   - Import Blob URL as module
   - Works with `file://` protocol!

4. **Fetch + Eval** (fallback)
   - Fetch file as text
   - Eval as function
   - Less safe but works everywhere

5. **Node.js FS** (server-side)
   - Direct file system access
   - Fastest for server

## Usage

```javascript
import { include } from './primaenv.mjs'

// Works everywhere:
const module = await include('../primaset.mjs', { type: 'code' })
const text = await include('../data.txt', { type: 'resource' })

// With WebSocket:
const module = await include('../file.mjs', { websocket: ws })

// With caching:
const module = await include('../file.mjs', { cache: true })
```

## How It Works

### File:// Protocol Hack

```javascript
// 1. Fetch file as text (works with file://)
const response = await fetch('file:///path/to/file.mjs')
const code = await response.text()

// 2. Create Blob URL
const blob = new Blob([code], { type: 'application/javascript' })
const blobURL = URL.createObjectURL(blob)

// 3. Import Blob URL (works!)
const module = await import(blobURL)

// 4. Cleanup
URL.revokeObjectURL(blobURL)
```

This bypasses CORS restrictions by:
- Using `fetch()` which works with `file://` in most browsers
- Creating a Blob URL (same-origin)
- Importing the Blob URL (no CORS check)

## Benefits

- **Universal**: Works with file://, http://, https://, server, WebSocket
- **Automatic**: Detects environment and uses best strategy
- **Flexible**: Can override with options
- **Cached**: Optional caching for performance
- **Safe**: Falls back gracefully if strategy fails

## Limitations

- Some browsers may still block `fetch()` with `file://`
- Blob URLs require modern browser support
- WebSocket requires server connection

## Fallback Chain

1. Try WebSocket (if available)
2. Try dynamic import (http/https)
3. Try fetch + blob URL (file://)
4. Try fetch + eval (last resort)
5. Throw error if all fail

This ensures maximum compatibility across all environments.

