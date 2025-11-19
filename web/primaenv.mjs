/**
 * PrimaEnv - Universal Environment Detection & Resource Loading
 * Maximum flexibility: works everywhere (file://, http://, server, WebSocket)
 * Part of PrimaWeb - environment-aware layer
 */

import { primaSet } from '@primalib/core'

const detectEnv = () => {
  const globalObj = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : null
  
  // Safe require check - only in Node.js (browser: require is undefined)
  const safeRequire = (module) => {
    if (typeof window !== 'undefined') return null // Browser - no require
    if (typeof require === 'undefined') return null
    try {
      return require(module)
    } catch (e) {
      return null
    }
  }
  
  return {
    runtime: typeof window !== 'undefined' ? 'browser' : 
             typeof global !== 'undefined' ? 'node' : 
             typeof self !== 'undefined' ? 'worker' : 'unknown',
    
    moduleSystem: typeof module !== 'undefined' && module.exports ? 'cjs' :
                  typeof import.meta !== 'undefined' ? 'esm' : 'unknown',
    
    protocol: typeof window !== 'undefined' ? window.location?.protocol : 'node:',
    
    global: globalObj,
    
    features: {
      esm: typeof import.meta !== 'undefined',
      dynamicImport: typeof import.meta !== 'undefined' || typeof window !== 'undefined',
      fetch: typeof fetch !== 'undefined',
      websocket: typeof WebSocket !== 'undefined',
      worker: typeof Worker !== 'undefined',
      sharedArrayBuffer: typeof SharedArrayBuffer !== 'undefined',
      wasm: typeof WebAssembly !== 'undefined',
      streams: typeof ReadableStream !== 'undefined',
      crypto: typeof crypto !== 'undefined',
      node: typeof process !== 'undefined' && process.versions?.node,
      deno: typeof Deno !== 'undefined',
      bun: typeof Bun !== 'undefined'
    },
    
    node: {
      version: typeof process !== 'undefined' ? process.versions?.node : null,
      platform: typeof process !== 'undefined' ? process.platform : null,
      arch: typeof process !== 'undefined' ? process.arch : null,
      fs: typeof window === 'undefined' && typeof process !== 'undefined' ? (() => { try { return typeof require !== 'undefined' && require('fs') !== null } catch { return false } })() : false,
      http: typeof window === 'undefined' && typeof process !== 'undefined' ? (() => { try { return typeof require !== 'undefined' && require('http') !== null } catch { return false } })() : false
    },
    
    browser: {
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
      vendor: typeof navigator !== 'undefined' ? navigator.vendor : null,
      platform: typeof navigator !== 'undefined' ? navigator.platform : null,
      language: typeof navigator !== 'undefined' ? navigator.language : null,
      onLine: typeof navigator !== 'undefined' ? navigator.onLine : null
    }
  }
}

const getLoadStrategy = (env, resourceType = 'code') => {
  const { runtime, moduleSystem, protocol, features } = env
  
  const codeStrategies = {
    'node-esm-dynamic': () => runtime === 'node' && moduleSystem === 'esm' && features.dynamicImport ? 'dynamic-import' : null,
    'node-cjs': () => runtime === 'node' && moduleSystem === 'cjs' ? 'require' : null,
    'browser-http-dynamic': () => runtime === 'browser' && protocol === 'http:' && features.dynamicImport ? 'dynamic-import' : null,
    'browser-https-dynamic': () => runtime === 'browser' && protocol === 'https:' && features.dynamicImport ? 'dynamic-import' : null,
    'browser-file-fetch-eval': () => runtime === 'browser' && protocol === 'file:' && features.fetch ? 'fetch-eval' : null,
    'browser-fetch-eval': () => runtime === 'browser' && features.fetch ? 'fetch-eval' : null
  }
  
  const resourceStrategies = {
    'fetch': () => features.fetch ? 'fetch' : null,
    'fs': () => runtime === 'node' && env.node.fs ? 'fs' : null
  }
  
  if (resourceType === 'code') {
    return codeStrategies['node-esm-dynamic']() || 
           codeStrategies['node-cjs']() || 
           codeStrategies['browser-http-dynamic']() || 
           codeStrategies['browser-https-dynamic']() ||
           codeStrategies['browser-file-fetch-eval']() ||
           codeStrategies['browser-fetch-eval']() || 
           'unknown'
  }
  
  return resourceStrategies['fetch']() || 
         resourceStrategies['fs']() || 
         'unknown'
}

const createInclude = (env) => {
  const cache = new Map()
  const strategy = getLoadStrategy(env, 'code')
  const resourceStrategy = getLoadStrategy(env, 'resource')
  
  // Universal path resolver - works for relative paths
  const resolvePath = (path, base = null) => {
    if (env.runtime === 'node' && typeof window === 'undefined') {
      try {
        // Only use require in Node.js - guard against browser
        if (typeof require === 'undefined') return path
        const { join, dirname } = require('path')
        const { fileURLToPath } = require('url')
        const basePath = base ? dirname(fileURLToPath(base)) : process.cwd()
        return path.startsWith('/') ? path : join(basePath, path)
      } catch (e) {
        return path
      }
    }
    
    // Browser: resolve relative to current page
    if (typeof window !== 'undefined') {
      const baseURL = base || window.location.href
      try {
        return new URL(path, baseURL).href
      } catch (e) {
        // Fallback: relative to current directory
        const currentDir = window.location.href.substring(0, window.location.href.lastIndexOf('/') + 1)
        return currentDir + path
      }
    }
    
    return path
  }
  
  const loaders = {
    'dynamic-import': async (path) => {
      const resolvedPath = resolvePath(path)
      return await import(resolvedPath)
    },
    
    'require': (path) => {
      if (env.runtime !== 'node' || typeof window !== 'undefined') throw new Error('require only available in Node.js')
      if (typeof require === 'undefined') throw new Error('require not available')
      const resolvedPath = resolvePath(path)
      return require(resolvedPath)
    },
    
    'fetch-eval': async (path) => {
      const resolvedPath = resolvePath(path)
      const response = await fetch(resolvedPath)
      if (!response.ok) throw new Error(`Failed to fetch: ${resolvedPath}`)
      const code = await response.text()
      
      // Try dynamic import first (works standalone with file:// in some browsers)
      try {
        const blob = new Blob([code], { type: 'application/javascript' })
        const blobURL = URL.createObjectURL(blob)
        try {
          const module = await import(blobURL)
          URL.revokeObjectURL(blobURL)
          return module
        } catch (e) {
          URL.revokeObjectURL(blobURL)
          throw e
        }
      } catch (e) {
        // Fallback: eval (less safe but works)
        const exports = {}
        const module = { exports }
        const fn = new Function('exports', 'module', code)
        fn(exports, module)
        return module.exports
      }
    },
    
    'fetch': async (path) => {
      const resolvedPath = resolvePath(path)
      const response = await fetch(resolvedPath)
      if (!response.ok) throw new Error(`Failed to fetch: ${resolvedPath}`)
      return await response.text()
    },
    
    'fs': (path) => {
      if (env.runtime !== 'node' || typeof window !== 'undefined' || !env.node.fs) throw new Error('fs only available in Node.js')
      if (typeof require === 'undefined') throw new Error('require not available')
      try {
        const fs = require('fs')
        const resolvedPath = resolvePath(path)
        return fs.readFileSync(resolvedPath, 'utf8')
      } catch (e) {
        throw new Error(`Failed to read file: ${path}`)
      }
    }
  }
  
  const websocketLoad = (path, type, websocket) => new Promise((resolve, reject) => {
    const listener = (event) => {
      try {
        const data = JSON.parse(event.data)
        if (data.type === 'file-response' && data.data.filename === path) {
          websocket.removeEventListener('message', listener)
          const code = data.data.content
          // Create module from code using blob URL
          const blob = new Blob([code], { type: 'application/javascript' })
          const blobURL = URL.createObjectURL(blob)
          import(blobURL).then(m => {
            URL.revokeObjectURL(blobURL)
            resolve(type === 'code' ? m : code)
          }).catch(e => {
            URL.revokeObjectURL(blobURL)
            reject(e)
          })
        }
        if (data.type === 'error' && data.data.filename === path) {
          websocket.removeEventListener('message', listener)
          reject(new Error(data.data.message))
        }
      } catch (e) {}
    }
    
    websocket.addEventListener('message', listener)
    websocket.send(JSON.stringify({ type: 'include', data: { filename: path } }))
    setTimeout(() => {
      websocket.removeEventListener('message', listener)
      reject(new Error('Request timeout'))
    }, 10000)
  })
  
  const include = async (path, options = {}) => {
    const { type = 'code', websocket = null } = options
    const cacheKey = `${path}:${type}`
    
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey)
    }
    
    try {
      let result
      
      if (websocket && env.runtime === 'browser') {
        result = await websocketLoad(path, type, websocket)
      } else if (type === 'code') {
        const loader = loaders[strategy]
        if (!loader) throw new Error(`No loader for strategy: ${strategy}`)
        result = await loader(path)
      } else {
        const loader = loaders[resourceStrategy]
        if (!loader) throw new Error(`No loader for strategy: ${resourceStrategy}`)
        result = await loader(path)
      }
      
      cache.set(cacheKey, result)
      return result
    } catch (e) {
      throw new Error(`Failed to include ${path}: ${e.message}`)
    }
  }
  
  return include
}

const env = detectEnv()
const include = createInclude(env)

export { env, include }
