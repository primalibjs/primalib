# Why File:// Protocol is Hard

## The Core Issue

**Browsers block ES module imports (`import()`, `<script type="module">`) with `file://` protocol.**

This is a **security restriction**, not a bug. It prevents:
- Local files from accessing arbitrary files on your system
- XSS attacks via local files
- Unauthorized file system access

## Why Regular Scripts Work

**Regular `<script src="">` tags work fine with `file://` protocol!**

The restriction only applies to ES modules. This is why bundling works:
- Bundle all code into a single JavaScript file
- Use IIFE (Immediately Invoked Function Expression) format
- Load via regular `<script>` tag
- No ES modules = no CORS restrictions

## The Solution

### Simple Approach (Current)

1. **Build bundle**: `npm run build:browser` creates `dist/primalib.min.js` (IIFE format)
2. **Copy to browser**: `node browser/create-bundle.mjs` copies it to `browser/primalib-bundle.js`
3. **Load in HTML**: `<script src="primalib-bundle.js"></script>` (works with file://)
4. **Use it**: `window.PrimaLib` is available globally

### Why This Works

- **Regular script tags** don't have CORS restrictions
- **IIFE format** bundles everything into one file
- **No imports** = no module system = no restrictions
- **Works everywhere**: file://, http://, https://

## The Simplest Solution

```html
<!-- hellozero.html -->
<script src="primalib-bundle.js"></script>
<script src="hellozero.js"></script>
```

```javascript
// hellozero.js
if (window.PrimaLib) {
  // Use it!
  const { N, primaSet: ps } = window.PrimaLib
  // ...
}
```

**That's it!** No complex loaders, no protocol detection, no workarounds.

## Why It Became Hard

We tried to:
1. Use ES modules everywhere (doesn't work with file://)
2. Create universal loaders (overcomplicated)
3. Use dynamic imports (blocked by CORS)
4. Mix client/server concerns (unnecessary complexity)

## The Real Solution

**Just bundle everything and use regular script tags.**

- ✅ Works with file:// protocol
- ✅ Works with http:// protocol
- ✅ Simple: one HTML, one bundle, one app script
- ✅ No server required for standalone
- ✅ No complex loaders needed

## Conclusion

The simplest solution is the best: **bundle everything into a single JavaScript file** and load it via regular `<script>` tags. This works everywhere because regular script tags don't have the same security restrictions as ES modules.

