#!/usr/bin/env node
/**
 * Create primaweb bundle for file:// protocol
 * Run from primalib directory: node ../primaweb/create-bundle.mjs
 */

import { build } from 'esbuild'
import { copyFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const projectRoot = join(__dirname, '..')
const primalibRoot = join(projectRoot, 'primalib')
const primawebDir = __dirname

async function createBundles() {
  console.log('Creating PrimaWeb bundles...')
  
  // Copy primalib bundle (if exists)
  const primalibDist = join(primalibRoot, 'dist', 'primalib.min.js')
  const primalibBundle = join(primawebDir, 'primalib-bundle.js')
  
  if (existsSync(primalibDist)) {
    copyFileSync(primalibDist, primalibBundle)
    console.log('✅ Copied: primalib-bundle.js')
  } else {
    console.warn('⚠️  primalib/dist/primalib.min.js not found. Run: cd primalib && npm run build:browser')
  }
  
  // Build primaweb bundle
  const primawebSource = join(primalibRoot, 'primaweb.mjs')
  
  if (!existsSync(primawebSource)) {
    console.error('❌ primalib/primaweb.mjs not found')
    process.exit(1)
  }
  
  try {
    await build({
      entryPoints: [primawebSource],
      bundle: true,
      format: 'iife',
      globalName: 'PrimaWeb',
      platform: 'browser',
      target: ['es2020'],
      outfile: join(primawebDir, 'primaweb-bundle.js'),
      minify: false,
      sourcemap: false,
      banner: {
        js: '// PrimaWeb Bundle - Standalone version for file:// protocol\n// Works with regular <script> tags (no ES modules required)\n'
      },
      external: [] // Bundle everything
    })
    
    console.log('✅ Created: primaweb-bundle.js')
    console.log('📦 Bundles ready for file:// protocol!')
  } catch (error) {
    console.error('❌ PrimaWeb bundle creation failed:', error.message)
    process.exit(1)
  }
}

createBundles()
