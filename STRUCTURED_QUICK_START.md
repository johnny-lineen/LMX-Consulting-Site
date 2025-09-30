# Structured Resource System - Quick Start

## 🚀 5-Minute Setup

### Step 1: Create Import Folder

```powershell
mkdir C:\Users\jline\LMX-Consulting\resources\import
```

### Step 2: Add a Test Resource

```powershell
# Create test folder
mkdir "C:\Users\jline\LMX-Consulting\resources\import\Test-Customer-Guide"

# Add a PDF (copy any PDF you have)
Copy-Item "path\to\your\test.pdf" "C:\Users\jline\LMX-Consulting\resources\import\Test-Customer-Guide\main.pdf"

# Optional: Add a cover image
Copy-Item "path\to\cover.jpg" "C:\Users\jline\LMX-Consulting\resources\import\Test-Customer-Guide\cover.jpg"
```

### Step 3: Organize

```
1. Go to /admin/resources
2. Click "Organize Import Folder" (blue button)
3. Wait a few seconds
4. Should see: "Organized 1 resource(s)"
```

### Step 4: Verify

```powershell
# Check that organized structure was created:
Get-ChildItem C:\Users\jline\LMX-Consulting\resources\guides\test-customer-guide\
```

**Should show:**
```
main.pdf
metadata.json
(possibly images/ folder)
```

### Step 5: Import to Database

```
1. Click "Scan Desktop Resources"
2. Modal shows "Test Customer Guide"
3. Click on it
4. Form pre-fills
5. Add description
6. Click "Upload Resource"
7. Done! ✅
```

---

## 📁 Expected Folder Structure

### After Organization

```
C:\Users\jline\LMX-Consulting\resources\
├── import\              ← Place extracted ZIPs here
│   └── (empty after processing)
│
├── ebooks\
│   └── resource-slug\
│       ├── main.pdf
│       ├── images\
│       └── metadata.json
│
├── guides\
│   └── test-customer-guide\
│       ├── main.pdf
│       ├── images\
│       │   └── cover.jpg
│       └── metadata.json
│
└── checklists\
    └── another-resource\
        ├── main.pdf
        └── metadata.json
```

---

## 🎯 Workflow Summary

```
Extract ZIP
    ↓
Move to /resources/import/
    ↓
Click "Organize" → Creates structured folders
    ↓
Click "Scan" → Shows in modal
    ↓
Select → Edit → Submit → Imported!
```

---

## ✅ Quick Checklist

- [ ] Created `/resources/import/` folder
- [ ] Added test resource folder with PDF
- [ ] Clicked "Organize Import Folder"
- [ ] Verified organized structure created
- [ ] Checked `metadata.json` file
- [ ] Clicked "Scan Desktop Resources"
- [ ] Saw resource in modal
- [ ] Imported to database

---

## 🔧 Common Tasks

### Organize New Resources
```
1. Extract ZIP to /resources/import/{folder-name}/
2. Click "Organize Import Folder"
3. Files automatically organized
```

### Import to Database
```
1. Click "Scan Desktop Resources"
2. Select from modal
3. Edit metadata
4. Submit
```

### Edit Metadata Before Import
```
1. Navigate to: resources/{category}/{slug}/
2. Open metadata.json in text editor
3. Edit title, description, tags
4. Save
5. Scan will use updated metadata
```

---

## 📞 Need Help?

See **STRUCTURED_RESOURCE_SYSTEM.md** for complete documentation.

---

**Ready to organize! 📦**
