/**
 * Build script for PrimaLib
 * Creates minified browser bundle and prepares for npm publishing
 */

import { build } from 'esbuild'
import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const pkg = JSON.parse(readFileSync(join(__dirname, 'package.json'), 'utf-8'))

// Build configuration
const buildConfig = {
  entryPoints: ['primalib.mjs'],
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: ['es2020'],
  outfile: 'dist/primalib.min.mjs',
  minify: true,
  sourcemap: true,
  banner: {
    js: `/* PrimaLib v${pkg.version} - https://github.com/primalibjs/primalib */`
  },
  define: {
    'process.env.NODE_ENV': '"production"'
  },
  external: [] // Bundle everything for browser
}

// Build for browser (ESM)
async function buildBrowser() {
  console.log('Building browser bundle...')
  try {
    await build({
      ...buildConfig,
      outfile: 'dist/primalib.min.mjs',
      format: 'esm'
    })
    console.log('✅ Browser ESM bundle created: dist/primalib.min.mjs')
  } catch (error) {
    console.error('❌ Browser build failed:', error)
    process.exit(1)
  }
}

// Build for browser (IIFE - global variable)
async function buildBrowserIIFE() {
  console.log('Building browser IIFE bundle...')
  try {
    await build({
      ...buildConfig,
      outfile: 'dist/primalib.min.js',
      format: 'iife',
      globalName: 'PrimaLib'
    })
    console.log('✅ Browser IIFE bundle created: dist/primalib.min.js')
  } catch (error) {
    console.error('❌ Browser IIFE build failed:', error)
    process.exit(1)
  }
}

// Build for Node.js (CJS)
async function buildNodeCJS() {
  console.log('Building Node.js CJS bundle...')
  try {
    await build({
      ...buildConfig,
      entryPoints: ['primalib.mjs'],
      outfile: 'dist/primalib.cjs',
      format: 'cjs',
      platform: 'node',
      external: [] // Bundle for standalone use
    })
    console.log('✅ Node.js CJS bundle created: dist/primalib.cjs')
  } catch (error) {
    console.error('❌ Node.js CJS build failed:', error)
    process.exit(1)
  }
}

// Create package.json for dist
function createDistPackage() {
  const distPkg = {
    name: pkg.name,
    version: pkg.version,
    description: pkg.description,
    main: './primalib.mjs',
    module: './primalib.min.mjs',
    browser: './primalib.min.js',
    types: './primalib.d.ts',
    exports: {
      '.': {
        import: './primalib.min.mjs',
        require: './primalib.cjs',
        browser: './primalib.min.js',
        default: './primalib.mjs'
      }
    },
    files: [
      'primalib.mjs',
      'primalib.min.mjs',
      'primalib.min.js',
      'primalib.cjs',
      'primalib.d.ts',
      '*.mjs',
      '*.js',
      '*.d.ts'
    ],
    keywords: pkg.keywords,
    author: pkg.author,
    license: pkg.license,
    repository: pkg.repository,
    homepage: pkg.homepage,
    bugs: pkg.bugs
  }
  
  writeFileSync(
    join(__dirname, 'dist', 'package.json'),
    JSON.stringify(distPkg, null, 2)
  )
  console.log('✅ dist/package.json created')
}

// Copy TypeScript definitions
function copyTypes() {
  const types = readFileSync(join(__dirname, 'primalib.d.ts'), 'utf-8')
  writeFileSync(join(__dirname, 'dist', 'primalib.d.ts'), types)
  console.log('✅ TypeScript definitions copied')
}

// Build PrimaWeb bundle
async function buildPrimaWeb() {
  console.log('Building PrimaWeb bundle...')
  const { spawn } = await import('child_process')
  return new Promise((resolve, reject) => {
    const proc = spawn('node', ['web/build-primaweb.mjs'], { 
      cwd: __dirname, 
      stdio: 'inherit' 
    })
    proc.on('close', (code) => {
      if (code === 0) {
        console.log('✅ PrimaWeb bundle created')
        resolve()
      } else {
        reject(new Error(`PrimaWeb build failed with code ${code}`))
      }
    })
  })
}

// Main build function
async function main() {
  const args = process.argv.slice(2)
  const target = args[0] || 'all'
  
  // Create dist directory
  mkdirSync(join(__dirname, 'dist'), { recursive: true })
  
  if (target === 'all' || target === 'browser') {
    await buildBrowser()
    await buildBrowserIIFE()
  }
  
  if (target === 'all' || target === 'node') {
    await buildNodeCJS()
  }
  
  if (target === 'all' || target === 'primaweb') {
    await buildPrimaWeb()
  }
  
  if (target === 'all') {
    createDistPackage()
    copyTypes()
    console.log('\n✅ Build complete!')
    console.log('📦 Bundles available:')
    console.log('   - dist/primalib.min.mjs (ESM)')
    console.log('   - dist/primalib.min.js (IIFE)')
    console.log('   - dist/primalib.cjs (CommonJS)')
    console.log('   - primaweb/dist/primaweb.js (PrimaWeb bundle)')
    console.log('📦 Ready for npm publish from dist/ directory')
  }
}

main().catch(console.error)

