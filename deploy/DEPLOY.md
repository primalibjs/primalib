# PrimaLib Deployment Guide

Automated deployment system with comprehensive checks, testing, building, and npm publishing.

## Quick Start

```bash
# 1. Check deployment readiness (dry run - safe)
npm run deploy:check

# 2. Review the deployment report
cat deploy/deployment-report-0.2.0.md

# 3. Deploy to npm (publishes packages - permanent!)
npm run deploy
```

## ⚠️  Important Warnings

- **npm publish is PERMANENT** after 24 hours
- **Version numbers cannot be reused**
- **Always run `deploy:check` first**
- **Review deployment report before deploying**

## What Happens During Deployment

The `npm run deploy` command will:

### 1. Run Pre-Deployment Checks
- **Version consistency** across all packages
- **Git status** - working directory must be clean
- **npm authentication** - must be logged in (`npm whoami`)
- **Test suite** - all 302 tests must pass
- **Build bundles** - ESBuild creates browser and Node bundles

### 2. Generate Deployment Report
- Bundle sizes (primalib.min.js, primalib.cjs, etc.)
- Component sizes (each @primalib/* module)
- Statistics (files, lines, sizes for code/tests/docs)
- Saved to `deploy/deployment-report-{version}.md`

### 3. Publish to npm (in order)
**First:** 8 submodules
- `@primalib/core@0.2.0`
- `@primalib/geo@0.2.0`
- `@primalib/num@0.2.0`
- `@primalib/stat@0.2.0`
- `@primalib/lin@0.2.0`
- `@primalib/topo@0.2.0`
- `@primalib/tree@0.2.0`
- `@primalib/web@0.2.0` (experimental)

**Then:** Main package
- `primalib@0.2.0` (depends on all submodules)

*This order is critical because the main package depends on the submodules.*

### 4. Create Git Tag
- Creates `v{version}` tag
- Pushes to origin

## Usage

### Step 1: Dry Run (Always Do This First!)

```bash
npm run deploy:check
# or
cd primalib && node deploy/deploy.mjs --dry-run
```

This is **completely safe** and performs all checks without publishing anything.

### Step 2: Review Report

```bash
cat deploy/deployment-report-0.2.0.md
```

Review:
- All tests passing?
- Bundle sizes reasonable?
- Component versions correct?
- Git status clean?

### Step 3: Deploy to npm

```bash
npm run deploy
# or
cd primalib && node deploy/deploy.mjs
```

**⚠️  This will publish to npm!**

The script will:
1. Show you what will be published
2. Wait 5 seconds (press Ctrl+C to cancel)
3. Publish 8 submodules to npm
4. Publish main package to npm
5. Create and push git tag

**This action is permanent after 24 hours!**

## Options

```bash
# Dry run (no publishing)
node deploy/deploy.mjs --dry-run

# Skip tests (not recommended)
node deploy/deploy.mjs --skip-tests

# Skip build (if already built)
node deploy/deploy.mjs --skip-build

# Help
node deploy/deploy.mjs --help
```

## Troubleshooting

### Version Mismatch

```
❌ Version mismatch: @primalib/core is 0.1.0, expected 0.2.0
```

**Fix:** Update all package.json versions:
```bash
# Manually edit each package.json
# Or use a script
for module in core geo num stat lin topo tree web; do
  cd $module
  npm version 0.2.0 --no-git-tag-version
  cd ..
done
```

### Tests Failing

```
❌ Tests failed: 300 passed, 2 failed
```

**Fix:**
```bash
npm test  # See which tests fail
# Fix the failing tests
npm test  # Verify all pass
```

### Build Errors

```
❌ Build failed
```

**Fix:**
```bash
npm run build  # See the error
# Fix the error
npm install    # Ensure dependencies installed
```

### Uncommitted Changes

```
⚠️  Working directory not clean
```

**Fix:**
```bash
git status
git add .
git commit -m "primalib: prepare for deployment"
```

### npm Authentication

```
⚠️  npm not authenticated
```

**Fix:**
```bash
npm login
npm whoami  # Verify: should show your username
```

### Publish Failed

```
❌ Failed to publish @primalib/core
```

**Common causes:**
- Version already exists on npm
- Not logged in
- No publish permission
- Network issue

**Fix:**
```bash
# Check if version exists
npm view @primalib/core@0.2.0

# If exists, bump version
npm version patch  # or minor/major

# Check login
npm whoami

# Check permissions
npm access ls-packages
```

## Deployment Workflow

### Before First Deployment

```bash
# 1. Link package locally (for tests)
npm link

# 2. Ensure logged into npm
npm login
npm whoami

# 3. Install dependencies
npm install

# 4. Run tests
npm test

# 5. Build bundles
npm run build

# 6. Dry run
npm run deploy:check
```

**Why `npm link`?** Tests import `from "primalib"` which needs to resolve to the local version during development.

### Regular Deployment

```bash
# 1. Commit all changes
git add .
git commit -m "primalib: ready for v0.2.0"
git push

# 2. Dry run
npm run deploy:check

# 3. Review report
cat deploy/deployment-report-0.2.0.md

# 4. Deploy
npm run deploy

# 5. Verify on npm
npm view primalib
npm install primalib@latest

# 6. Test installation
mkdir /tmp/test && cd /tmp/test
npm init -y
npm install primalib
node -e "const {N, sq, sum} = require('primalib'); console.log(sum(sq(N(10))))"
# Should output: 385
```

### After Deployment

```bash
# 1. Create GitHub release
# Go to: https://github.com/primalibjs/primalib/releases/new
# Tag: v0.2.0
# Title: PrimaLib v0.2.0
# Description: (from CHANGELOG.md)

# 2. Announce
# - Twitter
# - Blog
# - Newsletter

# 3. Update docs
# - Documentation site
# - Examples
```

## CI/CD Integration

### GitHub Actions

Create `.github/workflows/publish.yml`:

```yaml
name: Publish to npm

on:
  push:
    tags:
      - 'v*'

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'
      
      - run: npm install
      - run: npm test
      - run: npm run build
      - run: npm run deploy:check
      - run: npm run deploy
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## npm Scripts

Already configured in `package.json`:

```json
{
  "scripts": {
    "deploy:check": "node deploy/deploy.mjs --dry-run",
    "deploy:test": "node deploy/deploy.test.mjs",
    "deploy": "node deploy/deploy.mjs"
  }
}
```

## Security Checklist

Before deployment:

- [ ] No secrets in code
- [ ] No API keys in package.json
- [ ] .npmignore excludes dev files
- [ ] .npmignore excludes tests
- [ ] Version bumped in CHANGELOG.md
- [ ] README updated
- [ ] Breaking changes documented
- [ ] All tests pass
- [ ] Git working directory clean
- [ ] Logged into correct npm account

## Best Practices

1. **Always dry run first:** `npm run deploy:check`
2. **Review the report:** Check sizes and versions
3. **Never skip tests:** They catch critical bugs
4. **Follow semver:** major.minor.patch
5. **Update CHANGELOG:** Document all changes
6. **Test after publish:** Install and verify
7. **Monitor issues:** Check npm/GitHub after release
8. **Communicate:** Announce breaking changes

## Support

- **Issues:** https://github.com/primalibjs/primalib/issues
- **Docs:** https://github.com/primalibjs/primalib#readme
- **Email:** anderson.carli@gmail.com

---

**PrimaLib Deployment** — *Automated, tested, reliable.* 🚀
