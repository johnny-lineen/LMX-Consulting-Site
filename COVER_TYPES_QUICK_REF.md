# Cover Image Types - Quick Reference

## 🎨 File Type → Cover Mapping

| File Type | Extension | Default Cover | Color |
|-----------|-----------|---------------|-------|
| **PDF** | `.pdf` | `/images/covers/pdf-cover.svg` | 🔴 Red |
| **Word** | `.doc`, `.docx` | `/images/covers/docx-cover.svg` | 🔵 Blue |
| **Excel** | `.xls`, `.xlsx` | `/images/covers/xlsx-cover.svg` | 🟢 Green |
| **Archive** | `.zip` | `/images/covers/zip-cover.svg` | 🟣 Purple |
| **Other** | Any | `/images/default-cover.svg` | 🔵🟣 Blue-Purple |

---

## 🔄 Cover Selection Logic

```
1. Custom Cover Found?
   └─> YES → Use /resources/{category}/{slug}/cover.{ext}
   └─> NO  → Continue to step 2

2. Check File Type
   ├─> PDF  → Use pdf-cover.svg (Red)
   ├─> DOCX → Use docx-cover.svg (Blue)
   ├─> XLSX → Use xlsx-cover.svg (Green)
   ├─> ZIP  → Use zip-cover.svg (Purple)
   └─> Other → Use default-cover.svg (Blue-Purple)
```

---

## 📊 Visual Examples

### PDF (Red)
```
┌─────────────────┐
│    📄 PDF       │ Red gradient
│   Document      │ White document icon
│                 │ Text lines
│  PDF Document   │
└─────────────────┘
```

### DOCX (Blue)
```
┌─────────────────┐
│      W          │ Blue gradient
│   Document      │ Large "W" symbol
│                 │ Text lines
│ DOCX Word Doc   │
└─────────────────┘
```

### XLSX (Green)
```
┌─────────────────┐
│   [Grid cells]  │ Green gradient
│   [Grid cells]  │ Spreadsheet grid
│                 │ Highlighted cells
│ XLSX Spreadsheet│
└─────────────────┘
```

### ZIP (Purple)
```
┌─────────────────┐
│  📁 [Zipper]    │ Purple gradient
│   Archive       │ Folder with zipper
│                 │ File stack
│ ZIP Archive     │
└─────────────────┘
```

### Default (Blue-Purple)
```
┌─────────────────┐
│  📄📄📄         │ Blue→Purple gradient
│   Resource      │ Stacked documents
│                 │ Text lines
│ LMX Consulting  │
└─────────────────┘
```

---

## 🔧 Usage in Code

### Import Logic
```typescript
import { getDefaultCoverForFileType, getCoverImage } from '@/lib/coverImageHelper';

// Get type-specific default
const cover = getDefaultCoverForFileType('pdf');
// Returns: '/images/covers/pdf-cover.svg'

// Smart selection (custom or default)
const cover = getCoverImage(resource.coverImage, resource.mainFile);
// Returns: Custom if available, else type-specific default
```

### Component Usage
```tsx
<Image
  src={coverImage || '/images/default-cover.svg'}
  alt={`Cover for ${title}`}
  fill
  className="object-cover"
/>
```

---

## 📏 Cover Specifications

### All SVG Covers
- **Size:** 800x600px (4:3 ratio)
- **Format:** SVG (scalable)
- **File Size:** ~2-3KB each
- **Background:** Gradient
- **Elements:** Icon + Label + Subtitle

### Display Settings
- **Card:** 192px height (`h-48`)
- **Modal:** 256px height (`h-64`)
- **Fit:** `object-cover` (no distortion)
- **Corners:** `rounded-lg`

---

## 🎯 Quick Tests

**Test Type-Specific Covers:**
```bash
# Import a PDF without cover
→ Should show red PDF cover

# Import a DOCX without cover
→ Should show blue Word cover

# Import an XLSX without cover
→ Should show green Excel cover

# Import a ZIP without cover
→ Should show purple ZIP cover
```

**Test Custom Covers:**
```bash
# Import with cover.jpg included
→ Should show custom cover.jpg

# Import with cover.png included
→ Should show custom cover.png
```

---

## 📊 Coverage Stats

✅ **100% Coverage** - Every resource has a cover  
✅ **5 Cover Types** - PDF, DOCX, XLSX, ZIP, Default  
✅ **Zero Broken Images** - Fallback always works  
✅ **Branded** - LMX Consulting default  

---

## 🚀 Status

**System:** ✅ Active  
**Covers:** ✅ All created  
**Logic:** ✅ Implemented  
**Testing:** ✅ Complete  
**Production:** ✅ Ready  

---

**Quick Ref Date:** September 30, 2025  
**Total Covers:** 5  
**Default Path:** `/images/covers/`  
**Status:** Complete
