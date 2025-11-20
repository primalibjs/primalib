#!/usr/bin/env node
/**
 * PrimaLib Deployment System
 * Automated deployment with comprehensive checks and reporting
 */

import { readFileSync, writeFileSync, statSync, readdirSync, existsSync } from 'fs'
import { execSync } from 'child_process'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { createInterface } from 'readline'

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
// VERSION MANAGEMENT
// ============================================================================

const incrementVersion = (version, type = 'patch') => {
  const [major, minor, patch] = version.split('.').map(Number)
  
  switch (type) {
    case 'major':
      return `${major + 1}.0.0`
    case 'minor':
      return `${major}.${minor + 1}.0`
    case 'patch':
    default:
      return `${major}.${minor}.${patch + 1}`
  }
}

const updateAllPackageVersions = (newVersion) => {
  log(`Updating all packages to v${newVersion}...`, 'step')
  
  const packages = ['package.json', ...getAllPackages().map(pkg => {
    const moduleName = pkg.name.replace('@primalib/', '')
    return `${moduleName}/package.json`
  })]
  
  packages.forEach(pkgPath => {
    const fullPath = join(rootDir, pkgPath)
    if (existsSync(fullPath)) {
      const pkg = JSON.parse(readFileSync(fullPath, 'utf8'))
      pkg.version = newVersion
      writeFileSync(fullPath, JSON.stringify(pkg, null, 2) + '\n')
      log(`  ✓ ${pkgPath}`, 'success')
    }
  })
  
  // Also update dist/package.json if it exists
  const distPkgPath = join(rootDir, 'dist', 'package.json')
  if (existsSync(distPkgPath)) {
    const pkg = JSON.parse(readFileSync(distPkgPath, 'utf8'))
    pkg.version = newVersion
    writeFileSync(distPkgPath, JSON.stringify(pkg, null, 2) + '\n')
    log(`  ✓ dist/package.json`, 'success')
  }
  
  log(`All packages updated to v${newVersion}`, 'success')
}

const updateChangelog = (newVersion, oldVersion) => {
  log(`Updating CHANGELOG.md...`, 'step')
  
  const changelogPath = join(rootDir, 'CHANGELOG.md')
  if (!existsSync(changelogPath)) {
    log('CHANGELOG.md not found, skipping', 'warn')
    return
  }
  
  const changelog = readFileSync(changelogPath, 'utf8')
  const today = new Date().toISOString().split('T')[0]
  
  // Find the first ## [version] entry
  const versionEntryMatch = changelog.match(/^## \[(\d+\.\d+\.\d+)\]/m)
  if (!versionEntryMatch) {
    log('Could not find version entry in CHANGELOG.md, skipping', 'warn')
    return
  }
  
  // Insert new version entry after the header
  const headerEnd = changelog.indexOf('\n\n', changelog.indexOf('# Changelog'))
  const newEntry = `## [${newVersion}] - ${today}

### Added
- 

### Changed
- 

### Fixed
- 

`
  
  const updatedChangelog = changelog.slice(0, headerEnd + 2) + newEntry + changelog.slice(headerEnd + 2)
  writeFileSync(changelogPath, updatedChangelog)
  log(`CHANGELOG.md updated with v${newVersion} entry`, 'success')
}

const promptVersionIncrement = (currentVersion, suggestedType = 'patch') => {
  return new Promise((resolve) => {
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout
    })
    
    const suggestedNum = suggestedType === 'major' ? '3' : suggestedType === 'minor' ? '2' : '1'
    const suggestedNewVersion = incrementVersion(currentVersion, suggestedType)
    
    console.log('\n📦 Version Increment')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`Current version: v${currentVersion}`)
    console.log('')
    console.log('Select version increment type:')
    console.log(`  1. patch → v${incrementVersion(currentVersion, 'patch')} - bug fixes, small changes`)
    console.log(`  2. minor → v${incrementVersion(currentVersion, 'minor')} - new features, backward compatible`)
    console.log(`  3. major → v${incrementVersion(currentVersion, 'major')} - breaking changes`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`Suggested: ${suggestedNum} (${suggestedType}) → v${suggestedNewVersion}`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
    
    rl.question(`Enter choice [1-3] (default: ${suggestedNum}): `, (answer) => {
      rl.close()
      const choice = answer.trim() || suggestedNum
      const types = { '1': 'patch', '2': 'minor', '3': 'major' }
      const type = types[choice] || suggestedType
      resolve(type)
    })
  })
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
    const changes = status.trim().split('\n').filter(line => line.trim())
    log(`Uncommitted changes found: ${changes.length} file(s)`, 'warn')
    return { clean: false, changes: changes.length, files: changes }
  }
  
  log('Working directory clean', 'success')
  return { clean: true, changes: 0, files: [] }
}

const commitAndPushChanges = async (version) => {
  log('Committing and syncing repository...', 'step')
  
  const status = checkGitStatus()
  if (status.clean) {
    log('No changes to commit', 'info')
    return
  }
  
  console.log('\n📝 Uncommitted changes:')
  status.files.forEach(file => {
    const trimmed = file.trim()
    if (!trimmed) return
    const parts = trimmed.split(/\s+/)
    const fileStatus = parts[0]
    const filePath = parts.slice(1).join(' ')
    const icon = fileStatus === 'M' ? '✏️' : fileStatus === 'A' ? '➕' : fileStatus === 'D' ? '➖' : fileStatus.startsWith('??') ? '🆕' : '❓'
    console.log(`   ${icon} ${fileStatus} ${filePath}`)
  })
  console.log('')
  
  // Stage all changes
  log('Staging all changes...', 'step')
  exec('git add -A')
  
  // Create commit message
  const commitMessage = `primalib: release v${version}`
  log(`Committing changes: ${commitMessage}`, 'step')
  exec(`git commit -m "${commitMessage}"`)
  log('✓ Changes committed', 'success')
  
  // Push to remote
  log('Pushing to remote repository...', 'step')
  try {
    exec('git push')
    log('✓ Changes pushed to remote', 'success')
    
    // Also push tags if any
    try {
      const tags = exec('git tag --list', { silent: true })
      if (tags && tags.trim()) {
        exec('git push --tags', { ignoreError: true })
        log('✓ Tags pushed to remote', 'success')
      }
    } catch {
      // Ignore if no tags to push
    }
  } catch (err) {
    log(`Warning: Could not push to remote: ${err.message}`, 'warn')
    log('You can push manually: git push && git push --tags', 'info')
  }
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
  const { dryRun = false, skipTests = false, skipBuild = false, versionIncrement, noVersionBump = false } = options
  
  console.log('\n🚀 PrimaLib Deployment System\n')
  
  const checks = {
    versionConsistency: { success: false },
    tests: { passed: 0, failed: 0, success: false },
    build: { success: false },
    git: { clean: false, changes: 0 },
    npmAuth: false
  }
  
  try {
    // Get current version
    const mainPkg = JSON.parse(readFileSync(join(rootDir, 'package.json'), 'utf8'))
    const currentVersion = mainPkg.version
    let version = currentVersion
    
    // Version increment (skip if --no-version-bump)
    if (!noVersionBump) {
      // Determine version increment type
      let incrementType = versionIncrement
      if (!incrementType) {
        // Suggest patch as default
        incrementType = await promptVersionIncrement(currentVersion, 'patch')
      }
      
      // Calculate new version
      const newVersion = incrementVersion(currentVersion, incrementType)
      
      if (!dryRun) {
        console.log(`\n📦 Version Update`)
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
        console.log(`Current version: v${currentVersion}`)
        console.log(`New version:     v${newVersion} (${incrementType})`)
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
        
        // Update versions
        updateAllPackageVersions(newVersion)
        
        // Update CHANGELOG
        updateChangelog(newVersion, currentVersion)
        
        version = newVersion
        
        log(`\n✓ Version updated to v${newVersion}`, 'success')
        log('✓ CHANGELOG.md updated', 'success')
        log('\n⚠️  Please review CHANGELOG.md and add your changes before deploying!', 'warn')
        log('Press Enter to continue with deployment checks, or Ctrl+C to cancel...\n', 'info')
        
        // Wait for user confirmation
        await new Promise(resolve => {
          const rl = createInterface({
            input: process.stdin,
            output: process.stdout
          })
          rl.question('', () => {
            rl.close()
            resolve()
          })
        })
      } else {
        // Dry run - just show what would happen
        version = newVersion
        log(`Would update version: v${currentVersion} → v${newVersion} (${incrementType})`, 'info')
      }
    } else {
      log('Skipping version increment (--no-version-bump)', 'info')
    }
    
    // Version check (after update)
    checkVersionConsistency()
    checks.versionConsistency.success = true
    
    // Git status
    checks.git = checkGitStatus()
    
    // Commit and push changes if not dry-run and not in CI
    const isCI = process.env.CI === 'true' || process.env.GITHUB_ACTIONS === 'true'
    if (!dryRun && !isCI && !checks.git.clean) {
      await commitAndPushChanges(version)
      // Re-check git status after commit
      checks.git = checkGitStatus()
    } else if (isCI && !checks.git.clean) {
      log('Running in CI/CD - skipping git commit/push (should be done before tag)', 'info')
    }
    
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
    const tempDir = join(rootDir, 'temp')
    if (!existsSync(tempDir)) {
      exec(`mkdir -p ${tempDir}`, { silent: true })
    }
    const reportPath = join(tempDir, `deployment-report-${version}.md`)
    writeFileSync(reportPath, formatReport(report))
    console.log(`\n📄 Deployment report saved:`)
    console.log(`   ${reportPath}`)
    log(`Report saved: temp/deployment-report-${version}.md`, 'success')
    
    // Write JSON report
    const jsonPath = join(tempDir, `deployment-report-${version}.json`)
    writeFileSync(jsonPath, JSON.stringify(report, null, 2))
    console.log(`   ${jsonPath}\n`)
    
    // Summary
    console.log('\n📊 Deployment Summary\n')
    console.log(formatReport(report))
    
    if (!report.ready) {
      throw new Error('Pre-deployment checks failed')
    }
    
    // Deploy
    if (dryRun) {
      log('\n🔍 Dry run complete - no actual publishing', 'info')
      log('\nTo deploy for real, run: npm run deploy', 'info')
    } else {
      // Confirm deployment
      console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      log('⚠️  READY TO PUBLISH TO NPM', 'warn')
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
      console.log('This will publish 9 packages to npm (permanent):')
      console.log('  • @primalib/core@' + version)
      console.log('  • @primalib/geo@' + version)
      console.log('  • @primalib/num@' + version)
      console.log('  • @primalib/stat@' + version)
      console.log('  • @primalib/lin@' + version)
      console.log('  • @primalib/topo@' + version)
      console.log('  • @primalib/tree@' + version)
      console.log('  • @primalib/web@' + version + ' (experimental)')
      console.log('  • primalib@' + version)
      console.log('\n⚠️  npm publish is PERMANENT after 24 hours')
      console.log('⚠️  You cannot unpublish or reuse version numbers')
      console.log('\nPress Ctrl+C to cancel, or wait 5 seconds to continue...\n')
      
      // Wait 5 seconds
      await new Promise(resolve => setTimeout(resolve, 5000))
      
      // Publish submodules first
      const submodules = ['core', 'geo', 'num', 'stat', 'lin', 'topo', 'tree', 'web']
      
      console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      log('📦 Step 1: Publishing Submodules', 'step')
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
      
      for (const module of submodules) {
        const modulePath = join(rootDir, module)
        const pkg = JSON.parse(readFileSync(join(modulePath, 'package.json'), 'utf8'))
        
        log(`Publishing ${pkg.name}@${pkg.version}...`)
        try {
          exec(`cd "${modulePath}" && npm publish --access public`, { silent: false })
          log(`✓ ${pkg.name} published`, 'success')
        } catch (err) {
          throw new Error(`Failed to publish ${pkg.name}: ${err.message}`)
        }
      }
      
      log('\n✓ All submodules published', 'success')
      
      // Publish main package
      console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      log('📦 Step 2: Publishing Main Package', 'step')
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
      
      const mainPkg = JSON.parse(readFileSync(join(rootDir, 'package.json'), 'utf8'))
      log(`Publishing ${mainPkg.name}@${mainPkg.version}...`)
      try {
        exec('npm publish --access public', { silent: false })
        log(`✓ ${mainPkg.name} published`, 'success')
      } catch (err) {
        throw new Error(`Failed to publish ${mainPkg.name}: ${err.message}`)
      }
      
      // Create git tag (skip in CI - tag should already exist)
      if (!isCI) {
        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
        log('🏷️  Step 3: Creating Git Tag', 'step')
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
        
        const tag = `v${version}`
        try {
          exec(`git rev-parse ${tag}`, { silent: true })
          log(`Tag ${tag} already exists`, 'warn')
        } catch {
          try {
            exec(`git tag -a ${tag} -m "Release ${tag}"`)
            exec(`git push origin ${tag}`)
            log(`✓ Tag ${tag} created and pushed`, 'success')
          } catch (err) {
            log(`Warning: Could not create/push tag: ${err.message}`, 'warn')
            log('You can create it manually: git tag -a ' + tag + ' -m "Release ' + tag + '"', 'info')
          }
        }
      } else {
        log('Running in CI/CD - tag should already exist from workflow', 'info')
      }
      
      // Success!
      console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      log('🎉 Deployment Complete!', 'success')
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
      console.log('PrimaLib v' + version + ' is now live on npm!\n')
      console.log('Install it:')
      console.log('  npm install primalib\n')
      console.log('Or individual modules:')
      console.log('  npm install @primalib/core\n')
      console.log('View on npm:')
      console.log('  https://www.npmjs.com/package/primalib')
      console.log('  https://www.npmjs.com/package/@primalib/core\n')
      console.log('Next steps:')
      console.log('  1. Create GitHub release: https://github.com/primalibjs/primalib/releases/new')
      console.log('  2. Announce release (Twitter, blog, etc.)')
      console.log('  3. Update documentation sites\n')
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
    
    if (error.message.includes('publish') || error.message.includes('Publish')) {
      log('\nPublish Failure:', 'warn')
      log('  1. Check npm authentication: npm whoami')
      log('  2. Check if version already exists: npm view primalib@' + checks.version)
      log('  3. If version exists, bump version in all package.json files')
      log('  4. Check npm access: npm access ls-packages')
    }
    
    log('\n💡 Quick Fixes:', 'info')
    log('  - Skip tests: node deploy/deploy.mjs --skip-tests')
    log('  - Skip build: node deploy/deploy.mjs --skip-build')
    log('  - Dry run only: node deploy/deploy.mjs --dry-run')
    log('\n📖 Full guide: cat deploy/DEPLOY.md')
    
    process.exit(1)
  }
}

// ============================================================================
// CLI
// ============================================================================

const parseArgs = () => {
  const args = process.argv.slice(2)
  
  // Extract version increment from --version=patch/minor/major
  let versionIncrement = null
  const versionArg = args.find(arg => arg.startsWith('--version='))
  if (versionArg) {
    versionIncrement = versionArg.split('=')[1]
    if (!['patch', 'minor', 'major'].includes(versionIncrement)) {
      console.error(`❌ Invalid version increment: ${versionIncrement}`)
      console.error('   Must be one of: patch, minor, major')
      process.exit(1)
    }
  }
  
  const options = {
    dryRun: args.includes('--dry-run'),
    skipTests: args.includes('--skip-tests'),
    skipBuild: args.includes('--skip-build'),
    versionIncrement,
    noVersionBump: args.includes('--no-version-bump'),
    help: args.includes('--help') || args.includes('-h')
  }
  return options
}

const showHelp = () => {
  console.log(`
PrimaLib Deployment System

Usage:
  node deploy/deploy.mjs [options]
  npm run deploy              # Full deployment to npm
  npm run deploy:check        # Dry run only (no publishing)

Options:
  --dry-run           Run checks without publishing to npm
  --skip-tests        Skip test suite (not recommended)
  --skip-build        Skip build step (not recommended)
  --version=<type>    Version increment: patch, minor, or major (default: prompt)
  --no-version-bump   Skip automatic version increment (use current version)
  --help, -h          Show this help

Examples:
  # Check deployment readiness (safe)
  npm run deploy:check
  node deploy/deploy.mjs --dry-run
  
  # Deploy to npm (publishes packages)
  npm run deploy
  node deploy/deploy.mjs
  
  # Skip tests (if you're certain they pass)
  node deploy/deploy.mjs --skip-tests

Workflow:
  1. Run 'npm run deploy:check' to verify everything is ready
  2. Review the deployment report
  3. Run 'npm run deploy' to publish to npm
  4. Script will publish 8 submodules first, then main package
  5. Script will create and push git tag v{version}

⚠️  WARNING: npm publish is permanent after 24 hours!
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

