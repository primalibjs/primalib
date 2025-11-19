# Contributing to PrimaLib

> **"Help make PrimaLib better - guidelines for contributing code, documentation, and examples."**

Thank you for your interest in contributing to PrimaLib! This guide will help you understand our development process and coding standards.

## 🎯 **How to Contribute**

### Types of Contributions

We welcome contributions in many forms:

- **Code**: Bug fixes, new features, performance improvements
- **Documentation**: Improvements, examples, tutorials
- **Tests**: New test cases, edge case coverage
- **Examples**: New examples, improved existing ones
- **Issues**: Bug reports, feature requests, questions

## 🏗️ **Development Setup**

### Prerequisites

- Node.js >= 14.0.0
- npm or yarn
- Git

### Setup

```bash
# Clone the repository
git clone https://github.com/andersoncarli/primal.git
cd primal/primalib

# Install dependencies (if any)
npm install

# Run tests
npm test
```

## 📝 **Code Style**

### Naming Conventions

Follow PrimaLib's naming conventions (see [NAMING_CONVENTIONS.md](./doc/NAMING_CONVENTIONS.md)):

- **Lowercase** = Factory functions: `generator()`, `handler()`, `singleton()`
- **CamelCase** = Classes: `SlidingWindowCache`, `PrimaError`
- **camelCase** = Variables and functions: `myFunction`, `myVariable`
- **UPPERCASE** = Constants: `MAX_SIZE`, `DEFAULT_OPTIONS`

### Code Principles

1. **Transformation Over Type Enforcement**
   ```javascript
   // ✅ Good - Transform
   const num = Number(x) || 0
   
   // ❌ Bad - Enforce type
   if (typeof x !== 'number') throw new Error('Must be number')
   ```

2. **DRY (Don't Repeat Yourself)**
   ```javascript
   // ✅ Good - Reusable
   const double = x => x * 2
   
   // ❌ Bad - Repeated
   const result1 = x1 * 2
   const result2 = x2 * 2
   ```

3. **Short Methods with Single Responsibility**
   ```javascript
   // ✅ Good - Single responsibility
   const normalize = (v) => {
     const n = v.norm()
     if (n === 0) throw new Error('Cannot normalize zero vector')
     return v.scale(1 / n)
   }
   
   // ❌ Bad - Multiple responsibilities
   const normalizeAndValidate = (v) => {
     // validation + normalization + logging + ...
   }
   ```

4. **Prefer One-Liners When Appropriate**
   ```javascript
   // ✅ Good - Clear one-liner (< 120 cols)
   const sq = x => x * x
   
   // ✅ Good - Multi-line for clarity
   const complex = (x, y) => {
     const re = x
     const im = y
     return { re, im, norm: () => Math.sqrt(re*re + im*im) }
   }
   ```

5. **Comments Only for Non-Obvious Code**
   ```javascript
   // ✅ Good - Comment explains why
   // Use 6k±1 pattern for faster prime checking
   if (n % 6 === 1 || n % 6 === 5) { ... }
   
   // ❌ Bad - Comment states the obvious
   // Increment i by 1
   i++
   ```

### File Structure

```javascript
/**
 * Module Name - Brief description
 * Architecture notes if relevant
 */

import { dependencies } from './other-module.mjs'

// ============================================================================
// SECTION NAME
// ============================================================================

// Factory functions
const factory = (param) => {
  // Implementation
}

// Free functions
const freeFunction = (param) => {
  // Implementation
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  factory,
  freeFunction
}
```

## 🧪 **Testing**

### Test Requirements

1. **All new code must have tests**
   - Test happy paths
   - Test edge cases
   - Test error cases

2. **Test Structure**
   ```javascript
   /**
    * Comprehensive tests for ModuleName
    */
   import { test } from './test.mjs'
   import { function1, function2 } from '../module.mjs'
   
   // ============================================================================
   // SECTION
   // ============================================================================
   
   test('🧪 modulename.test.mjs - Overview', check => {
     // First test with emoji identifier
   })
   
   test('Feature: specific functionality', check => {
     // Feature tests
   })
   ```

3. **Running Tests**
   ```bash
   # Run all tests
   npm test
   
   # Run specific test file
   node tests/modulename.test.mjs
   ```

4. **Test Coverage**
   - Aim for 100% coverage of new code
   - Test edge cases (empty arrays, null, undefined, zero, negative)
   - Test error conditions

### Test Patterns

```javascript
// Basic functionality
test('Function: basic operation', check => {
  check(function(input), expected)
})

// Edge cases
test('Function: empty input', check => {
  check(function([]), [])
})

// Error cases
test('Function: invalid input error', check => {
  try {
    function(invalid)
    check(false, true)
  } catch (e) {
    check(e.message.includes('expected'), true)
  }
})
```

## 🔌 **Adding Plugins**

### Plugin Structure

```javascript
primaSet.plugin({
  // Simple operation
  cube: x => x * x * x,
  
  // Lazy generator method (uses this)
  *squares() {
    for (const x of this) {
      yield x * x
    }
  },
  
  // Free function (no this)
  double: x => x * 2
})
```

### Plugin Guidelines

1. **Keep it Simple**: Plugins should be focused and clear
2. **Document**: Add JSDoc comments for complex plugins
3. **Test**: Write tests for your plugin
4. **Consistent**: Follow existing plugin patterns

### Example Plugin

```javascript
// Add to primaops.mjs or create new plugin file
primaSet.plugin({
  /**
   * Cube operation - raises value to third power
   * @param {number} x - Input value
   * @returns {number} x³
   */
  cube: x => x * x * x,
  
  /**
   * Generate squares lazily
   * @yields {number} Square of each element
   */
  *squares() {
    for (const x of this) {
      yield x * x
    }
  }
})
```

## 📚 **Documentation**

### Documentation Requirements

1. **Module Documentation**: Each module should have a `.md` file in `doc/`
2. **Code Comments**: Add comments for non-obvious code
3. **Examples**: Add examples to `examples/` directory
4. **API Documentation**: Document all public functions

### Documentation Structure

```markdown
# Module Name

> **"Brief description"**

## 🎯 Architecture

- Key design decisions
- Dependencies
- Integration points

## 📋 API Reference

### Functions

| Function | Description | Example |
|----------|-------------|---------|
| `function()` | What it does | `function(input)` → `output` |

## 🎯 Use Cases

Examples and patterns
```

## 🐛 **Bug Reports**

### Bug Report Template

```markdown
**Describe the bug**
Clear description of what the bug is.

**To Reproduce**
Steps to reproduce:
1. Code example
2. Expected behavior
3. Actual behavior

**Environment**
- Node.js version
- PrimaLib version
- OS

**Additional context**
Any other relevant information
```

## ✨ **Feature Requests**

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
Clear description of the problem.

**Describe the solution you'd like**
Clear description of what you want.

**Describe alternatives you've considered**
Other solutions you've thought about.

**Additional context**
Examples, use cases, etc.
```

## 🔄 **Pull Request Process**

### Before Submitting

1. **Run Tests**: Ensure all tests pass
   ```bash
   npm test
   ```

2. **Check Code Style**: Follow naming conventions and code principles

3. **Update Documentation**: Add/update relevant documentation

4. **Add Examples**: If applicable, add examples

5. **Update CHANGELOG**: Add entry to CHANGELOG.md

### PR Checklist

- [ ] Tests pass (`npm test`)
- [ ] Code follows style guidelines
- [ ] Documentation updated
- [ ] Examples added (if applicable)
- [ ] CHANGELOG updated
- [ ] No breaking changes (or documented if intentional)

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How was this tested?

## Checklist
- [ ] Tests pass
- [ ] Documentation updated
- [ ] Code follows style guidelines
```

## 🎯 **Code Review Guidelines**

### For Contributors

- Be open to feedback
- Respond to review comments
- Make requested changes promptly
- Ask questions if unclear

### For Reviewers

- Be constructive and respectful
- Explain reasoning for suggestions
- Approve when ready
- Request changes when needed

## 🚫 **What Not to Do**

1. **Don't Break Existing APIs**: Maintain backward compatibility
2. **Don't Add Dependencies**: Keep PrimaLib dependency-free
3. **Don't Silence Errors**: Errors should be clear and helpful
4. **Don't Skip Tests**: All code must be tested
5. **Don't Ignore Style**: Follow naming conventions

## 📊 **Performance Considerations**

### Performance Guidelines

1. **Lazy by Default**: Use lazy evaluation where possible
2. **Avoid Materialization**: Don't materialize unless necessary
3. **Use Caching**: Consider memo/cache options for repeated access
4. **Profile First**: Measure before optimizing

### Performance Testing

```javascript
// Add performance tests for critical paths
test('Performance: large dataset', check => {
  const start = performance.now()
  const result = operation(largeInput)
  const duration = performance.now() - start
  
  check(result, expected)
  // Slow test detection is automatic (>100ms)
})
```

## 🔗 **Module Integration**

### Adding New Modules

1. **Create Module File**: `primalib/newmodule.mjs`
2. **Follow Architecture**: Build on `primaSet`
3. **Export from primalib.mjs**: Add to unified export
4. **Write Tests**: Create `tests/newmodule.test.mjs`
5. **Write Documentation**: Create `doc/NEWMODULE.md`
6. **Add Examples**: Add to `examples/` if applicable

### Module Template

```javascript
/**
 * NewModule - Brief description
 * Architecture: Uses primaset, extends with newmodule features
 */

import { primaSet } from './primaset.mjs'

// ============================================================================
// FACTORY FUNCTIONS
// ============================================================================

const newFactory = (param) => {
  const set = primaSet(param)
  // Add module-specific properties
  set.type = 'newmodule'
  return set
}

// ============================================================================
// FREE FUNCTIONS
// ============================================================================

const newFunction = (param) => {
  // Implementation
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  newFactory,
  newFunction
}
```

## 🎓 **Learning Resources**

### Understanding PrimaLib

1. **Read Documentation**: Start with [PRIMALIB.md](./doc/PRIMALIB.md)
2. **Study Examples**: Explore `examples/` directory
3. **Read Tests**: Tests show how to use the API
4. **Check Naming Conventions**: See [NAMING_CONVENTIONS.md](./doc/NAMING_CONVENTIONS.md)

### Key Concepts

- **PrimaSet**: Core lazy set factory
- **Lazy Evaluation**: Compute only when needed
- **Transformation**: Transform data, don't enforce types
- **Composability**: Operations compose naturally

## 📝 **Commit Guidelines**

### Commit Message Format

```
<subsystem>: <description>

Optional longer explanation
```

### Examples

```
primaset: add sliding window cache option

primanum: fix prime sequence initialization

primageo: optimize space vertex calculation

doc: add PRIMATREE.md documentation
```

### Commit Types

- `primaset`: Core lazy set changes
- `primaops`: Operations changes
- `primanum`: Number theory changes
- `primageo`: Geometry changes
- `primastat`: Statistics changes
- `primatopo`: Topology changes
- `primalin`: Linear algebra changes
- `primatree`: Tree handling changes
- `primaweb`: Web pipeline changes
- `prima3d`: Three.js visualizer changes
- `test`: Test changes
- `doc`: Documentation changes
- `build`: Build system changes
- `fix`: Bug fixes
- `feat`: New features

## 🎯 **Priority Areas**

### High Priority Contributions

1. **Performance Improvements**: Optimize critical paths
2. **Test Coverage**: Add tests for untested code
3. **Documentation**: Improve clarity and examples
4. **Error Handling**: Better error messages and handling
5. **TypeScript**: Improve type definitions

### Medium Priority

1. **New Examples**: More use case examples
2. **Plugin Ideas**: Useful plugins for common tasks
3. **Integration Examples**: Framework integrations
4. **Performance Benchmarks**: Benchmark suite

## 🤝 **Getting Help**

### Questions?

- **GitHub Issues**: Open an issue for questions
- **Documentation**: Check [PRIMALIB.md](./doc/PRIMALIB.md)
- **Examples**: See `examples/` directory
- **Tests**: Study test files for usage patterns

### Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Celebrate contributions

## 📋 **Summary**

### Quick Checklist

Before submitting:

- [ ] Code follows style guidelines
- [ ] All tests pass
- [ ] Documentation updated
- [ ] Examples added (if applicable)
- [ ] CHANGELOG updated
- [ ] No breaking changes (or documented)

### Key Principles

1. **Transformation over type enforcement**
2. **DRY (Don't Repeat Yourself)**
3. **Short methods with single responsibility**
4. **Comments only for non-obvious code**
5. **Lazy by default**

---

**Contributing** - *Help make PrimaLib better. Every contribution matters.* 🤝

Thank you for contributing to PrimaLib! 🎉

