// System-wide error handling for PrimaLib

// Filter stack traces to remove clutter (like test frameworks do)
const filterStack = (stack) => {
  if (!stack) return ''
  return stack
    .split('\n')
    .filter(line => {
      const trimmed = line.trim()
      return !(
        line.includes('node:') || 
        line.includes('node_modules') ||
        line.includes('/test.mjs') ||
        line.includes('/primalib.test.mjs') ||
        line.includes('at Object.<anonymous>') ||
        trimmed.startsWith('at ModuleJob.') ||
        trimmed.startsWith('at async ModuleJob.') ||
        trimmed.startsWith('at async onImport') ||
        trimmed.startsWith('at asyncWrap') ||
        trimmed.startsWith('at process.')
      )
    })
    .join('\n')
}

export class PrimaError extends Error {
  constructor(message, code, context = {}) {
    super(message)
    this.name = 'PrimaError'
    this.code = code
    this.context = context
    Error.captureStackTrace?.(this, this.constructor)
    
    // Filter stack trace to remove clutter
    if (this.stack) {
      this.stack = filterStack(this.stack)
    }
  }
  
  // Override stack getter to always return filtered version
  get stack() {
    const raw = Error.prototype.stack || this._rawStack || ''
    return filterStack(raw)
  }
  
  set stack(value) {
    this._rawStack = value
  }
}

export class ProxyError extends PrimaError {
  constructor(message, prop, target, context = {}) {
    super(`Proxy error accessing '${prop}': ${message}`, 'PROXY_ERROR', {
      prop,
      targetType: typeof target,
      ...context
    })
    this.name = 'ProxyError'
  }
}

export class InfiniteLoopError extends PrimaError {
  constructor(message, timeout, context = {}) {
    super(`Infinite loop detected after ${timeout}ms: ${message}`, 'INFINITE_LOOP', {
      timeout,
      ...context
    })
    this.name = 'InfiniteLoopError'
  }
}

export class DimensionError extends PrimaError {
  constructor(message, dimension, expected, context = {}) {
    super(`Dimension error: ${message}`, 'DIMENSION_ERROR', {
      dimension,
      expected,
      ...context
    })
    this.name = 'DimensionError'
  }
}

export class MaterializationError extends PrimaError {
  constructor(message, context = {}) {
    super(`Materialization error: ${message}`, 'MATERIALIZATION_ERROR', context)
    this.name = 'MaterializationError'
  }
}

// Error handler factory
export const createErrorHandler = (options = {}) => {
  const {
    logErrors = false,
    throwErrors = true,
    onError = null
  } = options

  return (error, context = {}) => {
    const enhanced = error instanceof PrimaError 
      ? error 
      : new PrimaError(error.message || String(error), 'UNKNOWN', { original: error, ...context })

    if (logErrors) {
      const filteredStack = filterStack(enhanced.stack || '')
      console.error(`[PrimaLib Error]`, enhanced.message)
      if (filteredStack) {
        console.error(`\x1b[90m${filteredStack}\x1b[0m`)
      }
      if (enhanced.context && Object.keys(enhanced.context).length > 0) {
        console.error('Context:', enhanced.context)
      }
    }

    if (onError) {
      onError(enhanced, context)
    }

    if (throwErrors) {
      throw enhanced
    }

    return enhanced
  }
}

// Default error handler
export const handleError = createErrorHandler({ logErrors: false, throwErrors: true })

// Safe wrapper for operations that might fail
export const safe = (fn, fallback = null, errorHandler = handleError) => {
  return (...args) => {
    try {
      return fn(...args)
    } catch (error) {
      const handled = errorHandler(error, { fn: fn.name, args })
      return fallback !== null ? fallback : handled
    }
  }
}

// Timeout wrapper for infinite loops
export const withTimeout = (fn, timeout = 5000, errorHandler = handleError) => {
  return (...args) => {
    const start = Date.now()
    const check = () => {
      if (Date.now() - start > timeout) {
        throw new InfiniteLoopError(`Operation exceeded ${timeout}ms`, timeout, { fn: fn.name })
      }
    }
    
    // For generators, check timeout periodically
    if (fn.constructor.name === 'GeneratorFunction') {
      return function* () {
        const gen = fn(...args)
        let count = 0
        while (true) {
          check()
          const { value, done } = gen.next()
          if (done) break
          if (++count % 1000 === 0) check() // Check every 1000 iterations
          yield value
        }
      }
    }
    
    return fn(...args)
  }
}

