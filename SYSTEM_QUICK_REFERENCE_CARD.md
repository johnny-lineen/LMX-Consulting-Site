# Resource System - One-Page Quick Reference

## 🚀 Quick Start (Admin)

```powershell
# 1. Create folder
mkdir "C:\Users\jline\OneDrive\Desktop\resources\guides\my-resource"

# 2. Add files
Copy-Item "file.pdf" "...\my-resource\main.pdf"
Copy-Item "cover.jpg" "...\my-resource\cover.jpg"

# 3. Import
Admin Panel → "Scan & Import Resources" → Done! ✅

# 4. Verify
Visit /resources → See your resource card
```

---

## 📁 Required Structure

```
Desktop/resources/
├── guides/
│   └── resource-name/
│       ├── main.pdf   ← Required
│       └── cover.jpg  ← Optional
├── checklists/
├── ebooks/
└── notion-templates/
```

---

## 🎯 Admin Actions

| Task | Button | Result |
|------|--------|--------|
| Import from Desktop | "Scan & Import Resources" | Auto-imports to MongoDB |
| Process ZIP extracts | "Organize Import Folder" | Creates structured folders |
| Upload single file | Use upload form | Browser upload |

---

## 📊 Auto-Generated

| Field | Generated From |
|-------|---------------|
| Title | "my-resource" → "My Resource" |
| Slug | "my-resource" (unique) |
| Type | "guides/" → "guide" |
| Tags | Title words |
| Description | "Imported resource from..." |
| Main File | First PDF/DOCX found |
| Cover | First image with "cover" |

---

## 🌐 Public Access

**URL:** `/resources`

**Features:**
- Grid layout
- Cover images
- Type filtering
- Download buttons
- Tag display

---

## 🔧 APIs

```bash
# Public
GET  /api/resources/list
GET  /api/resources/download/{id}

# Admin
GET  /api/resources/scan
POST /api/resources/organize
POST /api/resources/upload
DELETE /api/resources/{id}
```

---

## 🎨 MongoDB Document

```javascript
{
  title: "30 Day Customer Retention",
  slug: "30-day-customer-retention",
  type: "guide",
  mainFile: "main.pdf",
  coverImage: "path/to/cover.jpg",
  tags: ["customer", "retention"],
  description: "...",
  folderPath: "..." // Admin-only
}
```

---

## ✅ Checklist

- [ ] Create Desktop/resources/ folder
- [ ] Add category folders (guides, ebooks, etc.)
- [ ] Add resource subfolders
- [ ] Add main.pdf to each
- [ ] Click "Scan & Import"
- [ ] Visit /resources to verify
- [ ] Test download

---

## 🐛 Troubleshooting

| Issue | Fix |
|-------|-----|
| "No resources found" | Add folders to Desktop/resources/{category}/ |
| "No main file" | Add PDF/DOCX to folder |
| Download fails | Check file paths in MongoDB |
| Duplicate slug | Rename folder to be unique |

---

## 📞 Full Docs

See **COMPLETE_SYSTEM_REFERENCE.md** for complete guide.

---

**System Ready! 🎉**
