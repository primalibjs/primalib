/**
 * Comprehensive tests for PrimaTree - Tree handling with Virtual DOM foundation
 */
import { test } from '../test/test.mjs'
import { primaSet } from '../core/primaset.mjs'
import {
  node, tree, treeFromArray, treeFromObject, vdom,
  findNode, walkTree, leaves, descendants, ancestors, siblings
} from './primatree.mjs'

// ============================================================================
// NODE CREATION
// ============================================================================

test('🧪 primatree.test.mjs - Node creation', {check} => {
  const n = node(42)
  check(n.type, 'node')
  check(n._isTree, true)
  check(n._treeValue, 42)
  check(n.parent, null)
  check(n.key, null)
})

test('Node: with parent and key', {check} => {
  const root = node('root')
  const child = node('child', { parent: root, key: 'child1' })
  
  check(child.parent, root)
  check(child.key, 'child1')
  check(child.type, 'node')
})

test('Node: root detection', {check} => {
  const root = node('root')
  const child = node('child', { parent: root, key: 'c' })
  
  check(root.isRoot(), true)
  check(child.isRoot(), false)
})

test('Node: leaf detection', {check} => {
  const root = node({ a: 1, b: 2 })
  const child = node(42)
  
  check(root.isLeaf(), false)  // Has children (a, b)
  check(child.isLeaf(), true)  // No children
})

test('Node: depth calculation', {check} => {
  const root = node('root')
  const child1 = node('c1', { parent: root, key: 'c1' })
  const child2 = node('c2', { parent: child1, key: 'c2' })
  
  check(root.depth(), 0)
  check(child1.depth(), 1)
  check(child2.depth(), 2)
})

// ============================================================================
// ADDRESS SYSTEM
// ============================================================================

test('Node: address (dot notation)', {check} => {
  const root = node('root')
  const child = node('child', { parent: root, key: 'child1' })
  const grandchild = node('grand', { parent: child, key: 'grand1' })
  
  check(root.address(), 'root')
  check(child.address(), 'child1')
  check(grandchild.address(), 'child1.grand1')
})

test('Node: address (slash notation)', {check} => {
  const root = node('root')
  const child = node('child', { parent: root, key: 'child1' })
  const grandchild = node('grand', { parent: child, key: 'grand1' })
  
  check(grandchild.address('/'), 'child1/grand1')
})

test('Node: path array', {check} => {
  const root = node('root')
  const child = node('child', { parent: root, key: 'child1' })
  const grandchild = node('grand', { parent: child, key: 'grand1' })
  
  check(root.path(), [])
  check(child.path(), ['child1'])
  check(grandchild.path(), ['child1', 'grand1'])
})

test('Node: address with numeric keys', {check} => {
  const root = node([1, 2, 3])
  const child = node(42, { parent: root, key: 0 })
  const child2 = node(43, { parent: root, key: 1 })
  
  check(child.address(), '0')
  check(child2.address(), '1')
})

// ============================================================================
// CHILDREN DETECTION
// ============================================================================

test('Node: children from array', {check} => {
  const n = node([1, 2, 3])
  const children = [...n.children()]
  
  check(children.length, 3)
  check(children[0]._treeValue, 1)
  check(children[0].key, 0)
  check(children[1]._treeValue, 2)
  check(children[1].key, 1)
  check(children[2]._treeValue, 3)
  check(children[2].key, 2)
})

test('Node: children from object', {check} => {
  const n = node({ a: 1, b: 2, c: 3 })
  const children = [...n.children()]
  
  check(children.length, 3)
  const childMap = new Map(children.map(c => [c.key, c._treeValue]))
  check(childMap.get('a'), 1)
  check(childMap.get('b'), 2)
  check(childMap.get('c'), 3)
})

test('Node: children from Virtual DOM structure', {check} => {
  const vnode = {
    tag: 'div',
    props: { id: 'app' },
    children: [
      { tag: 'h1', props: {}, children: ['Hello'] },
      { tag: 'p', props: {}, children: ['World'] }
    ]
  }
  const n = node(vnode)
  const children = [...n.children()]
  
  check(children.length, 2)
  check(children[0]._treeValue.tag, 'h1')
  check(children[1]._treeValue.tag, 'p')
})

test('Node: no children (leaf)', {check} => {
  const n = node(42)
  const children = [...n.children()]
  
  check(children.length, 0)
  check(n.isLeaf(), true)
})

// ============================================================================
// WALK TRAVERSAL
// ============================================================================

test('Node: walk (depth-first)', {check} => {
  const root = node({
    a: 1,
    b: {
      c: 2,
      d: 3
    }
  })
  
  const walked = [...root.walk('depth')]
  check(walked.length, 5)  // root + a + b + c + d
  check(walked[0], root)
})

test('Node: walk (breadth-first)', {check} => {
  const root = node({
    a: 1,
    b: {
      c: 2,
      d: 3
    }
  })
  
  const walked = [...root.walk('breadth')]
  check(walked.length, 5)
  // Breadth-first: root, then a and b, then c and d
  check(walked[0], root)
})

test('Node: walk (leaves only)', {check} => {
  const root = node({
    a: 1,
    b: {
      c: 2,
      d: 3
    }
  })
  
  const leaves = [...root.walk('leaves')]
  check(leaves.length, 3)  // a, c, d (all leaves, excluding root and b)
  check(leaves.every(l => l.isLeaf()), true)
  check(leaves.map(l => l.key).sort(), ['a', 'c', 'd'])
})

test('Node: walk integration with PrimaSet', {check} => {
  const root = node([1, 2, 3])
  const walked = primaSet(root.walk())
    .map(n => n._treeValue)
    .filter(v => typeof v === 'number')
    .toArray()
  
  check(walked, [1, 2, 3])
})

// ============================================================================
// FIND OPERATIONS
// ============================================================================

test('Node: find by address string', {check} => {
  const root = node({
    a: {
      b: 1,
      c: 2
    },
    d: 3
  })
  
  const found = root.find('a.b')
  check(found !== null, true)
  check(found._treeValue, 1)
  check(found.key, 'b')
})

test('Node: find by path array', {check} => {
  const root = node({
    a: {
      b: 1
    }
  })
  
  const found = root.find(['a', 'b'])
  check(found !== null, true)
  check(found._treeValue, 1)
})

test('Node: find with slash notation', {check} => {
  const root = node({
    a: {
      b: 1
    }
  })
  
  const found = root.find('a/b')
  check(found !== null, true)
  check(found._treeValue, 1)
})

test('Node: find non-existent', {check} => {
  const root = node({ a: 1 })
  const found = root.find('b.c')
  
  check(found, null)
})

// ============================================================================
// RELATIONSHIP OPERATIONS
// ============================================================================

test('Node: descendants', {check} => {
  const root = node({
    a: 1,
    b: {
      c: 2
    }
  })
  
  const desc = [...root.descendants()]
  check(desc.length, 3)  // a, b, c (all descendants)
  check(desc.map(d => d.key).sort(), ['a', 'b', 'c'])
})

test('Node: ancestors', {check} => {
  const root = node({ a: { b: { c: 1 } } })
  const c = root.find('a.b.c')
  
  const anc = [...c.ancestors()]
  check(anc.length, 2)  // b, a (not including root or self)
  // Order: b (parent), then a (parent of b)
  const keys = anc.map(a => a.key)
  check(keys.includes('b'), true)
  check(keys.includes('a'), true)
})

test('Node: root access', {check} => {
  const root = node({ a: { b: { c: 1 } } })
  const c = root.find('a.b.c')
  
  check(c.root(), root)
})

test('Node: siblings', {check} => {
  const root = node([1, 2, 3])
  const children = [...root.children()]
  const middle = children[1]  // value 2, index 1
  
  const sibs = [...middle.siblings()]
  check(sibs.length, 2)  // 1 and 3 (not self)
  const values = sibs.map(s => s._treeValue).sort()
  check(values, [1, 3])
})

// ============================================================================
// TREE BUILDERS
// ============================================================================

test('Tree: tree() convenience function', {check} => {
  const t = tree({ a: 1, b: 2 })
  check(t.type, 'node')
  check(t._isTree, true)
})

test('Tree: treeFromArray()', {check} => {
  const t = treeFromArray([1, 2, 3])
  const children = [...t.children()]
  
  check(children.length, 3)
  check(children[0].key, 0)
  check(children[1].key, 1)
  check(children[2].key, 2)
})

test('Tree: treeFromObject()', {check} => {
  const t = treeFromObject({ a: 1, b: 2 })
  const children = [...t.children()]
  
  check(children.length, 2)
  const keys = children.map(c => c.key).sort()
  check(keys, ['a', 'b'])
})

test('Tree: vdom() Virtual DOM builder', {check} => {
  const vnode = {
    tag: 'div',
    props: { id: 'app' },
    children: [
      { tag: 'h1', children: ['Hello'] }
    ]
  }
  const t = vdom(vnode)
  
  check(t.type, 'node')
  check(t._treeValue.tag, 'div')
  const children = [...t.children()]
  check(children.length, 1)
  check(children[0]._treeValue.tag, 'h1')
})

// ============================================================================
// FREE FUNCTIONS
// ============================================================================

test('Tree: findNode() free function', {check} => {
  const root = tree({ a: { b: 1 } })
  const found = findNode(root, 'a.b')
  
  check(found !== null, true)
  check(found._treeValue, 1)
})

test('Tree: walkTree() free function', {check} => {
  const root = tree({ a: 1, b: 2 })
  const walked = walkTree(root).toArray()
  
  check(walked.length, 3)  // root + a + b
})

test('Tree: leaves() free function', {check} => {
  const root = tree({
    a: 1,
    b: {
      c: 2
    }
  })
  const leafNodes = leaves(root).toArray()
  
  check(leafNodes.length, 2)  // a and c (excluding root and b)
  check(leafNodes.every(l => l.isLeaf()), true)
  const keys = leafNodes.map(l => l.key).sort()
  check(keys, ['a', 'c'])
})

test('Tree: descendants() free function', {check} => {
  const root = tree({ a: { b: 1 } })
  const desc = descendants(root).toArray()
  
  check(desc.length, 2)  // a and b (all descendants)
  const keys = desc.map(d => d.key).sort()
  check(keys, ['a', 'b'])
})

test('Tree: ancestors() free function', {check} => {
  const root = tree({ a: { b: { c: 1 } } })
  const c = root.find('a.b.c')
  const anc = ancestors(c).toArray()
  
  check(anc.length, 2)  // b and a (not root)
  const keys = anc.map(a => a.key).sort()
  check(keys.includes('a'), true)
  check(keys.includes('b'), true)
})

test('Tree: siblings() free function', {check} => {
  const root = tree([1, 2, 3])
  const children = [...root.children()]
  const middle = children[1]  // value 2
  const sibs = siblings(middle).toArray()
  
  check(sibs.length, 2)  // 1 and 3 (not self)
  const values = sibs.map(s => s._treeValue).sort()
  check(values, [1, 3])
})

// ============================================================================
// PRIMASET INTEGRATION
// ============================================================================

test('Tree: toSet() conversion', {check} => {
  const root = tree({ a: 1, b: 2 })
  const set = root.toSet()
  
  check(set instanceof Object, true)
  const values = set.map(n => n._treeValue).toArray()
  check(values.includes(1), true)
  check(values.includes(2), true)
})

test('Tree: PrimaSet operations on walk()', {check} => {
  const root = tree([1, 2, 3, 4, 5])
  const evens = primaSet(root.walk())
    .filter(n => typeof n._treeValue === 'number' && n._treeValue % 2 === 0)
    .map(n => n._treeValue)
    .toArray()
  
  check(evens, [2, 4])
})

test('Tree: map addresses', {check} => {
  const root = tree({ a: { b: 1 }, c: 2 })
  const addresses = primaSet(root.walk())
    .map(n => n.address())
    .filter(addr => addr !== 'root')
    .toArray()
  
  check(addresses.length > 0, true)
  check(addresses.includes('a'), true)
  check(addresses.includes('a.b'), true)
  check(addresses.includes('c'), true)
})

test('Tree: filter by depth', {check} => {
  const root = tree({
    a: {
      b: 1,
      c: 2
    },
    d: 3
  })
  
  const depth1 = primaSet(root.walk())
    .filter(n => n.depth() === 1)
    .toArray()
  
  check(depth1.length, 2)  // a and d
})

// ============================================================================
// VIRTUAL DOM FOUNDATION
// ============================================================================

test('Tree: Virtual DOM structure', {check} => {
  const vnode = {
    tag: 'div',
    props: { id: 'app', className: 'container' },
    children: [
      { tag: 'h1', props: {}, children: ['Hello'] },
      { tag: 'p', props: {}, children: ['World'] }
    ]
  }
  const root = vdom(vnode)
  
  check(root._treeValue.tag, 'div')
  const children = [...root.children()]
  check(children.length, 2)
  check(children[0]._treeValue.tag, 'h1')
  check(children[1]._treeValue.tag, 'p')
})

test('Tree: Virtual DOM traversal', {check} => {
  const vnode = {
    tag: 'div',
    children: [
      { tag: 'span', children: ['Text'] }
    ]
  }
  const root = vdom(vnode)
  
  const tags = primaSet(root.walk())
    .map(n => n._treeValue?.tag)
    .filter(Boolean)
    .toArray()
  
  check(tags, ['div', 'span'])
})

test('Tree: Virtual DOM text nodes', {check} => {
  const vnode = {
    tag: 'div',
    children: ['Hello', ' ', 'World']
  }
  const root = vdom(vnode)
  
  const children = [...root.children()]
  check(children.length, 3)
  check(children[0]._treeValue, 'Hello')
  check(children[1]._treeValue, ' ')
  check(children[2]._treeValue, 'World')
})

test('Tree: Virtual DOM render (if browser)', {check} => {
  const vnode = {
    tag: 'div',
    props: { id: 'test' },
    children: [
      { tag: 'span', children: ['Hello'] }
    ]
  }
  const root = vdom(vnode)
  
  // Only test in browser environment
  if (typeof document !== 'undefined') {
    const el = root.render()
    check(el.tagName.toLowerCase(), 'div')
    check(el.id, 'test')
    check(el.children.length, 1)
    check(el.children[0].tagName.toLowerCase(), 'span')
  } else {
    // In Node.js, render returns structure
    const result = root.render()
    check(result.tag, 'div')
  }
})

test('Tree: Complex Virtual DOM structure', {check} => {
  const vnode = {
    tag: 'div',
    props: { className: 'app' },
    children: [
      {
        tag: 'header',
        children: [
          { tag: 'h1', children: ['Title'] }
        ]
      },
      {
        tag: 'main',
        children: [
          { tag: 'p', children: ['Content'] }
        ]
      }
    ]
  }
  const root = vdom(vnode)
  
  const allNodes = [...root.walk()]
  check(allNodes.length >= 6, true)  // div, header, h1, main, p, plus text nodes
  
  const tags = primaSet(root.walk())
    .map(n => n._treeValue?.tag)
    .filter(Boolean)
    .toArray()
  
  check(tags.includes('div'), true)
  check(tags.includes('header'), true)
  check(tags.includes('h1'), true)
  check(tags.includes('main'), true)
  check(tags.includes('p'), true)
})

// ============================================================================
// EDGE CASES
// ============================================================================

test('Tree: empty tree', {check} => {
  const root = tree(null)
  const children = [...root.children()]
  
  check(children.length, 0)
  check(root.isLeaf(), true)
})

test('Tree: single node', {check} => {
  const root = tree(42)
  const walked = [...root.walk()]
  
  check(walked.length, 1)
  check(walked[0], root)
})

test('Tree: deeply nested', {check} => {
  let nested = 1
  for (let i = 0; i < 10; i++) {
    nested = { value: nested }
  }
  const root = tree(nested)
  
  const depth = root.walk().reduce((max, n) => Math.max(max, n.depth()), 0)
  check(depth, 10)
})

test('Tree: address with special characters', {check} => {
  const root = tree({
    'a.b': {
      'c/d': 1
    }
  })
  
  // Find using array path (handles special chars correctly)
  const found = root.find(['a.b', 'c/d'])
  check(found !== null, true)
  check(found._treeValue, 1)
  
  // String path with special chars requires exact key matching
  // Since 'a.b.c/d' splits to ['a', 'b', 'c', 'd'], we can't find 'a.b' and 'c/d'
  // This is expected behavior - use array paths for special characters
})

