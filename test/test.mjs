function test(name, fn) { 
  test.tests.push({ name, fn })
  fn._testName = name
  fn._covered = false
}

test.tests = []
test.slowThreshold = 100
test.slowTests = []
test.coverage = { total: 0, covered: 0, functions: [] }

const check = (actual, expect = true) => {
  const materialize = (v) => {
    if (v === undefined) return 'undefined'
    if (typeof v === 'function') v = v()
    if (v?.toArray) v = v.toArray()
    if (typeof v !== 'string') v = JSON.stringify(v) || ''
    return v.replace(/"([a-zA-Z_$][a-zA-Z_$0-9]*)":/g, '$1:').replace(/\s+/g, '')
  }

  const actualStr = materialize(actual)
  const expectStr = materialize(expect)
  const isExpectNumber = !isNaN(expectStr)
  const matches = isExpectNumber ? actualStr.startsWith(expectStr) : actualStr === expectStr

  if (!matches) {
    throw new Error(`Expected ${isExpectNumber ? 'to start with ' : ''}${expectStr}  Got ${actualStr}`)
  }
}

test.run = async function (level = 2, onResult) {
  const prefix = typeof window === 'undefined' ? '\n' : ''
  const loggers = {
    header: () => console.log(`${prefix}=== PrimaLib Tests ===`),
    pass: (name) => level >= 2 && typeof window === 'undefined' ? console.log('✓', name) : null,
    fail: (name, stack) => {
      const msg = typeof window !== 'undefined' ? 
        `✗ ${name}\n${stack.join('\n')}` : 
        `✗ ${name}\n\x1b[90m ${stack.join('\n')}:\x1b[0m`
      console.log(msg)
    }
  }
  
  loggers.header()
  
  let pass = 0, fail = 0
  test.slowTests = []
  test.coverage = { total: test.tests.length, covered: 0, functions: [] }

  // Run tests synchronously (one after another) for accurate timing
  const testResults = []
  for (const { name, fn } of test.tests) {
    const start = performance.now()
    try {
      loggers.pass(name)
      await fn({check, log:level>=2?console.log:()=>{}})
      const duration = performance.now() - start
      
      if (duration > test.slowThreshold) {
        test.slowTests.push({ name, duration: duration.toFixed(2) })
      }
      
      fn._covered = true
      fn._error = null
      test.coverage.covered++
      test.coverage.functions.push({ name, duration: duration.toFixed(2), covered: true })
      
      pass++
      testResults.push({ name, passed: true, duration: duration.toFixed(2) })
    } catch (e) {
      const duration = performance.now() - start
      fn._covered = false
      fn._error = e.message
      test.coverage.functions.push({ name, duration: duration.toFixed(2), covered: false })
      
      fail++
      const stack = e.stack ? e.stack.split('\n').filter(s => !(s.includes('node:') || s.includes('/test.mjs') || s.includes('/primalib.test.mjs'))) : [e.message]
      loggers.fail(name, stack)
      testResults.push({ name, passed: false, error: e.message, duration: duration.toFixed(2) })
    }
  }
  
  console.log(`${prefix}${pass} passed, ${fail} failed`)

  if (test.slowTests.length > 0 && level >= 2) {
    console.log(`${prefix}⚠️  Slow tests (>${test.slowThreshold}ms):`)
    test.slowTests.forEach(({ name, duration }) => {
      console.log(`   ${duration}ms - ${name}`)
    })
  }
  
  const coveragePercent = ((test.coverage.covered / test.coverage.total) * 100).toFixed(1)
  console.log(`${prefix}📊 Coverage: ${test.coverage.covered}/${test.coverage.total} (${coveragePercent}%)`)
  
  if (onResult && typeof onResult === 'function') {
    const results = {
      pass,
      fail,
      tests: testResults,
      slowTests: test.slowTests,
      coverage: {
        total: test.coverage.total,
        covered: test.coverage.covered,
        percent: coveragePercent
      }
    }
    onResult(results)
  }
  
  return fail === 0
}

const dbg = (label, s) => {
  const v = Array.isArray(s) ? JSON.stringify(s) :
            s?.coords ? JSON.stringify(s.coords) : String(s)
  const msg = typeof window !== 'undefined' ? 
    `DBG ${label}:` : 
    `\x1b[90mDBG ${label}:\x1b[0m`
  console.log(msg, v)
}

const globalObj = typeof global !== 'undefined' ? global :
                  typeof window !== 'undefined' ? window :
                  typeof self !== 'undefined' ? self : null
if (globalObj) globalObj.dbg = dbg

export { test, check, dbg }
