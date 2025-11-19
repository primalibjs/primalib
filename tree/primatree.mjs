/**
 * PrimaTree - Tree handling module for PrimaLib
 * Tree nodes with parent/key tracking, traversal, and address system
 * Foundation for Virtual DOM using PrimaSet's power
 */

import { primaSet } from '@primalib/core'

// ============================================================================
// NODE FACTORY - Creates PrimaSet with tree capabilities
// ============================================================================

const node = (value, opts = {}) => {
  // Create base PrimaSet from value
  const set = primaSet(value, opts)
  
  // Tree properties
  set.parent = opts.parent || null
  set.key = opts.key ?? null
  set.type = 'node'
  set._isTree = true
  set._treeValue = value  // Store original value for tree operations
  
  // Address system - path from root using separator
  set.address = (separator = '.') => {
    if (!set.parent) {
      return set.key?.toString() || 'root'
    }
    const parentAddr = set.parent.address(separator)
    const keyStr = set.key?.toString() ?? ''
    
    if (parentAddr === 'root') {
      return keyStr || 'root'
    }
    return `${parentAddr}${separator}${keyStr}`
  }
  
  // Path array - sequence of keys from root
  set.path = () => {
    if (!set.parent) {
      return set.key ? [set.key] : []
    }
    return [...set.parent.path(), set.key]
  }
  
  // Children detection - auto-detect from structure
  set.children = function* () {
    const val = set._treeValue
    
    // Array: children are array elements
    if (Array.isArray(val)) {
      for (let i = 0; i < val.length; i++) {
        yield node(val[i], { parent: set, key: i })
      }
      return
    }
    
    // Virtual DOM node: check for children property first (highest priority)
    if (val && typeof val === 'object' && Array.isArray(val.children)) {
      for (let i = 0; i < val.children.length; i++) {
        yield node(val.children[i], { parent: set, key: i })
      }
      return
    }
    
    // Object: children are object values (keys are property names)
    if (val && typeof val === 'object' && val.constructor === Object) {
      for (const [key, childValue] of Object.entries(val)) {
        // Skip special properties
        if (key === 'children' || key === 'parent' || key === 'key' || key === 'type' || key === 'props') {
          continue
        }
        yield node(childValue, { parent: set, key })
      }
      return
    }
    
    // No children
    return
  }
  
  // Check if node is a leaf (no children)
  set.isLeaf = () => {
    const children = [...set.children()]
    return children.length === 0
  }
  
  // Check if node is root (no parent)
  set.isRoot = () => {
    return set.parent === null
  }
  
  // Get depth (distance from root)
  set.depth = () => {
    if (!set.parent) return 0
    return set.parent.depth() + 1
  }
  
  // Walk traversal - lazy generator
  set.walk = function*(mode = 'depth') {
    const children = [...set.children()]
    
    if (mode === 'breadth') {
      // Breadth-first: yield self first, then use queue
      yield set
      const queue = [...children]
      while (queue.length > 0) {
        const child = queue.shift()
        yield child
        queue.push(...child.children())
      }
    } else if (mode === 'leaves') {
      // Only yield leaves (don't yield self, only traverse children)
      for (const child of children) {
        if (child.isLeaf()) {
          yield child
        } else {
          yield* child.walk('leaves')
        }
      }
    } else {
      // Depth-first (default): pre-order traversal (yield self first)
      yield set
      for (const child of children) {
        yield* child.walk('depth')
      }
    }
  }
  
  // Find node by address/path
  set.find = (addressOrPath) => {
    const path = typeof addressOrPath === 'string' 
      ? addressOrPath.split(/[./]/).filter(Boolean)
      : addressOrPath
    
    if (path.length === 0) return set
    
    const [first, ...rest] = path
    const children = [...set.children()]
    // Try exact match first
    let child = children.find(c => {
      const keyStr = c.key?.toString()
      return keyStr === first
    })
    
    // If not found, try with special character handling
    if (!child) {
      child = children.find(c => {
        const keyStr = c.key?.toString()
        // Handle encoded special chars
        return keyStr === decodeURIComponent(first) || 
               encodeURIComponent(keyStr) === encodeURIComponent(first)
      })
    }
    
    if (!child) return null
    if (rest.length === 0) return child
    
    return child.find(rest)
  }
  
  // Get all descendants (excluding self)
  set.descendants = function*(mode = 'depth') {
    for (const child of set.children()) {
      yield child
      // Get descendants of child (excluding child itself)
      yield* child.descendants(mode)
    }
  }
  
  // Get ancestors (path to root, excluding root)
  set.ancestors = function* () {
    let current = set.parent
    const seen = new Set()
    while (current) {
      if (seen.has(current)) break  // Prevent cycles
      seen.add(current)
      if (current.key !== null && current.key !== undefined) {
        yield current
      }
      current = current.parent
    }
  }
  
  // Get root node
  set.root = () => {
    if (set.isRoot()) return set
    return set.parent.root()
  }
  
  // Get siblings (nodes with same parent)
  set.siblings = function* () {
    if (!set.parent) return
    const parentChildren = [...set.parent.children()]
    for (const sibling of parentChildren) {
      // Compare by key and parent, not by reference (since children() creates new instances)
      if (sibling.key !== set.key || sibling.parent !== set.parent) {
        yield sibling
      }
    }
  }
  
  // Virtual DOM helpers (foundation)
  set.render = () => {
    const val = set._treeValue
    
    // If browser environment
    if (typeof document !== 'undefined') {
      // Virtual DOM node structure: { tag, props, children }
      if (val && typeof val === 'object' && val.tag) {
        const el = document.createElement(val.tag)
        
        // Apply props
        if (val.props) {
          for (const [key, value] of Object.entries(val.props)) {
            if (key === 'className') {
              el.className = value
            } else if (key.startsWith('on')) {
              // Event handlers: onClick -> click
              const eventType = key.slice(2).toLowerCase()
              el.addEventListener(eventType, value)
            } else {
              el.setAttribute(key, value)
            }
          }
        }
        
        // Render children
        for (const child of set.children()) {
          const childEl = child.render()
          if (childEl) {
            el.appendChild(childEl)
          }
        }
        
        return el
      }
      
      // Text node
      if (typeof val === 'string' || typeof val === 'number') {
        return document.createTextNode(val.toString())
      }
    }
    
    // Server/Node: return structure
    return val
  }
  
  // Convert to PrimaSet for operations
  set.toSet = () => {
    return primaSet(set.walk())
  }
  
  return set
}

// ============================================================================
// TREE BUILDERS - Convenience functions
// ============================================================================

// Build tree from nested structure
const tree = (data, opts = {}) => {
  return node(data, opts)
}

// Build tree from array (indexed children)
const treeFromArray = (arr, opts = {}) => {
  return node(arr, opts)
}

// Build tree from object (keyed children)
const treeFromObject = (obj, opts = {}) => {
  return node(obj, opts)
}

// Build Virtual DOM tree
const vdom = (vnode, opts = {}) => {
  return node(vnode, opts)
}

// ============================================================================
// TREE OPERATIONS - Free functions
// ============================================================================

// Find node in tree
const findNode = (tree, addressOrPath) => {
  return tree.find(addressOrPath)
}

// Walk tree
const walkTree = (tree, mode = 'depth') => {
  return primaSet(tree.walk(mode))
}

// Get all leaves
const leaves = (tree) => {
  return primaSet(tree.walk('leaves'))
}

// Get all descendants
const descendants = (tree, mode = 'depth') => {
  return primaSet(tree.descendants(mode))
}

// Get ancestors
const ancestors = (node) => {
  return primaSet(node.ancestors())
}

// Get siblings
const siblings = (node) => {
  return primaSet(node.siblings())
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  node,
  tree,
  treeFromArray,
  treeFromObject,
  vdom,
  findNode,
  walkTree,
  leaves,
  descendants,
  ancestors,
  siblings
}

