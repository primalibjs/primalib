#!/usr/bin/env node
/**
 * PrimaLib Deployment System
 * Automated deployment with comprehensive checks and reporting
 */

import { readFileSync, writeFileSync, statSync, readdirSync, existsSync } from 'fs'
import { execSync } from 'child_process'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = join(__dirname, '..')

// ============================================================================
// UTILITIES
// ============================================================================

const exec = (cmd, opts = {}) => {
  try {
    return execSync(cmd, { 
      cwd: rootDir, 
      encoding: 'utf8',
      stdio: opts.silent ? 'pipe' : 'inherit',
      ...opts 
    })
  } catch (err) {
    if (opts.ignoreError) return null
    throw new Error(`Command failed: ${cmd}\n${err.message}`)
  }
}

const log = (msg, level = 'info') => {
  const icons = { info: 'ℹ️', success: '✅', error: '❌', warn: '⚠️', step: '📍' }
  console.log(`${icons[level] || '•'} ${msg}`)
}

const getFileSize = (path) => {
  try {
    const stats = statSync(path)
    const kb = (stats.size / 1024).toFixed(2)
    return `${kb} KB`
  } catch {
    return 'N/A'
  }
}

const getAllPackages = () => {
  const packages = ['core', 'geo', 'num', 'stat', 'lin', 'topo', 'tree', 'web']
  return packages
    .map(pkg => join(rootDir, pkg, 'package.json'))
    .filter(existsSync)
    .map(path => JSON.parse(readFileSync(path, 'utf8')))
}

// ============================================================================
// CHECKS
// ============================================================================

const checkVersionConsistency = () => {
  log('Checking version consistency...', 'step')
  
  const mainPkg = JSON.parse(readFileSync(join(rootDir, 'package.json'), 'utf8'))
  const mainVersion = mainPkg.version
  const packages = getAllPackages()
  
  const inconsistent = packages.filter(pkg => pkg.version !== mainVersion)
  
  if (inconsistent.length > 0) {
    log(`Version mismatch found:`, 'error')
    inconsistent.forEach(pkg => log(`  ${pkg.name}: ${pkg.version} (expected ${mainVersion})`))
    throw new Error('Version consistency check failed')
  }
  
  log(`All packages at v${mainVersion}`, 'success')
  return mainVersion
}

const runTests = () => {
  log('Running test suite...', 'step')
  const output = exec('npm test', { silent: true })
  const match = output.match(/(\d+) passed, (\d+) failed/)
  
  if (!match) throw new Error('Could not parse test results')
  
  const [, passed, failed] = match
  if (parseInt(failed) > 0) {
    throw new Error(`Tests failed: ${passed} passed, ${failed} failed`)
  }
  
  log(`Tests passed: ${passed}/${passed}`, 'success')
  return { passed: parseInt(passed), failed: parseInt(failed) }
}

const runBuild = () => {
  log('Building bundles...', 'step')
  exec('npm run build', { silent: true })
  log('Build complete', 'success')
}

const checkGitStatus = () => {
  log('Checking git status...', 'step')
  const status = exec('git status --porcelain', { silent: true })
  
  if (status && status.trim()) {
    log('Uncommitted changes found:', 'warn')
    log(status)
    return { clean: false, changes: status.split('\n').length }
  }
  
  log('Working directory clean', 'success')
  return { clean: true, changes: 0 }
}

const checkNpmAuth = () => {
  log('Checking npm authentication...', 'step')
  try {
    exec('npm whoami', { silent: true })
    log('npm authenticated', 'success')
    return true
  } catch {
    log('npm not authenticated', 'warn')
    return false
  }
}

// ============================================================================
// REPORTING
// ============================================================================

const generateBundleReport = () => {
  const distDir = join(rootDir, 'dist')
  if (!existsSync(distDir)) return null
  
  const files = readdirSync(distDir).filter(f => f.endsWith('.js') || f.endsWith('.mjs') || f.endsWith('.cjs'))
  
  return files.map(file => ({
    name: file,
    size: getFileSize(join(distDir, file)),
    path: `dist/${file}`
  }))
}

const generateComponentReport = () => {
  const packages = getAllPackages()
  const modules = ['core', 'geo', 'num', 'stat', 'lin', 'topo', 'tree', 'web']
  
  return packages.map(pkg => {
    // Extract module name from @primalib/module
    const moduleName = pkg.name.replace('@primalib/', '')
    const modulePath = join(rootDir, moduleName)
    
    // Calculate total module size
    let totalSize = 0
    try {
      const output = exec(`du -sb ${modulePath} 2>/dev/null | cut -f1`, { silent: true, ignoreError: true })
      totalSize = parseInt(output?.trim() || '0')
    } catch {
      totalSize = 0
    }
    
    const sizeKB = (totalSize / 1024).toFixed(2)
    
    return {
      name: pkg.name,
      version: pkg.version,
      path: moduleName + '/',
      size: totalSize > 0 ? `${sizeKB} KB` : 'N/A'
    }
  })
}

const countLines = (pattern) => {
  try {
    const output = exec(`find ${rootDir} ${pattern} -exec wc -l {} \\; 2>/dev/null | awk '{sum+=$1} END {print sum}'`, { silent: true })
    return parseInt(output.trim()) || 0
  } catch {
    return 0
  }
}

const countFiles = (pattern) => {
  try {
    const output = exec(`find ${rootDir} ${pattern} 2>/dev/null | wc -l`, { silent: true })
    return parseInt(output.trim()) || 0
  } catch {
    return 0
  }
}

const getDirectorySize = (path) => {
  try {
    const output = exec(`du -sb ${path} 2>/dev/null | cut -f1`, { silent: true })
    return parseInt(output.trim()) || 0
  } catch {
    return 0
  }
}

const generateStatistics = () => {
  // Code statistics (exclude tests, exclude node_modules)
  const codeLines = countLines(`-name "*.mjs" ! -name "*.test.mjs" ! -path "*/node_modules/*"`)
  const codeFiles = countFiles(`-name "*.mjs" ! -name "*.test.mjs" ! -path "*/node_modules/*"`)
  
  // Test statistics
  const testLines = countLines(`-name "*.test.mjs" ! -path "*/node_modules/*"`)
  const testFiles = countFiles(`-name "*.test.mjs" ! -path "*/node_modules/*"`)
  
  // Documentation statistics
  const docLines = countLines(`-name "*.md" ! -path "*/node_modules/*"`)
  const docFiles = countFiles(`-name "*.md" ! -path "*/node_modules/*"`)
  
  // Bundle statistics
  const distPath = join(rootDir, 'dist')
  const bundleSize = getDirectorySize(distPath)
  const bundleFiles = countFiles(`-path "${distPath}/*" -type f`)
  
  const stats = {
    code: {
      files: codeFiles,
      lines: codeLines,
      size: `${(getDirectorySize(rootDir) / 1024).toFixed(0)} KB`
    },
    tests: {
      files: testFiles,
      lines: testLines
    },
    documentation: {
      files: docFiles,
      lines: docLines
    },
    bundles: {
      files: bundleFiles,
      size: `${(bundleSize / 1024).toFixed(2)} KB`
    },
    modules: getAllPackages().length,
    totalLines: codeLines + testLines + docLines
  }
  
  return stats
}

const generateDeploymentReport = (checks, version) => {
  const timestamp = new Date().toISOString()
  const bundles = generateBundleReport()
  const components = generateComponentReport()
  const stats = generateStatistics()
  
  const report = {
    version,
    timestamp,
    checks: {
      versionConsistency: checks.versionConsistency.success,
      tests: checks.tests,
      build: checks.build.success,
      git: checks.git,
      npmAuth: checks.npmAuth
    },
    bundles,
    components,
    statistics: stats,
    ready: Object.values(checks).every(c => c.success !== false)
  }
  
  return report
}

const formatReport = (report) => {
  const lines = [
    '# PrimaLib Deployment Report',
    '',
    `**Version:** ${report.version}`,
    `**Date:** ${new Date(report.timestamp).toLocaleString()}`,
    `**Status:** ${report.ready ? '✅ READY' : '❌ NOT READY'}`,
    '',
    '## Pre-Deployment Checks',
    '',
    `- Version Consistency: ${report.checks.versionConsistency ? '✅' : '❌'}`,
    `- Tests: ✅ ${report.checks.tests.passed} passed, ${report.checks.tests.failed} failed`,
    `- Build: ${report.checks.build ? '✅' : '❌'}`,
    `- Git Status: ${report.checks.git.clean ? '✅ Clean' : '⚠️  ' + report.checks.git.changes + ' changes'}`,
    `- npm Auth: ${report.checks.npmAuth ? '✅' : '⚠️  Not authenticated'}`,
    '',
    '## Bundle Sizes',
    ''
  ]
  
  if (report.bundles) {
    report.bundles.forEach(bundle => {
      lines.push(`- **${bundle.name}**: ${bundle.size}`)
    })
  } else {
    lines.push('No bundles found')
  }
  
  lines.push('', '## Components', '')
  report.components.forEach(comp => {
    const experimental = comp.name.includes('web') ? ' ⚠️  *experimental*' : ''
    lines.push(`- **${comp.name}** (${comp.version}): ${comp.size}${experimental}`)
  })
  
  lines.push('', '## Statistics', '')
  lines.push('')
  lines.push('### Code')
  lines.push(`- Files: ${report.statistics.code.files}`)
  lines.push(`- Lines: ${report.statistics.code.lines.toLocaleString()}`)
  lines.push('')
  lines.push('### Tests')
  lines.push(`- Files: ${report.statistics.tests.files}`)
  lines.push(`- Lines: ${report.statistics.tests.lines.toLocaleString()}`)
  lines.push('')
  lines.push('### Documentation')
  lines.push(`- Files: ${report.statistics.documentation.files}`)
  lines.push(`- Lines: ${report.statistics.documentation.lines.toLocaleString()}`)
  lines.push('')
  lines.push('### Bundles')
  lines.push(`- Files: ${report.statistics.bundles.files}`)
  lines.push(`- Size: ${report.statistics.bundles.size}`)
  lines.push('')
  lines.push('### Totals')
  lines.push(`- Modules: ${report.statistics.modules}`)
  lines.push(`- Total Lines: ${report.statistics.totalLines.toLocaleString()}`)
  
  return lines.join('\n')
}

// ============================================================================
// MAIN DEPLOYMENT
// ============================================================================

const deploy = async (options = {}) => {
  const { dryRun = false, skipTests = false, skipBuild = false } = options
  
  console.log('\n🚀 PrimaLib Deployment System\n')
  
  const checks = {
    versionConsistency: { success: false },
    tests: { passed: 0, failed: 0, success: false },
    build: { success: false },
    git: { clean: false, changes: 0 },
    npmAuth: false
  }
  
  try {
    // Version check
    const version = checkVersionConsistency()
    checks.versionConsistency.success = true
    
    // Git status
    checks.git = checkGitStatus()
    
    // npm auth
    checks.npmAuth = checkNpmAuth()
    
    // Tests
    if (!skipTests) {
      checks.tests = runTests()
      checks.tests.success = checks.tests.failed === 0
    } else {
      log('Skipping tests', 'warn')
      checks.tests.success = true
    }
    
    // Build
    if (!skipBuild) {
      runBuild()
      checks.build.success = true
    } else {
      log('Skipping build', 'warn')
      checks.build.success = true
    }
    
    // Generate report
    log('Generating deployment report...', 'step')
    const report = generateDeploymentReport(checks, version)
    const reportPath = join(rootDir, 'deploy', `deployment-report-${version}.md`)
    writeFileSync(reportPath, formatReport(report))
    log(`Report saved: deploy/deployment-report-${version}.md`, 'success')
    
    // Write JSON report
    const jsonPath = join(rootDir, 'deploy', `deployment-report-${version}.json`)
    writeFileSync(jsonPath, JSON.stringify(report, null, 2))
    
    // Summary
    console.log('\n📊 Deployment Summary\n')
    console.log(formatReport(report))
    
    if (!report.ready) {
      throw new Error('Pre-deployment checks failed')
    }
    
    // Deploy
    if (dryRun) {
      log('\n🔍 Dry run complete - no deployment executed', 'info')
    } else {
      log('\n📦 Ready for deployment!', 'success')
      log('\nNext steps:', 'info')
      log('  1. Review deployment-report-' + version + '.md')
      log('  2. Run: npm publish --dry-run')
      log('  3. Run: npm publish')
      log('  4. git tag primalib-v' + version)
      log('  5. git push --tags')
    }
    
    return report
    
  } catch (error) {
    log(`\nDeployment failed: ${error.message}`, 'error')
    
    // Provide actionable guidance
    log('\n📋 Troubleshooting Guide:', 'info')
    
    if (error.message.includes('version') || error.message.includes('Version')) {
      log('\nVersion Mismatch Issue:', 'warn')
      log('  1. Check all package.json files have matching versions')
      log('  2. Update: cd <module> && npm version 0.2.0 --no-git-tag-version')
      log('  3. Or run: ./scripts/sync-versions.sh 0.2.0')
    }
    
    if (error.message.includes('test') || error.message.includes('Test')) {
      log('\nTest Failure Issue:', 'warn')
      log('  1. Run: npm test')
      log('  2. Fix failing tests in the output')
      log('  3. Verify: npm test (all should pass)')
    }
    
    if (error.message.includes('build') || error.message.includes('Build')) {
      log('\nBuild Failure Issue:', 'warn')
      log('  1. Check build.mjs for errors')
      log('  2. Ensure all dependencies installed: npm install')
      log('  3. Try: npm run build')
    }
    
    if (!checks.git?.clean) {
      log('\nUncommitted Changes:', 'warn')
      log('  1. Review: git status')
      log('  2. Commit: git add . && git commit -m "your message"')
      log('  3. Or stash: git stash')
      log('  4. Or run deployment anyway (warnings only)')
    }
    
    if (!checks.npmAuth) {
      log('\nnpm Authentication:', 'warn')
      log('  1. Login: npm login')
      log('  2. Verify: npm whoami')
      log('  3. Or continue (warning only, not required for dry-run)')
    }
    
    log('\n💡 Quick Fixes:', 'info')
    log('  - Skip tests: node deploy.mjs --skip-tests')
    log('  - Skip build: node deploy.mjs --skip-build')
    log('  - Dry run: node deploy.mjs --dry-run')
    log('\n📖 Full guide: cat deploy/DEPLOY.md')
    
    process.exit(1)
  }
}

// ============================================================================
// CLI
// ============================================================================

const parseArgs = () => {
  const args = process.argv.slice(2)
  const options = {
    dryRun: args.includes('--dry-run'),
    skipTests: args.includes('--skip-tests'),
    skipBuild: args.includes('--skip-build'),
    help: args.includes('--help') || args.includes('-h')
  }
  return options
}

const showHelp = () => {
  console.log(`
PrimaLib Deployment System

Usage:
  node deploy.mjs [options]

Options:
  --dry-run      Run checks without deploying
  --skip-tests   Skip test suite
  --skip-build   Skip build step
  --help, -h     Show this help

Examples:
  node deploy.mjs --dry-run
  node deploy.mjs
`)
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const options = parseArgs()
  
  if (options.help) {
    showHelp()
    process.exit(0)
  }
  
  deploy(options)
}

export { deploy, generateDeploymentReport, formatReport }

