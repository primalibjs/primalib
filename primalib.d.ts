// TypeScript definitions for PrimaLib
// Supports TypeScript, Deno, and AssemblyScript planning

// Core types
export type PrimaSet<T = any> = Iterable<T> & {
  [Symbol.iterator](): Iterator<T>
  map<U>(f: (x: T) => U): PrimaSet<U>
  filter(p: (x: T) => boolean): PrimaSet<T>
  take(n: number, options?: { materialize?: boolean }): PrimaSet<T>
  reduce<U>(f: (acc: U, x: T) => U, init: U): U
  on(f: (x: T) => void): PrimaSet<T>  // Transformer: side effect + yield
  sum(): number
  count(): number
  toArray(): T[]
  get(index: number): T | undefined
  [index: number]: T
}

// primaSet factory - returns PrimaSet proxy
export declare function primaSet<T>(src: T | T[] | Iterable<T> | null | undefined, opts?: { memo?: boolean; cache?: boolean; cacheSize?: number; windowSize?: number; onWindow?: (data: any) => void }): PrimaSet<T>

// primaSet constructor (same as factory)
export declare const primaSet: {
  (src: any, opts?: any): PrimaSet<any>
  ops: Record<string, Function>
  plugin(functions: Record<string, Function> | Function): typeof primaSet
  listOps(): string[]
  pipe(...fns: Array<(x: any) => any>): (x: any) => any
}

// Number sequences
export declare function N(last?: number): PrimaSet<number>
export declare function Z(first?: number, last?: number): PrimaSet<number>
export declare function R(start?: number, end?: number, digits?: number): PrimaSet<number>

// Primes
export declare const primes: PrimaSet<number>
export declare function isPrime(n: number): boolean
export declare function firstDivisor(n: number): number

// Address system (CRT)
export declare function address(n: number, dimensions?: number | null): number[]
export declare namespace address {
  function toNumber(rem: number[]): number
  function isResidual(addr: number[]): boolean
}

// Geometry
export interface Point {
  coords: number[]
  dim: number
  add(p: Point): Point
  subtract(p: Point): Point
  scale(f: number): Point
  norm(): number
}

export declare function point(...coords: number[]): Point
export declare function complex(re?: number, im?: number): Point & {
  re: number
  im: number
  mul(other: any): Point
  conj(): Point
  inv(): Point
  exp(): Point
  log(): Point
  pow(n: number): Point
}
export declare function quaternion(w?: number, x?: number, y?: number, z?: number): Point & {
  w: number
  x: number
  y: number
  z: number
  mul(other: any): Point
  conj(): Point
  inv(): Point
  rotate(v: number[] | Point): Point
  toRotationMatrix(): number[][]
}
export declare function octonion(e0?: number, e1?: number, e2?: number, e3?: number, e4?: number, e5?: number, e6?: number, e7?: number): Point & {
  e0: number
  e1: number
  e2: number
  e3: number
  e4: number
  e5: number
  e6: number
  e7: number
  mul(other: any): Point
  conj(): Point
}
export declare function vector(...coords: number[]): Point & {
  dot(w: number[] | Point): number
  cross(w: number[] | Point): Point
  normalize(): Point
  project(onto: number[] | Point): Point
  angle(w: number[] | Point): number
}

// Space - Unified geometric and algebraic space
export interface Space {
  dim: number
  isAlgebraic: boolean
  algebra: 'complex' | 'quaternion' | 'octonion' | null
  vertices(): Point[]
  sample(res?: number): PrimaSet<Point>
  contains(p: Point): boolean
  subdivide(dimIdx: number, parts: number): PrimaSet<Space>
  project(p: Point, normal?: number[]): Point
  distance(p: Point, normal?: number[]): number
  split(): any  // Returns different structures based on dimension
  units(): Point[] | null
  point(...coords: number[]): Point
  vector(...coords: number[]): Point
  toArray(): number[][]
  toThreeMesh(): number[][]
}

export declare function space(corner: number | number[], sides: number | number[]): Space

// Topology
export interface Geometry {
  type?: string
  dim?: number
}

export declare function genus(geometry: Geometry): number
export declare function eulerCharacteristic(geometry: Geometry): number | null
export declare function isOrientable(geometry: Geometry): boolean
export declare function isCompact(geometry: Geometry): boolean
export declare function isConnected(geometry: Geometry): boolean
export declare function isSimplyConnected(geometry: Geometry): boolean

export interface FiberBundle {
  type: 'fiber_bundle'
  base: Geometry
  fiber: Geometry
  projection: (p: Point) => Point
  totalSpace(): PrimaSet<Point>
  section(sectionMap: (b: Point) => Point): PrimaSet<Point>
  lift(path: PrimaSet<Point>): PrimaSet<{ base: Point; fiber: Point }>
}

export declare function fiberBundle(base: Geometry, fiber: Geometry, projection: (p: Point) => Point): FiberBundle
export declare function cartesianProduct(geomA: Geometry, geomB: Geometry): PrimaSet<Point>
export declare function spaceAsFiberBundle(dim: number): FiberBundle
export declare function bettiNumbers(geometry: Geometry): number[] | null
export declare function topologicalInvariants(geometry: Geometry): {
  genus: number
  eulerCharacteristic: number | null
  isOrientable: boolean
  isCompact: boolean
  isConnected: boolean
  isSimplyConnected: boolean
  bettiNumbers: number[] | null
}

// Operations (unary)
export declare function sq<T extends number>(x: T | PrimaSet<T>): T extends number ? number : PrimaSet<number>
export declare function inv(x: number | PrimaSet<number>): number | PrimaSet<number>
export declare function neg(x: number | PrimaSet<number>): number | PrimaSet<number>

// Operations (binary)
export declare function add(a: number | PrimaSet<number>, b: number | PrimaSet<number>): number | PrimaSet<number>
export declare function sub(a: number | PrimaSet<number>, b: number | PrimaSet<number>): number | PrimaSet<number>
export declare function mul(a: number | PrimaSet<number>, b: number | PrimaSet<number>): number | PrimaSet<number>
export declare function div(a: number | PrimaSet<number>, b: number | PrimaSet<number>): number | PrimaSet<number>
export declare function mod(a: number, b: number): number

// Statistical
export declare function sum(...args: number[]): number
export declare function mean(...args: number[]): number
export declare function min(...args: number[]): number
export declare function max(...args: number[]): number

// Utilities
export declare function gcd(a: number, b: number): number
export declare function lcm(a: number, b: number): number
export declare function factorial(n: number): number | bigint
export declare function clamp(v: number, min: number, max: number): number

// Plugin system
export interface PrimaSetConstructor {
  plugin(functions: Record<string, Function> | Function): PrimaSetConstructor
  listOps(): string[]
  ops: Record<string, Function>
}

export declare const primaSet: PrimaSetConstructor & typeof primaSet

// Pipe
export declare function pipe<T>(...fns: Array<(x: any) => any>): (x: T) => any

// Error types
export declare class PrimaError extends Error {
  code: string
  context: Record<string, any>
}

export declare class ProxyError extends PrimaError {
  prop: string
}

export declare class InfiniteLoopError extends PrimaError {
  timeout: number
}

export declare class DimensionError extends PrimaError {
  dimension: number
  expected: number | number[]
}

// Module exports
declare const _default: {
  primaSet: typeof primaSet
  N: typeof N
  Z: typeof Z
  R: typeof R
  primes: typeof primes
  isPrime: typeof isPrime
  firstDivisor: typeof firstDivisor
  address: typeof address
  point: typeof point
  complex: typeof complex
  quaternion: typeof quaternion
  octonion: typeof octonion
  vector: typeof vector
  space: typeof space
  sq: typeof sq
  inv: typeof inv
  neg: typeof neg
  add: typeof add
  sub: typeof sub
  mul: typeof mul
  div: typeof div
  mod: typeof mod
  sum: typeof sum
  mean: typeof mean
  min: typeof min
  max: typeof max
  gcd: typeof gcd
  lcm: typeof lcm
  factorial: typeof factorial
  clamp: typeof clamp
  pipe: typeof pipe
}

export default _default

