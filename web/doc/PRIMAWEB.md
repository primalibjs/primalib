# PrimaWeb - Universal Web Pipeline

> **"The cherry on top 🍒 - Universal web pipeline for demos, examples, and interactive applications."**

PrimaWeb provides a universal web pipeline that works everywhere: browsers, Node.js servers, WebSocket clients, and standalone scripts. It offers a simple API (`say()`, `on()`, `send()`) that adapts to the environment automatically.

## 🎯 **Architecture**

- **Universal API**: Works in browser, Node.js, WebSocket, and standalone contexts
- **Markdown Rendering**: Automatic markdown-to-HTML conversion
- **Event Handling**: Unified API for DOM events and WebSocket messages
- **WebSocket Pipeline**: Client/server communication helpers
- **DOM as PrimaSet**: Access DOM elements as lazy sets
- **Context Factory**: Create contexts with default targets

## 🍒 **The Cherry on Top**

PrimaWeb is part of PrimaLib - not a separate package. It's the **cherry on top** that makes PrimaLib shine in web environments:

- **PrimaLib** = The cake (rock-solid mathematical foundation)
- **PrimaWeb** = The cherry 🍒 (dev tool for demos/examples)

Together: One package, two purposes - math magic + web showcase.

## 📝 **say() - Universal Renderer**

`say()` renders markdown or HTML to the DOM (browser) or returns HTML string (server).

### Basic Usage

```javascript
import { say } from 'primalib'

// Render markdown
say('# Hello World')
say('## Subtitle')
say('**Bold** and *italic* text')

// Render HTML directly
say('<div>Hello</div>')
```

### Markdown Support

```javascript
import { say } from 'primalib'

// Headers
say('# H1')
say('## H2')
say('### H3')

// Text formatting
say('**bold** and *italic*')
say('`code` inline')

// Code blocks
say('```javascript\nconst x = 1\n```')

// Links
say('[Link text](https://example.com)')

// Paragraphs
say('First paragraph\n\nSecond paragraph')
```

### Target Selection

```javascript
import { say } from 'primalib'

// Default: document.body
say('# Hello')

// Specific selector
say('# Hello', '#content')
say('# Hello', '#messages')

// DOM element
const el = document.querySelector('#content')
say('# Hello', el)
```

### Append Mode

```javascript
import { say } from 'primalib'

// Append mode (automatic when):
// - Text starts with newline
// - Target is #messages
// - Target already has content (except #content)

say('# First', '#messages')
say('\n# Second', '#messages')  // Appends

// Replace mode (default)
say('# First', '#content')
say('# Second', '#content')  // Replaces
```

### Server/Node.js

```javascript
import { say } from 'primalib'

// Returns HTML string (doesn't modify DOM)
const html = say('# Hello World')
console.log(html)  // → '<h1>Hello World</h1>'
```

## 🎯 **on() - Event Handler**

`on()` handles DOM events (browser) or WebSocket messages (client/server).

### DOM Events

```javascript
import { on } from 'primalib'

// Click handler
on('click', (e) => {
  console.log('Clicked!', e.target)
})('#button')

// Change handler
on('change', (e) => {
  console.log('Changed!', e.target.value)
})('#input')

// Submit handler
on('submit', (e) => {
  e.preventDefault()
  console.log('Submitted!')
})('#form')
```

### WebSocket Messages

```javascript
import { on, client } from 'primalib'

// Client: handle messages
const pipe = client('ws://localhost:8080')

pipe.on('message', (data, ws) => {
  console.log('Received:', data)
})

pipe.on('update', (data, ws) => {
  console.log('Update:', data)
})
```

### Server WebSocket

```javascript
import { on, server } from 'primalib'
import { WebSocketServer } from 'ws'

const wss = new WebSocketServer({ port: 8080 })

wss.on('connection', (ws) => {
  const pipe = server(ws)
  
  pipe.on('message', (data, ws) => {
    console.log('Client sent:', data)
  })
})
```

## 📤 **send() - Message Sender**

`send()` sends messages through WebSocket connections.

### Client

```javascript
import { send, client } from 'primalib'

const pipe = client('ws://localhost:8080')

// Send message
pipe.send('message', { text: 'Hello' })

// Send with function (evaluated when sent)
pipe.send('update', () => ({ time: Date.now() }))
```

### Server

```javascript
import { send, server } from 'primalib'

const pipe = server(ws)

// Send to client
pipe.send('response', { status: 'ok' })

// Broadcast to all clients
wss.clients.forEach(client => {
  server(client).send('broadcast', { message: 'Hello all' })
})
```

## 🎨 **el() - DOM as PrimaSet**

`el()` returns DOM elements as PrimaSet for lazy operations.

### Basic Usage

```javascript
import { el } from 'primalib'

// Select elements
const buttons = el('button')
const inputs = el('.input')
const items = el('#list li')

// Use PrimaSet operations
buttons.forEach(btn => console.log(btn.textContent))
inputs.map(input => input.value).toArray()
items.filter(item => item.textContent.includes('test'))
```

### Operations

```javascript
import { el } from 'primalib'

// Filter
el('div').filter(div => div.classList.contains('active'))

// Map
el('input').map(input => input.value)

// Take
el('li').take(5)  // First 5 list items

// ForEach
el('button').forEach(btn => {
  btn.addEventListener('click', () => console.log('Clicked'))
})
```

## 🔌 **Client/Server Pipeline**

### Client

```javascript
import { client } from 'primalib'

// Create client connection
const pipe = client('ws://localhost:8080')

// Handle messages
pipe.on('message', (data, ws) => {
  console.log('Received:', data)
})

// Send messages
pipe.send('hello', { name: 'World' })

// Use say() in context
pipe.say('# Connected!')
```

### Server

```javascript
import { server } from 'primalib'
import { WebSocketServer } from 'ws'

const wss = new WebSocketServer({ port: 8080 })

wss.on('connection', (ws) => {
  const pipe = server(ws)
  
  // Handle messages
  pipe.on('message', (data, ws) => {
    console.log('Client sent:', data)
    pipe.send('response', { echo: data })
  })
  
  // Send welcome
  pipe.send('welcome', { message: 'Connected!' })
})
```

## 🏭 **PrimaWeb Factory**

`PrimaWeb()` creates a context with a default target for convenience.

### Factory Usage

```javascript
import { PrimaWeb } from 'primalib'

// Create context with default target
const pw = PrimaWeb('#content')

// All methods use #content as default
pw.say('# Hello')  // → renders to #content
pw.say('## World')  // → renders to #content

// Can override target
pw.say('# Other', '#messages')  // → renders to #messages
```

### Direct API

```javascript
import { PrimaWeb } from 'primalib'

// Direct API (no context)
PrimaWeb.say('# Hello', '#content')
PrimaWeb.on('click', handler)('#button')
PrimaWeb.el('div').forEach(div => console.log(div))
```

### Context Methods

```javascript
import { PrimaWeb } from 'primalib'

const pw = PrimaWeb('#content')

// Available methods
pw.say(text, target?)      // Render markdown/HTML
pw.on(type, handler)        // Event handler
pw.send(type, data)         // Send message (needs pipe)
pw.el(selector)             // DOM elements as PrimaSet
pw.client(url)              // Create client pipe
pw.server(ws)               // Create server pipe
pw.include(path, options)   // Load modules
pw.loadEnv()                // Load environment info
pw.primaSet                 // PrimaSet factory
pw.primalib                 // Full PrimaLib API
```

## 📦 **include() - Module Loading**

`include()` loads modules dynamically (browser and Node.js).

### Basic Usage

```javascript
import { include } from 'primalib'

// Load module
const module = await include('./module.mjs')

// Use module
module.doSomething()
```

### Options

```javascript
import { include } from 'primalib'

// Load as code
const code = await include('./script.mjs', { type: 'code' })

// Load as text
const text = await include('./data.txt', { type: 'text' })

// Load as JSON
const json = await include('./data.json', { type: 'json' })
```

## 🌍 **Environment Detection**

PrimaWeb automatically detects the environment and adapts behavior.

### Browser

```javascript
// In browser: say() renders to DOM
say('# Hello')  // → renders to document.body
```

### Node.js/Server

```javascript
// In Node.js: say() returns HTML string
const html = say('# Hello')  // → '<h1>Hello</h1>'
```

### WebSocket

```javascript
// WebSocket: on() handles messages
pipe.on('message', (data, ws) => {
  // Handle message
})
```

## 📋 **Complete API Reference**

### Core Functions

| Function | Description | Example |
|----------|-------------|---------|
| `say(text, target?)` | Render markdown/HTML | `say('# Hello', '#content')` |
| `on(type, handler)` | Event handler | `on('click', fn)('#button')` |
| `send(type, data)` | Send message | `pipe.send('msg', data)` |
| `el(selector)` | DOM as PrimaSet | `el('div')` |
| `client(url)` | Create client pipe | `client('ws://localhost:8080')` |
| `server(ws)` | Create server pipe | `server(ws)` |
| `include(path, options?)` | Load module | `include('./module.mjs')` |

### Factory

| Function | Description | Example |
|----------|-------------|---------|
| `PrimaWeb(selector?)` | Create context | `PrimaWeb('#content')` |
| `pw.say(text, target?)` | Render with context | `pw.say('# Hello')` |
| `pw.on(type, handler)` | Event handler | `pw.on('click', fn)` |
| `pw.send(type, data)` | Send message | `pw.send('msg', data)` |
| `pw.el(selector)` | DOM elements | `pw.el('div')` |
| `pw.client(url)` | Client pipe | `pw.client('ws://...')` |
| `pw.server(ws)` | Server pipe | `pw.server(ws)` |
| `pw.include(path)` | Load module | `pw.include('./mod.mjs')` |
| `pw.loadEnv()` | Load environment | `pw.loadEnv()` |
| `pw.primaSet` | PrimaSet factory | `pw.primaSet([1,2,3])` |
| `pw.primalib` | PrimaLib API | `pw.primalib.N(10)` |

## 🎨 **Usage Examples**

### Example 1: Simple Page

```javascript
import { PrimaWeb } from 'primalib'

const pw = PrimaWeb('#content')

pw.say('# Welcome')
pw.say('## Features')
pw.say('- Feature 1\n- Feature 2\n- Feature 3')
```

### Example 2: Interactive Demo

```javascript
import { PrimaWeb } from 'primalib'
import { N, primes } from 'primalib'

const pw = PrimaWeb('#content')

pw.say('# Prime Numbers Demo')

pw.on('click', () => {
  const first10 = primes.take(10).toArray()
  pw.say(`\nFirst 10 primes: ${first10.join(', ')}`, '#output')
})('#show-primes')
```

### Example 3: WebSocket Chat

```javascript
import { PrimaWeb } from 'primalib'

const pw = PrimaWeb('#messages')
const pipe = pw.client('ws://localhost:8080')

// Handle messages
pipe.on('message', (data, ws) => {
  pw.say(`\n**${data.user}**: ${data.text}`)
})

// Send message
pw.on('click', () => {
  const input = document.querySelector('#input')
  pipe.send('message', {
    user: 'You',
    text: input.value
  })
  input.value = ''
})('#send')
```

### Example 4: Server WebSocket

```javascript
import { server } from 'primalib'
import { WebSocketServer } from 'ws'

const wss = new WebSocketServer({ port: 8080 })

wss.on('connection', (ws) => {
  const pipe = server(ws)
  
  pipe.on('message', (data, ws) => {
    // Echo back
    pipe.send('response', { echo: data.text })
    
    // Broadcast to all
    wss.clients.forEach(client => {
      if (client !== ws && client.readyState === 1) {
        server(client).send('broadcast', {
          user: data.user,
          text: data.text
        })
      }
    })
  })
})
```

### Example 5: DOM Operations

```javascript
import { el } from 'primalib'

// Filter active items
el('.item')
  .filter(item => item.classList.contains('active'))
  .forEach(item => console.log(item.textContent))

// Map values
const values = el('input')
  .map(input => input.value)
  .toArray()

// Take first 5
el('li')
  .take(5)
  .forEach(li => li.classList.add('highlight'))
```

### Example 6: Integration with PrimaLib

```javascript
import { PrimaWeb } from 'primalib'
import { N, primes, mean, stddev } from 'primalib'

const pw = PrimaWeb('#content')

// Use PrimaLib in web context
const numbers = N(100).toArray()
const stats = {
  mean: mean(numbers),
  stddev: stddev(numbers)
}

pw.say(`## Statistics\n\nMean: ${stats.mean}\nStd Dev: ${stats.stddev}`)

// Prime analysis
const first100 = primes.take(100).toArray()
pw.say(`\n## First 100 Primes\n\n${first100.join(', ')}`)
```

### Example 7: Dynamic Content

```javascript
import { PrimaWeb } from 'primalib'
import { hypercube } from 'primalib'

const pw = PrimaWeb('#content')

pw.on('click', () => {
  const h = hypercube([0, 0, 0], [1, 1, 1])
  const vertices = h.vertices()
  
  pw.say(`\n## 3D Cube Vertices\n\n${vertices.length} vertices:`, '#output')
  vertices.forEach((v, i) => {
    pw.say(`\n${i + 1}. (${v[0]}, ${v[1]}, ${v[2]})`, '#output')
  })
})('#show-cube')
```

### Example 8: Module Loading

```javascript
import { include } from 'primalib'

// Load module dynamically
const module = await include('./my-module.mjs')
module.doSomething()

// Load as JSON
const data = await include('./data.json', { type: 'json' })
console.log(data)
```

## ⚡ **Performance Notes**

- **Lazy Evaluation**: `el()` returns lazy PrimaSet - only queries DOM when needed
- **Markdown Parsing**: Simple regex-based parser - fast but limited
- **WebSocket**: Messages are JSON-serialized - use efficient data structures
- **DOM Updates**: `say()` uses `innerHTML` or `insertAdjacentHTML` - efficient for small updates

## 🔗 **Integration**

PrimaWeb integrates seamlessly with PrimaLib:

```javascript
import { PrimaWeb } from 'primalib'
import { N, primes, hypercube, mean } from 'primalib'

const pw = PrimaWeb('#content')

// Use all PrimaLib features in web context
pw.say('# Mathematical Demo')

const numbers = N(100).toArray()
pw.say(`Mean: ${mean(numbers)}`)

const first10 = primes.take(10).toArray()
pw.say(`First 10 primes: ${first10.join(', ')}`)

const h = hypercube([0, 0], [1, 1])
pw.say(`Square vertices: ${h.vertices().length}`)
```

## 🎓 **Architecture Notes**

### Universal API

- **Browser**: `say()` renders to DOM, `on()` handles DOM events
- **Server**: `say()` returns HTML string, `on()` handles WebSocket messages
- **WebSocket**: Unified message handling for client and server

### Markdown Support

- Headers: `#`, `##`, `###`
- Text: `**bold**`, `*italic*`, `` `code` ``
- Code blocks: ` ```javascript ... ``` `
- Links: `[text](url)`
- Paragraphs: Automatic from line breaks

### WebSocket Protocol

Messages are JSON-serialized with `type` and `data`:

```json
{
  "type": "message",
  "data": { "text": "Hello" }
}
```

### Context Factory

`PrimaWeb(selector)` creates a context that:
- Sets default target for `say()`
- Provides all PrimaWeb methods
- Exposes `primaSet` and `primalib` APIs
- Works in browser and Node.js

---

**PrimaWeb** provides a universal web pipeline that makes PrimaLib shine in browsers and web applications. 🍒

