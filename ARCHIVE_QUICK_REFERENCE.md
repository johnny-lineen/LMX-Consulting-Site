# Archive System - Quick Reference

## 🎯 At a Glance

**What Gets Archived:**
- ✅ ZIP files (after successful import)
- ✅ Images folders (after successful import)
- ❌ Failed imports (kept in import folder)

**Archive Location:**
```
/resources-import/archive/
```

---

## 📊 Visual Flow

### Before Import
```
/resources-import/
  ├─ Resource1.zip
  ├─ Resource1-images/
  ├─ Resource2.zip
  └─ Resource2-images/
```

### After Successful Import
```
/resources-import/
  (empty - ready for new imports)

/resources-import/archive/
  ├─ Resource1.zip              ← Archived
  ├─ Resource1-images/          ← Archived
  ├─ Resource2.zip              ← Archived
  └─ Resource2-images/          ← Archived
```

### After Failed Import
```
/resources-import/
  └─ Broken.zip                 ← Kept for debugging

/resources-import/archive/
  (only successful imports)
```

---

## 🔄 Import & Archive Flow

```
1. Drop files in /resources-import/
   └─> Resource.zip
   └─> Resource-images/ (optional)

2. Click "Import ZIP Files from Desktop"
   └─> System extracts and processes

3. IF successful:
   ├─> Files copied to /public/resources/
   ├─> MongoDB record created
   ├─> ZIP moved to archive
   └─> Images folder moved to archive

4. IF failed:
   ├─> Error logged
   └─> Files kept in /resources-import/
```

---

## 📋 Console Logs

### Success with Images
```
[PROCESS ZIP] Processing: AI-Profit-Masterclass
[PROCESS ZIP] ✅ Inserted to MongoDB
[ARCHIVE] Moved AI-Profit-Masterclass.zip to archive
[ARCHIVE] ✓ Archived zip: AI-Profit-Masterclass.zip
[ARCHIVE] Moved directory AI-Profit-Masterclass-images to archive
[ARCHIVE] ✓ Archived images folder: AI-Profit-Masterclass-images
```

### Success without Images
```
[PROCESS ZIP] Processing: Daily-Checklist
[PROCESS ZIP] ✅ Inserted to MongoDB
[ARCHIVE] Moved Daily-Checklist.zip to archive
[ARCHIVE] ✓ Archived zip: Daily-Checklist.zip
[ARCHIVE] No images folder to archive for Daily-Checklist.zip
```

### Failed Import
```
[PROCESS ZIP] Processing: Broken-Resource
[PROCESS ZIP] ❌ Error: No main file found
[PROCESS ZIP] Import failed for Broken-Resource, keeping files in /resources-import/
[ARCHIVE] ✗ Import failed for Broken-Resource.zip, keeping files in /resources-import/
```

---

## 🔧 Duplicate Handling

### First Import
```
Archive: Resource.zip
```

### Second Import (Same Name)
```
Archive: Resource-20250930143022.zip
```

**Format:** `{name}-{YYYYMMDDHHMMSS}.{ext}`

**Example:**
```
/resources-import/archive/
  ├─ Guide.zip                      ← Original
  ├─ Guide-20250930140000.zip       ← Import at 2:00 PM
  ├─ Guide-20250930150000.zip       ← Import at 3:00 PM
  └─ Guide-images-20250930140000/   ← Folder with timestamp
```

---

## ✅ Quick Checklist

**After Import:**
- [ ] Check import folder is empty (or only failed imports)
- [ ] Check archive folder has new ZIP
- [ ] Check archive folder has images folder (if applicable)
- [ ] Verify resource appears in admin panel
- [ ] Test resource download

**If Import Failed:**
- [ ] Files still in `/resources-import/`
- [ ] Check console logs for error
- [ ] Fix issue (corrupt ZIP, wrong format, etc.)
- [ ] Re-import

---

## 🗂️ Archive Management

### View Archive Contents
```bash
ls -lh /resources-import/archive/
```

### Check Archive Size
```bash
du -sh /resources-import/archive/
```

### Backup Archive
```bash
tar -czf archive-backup.tar.gz /resources-import/archive/
```

### Clean Old Archives (30+ days)
```bash
find /resources-import/archive/ -mtime +30 -delete
```

---

## 💡 Pro Tips

### 1. Clean Import Folder
```
Empty folder = All imports successful
Files present = Failed imports or pending
```

### 2. Archive as Backup
```
Archive contains original files
Can restore if needed
Keep for disaster recovery
```

### 3. Debugging Failed Imports
```
Failed files stay in import folder
Check logs for specific error
Fix and re-import
```

### 4. Periodic Cleanup
```
Archive grows over time
Backup and compress old archives
Delete after backup confirmed
```

---

## 🚀 Common Scenarios

### Scenario 1: Normal Import
```
Action: Import Resource.zip
Result: Success
Archive: Resource.zip moved to archive
Import Folder: Empty
```

### Scenario 2: Import with Images
```
Action: Import Resource.zip + Resource-images/
Result: Success
Archive: Both moved to archive
Import Folder: Empty
```

### Scenario 3: Corrupt ZIP
```
Action: Import Broken.zip
Result: Failed (extraction error)
Archive: Nothing archived
Import Folder: Broken.zip still present
```

### Scenario 4: Duplicate Name
```
Action: Import Guide.zip (already exists)
Result: Success
Archive: Guide-{timestamp}.zip created
Import Folder: Empty
```

---

## 📊 Status Indicators

**Import Folder:**
```
Empty          = ✅ All imports successful
Has files      = ⚠️ Pending or failed imports
```

**Archive Folder:**
```
Growing        = ✅ Successful imports accumulating
Timestamped    = ℹ️ Duplicate names handled
```

**Console Logs:**
```
✓              = Success
✗              = Failed
⚠️              = Warning (non-fatal)
```

---

## 🎯 Key Points

✅ **Automatic** - No manual archiving needed  
✅ **Safe** - Only archives successful imports  
✅ **Organized** - Separate archive folder  
✅ **Traceable** - Timestamps for duplicates  
✅ **Recoverable** - Failed imports kept  
✅ **Clean** - Import folder stays empty  

---

**Status:** ✅ Active  
**Location:** `/resources-import/archive/`  
**Automation:** Full  
**Backup:** Recommended monthly
