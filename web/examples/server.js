/**
 * PrimaWeb Server - Simple Pipeline
 * API: say(), on(), send()
 * Auto-builds bundle and creates .primaweb.env
 */

import { createServer } from 'http'
import { readFileSync, existsSync, writeFileSync, statSync } from 'fs'
import { join, normalize } from 'path'
import { fileURLToPath } from 'url'
import { spawn } from 'child_process'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const projectRoot = join(__dirname, '..')

// Import ws from primalib node_modules
const wsPath = join(projectRoot, 'primalib', 'node_modules', 'ws', 'wrapper.mjs')
const { WebSocketServer } = await import(wsPath)

// Import primaweb
const { server, on, send } = await import('../../primalib/primaweb.mjs')

// Build bundle and create .primaweb.env
const buildBundle = async () => {
  return new Promise((resolve, reject) => {
    const buildScript = join(projectRoot, 'primalib', 'build-primaweb.mjs')
    const proc = spawn('node', [buildScript], { cwd: projectRoot, stdio: 'inherit' })
    proc.on('close', (code) => {
      if (code === 0) {
        const bundlePath = join(__dirname, 'dist', 'primaweb.js')
        const bundleStat = existsSync(bundlePath) ? statSync(bundlePath) : null
        const envData = {
          bundlePath,
          bundleSize: bundleStat?.size || 0,
          bundleModified: bundleStat?.mtimeMs || 0,
          builtAt: new Date().toISOString()
        }
        const envPath = join(__dirname, '.primaweb.env')
        writeFileSync(envPath, JSON.stringify(envData, null, 2))
        console.log('✅ Bundle built and .primaweb.env created')
        resolve()
      } else {
        reject(new Error(`Build failed with code ${code}`))
      }
    })
    proc.on('error', (err) => {
      reject(err)
    })
  })
}

// Check if bundle needs rebuild
const needsRebuild = () => {
  const bundlePath = join(__dirname, 'dist', 'primaweb.js')
  const envPath = join(__dirname, '.primaweb.env')
  
  if (!existsSync(bundlePath)) {
    console.log('📦 Bundle not found, will build...')
    return true
  }
  if (!existsSync(envPath)) {
    console.log('📦 .primaweb.env not found, will build...')
    return true
  }
  
  try {
    const envData = JSON.parse(readFileSync(envPath, 'utf-8'))
    const bundleStat = statSync(bundlePath)
    const needsBuild = bundleStat.mtimeMs > envData.bundleModified
    if (needsBuild) {
      console.log('📦 Bundle modified, will rebuild...')
    }
    return needsBuild
  } catch {
    console.log('📦 Error reading .primaweb.env, will rebuild...')
    return true
  }
}

let wss = null
let httpServer = null
const activeConnections = new Set()

const createWebSocketServer = (httpServer) => {
  wss = new WebSocketServer({ server: httpServer })
  
  wss.on('connection', (ws, req) => {
    activeConnections.add(ws)
    
    const pipe = server(ws)
    
    // Send server time every second to client
    const tickInterval = setInterval(() => {
      if (ws.readyState === 1) {
        pipe.send('server-time', () => ({ timestamp: Date.now() }))
      }
    }, 1000)
    
    // Handle messages from client
    ws.on('message', async (message) => {
      try {
        const data = JSON.parse(typeof message === 'string' ? message : message.toString())
        
        // Handle mouse move: display in console (single line update)
        if (data.type === 'mousemove') {
          const { x, y } = data.data || {}
          process.stdout.write(`\r[CLIENT] Mouse Position: (${x}, ${y})`)
        }
        
        // Handle time request
        if (data.type === 'time') {
          pipe.send('server-time', () => ({ timestamp: Date.now(), iso: new Date().toISOString() }))
        }
        
        // Handle include request
        if (data.type === 'include') {
          const { filename } = data.data || data
          try {
            let filePath = filename.startsWith('../') ? 
              join(projectRoot, filename.replace(/^\.\.\//g, '')) :
              filename.startsWith('./') ?
              join(projectRoot, filename.replace(/^\.\//, '')) :
              join(projectRoot, filename)
            
            filePath = normalize(filePath)
            
            if (!filePath.startsWith(projectRoot)) {
              throw new Error('Access denied: path outside project root')
            }
            
            if (!existsSync(filePath)) {
              throw new Error(`File not found: ${filename}`)
            }
            
            const fileContent = readFileSync(filePath, 'utf-8')
            
            pipe.send('file-response', () => ({
              filename,
              content: fileContent,
              type: 'file',
              size: fileContent.length
            }))
          } catch (e) {
            pipe.send('error', () => ({ filename, message: e.message }))
          }
        }
      } catch (e) {
        console.warn('Failed to parse message:', e)
      }
    })
    
    ws.on('close', () => {
      console.log('[SERVER] 🔌 Client disconnected')
      clearInterval(tickInterval)
      activeConnections.delete(ws)
    })
    
    ws.on('error', (err) => {
      console.error('[SERVER] ❌ WebSocket error:', err)
      clearInterval(tickInterval)
      activeConnections.delete(ws)
    })
  })
  
  return wss
}

const serveFile = (req, res, projectRoot) => {
  // Handle favicon
  if (req.url === '/favicon.ico') {
    res.writeHead(204, { 'Content-Type': 'image/x-icon' })
    res.end()
    return
  }
  
  let url = req.url === '/' ? '/demo.html' : req.url
  url = url.split('?')[0]
  
  const primawebPath = join(projectRoot, 'primaweb', url.replace(/^\//, ''))
  const rootPath = join(projectRoot, url.replace(/^\//, ''))
  const filePath = existsSync(primawebPath) ? primawebPath : existsSync(rootPath) ? rootPath : primawebPath
  
  if (!existsSync(filePath)) {
    res.writeHead(404, { 'Content-Type': 'text/plain' })
    res.end(`404 Not Found: ${url}`)
    return
  }
  
  const content = readFileSync(filePath, 'utf-8')
  const ext = url.substring(url.lastIndexOf('.'))
  const types = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.mjs': 'application/javascript',
    '.json': 'application/json'
  }
  
  res.writeHead(200, { 
    'Content-Type': types[ext] || 'text/plain',
    'Access-Control-Allow-Origin': '*'
  })
  res.end(content)
}

// Graceful shutdown
const shutdown = async (signal) => {
  console.log(`\n${signal} received, shutting down gracefully...`)
  
  // Close WebSocket server
  if (wss) {
    activeConnections.forEach(ws => {
      if (ws.readyState === 1) {
        ws.close()
      }
    })
    activeConnections.clear()
    wss.close()
  }
  
  // Close HTTP server
  if (httpServer) {
    httpServer.close(() => {
      console.log('HTTP server closed')
      process.exit(0)
    })
    
    // Force close after 2 seconds
    setTimeout(() => {
      console.log('Forcing shutdown...')
      process.exit(0)
    }, 2000)
  } else {
    process.exit(0)
  }
}

const startServer = async (port = 8080) => {
  // Check and build bundle on startup
  if (needsRebuild()) {
    console.log('🔨 Building bundle...')
    try {
      await buildBundle()
    } catch (err) {
      console.error('❌ Failed to build bundle:', err.message)
      process.exit(1)
    }
  } else {
    console.log('✅ Bundle up to date')
  }
  
  httpServer = createServer((req, res) => {
    serveFile(req, res, projectRoot)
  })
  
  createWebSocketServer(httpServer)
  
  // Handle graceful shutdown
  process.on('SIGINT', () => shutdown('SIGINT'))
  process.on('SIGTERM', () => shutdown('SIGTERM'))
  
  httpServer.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`❌ Port ${port} is already in use`)
      console.error('   Try: kill -9 $(lsof -t -i:8080)')
      process.exit(1)
    }
    throw err
  })
  
  httpServer.listen(port, () => {
    console.log(`🚀 PrimaWeb Server`)
    console.log(`Running on http://localhost:${port}`)
    console.log(`Serving from: ${projectRoot}`)
    console.log(`Open: http://localhost:${port}/hello.html`)
    console.log(`Open: http://localhost:${port}/tests.html`)
    console.log(`Open: http://localhost:${port}/demo.html`)
    console.log(`Open: http://localhost:${port}/3d-viewer.html`)
    console.log(`\nPress Ctrl+C to stop`)
  })
  
  return httpServer
}

startServer(8080).catch(err => {
  console.error('Failed to start server:', err)
  process.exit(1)
})
