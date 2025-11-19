# @primalib/web - ⚠️  EXPERIMENTAL

**Status:** Experimental - API may change  
**Compatibility:** Browser + Node.js  
**Version:** 0.2.0

Universal web pipeline for PrimaLib demos, examples, and prototypes.

## ⚠️  Experimental Notice

This module is **experimental** and under active development:
- API may change without notice
- Not recommended for production use
- Intended for demos, examples, and experimentation
- Bugs expected - please report!

## Features

### Browser Support
- DOM manipulation
- Event handling
- WebSocket client
- Markdown rendering
- 3D visualization (Three.js integration)

### Server Support
- Node.js WebSocket server
- Server-side rendering
- Development server utilities

## Installation

```bash
npm install @primalib/web
```

**Note:** This module has a larger footprint (~160KB) and includes browser-specific code. Only install if you need web features.

## Usage

### Browser

```javascript
import { el, on, send } from '@primalib/web'

// Create elements
const button = el('button', { text: 'Click me!' })

// Event handling
on(button, 'click', () => console.log('Clicked!'))

// WebSocket
const ws = send('ws://localhost:8080')
ws.onmessage = (data) => console.log(data)
```

### Server (Node.js)

```javascript
import { createServer } from '@primalib/web'

// WebSocket server
const server = createServer({ port: 8080 })
server.on('connection', (ws) => {
  ws.send('Welcome!')
})
```

## Modules

- **primaweb.mjs** - Main web utilities (DOM, events, WebSocket)
- **primaenv.mjs** - Environment detection (browser/node)
- **prima3d.mjs** - Three.js integration for 3D visualization

## Examples

See `primalib/examples/` for complete examples using this module.

## Roadmap

This module is evolving. Planned features:
- Reactive state management
- Virtual DOM improvements
- Better SSR support
- WebGL helpers
- Canvas utilities

## Feedback

Since this is experimental, your feedback is crucial:
- **Issues:** https://github.com/primalibjs/primalib/issues
- **Label:** Add `experimental` and `web` labels
- **Feature requests:** Welcome!

## Alternative

If you need stable web utilities, consider:
- Raw DOM API (no dependencies)
- React/Vue/Svelte (mature frameworks)
- Separate web frameworks

This module exists to support PrimaLib demos and provide lightweight utilities for mathematical visualizations.

---

**@primalib/web** — *Experimental web utilities for mathematical prototypes.* 🧪

