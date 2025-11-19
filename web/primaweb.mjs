/**
 * PrimaWeb - Universal Web Pipeline
 * Single API: say(), on(), send()
 * Works: file://, http://, server, WebSocket, standalone
 * Exposes: primaset + primalib
 * 
 * Usage:
 *   const pw = PrimaWeb('#content')  // Factory: creates context
 *   pw.say('# Hello')                // Uses #content automatically
 *   
 *   PrimaWeb.say('# Hello', '#other') // Direct: can override target
 */

import { primaSet } from '../core/primaset.mjs'
import { env, include } from './primaenv.mjs'
import * as primalib from 'primalib'

// ============================================================================
// Universal say() - Works Everywhere
// ============================================================================

const markdown = (text) => {
  if (!text) return ''
  return text
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>')
    .replace(/^(?!<[h|p|pre|ul|ol])/gm, '<p>')
    .replace(/(?<!>)$/gm, '</p>')
    .replace(/<p><\/p>/g, '')
    .replace(/<p>(<[h|p|pre|ul|ol])/g, '$1')
    .replace(/(<\/[h|p|pre|ul|ol]>)<\/p>/g, '$1')
}

const say = (text, target = null) => {
  // If text is already HTML (starts with <), use it directly
  // Otherwise, render markdown to HTML
  const html = text.trim().startsWith('<') ? text : markdown(text)

  // Browser: render to DOM
  if (typeof document !== 'undefined') {
    const targetEl = target ? (typeof target === 'string' ? document.querySelector(target) : target) : document.body
    if (targetEl) {
      // Append if: text starts with newline, or target is #messages, or target already has content (except #content)
      const shouldAppend = text.trimStart().startsWith('\n') || 
                          target === '#messages' ||
                          (targetEl.innerHTML && targetEl.innerHTML.trim().length > 0 && target !== '#content')
      if (shouldAppend) {
        targetEl.insertAdjacentHTML('beforeend', html)
      } else {
        targetEl.innerHTML = html
      }
      return html
    }
  }

  // Server/Node: return HTML string (works with both markdown and HTML)
  return html
}

// ============================================================================
// Universal on() - Event Handler
// ============================================================================

const on = (type, handler) => {
  // Browser: DOM events (when called with selector)
  if (typeof document !== 'undefined' && typeof type === 'string' && type.match(/^(click|change|input|submit)$/)) {
    return (selector) => {
      const el = typeof selector === 'string' ? document.querySelector(selector) : selector
      if (el) {
        el.addEventListener(type, handler)
        return el
      }
    }
  }

  // WebSocket: message handler (when called with pipe or ws)
  return (pipeOrWs) => {
    const ws = pipeOrWs?.ws || pipeOrWs
    if (!ws) return pipeOrWs
    
    // Browser WebSocket: use addEventListener (works even when CONNECTING)
    if (typeof ws.addEventListener === 'function') {
      const listener = (event) => {
        try {
          const data = JSON.parse(event.data)
          if (data.type === type) {
            handler(data.data, ws)
          }
        } catch (e) {
          // Silently ignore parse errors
        }
      }
      // Attach immediately - works even if WebSocket is CONNECTING
      ws.addEventListener('message', listener)
      return { remove: () => ws.removeEventListener('message', listener) }
    }
    
    // Node.js WebSocket: use on() method
    if (typeof ws.on === 'function') {
      const listener = (message) => {
        try {
          const data = typeof message === 'string' ? JSON.parse(message) : JSON.parse(message.toString())
          if (data.type === type) handler(data.data, ws)
        } catch (e) { }
      }
      ws.on('message', listener)
      return { remove: () => ws.removeListener('message', listener) }
    }
    
    return pipeOrWs
  }
}

// ============================================================================
// Universal send() - Message Sender
// ============================================================================

const send = (type, data) => {
  return (pipeOrWs) => {
    const ws = pipeOrWs?.ws || pipeOrWs
    if (ws && ws.readyState === 1) {
      const payload = typeof data === 'function' ? data() : data
      ws.send(JSON.stringify({ type, data: payload }))
    }
    return pipeOrWs
  }
}

// ============================================================================
// Element Access via Sets
// ============================================================================

const el = (selector) => {
  if (typeof document === 'undefined') return primaSet([])
  const elements = typeof selector === 'string' ?
    Array.from(document.querySelectorAll(selector)) :
    [selector].filter(Boolean)
  return primaSet(elements)
}

// ============================================================================
// Client/Server Pipeline
// ============================================================================

const client = (url = 'ws://localhost:8080') => {
  const ws = typeof WebSocket !== 'undefined' ? new WebSocket(url) : null
  const pipe = {
    ws,
    on: (type, handler) => on(type, handler)(pipe),
    send: (type, data) => send(type, data)(pipe),
    say,
    include
  }
  return pipe
}

const server = (ws) => {
  const pipe = {
    ws,
    on: (type, handler) => on(type, handler)(pipe),
    send: (type, data) => send(type, data)(pipe),
    say,
    include
  }
  return pipe
}

// ============================================================================
// Environment Helper - Auto-loads on bundle init
// ============================================================================

const loadEnv = async (target = null) => {
  if (typeof window === 'undefined' || window.location.protocol === 'file:') {
    return null
  }

  try {
    const envModule = await include('../primaweb/primaenv.mjs', { type: 'code' })
    const safeEnv = {
      runtime: envModule.env.runtime,
      protocol: envModule.env.protocol,
      moduleSystem: envModule.env.moduleSystem,
      features: envModule.env.features
    }

    // Auto-render if target provided
    if (target && typeof document !== 'undefined') {
      say(`\n\n## Environment\n\n\`\`\`json\n${JSON.stringify(safeEnv, null, 2)}\n\`\`\``, target)
    }

    return safeEnv
  } catch (e) {
    console.warn('Could not load env:', e)
    return null
  }
}

// ============================================================================
// Auto-load Environment on Bundle Init (Browser Only)
// ============================================================================

const autoLoadEnv = () => {
  if (typeof window !== 'undefined' && window.location.protocol !== 'file:') {
    // Auto-load environment info to console (non-blocking)
    loadEnv().catch(() => { })
  }
}

// ============================================================================
// Factory Function - Creates Context with Default Target
// ============================================================================

const createContext = (defaultTarget) => {
  return {
    say: (text, target = defaultTarget) => say(text, target),
    on,
    send,
    el,
    client,
    server,
    include,
    loadEnv: () => loadEnv(defaultTarget),
    primaSet,
    primalib
  }
}

// ============================================================================
// Export
// ============================================================================

// Direct API (no context)
const api = { say, on, send, el, client, server, include, primaSet, primalib }
// Factory function (with context) - MUST be the default export for IIFE
const PrimaWeb = (selector) => selector ? createContext(selector) : api
// Attach direct API to factory
Object.assign(PrimaWeb, api)
// Auto-load environment when bundle loads (browser only)
if (typeof window !== 'undefined') { autoLoadEnv() }
export { say, on, send, el, client, server, include, primaSet, primalib, PrimaWeb }

export default PrimaWeb
