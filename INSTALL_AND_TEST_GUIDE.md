# Installation & Testing Guide - Resource Management System

## 📦 Required Package Installation

### IMPORTANT: Use Command Prompt (Not PowerShell)

PowerShell has execution policy restrictions. Use **Command Prompt** instead.

```cmd
:: 1. Open Command Prompt (cmd.exe)
:: Press Win+R, type "cmd", press Enter

:: 2. Navigate to project
cd C:\Users\jline\LMX-Consulting

:: 3. Install ZIP processing package
npm install adm-zip

:: 4. Install TypeScript types
npm install --save-dev @types/adm-zip

:: 5. Verify installation
npm list adm-zip
```

**Expected Output:**
```
adm-zip@0.5.10
```

---

## 🎯 Complete Setup

### 1. Verify Environment

```cmd
:: Check .env.local exists
type .env.local

:: Should contain:
:: RESOURCE_IMPORT_PATH=C:/Users/jline/OneDrive/Desktop/resources
```

### 2. Create Required Folders

```powershell
:: Use PowerShell for folder creation
mkdir "C:\Users\jline\OneDrive\Desktop\resources"
mkdir "C:\Users\jline\OneDrive\Desktop\resources\archive"

:: In project
mkdir public\images
mkdir public\resources\covers
```

### 3. Verify Placeholder Exists

```cmd
dir public\images\default-cover.svg

:: Should exist - created in previous steps
```

---

## 🧪 Complete Testing Workflow

### Test 1: Create Test ZIP

```powershell
:: 1. Create test folder
mkdir test-resource
cd test-resource

:: 2. Create test PDF (or copy existing)
echo "Test PDF Content" > main.pdf
:: (Or copy a real PDF)

:: 3. Create test cover image (or copy existing)
:: Copy any JPG/PNG to this folder as cover.jpg

:: 4. Create ZIP
Compress-Archive -Path * -DestinationPath "..\Test-Customer-Guide.zip"
cd ..

:: 5. Move ZIP to desktop import folder
Move-Item "Test-Customer-Guide.zip" "C:\Users\jline\OneDrive\Desktop\resources\"

:: 6. Verify
dir "C:\Users\jline\OneDrive\Desktop\resources\*.zip"
```

### Test 2: Import ZIP

```
1. Start/Restart dev server:
   cmd> npm run dev

2. Open browser:
   http://localhost:3000

3. Log in as admin

4. Navigate to /admin/resources

5. Click "Import ZIP Files from Desktop"

6. Wait for processing (5-10 seconds)

7. Success message should show:
   "Successfully imported 1 resource(s) from ZIP files!"
```

### Test 3: Verify File Structure

```powershell
:: Check public/resources created
Get-ChildItem public\resources\guide\test-customer-guide\

:: Should show:
:: - main.pdf
:: - cover.jpg (if had one)
:: - metadata.json

:: Check metadata.json
Get-Content public\resources\guide\test-customer-guide\metadata.json

:: Should show JSON with relative paths
```

### Test 4: Verify MongoDB

```javascript
// MongoDB Compass or shell
db.resources.findOne({ slug: "test-customer-guide" })

// Check fields:
// - mainFile: "/resources/guide/test-customer-guide/main.pdf"
// - coverImage: "/resources/guide/test-customer-guide/cover.jpg"
// - No C:/ or absolute paths
```

### Test 5: Verify ZIP Archived

```powershell
:: Check archive folder
dir "C:\Users\jline\OneDrive\Desktop\resources\archive\"

:: Should show:
:: Test-Customer-Guide.zip (moved from main folder)
```

### Test 6: Test Public Access

```
1. Navigate to: http://localhost:3000/resources

2. Should see "Test Customer Guide" card

3. Card should show:
   - Cover image (or placeholder)
   - Title
   - Description
   - Tags
   - Download button

4. Click "Download" button

5. File should download ✅
```

---

## ✅ Verification Checklist

### Installation
- [ ] adm-zip installed via Command Prompt
- [ ] @types/adm-zip installed
- [ ] No installation errors
- [ ] `npm list adm-zip` shows version

### Folder Structure
- [ ] Desktop/resources/ exists
- [ ] Desktop/resources/archive/ exists
- [ ] public/images/ exists
- [ ] public/resources/covers/ exists
- [ ] public/images/default-cover.svg exists

### Environment
- [ ] .env.local has RESOURCE_IMPORT_PATH
- [ ] MongoDB connection working
- [ ] At least one admin user exists

### Test Resource
- [ ] Created test ZIP
- [ ] ZIP placed in Desktop/resources/
- [ ] ZIP contains PDF or DOCX

### Import Process
- [ ] Clicked "Import ZIP Files"
- [ ] Saw success message
- [ ] No error messages

### File Verification
- [ ] Files in /public/resources/{category}/{slug}/
- [ ] main.pdf exists
- [ ] metadata.json exists
- [ ] cover image exists (or using placeholder)

### Database Verification
- [ ] Document in MongoDB
- [ ] Paths are relative (/resources/...)
- [ ] No absolute paths (C:/...)
- [ ] Slug is unique

### Archive Verification
- [ ] ZIP moved to archive/
- [ ] Not in main folder anymore

### Public Access
- [ ] Resource shows on /resources page
- [ ] Cover image displays
- [ ] Download button works
- [ ] File downloads correctly

### Cleanup Verification
- [ ] temp/extracts/ is empty
- [ ] No leftover temp folders

---

## 🐛 Troubleshooting Guide

### Issue: adm-zip Installation Fails

**Symptom:** PowerShell execution policy error

**Solution:**
```cmd
:: Use Command Prompt instead of PowerShell
:: Win+R → type "cmd" → Enter
cd C:\Users\jline\LMX-Consulting
npm install adm-zip
```

### Issue: "No ZIP files found"

**Symptom:** Import says no ZIPs found

**Solution:**
```powershell
:: 1. Check folder exists
Test-Path "C:\Users\jline\OneDrive\Desktop\resources"

:: 2. Check for ZIPs
Get-ChildItem "C:\Users\jline\OneDrive\Desktop\resources\*.zip"

:: 3. Add ZIPs if empty
```

### Issue: "Module not found: adm-zip"

**Symptom:** Server error when clicking import

**Solution:**
```cmd
:: Restart server after installing
:: Press Ctrl+C to stop server
npm run dev
```

### Issue: Import succeeds but no files in /public/

**Symptom:** MongoDB has records but no files

**Solution:**
- Check server console logs
- Look for extraction errors
- Verify ZIP contains valid files (PDF/DOCX)

### Issue: Download not working

**Symptom:** 404 on download

**Solution:**
- Check MongoDB mainFile path starts with `/resources/`
- Verify file exists in /public/resources/...
- Check download endpoint logs

### Issue: Cover images not displaying

**Symptom:** Placeholder showing for all resources

**Solution:**
- Check coverImage paths in MongoDB
- Verify files in /public/resources/.../
- Check browser console for 404 errors
- Verify Next.js image config in next.config.js

---

## 📊 Success Indicators

### ✅ Installation Successful
```
npm list adm-zip
// Shows: adm-zip@0.5.10
```

### ✅ Import Successful
```
Success message: "Successfully imported X resource(s)"
Server logs: "[PROCESS ZIP] ✅ Inserted to MongoDB"
```

### ✅ Files Correct
```powershell
Get-ChildItem public\resources\guide\my-resource\
# Shows: main.pdf, cover.jpg, metadata.json
```

### ✅ Paths Correct
```javascript
// MongoDB
{ mainFile: "/resources/..." }  // Starts with /resources/ ✅
```

### ✅ Public Access Working
```
/resources page shows cards
Download button works
Cover images display
```

---

## 🎯 Production Deployment

### Vercel/Netlify Deployment

**1. Resources Included:**
```
/public/resources/ folder included in deployment
All files served via CDN
Relative paths work perfectly ✅
```

**2. Environment Variables:**
```
MONGODB_URI=...
JWT_SECRET=...
RESOURCE_IMPORT_PATH=... (not needed in production)
```

**3. Build:**
```cmd
npm run build
npm run start
```

**4. Test:**
```
Visit /resources
All covers display ✅
All downloads work ✅
```

---

## 📞 Quick Commands Reference

```cmd
:: Install package
npm install adm-zip

:: Start server
npm run dev

:: Check ZIPs
dir "C:\Users\jline\OneDrive\Desktop\resources\*.zip"

:: Check imported resources
dir public\resources\guide

:: Check MongoDB
:: Use MongoDB Compass or shell

:: Check logs
:: Watch terminal where npm run dev is running
```

---

## 🎯 Post-Installation

### After Installing adm-zip:

```
1. ✅ Restart dev server
2. ✅ Add test ZIP to Desktop/resources/
3. ✅ Click "Import ZIP Files from Desktop"
4. ✅ Verify files copied to /public/resources/
5. ✅ Check MongoDB has relative paths
6. ✅ Test download from /resources page
7. ✅ System ready for production!
```

---

## 📚 Documentation Reference

**Installation & Testing:**
- ZIP_IMPORT_QUICK_START.md - Quick setup
- INSTALL_AND_TEST_GUIDE.md - This file

**System Documentation:**
- ZIP_IMPORT_SYSTEM_COMPLETE.md - Complete ZIP workflow
- RELATIVE_PATHS_MIGRATION_COMPLETE.md - Path migration
- COVER_IMAGE_SYSTEM_COMPLETE.md - Cover image system
- FINAL_SYSTEM_COMPLETE.md - Complete system overview

---

## ✨ Final Status

**After completing all steps above:**

✅ **adm-zip installed**  
✅ **Folders created**  
✅ **Test ZIP imported**  
✅ **Files in /public/resources/**  
✅ **MongoDB has relative paths**  
✅ **Downloads working**  
✅ **Cover images displaying**  
✅ **System production-ready**  

**Status:** ✅ **COMPLETE & TESTED**

---

**Ready for production deployment! 🚀**

**Remember:** Install adm-zip using Command Prompt, then restart server!
