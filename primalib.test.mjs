import { test } from './test/test.mjs';
import './core/primaset.test.mjs'
import './core/primaops.test.mjs'
import './core/dayToDay.test.mjs'
import './core/allMath.test.mjs'
import './core/memoize-performance.test.mjs'
import './num/primanum.test.mjs'
import './geo/primageo.test.mjs'
import './stat/primastat.test.mjs'
import './lin/primalin.test.mjs'
import './topo/primatopo.test.mjs'
import './web/primaenv.test.mjs'
import './web/primaweb.test.mjs'

console.clear()
const ok = await test.run(1)
console.log(ok ? '✅ All green — ready to dig! ⛏️\n' : '❌ Failed — see above\n')

// Browser-compatible: don't exit process in browser
if (typeof process !== 'undefined' && process.exit) {
process.exit(ok ? 0 : 1)
}