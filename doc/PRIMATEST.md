# PrimaTest - Testing Philosophy & Approach

> **"Simple, fast, comprehensive - a custom test framework that understands PrimaSet's lazy evaluation."**

PrimaTest is PrimaLib's custom testing framework designed specifically for testing lazy sets, infinite sequences, and mathematical operations. It provides a minimal, dependency-free testing solution that automatically handles PrimaSet materialization and provides built-in coverage tracking.

## 🎯 **Philosophy**

### Why a Custom Test Framework?

PrimaLib uses a **custom test framework** instead of popular libraries like Jest, Mocha, or Vitest for several key reasons:

1. **Zero Dependencies**: No external testing libraries required - just pure JavaScript
2. **PrimaSet Awareness**: Automatically materializes lazy sets and handles infinite sequences
3. **Simplicity**: Minimal API (`test()`, `check()`) - easy to understand and use
4. **Performance Tracking**: Built-in slow test detection and timing
5. **Coverage Tracking**: Automatic test coverage reporting
6. **Browser Compatible**: Works in both Node.js and browsers without configuration
7. **Lightweight**: Small footprint, fast execution

### Design Principles

- **Minimal API**: Just `test()` and `check()` - no complex setup
- **Automatic Materialization**: Handles PrimaSet values automatically
- **Flexible Assertions**: Supports exact matches and numeric approximations
- **Clear Output**: Simple pass/fail reporting with coverage statistics
- **Performance Aware**: Tracks slow tests automatically

## 🏗️ **Test Framework Architecture**

### Core Components

```javascript
// test.mjs - The test framework
test(name, fn)        // Register a test
check(actual, expect) // Assertion function
test.run(level)       // Run all tests
```

### Test Registration

```javascript
import { test } from './test.mjs'

test('Test name', check => {
  // Test code here
  check(actual, expected)
})
```

### Assertion Function

```javascript
import { check } from './test.mjs'

// Exact match
check(1, 1)
check('hello', 'hello')
check([1, 2, 3], [1, 2, 3])

// Numeric approximation (for floating point)
check(Math.PI, '3.14')  // Checks if starts with '3.14'
check(1.234567, '1.23')  // Approximate match

// Function evaluation
check(() => 1 + 1, 2)
check(1, () => 1)
```

## 🔍 **PrimaSet Materialization**

One of PrimaTest's key features is **automatic materialization** of PrimaSet values.

### Automatic Handling

```javascript
import { test } from './test.mjs'
import { primaSet, N } from 'primalib'

test('PrimaSet automatic materialization', check => {
  // PrimaSet values are automatically converted to arrays
  check(primaSet([1, 2, 3]), [1, 2, 3])
  check(N(5), [1, 2, 3, 4, 5])
  
  // Works with lazy sequences
  check(N().take(5), [1, 2, 3, 4, 5])
})
```

### How It Works

The `check()` function automatically:
1. Detects if a value is a PrimaSet (has `.toArray()` method)
2. Materializes lazy sequences to arrays
3. Handles functions (evaluates them)
4. Normalizes JSON for comparison

```javascript
const materialize = (v) => {
  if (v === undefined) return 'undefined'
  if (typeof v === 'function') v = v()  // Evaluate functions
  if (v?.toArray) v = v.toArray()      // Materialize PrimaSets
  if (typeof v !== 'string') v = JSON.stringify(v) || ''
  return v.replace(/"([a-zA-Z_$][a-zA-Z_$0-9]*)":/g, '$1:').replace(/\s+/g, '')
}
```

## 📝 **Writing Tests**

### Basic Test Structure

```javascript
import { test } from './test.mjs'

test('Test description', check => {
  // Arrange
  const input = [1, 2, 3]
  
  // Act
  const result = someFunction(input)
  
  // Assert
  check(result, expected)
})
```

### Testing PrimaSet Operations

```javascript
import { test } from './test.mjs'
import { primaSet, N, primes } from 'primalib'

test('PrimaSet map operation', check => {
  const result = primaSet([1, 2, 3]).map(x => x * 2)
  check(result, [2, 4, 6])  // Automatically materialized
})

test('Infinite sequence take', check => {
  check(N().take(5), [1, 2, 3, 4, 5])
  check(primes.take(3), [2, 3, 5])
})
```

### Testing Error Cases

```javascript
test('Error handling', check => {
  try {
    someFunctionThatThrows()
    check(false, true)  // Should not reach here
  } catch (e) {
    check(e.message.includes('expected error'), true)
  }
})
```

### Testing Floating Point

```javascript
test('Floating point approximation', check => {
  const result = Math.sqrt(2)
  check(result, '1.414')  // Checks if starts with '1.414'
  check(Math.PI, '3.14')  // Approximate match
})
```

### Testing Objects

```javascript
test('Object comparison', check => {
  const obj = { a: 1, b: 2 }
  check(obj, '{a:1,b:2}')  // Normalized JSON comparison
})
```

## 📊 **Test Organization**

### Module-Based Tests

Each PrimaLib module has its own test file:

```
primalib/tests/
  ├── test.mjs              # Test framework
  ├── primaset.test.mjs     # PrimaSet core tests
  ├── primaops.test.mjs     # Operations tests
  ├── primanum.test.mjs     # Number theory tests
  ├── primageo.test.mjs     # Geometry tests
  ├── primastat.test.mjs    # Statistics tests
  ├── primatopo.test.mjs    # Topology tests
  ├── primalin.test.mjs     # Linear algebra tests
  ├── primatree.test.mjs    # Tree handling tests
  ├── primaweb.test.mjs     # Web pipeline tests
  └── primalib.test.mjs     # Integration tests
```

### Test File Structure

```javascript
/**
 * Comprehensive tests for ModuleName
 */
import { test } from './test.mjs'
import { primaSet } from '../primaset.mjs'
import { function1, function2 } from '../module.mjs'

// ============================================================================
// SECTION NAME
// ============================================================================

test('🧪 modulename.test.mjs - Module overview test', check => {
  // First test with emoji identifier
})

test('Feature: specific functionality', check => {
  // Feature tests
})

test('Feature: edge case', check => {
  // Edge case tests
})
```

### Integration Tests

```javascript
// primalib.test.mjs - Runs all module tests
import './primaops.test.mjs'
import './primaset.test.mjs'
import './primanum.test.mjs'
// ... all modules

const ok = await test.run(1)
console.log(ok ? '✅ All green — ready to dig! ⛏️' : '❌ Failed')
```

## 🎨 **Test Patterns**

### Pattern 1: Basic Functionality

```javascript
test('Function: basic operation', check => {
  const result = function(input)
  check(result, expected)
})
```

### Pattern 2: Multiple Assertions

```javascript
test('Function: multiple properties', check => {
  const result = function(input)
  check(result.property1, expected1)
  check(result.property2, expected2)
  check(result.property3, expected3)
})
```

### Pattern 3: Error Testing

```javascript
test('Function: error case', check => {
  try {
    function(invalidInput)
    check(false, true)  // Should throw
  } catch (e) {
    check(e.message.includes('expected'), true)
  }
})
```

### Pattern 4: Integration Testing

```javascript
test('Integration: multiple modules', check => {
  const result = module1(module2(module3(input)))
  check(result, expected)
})
```

### Pattern 5: Performance Testing

```javascript
test('Performance: large dataset', check => {
  const start = performance.now()
  const result = function(largeInput)
  const duration = performance.now() - start
  
  check(result, expected)
  // Slow test detection is automatic (>100ms)
})
```

## 📈 **Coverage & Performance**

### Automatic Coverage Tracking

PrimaTest automatically tracks test coverage:

```javascript
test.run(2)  // Run with level 2 (verbose)
// Output:
// ✓ Test 1
// ✓ Test 2
// ...
// 48 passed, 0 failed
// 📊 Coverage: 48/48 (100.0%)
```

### Slow Test Detection

Tests taking longer than 100ms are flagged:

```
⚠️  Slow tests (>100ms):
   150.23ms - Test: large dataset processing
   120.45ms - Test: complex computation
```

### Coverage Statistics

```javascript
const results = await test.run(2, (results) => {
  console.log('Coverage:', results.coverage.percent + '%')
  console.log('Slow tests:', results.slowTests.length)
})
```

## 🌐 **Browser Compatibility**

PrimaTest works in both Node.js and browsers:

### Node.js

```javascript
// Run tests
node primalib/tests/primalib.test.mjs

// Output:
// === PrimaLib Tests ===
// ✓ Test 1
// ✓ Test 2
// ...
// 48 passed, 0 failed
// 📊 Coverage: 48/48 (100.0%)
```

### Browser

```html
<script type="module">
  import './primalib/tests/primalib.test.mjs'
  // Tests run automatically
</script>
```

### Environment Detection

The framework automatically detects the environment:

```javascript
// Different output for browser vs Node.js
const prefix = typeof window === 'undefined' ? '\n' : ''
const loggers = {
  pass: (name) => level >= 2 && typeof window === 'undefined' 
    ? console.log('✓', name) 
    : null
}
```

## 🔧 **Advanced Features**

### Debug Helper

```javascript
import { dbg } from './test.mjs'

test('Debug example', check => {
  const value = complexComputation()
  dbg('intermediate', value)  // Prints debug info
  check(value, expected)
})
```

### Test Levels

```javascript
test.run(0)  // Silent (only failures)
test.run(1)  // Minimal (summary only)
test.run(2)  // Verbose (all tests shown)
```

### Custom Result Handler

```javascript
test.run(2, (results) => {
  // Custom handling
  if (results.fail > 0) {
    console.error('Tests failed!')
  }
  // Export results, send to CI, etc.
})
```

## 📋 **Complete API Reference**

### Test Registration

| Function | Description | Example |
|----------|-------------|---------|
| `test(name, fn)` | Register a test | `test('name', check => {...})` |

### Assertion

| Function | Description | Example |
|----------|-------------|---------|
| `check(actual, expect)` | Assert equality | `check(1, 1)` |
| `check(actual, 'prefix')` | Numeric prefix match | `check(Math.PI, '3.14')` |
| `check(() => value, expect)` | Function evaluation | `check(() => 1+1, 2)` |

### Test Execution

| Method | Description | Example |
|--------|-------------|---------|
| `test.run(level?)` | Run all tests | `await test.run(2)` |
| `test.run(level, callback)` | Run with callback | `await test.run(2, onResult)` |

### Debug

| Function | Description | Example |
|----------|-------------|---------|
| `dbg(label, value)` | Debug output | `dbg('value', x)` |

## 🎯 **Why This Approach?**

### 1. **Simplicity Over Complexity**

**Traditional frameworks** (Jest, Mocha):
- Complex setup and configuration
- Many dependencies
- Heavy abstractions
- Learning curve

**PrimaTest**:
- Zero configuration
- No dependencies
- Simple API
- Immediate understanding

### 2. **PrimaSet Awareness**

**Traditional frameworks**:
```javascript
// Manual materialization required
expect(primaSet([1,2,3]).toArray()).toEqual([1,2,3])
```

**PrimaTest**:
```javascript
// Automatic materialization
check(primaSet([1,2,3]), [1,2,3])
```

### 3. **Performance Focus**

PrimaTest tracks slow tests automatically, helping identify performance issues early.

### 4. **Coverage Built-In**

No need for separate coverage tools - it's built into the framework.

### 5. **Browser Compatible**

Works everywhere without configuration or build steps.

## 📊 **Test Statistics**

PrimaLib's test suite includes:

- **16 test files** covering all modules
- **300+ tests** across all functionality
- **100% module coverage** - every module has tests
- **Integration tests** for cross-module functionality
- **Performance tests** for optimization validation
- **Edge case tests** for robustness

### Test Distribution

- **PrimaSet**: Core lazy set operations
- **PrimaOps**: All operations and methods
- **PrimaNum**: Number sequences and primes
- **PrimaGeo**: Geometric structures
- **PrimaStat**: Statistical functions
- **PrimaTopo**: Topological invariants
- **PrimaLin**: Linear algebra operations
- **PrimaTree**: Tree traversal and Virtual DOM
- **PrimaWeb**: Web pipeline functionality
- **Integration**: Cross-module tests

## 🎓 **Best Practices**

### 1. **Test Naming**

Use descriptive names that explain what's being tested:

```javascript
// Good
test('Vector: dot product calculation', check => {...})
test('Matrix: determinant for 2x2', check => {...})

// Bad
test('test1', check => {...})
test('vector', check => {...})
```

### 2. **Test Organization**

Group related tests together:

```javascript
// ============================================================================
// VECTORS
// ============================================================================

test('Vector: creation', check => {...})
test('Vector: dot product', check => {...})
test('Vector: cross product', check => {...})
```

### 3. **Use Emoji Identifiers**

First test in each file uses emoji for easy identification:

```javascript
test('🧪 modulename.test.mjs - Overview', check => {...})
```

### 4. **Test Edge Cases**

Always test edge cases:

```javascript
test('Function: zero input', check => {...})
test('Function: negative input', check => {...})
test('Function: empty array', check => {...})
```

### 5. **Test Error Cases**

Test that errors are thrown correctly:

```javascript
test('Function: invalid input error', check => {
  try {
    function(invalid)
    check(false, true)
  } catch (e) {
    check(e.message.includes('expected'), true)
  }
})
```

### 6. **Use Automatic Materialization**

Let PrimaTest handle PrimaSet materialization:

```javascript
// Good - automatic
check(primaSet([1,2,3]), [1,2,3])

// Unnecessary - manual
check(primaSet([1,2,3]).toArray(), [1,2,3])
```

## 🚀 **Running Tests**

### Run All Tests

```bash
node primalib/tests/primalib.test.mjs
```

### Run Specific Module

```bash
node primalib/tests/primalin.test.mjs
```

### Run in Browser

```html
<script type="module" src="primalib/tests/primalib.test.mjs"></script>
```

### CI/CD Integration

```yaml
# GitHub Actions example
- name: Run tests
  run: node primalib/tests/primalib.test.mjs
```

## 🔍 **Debugging Tests**

### Using dbg()

```javascript
import { dbg } from './test.mjs'

test('Debug example', check => {
  const intermediate = complexComputation()
  dbg('intermediate', intermediate)  // Prints: DBG intermediate: [value]
  check(intermediate, expected)
})
```

### Understanding Failures

When a test fails, PrimaTest shows:
- Test name
- Expected value
- Actual value
- Stack trace (filtered for relevance)

```
✗ Test: vector dot product
  Expected 32  Got 31
  at file:///path/to/test.mjs:50:3
```

## 📝 **Example Test File**

```javascript
/**
 * Comprehensive tests for ExampleModule
 */
import { test } from './test.mjs'
import { primaSet } from '../primaset.mjs'
import { function1, function2 } from '../example.mjs'

// ============================================================================
// BASIC FUNCTIONALITY
// ============================================================================

test('🧪 example.test.mjs - Module overview', check => {
  const result = function1([1, 2, 3])
  check(result, [2, 4, 6])
})

test('Function1: basic operation', check => {
  check(function1(5), 10)
  check(function1([1, 2, 3]), [2, 4, 6])
})

test('Function1: edge case - empty input', check => {
  check(function1([]), [])
})

test('Function1: error case - invalid input', check => {
  try {
    function1(null)
    check(false, true)
  } catch (e) {
    check(e.message.includes('invalid'), true)
  }
})

// ============================================================================
// ADVANCED FUNCTIONALITY
// ============================================================================

test('Function2: integration with PrimaSet', check => {
  const result = primaSet([1, 2, 3]).map(function2)
  check(result, [2, 4, 6])  // Automatic materialization
})

test('Function2: floating point', check => {
  const result = function2(1.5)
  check(result, '3.0')  // Numeric approximation
})
```

## 🎯 **Summary**

PrimaTest provides:

- **Simple API**: Just `test()` and `check()`
- **Automatic Materialization**: Handles PrimaSet values
- **Zero Dependencies**: Pure JavaScript
- **Coverage Tracking**: Built-in coverage reporting
- **Performance Monitoring**: Slow test detection
- **Browser Compatible**: Works everywhere
- **Lightweight**: Fast and efficient

**The philosophy**: Keep testing simple, fast, and focused on what matters - verifying that PrimaLib works correctly with minimal overhead.

---

**PrimaTest** - *Simple, fast, comprehensive testing for lazy sets and mathematical operations.* 🧪

