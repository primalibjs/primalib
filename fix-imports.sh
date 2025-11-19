#!/bin/bash
# Fix all test and example imports to use npm package notation

cd "$(dirname "$0")"

echo "Fixing test file imports..."

# Core tests
sed -i "s|from './primaset.mjs'|from 'primalib'|g" core/primaset.test.mjs
sed -i "s|from './primaset.mjs'|from 'primalib'|g" core/primaops.test.mjs
sed -i "s|from '../num/primanum.mjs'|from 'primalib'|g" core/primaops.test.mjs
sed -i "s|from './primaset.mjs'|from 'primalib'|g" core/allMath.test.mjs
sed -i "s|from \"../primalib.mjs\"|from 'primalib'|g" core/allMath.test.mjs
sed -i "s|from '../stat/primastat.mjs'|from 'primalib'|g" core/allMath.test.mjs
sed -i "s|from '../geo/primageo.mjs'|from 'primalib'|g" core/allMath.test.mjs
sed -i "s|from './primaset.mjs'|from 'primalib'|g" core/memoize-performance.test.mjs
sed -i "s|from '../num/primanum.mjs'|from 'primalib'|g" core/memoize-performance.test.mjs
sed -i "s|from './point.mjs'|from 'primalib'|g" core/point.test.mjs
sed -i "s|from './space.mjs'|from 'primalib'|g" core/space.test.mjs
sed -i "s|from './point.mjs'|from 'primalib'|g" core/space.test.mjs

# Num tests
sed -i "s|from \"../core/primaset.mjs\"|from 'primalib'|g" num/primanum.test.mjs
sed -i "s|from \"./primanum.mjs\"|from 'primalib'|g" num/primanum.test.mjs
sed -i "s|from \"../geo/primageo.mjs\"|from 'primalib'|g" num/primanum.test.mjs

# Stat tests  
sed -i "s|from '../num/primanum.mjs'|from 'primalib'|g" stat/primastat.test.mjs

# Lin tests
sed -i "s|from '../core/primaset.mjs'|from 'primalib'|g" lin/primalin.test.mjs
sed -i "s|from '../geo/primageo.mjs'|from 'primalib'|g" lin/primalin.test.mjs

# Tree tests
sed -i "s|from '../core/primaset.mjs'|from 'primalib'|g" tree/primatree.test.mjs

# Web tests
sed -i "s|from './primaenv.mjs'|from '@primalib/web'|g" web/primaenv.test.mjs
sed -i "s|from './primaweb.mjs'|from '@primalib/web'|g" web/primaweb.test.mjs

echo "Fixing example file imports..."

# Examples
sed -i "s|from '../primalib.mjs'|from 'primalib'|g" examples/12-triangular_reciprocals_sum.mjs
sed -i "s|from '../../primanum.mjs'|from 'primalib'|g" examples/geometric-sieve/12-geometric-sieve-benchmark.mjs
sed -i "s|from '../../core/primaops.mjs'|from 'primalib'|g" examples/geometric-sieve/12-geometric-sieve-benchmark.mjs
sed -i "s|from '../primanum.mjs'|from 'primalib'|g" examples/10-large-primes-benchmark.mjs
sed -i "s|from '../primaops.mjs'|from 'primalib'|g" examples/10-large-primes-benchmark.mjs
sed -i "s|from '../primaset.mjs'|from 'primalib'|g" examples/11-large-primes-optimized.mjs
sed -i "s|from '../primanum.mjs'|from 'primalib'|g" examples/11-large-primes-optimized.mjs
sed -i "s|from '../primaops.mjs'|from 'primalib'|g" examples/11-large-primes-optimized.mjs

echo "✅ Import fixes complete!"
echo "Run 'npm test' to verify..."

