# PrimaLib Deployment Guide

Automated deployment system with comprehensive checks and reporting.

## Quick Start

```bash
# Run deployment checks (dry run)
node deploy.mjs --dry-run

# Full deployment
node deploy.mjs

# Run deployment tests
node deploy.test.mjs
```

**Usage:** `node deploy.mjs [options]`

## Overview

The deployment system automates:
- Version consistency checks
- Test suite execution
- Build verification
- Git status validation
- npm authentication check
- Bundle size reporting
- Component inventory
- Deployment report generation

## Usage

### Basic Deployment

```bash
cd primalib
node deploy/deploy.mjs
```

This runs all checks and generates a deployment report.

### Options

```bash
# Dry run (no deployment)
node deploy/deploy.mjs --dry-run

# Skip tests (faster, use with caution)
node deploy/deploy.mjs --skip-tests

# Skip build (if already built)
node deploy/deploy.mjs --skip-build

# Help
node deploy/deploy.mjs --help
```

### Deployment Tests

Run comprehensive deployment readiness tests:

```bash
node deploy/deploy.test.mjs
```

Tests verify:
- Version consistency across packages
- Documentation completeness
- Build system integrity
- Package structure
- Test coverage
- Git repository state
- Security (no sensitive data)
- Bundle sizes

## Deployment Process

### 1. Pre-Deployment

```bash
# Ensure all changes committed
git status

# Run deployment checks
node deploy/deploy.mjs --dry-run

# Run deployment tests
node deploy/deploy.test.mjs

# Review deployment report
cat deploy/deployment-report-0.2.0.md
```

### 2. Deployment

```bash
# Full deployment check
node deploy/deploy.mjs

# Test npm publish (dry run)
npm publish --dry-run

# Publish to npm
npm publish

# Publish submodules
cd core && npm publish
cd ../geo && npm publish
cd ../num && npm publish
cd ../stat && npm publish
cd ../lin && npm publish
cd ../topo && npm publish
cd ../tree && npm publish
```

### 3. Post-Deployment

```bash
# Tag release
git tag primalib-v0.2.0

# Push tags
git push --tags

# Verify installation
npm install primalib@latest

# Test imports
node -e "import('primalib').then(m => console.log('✅ Import works'))"
```

## Deployment Report

After running `deploy.mjs`, a report is generated:

- **Markdown:** `deploy/deployment-report-{version}.md` (human-readable)
- **JSON:** `deploy/deployment-report-{version}.json` (machine-readable)

### Report Contents

#### Pre-Deployment Checks
- Version consistency across all packages
- Test suite results (passed/failed)
- Build status
- Git working directory status
- npm authentication status

#### Bundle Sizes
- ESM bundle (primalib.min.mjs)
- IIFE bundle (primalib.min.js)
- CommonJS bundle (primalib.cjs)
- Source maps

#### Component Inventory
- All submodules with versions
- Entry points
- Individual component sizes

#### Statistics
- Total lines of code
- Number of modules
- Documentation files
- Test files

## Deployment Checks

### Version Consistency
Ensures all `package.json` files have matching versions:
```
primalib/package.json         → 0.2.0
primalib/core/package.json    → 0.2.0
primalib/geo/package.json     → 0.2.0
...
```

### Test Suite
Runs `npm test` and verifies:
- All tests passing
- No test failures
- Test count reasonable (>0)

### Build System
Runs `npm run build` and verifies:
- Build completes successfully
- All bundles created
- No build errors

### Git Status
Checks working directory:
- Clean working directory (ideal)
- Or reports uncommitted changes (warning)

### npm Authentication
Verifies `npm whoami` succeeds (optional, warns if not authenticated)

## Common Scenarios

### First Time Setup

```bash
# Install dependencies
npm install

# Run build
npm run build

# Run tests
npm test

# Dry run deployment
node deploy/deploy.mjs --dry-run
```

### Quick Deploy (Skip Tests)

```bash
# If tests already run separately
node deploy/deploy.mjs --skip-tests
```

### Deploy After Build

```bash
# If already built
node deploy/deploy.mjs --skip-build
```

### CI/CD Integration

```bash
#!/bin/bash
set -e

# Run deployment tests
node primalib/deploy/deploy.test.mjs

# Run deployment checks
node primalib/deploy/deploy.mjs --dry-run

# If all passed, deploy
if [ $? -eq 0 ]; then
  npm publish
fi
```

## Troubleshooting

### Version Mismatch

```
❌ Version mismatch found:
  @primalib/core: 0.1.0 (expected 0.2.0)
```

**Fix:** Update all `package.json` versions to match:
```bash
# Update manually or with script
for pkg in core geo num stat lin topo tree; do
  cd $pkg
  npm version 0.2.0 --no-git-tag-version
  cd ..
done
```

### Tests Failing

```
❌ Tests failed: 300 passed, 2 failed
```

**Fix:** Run tests and fix failures:
```bash
npm test
# Fix failing tests
npm test  # Verify all pass
```

### Build Errors

```
❌ Command failed: npm run build
```

**Fix:** Check build system:
```bash
npm run build
# Fix errors in build.mjs or source files
```

### Uncommitted Changes

```
⚠️ Uncommitted changes found:
M primalib/package.json
M primalib/README.md
```

**Fix:** Commit or stash changes:
```bash
git add .
git commit -m "primalib: prepare for deployment"
# Or: git stash
```

### npm Authentication

```
⚠️ npm not authenticated
```

**Fix:** Login to npm:
```bash
npm login
npm whoami  # Verify
```

## Security

### Pre-Publication Checklist

- [ ] No secrets in code
- [ ] No API keys in package.json
- [ ] .npmignore excludes tests
- [ ] .npmignore excludes examples
- [ ] .npmignore excludes dev docs
- [ ] Version bump documented in CHANGELOG
- [ ] README updated with new features
- [ ] Breaking changes documented

### Sensitive Files

`.npmignore` should include:
```
test/
tests/
*.test.mjs
examples/
perf/
dev/
.env
.env.*
```

## Automation

### GitHub Actions Example

```yaml
name: Deploy
on:
  push:
    tags:
      - 'primalib-v*'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'
      
      - run: npm install
      - run: node primalib/deploy/deploy.test.mjs
      - run: node primalib/deploy/deploy.mjs
      - run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

### npm Scripts

Add to `package.json`:

```json
{
  "scripts": {
    "deploy:check": "node deploy/deploy.mjs --dry-run",
    "deploy:test": "node deploy/deploy.test.mjs",
    "deploy": "node deploy/deploy.mjs"
  }
}
```

Usage:
```bash
npm run deploy:check
npm run deploy:test
npm run deploy
```

## Rollback

If deployment fails:

```bash
# Unpublish (within 72 hours)
npm unpublish primalib@0.2.0

# Or deprecate
npm deprecate primalib@0.2.0 "Broken release, use 0.1.9"

# Fix issues and redeploy
npm version patch
node deploy/deploy.mjs
npm publish
```

## Best Practices

1. **Always dry run first:** `--dry-run` flag
2. **Review report:** Check bundle sizes and components
3. **Run tests:** Never skip deployment tests
4. **Version bump:** Follow semver (major.minor.patch)
5. **Update CHANGELOG:** Document all changes
6. **Tag releases:** `git tag primalib-v{version}`
7. **Test installation:** `npm install primalib@latest`
8. **Monitor issues:** Check npm/GitHub after deployment

## Support

- **Issues:** https://github.com/primalibjs/primalib/issues
- **Docs:** https://github.com/primalibjs/primalib#readme
- **Email:** anderson.carli@gmail.com

---

**PrimaLib Deployment** — *Automated, tested, reliable.* 🚀

