// PrimaLib - Unified namespace export
// Architecture: primaset -> everything else as sets

// 1. Foundation: primaset (core lazy set factory) - THE SHINING STAR ⭐
export * from './core/primaset.mjs'
// 2. Number generators: primanum (uses primaset, geo)
export * from './num/primanum.mjs'
// 3. Geometry: primageo (uses primaset)
export * from './geo/primageo.mjs'
// 4. Statistics: primastat (uses primaset)
export * from './stat/primastat.mjs'
// 5. Topology: primatopo (uses primaset, primageo)
export * from './topo/primatopo.mjs'
// 6. Linear algebra: primalin (uses primaset, primageo)
export * from './lin/primalin.mjs'
// 7. Tree handling: primatree (uses primaset) - foundation for Virtual DOM
export * from './tree/primatree.mjs'
// Note: Web module (@primalib/web) is optional and mainly for dev/tests
// Import separately: import { PrimaWeb } from './web/primaweb.mjs'
