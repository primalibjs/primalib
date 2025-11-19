# PrimaWeb Summary

## Core Philosophy

**PrimaWeb is PrimaSet applied to web development.** It demonstrates that `primaSet` isn't just for numbers - it can handle:
- **Web pages as sets of trees** - DOM elements are just nodes in a tree structure
- **Objects and nested structures** - `primaSet` treats objects and trees the same way it treats numbers
- **Infinite sequences** - WebSocket streams, event sequences, etc.

> **"PrimaWeb is not a product - it's a demo of PrimaSet's flexibility. Web pages are just sets of trees, and PrimaSet handles trees as naturally as numbers."**

**PrimaWeb is included with PrimaLib** - no separate package needed. It's the cherry on top 🍒 - a dev tool for demos and examples that showcases `primaSet`'s versatility.

## Zero-Cost Plug-and-Play

**The goal**: Make PrimaWeb effortless to use - just load a bundle and you're ready to go. No configuration, no setup, no headaches.

### Universal API

**Single API that works everywhere**:
- `file://` protocol (standalone HTML files)
- `http://` protocol (web servers)
- WebSocket (real-time communication)
- Node.js (server-side)

```html
<!-- Just load the bundle -->
<script src="primaweb/dist/primaweb.js"></script>
<script>
  const { say, el, client } = PrimaWeb('#content')
  
  say('# Hello World')
  // That's it - works everywhere!
</script>
```

## Core API

### 1. Factory Pattern: `PrimaWeb(selector)`

**Creates a context with a default target**, reducing repetition:

```javascript
const { say, el, on, send } = PrimaWeb('#content')

// say() uses #content as default target
say('# Hello')  // Renders to #content
say('## World', '#messages')  // Can override target
```

**Benefits**:
- Less repetition (no need to pass target every time)
- Cleaner code
- More intuitive API

### 2. Universal `say()` Function

**Renders markdown or HTML** to DOM (client) or returns HTML string (server):

```javascript
// Markdown
say('# Hello World')  // → <h1>Hello World</h1>

// HTML strings (detected by starting with <)
say('<h1>Hello</h1>')  // → Rendered directly

// Server-side: returns HTML string
const html = say('# Hello')  // Returns "<h1>Hello</h1>"
```

**Smart rendering**:
- Appends if text starts with newline, or target is `#messages`, or target already has content
- Replaces otherwise
- Works in browser, server, and standalone

### 3. Universal `on()` Function

**Unified event handling** for DOM events and WebSocket messages:

```javascript
// DOM events
on('click', '#button', (e) => {
  console.log('Clicked!')
})

// WebSocket messages
pipe.on('server-time', (data) => {
  console.log('Server time:', data.timestamp)
})
```

**Works everywhere**: Browser `addEventListener`, Node.js `on()`, WebSocket messages.

### 4. Universal `send()` Function

**Transparent messaging** between client and server:

```javascript
// Client
pipe.send('mousemove', { x: 100, y: 200 })

// Server
pipe.send('server-time', () => ({ timestamp: Date.now() }))
```

**No configuration needed** - just works.

### 5. DOM as Sets: `el()` Function

**Returns DOM elements as `primaSet` trees** - each DOM node becomes a primaSet:

```javascript
const { el } = PrimaWeb

// Get elements as primaSet
el('div').map(el => el.textContent = 'Hello')  // PrimaSet operations on DOM!
el('.items').filter(el => el.dataset.active === 'true')  // Filter DOM elements
el('input').forEach(input => input.value = '')  // ForEach on DOM elements

// Each DOM node is a primaSet tree
const divSet = el('div')  // primaSet tree of div elements
divSet.map(el => {
  const children = primaSet(el.children)  // Children as primaSet
  return children.map(child => child.textContent)
})
```

**Key insight**: We create a primaSet tree of elements for each DOM node - each node becomes a primaSet that can be handled just like any other primaSet.

### 6. Client/Server Pipeline

**Auto-connecting client/server** - connection is a "birth right":

```javascript
// Client: auto-connects on load
const pipe = client('ws://localhost:8080')

// Server: auto-handles connections
const pipe = server(8080)

// Both return pipes with on() and send() methods
pipe.on('message-type', handler)
pipe.send('message-type', data)
```

**No manual connection management** - just works.

### 7. Universal `include()` Function

**Transparent module loading** across environments:

```javascript
// Works everywhere - HTTP, WebSocket, or file://
const module = await include('../../primalib/tests/test.mjs', { type: 'code' })
```

**Handles**:
- HTTP: Uses dynamic import
- WebSocket: Loads via server
- file://: Uses Fetch + Blob URL (fallback)

## Bundle Architecture

### Problem: `file://` Protocol Limitation

**Browsers block ES module imports** with `file://` protocol for security reasons. This prevents using ES modules in standalone HTML files.

### Solution: IIFE Bundle

**Created `primaweb.js` bundle** that:
- Includes `primaset` and `primalib`
- Uses IIFE (Immediately Invoked Function Expression) format
- Works with regular `<script>` tag
- No module system needed

```html
<!-- Works in file://, http://, everywhere -->
<script src="primaweb/dist/primaweb.js"></script>
<script>
  const { say } = PrimaWeb('#content')
  say('# Hello')
</script>
```

### Build Process

**Unified build** in CI/CD:
- `dist/primalib.js` - PrimaLib bundle
- `primaweb/dist/primaweb.js` - PrimaWeb bundle (includes PrimaLib)

Users can choose between:
- `dist/primalib.js` - Just PrimaLib
- `primaweb/dist/primaweb.js` - PrimaWeb (includes PrimaLib)

## PrimaEnv: Environment Detection

**Moved `primaenv.mjs` from `primalib` to `primaweb`** to maintain `primalib`'s environment-agnostic nature.

**Responsibilities**:
- Environment detection (browser, Node.js, Deno, etc.)
- Transparent module loading
- Universal module system
- Zero-config - works automatically

**Key functions**:
- `detectEnv()` - Detects current environment
- `createInclude()` - Creates environment-appropriate include function
- `loadEnv()` - Auto-executes on bundle load (browser only)

## Server Implementation

### Features

1. **Auto-rebuild bundle**: Checks modification time and rebuilds if source files are newer
2. **Graceful shutdown**: Handles `SIGINT`/`SIGTERM` to close WebSocket connections and HTTP server cleanly
3. **Port conflict handling**: Handles `EADDRINUSE` errors
4. **File serving**: Serves files from `primaweb` directory and project root
5. **WebSocket support**: Bidirectional communication with auto-reconnect

### Message Handling

**Server sends**:
- `server-time` messages every second to connected clients

**Server receives**:
- `mousemove` messages from clients (logged to console with `process.stdout.write()` for single-line updates)
- `time` requests (responds with server time)

**No debug logs** - only essential receive logs (as requested).

## Demo Implementation

### `demo.html`: Real-Time Client-Server Communication

**Features**:
- Auto-connects on page load
- Auto-disconnects on page unload
- Displays server time updates on screen
- Sends mouse movements to server
- Shows mouse position on client

**Implementation**:
```javascript
const { say, client, el } = PrimaWeb('#content')

say(`# 🌟 PrimaWeb Demo
**Server Time:** <span id="server-time">--</span>
**Mouse Position:** <span id="mouse-pos">--</span>`)

// Auto-connect (connection is a birth right)
const pipe = client('ws://localhost:8080')

// Handle server time
pipe.on('server-time', (data) => {
  const timeStr = new Date(data.timestamp).toLocaleTimeString()
  document.getElementById('server-time').textContent = timeStr
  console.log(`[Server] Time: ${timeStr}`)
})

// Send mouse moves
document.addEventListener('mousemove', (e) => {
  const pos = { x: e.clientX, y: e.clientY }
  document.getElementById('mouse-pos').textContent = `(${pos.x}, ${pos.y})`
  if (pipe?.ws?.readyState === 1) {
    pipe.send('mousemove', pos)
  }
})
```

**Key points**:
- No manual connection management
- Transparent message passing
- Automatic UI updates
- Clean, minimal code

### `tests.html`: Automatic Test Runner

**Features**:
- Tests run automatically on page load
- Results displayed using `say()`
- No buttons, no manual triggers
- Clean, readable output

**Implementation**:
```javascript
const { say } = PrimaWeb('#content')

// Auto-run tests on load
import('./tests/test.mjs').then(async ({ test }) => {
  await import('./tests/primaops.test.mjs')
  await test.run(2, (results) => {
    say(`\n## Test Results\n\n✅ ${results.pass} passed, ❌ ${results.fail} failed`)
  })
})
```

### `hello.html`: Simplest Possible Example

**Minimal example** showing zero-cost plug-and-play:

```html
<script src="primaweb/dist/primaweb.js"></script>
<script>
  const { say } = PrimaWeb('#content')
  say('# Hello World')
</script>
```

**That's it** - works standalone, with server, everywhere.

## Key Design Decisions

1. **Zero-cost plug-and-play**: Just load bundle and use - no configuration
2. **Universal API**: Same API works in browser, server, standalone
3. **Factory pattern**: `PrimaWeb(selector)` creates context with default target
4. **DOM as sets**: `el()` returns primaSet trees for DOM manipulation
5. **Auto-connect**: Connection is a "birth right" - no manual management
6. **Environment agnostic**: PrimaLib stays pure, PrimaWeb handles environment concerns
7. **Bundle for file://**: IIFE bundle enables standalone HTML files
8. **No debug logs**: Only essential receive logs (as requested)

## File Structure

```
primaweb/
├── primaweb.mjs          # Core library (exports PrimaWeb, say, on, send, el, etc.)
├── primaenv.mjs          # Environment detection and module loading
├── server.js              # Node.js server with WebSocket support
├── build-primaweb.mjs    # Bundle builder
├── dist/
│   └── primaweb.js       # IIFE bundle (includes PrimaLib)
├── hello.html            # Simplest example
├── tests.html            # Auto-running test suite
├── demo.html             # Client-server communication demo
└── README.md             # Documentation
```

## Integration with PrimaLib

**PrimaWeb is part of PrimaLib**:
- Exported from `primalib.mjs`
- Included in PrimaLib npm package
- Uses PrimaLib's `primaSet` at its core
- Demonstrates PrimaLib's flexibility

**Architecture**:
```
PrimaLib
├── primaset (core) ⭐
├── primaops (operations)
├── primanum (number generators)
├── primageo (geometry)
├── primastat (statistics)
└── primaweb (web dev tool) 🍒
```

## Performance Characteristics

- **Bundle size**: Optimized for fast loading
- **Message handling**: Efficient WebSocket communication
- **DOM operations**: Uses primaSet for efficient element manipulation
- **Module loading**: Transparent, no noticeable overhead

## Future Enhancements

1. **More examples**: Additional demos showcasing PrimaWeb capabilities
2. **Performance optimizations**: Further bundle size reduction
3. **Additional transports**: Support for other communication protocols
4. **Enhanced DOM operations**: More primaSet operations on DOM elements

## Conclusion

PrimaWeb demonstrates that **`primaSet` can handle web development just as naturally as it handles numbers**. The core insight is that web pages are sets of trees, and `primaSet` handles trees the same way it handles numbers. By providing a zero-cost plug-and-play API that works everywhere, PrimaWeb makes client-server communication as simple as calling a function.

**PrimaWeb is the cherry on top** - showing that PrimaLib's `primaSet` is not just for math, but for any domain where you can think in terms of sets: numbers, objects, trees, DOM elements, or infinite streams.

