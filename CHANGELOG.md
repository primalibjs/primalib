# Changelog

All notable changes to PrimaLib will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2025-11-18

### Added
- **Unified Point Architecture**: Point → Complex → Quaternion → Octonion hierarchy
- **Unified Space API**: `space()` with automatic algebraic detection (2D, 4D, 8D)
- Coordinate aliases (x, y, z, t) for points
- Numeric indexing and destructuring for points/vectors
- `distance()` method on points
- Collection handling for point operations
- Comprehensive test suite (302 tests, 100% passing)

### Changed
- Point implementation moved to `core/point.mjs` (unified architecture)
- Space implementation moved to `core/space.mjs` (replaces algebraicSpace)
- `hypercube` now a legacy alias to `space` (backward compatible)
- Geometry module (`geo/primageo.mjs`) imports from core
- Improved point performance in tight loops

### Fixed
- Point/complex/quaternion/octonion inheritance chain
- Space algebraic/geometric distinction
- Import paths across all modules
- Documentation consistency

## [0.2.0] - 2025-11-01

### Added
- Time monitoring for tests - reports tests taking >10ms
- Code coverage tracking using test function as databag
- `isPrime` function in operations (uses `firstDivisor` internally)
- Test suite reorganization - all tests moved to `tests/` directory
- Comprehensive test coverage (210 tests, 100% coverage)

### Fixed
- Fixed import paths after code reorganization
- Fixed circular dependency issues with `primaops.mjs`
- Fixed hanging tests by using `.take()` instead of `[...primes].slice()`
- Fixed pipe function being overwritten by plugin system
- Fixed variadic functions in pipe to use method calls correctly

### Changed
- Standardized on `primaops.mjs` (removed v2, v3, v4 versions)
- Updated all imports to use consistent paths
- Improved test runner with performance monitoring

### Performance
- All tests passing with 1 slow test (>10ms): "FINAL BOSS: All Math ops in one pipeline" (15.41ms)

## [0.1.0] - Initial Release

### Added
- Core lazy set functionality (`primaSet`)
- Number theory operations (primes, CRT, Goldbach)
- Geometry operations (points, hypercubes, hyperplanes)
- Statistical functions
- Plugin system for extensibility
- TypeScript definitions
- Comprehensive error handling

