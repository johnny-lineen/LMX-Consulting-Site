# Setup Resources Folder - Quick Guide

## Current Situation

✅ **Path configured:** `C:/Users/jline/OneDrive/Desktop/resources`  
✅ **Folder exists:** Yes  
⚠️ **Structure:** Needs reorganization

---

## 🎯 What You Need to Do

Your files are currently organized by **product name**, but the scan system needs them organized by **type** (guides, checklists, ebooks, etc.).

---

## 🚀 Quick Fix (Automatic)

### Use the PowerShell Script

```powershell
# Run the reorganization script
.\reorganize-resources.ps1
```

**What it does:**
- ✅ Creates type-based folders (guides, checklists, covers, etc.)
- ✅ Finds all PDFs in your nested folders
- ✅ Copies them to the correct type folder
- ✅ Copies all cover images to covers/
- ✅ Preserves your original files

**After running:**
```
Your structure will be:
resources/
├── guides/
│   ├── The-30-Day-Customer-Retention-Roadmap.pdf
│   ├── TikTok-Shop-Content-Creation-System.pdf
│   └── 13-Profit-Killing-Errors.pdf
├── checklists/
│   ├── Converting-First-Time-Buyers.pdf
│   └── Viral-TikTok-Shop-Content.pdf
└── covers/
    ├── Guide-Cover.jpg
    ├── Artwork.jpg
    └── (all other images)
```

---

## 🔧 Manual Fix (If Preferred)

### Step 1: Create Type Folders
```powershell
cd "C:\Users\jline\OneDrive\Desktop\resources"
mkdir guides
mkdir checklists
mkdir covers
```

### Step 2: Move Your Files

**Guides (move to guides/ folder):**
- The 30-Day Customer Retention Roadmap - Guide.pdf
- The TikTok Shop Content Creation System - Guide.pdf (if it's a guide)
- 13 Profit-Killing Errors Every Online Store Must Avoid.pdf

**Checklists (move to checklists/ folder):**
- Converting First-Time Buyers into Brand Loyalists - Checklist.pdf
- Viral-TikTok-Shop-Content-Creation - Checklist.pdf

**Covers (move to covers/ folder):**
- Guide Cover.jpg
- Artwork.jpg
- Any other .jpg or .png files

### Step 3: Rename for Cleaner Titles (Optional)

**Original:** `The 30-Day Customer Retention Roadmap - Guide.pdf`  
**Better:** `30-day-customer-retention-roadmap.pdf`

This makes auto-generated titles cleaner:
- Before: "The 30 Day Customer Retention Roadmap Guide"
- After: "30 Day Customer Retention Roadmap"

---

## ✅ Verification

After reorganizing, your folder should look like:

```
C:/Users/jline/OneDrive/Desktop/resources/
├── guides/              ✓ Has PDF files
├── checklists/          ✓ Has PDF files
├── covers/              ✓ Has image files
└── (old folders)        ← Can be deleted after verification
```

---

## 🧪 Test It

### 1. Check Structure
```powershell
Get-ChildItem "C:\Users\jline\OneDrive\Desktop\resources\guides"
Get-ChildItem "C:\Users\jline\OneDrive\Desktop\resources\checklists"
Get-ChildItem "C:\Users\jline\OneDrive\Desktop\resources\covers"
```

### 2. Restart Server
```bash
npm run dev
```

### 3. Try Import
```
1. Log in as admin
2. Navigate to /admin/resources
3. Click "Import from Folder"
4. Should see files in modal!
```

---

## 📊 Expected Results

### Before Reorganization
```
[SCAN] Subdirectories found: ['The-30-Day-...', 'Converting-...', ...]
[SCAN] ⚠️ Skipping unknown folder: The-30-Day-...
[SCAN] Scan complete. New files found: 0
```

### After Reorganization
```
[SCAN] Subdirectories found: ['guides', 'checklists', 'covers']
[SCAN] Processing folder: guides → type: guide
[SCAN] Files in guides: 3
[SCAN] ✓ Adding: 30-day-retention.pdf → 30 Day Retention
[SCAN] ✓ Cover matched: 30-day-retention.jpg
[SCAN] Scan complete. New files found: 3
```

---

## 🎯 Quick Commands

```powershell
# Option 1: Use automatic script
.\reorganize-resources.ps1

# Option 2: Manual organization
cd "C:\Users\jline\OneDrive\Desktop\resources"
mkdir guides, checklists, covers
# Then move files manually

# Verify structure
Get-ChildItem "C:\Users\jline\OneDrive\Desktop\resources" -Directory
```

---

## 📞 Need Help?

If the script doesn't work or you prefer manual organization, see **PATH_UPDATE_COMPLETE.md** for detailed instructions.

---

**Path is configured! Just reorganize files and you're ready to import! 🚀**
