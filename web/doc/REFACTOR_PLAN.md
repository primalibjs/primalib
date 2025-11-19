# Refactoring Plan: Primaset-First Architecture

## Goal
Make `primaset` the fundamental construct, with everything else built on top using set operations mindset.

## Architecture Order
1. **primaset** - Core lazy set factory (foundation)
2. **primaenv** - Environment detection (uses primaset)
3. **include** - Code loading (uses primaenv + primaset)
4. **Everything else** - All operations as sets

## Impact Analysis

### Files to Refactor

#### 1. `primalib.mjs`
- **Change**: Reorder exports - primaset first, then primaenv, then include, then rest
- **Impact**: Low - just reordering exports

#### 2. `primaenv.mjs`
- **Change**: Replace for loops with primaset operations
- **Impact**: Medium
- **Current**: Uses object construction, no loops but could use sets
- **Refactor**: Use primaset for feature detection arrays, environment mapping

#### 3. `tests/test.mjs`
- **Change**: Replace `for (const { name, fn } of test.tests)` with primaset operations
- **Impact**: Medium
- **Refactor**: Use `primaSet(test.tests).map(...)` instead of for loop

#### 4. `examples/browser-tests.mjs`
- **Change**: Complete rewrite using primaset + environment knowledge
- **Impact**: High
- **New approach**: 
  - Use `include()` to load test files
  - Use primaset to process test results
  - Minimal code, maximum functionality

#### 5. `examples/browser-tests-loader.mjs`
- **Change**: Merge into browser-tests.mjs or simplify
- **Impact**: Medium

#### 6. Other modules (primanum, primageo, etc.)
- **Change**: Replace for loops with primaset operations where applicable
- **Impact**: Low-Medium (gradual)

## Implementation Steps

1. ✅ Reorder `primalib.mjs` exports
2. ⏳ Refactor `primaenv.mjs` to use primaset
3. ⏳ Refactor `tests/test.mjs` to use primaset
4. ⏳ Create minimal `browser-tests.mjs` using primaset + env
5. ⏳ Update `browser.html` to use new browser-tests.mjs

## Benefits

- **Consistency**: Everything uses the same set-based mindset
- **Lazy evaluation**: Tests can be processed lazily
- **Composability**: Test operations become composable
- **Smaller code**: Less boilerplate, more declarative
- **Performance**: Lazy evaluation can improve performance

## Risks

- **Learning curve**: Developers need to think in sets
- **Debugging**: Lazy evaluation can make debugging harder
- **Compatibility**: Need to ensure browser compatibility

