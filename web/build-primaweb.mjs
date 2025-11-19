/**
 * Build PrimaWeb bundle - includes primaset + primalib
 * Creates single primaweb.js with everything
 */

import { build } from 'esbuild'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = join(__dirname, '..')
const primawebDir = join(projectRoot, 'primaweb')

async function buildPrimaWeb() {
  console.log('Building PrimaWeb bundle (includes primaset + primalib)...')
  
  try {
    await build({
      entryPoints: [join(__dirname, 'primaweb.mjs')],
      bundle: true,
      format: 'iife',
      globalName: 'PrimaWeb',
      platform: 'browser',
      target: ['es2020'],
      outfile: join(primawebDir, 'dist', 'primaweb.js'),
      minify: false,
      sourcemap: false,
      banner: {
        js: `// PrimaWeb Bundle - Universal Web Pipeline
// Includes: primaset + primalib
// API: PrimaWeb('#content') or PrimaWeb.say()
`
      },
      external: ['fs', 'http', 'path', 'url'],
      define: {
        'import.meta': 'undefined'
      }
    })
    
    // Post-process: fix IIFE return to export PrimaWeb directly
    const bundlePath = join(primawebDir, 'dist', 'primaweb.js')
    let bundleContent = readFileSync(bundlePath, 'utf-8')
    
    // Replace CommonJS wrapper with direct PrimaWeb assignment
    bundleContent = bundleContent.replace(
      /return __toCommonJS\(primaweb_exports\);/g,
      'return PrimaWeb;'
    )
    
    // Ensure window assignment exists
    if (!bundleContent.includes('window.PrimaWeb = PrimaWeb')) {
      bundleContent += '\n\nif (typeof window !== "undefined") {\n  window.PrimaWeb = PrimaWeb;\n}\n'
    }
    
    writeFileSync(bundlePath, bundleContent, 'utf-8')
    
    console.log('✅ Created: primaweb.js (includes primaset + primalib)')
    console.log('📦 Single bundle ready! Use: <script src="primaweb.js"></script>')
  } catch (error) {
    console.error('❌ Build failed:', error.message)
    process.exit(1)
  }
}

buildPrimaWeb()
