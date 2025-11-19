# Errors & Troubleshooting

> **"Understanding errors, debugging effectively, and preventing issues in PrimaLib."**

PrimaLib provides comprehensive error handling with clear error messages, filtered stack traces, and specialized error types. This guide helps you understand errors, debug effectively, and prevent common issues.

## 🎯 **Error Philosophy**

PrimaLib's error handling follows these principles:

1. **Clear Messages**: Errors explain what went wrong and why
2. **Filtered Stack Traces**: Remove clutter, show relevant information
3. **Contextual Information**: Errors include context for debugging
4. **Fail Fast**: Errors are thrown immediately, not silently ignored
5. **Type Safety**: Specialized error types for different scenarios

## 🔴 **Error Types**

### PrimaError (Base Class)

The base error class for all PrimaLib errors.

```javascript
import { PrimaError } from 'primalib/errors.mjs'

// Properties
error.name      // → 'PrimaError'
error.message   // → Error message
error.code      // → Error code (e.g., 'DIMENSION_ERROR')
error.context   // → Additional context object
error.stack     // → Filtered stack trace
```

### ProxyError

Thrown when accessing properties through Proxy fails.

```javascript
// Example
const set = primaSet([1, 2, 3])
set.invalidMethod()  // → ProxyError: Proxy error accessing 'invalidMethod'
```

**Properties**:
- `prop`: Property name that failed
- `targetType`: Type of target object

### DimensionError

Thrown when dimension mismatches occur.

```javascript
// Example
vector(1, 2).cross(vector(3, 4))  // → DimensionError: Cross product requires 3D vectors
```

**Properties**:
- `dimension`: Actual dimension
- `expected`: Expected dimension

### MaterializationError

Thrown when materializing lazy sequences fails.

```javascript
// Example
const infinite = N()
infinite.toArray()  // → MaterializationError: Cannot materialize infinite sequence
```

### InfiniteLoopError

Thrown when operations exceed timeout (detected by `withTimeout` wrapper).

```javascript
// Example
const loop = withTimeout(function* () {
  while (true) yield 1
}, 1000)
// After 1000ms → InfiniteLoopError: Infinite loop detected after 1000ms
```

## 📋 **Common Error Messages**

### Vector Errors

#### "Cross product requires 3D vectors"

**Cause**: Cross product only works in 3D space.

```javascript
// ❌ Error
vector(1, 2).cross(vector(3, 4))

// ✅ Fix
vector(1, 2, 0).cross(vector(3, 4, 0))
```

#### "Cannot normalize zero vector"

**Cause**: Attempting to normalize a vector with zero length.

```javascript
// ❌ Error
vector(0, 0, 0).normalize()

// ✅ Fix - Check before normalizing
const v = vector(0, 0, 0)
if (v.norm() > 0) {
  v.normalize()
}
```

#### "Cannot project onto zero vector"

**Cause**: Projection target is a zero vector.

```javascript
// ❌ Error
vector(1, 2).project(vector(0, 0))

// ✅ Fix - Check target vector
const onto = vector(0, 0)
if (onto.norm() > 0) {
  v.project(onto)
}
```

#### "Cannot compute angle with zero vector"

**Cause**: One or both vectors are zero vectors.

```javascript
// ❌ Error
vector(0, 0).angle(vector(1, 2))

// ✅ Fix - Check vectors before computing angle
const v1 = vector(0, 0)
const v2 = vector(1, 2)
if (v1.norm() > 0 && v2.norm() > 0) {
  v1.angle(v2)
}
```

### Matrix Errors

#### "Matrix data must be nested arrays"

**Cause**: Matrix constructor received invalid data format.

```javascript
// ❌ Error
matrix([1, 2, 3])  // Not nested

// ✅ Fix
matrix([[1, 2], [3, 4]])
```

#### "All matrix rows must have same length"

**Cause**: Matrix rows have inconsistent dimensions.

```javascript
// ❌ Error
matrix([[1, 2], [3, 4, 5]])

// ✅ Fix
matrix([[1, 2, 0], [3, 4, 5]])  // Pad or fix dimensions
```

#### "Determinant requires square matrix"

**Cause**: Determinant only works for square matrices.

```javascript
// ❌ Error
matrix([[1, 2], [3, 4], [5, 6]]).det()

// ✅ Fix
matrix([[1, 2], [3, 4]]).det()  // Use square matrix
```

#### "Matrix is singular (non-invertible)"

**Cause**: Matrix determinant is zero (or very close to zero).

```javascript
// ❌ Error
matrix([[1, 2], [2, 4]]).inv()  // Determinant = 0

// ✅ Fix - Use non-singular matrix
matrix([[1, 2], [3, 4]]).inv()
```

#### "Matrix dimensions incompatible for multiplication"

**Cause**: Inner dimensions don't match for matrix multiplication.

```javascript
// ❌ Error
matrix([[1, 2]]).mul(matrix([[1], [2], [3]]))  // 1×2 × 3×1

// ✅ Fix - Match inner dimensions
matrix([[1, 2]]).mul(matrix([[1, 2], [3, 4]]))  // 1×2 × 2×2
```

#### "Matrix columns must match vector dimension"

**Cause**: Vector dimension doesn't match matrix columns.

```javascript
// ❌ Error
matrix([[1, 2], [3, 4]]).mulVec(vector(1, 2, 3))  // 2×2 × 3D vector

// ✅ Fix - Match dimensions
matrix([[1, 2], [3, 4]]).mulVec(vector(1, 2))  // 2×2 × 2D vector
```

#### "Matrices must have same dimensions for addition"

**Cause**: Matrices have different dimensions.

```javascript
// ❌ Error
matrix([[1, 2]]).add(matrix([[1, 2], [3, 4]]))

// ✅ Fix - Use same dimensions
matrix([[1, 2]]).add(matrix([[3, 4]]))
```

#### "Matrix columns are linearly dependent"

**Cause**: QR decomposition requires linearly independent columns.

```javascript
// ❌ Error
matrix([[1, 2], [2, 4]]).qr()  // Columns are dependent

// ✅ Fix - Use linearly independent columns
matrix([[1, 2], [3, 4]]).qr()
```

### Polynomial Errors

#### "Division by zero polynomial"

**Cause**: Attempting to divide by a zero polynomial.

```javascript
// ❌ Error
polynomial([1, 2, 3]).div(polynomial([0]))

// ✅ Fix - Check divisor
const divisor = polynomial([0])
if (divisor.coeffs.some(c => c !== 0)) {
  p.div(divisor)
}
```

### Geometry Errors

#### "splitEvenOdd requires 2D hypercube"

**Cause**: Operation requires specific dimension.

```javascript
// ❌ Error
hypercube([0,0,0], [1,1,1]).splitEvenOdd()  // 3D

// ✅ Fix
hypercube([0,0], [1,1]).splitEvenOdd()  // 2D
```

#### "No splitter for dimension X"

**Cause**: Dimension not supported by power-of-2 operations.

```javascript
// ❌ Error
hypercube([0,0,0,0,0], [1,1,1,1,1]).splitMod8()  // 5D not supported

// ✅ Fix - Use supported dimension (2, 4, 8, 16, 32)
hypercube([0,0,0,0], [1,1,1,1]).splitMod8()  // 4D
```

### Prima3D Errors

#### "Three.js not loaded"

**Cause**: Three.js library not included before using Prima3D.

```javascript
// ❌ Error
import { visualize } from 'primalib/prima3d.mjs'
visualize(point(1, 2, 3))  // Three.js not loaded

// ✅ Fix - Include Three.js first
<script src="https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js"></script>
<script type="module">
  import { visualize } from './primalib/prima3d.mjs'
  visualize(point(1, 2, 3))
</script>
```

### PrimaOps Errors

#### "factorial requires n >= 0"

**Cause**: Factorial doesn't work for negative numbers.

```javascript
// ❌ Error
factorial(-5)

// ✅ Fix
factorial(5)  // Use non-negative number
```

#### "factorial overflow"

**Cause**: Factorial result exceeds safe number range (n > 170).

```javascript
// ❌ Error
factorial(200)  // Too large

// ✅ Fix - Use BigInt or smaller number
factorial(170)  // Maximum safe value
```

## 🔧 **Error Handling**

### Basic Error Handling

```javascript
try {
  const result = riskyOperation()
} catch (error) {
  if (error instanceof PrimaError) {
    console.error('PrimaLib error:', error.message)
    console.error('Code:', error.code)
    console.error('Context:', error.context)
  } else {
    console.error('Unknown error:', error)
  }
}
```

### Using Safe Wrapper

```javascript
import { safe } from 'primalib/errors.mjs'

// Safe operation with fallback
const safeOperation = safe(
  (x) => riskyOperation(x),
  null,  // Fallback value
  handleError
)

const result = safeOperation(input)  // Returns null on error
```

### Using Timeout Wrapper

```javascript
import { withTimeout } from 'primalib/errors.mjs'

// Operation with timeout
const safeGenerator = withTimeout(
  function* () {
    // Potentially infinite generator
    while (true) yield compute()
  },
  5000  // 5 second timeout
)

try {
  for (const value of safeGenerator()) {
    // Process value
  }
} catch (error) {
  if (error instanceof InfiniteLoopError) {
    console.error('Operation timed out')
  }
}
```

### Custom Error Handler

```javascript
import { createErrorHandler } from 'primalib/errors.mjs'

const customHandler = createErrorHandler({
  logErrors: true,      // Log to console
  throwErrors: false,   // Don't throw, return error
  onError: (error, context) => {
    // Custom handling (send to logging service, etc.)
    sendToLoggingService(error, context)
  }
})

const handled = customHandler(error, { operation: 'compute' })
```

## 🐛 **Debugging Techniques**

### 1. **Check Error Context**

PrimaError includes context information:

```javascript
try {
  riskyOperation()
} catch (error) {
  if (error instanceof PrimaError) {
    console.log('Error code:', error.code)
    console.log('Context:', error.context)
    // Context may include:
    // - dimension: actual dimension
    // - expected: expected dimension
    // - prop: property name
    // - targetType: object type
  }
}
```

### 2. **Use Filtered Stack Traces**

PrimaError automatically filters stack traces to show relevant information:

```javascript
try {
  operation()
} catch (error) {
  console.error(error.stack)  // Already filtered
  // Shows only relevant stack frames
}
```

### 3. **Enable Error Logging**

Use error handler with logging enabled:

```javascript
import { createErrorHandler } from 'primalib/errors.mjs'

const handler = createErrorHandler({ logErrors: true })
handler(error, context)
// Automatically logs:
// [PrimaLib Error] Error message
// Stack trace (filtered)
// Context information
```

### 4. **Debug with dbg()**

Use the test framework's debug helper:

```javascript
import { dbg } from './test.mjs'

const intermediate = complexComputation()
dbg('intermediate', intermediate)  // Prints debug info
```

### 5. **Check PrimaSet Materialization**

If working with lazy sequences, ensure materialization:

```javascript
// Check if value is materialized
const set = primaSet([1, 2, 3])
console.log('Is array:', Array.isArray(set))
console.log('Has toArray:', typeof set.toArray === 'function')

// Materialize explicitly
const array = set.toArray()
console.log('Materialized:', array)
```

## 🔍 **Troubleshooting Common Issues**

### Issue 1: "Method not found" or "undefined is not a function"

**Symptoms**:
```javascript
primaSet([1,2,3]).map(x => x * 2)  // TypeError: map is not a function
```

**Causes**:
- Module not imported correctly
- Circular dependency issue
- Plugin not loaded

**Solutions**:
```javascript
// ✅ Ensure correct import
import { primaSet } from 'primalib'

// ✅ Check if method exists
if (typeof primaSet([1,2,3]).map === 'function') {
  // Method available
}

// ✅ Use free function as fallback
import { map } from 'primalib'
map([1,2,3], x => x * 2)
```

### Issue 2: Infinite Loop or Hanging

**Symptoms**:
- Code hangs indefinitely
- Memory usage increases
- No error thrown

**Causes**:
- Infinite sequence without `.take()`
- Infinite generator without termination
- Recursive operation without base case

**Solutions**:
```javascript
// ❌ Problem
const infinite = N()
infinite.toArray()  // Hangs!

// ✅ Fix - Use take()
N().take(100).toArray()

// ✅ Use timeout wrapper
import { withTimeout } from 'primalib/errors.mjs'
const safe = withTimeout(infiniteGenerator, 5000)
```

### Issue 3: Memory Issues with Large Sequences

**Symptoms**:
- High memory usage
- Browser/Node.js crashes
- Slow performance

**Causes**:
- Materializing large sequences
- Not using lazy evaluation
- Caching too much data

**Solutions**:
```javascript
// ❌ Problem
const large = primaSet(N()).take(1000000).toArray()  // Materializes all

// ✅ Fix - Process lazily
primaSet(N())
  .take(1000000)
  .filter(x => x % 2 === 0)
  .take(100)  // Only materialize what you need
  .toArray()

// ✅ Use sliding window cache
const cached = primaSet(N(), { cache: true, cacheSize: 1000 })
```

### Issue 4: Dimension Mismatch Errors

**Symptoms**:
```
DimensionError: Cross product requires 3D vectors
```

**Causes**:
- Vectors/matrices with wrong dimensions
- Not checking dimensions before operations

**Solutions**:
```javascript
// ✅ Check dimensions before operations
const v1 = vector(1, 2)
const v2 = vector(3, 4)

if (v1.dim === 3 && v2.dim === 3) {
  v1.cross(v2)
} else {
  // Handle 2D case or pad to 3D
  vector(v1[0], v1[1], 0).cross(vector(v2[0], v2[1], 0))
}
```

### Issue 5: Floating Point Precision Issues

**Symptoms**:
- Determinant returns very small number instead of 0
- Matrix inversion fails for "nearly singular" matrices
- Comparisons fail due to precision

**Causes**:
- Floating point arithmetic limitations
- Not using tolerance for comparisons

**Solutions**:
```javascript
// ✅ Use tolerance for comparisons
const det = matrix([[1, 2], [2, 4]]).det()
if (Math.abs(det) < 1e-10) {
  // Effectively zero
}

// ✅ Check before operations
if (Math.abs(det) > 1e-10) {
  matrix.inv()
} else {
  // Handle singular matrix
}
```

### Issue 6: Three.js Visualization Not Working

**Symptoms**:
- Nothing renders
- "Three.js not loaded" error
- Black screen

**Causes**:
- Three.js not included
- Wrong import path
- Container element not found

**Solutions**:
```html
<!-- ✅ Include Three.js first -->
<script src="https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js"></script>

<!-- ✅ Ensure container exists -->
<div id="canvas"></div>

<script type="module">
  import { visualize } from './primalib/prima3d.mjs'
  import { point } from 'primalib'
  
  visualize(point(1, 2, 3), {
    container: '#canvas'  // Must exist
  })
</script>
```

### Issue 7: Test Failures

**Symptoms**:
- Tests fail with unexpected values
- Floating point comparisons fail

**Causes**:
- Not using numeric approximation in tests
- Materialization issues
- Timing issues

**Solutions**:
```javascript
// ✅ Use numeric approximation for floating point
check(Math.PI, '3.14')  // Checks prefix, not exact match

// ✅ Materialize PrimaSets in tests
check(primaSet([1,2,3]), [1,2,3])  // Automatic materialization

// ✅ Check for undefined/null
if (result !== undefined) {
  check(result, expected)
}
```

## 🛡️ **Error Prevention**

### 1. **Validate Inputs**

```javascript
function safeOperation(input) {
  if (!input || !Array.isArray(input)) {
    throw new Error('Input must be an array')
  }
  if (input.length === 0) {
    throw new Error('Input cannot be empty')
  }
  // Proceed with operation
}
```

### 2. **Check Dimensions**

```javascript
function vectorOperation(v1, v2) {
  if (v1.dim !== v2.dim) {
    throw new DimensionError(
      'Vectors must have same dimension',
      v1.dim,
      v2.dim
    )
  }
  // Proceed
}
```

### 3. **Use Safe Wrappers**

```javascript
import { safe } from 'primalib/errors.mjs'

const safeOperation = safe(
  riskyOperation,
  defaultValue,  // Fallback
  handleError
)
```

### 4. **Limit Infinite Sequences**

```javascript
// Always use take() with infinite sequences
N().take(100)  // Don't materialize entire sequence
primes.take(50)  // Limit size
```

### 5. **Check Before Operations**

```javascript
// Check before division
if (divisor !== 0) {
  result = dividend / divisor
}

// Check before normalization
if (vector.norm() > 0) {
  normalized = vector.normalize()
}

// Check before inversion
if (Math.abs(det) > 1e-10) {
  inverted = matrix.inv()
}
```

## 📊 **Error Codes Reference**

| Code | Meaning | Example |
|------|---------|---------|
| `PROXY_ERROR` | Proxy property access failed | `set.invalidMethod()` |
| `DIMENSION_ERROR` | Dimension mismatch | `vector(1,2).cross(vector(3,4))` |
| `MATERIALIZATION_ERROR` | Failed to materialize lazy sequence | `N().toArray()` (infinite) |
| `INFINITE_LOOP` | Operation exceeded timeout | Generator without termination |
| `UNKNOWN` | Generic PrimaLib error | Wrapped external error |

## 🎯 **Best Practices**

### 1. **Always Handle Errors**

```javascript
try {
  result = operation()
} catch (error) {
  if (error instanceof PrimaError) {
    // Handle PrimaLib error
    handlePrimaError(error)
  } else {
    // Handle other errors
    handleGenericError(error)
  }
}
```

### 2. **Use Appropriate Error Types**

```javascript
// ✅ Good - Specific error type
throw new DimensionError('Vectors must match', v1.dim, v2.dim)

// ❌ Bad - Generic error
throw new Error('Dimension mismatch')
```

### 3. **Provide Context**

```javascript
// ✅ Good - Include context
throw new PrimaError('Operation failed', 'OPERATION_ERROR', {
  input: input,
  step: 'validation'
})

// ❌ Bad - No context
throw new Error('Failed')
```

### 4. **Filter Stack Traces**

PrimaError automatically filters stack traces, but you can customize:

```javascript
const error = new PrimaError('Message', 'CODE', context)
console.error(error.stack)  // Already filtered
```

### 5. **Log Errors Appropriately**

```javascript
const handler = createErrorHandler({
  logErrors: process.env.NODE_ENV === 'development',
  throwErrors: true
})
```

## 🔗 **Integration with Error Tracking**

### Sentry Integration

```javascript
import { createErrorHandler } from 'primalib/errors.mjs'
import * as Sentry from '@sentry/browser'

const handler = createErrorHandler({
  onError: (error, context) => {
    Sentry.captureException(error, {
      extra: context
    })
  }
})
```

### Custom Logging

```javascript
const handler = createErrorHandler({
  onError: (error, context) => {
    // Send to your logging service
    fetch('/api/logs', {
      method: 'POST',
      body: JSON.stringify({
        error: error.message,
        code: error.code,
        context: error.context,
        stack: error.stack
      })
    })
  }
})
```

## 📝 **Summary**

PrimaLib's error handling provides:

- **Clear error messages** with context
- **Filtered stack traces** for easier debugging
- **Specialized error types** for different scenarios
- **Safe wrappers** for error-prone operations
- **Timeout protection** for infinite loops
- **Customizable handlers** for integration

**Key Takeaways**:
- Always check dimensions before operations
- Use `.take()` with infinite sequences
- Validate inputs before processing
- Use safe wrappers for risky operations
- Check error context for debugging information

---

**Errors & Troubleshooting** - *Clear errors, effective debugging, and robust error handling.* 🛡️

