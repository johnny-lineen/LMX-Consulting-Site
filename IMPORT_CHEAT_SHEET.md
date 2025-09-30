# Import from Folder - Cheat Sheet

## ⚡ Quick Actions

```bash
# Setup (once)
1. mkdir C:\Users\jline\Desktop\Resources\ebooks
2. echo "RESOURCE_IMPORT_PATH=C:/Users/jline/Desktop/Resources" >> .env.local
3. npm run dev

# Use (anytime)
1. Add files to Resources/ebooks/
2. Log in as admin
3. Click "Import from Folder"
4. Select file from modal
5. Add description
6. Submit
```

---

## 📁 Folder Names → Types

| Folder | Type |
|--------|------|
| `ebooks/` or `ebook/` | E-Book |
| `checklists/` or `checklist/` | Checklist |
| `notion-templates/` or `notion-template/` | Notion Template |
| `guides/` or `guide/` | Guide |
| `toolkits/` or `toolkit/` | Toolkit |
| `other/` | Other |

---

## 🎯 File Naming → Titles

| Your File | Auto-Generated Title |
|-----------|---------------------|
| `my-ebook.pdf` | My Ebook |
| `customer_retention.pdf` | Customer Retention |
| `30-day-plan.pdf` | 30 Day Plan |
| `AI.guide.v2.pdf` | AI Guide V2 |

---

## 🖼️ Cover Matching

```
File:  ebooks/my-file.pdf
Cover: covers/my-file.jpg    ✅ Auto-matched
```

**Supported:** JPG, PNG, WebP, GIF

---

## 🔄 Workflow

```
Import Button
    ↓
Modal Opens
    ↓
Click File
    ↓
Form Pre-fills:
  ✅ Title
  ✅ Type
  ✅ File
  ✅ Cover (if found)
  ❌ Description (you fill)
  ❌ Tags (you add)
    ↓
Edit & Submit
    ↓
Done! ✅
```

---

## ⚙️ Config

```bash
# .env.local
RESOURCE_IMPORT_PATH=C:/Users/jline/Desktop/Resources
```

---

## 🐛 Quick Fixes

| Problem | Solution |
|---------|----------|
| No files found | Check subfolder names match types |
| Folder not found | Set RESOURCE_IMPORT_PATH in .env.local |
| File skipped | Already imported (duplicate) |
| Can't import | Must be logged in as admin |

---

## 📞 Help

See **IMPORT_WORKFLOW_UPDATE.md** for complete guide.

---

**Quick Start:** Add files → Scan → Select → Edit → Submit! 🚀
