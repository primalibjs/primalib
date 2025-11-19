# Changelog

All notable changes to PrimaLib will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2025-11-19

### Added
- **Unified Point Architecture**: Point → Complex → Quaternion → Octonion hierarchy
- **Unified Space API**: `space()` with automatic algebraic detection (2D, 4D, 8D)
- Coordinate aliases (x, y, z, t) for points
- Numeric indexing and destructuring for points/vectors
- `distance()` method on points
- Collection handling for point operations
- Time monitoring for tests - reports tests taking >10ms
- Code coverage tracking using test function as databag
- `isPrime` function in operations (uses `firstDivisor` internally)
- Comprehensive test suite (302 tests, 100% passing)

### Changed
- Point implementation moved to `core/point.mjs` (unified architecture)
- Space implementation moved to `core/space.mjs`
- Geometry module (`geo/primageo.mjs`) imports from core
- All modules now import constructs from correct sources (core vs geo)
- Improved point performance in tight loops
- Standardized on `primaops.mjs` (removed v2, v3, v4 versions)
- Updated all imports to use consistent paths
- Improved test runner with performance monitoring

### Fixed
- Import inconsistencies: `primanum`, `primalin`, and `primatopo` now import from `@primalib/core`
- Package.json dependencies: removed unnecessary `@primalib/geo` dependencies
- Documentation: corrected `sqrt` references, added missing operations
- Point/complex/quaternion/octonion inheritance chain
- Space algebraic/geometric distinction
- Circular dependency issues with `primaops.mjs`
- Hanging tests by using `.take()` instead of `[...primes].slice()`
- Pipe function being overwritten by plugin system
- Variadic functions in pipe to use method calls correctly
- All examples now import from single source

### Performance
- All tests passing with optimal performance (302/302)

## [0.1.0] - Initial Release

### Added
- Core lazy set functionality (`primaSet`)
- Number theory operations (primes, CRT, Goldbach)
- Geometry operations (points, spaces, planes)
- Statistical functions
- Plugin system for extensibility
- TypeScript definitions
- Comprehensive error handling
