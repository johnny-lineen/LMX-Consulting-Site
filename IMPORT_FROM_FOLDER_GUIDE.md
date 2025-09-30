# Import from Folder Feature - User Guide

## Overview

The "Import from Folder" feature allows admins to bulk import resources from a predefined folder on the server, automatically detecting metadata and organizing files.

---

## 🎯 How It Works

1. **Scan:** Click "Import from Folder" button to scan a configured directory
2. **Review:** View scanned files with auto-generated titles and detected types
3. **Import:** Click "Import" on individual files to add them to your resources

---

## 📁 Folder Structure

### Expected Directory Layout

```
Resources/                    ← Base folder
├── ebooks/                   ← E-books go here
│   ├── AI-for-Faculty.pdf
│   └── Productivity-Guide.pdf
├── checklists/               ← Checklists go here
│   └── Daily-Tasks.pdf
├── notion-templates/         ← Notion templates go here
│   └── Project-Template.zip
├── guides/                   ← Guides go here
│   └── Getting-Started.pdf
├── toolkits/                 ← Toolkits go here
│   └── Complete-Toolkit.zip
├── other/                    ← Other resources
│   └── Miscellaneous.pdf
└── covers/                   ← Cover images (optional)
    ├── AI-for-Faculty.jpg
    ├── Productivity-Guide.png
    └── Daily-Tasks.jpg
```

### Folder Name Mappings

| Folder Name | Maps To Type |
|-------------|--------------|
| `ebooks` or `ebook` | E-Book |
| `checklists` or `checklist` | Checklist |
| `notion-templates` or `notion-template` | Notion Template |
| `guides` or `guide` | Guide |
| `toolkits` or `toolkit` | Toolkit |
| `other` | Other |

---

## ⚙️ Configuration

### Environment Variable

Add to your `.env.local` file:

```bash
# Development (Windows example)
RESOURCE_IMPORT_PATH=C:/Users/jline/Desktop/Resources

# Development (Mac/Linux example)
RESOURCE_IMPORT_PATH=/Users/jline/Desktop/Resources

# Production
RESOURCE_IMPORT_PATH=/var/www/resources-import
```

**Default Paths:**
- Development: `C:/Users/jline/Desktop/Resources`
- Production: `/resources-import`

---

## 🚀 Usage Instructions

### Step 1: Prepare Your Folder

1. Create the base folder (e.g., `C:/Users/jline/Desktop/Resources`)
2. Create subfolders for each resource type (see structure above)
3. Place your files in the appropriate subfolders
4. *Optional:* Add cover images to `covers/` folder with matching names

### Step 2: Scan for Files

1. Log in as admin
2. Navigate to `/admin/resources`
3. Click **"Import from Folder"** button
4. Wait for scan to complete

### Step 3: Review Scanned Files

The scan will show:
- **Suggested Title** - Auto-generated from filename
- **File Name** - Original filename
- **Type** - Detected from folder name
- **File Size** - In megabytes
- **Has Cover** - If matching cover image found

### Step 4: Import Files

- Click **"Import"** on each file to add it
- File is copied to `/public/resources/`
- Metadata saved to MongoDB
- File removed from scan list after import

---

## 📝 Filename Processing

### Title Generation

Filenames are automatically converted to clean titles:

| Original Filename | Generated Title |
|-------------------|-----------------|
| `my-awesome-resource.pdf` | My Awesome Resource |
| `customer_retention_v2.pdf` | Customer Retention V2 |
| `30-day-plan_final.pdf` | 30 Day Plan Final |
| `AI.for.Faculty.pdf` | AI For Faculty |

**Rules:**
- Extensions removed
- Dashes, underscores, dots → spaces
- Title case applied
- Multiple spaces collapsed

---

## 🖼️ Cover Image Matching

Cover images are automatically matched by filename:

```
Resource File:  AI-for-Faculty.pdf
Cover Image:    AI-for-Faculty.jpg  ✅ Match!

Resource File:  customer_retention_v2.pdf
Cover Image:    customer_retention_v2.png  ✅ Match!
```

**Supported Cover Formats:**
- JPG/JPEG
- PNG
- WebP
- GIF

---

## 🔍 Duplicate Detection

The scan automatically skips files that are already imported:

**Detection Method:**
- Compares filename (without timestamp and extension)
- Checks against existing resources in database
- Similar filenames are considered duplicates

**Example:**
```
Already in DB: AI_Starter_Kit_1696078800.pdf
Scanned File:  AI-Starter-Kit.pdf
Result:        ⚠️ Skipped (duplicate)
```

---

## 📊 Import Process

When you click "Import" on a scanned file:

1. **Copy File:** Source file copied to `/public/resources/{type}/`
2. **Copy Cover:** Cover image (if exists) copied to `/public/resources/covers/`
3. **Add Timestamp:** Unique timestamp added to filenames
4. **Save Metadata:** Resource record created in MongoDB
5. **Update UI:** Resource appears in main list

**File Naming:**
```
Source:      my-resource.pdf
Destination: my_resource_1696078800.pdf
```

---

## ⚠️ Important Notes

### File Preservation
- ✅ Source files are **NOT deleted** after import
- ✅ Files are **copied** to public/resources/
- ✅ Original folder remains intact

### Permissions
- ✅ Admin authentication required
- ✅ Only admins can scan and import
- ✅ Files remain on server (not uploaded via browser)

### Performance
- ✅ Scans all subdirectories
- ✅ Checks database for duplicates
- ✅ May take longer with many files

---

## 🧪 Testing Workflow

### Create Test Folder Structure

```bash
# Windows (PowerShell)
mkdir C:\Users\jline\Desktop\Resources\ebooks
mkdir C:\Users\jline\Desktop\Resources\checklists
mkdir C:\Users\jline\Desktop\Resources\covers

# Mac/Linux (Terminal)
mkdir -p ~/Desktop/Resources/ebooks
mkdir -p ~/Desktop/Resources/checklists
mkdir -p ~/Desktop/Resources/covers
```

### Add Test Files

```bash
# Copy some PDFs to test folders
# Example:
# C:\Users\jline\Desktop\Resources\ebooks\test-ebook.pdf
# C:\Users\jline\Desktop\Resources\checklists\test-checklist.pdf
```

### Run Test

1. Set `RESOURCE_IMPORT_PATH` in `.env.local`
2. Restart dev server: `npm run dev`
3. Click "Import from Folder"
4. Should see your test files

---

## 🐛 Troubleshooting

### "Folder not found" Error

**Problem:** Import path doesn't exist

**Solution:**
```bash
# Check path in error message
# Create folder if needed
mkdir "C:\Users\jline\Desktop\Resources"
```

### No Files Found

**Problem:** Scan returns 0 files

**Possible Causes:**
1. ❌ Wrong folder path in `.env.local`
2. ❌ Subfolders named incorrectly
3. ❌ All files already imported
4. ❌ No files in subfolders

**Solution:**
1. ✅ Check `RESOURCE_IMPORT_PATH` is correct
2. ✅ Verify subfolder names match expected types
3. ✅ Add new files to test
4. ✅ Check file permissions

### Files Not Importing

**Problem:** Import button doesn't work

**Solution:**
1. Check browser console for errors
2. Verify you're logged in as admin
3. Check server logs
4. Ensure source files exist and are readable

### Duplicate Detection Too Aggressive

**Problem:** New files being skipped as duplicates

**Solution:**
- Rename file to be more distinct
- Check if similar file already exists
- Detection looks for partial filename matches

---

## 📈 Best Practices

### Organizing Files

1. **Use Clear Names**
   ```
   ✅ AI-Productivity-Guide.pdf
   ❌ file123.pdf
   ```

2. **Group by Type**
   ```
   ✅ ebooks/AI-Guide.pdf
   ❌ AI-Guide.pdf (in root)
   ```

3. **Add Covers**
   ```
   ✅ covers/AI-Guide.jpg
   Matches: ebooks/AI-Guide.pdf
   ```

### Batch Importing

1. **Prepare All Files First**
   - Organize into correct folders
   - Add all cover images
   - Review filenames

2. **Run Single Scan**
   - Scan once to see all files
   - Review generated titles
   - Import files one by one

3. **Clean Up**
   - Source files remain in import folder
   - Can delete after confirming import
   - Or keep for future reference

---

## 🔐 Security Considerations

- ✅ Server-side file access only
- ✅ No file upload via browser
- ✅ Admin authentication required
- ✅ Filename sanitization applied
- ✅ Files copied (not moved)
- ✅ Database duplicate checking

---

## 📞 Quick Reference

```bash
# Environment Variable
RESOURCE_IMPORT_PATH=C:/Users/jline/Desktop/Resources

# Folder Structure
Resources/
├── ebooks/
├── checklists/
├── notion-templates/
├── guides/
├── toolkits/
├── other/
└── covers/

# Supported File Types
- Any file type (PDF, DOCX, ZIP, etc.)
- Cover images: JPG, PNG, WebP, GIF

# Access
/admin/resources → Click "Import from Folder"
```

---

**Happy Importing! 📦**
