# 🍒 PrimaWeb: PrimaSet Applied to Web Dev

> **"PrimaWeb is not a product - it's a demo of PrimaSet's flexibility. Web pages are just sets of trees, and PrimaSet handles trees as naturally as numbers."**

**PrimaWeb is part of PrimaLib** - included in the same npm package. It's not a separate framework, but a demonstration of how flexible `primaSet` is. PrimaWeb shows that `primaSet` can handle DOM elements, trees, and objects just as naturally as it handles numbers.

## 🎯 What's This All About?

**PrimaWeb is PrimaSet applied to web development.** It demonstrates that `primaSet` isn't just for numbers - it can handle:
- **Web pages as sets of trees** - DOM elements are just nodes in a tree structure
- **Objects and nested structures** - `primaSet` treats objects and trees the same way it treats numbers
- **Infinite sequences** - WebSocket streams, event sequences, etc.

**The core insight**: A webpage is just a set of DOM trees, and `primaSet` handles trees as naturally as it handles numbers. PrimaWeb showcases this flexibility.

**PrimaWeb is included with PrimaLib** - no separate package needed. It provides a single, elegant API (`say()`, `on()`, `send()`) that works everywhere - `file://`, `http://`, WebSocket, and Node.js - making client-server communication as simple as calling a function.


- **Universal markdown rendering** (`say()`) - Works in browser, server, and standalone
- **Unified event handling** (`on()`) - DOM events and WebSocket messages with the same API
- **Transparent messaging** (`send()`) - Send messages between client and server effortlessly
- **DOM as sets** (`el()`) - Use PrimaSet operations on DOM elements
- **Auto-connecting client/server** - Connection is a "birth right" - just call `client()` and it works

### PrimaSet at the Core

PrimaWeb uses `primaSet` at its core:
- **`el()`** - Returns DOM elements as `primaSet`, creating a **primaSet tree** for each DOM node
- **`say()`** - Renders markdown or HTML strings (treats content as a set of elements)
- **`on()` / `send()`** - Handles events and messages (treats them as sets)

**We create a primaSet tree of elements for each DOM node** - each node becomes a primaSet that can be handled just like any other primaSet tree.

```javascript
import { PrimaWeb, primaSet } from 'primalib'

// DOM elements as PrimaSet tree
const { el, say } = PrimaWeb
el('div').map(el => el.textContent = 'Hello')  // PrimaSet operations on DOM!
el('.items').filter(el => el.dataset.active === 'true')  // Filter DOM elements
el('input').forEach(input => input.value = '')  // ForEach on DOM elements

// Each DOM node is a primaSet tree - handle it like any primaSet
const divSet = el('div')  // primaSet tree of div elements
divSet.map(el => {
  // Each element can also be treated as a primaSet
  const children = primaSet(el.children)  // Children as primaSet
  return children.map(child => child.textContent)
})

// say() can emit HTML strings as well as markdown
say('# Hello')  // Markdown → HTML
say('<h1>Hello</h1>')  // HTML string → rendered directly

// Compose web elements - mix() combines sets into one
el('div').mix(el('span'), el('p'))  // All elements as one unified set
el('.header').mix(el('.footer'))  // Compose header and footer elements

// Shrink complex types
primaSet([9007199254740991n]).shrink()  // BigInt → Number (when safe)
primaSet([[[el('div')]]]).shrink()  // Nested → single element
```

**This is the power of PrimaSet** - it works with DOM elements, objects, trees, and infinite sequences all the same way. Each DOM node becomes a primaSet tree that can be handled just like any other primaSet. `mix()` composes sets (like combining web elements), and `shrink()` reduces complex types to simpler forms.


## 🚀 Quick Start (30 Seconds!)

### Standalone (file://)

1. Build the bundle:
```bash
cd primalib
node build-primaweb.mjs
```

2. Open `primaweb/hello.html` directly in your browser - **it just works!**

### Server Mode

```bash
# From project root
node primaweb/server.js
# Open http://localhost:8080/hello.html
```

### In Your HTML

```html
<script src="dist/primaweb.js"></script>
<script>
  const { say, client, primalib } = PrimaWeb('#content')
  
  // Render markdown
  say('# Hello World\n\n**PrimaWeb** is working!')
  
  // Use PrimaLib
  const { N, sq, sum } = primalib
  say(`\n\nSum of squares: ${sum(sq(N(10)))}`)
  
  // Connect to server (auto-connects)
  const pipe = client('ws://localhost:8080')
  pipe.on('server-time', (data) => {
    console.log('Server time:', data.timestamp)
  })
</script>
```

**That's it!** No imports, no configuration, no complexity. 🎉

## 🧠 Core Philosophy

### Zero-Cost Plug-and-Play

PrimaWeb follows a **zero-cost plug-and-play** philosophy:

- **One bundle** (`primaweb.js`) includes everything (PrimaSet + PrimaLib)
- **One script tag** - just load it and use it
- **Works everywhere** - `file://`, `http://`, server, WebSocket
- **No configuration** - sensible defaults, auto-detection
- **No setup** - connection is automatic, environment is detected

### The Cherry on Top 🍒

PrimaWeb is **not a full web framework** - it's a dev tool that makes PrimaLib shine in web environments:

- **Part of PrimaLib** - Included in the same npm package
- **Dev tool** - Perfect for demos, examples, and showcasing
- **Zero-config** - Works everywhere (`file://`, `http://`, WebSocket)
- **Lightweight** - Just enough to make PrimaLib web-friendly

### Relationship with PrimaLib

**PrimaLib** is the foundation:
- **`primaSet`** ⭐ = The shining star (handles infinite sets, objects, trees as naturally as finite arrays)
- Pure math, operations, geometry (works everywhere)
- Environment-agnostic (Node.js, Deno, browser, anywhere)
- **Standalone** - Easy to integrate into any web page or framework

**PrimaWeb** is the demo 🍒:
- **PrimaSet applied to web dev** - Shows how flexible PrimaSet is
- Web pages as sets of trees - DOM elements handled like numbers
- Web capabilities (DOM, WebSocket, markdown rendering)
- Built on top of PrimaLib using PrimaSet
- Included in PrimaLib package (no separate install)

**Together**: PrimaLib provides the math magic with PrimaSet, PrimaWeb demonstrates PrimaSet's flexibility by applying it to web development.

### PrimaEnv: Bridging Environments

**PrimaEnv** bridges the gap between different environments, allowing (almost) transparent `include()` on the client:
- **Environment detection** - Auto-detects browser, Node.js, Deno, etc.
- **Transparent module loading** - `include()` works via HTTP, WebSocket, or Fetch+Blob
- **Universal module system** - Load modules seamlessly across environments
- **Zero-config** - Works automatically, adapts to the environment

```javascript
import { include } from 'primalib'

// Works everywhere - HTTP, WebSocket, or file://
const module = await include('../../primalib/tests/test.mjs', { type: 'code' })
```

This is how PrimaWeb achieves its "zero-cost plug-and-play" - PrimaEnv handles all the environment differences transparently.

## 📚 Universal API

PrimaWeb provides a **single API** that works everywhere:

### `say()` - Universal Markdown Renderer

Renders markdown to DOM (browser) or returns HTML string (server):

```javascript
const { say } = PrimaWeb('#content')

// Browser: renders to #content
say('# Hello\n\n**Bold** and *italic* text.')

// Server: returns HTML string
const html = say('# Hello')  // → '<h1>Hello</h1>'
```

**Features:**
- Works in browser (DOM) and server (string)
- Supports headers, bold, italic, code blocks, links
- Auto-appends to `#messages`, replaces `#content` by default
- Can override target: `say('# Hello', '#other')`

### `on()` - Universal Event Handler

Handles DOM events (browser) and WebSocket messages (client/server):

```javascript
const { on, client } = PrimaWeb()

// DOM events (browser)
on('click', (e) => console.log('Clicked!'))('#button')

// WebSocket messages (client)
const pipe = client('ws://localhost:8080')
pipe.on('server-time', (data) => {
  console.log('Server time:', data.timestamp)
})

// WebSocket messages (server)
server(ws).on('mousemove', (data) => {
  console.log('Mouse:', data.x, data.y)
})
```

**Features:**
- Same API for DOM events and WebSocket messages
- Works even when WebSocket is `CONNECTING`
- Automatically parses JSON messages
- Returns unsubscribe function

### `send()` - Universal Message Sender

Sends messages via WebSocket:

```javascript
const pipe = client('ws://localhost:8080')

// Send data
pipe.send('mousemove', { x: 100, y: 200 })

// Send function result (lazy evaluation)
pipe.send('server-time', () => ({ timestamp: Date.now() }))
```

**Features:**
- Automatically stringifies to JSON
- Supports functions (evaluated on send)
- Only sends when WebSocket is `OPEN`
- Returns pipe for chaining

### `el()` - DOM as Sets

Access DOM elements using PrimaSet operations:

```javascript
const { el } = PrimaWeb()

// Get elements as PrimaSet
el('#button').map(el => el.textContent = 'Click me')
el('.items').filter(el => el.dataset.active === 'true')
el('input').forEach(input => input.value = '')
```

**Features:**
- Returns PrimaSet of elements
- Use all PrimaSet operations (map, filter, forEach, etc.)
- Works with selectors or elements
- Returns empty set if no elements found

### `client()` - WebSocket Client Pipe

Creates a client WebSocket connection:

```javascript
const { client } = PrimaWeb()

// Auto-connects on creation
const pipe = client('ws://localhost:8080')

// Use pipe methods
pipe.on('server-time', (data) => console.log(data))
pipe.send('mousemove', { x: 100, y: 200 })

// Access WebSocket directly
pipe.ws.addEventListener('open', () => console.log('Connected!'))
```

**Features:**
- Auto-connects on creation
- Returns pipe with `on()`, `send()`, `say()`, `include()`
- Access WebSocket via `pipe.ws`
- Works in browser (uses native WebSocket)

### `server()` - WebSocket Server Pipe

Creates a server WebSocket pipe:

```javascript
const { server } = PrimaWeb()
const { WebSocketServer } = await import('ws')

const wss = new WebSocketServer({ port: 8080 })
wss.on('connection', (ws) => {
  const pipe = server(ws)
  
  // Use pipe methods
  pipe.on('mousemove', (data) => {
    console.log('Mouse:', data.x, data.y)
  })
  
  pipe.send('server-time', () => ({ timestamp: Date.now() }))
})
```

**Features:**
- Same API as client pipe
- Works with Node.js WebSocket servers
- Handles both string and Buffer messages
- Returns pipe with `on()`, `send()`, `say()`, `include()`

### `include()` - Universal Module Loader

Loads modules via dynamic import (http://), WebSocket (server), or Fetch + Blob URL (file:// fallback):

```javascript
const { include } = PrimaWeb()

// Load module
const module = await include('../../primalib/tests/test.mjs', { type: 'code' })
const { test } = module

// Use loaded module
await test.run(2, (results) => {
  console.log('Tests:', results)
})
```

**Features:**
- Works in browser (http://) and server (WebSocket)
- Falls back to Fetch + Blob URL for `file://`
- Supports ES modules
- Returns module exports

## 🏭 Factory Pattern

PrimaWeb uses a **factory pattern** to reduce repetition:

```javascript
// Without factory (repetitive)
const { say } = PrimaWeb
say('# Hello', '#content')
say('# World', '#content')

// With factory (clean)
const { say } = PrimaWeb('#content')
say('# Hello')  // Uses #content automatically
say('# World')  // Uses #content automatically

// Can still override target
say('# Other', '#sidebar')  // Override when needed
```

**Benefits:**
- Less repetition
- Cleaner code
- Still flexible (can override target)
- Zero-cost (just a wrapper)

## 📦 Bundle Architecture

PrimaWeb bundles everything into a single IIFE (`primaweb.js`):

```
primaweb.js
├── PrimaSet (lazy set factory)
├── PrimaLib (full namespace)
└── PrimaWeb (universal API)
    ├── say()
    ├── on()
    ├── send()
    ├── el()
    ├── client()
    ├── server()
    ├── include()
    └── loadEnv()
```

**Why IIFE?**
- Works with `file://` protocol (browsers block ES module imports)
- Single script tag - no module system needed
- Exposes global `window.PrimaWeb`
- Can still use ES modules in server mode

## 🎨 Examples

### Hello World

```html
<!-- hello.html -->
<script src="dist/primaweb.js"></script>
<script>
  const { say, primalib } = PrimaWeb('#content')
  const { N, sq, sum } = primalib
  
  say(`# 🌟 PrimaLib Hello
  
## Examples

**Result 1:** ${sum(sq(N(10)))}
**Result 2:** ${N(10).sq().sum()}
**Result 3:** ${JSON.stringify([...primalib.primes.take(10)])}

✅ Loaded successfully!`)
</script>
```

### Client-Server Communication

```html
<!-- demo.html -->
<script src="dist/primaweb.js"></script>
<script>
  const { say, client, el } = PrimaWeb('#content')
  
  say(`# 🌟 PrimaWeb Demo

## Real-Time Client-Server Communication

**Server Time:** <span id="server-time">--</span>
**Mouse Position:** <span id="mouse-pos">--</span>`)
  
  // Auto-connect on load
  const pipe = client('ws://localhost:8080')
  
  // Handle server time
  pipe.on('server-time', (data) => {
    const el = document.getElementById('server-time')
    if (el) el.textContent = new Date(data.timestamp).toLocaleTimeString()
  })
  
  // Send mouse moves
  let lastSend = 0
  document.addEventListener('mousemove', (e) => {
    if (pipe?.ws?.readyState === 1 && Date.now() - lastSend > 50) {
      pipe.send('mousemove', { x: e.clientX, y: e.clientY })
      document.getElementById('mouse-pos').textContent = `(${e.clientX}, ${e.clientY})`
      lastSend = Date.now()
    }
  })
</script>
```

### Server Implementation

```javascript
// server.js
import { server } from './primalib/primaweb.mjs'
import { WebSocketServer } from 'ws'

const wss = new WebSocketServer({ port: 8080 })

wss.on('connection', (ws) => {
  const pipe = server(ws)
  
  // Send server time every second
  setInterval(() => {
    pipe.send('server-time', () => ({ timestamp: Date.now() }))
  }, 1000)
  
  // Handle mouse moves
  pipe.on('mousemove', (data) => {
    process.stdout.write(`\r[CLIENT] Mouse Position: (${data.x}, ${data.y})`)
  })
})
```

## 🏗️ Architecture

### Separation of Concerns

```
┌─────────────────────────────────────────┐
│           PrimaWeb                      │
│  (Web capabilities: DOM, WebSocket)     │
│  - say(), on(), send(), el()            │
│  - client(), server()                   │
│  - include(), loadEnv()                 │
└──────────────┬──────────────────────────┘
               │ depends on
               ▼
┌─────────────────────────────────────────┐
│           PrimaLib                      │
│  (Pure math: lazy sets, operations)     │
│  - primaSet, N, primes, sq, sum        │
│  - Environment agnostic                 │
└─────────────────────────────────────────┘
```

**Key Design Decisions:**

1. **PrimaLib is environment-agnostic** - No browser/server dependencies
2. **PrimaWeb bridges the gap** - Adds web capabilities on top
3. **Single bundle** - Includes both for zero-cost plug-and-play
4. **Universal API** - Same functions work everywhere

### File Structure

```
primaweb/
├── dist/
│   └── primaweb.js          # IIFE bundle (includes PrimaSet + PrimaLib)
├── doc/                      # Design documentation
├── hello.html                # Minimal example
├── demo.html                 # Client-server demo
├── tests.html                # Test runner
├── server.js                 # Development server
├── primaenv.mjs              # Environment detection (moved from primalib)
└── README.md                 # This file
```

## 🔧 Development

### Building the Bundle

```bash
cd primalib
node build-primaweb.mjs
```

This creates `primaweb/dist/primaweb.js` with:
- PrimaSet (lazy set factory)
- PrimaLib (full namespace)
- PrimaWeb (universal API)
- Auto-loads environment on browser init

### Running the Server

```bash
# From project root
node primaweb/server.js
```

The server:
- Serves files from `primaweb/` directory
- Handles WebSocket connections
- Auto-rebuilds bundle when source changes
- Gracefully shuts down on SIGINT/SIGTERM

### Testing

```bash
# Open tests.html in browser (requires server)
node primaweb/server.js
# Then open http://localhost:8080/tests.html
```

Tests run automatically on page load and display results using `say()`.

## 🎯 Design Principles

1. **Zero-Cost Plug-and-Play** - Load bundle → Use API. No configuration.
2. **Universal API** - Same functions work everywhere (browser, server, standalone)
3. **Composition Over Configuration** - Functions compose, don't hold state
4. **Environment Agnosticism** - PrimaLib stays pure, PrimaWeb adds web capabilities
5. **Connection is a Birth Right** - Auto-connect, auto-disconnect, transparent
6. **DOM as Sets** - Use PrimaSet operations on DOM elements
7. **Adaptation Over Configuration** - Functions adapt to environment automatically

## 📖 Relationship with PrimaLib

**PrimaLib** is the foundation - a rock-solid, environment-agnostic math library:

- **`primaSet`** ⭐ = The shining star (handles infinite sets as naturally as finite ones)
- **Pure math operations** - Sets, infinite sequences, number theory, geometry
- **No web dependencies** - Works in Node.js, Deno, browser, anywhere
- **Plugin system** - Extensible, composable operations
- **Three calling styles** - OO, functional, pipeline

**PrimaWeb** is the cherry 🍒 on top:

- **Part of PrimaLib** - Included in the same npm package
- **Dev tool** - Perfect for demos, examples, showcasing
- **Web capabilities** - DOM, WebSocket, markdown rendering
- **Universal API** - Works everywhere PrimaLib works, plus web

**Together**, they provide:
- **PrimaLib** = Math made magical (pure, focused, `primaSet` as the star ⭐)
- **PrimaWeb** = The cherry 🍒 that makes PrimaLib shine in web environments

**Install once, get both:**
```bash
npm install primalib
# Includes PrimaLib + PrimaWeb
```

## 🚀 What's Next?

PrimaWeb is **production-ready** and **delightful to use**. Future enhancements might include:

- TypeScript definitions for PrimaWeb API
- More examples and use cases
- Performance optimizations
- Additional web capabilities (routing, state management, etc.)

But the core is **solid** - zero-cost plug-and-play, universal API, works everywhere. ✨

## 📄 License

MIT - Same as PrimaLib

## 🙏 Credits

Built on top of **PrimaLib** - a rock-solid foundation for mathematical operations and lazy sets.
