#!/bin/bash
# Revert all imports to relative paths for local development

cd "$(dirname "$0")"

echo "Reverting to relative imports..."

# Core tests
sed -i "s|from 'primalib'|from './primaset.mjs'|g" core/primaset.test.mjs
sed -i "s|from 'primalib';|from './primaset.mjs';\nimport { N, Z, R, primes } from '../num/primanum.mjs';|g" core/primaops.test.mjs
sed -i "s|from 'primalib'|from './primaset.mjs'|g" core/allMath.test.mjs
sed -i "s|from 'primalib'|from '../num/primanum.mjs'|g" core/allMath.test.mjs
sed -i "s|from 'primalib'|from '../stat/primastat.mjs'|g" core/allMath.test.mjs
sed -i "s|from '../stat/primastat.mjs'|from '../stat/primastat.mjs'\nimport { point } from '../geo/primageo.mjs'|g" core/allMath.test.mjs
sed -i "s|from 'primalib'|from './primaset.mjs'|g" core/memoize-performance.test.mjs
sed -i "s|from './primaset.mjs'|from './primaset.mjs'\nimport { primes } from '../num/primanum.mjs'|g" core/memoize-performance.test.mjs
sed -i "s|from 'primalib'|from './point.mjs'|g" core/point.test.mjs
sed -i "s|from 'primalib'|from './space.mjs'|g" core/space.test.mjs
sed -i "s|from './space.mjs'|from './space.mjs'\nimport { point, complex, quaternion, octonion } from './point.mjs'|g" core/space.test.mjs

# dayToDay uses primalib for integration testing - keep as is

# Num tests
sed -i "s|from 'primalib'|from '../core/primaset.mjs'|g" num/primanum.test.mjs
sed -i "s|from '../core/primaset.mjs'|from '../core/primaset.mjs'\nimport { N, Z, R, primes, address } from './primanum.mjs'\nimport { pipe } from '../core/primaset.mjs'\nimport { point } from '../geo/primageo.mjs'|g" num/primanum.test.mjs

# Geo tests
sed -i "s|from 'primalib'|from './primageo.mjs'|g" geo/primageo.test.mjs

# Stat tests
sed -i "s|from 'primalib'|from '../num/primanum.mjs'|g" stat/primastat.test.mjs

# Lin tests
sed -i "s|from 'primalib'|from '../core/primaset.mjs'|g" lin/primalin.test.mjs
sed -i "s|from 'primalib'|from '../geo/primageo.mjs'|g" lin/primalin.test.mjs

# Tree tests
sed -i "s|from 'primalib'|from '../core/primaset.mjs'|g" tree/primatree.test.mjs

# Examples
sed -i "s|from 'primalib'|from '../primalib.mjs'|g" examples/12-triangular_reciprocals_sum.mjs
sed -i "s|from 'primalib'|from '../../num/primanum.mjs'|g" examples/geometric-sieve/12-geometric-sieve-benchmark.mjs
sed -i "s|from '../../num/primanum.mjs'|from '../../num/primanum.mjs'\nimport { operations } from '../../core/primaops.mjs'|g" examples/geometric-sieve/12-geometric-sieve-benchmark.mjs
sed -i "s|from 'primalib'|from '../num/primanum.mjs'|g" examples/10-large-primes-benchmark.mjs
sed -i "s|from '../num/primanum.mjs'|from '../num/primanum.mjs'\nimport { operations } from '../core/primaops.mjs'|g" examples/10-large-primes-benchmark.mjs
sed -i "s|from 'primalib'|from '../core/primaset.mjs'|g" examples/11-large-primes-optimized.mjs
sed -i "s|from '../core/primaset.mjs'|from '../core/primaset.mjs'\nimport { primes, isPrimeGeometric } from '../num/primanum.mjs'\nimport { operations } from '../core/primaops.mjs'|g" examples/11-large-primes-optimized.mjs

echo "✅ Reverted to relative imports!"
echo "Run 'npm test' to verify..."

