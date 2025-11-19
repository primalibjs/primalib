# AI Documentation Strategy for PrimaLib

## TL;DR - What to Give AIs

**Single file for quick tasks:** `PRIMAPROMPT.md` (~8KB, 339 lines)  
**Full context for deep work:** 3-file bundle (~30KB total)

## 📚 Core AI Documentation Bundle

### 1. Primary: PRIMAPROMPT.md (REQUIRED)
**Location:** `primalib/doc/PRIMAPROMPT.md`  
**Size:** 8KB, 339 lines  
**Purpose:** High-density reference for correct PrimaLib usage

**Contains:**
- Core philosophy (everything is a set)
- Main constructs (primaSet, N, Z, R, primes)
- Operations (free functions vs methods)
- Geometry (point, vector, space)
- Conventions & patterns
- Code generation guidelines
- Common gotchas

**When to use:** Default for all AI interactions

### 2. Secondary: QUICKREF.md (OPTIONAL)
**Location:** `primalib/doc/QUICKREF.md`  
**Size:** ~10KB  
**Purpose:** Quick syntax lookup, common patterns

**When to use:** When AI needs concrete examples

### 3. Tertiary: PATTERNS.md (OPTIONAL)
**Location:** `primalib/doc/PATTERNS.md`  
**Size:** ~12KB  
**Purpose:** Real-world usage patterns, best practices

**When to use:** For complex tasks requiring idiomatic code

## 📋 AI Documentation Levels

### Level 1: Quick Tasks (1 file)
**Files:** `PRIMAPROMPT.md` only  
**Use for:**
- Simple operations
- Basic transformations
- Common patterns (sum, filter, map)
- Quick prototypes

### Level 2: Medium Complexity (2 files)
**Files:** `PRIMAPROMPT.md` + `QUICKREF.md`  
**Use for:**
- Multi-step operations
- Geometry/linear algebra tasks
- Custom operations
- Performance-sensitive code

### Level 3: Deep Work (3-4 files)
**Files:** `PRIMAPROMPT.md` + `QUICKREF.md` + `PATTERNS.md` + module-specific doc  
**Use for:**
- Library extensions
- Complex algorithms
- Integration work
- Architecture changes

**Module-specific docs:**
- `core/PRIMASET.md` - Core internals
- `geo/PRIMAGEO.md` - Geometry internals
- `num/PRIMANUM.md` - Number theory internals
- etc.

## 🎯 Recommendations by AI Platform

### Claude/GPT-4 (Large Context)
**Default:** `PRIMAPROMPT.md`  
**Complex:** Add `QUICKREF.md` + relevant module doc  
**Max tokens:** 200K → can include full docs if needed

### GitHub Copilot (Inline)
**In workspace:** Relies on open files + comments  
**Recommend:** Keep `PRIMAPROMPT.md` open in editor  
**Fallback:** Inline comments with conventions

### Cursor AI
**Primary:** `PRIMAPROMPT.md` (attach to project)  
**Secondary:** Module docs as needed  
**Works best:** With file references in prompts

### Codeium/TabNine
**Limited context:** Use inline comments  
**Reference:** Short conventions at file top  
**Pattern:** Comment key patterns in code

## 📦 Documentation Structure Decision

### Current Structure (KEEP IT ✅)

```
primalib/
├── doc/              # Cross-cutting docs (14 files)
│   ├── PRIMAPROMPT.md       ← AI primary
│   ├── QUICKREF.md          ← AI secondary
│   ├── PATTERNS.md          ← AI tertiary
│   ├── PRIMALIB.md          ← Human reference
│   ├── PRIMAOPS.md
│   ├── FAQ.md
│   ├── INTEGRATION.md
│   └── ...
├── core/
│   └── PRIMASET.md          ← Module-specific
├── geo/
│   ├── PRIMAGEO.md          ← Module-specific
│   └── SPACE.md
├── num/
│   └── PRIMANUM.md          ← Module-specific
└── [other modules...]
```

### Why Keep Split Structure?

1. **Cohesion:** Module docs stay with code
2. **Modularity:** Each package can be published independently
3. **Monorepo best practice:** Standard for scoped packages
4. **Maintenance:** Easier to find related docs
5. **AI efficiency:** Central docs for common tasks, module docs for deep dives

### Alternative Considered (REJECTED ❌)

```
primalib/
└── doc/              # Everything in one place
    ├── PRIMAPROMPT.md
    ├── PRIMASET.md
    ├── PRIMAGEO.md
    └── ...
```

**Rejected because:**
- Breaks module cohesion
- Hard to maintain in monorepo
- Packages lose self-documentation
- Doesn't follow npm conventions

## 🤖 What AIs Actually Need

### Minimum Viable Documentation
1. **Core patterns** (PRIMAPROMPT.md covers this ✅)
2. **Type signatures** (TypeScript definitions ✅)
3. **Common gotchas** (PRIMAPROMPT.md section ✅)
4. **Naming conventions** (embedded in PRIMAPROMPT ✅)

### Nice to Have
1. **Examples** (QUICKREF.md, PATTERNS.md)
2. **Integration guides** (INTEGRATION.md)
3. **Performance tips** (PATTERNS.md)

### Usually Not Needed
1. Module internals (unless extending)
2. Historical context
3. Verbose explanations (AIs prefer dense reference)

## 📝 Maintenance Strategy

### Keep Updated
- `PRIMAPROMPT.md` - Update with every API change
- `QUICKREF.md` - Add new patterns as they emerge
- TypeScript definitions - Keep in sync with code

### Review Quarterly
- `PATTERNS.md` - Add community patterns
- Module docs - Update for major changes
- FAQ - Add common questions

### Regenerate on Breaking Changes
- Full doc sweep
- Example validation
- Link checking

## 🔍 AI Prompt Templates

### For Users (Human → AI)

**Quick task:**
```
Using PrimaLib (see @PRIMAPROMPT.md), write code to [task].
Follow lazy evaluation and method chaining conventions.
```

**Complex task:**
```
Using PrimaLib:
- Reference: @PRIMAPROMPT.md (conventions)
- Examples: @QUICKREF.md (patterns)
- Module: @core/PRIMASET.md (internals)

Task: [detailed task]
Requirements: [constraints]
```

### For AI Tools (Internal Config)

**Cursor rules:**
```json
{
  "primalib": {
    "reference": "doc/PRIMAPROMPT.md",
    "conventions": "lazy-evaluation, method-chaining",
    "imports": "import { primaSet, N, primes } from 'primalib'"
  }
}
```

## 🎯 Success Metrics

### Good AI Output
- Uses lazy evaluation correctly
- Follows naming conventions
- Materializes only when needed
- Uses appropriate calling style
- No premature optimization

### Poor AI Output
- Materializes infinite sequences
- Breaks method chains unnecessarily
- Mixes conventions inconsistently
- Ignores performance tips
- Creates custom workarounds for standard patterns

## 🚀 Recommendations

### For v0.2.0 Release (NOW)
1. ✅ Keep split doc structure
2. ✅ PRIMAPROMPT.md as primary AI doc
3. ✅ Fix all doc links (done)
4. ✅ Update TypeScript definitions (done)
5. 📝 Add "AI docs" section to README

### For v0.3.0 (FUTURE)
1. 📝 Interactive examples playground
2. 📝 AI-generated code validator
3. 📝 Performance benchmarks in docs
4. 📝 Video tutorials for visual learners

### For v1.0.0 (STABLE)
1. 📝 Comprehensive test coverage
2. 📝 AI fine-tuning dataset
3. 📝 Community pattern library
4. 📝 Multi-language docs

## 📊 Documentation Metrics

**Current state:**
- Total docs: ~22 markdown files
- AI-ready: 3 core files (PRIMAPROMPT, QUICKREF, PATTERNS)
- Module docs: 8 files
- Size: ~100KB total, ~30KB for AI bundle
- Coverage: 100% of public API

**Quality indicators:**
- ✅ All examples tested
- ✅ Links validated
- ✅ TypeScript definitions complete
- ✅ No stale references
- ✅ Consistent conventions

## 🎓 Conclusion

**Single source of truth:** `PRIMAPROMPT.md`  
**Expansion strategy:** Add QUICKREF and PATTERNS as needed  
**Structure:** Keep split (central + module docs)  
**Maintenance:** Update PRIMAPROMPT on every API change

**PRIMAPROMPT.md is sufficient for 90% of AI tasks.**

