/**
 * Complete Benchmark Suite
 * 
 * Runs all benchmark suites and generates a summary report.
 */

import { runSuite } from './benchmark-utils.mjs'

// Import all benchmark suites
import './primaset.perf.mjs'
import './primaset.memo.perf.mjs'
import './primaset.primes.perf.mjs'
import './primalin.perf.mjs'
import './primageo.perf.mjs'
import './primatree.perf.mjs'

console.log('\n' + '='.repeat(60))
console.log('🚀 PrimaLib Complete Benchmark Suite')
console.log('='.repeat(60))
console.log('\nRunning all benchmark suites...')
console.log('(Each suite will run independently)\n')

// Note: Each suite runs independently
// For a coordinated run, we could collect all results here

