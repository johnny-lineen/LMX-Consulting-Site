# TypeScript Patterns - Quick Reference

## 🎯 Common Patterns Fixed

### 1. Callback Parameters

**❌ Bad (Implicit any):**
```typescript
array.map(item => item.value)
array.filter(x => x.length > 3)
keywords.some(k => k.includes('text'))
```

**✅ Good (Explicit types):**
```typescript
array.map((item: ItemType) => item.value)
array.filter((x: string) => x.length > 3)
keywords.some((k: string) => k.includes('text'))
```

---

### 2. Error Handling

**❌ Bad (any or implicit):**
```typescript
} catch (error) {           // Implicit any
  console.log(error.message);
}

} catch (error: any) {      // Explicit any
  console.log(error.message);
}
```

**✅ Good (unknown with narrowing):**
```typescript
} catch (error: unknown) {
  console.error('Error:', error);
  const message = error instanceof Error ? error.message : String(error);
  console.log(message);
}
```

---

### 3. Type Suppressions

**❌ Bad (@ts-ignore):**
```typescript
// @ts-ignore
const value = formData._privateProperty;
```

**✅ Good (Proper types):**
```typescript
interface FormData {
  regularProp: string;
  _privateProperty?: string;
}

const formData: FormData = {...};
const value = formData._privateProperty;
```

---

### 4. Return Types

**❌ Bad (Generic object):**
```typescript
function createData(params: {...}): object {
  return {...};
}
```

**✅ Good (Specific type):**
```typescript
interface DataType {
  field1: string;
  field2: number;
}

function createData(params: {...}): DataType {
  return {...};
}
```

---

## 📁 Type Organization

### Centralized Types (`src/types/`)

```
src/types/
  ├─ insight.ts      - Insight and UserInsight
  ├─ resource.ts     - ResourceMetadata, ProcessResourceResult
  ├─ api.ts          - API request/response types
  └─ index.ts        - Re-exports all
```

### Import Pattern

```typescript
// Individual imports
import { Insight, UserInsight } from '@/types/insight';

// Bulk imports
import { Insight, ResourceMetadata, ResourceQuery } from '@/types';
```

---

## 🔧 Quick Fixes

### Fix 1: Map Callback
```typescript
// Before
insights.map(insight => ({
  type: insight.type,
  content: insight.content
}))

// After
insights.map((insight: Insight): UserInsight => ({
  type: insight.type,
  content: insight.content
}))
```

### Fix 2: Filter Callback
```typescript
// Before
words.filter(word => word.length > 3)

// After
words.filter((word: string) => word.length > 3)
```

### Fix 3: Some Callback
```typescript
// Before
keywords.some(k => k.includes('retention'))

// After
keywords.some((k: string) => k.includes('retention'))
```

### Fix 4: Error Handling
```typescript
// Before
} catch (error: any) {
  return { error: error.message };
}

// After
} catch (error: unknown) {
  return { 
    error: error instanceof Error ? error.message : 'Unknown error'
  };
}
```

---

## 📊 Stats

**Types Created:** 4 files  
**Callbacks Fixed:** 40+ instances  
**Errors Fixed:** 20+ instances  
**Suppressions Removed:** 4 instances  
**Linter Errors:** 0  

---

## ✅ Checklist

When adding new code, ensure:

- [ ] All callback parameters have explicit types
- [ ] Error handlers use `unknown` not `any`
- [ ] No `@ts-ignore` or `@ts-expect-error`
- [ ] Return types explicitly defined
- [ ] Reusable types in `src/types/`
- [ ] Import from centralized types
- [ ] Type narrowing for unknown values

---

**Status:** ✅ Complete  
**Strict Mode:** ✅ Passing  
**Best Practices:** ✅ Applied
