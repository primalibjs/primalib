# PrimaTree - Tree Handling & Virtual DOM Foundation

> **"Tree structures with parent/key tracking, traversal, and address systems - foundation for Virtual DOM using PrimaSet's power."**

PrimaTree provides tree handling capabilities built on PrimaSet, enabling tree structures with parent/key tracking, traversal methods, and address systems. It serves as the foundation for Virtual DOM integration in PrimaWeb.

## 🎯 **Architecture**

- **Tree Nodes**: PrimaSet with tree capabilities (`node()` factory)
- **Address System**: Path from root using dot/slash notation
- **Traversal**: Depth-first, breadth-first, and leaves-only modes
- **Relationships**: Parent, children, ancestors, descendants, siblings
- **Virtual DOM Foundation**: `vdom()` builder and `.render()` method
- **PrimaSet Integration**: All tree operations work with PrimaSet methods

## 🌳 **Tree Nodes**

Tree nodes are PrimaSet objects with additional tree properties and methods.

### Creation

```javascript
import { node, tree } from 'primalib'

// Create tree node
const root = node('root')
const child = node('child', { parent: root, key: 'child1' })

// Convenience function
const t = tree({ a: 1, b: { c: 2 } })
```

### Tree Properties

```javascript
const root = tree({ a: 1, b: 2 })

// Tree properties
root.type      // → 'node'
root._isTree   // → true
root.parent    // → null (root has no parent)
root.key       // → null (root has no key)
root._treeValue // → { a: 1, b: 2 } (original value)

// Children
const children = [...root.children()]
children[0].key      // → 'a'
children[0].parent   // → root
children[0]._treeValue // → 1
```

### Node Detection

```javascript
const root = tree({ a: 1, b: { c: 2 } })

root.isRoot()  // → true
root.isLeaf()  // → false (has children)

const a = root.find('a')
a.isLeaf()     // → true (no children)
a.isRoot()     // → false
```

### Depth Calculation

```javascript
const root = tree({ a: { b: { c: 1 } } })
const c = root.find('a.b.c')

root.depth()  // → 0
c.depth()     // → 2
```

## 📍 **Address System**

The address system provides paths from root to any node using dot or slash notation.

### Address Strings

```javascript
const root = tree({
  a: 1,
  b: {
    c: 2,
    d: 3
  }
})

root.address()              // → 'root'
root.find('a').address()     // → 'a'
root.find('b.c').address()   // → 'b.c'
root.find('b.d').address()   // → 'b.d'

// Custom separator
root.find('b.c').address('/')  // → 'b/c'
```

### Path Arrays

```javascript
const root = tree({ a: { b: { c: 1 } } })
const c = root.find('a.b.c')

root.path()  // → []
c.path()     // → ['a', 'b', 'c']
```

### Finding Nodes

```javascript
const root = tree({
  a: {
    b: 1,
    c: 2
  },
  d: 3
})

// Find by address string
root.find('a.b')  // → node with value 1
root.find('a.c')  // → node with value 2
root.find('d')    // → node with value 3

// Find by path array
root.find(['a', 'b'])  // → node with value 1

// Find with slash notation
root.find('a/b')  // → node with value 1

// Non-existent
root.find('x.y')  // → null
```

## 🔄 **Traversal**

PrimaTree provides multiple traversal modes for exploring tree structures.

### Depth-First (Default)

```javascript
import { tree, walkTree } from 'primalib'

const root = tree({
  a: 1,
  b: {
    c: 2,
    d: 3
  }
})

// Depth-first traversal (pre-order)
const walked = [...root.walk('depth')]
// → [root, a, b, c, d]

// Using free function
walkTree(root).toArray()
```

### Breadth-First

```javascript
const root = tree({
  a: 1,
  b: {
    c: 2,
    d: 3
  }
})

// Breadth-first traversal
const walked = [...root.walk('breadth')]
// → [root, a, b, c, d] (level by level)
```

### Leaves Only

```javascript
const root = tree({
  a: 1,
  b: {
    c: 2,
    d: 3
  }
})

// Only leaf nodes
const leaves = [...root.walk('leaves')]
// → [a, c, d] (excluding root and b)
```

### Integration with PrimaSet

```javascript
import { tree, walkTree, primaSet } from 'primalib'

const root = tree({ a: 1, b: { c: 2 } })

// Use PrimaSet operations on traversal
walkTree(root)
  .map(n => n.address())
  .filter(addr => addr !== 'root')
  .toArray()  // → ['a', 'b', 'b.c']

// Filter by depth
walkTree(root)
  .filter(n => n.depth() === 1)
  .map(n => n.key)
  .toArray()  // → ['a', 'b']
```

## 🔗 **Relationships**

PrimaTree provides methods to navigate tree relationships.

### Children

```javascript
const root = tree({ a: 1, b: 2, c: 3 })

// Get children
const children = [...root.children()]
children.length  // → 3
children[0].key  // → 'a'
children[1].key  // → 'b'
children[2].key  // → 'c'
```

### Descendants

```javascript
const root = tree({
  a: 1,
  b: {
    c: 2,
    d: 3
  }
})

// All descendants (excluding self)
const desc = [...root.descendants()]
desc.length  // → 4 (a, b, c, d)
desc.map(d => d.key)  // → ['a', 'b', 'c', 'd']
```

### Ancestors

```javascript
const root = tree({ a: { b: { c: 1 } } })
const c = root.find('a.b.c')

// Ancestors (path to root, excluding root)
const anc = [...c.ancestors()]
anc.length  // → 2 (b, a)
anc.map(a => a.key)  // → ['b', 'a']
```

### Siblings

```javascript
const root = tree([1, 2, 3])
const children = [...root.children()]
const middle = children[1]  // value 2

// Siblings (excluding self)
const sibs = [...middle.siblings()]
sibs.length  // → 2 (1 and 3)
sibs.map(s => s._treeValue)  // → [1, 3]
```

### Root Access

```javascript
const root = tree({ a: { b: { c: 1 } } })
const c = root.find('a.b.c')

c.root()  // → root (always returns root node)
```

## 🎨 **Tree Builders**

PrimaTree provides convenience functions for building trees from different structures.

### From Nested Structure

```javascript
import { tree } from 'primalib'

// Object structure
const root = tree({
  a: 1,
  b: {
    c: 2,
    d: 3
  }
})
```

### From Array

```javascript
import { treeFromArray } from 'primalib'

// Array structure (indexed children)
const root = treeFromArray([1, 2, 3])
const children = [...root.children()]
children[0].key  // → 0
children[1].key  // → 1
children[2].key  // → 2
```

### From Object

```javascript
import { treeFromObject } from 'primalib'

// Object structure (keyed children)
const root = treeFromObject({ a: 1, b: 2 })
const children = [...root.children()]
children.map(c => c.key)  // → ['a', 'b']
```

## 🖥️ **Virtual DOM Foundation**

PrimaTree provides Virtual DOM capabilities for rendering tree structures to DOM.

### Virtual DOM Structure

```javascript
import { vdom } from 'primalib'

// Virtual DOM node
const vnode = vdom({
  tag: 'div',
  props: { id: 'app', className: 'container' },
  children: [
    { tag: 'h1', props: {}, children: ['Hello'] },
    { tag: 'p', props: {}, children: ['World'] }
  ]
})

vnode._treeValue.tag  // → 'div'
```

### Children Detection

PrimaTree automatically detects Virtual DOM children:

```javascript
const vnode = vdom({
  tag: 'div',
  children: [
    { tag: 'span', children: ['Text'] }
  ]
})

const children = [...vnode.children()]
children.length  // → 1
children[0]._treeValue.tag  // → 'span'
```

### Rendering

```javascript
const vnode = vdom({
  tag: 'div',
  props: { id: 'app' },
  children: [
    { tag: 'h1', children: ['Hello'] },
    { tag: 'p', children: ['World'] }
  ]
})

// Browser: renders to DOM
if (typeof document !== 'undefined') {
  const el = vnode.render()
  // el is a DOM element
  document.body.appendChild(el)
}

// Server/Node: returns structure
const structure = vnode.render()  // → { tag: 'div', ... }
```

### Event Handlers

```javascript
const vnode = vdom({
  tag: 'button',
  props: {
    onClick: () => console.log('Clicked!'),
    className: 'btn'
  },
  children: ['Click me']
})

// onClick is automatically converted to click event
```

### Text Nodes

```javascript
const vnode = vdom({
  tag: 'div',
  children: ['Hello', ' ', 'World']
})

const children = [...vnode.children()]
children[0]._treeValue  // → 'Hello'
children[1]._treeValue  // → ' '
children[2]._treeValue  // → 'World'
```

## 🔧 **Free Functions**

PrimaTree provides free functions for tree operations.

### Finding Nodes

```javascript
import { findNode } from 'primalib'

const root = tree({ a: { b: 1 } })
const found = findNode(root, 'a.b')
found._treeValue  // → 1
```

### Walking Trees

```javascript
import { walkTree } from 'primalib'

const root = tree({ a: 1, b: 2 })
const walked = walkTree(root).toArray()
walked.length  // → 3 (root + a + b)
```

### Getting Leaves

```javascript
import { leaves } from 'primalib'

const root = tree({
  a: 1,
  b: {
    c: 2
  }
})

const leafNodes = leaves(root).toArray()
leafNodes.length  // → 2 (a and c)
leafNodes.every(l => l.isLeaf())  // → true
```

### Getting Descendants

```javascript
import { descendants } from 'primalib'

const root = tree({ a: { b: 1 } })
const desc = descendants(root).toArray()
desc.length  // → 2 (a and b)
```

### Getting Ancestors

```javascript
import { ancestors } from 'primalib'

const root = tree({ a: { b: { c: 1 } } })
const c = root.find('a.b.c')
const anc = ancestors(c).toArray()
anc.length  // → 2 (b and a)
```

### Getting Siblings

```javascript
import { siblings } from 'primalib'

const root = tree([1, 2, 3])
const children = [...root.children()]
const sibs = siblings(children[1]).toArray()
sibs.length  // → 2 (1 and 3)
```

## 🔗 **PrimaSet Integration**

Tree nodes are PrimaSet objects, so all PrimaSet operations work seamlessly.

### Converting to PrimaSet

```javascript
import { tree, primaSet } from 'primalib'

const root = tree({ a: 1, b: 2 })

// Convert to PrimaSet
const set = root.toSet()
set.map(n => n.address()).toArray()  // → ['root', 'a', 'b']
```

### Using PrimaSet Operations

```javascript
import { tree, walkTree, primaSet } from 'primalib'

const root = tree({
  a: 1,
  b: {
    c: 2,
    d: 3
  }
})

// Filter leaves
walkTree(root)
  .filter(n => n.isLeaf())
  .map(n => n.address())
  .toArray()  // → ['a', 'b.c', 'b.d']

// Filter by depth
walkTree(root)
  .filter(n => n.depth() === 1)
  .map(n => n.key)
  .toArray()  // → ['a', 'b']

// Map addresses
walkTree(root)
  .map(n => n.address())
  .filter(addr => addr !== 'root')
  .toArray()  // → ['a', 'b', 'b.c', 'b.d']
```

## 📋 **Complete API Reference**

### Factories

| Function | Description | Example |
|----------|-------------|---------|
| `node(value, opts?)` | Create tree node | `node(42, {parent, key})` |
| `tree(data, opts?)` | Build tree from structure | `tree({a:1, b:2})` |
| `treeFromArray(arr, opts?)` | Build from array | `treeFromArray([1,2,3])` |
| `treeFromObject(obj, opts?)` | Build from object | `treeFromObject({a:1})` |
| `vdom(vnode, opts?)` | Build Virtual DOM tree | `vdom({tag:'div'})` |

### Node Methods

| Method | Description | Example |
|--------|-------------|---------|
| `address(separator?)` | Get address path | `node.address()` → `'a.b.c'` |
| `path()` | Get path array | `node.path()` → `['a','b','c']` |
| `children()` | Get children generator | `[...node.children()]` |
| `isLeaf()` | Check if leaf | `node.isLeaf()` → `true` |
| `isRoot()` | Check if root | `node.isRoot()` → `true` |
| `depth()` | Get depth from root | `node.depth()` → `2` |
| `walk(mode?)` | Traverse tree | `[...node.walk('depth')]` |
| `find(addressOrPath)` | Find node by address | `node.find('a.b')` |
| `descendants(mode?)` | Get all descendants | `[...node.descendants()]` |
| `ancestors()` | Get ancestors | `[...node.ancestors()]` |
| `siblings()` | Get siblings | `[...node.siblings()]` |
| `root()` | Get root node | `node.root()` |
| `render()` | Render to DOM/structure | `node.render()` |
| `toSet()` | Convert to PrimaSet | `node.toSet()` |

### Free Functions

| Function | Description | Example |
|----------|-------------|---------|
| `findNode(tree, addressOrPath)` | Find node in tree | `findNode(root, 'a.b')` |
| `walkTree(tree, mode?)` | Walk tree as PrimaSet | `walkTree(root).toArray()` |
| `leaves(tree)` | Get all leaves | `leaves(root).toArray()` |
| `descendants(tree, mode?)` | Get descendants | `descendants(root).toArray()` |
| `ancestors(node)` | Get ancestors | `ancestors(node).toArray()` |
| `siblings(node)` | Get siblings | `siblings(node).toArray()` |

## 🎯 **Use Cases**

### 1. **Tree Traversal**

```javascript
import { tree, walkTree } from 'primalib'

const root = tree({
  files: {
    src: {
      'index.js': '...',
      'app.js': '...'
    },
    'package.json': '...'
  }
})

// Find all files (leaves)
walkTree(root)
  .filter(n => n.isLeaf())
  .map(n => n.path().join('/'))
  .toArray()
```

### 2. **Virtual DOM Rendering**

```javascript
import { vdom } from 'primalib'

const app = vdom({
  tag: 'div',
  props: { id: 'app' },
  children: [
    { tag: 'h1', children: ['Hello World'] },
    { tag: 'p', children: ['Welcome to PrimaLib'] }
  ]
})

app.render()  // → DOM element
```

### 3. **Configuration Trees**

```javascript
import { tree, findNode } from 'primalib'

const config = tree({
  database: {
    host: 'localhost',
    port: 5432
  },
  api: {
    endpoint: '/api',
    timeout: 5000
  }
})

const dbHost = findNode(config, 'database.host')
dbHost._treeValue  // → 'localhost'
```

### 4. **Hierarchical Data**

```javascript
import { tree, descendants } from 'primalib'

const org = tree({
  ceo: 'Alice',
  departments: {
    engineering: {
      manager: 'Bob',
      teams: ['frontend', 'backend']
    },
    sales: {
      manager: 'Carol'
    }
  }
})

// Get all employees
descendants(org)
  .filter(n => n.key === 'manager' || n.key === 'ceo')
  .map(n => n._treeValue)
  .toArray()
```

## 🎓 **Best Practices**

### 1. **Use Appropriate Traversal Mode**

- **Depth-first**: Default, good for most cases
- **Breadth-first**: When you need level-by-level processing
- **Leaves**: When you only need terminal nodes

### 2. **Leverage PrimaSet Operations**

Tree nodes are PrimaSet objects - use all PrimaSet methods:

```javascript
walkTree(root)
  .filter(n => n.depth() > 2)
  .map(n => n.address())
  .take(10)
  .toArray()
```

### 3. **Virtual DOM Structure**

Follow Virtual DOM conventions:

```javascript
{
  tag: 'div',
  props: { id: 'app', className: 'container' },
  children: [
    { tag: 'h1', children: ['Title'] },
    { tag: 'p', children: ['Content'] }
  ]
}
```

### 4. **Address Paths**

Use dot notation for addresses, array paths for special characters:

```javascript
// Standard keys
root.find('a.b.c')

// Special characters
root.find(['a.b', 'c/d'])
```

## 🔗 **Integration with PrimaWeb**

PrimaTree provides the foundation for Virtual DOM in PrimaWeb:

```javascript
import { vdom } from 'primalib'
import { PrimaWeb } from 'primalib'

const { say } = PrimaWeb('#content')

// Create Virtual DOM
const app = vdom({
  tag: 'div',
  props: { id: 'app' },
  children: [
    { tag: 'h1', children: ['Hello'] }
  ]
})

// Render
const el = app.render()
say(el.outerHTML)
```

## 📊 **Performance**

- **Lazy Traversal**: `walk()` is a generator - only computes when iterated
- **PrimaSet Integration**: All PrimaSet optimizations apply
- **Memory Efficient**: Tree structure is not duplicated, only references

## 🎯 **Summary**

PrimaTree provides:

- **Tree nodes** with parent/key tracking
- **Address system** for path navigation
- **Multiple traversal modes** (depth, breadth, leaves)
- **Relationship navigation** (children, ancestors, descendants, siblings)
- **Virtual DOM foundation** for rendering
- **PrimaSet integration** for all operations

**Start with `tree()` to create trees, use `walkTree()` for traversal, and `vdom()` for Virtual DOM structures.**

---

**PrimaTree** - *Tree structures with PrimaSet's power. Foundation for Virtual DOM and hierarchical data.* 🌳

