# PrimaWeb Design Summary

## Core Philosophy

**Zero-cost plug-and-play**: Load bundle → Use API. No configuration, no setup, no headaches.

## Design Decisions

### 1. **Single Bundle Architecture**
- **Decision**: One `primaweb-bundle.js` includes everything (primaset + primalib)
- **Rationale**: Simplest possible - one script tag, everything available
- **Benefit**: Works with `file://` protocol (regular script tag, not ES modules)

### 2. **Universal API: `say()`, `on()`, `send()`**
- **Decision**: Three core functions that work everywhere (client, server, standalone)
- **Rationale**: Minimal surface area, maximum power
- **Benefit**: Same code works in browser, Node.js, WebSocket, standalone

### 3. **Context-Free Functions**
- **Decision**: Functions don't hold state, they transform inputs
- **Rationale**: Composition over configuration
- **Benefit**: Easy to test, easy to compose, no hidden state

### 4. **Separation: PrimaLib vs PrimaWeb**
- **Decision**: PrimaWeb depends on PrimaLib, exposes it
- **Rationale**: Clear separation of concerns
- **Benefit**: PrimaLib can exist independently, PrimaWeb adds web capabilities

### 5. **Workflow Composition**
- **Decision**: Interface as composition of workflows, not DOM manipulation
- **Rationale**: Think in workflows, not elements
- **Benefit**: Less DOM-tied, more functional, easier to reason about

### 6. **Environment Auto-Detection**
- **Decision**: `loadEnv()` auto-detects and renders environment info
- **Rationale**: Transparency without effort
- **Benefit**: User sees environment info automatically when available

### 7. **Unified Client/Server Pipeline**
- **Decision**: Same API for client and server (`client()`, `server()`)
- **Rationale**: One mindset, two directions
- **Benefit**: Code works on both sides, easy to reason about

## Current API

```javascript
// Core functions
say(text, target)      // Render markdown
on(type, handler)      // Handle events (DOM or WebSocket)
send(type, data)       // Send messages
el(selector)           // Get elements as primaSet
client(url)            // Create client pipe
server(ws)             // Create server pipe
include(path)          // Load modules
loadEnv(target)        // Load & render environment

// Exposed libraries
primaSet               // Lazy set factory
primalib               // Full PrimaLib namespace
```

## Current Usage Pattern

```javascript
const { say, on, primalib } = PrimaWeb
say('# Hello', '#content')
on('click', handler)('#button')
```

## Proposed Improvement: Context Factory

**Problem**: Passing `'#content'` to every `say()` call is repetitive.

**Solution**: Make `PrimaWeb` a factory that creates a context:

```javascript
// Instead of:
const { say, on } = PrimaWeb
say('# Hello', '#content')
say('# World', '#content')

// Do:
const { say, on } = PrimaWeb('#content')
say('# Hello')  // Uses #content automatically
say('# World')  // Uses #content automatically
```

**Benefits**:
- Less repetition
- Cleaner code
- Still flexible (can override target)
- Zero-cost (just a wrapper)

## Final API Proposal

```javascript
// Factory pattern - creates context with default target
const pw = PrimaWeb('#content')

// Core functions (with default target)
pw.say(text)           // Renders to #content
pw.on(type, handler)   // Handles events
pw.send(type, data)   // Sends messages
pw.el(selector)       // Gets elements
pw.client(url)        // Creates client pipe
pw.server(ws)         // Creates server pipe
pw.include(path)      // Loads modules
pw.loadEnv()          // Loads & renders env to #content

// Still accessible without context
PrimaWeb.say(text, target)  // Can override target
PrimaWeb.primalib            // Direct access
PrimaWeb.primaSet            // Direct access
```

## Implementation Strategy

1. **Factory Function**: `PrimaWeb(selector)` returns API with bound target
2. **Default Export**: `PrimaWeb` is both factory and namespace
3. **Backward Compat**: `PrimaWeb.say()` still works (no context)
4. **Zero Cost**: Just wraps functions, no performance impact

