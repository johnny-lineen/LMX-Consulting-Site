# Import from Folder - Quick Start

## 🚀 Quick Setup (5 Minutes)

### 1. Create Folder Structure
```bash
# Windows (PowerShell)
mkdir C:\Users\jline\Desktop\Resources
mkdir C:\Users\jline\Desktop\Resources\ebooks
mkdir C:\Users\jline\Desktop\Resources\checklists
mkdir C:\Users\jline\Desktop\Resources\covers

# Mac/Linux (Terminal)
mkdir -p ~/Desktop/Resources/{ebooks,checklists,covers}
```

### 2. Add Environment Variable
```bash
# Add to .env.local
RESOURCE_IMPORT_PATH=C:/Users/jline/Desktop/Resources
```

### 3. Restart Server
```bash
npm run dev
```

### 4. Test It
1. Copy a PDF to `Resources/ebooks/test.pdf`
2. Log in as admin
3. Go to `/admin/resources`
4. Click "Import from Folder"
5. Should see test.pdf in scan results
6. Click "Import" to add it

---

## 📁 Folder Structure

```
Resources/                    ← Your base folder
├── ebooks/                   ← Put e-books here
│   └── *.pdf
├── checklists/               ← Put checklists here
│   └── *.pdf
├── notion-templates/         ← Put Notion exports here
│   └── *.zip
├── guides/                   ← Put guides here
│   └── *.pdf
├── toolkits/                 ← Put toolkits here
│   └── *.zip
├── other/                    ← Put misc files here
│   └── *.*
└── covers/                   ← Put cover images here
    ├── *.jpg
    └── *.png
```

---

## 🎯 How It Works

```
1. Click "Import from Folder"
   ↓
2. Scans your Resources folder
   ↓
3. Shows all new files
   ↓
4. Click "Import" on files you want
   ↓
5. Files copied to public/resources/
   ↓
6. Resources appear in your library
```

---

## 📝 Naming Examples

| Your File | Generated Title |
|-----------|----------------|
| `my-ebook.pdf` | My Ebook |
| `daily_checklist.pdf` | Daily Checklist |
| `30-day-plan_v2.pdf` | 30 Day Plan V2 |
| `AI.guide.pdf` | AI Guide |

---

## 🖼️ Cover Images

**Automatic Matching:**
```
File:  ebooks/my-ebook.pdf
Cover: covers/my-ebook.jpg  ✅ Auto-matched!
```

**Supported Formats:** JPG, PNG, WebP, GIF

---

## ⚠️ Common Issues

### "Folder not found"
→ Check `RESOURCE_IMPORT_PATH` in `.env.local`

### "No files found"
→ Make sure files are in correct subfolders (ebooks/, checklists/, etc.)

### Files already imported
→ Scan skips duplicates automatically

---

## ✅ Quick Checklist

- [ ] Created Resources folder
- [ ] Created subfolders (ebooks, checklists, etc.)
- [ ] Added RESOURCE_IMPORT_PATH to .env.local
- [ ] Restarted server
- [ ] Tested with sample file

---

## 📞 Need Help?

See **IMPORT_FROM_FOLDER_GUIDE.md** for complete documentation.

---

**Ready to import! 📦**
