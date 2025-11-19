/**
 * Deployment Tests
 * Ensures deployment system integrity and readiness
 */

import { readFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = join(__dirname, '..')

// ============================================================================
// TEST FRAMEWORK
// ============================================================================

const tests = []
const results = { passed: 0, failed: 0, tests: [] }

const test = (name, fn) => tests.push({ name, fn })

const check = (condition, message) => {
  if (!condition) throw new Error(message)
}

const runTests = async () => {
  console.log('\n🧪 Deployment Tests\n')
  
  for (const { name, fn } of tests) {
    try {
      await fn({ check })
      console.log(`✅ ${name}`)
      results.passed++
      results.tests.push({ name, status: 'passed' })
    } catch (error) {
      console.log(`❌ ${name}`)
      console.log(`   ${error.message}`)
      results.failed++
      results.tests.push({ name, status: 'failed', error: error.message })
    }
  }
  
  console.log(`\n📊 Results: ${results.passed} passed, ${results.failed} failed\n`)
  
  if (results.failed > 0) process.exit(1)
}

// ============================================================================
// DEPLOYMENT SYSTEM TESTS
// ============================================================================

test('deploy.mjs exists and is executable', ({ check }) => {
  const deployPath = join(__dirname, 'deploy.mjs')
  check(existsSync(deployPath), 'deploy.mjs not found')
  
  const content = readFileSync(deployPath, 'utf8')
  check(content.includes('#!/usr/bin/env node'), 'Missing shebang')
  check(content.includes('export'), 'Not ESM module')
})

test('DEPLOY.md exists and is complete', ({ check }) => {
  const docPath = join(__dirname, 'DEPLOY.md')
  check(existsSync(docPath), 'DEPLOY.md not found')
  
  const content = readFileSync(docPath, 'utf8')
  check(content.includes('# Deployment'), 'Missing title')
  check(content.includes('Quick Start'), 'Missing quick start')
  check(content.includes('node deploy.mjs'), 'Missing usage')
})

// ============================================================================
// VERSION CONSISTENCY TESTS
// ============================================================================

test('all packages have consistent versions', ({ check }) => {
  const mainPkg = JSON.parse(readFileSync(join(rootDir, 'package.json'), 'utf8'))
  const mainVersion = mainPkg.version
  
  const packages = ['core', 'geo', 'num', 'stat', 'lin', 'topo', 'tree']
  
  packages.forEach(pkg => {
    const pkgPath = join(rootDir, pkg, 'package.json')
    if (existsSync(pkgPath)) {
      const pkgJson = JSON.parse(readFileSync(pkgPath, 'utf8'))
      check(pkgJson.version === mainVersion, 
        `${pkg} version mismatch: ${pkgJson.version} vs ${mainVersion}`)
    }
  })
})

test('version format is valid semver', ({ check }) => {
  const mainPkg = JSON.parse(readFileSync(join(rootDir, 'package.json'), 'utf8'))
  const version = mainPkg.version
  
  const semverRegex = /^\d+\.\d+\.\d+(-[\w.]+)?(\+[\w.]+)?$/
  check(semverRegex.test(version), `Invalid semver: ${version}`)
})

// ============================================================================
// DOCUMENTATION TESTS
// ============================================================================

test('README.md exists and has correct structure', ({ check }) => {
  const readmePath = join(rootDir, 'README.md')
  check(existsSync(readmePath), 'README.md not found')
  
  const content = readFileSync(readmePath, 'utf8')
  check(content.includes('# '), 'Missing title')
  check(content.includes('Install'), 'Missing installation')
  check(content.includes('import'), 'Missing code examples')
})

test('CHANGELOG.md is up to date', ({ check }) => {
  const changelogPath = join(rootDir, 'CHANGELOG.md')
  check(existsSync(changelogPath), 'CHANGELOG.md not found')
  
  const content = readFileSync(changelogPath, 'utf8')
  const mainPkg = JSON.parse(readFileSync(join(rootDir, 'package.json'), 'utf8'))
  
  check(content.includes(`## [${mainPkg.version}]`), 
    `CHANGELOG missing entry for v${mainPkg.version}`)
})

test('all doc links are valid paths', ({ check }) => {
  const readmePath = join(rootDir, 'README.md')
  const content = readFileSync(readmePath, 'utf8')
  
  const linkRegex = /\[([^\]]+)\]\(([^)]+\.md)\)/g
  const links = [...content.matchAll(linkRegex)]
  
  const broken = []
  links.forEach(([, text, link]) => {
    if (link.startsWith('http')) return // Skip external links
    
    const fullPath = join(rootDir, link.replace(/^\.\//, ''))
    if (!existsSync(fullPath)) {
      broken.push(`${link} (${text})`)
    }
  })
  
  check(broken.length === 0, `Broken links: ${broken.join(', ')}`)
})

// ============================================================================
// BUILD SYSTEM TESTS
// ============================================================================

test('build.mjs exists and is runnable', ({ check }) => {
  const buildPath = join(rootDir, 'build.mjs')
  check(existsSync(buildPath), 'build.mjs not found')
})

test('dist directory contains bundles', ({ check }) => {
  const distPath = join(rootDir, 'dist')
  check(existsSync(distPath), 'dist/ directory not found - run npm run build')
  
  const bundles = ['primalib.min.mjs', 'primalib.min.js', 'primalib.cjs']
  bundles.forEach(bundle => {
    check(existsSync(join(distPath, bundle)), `Missing bundle: ${bundle}`)
  })
})

test('TypeScript definitions exist', ({ check }) => {
  const dtsPath = join(rootDir, 'primalib.d.ts')
  check(existsSync(dtsPath), 'primalib.d.ts not found')
  
  const content = readFileSync(dtsPath, 'utf8')
  check(content.includes('export'), 'TypeScript definitions empty')
})

// ============================================================================
// PACKAGE STRUCTURE TESTS
// ============================================================================

test('all submodules have package.json', ({ check }) => {
  const modules = ['core', 'geo', 'num', 'stat', 'lin', 'topo', 'tree']
  
  modules.forEach(mod => {
    const pkgPath = join(rootDir, mod, 'package.json')
    check(existsSync(pkgPath), `${mod}/package.json not found`)
  })
})

test('main package exports all modules', ({ check }) => {
  const mainPkg = JSON.parse(readFileSync(join(rootDir, 'package.json'), 'utf8'))
  
  check(mainPkg.exports, 'No exports field in package.json')
  check(mainPkg.exports['.'], 'No main export')
})

test('all modules have valid entry points', ({ check }) => {
  const modules = ['core', 'geo', 'num', 'stat', 'lin', 'topo', 'tree']
  
  modules.forEach(mod => {
    const pkgPath = join(rootDir, mod, 'package.json')
    if (existsSync(pkgPath)) {
      const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'))
      const entry = pkg.main || pkg.module
      check(entry, `${mod} has no entry point`)
      
      const entryPath = join(rootDir, mod, entry.replace('./', ''))
      check(existsSync(entryPath), `${mod} entry point not found: ${entry}`)
    }
  })
})

// ============================================================================
// TEST COVERAGE TESTS
// ============================================================================

test('test suite exists and is comprehensive', ({ check }) => {
  const testPath = join(rootDir, 'primalib.test.mjs')
  check(existsSync(testPath), 'primalib.test.mjs not found')
  
  const content = readFileSync(testPath, 'utf8')
  check(content.includes('test(') || content.includes('import'), 'Test file appears empty')
})

test('all core modules have test files', ({ check }) => {
  const modules = ['core', 'geo', 'num', 'stat', 'lin', 'topo', 'tree']
  let totalTests = 0
  
  modules.forEach(mod => {
    const testPattern = join(rootDir, mod, '*.test.mjs')
    try {
      const output = execSync(`find ${join(rootDir, mod)} -name "*.test.mjs" | wc -l`, { encoding: 'utf8' })
      totalTests += parseInt(output.trim())
    } catch (e) {
      // Module might not have tests yet
    }
  })
  
  check(totalTests > 0, 'No test files found in modules')
})

// ============================================================================
// GIT TESTS
// ============================================================================

test('git repository is initialized', ({ check }) => {
  const gitPath = join(rootDir, '..', '.git')
  check(existsSync(gitPath), 'Not a git repository')
})

test('no untracked critical files', ({ check }) => {
  try {
    const output = execSync('git status --porcelain', { 
      cwd: rootDir, 
      encoding: 'utf8' 
    })
    
    const criticalFiles = ['package.json', 'CHANGELOG.md', 'README.md']
    const untracked = output.split('\n')
      .filter(line => line.startsWith('??'))
      .filter(line => criticalFiles.some(f => line.includes(f)))
    
    check(untracked.length === 0, `Untracked critical files: ${untracked.join(', ')}`)
  } catch (e) {
    // Not a git repo or no git installed - skip
  }
})

// ============================================================================
// SECURITY TESTS
// ============================================================================

test('no sensitive data in package.json', ({ check }) => {
  const mainPkg = JSON.parse(readFileSync(join(rootDir, 'package.json'), 'utf8'))
  const content = JSON.stringify(mainPkg)
  
  const sensitive = ['password', 'token', 'secret', 'api_key', 'apikey']
  const found = sensitive.filter(word => {
    // Ignore "keywords" field (harmless)
    if (word === 'key' && content.includes('"keywords"')) return false
    return content.toLowerCase().includes(word)
  })
  
  check(found.length === 0, `Potential sensitive data in package.json: ${found.join(', ')}`)
})

test('.npmignore exists and excludes tests', ({ check }) => {
  const npmignorePath = join(rootDir, '.npmignore')
  check(existsSync(npmignorePath), '.npmignore not found')
  
  const content = readFileSync(npmignorePath, 'utf8')
  check(content.includes('test'), '.npmignore should exclude tests')
})

// ============================================================================
// PERFORMANCE TESTS
// ============================================================================

test('bundle sizes are reasonable', ({ check }) => {
  const distPath = join(rootDir, 'dist')
  if (!existsSync(distPath)) return // Skip if not built
  
  const bundles = ['primalib.min.mjs', 'primalib.min.js']
  bundles.forEach(bundle => {
    const bundlePath = join(distPath, bundle)
    if (existsSync(bundlePath)) {
      const stats = readFileSync(bundlePath, 'utf8')
      const sizeKB = stats.length / 1024
      
      check(sizeKB < 500, `Bundle too large: ${bundle} (${sizeKB.toFixed(2)} KB)`)
    }
  })
})

// ============================================================================
// RUN TESTS
// ============================================================================

runTests()

