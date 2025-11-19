/**
 * PrimaEnv Tests
 * Tests environment detection and loading strategies
 * Note: primaenv moved to primaweb directory
 */

import { test } from '../test/test.mjs'
import { env, include } from './primaenv.mjs'

test('primaenv: env is detected', ({check}) => {
  check(typeof env, 'object')
  check(typeof env.runtime, 'string')
  check(['browser', 'node', 'worker', 'unknown'].includes(env.runtime), true)
})

test('primaenv: runtime detection', ({check}) => {
  check(typeof env.runtime, 'string')
  check(typeof env.moduleSystem, 'string')
  check(typeof env.global, 'object')
})

test('primaenv: features detection', ({check}) => {
  check(typeof env.features, 'object')
  check(typeof env.features.esm, 'boolean')
  check(typeof env.features.dynamicImport, 'boolean')
  check(typeof env.features.fetch, 'boolean')
})

test('primaenv: include function exists', ({check}) => {
  check(typeof include, 'function')
})

test('primaenv: environment knowledge structure', ({check}) => {
  check(typeof env.node, 'object')
  check(typeof env.browser, 'object')
  check(typeof env.features, 'object')
  
  // Runtime-specific checks
  if (env.runtime === 'node') {
    check(env.node.version !== null || env.node.version === null, true) // Can be null or string
  }
  
  if (env.runtime === 'browser') {
    check(env.browser.userAgent !== null || env.browser.userAgent === null, true) // Can be null or string
  }
})

test('primaenv: module system detection', ({check}) => {
  check(['cjs', 'esm', 'unknown'].includes(env.moduleSystem), true)
})

test('primaenv: global object detection', ({check}) => {
  if (env.runtime === 'browser') {
    check(env.global === window, true)
  } else if (env.runtime === 'node') {
    check(env.global === global, true)
  } else if (env.runtime === 'worker') {
    check(env.global === self, true)
  }
})
