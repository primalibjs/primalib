# PrimaLib Deployment System

Automated deployment with comprehensive testing and reporting.

## Files

- **`deploy.mjs`** - Main deployment script (~400 lines)
- **`deploy.test.mjs`** - Deployment tests (~320 lines, 20 tests)
- **`DEPLOY.md`** - Complete deployment guide (~450 lines)
- **`README.md`** - This file

## Quick Usage

```bash
# Run deployment tests
npm run deploy:test

# Check deployment readiness (dry run)
npm run deploy:check

# Full deployment
npm run deploy
```

## Features

### Automated Checks
- ✅ Version consistency across all packages
- ✅ Test suite execution (302 tests)
- ✅ Build verification (all bundles)
- ✅ Git status validation
- ✅ npm authentication check

### Detailed Reporting
- 📊 Bundle sizes (ESM, IIFE, CJS)
- 📦 Component inventory
- 📈 Statistics (LOC, modules, docs, tests)
- 📝 Markdown + JSON reports

### Safety Features
- 🔒 Dry run mode (no actual deployment)
- ⚠️  Warns on uncommitted changes
- 🚫 Fails on test failures
- ✋ Stops on version mismatches

## Report Output

After running, check:
- `deploy/deployment-report-{version}.md` - Human-readable
- `deploy/deployment-report-{version}.json` - Machine-readable

## CI/CD Integration

Add to `.github/workflows/deploy.yml`:

```yaml
name: Deploy
on:
  push:
    tags: ['primalib-v*']

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run deploy:test
      - run: npm run deploy:check
      - run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## Architecture

### deploy.mjs Structure
```
Utilities (exec, log, getFileSize, etc.)
↓
Checks (version, tests, build, git, npm)
↓
Reporting (bundles, components, stats)
↓
Main Deploy (orchestrates all checks)
↓
CLI (parses args, shows help)
```

### deploy.test.mjs Structure
```
Test Framework (test, check, runTests)
↓
Deployment System Tests (3)
Version Consistency Tests (2)
Documentation Tests (3)
Build System Tests (3)
Package Structure Tests (3)
Test Coverage Tests (2)
Git Tests (2)
Security Tests (2)
Performance Tests (1)
```

## Development

### Adding New Checks

Edit `deploy.mjs`:

```javascript
const checkNewFeature = () => {
  log('Checking new feature...', 'step')
  // Your check logic
  log('New feature OK', 'success')
  return { success: true, data: {...} }
}

// Add to deploy() function
checks.newFeature = checkNewFeature()
```

### Adding New Tests

Edit `deploy.test.mjs`:

```javascript
test('my new test', ({ check }) => {
  const result = myCheck()
  check(result === expected, 'Check failed')
})
```

## Troubleshooting

See `DEPLOY.md` for complete troubleshooting guide.

**Common issues:**
- Version mismatch → Update all package.json files
- Tests failing → Run `npm test` and fix
- Build errors → Check `build.mjs`
- Git uncommitted → Commit or use `--dry-run`

## Statistics

- **deploy.mjs:** ~400 lines, 10 functions, comprehensive logging
- **deploy.test.mjs:** ~320 lines, 20 tests, 100% critical paths
- **DEPLOY.md:** ~450 lines, complete guide with examples
- **Total:** ~1,200 lines of deployment infrastructure

## License

MIT - Part of PrimaLib

