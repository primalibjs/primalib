# File:// Protocol Solution

## The Problem

Browsers block ES module imports (`import()`, `<script type="module">`) with `file://` protocol for security reasons. This is a **browser security restriction**, not a bug.

## Why This Exists

- Prevents local files from accessing arbitrary files on your system
- Prevents XSS attacks via local files
- Standard security practice across all browsers

## The Solution: Bundled Version

### Regular `<script>` tags work with `file://`!

The key insight: **Regular `<script src="">` tags (not ES modules) work fine with `file://` protocol.**

### Approach

1. **Bundle all code** into a single JavaScript file
2. **Use IIFE** (Immediately Invoked Function Expression) format
3. **No ES modules** - just plain JavaScript
4. **Load via regular `<script>` tag**

## Implementation

### Current Status

- `hellozero.html` - Uses regular `<script src="hellozero.js">`
- `hellozero.js` - Detects protocol:
  - `http://` → Uses dynamic import (ES modules work)
  - `file://` → Tries to load bundled version

### Next Steps

1. **Create bundle script** (`create-bundle.mjs`) - ✅ Created (placeholder)
2. **Use esbuild** to properly bundle all modules
3. **Generate `primalib-bundle.js`** - Single file, IIFE format
4. **Update `hellozero.js`** to load bundle for `file://`

## How It Works

```html
<!-- hellozero.html -->
<script src="hellozero.js"></script>
```

```javascript
// hellozero.js
if (protocol === 'file:') {
  // Load bundled version via regular script tag
  const script = document.createElement('script')
  script.src = 'primalib-bundle.js'  // Regular script, works with file://
  document.head.appendChild(script)
} else {
  // Use ES modules (works with http://)
  await import('../primalib.mjs')
}
```

## Benefits

- ✅ Works with `file://` protocol
- ✅ Works with `http://` protocol  
- ✅ Simple: one HTML, one JS, one bundle
- ✅ No server required for standalone
- ✅ No complex loaders needed

## Trade-offs

- Bundle file is larger (all code in one file)
- Need to rebuild bundle when code changes
- Can't use ES modules in bundle (must be IIFE)

## Conclusion

The solution is simple: **bundle everything into a single JavaScript file** that can be loaded via regular `<script>` tags. This works with `file://` protocol because regular script tags don't have the same security restrictions as ES modules.

