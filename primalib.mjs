// PrimaLib - Unified namespace export
// Architecture: primaset -> everything else as sets

// 1. Foundation: primaset (core lazy set factory) - THE SHINING STAR ⭐
export * from '@primalib/core'
// 2. Number generators: primanum (uses primaset, geo)
export * from '@primalib/num'
// 3. Geometry: primageo (uses primaset)
export * from '@primalib/geo'
// 4. Statistics: primastat (uses primaset)
export * from '@primalib/stat'
// 5. Topology: primatopo (uses primaset, primageo)
export * from '@primalib/topo'
// 6. Linear algebra: primalin (uses primaset, primageo)
export * from '@primalib/lin'
// 7. Tree handling: primatree (uses primaset) - foundation for Virtual DOM
export * from '@primalib/tree'
// Note: Web module (@primalib/web) is optional and mainly for dev/tests
// Import separately: import { PrimaWeb } from '@primalib/web'
