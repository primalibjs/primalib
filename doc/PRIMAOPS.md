# PrimaOps - Extended Operations & Methods

> **"The Swiss Army knife of PrimaSet - operations, methods, and generators for lazy computation."**

PrimaOps extends PrimaSet with a comprehensive suite of operations, methods, and generators. It provides algebraic operations, statistical functions, number theory utilities, and powerful control flow patterns for lazy evaluation.

## 🎯 **Architecture**

- **Operations**: Pure functions for mathematical operations (algebraic, statistical, number theory)
- **Methods**: Core lazy operations (`map`, `reduce`, `take`, `filter`, etc.)
- **Generators**: Extended lazy generators (`skip`, `zip`, `chunk`, `window`, `flatten`, etc.)
- **Control Flow**: `iif`, `when`, `unless`, `route` for conditional processing

## 🔢 **Operations**

Operations are pure functions that can be used directly or composed with PrimaSet methods.

### Algebraic Operations (Unary)

```javascript
import { operations } from 'primalib'

operations.sq(5)      // → 25 (square)
operations.inv(4)     // → 0.25 (inverse: 1/x)
operations.neg(7)     // → -7 (negate)
```

### Algebraic Operations (Binary)

```javascript
operations.add(3, 4)  // → 7
operations.sub(10, 3)  // → 7
operations.mul(3, 4)   // → 12
operations.div(12, 3)  // → 4
operations.mod(10, 3)   // → 1 (Euclidean modulo)
operations.scale(5, 2) // → 10 (scalar multiply)
operations.shift(5, 3) // → 8 (scalar add)
```

### Statistical Operations (Variadic)

```javascript
operations.mean(1, 2, 3, 4)  // → 2.5
operations.sum(1, 2, 3, 4)    // → 10
operations.min(5, 2, 8, 1)    // → 1
operations.max(5, 2, 8, 1)    // → 8
```

### Utility Operations

```javascript
operations.clamp(15, 0, 10)  // → 10 (clamp to range)
operations.sigmoid(0)        // → 0.5 (sigmoid function)
```

### Advanced Math

```javascript
operations.factorial(5)  // → 120
operations.factorial(170) // → Maximum safe value
operations.factorial(171) // → Error: factorial overflow
```

### Number Theory

```javascript
operations.gcd(48, 18)        // → 6 (greatest common divisor)
operations.lcm(4, 6)           // → 12 (least common multiple)
operations.firstDivisor(77)    // → 7 (smallest prime divisor)
operations.isPrime(17)          // → true (primality test)
```

## 📋 **Core Methods**

Methods are available on all PrimaSet instances for lazy operations.

### Basic Operations

```javascript
import { primaSet } from 'primalib'

const ps = primaSet([1, 2, 3, 4, 5])

// Map: transform each element
ps.map(x => x * 2)  // → [2, 4, 6, 8, 10]

// Reduce: fold operation
ps.reduce((acc, x) => acc + x, 0)  // → 15

// Take: take first n elements (lazy)
ps.take(3)  // → [1, 2, 3]

// Take range: take elements from start to stop
ps.takeRange(1, 3)  // → [2, 3, 4]
```

### Materialization & Conversion

```javascript
ps.toArray()     // → [1, 2, 3, 4, 5] (materialize)
ps.valueOf()     // → [1, 2, 3, 4, 5] (or single value if length === 1)
ps.toString()    // → "1,2,3,4,5"
ps.toString(3)   // → "1,2,3" (limit to 3 elements)
ps.clearCache()  // → clears internal cache
```

### Side Effects & Iteration

```javascript
// On: side effect with pass-through
ps.on(x => console.log(x))  // logs each element, yields same values

// ForEach: iterate with side effect
ps.forEach(x => console.log(x))  // logs each element

// Debug: convenient debugging
ps.debug('test')  // → logs "[debug test] 1", "[debug test] 2", ...
```

### Random Access

```javascript
ps.get(0)  // → 1 (first element)
ps.get(2)  // → 3 (third element)
ps.get(10) // → undefined (out of bounds)
```

### Piping

```javascript
// Pipe: compose functions
ps.pipe(
  s => s.map(x => x * 2),
  s => s.filter(x => x > 5),
  s => s.take(2)
)  // → [6, 8]
```

## 🔄 **Extended Generators**

Generators provide lazy transformations and combinations.

### Filtering & Skipping

```javascript
// Filter: lazy filtering
ps.filter(x => x % 2 === 0)  // → [2, 4]

// Skip: skip first n elements
ps.skip(2)  // → [3, 4, 5]
```

### Combining Sets

```javascript
const ps1 = primaSet([1, 2, 3])
const ps2 = primaSet([4, 5, 6])

// Zip: pair elements
ps1.zip(ps2)  // → [[1, 4], [2, 5], [3, 6]]
ps1.zip(ps2, (a, b) => a + b)  // → [5, 7, 9]

// Concat: concatenate sets
ps1.concat(ps2)  // → [1, 2, 3, 4, 5, 6]

// Mix: combine sets (bag of sets)
ps1.mix(ps2)  // → [1, 2, 3, 4, 5, 6]
```

### Chunking & Windowing

```javascript
// Chunk: split into chunks
ps.chunk(2)  // → [[1, 2], [3, 4], [5]]

// Window: sliding window
ps.window(3)  // → [[1, 2, 3], [2, 3, 4], [3, 4, 5]]
```

### Flattening & Uniqueness

```javascript
const nested = primaSet([[1, 2], [3, [4, 5]]])

// Flatten: flatten nested structures
nested.flatten()  // → [1, 2, 3, 4, 5]

// Unique: remove duplicates
primaSet([1, 2, 2, 3, 3, 3]).unique()  // → [1, 2, 3]
```

### Sorting

```javascript
const unsorted = primaSet([3, 1, 4, 1, 5])

// Sort: sort numerically
unsorted.sort()  // → [1, 1, 3, 4, 5]

// SortBy: sort by function
primaSet([{a: 3}, {a: 1}, {a: 2}]).sortBy(x => x.a)  // → [{a: 1}, {a: 2}, {a: 3}]
```

### Cycling & Utilities

```javascript
// Cycle: infinite cycle
ps.take(3).cycle().take(9)  // → [1, 2, 3, 1, 2, 3, 1, 2, 3]

// First: get first element
ps.first()  // → 1

// IsEmpty: check if empty
primaSet([]).isEmpty()  // → true
ps.isEmpty()            // → false

// Count: count elements
ps.count()  // → 5
```

### Grouping & Sampling

```javascript
// GroupBy: group by function
primaSet([1, 2, 3, 4, 5]).groupBy(x => x % 2)
// → Map { 1 => [1, 3, 5], 0 => [2, 4] }

// ToMap: convert to Map
primaSet([1, 2, 3]).toMap(x => x, x => x * 2)
// → Map { 1 => 2, 2 => 4, 3 => 6 }

// Sample: random sample
ps.sample(3)  // → random 3 elements
```

### Simplification

```javascript
// Shrink: reduce to simpler type
primaSet([[1]]).shrink()  // → 1 (unwrap nested arrays)
primaSet([BigInt(42)]).shrink()  // → 42 (BigInt → Number when safe)
primaSet([1, 2]).shrink()  // → [1, 2] (multiple elements)
```

### JSON Serialization

```javascript
ps.toJSON()  // → [1, 2, 3, 4, 5]
```

## 🎛️ **Control Flow**

Control flow functions enable conditional processing and short-circuiting.

### iif (if-then-else)

```javascript
import { iif } from 'primalib'

// Basic if-then-else
const fn = iif(
  x => x > 5,        // predicate
  x => x * 2,        // then
  x => x + 1         // else
)

fn(7)  // → 14 (7 > 5, so 7 * 2)
fn(3)  // → 4 (3 <= 5, so 3 + 1)

// Short-circuit: return undefined to stop iteration
const shortCircuit = iif(
  x => x > 10,
  () => undefined,  // stop iteration
  x => x
)

primaSet([1, 2, 3, 15, 4, 5]).map(shortCircuit)  // → [1, 2, 3] (stops at 15)
```

### when & unless

```javascript
import { when, unless } from 'primalib'

// When: apply function if predicate is true
const doubleIfEven = when(x => x % 2 === 0, x => x * 2)
doubleIfEven(4)  // → 8
doubleIfEven(3)  // → 3 (unchanged)

// Unless: apply function if predicate is false
const doubleIfOdd = unless(x => x % 2 === 0, x => x * 2)
doubleIfOdd(3)  // → 6
doubleIfOdd(4)  // → 4 (unchanged)
```

### route (Pattern Matching)

```javascript
import { route } from 'primalib'

// Route: match first predicate, apply function
const router = route({
  [x => x < 0]: x => `negative: ${x}`,
  [x => x === 0]: x => 'zero',
  [x => x > 0]: x => `positive: ${x}`
})

router(-5)  // → "negative: -5"
router(0)   // → "zero"
router(5)   // → "positive: 5"

// Route with literal values
const typeRouter = route({
  'number': x => x * 2,
  'string': x => x.toUpperCase(),
  'default': x => x
})

typeRouter(5)      // → 10
typeRouter('hello') // → "HELLO"
```

### Short-Circuit (Alias)

```javascript
import { shortCircuit } from 'primalib'

// shortCircuit is an alias for iif
const sc = shortCircuit(x => x > 10, () => undefined)
```

## 🔗 **Integration with PrimaSet**

All operations integrate seamlessly with PrimaSet:

```javascript
import { primaSet, operations } from 'primalib'

// Use operations in map
primaSet([1, 2, 3, 4, 5])
  .map(operations.sq)      // → [1, 4, 9, 16, 25]
  .filter(x => x > 10)     // → [16, 25]
  .reduce(operations.sum)  // → 41

// Use operations in reduce
primaSet([2, 3, 4])
  .reduce(operations.gcd)  // → 1 (gcd of 2, 3, 4)

// Use operations in pipe
primaSet([1, 2, 3, 4, 5])
  .pipe(
    s => s.map(operations.sq),
    s => s.filter(x => x > 10),
    s => s.take(2)
  )  // → [16, 25]
```

## 📋 **Complete API Reference**

### Operations

| Function | Description | Example |
|----------|-------------|---------|
| `operations.sq(x)` | Square | `sq(5)` → `25` |
| `operations.inv(x)` | Inverse (1/x) | `inv(4)` → `0.25` |
| `operations.neg(x)` | Negate | `neg(7)` → `-7` |
| `operations.add(a, b)` | Add | `add(3, 4)` → `7` |
| `operations.sub(a, b)` | Subtract | `sub(10, 3)` → `7` |
| `operations.mul(a, b)` | Multiply | `mul(3, 4)` → `12` |
| `operations.div(a, b)` | Divide | `div(12, 3)` → `4` |
| `operations.mod(a, b)` | Euclidean modulo | `mod(10, 3)` → `1` |
| `operations.scale(a, b)` | Scalar multiply | `scale(5, 2)` → `10` |
| `operations.shift(a, b)` | Scalar add | `shift(5, 3)` → `8` |
| `operations.mean(...args)` | Mean | `mean(1,2,3,4)` → `2.5` |
| `operations.sum(...args)` | Sum | `sum(1,2,3,4)` → `10` |
| `operations.min(...args)` | Minimum | `min(5,2,8,1)` → `1` |
| `operations.max(...args)` | Maximum | `max(5,2,8,1)` → `8` |
| `operations.clamp(v, min, max)` | Clamp to range | `clamp(15,0,10)` → `10` |
| `operations.sigmoid(x)` | Sigmoid function | `sigmoid(0)` → `0.5` |
| `operations.factorial(n)` | Factorial | `factorial(5)` → `120` |
| `operations.gcd(a, b)` | Greatest common divisor | `gcd(48,18)` → `6` |
| `operations.lcm(a, b)` | Least common multiple | `lcm(4,6)` → `12` |
| `operations.firstDivisor(n)` | Smallest prime divisor | `firstDivisor(77)` → `7` |
| `operations.isPrime(n)` | Primality test | `isPrime(17)` → `true` |

### Methods

| Method | Description | Example |
|--------|-------------|---------|
| `ps.map(f)` | Transform each element | `ps.map(x => x*2)` |
| `ps.reduce(f, init)` | Fold operation | `ps.reduce((a,b)=>a+b, 0)` |
| `ps.take(n)` | Take first n | `ps.take(3)` |
| `ps.takeRange(start, stop)` | Take range | `ps.takeRange(1,3)` |
| `ps.toArray()` | Materialize to array | `ps.toArray()` |
| `ps.valueOf()` | Get value(s) | `ps.valueOf()` |
| `ps.toString(maxlen)` | String representation | `ps.toString(3)` |
| `ps.clearCache()` | Clear cache | `ps.clearCache()` |
| `ps.on(f)` | Side effect | `ps.on(console.log)` |
| `ps.forEach(f)` | Iterate | `ps.forEach(console.log)` |
| `ps.get(index)` | Get element at index | `ps.get(0)` |
| `ps.pipe(...fns)` | Compose functions | `ps.pipe(f1, f2, f3)` |

### Generators

| Generator | Description | Example |
|-----------|-------------|---------|
| `ps.filter(p)` | Filter elements | `ps.filter(x=>x>5)` |
| `ps.skip(n)` | Skip first n | `ps.skip(2)` |
| `ps.zip(other, f)` | Pair elements | `ps1.zip(ps2)` |
| `ps.concat(...others)` | Concatenate | `ps1.concat(ps2)` |
| `ps.mix(...others)` | Combine sets | `ps1.mix(ps2)` |
| `ps.chunk(size)` | Split into chunks | `ps.chunk(2)` |
| `ps.window(size)` | Sliding window | `ps.window(3)` |
| `ps.flatten()` | Flatten nested | `ps.flatten()` |
| `ps.unique()` | Remove duplicates | `ps.unique()` |
| `ps.sort()` | Sort numerically | `ps.sort()` |
| `ps.sortBy(f)` | Sort by function | `ps.sortBy(x=>x.a)` |
| `ps.cycle()` | Infinite cycle | `ps.cycle()` |
| `ps.first()` | Get first element | `ps.first()` |
| `ps.isEmpty()` | Check if empty | `ps.isEmpty()` |
| `ps.groupBy(f)` | Group by function | `ps.groupBy(x=>x%2)` |
| `ps.toMap(keyFn, valFn)` | Convert to Map | `ps.toMap(x=>x, x=>x*2)` |
| `ps.sample(n)` | Random sample | `ps.sample(3)` |
| `ps.count()` | Count elements | `ps.count()` |
| `ps.shrink()` | Simplify type | `ps.shrink()` |
| `ps.toJSON()` | JSON serialization | `ps.toJSON()` |
| `ps.debug(label)` | Debug logging | `ps.debug('test')` |

### Control Flow

| Function | Description | Example |
|----------|-------------|---------|
| `iif(pred, then, else_)` | If-then-else | `iif(x=>x>5, x=>x*2, x=>x+1)` |
| `when(pred, fn)` | Apply if true | `when(x=>x%2===0, x=>x*2)` |
| `unless(pred, fn)` | Apply if false | `unless(x=>x%2===0, x=>x*2)` |
| `route(routes)` | Pattern matching | `route({[x=>x<0]: x=>'neg'})` |
| `shortCircuit(...)` | Alias for iif | `shortCircuit(...)` |

## 🎨 **Usage Examples**

### Example 1: Basic Operations

```javascript
import { primaSet, operations } from 'primalib'

const numbers = primaSet([1, 2, 3, 4, 5])

// Square all numbers
numbers.map(operations.sq)  // → [1, 4, 9, 16, 25]

// Sum with reduce
numbers.reduce(operations.sum, 0)  // → 15

// Find GCD
primaSet([48, 18, 12]).reduce(operations.gcd)  // → 6
```

### Example 2: Filtering & Transformation

```javascript
import { primaSet } from 'primalib'

const numbers = primaSet([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])

// Filter evens, square, take first 3
numbers
  .filter(x => x % 2 === 0)
  .map(x => x * x)
  .take(3)  // → [4, 16, 36]
```

### Example 3: Chunking & Windowing

```javascript
import { primaSet } from 'primalib'

const data = primaSet([1, 2, 3, 4, 5, 6, 7, 8])

// Chunk into pairs
data.chunk(2)  // → [[1, 2], [3, 4], [5, 6], [7, 8]]

// Sliding window of size 3
data.window(3)  // → [[1, 2, 3], [2, 3, 4], [3, 4, 5], ...]
```

### Example 4: Control Flow

```javascript
import { primaSet, iif, route } from 'primalib'

const numbers = primaSet([1, 2, 3, 15, 4, 5])

// Short-circuit when value > 10
const process = iif(
  x => x > 10,
  () => undefined,  // stop iteration
  x => x * 2
)

numbers.map(process)  // → [2, 4, 6] (stops at 15)

// Route based on value
const router = route({
  [x => x < 5]: x => `small: ${x}`,
  [x => x < 10]: x => `medium: ${x}`,
  [x => x >= 10]: x => `large: ${x}`
})

numbers.map(router)  // → ["small: 1", "small: 2", ...]
```

### Example 5: Grouping & Aggregation

```javascript
import { primaSet, operations } from 'primalib'

const numbers = primaSet([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])

// Group by parity
const groups = numbers.groupBy(x => x % 2)
// → Map { 1 => [1, 3, 5, 7, 9], 0 => [2, 4, 6, 8, 10] }

// Sum each group
for (const [key, values] of groups) {
  const sum = values.reduce(operations.sum, 0)
  console.log(`${key}: ${sum}`)
}
// → 1: 25, 0: 30
```

### Example 6: Piping

```javascript
import { primaSet, operations } from 'primalib'

const result = primaSet([1, 2, 3, 4, 5])
  .pipe(
    s => s.map(operations.sq),      // square
    s => s.filter(x => x > 10),      // filter
    s => s.map(operations.inv),     // inverse
    s => s.reduce(operations.sum, 0) // sum
  )

// → 1/16 + 1/25 = 0.1025
```

## ⚡ **Performance Notes**

- **Lazy Evaluation**: Most operations are lazy and only compute when needed
- **Caching**: Use `clearCache()` to free memory when done with large sequences
- **Short-Circuit**: Use `iif` with `undefined` return to stop iteration early
- **Materialization**: `toArray()` materializes the entire sequence - use carefully with infinite sequences

## 🔗 **Integration**

PrimaOps integrates seamlessly with other PrimaLib modules:

```javascript
import { primaSet, operations, N, primes } from 'primalib'

// Use with number sequences
N(10).map(operations.sq)  // → squares of 1..10

// Use with primes
primes.take(10).map(operations.sq)  // → squares of first 10 primes

// Compose operations
primes
  .take(100)
  .filter(operations.isPrime)
  .map(operations.sq)
  .reduce(operations.sum, 0)
```

## 🔗 **See Also**

- **[PRIMASET.md](../core/PRIMASET.md)** - Core lazy set factory (foundation)
- **[PRIMANUM.md](../num/PRIMANUM.md)** - Number theory operations
- **[PRIMASTAT.md](../stat/PRIMASTAT.md)** - Statistical functions
- **[PRIMALIB.md](./PRIMALIB.md)** - Complete documentation overview
- **[QUICKREF.md](./QUICKREF.md)** - Quick reference guide

---

**PrimaOps** provides the essential toolkit for lazy computation, enabling powerful data transformations with minimal overhead. 🎯

