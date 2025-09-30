# Structured Resource Organization System ✅

## Overview

A sophisticated file organization system for managing resources downloaded as ZIP files, with automatic extraction, categorization, and metadata generation.

---

## 🎯 System Architecture

### File Structure

```
resources/
├── import/                    ← Drop extracted ZIP contents here
│   ├── 30-Day-Retention/      
│   ├── Customer-Checklist/
│   └── TikTok-Guide/
│
├── ebooks/                    ← Organized resources by category
│   ├── 30-day-customer-retention/
│   │   ├── main.pdf
│   │   ├── images/
│   │   │   ├── cover.jpg
│   │   │   └── diagram.png
│   │   └── metadata.json
│   │
│   └── another-ebook/
│       ├── main.pdf
│       └── metadata.json
│
├── checklists/
│   └── viral-tiktok-content/
│       ├── main.pdf
│       ├── images/
│       │   └── cover.jpg
│       └── metadata.json
│
├── guides/
│   └── tiktok-content-system/
│       ├── main.pdf
│       ├── images/
│       └── metadata.json
│
└── notion-templates/
    └── project-template/
        ├── main.zip
        └── metadata.json
```

---

## 📋 Workflow

### Two-Step Process

```
Step 1: ORGANIZE
┌───────────────────────────────────┐
│ Extract ZIPs to /resources/import │
│              ↓                     │
│ Click "Organize Import Folder"    │
│              ↓                     │
│ System processes each folder:     │
│  - Detects category               │
│  - Creates slug folder            │
│  - Moves main file                │
│  - Organizes images               │
│  - Creates metadata.json          │
└───────────────────────────────────┘

Step 2: IMPORT
┌───────────────────────────────────┐
│ Click "Scan Desktop Resources"    │
│              ↓                     │
│ System scans organized folders    │
│              ↓                     │
│ Shows resources in modal          │
│              ↓                     │
│ Select → Edit → Import to MongoDB │
└───────────────────────────────────┘
```

---

## 🔧 Technical Implementation

### 1. Resource Organizer (`src/lib/resourceOrganizer.ts`)

**Utility Functions:**

```typescript
generateSlug(title: string): string
// "30 Day Customer Retention" → "30-day-customer-retention"

generateTitle(name: string): string
// "30-Day-Customer-Retention" → "30 Day Customer Retention"

extractTags(title: string): string[]
// "30 Day Customer Retention Guide" → ["customer", "retention", "guide"]

detectCategory(folderName: string): string
// "Customer-Retention-Guide" → "guides"
// "Daily-Checklist" → "checklists"

findMainFile(files: string[]): string | null
// Finds first PDF, DOCX, XLSX, or ZIP

findImageFiles(files: string[]): string[]
// Returns all .jpg, .png, .webp, .gif files

createMetadata(params): object
// Creates metadata.json structure
```

---

### 2. Organize API (`/api/resources/organize`)

**POST /api/resources/organize**

**What it does:**
1. Scans `/resources/import/` folder
2. For each subfolder:
   - Detects category from name
   - Creates slug-based folder in `/resources/{category}/{slug}/`
   - Moves main file to `main.{ext}`
   - Moves images to `images/` subfolder
   - Creates `metadata.json`
3. Returns results

**Request:** `POST /api/resources/organize`

**Response:**
```json
{
  "success": true,
  "processed": 3,
  "failed": 0,
  "results": [
    {
      "folderName": "30-Day-Customer-Retention",
      "success": true,
      "resourcePath": "resources/guides/30-day-customer-retention",
      "metadata": {
        "title": "30 Day Customer Retention",
        "description": "Auto-generated description...",
        "tags": ["customer", "retention"],
        "category": "guides",
        "mainFile": "main.pdf",
        "hasImages": true,
        "createdAt": "2025-09-30T..."
      }
    }
  ]
}
```

---

### 3. Structured Scan API (`/api/resources/scan-structured`)

**GET /api/resources/scan-structured**

**What it does:**
1. Scans `/resources/{category}/` folders
2. Looks for subfolders with `metadata.json`
3. Checks if already imported to MongoDB
4. Returns unimported resources with metadata

**Response:**
```json
{
  "success": true,
  "basePath": "C:\\Users\\jline\\LMX-Consulting\\resources",
  "resourcesFound": 2,
  "resources": [
    {
      "slug": "30-day-customer-retention",
      "category": "guides",
      "title": "30 Day Customer Retention",
      "description": "Complete 30-day action plan...",
      "tags": ["customer", "retention", "guide"],
      "mainFile": "main.pdf",
      "mainFilePath": "resources/guides/30-day-customer-retention/main.pdf",
      "coverImage": "resources/guides/30-day-customer-retention/images/cover.jpg",
      "imagesCount": 3,
      "fileSize": 2567890
    }
  ]
}
```

---

## 📝 metadata.json Structure

```json
{
  "title": "30 Day Customer Retention Roadmap",
  "description": "Auto-generated description for 30 Day Customer Retention Roadmap",
  "tags": ["customer", "retention", "roadmap"],
  "category": "guides",
  "mainFile": "main.pdf",
  "hasImages": true,
  "createdAt": "2025-09-30T12:00:00.000Z"
}
```

---

## 🚀 Usage Instructions

### Step 1: Extract ZIP to Import Folder

```bash
# 1. Extract your ZIP file
# 2. Place extracted folder in project:
C:\Users\jline\LMX-Consulting\resources\import\30-Day-Retention\

# Folder should contain:
# - The 30-Day Customer Retention Roadmap.pdf
# - Cover.jpg
# - Any other images
```

### Step 2: Organize

```
1. Log in as admin
2. Go to /admin/resources
3. Click "Organize Import Folder" (indigo button)
4. Wait for processing
5. Success message shows how many processed
```

**Result:**
```
resources/guides/30-day-customer-retention/
├── main.pdf
├── images/
│   └── Cover.jpg
└── metadata.json
```

### Step 3: Scan & Import

```
1. Click "Scan Desktop Resources" (purple button)
2. Modal shows organized resources
3. Click on a resource to select
4. Form auto-fills from metadata.json
5. Edit description/tags as needed
6. Click "Upload Resource"
7. Resource imported to MongoDB!
```

---

## 🎨 Admin UI Updates

### New Buttons

```
┌─────────────────────────────────────────────────┐
│  [📊 Organize Import Folder]  [📁 Scan Desktop] │
└─────────────────────────────────────────────────┘
```

**Organize Import Folder** (Indigo)
- Processes `/resources/import/`
- Creates structured folders
- Generates metadata.json

**Scan Desktop Resources** (Purple)
- Scans OneDrive Desktop
- Or scans `/resources/` if organized
- Shows in modal for import

### Info Box

```
┌──────────────────────────────────────────────────┐
│ 📋 Two-Step Import Process:                     │
│                                                  │
│ 1. Organize Import Folder: Process extracted    │
│    ZIP files from /resources/import              │
│                                                  │
│ 2. Scan Desktop Resources: Find organized       │
│    resources and import to database              │
└──────────────────────────────────────────────────┘
```

---

## 📊 Category Detection

**Auto-Detection Rules:**

| If folder/file name contains... | Detected as... |
|--------------------------------|----------------|
| "guide" | guides |
| "checklist" | checklists |
| "ebook" or "book" | ebooks |
| "template" or "notion" | notion-templates |
| "toolkit" | toolkits |
| (none of above) | ebooks (default) |

**Examples:**
- "30-Day-Customer-Guide" → `guides`
- "Daily-Productivity-Checklist" → `checklists`
- "AI-Starter-E-book" → `ebooks`
- "Project-Notion-Template" → `notion-templates`

---

## 📝 Slug Generation

**Algorithm:**
```
Title: "30 Day Customer Retention Roadmap"
  ↓
Lowercase: "30 day customer retention roadmap"
  ↓
Remove special chars: "30 day customer retention roadmap"
  ↓
Replace spaces: "30-day-customer-retention-roadmap"
  ↓
Result: "30-day-customer-retention-roadmap"
```

**Examples:**
| Title | Slug |
|-------|------|
| "30 Day Customer Retention" | 30-day-customer-retention |
| "AI for Faculty Starter Kit" | ai-for-faculty-starter-kit |
| "Daily Productivity Checklist" | daily-productivity-checklist |

---

## 🔍 File Detection

### Main File Priority

1. Files named `main.*`
2. First `.pdf` file
3. First `.docx` file
4. First `.xlsx` file
5. First `.zip` file

### Image Files

- Scans for: `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`
- Moves all to `images/` subfolder
- Cover image: file with "cover" or "artwork" in name (or first image)

---

## 📁 Files Created

```
New Files:
✓ src/lib/resourceOrganizer.ts           - Core utilities
✓ src/pages/api/resources/organize.ts    - Reorganization API
✓ src/pages/api/resources/scan-structured.ts - Structured scan
✓ reorganize-resources.ps1                - PowerShell helper
✓ STRUCTURED_RESOURCE_SYSTEM.md          - This file
✓ PATH_UPDATE_COMPLETE.md                - Path configuration
✓ SETUP_RESOURCES_FOLDER.md              - Setup guide

Modified:
✓ src/pages/admin/resources.tsx          - Added organize button
✓ src/pages/api/resources/scan.ts        - Enhanced logging
✓ .env.local                              - Added RESOURCE_IMPORT_PATH
```

---

## 🧪 Testing Example

### Test the Full Workflow

**1. Prepare Test Data:**
```powershell
# Create import folder
mkdir C:\Users\jline\LMX-Consulting\resources\import

# Create test resource folder
mkdir "C:\Users\jline\LMX-Consulting\resources\import\Test-Customer-Guide"

# Add a test PDF
Copy-Item "C:\path\to\some.pdf" "C:\Users\jline\LMX-Consulting\resources\import\Test-Customer-Guide\main.pdf"

# Add a test image (optional)
Copy-Item "C:\path\to\image.jpg" "C:\Users\jline\LMX-Consulting\resources\import\Test-Customer-Guide\cover.jpg"
```

**2. Organize:**
```
- Click "Organize Import Folder"
- Should see: "Organized 1 resource(s) from import folder"
```

**3. Verify Structure:**
```powershell
# Should exist:
C:\Users\jline\LMX-Consulting\resources\guides\test-customer-guide\
├── main.pdf
├── images\
│   └── cover.jpg
└── metadata.json
```

**4. Check metadata.json:**
```json
{
  "title": "Test Customer Guide",
  "description": "Auto-generated description for Test Customer Guide",
  "tags": ["test", "customer", "guide"],
  "category": "guides",
  "mainFile": "main.pdf",
  "hasImages": true,
  "createdAt": "2025-09-30T..."
}
```

**5. Import to Database:**
```
- Click "Scan Desktop Resources"
- Select "Test Customer Guide"
- Add description
- Click "Upload Resource"
- Done!
```

---

## 🎯 Advantages

### Organized Structure
- ✅ Each resource has its own folder
- ✅ Main files clearly identified
- ✅ Images organized separately
- ✅ Metadata stored with resource

### Automatic Processing
- ✅ Auto-detects category
- ✅ Generates clean slugs
- ✅ Creates metadata
- ✅ Organizes files

### Easy Management
- ✅ Resources easy to find
- ✅ Can update files individually
- ✅ Can add/remove images
- ✅ Can edit metadata manually

### Database Integration
- ✅ Metadata pre-generated
- ✅ Duplicate checking
- ✅ Structured paths

---

## 📊 Comparison

### Old System (Flat)
```
public/resources/
├── ebook/
│   ├── file1_123.pdf
│   ├── file2_456.pdf
│   └── file3_789.pdf
└── covers/
    ├── cover1.jpg
    └── cover2.jpg
```

### New System (Structured)
```
resources/
├── ebooks/
│   ├── resource1-slug/
│   │   ├── main.pdf
│   │   ├── images/
│   │   │   ├── cover.jpg
│   │   │   └── diagram.png
│   │   └── metadata.json
│   └── resource2-slug/
│       ├── main.pdf
│       └── metadata.json
└── guides/
    └── resource3-slug/
        ├── main.pdf
        ├── images/
        └── metadata.json
```

---

## 🚀 Complete Workflow

### For Downloaded ZIP Files

```
1. Download resource ZIP
   ↓
2. Extract ZIP
   ↓
3. Move extracted folder to /resources/import/
   ↓
4. Click "Organize Import Folder"
   ↓
5. System organizes files automatically
   ↓
6. Click "Scan Desktop Resources"
   ↓
7. Select resource from modal
   ↓
8. Edit metadata
   ↓
9. Import to MongoDB
   ↓
10. Users can download!
```

---

## ⚙️ Configuration

### Environment Variables

```bash
# .env.local

# For scanning Desktop resources (existing resources)
RESOURCE_IMPORT_PATH=C:/Users/jline/OneDrive/Desktop/resources

# Project resources folder (organized structure)
# No env needed - uses: {projectRoot}/resources
```

---

## 🎨 metadata.json Fields

```json
{
  "title": "Resource Title",           // Generated from folder name
  "description": "Description text",    // Auto-generated (editable)
  "tags": ["tag1", "tag2", "tag3"],    // Extracted from title
  "category": "guides",                 // Auto-detected
  "mainFile": "main.pdf",              // Main resource file
  "hasImages": true,                    // Images folder exists
  "createdAt": "2025-09-30T12:00:00Z"  // Timestamp
}
```

**Editable:**
- You can manually edit `metadata.json` files
- Changes will be picked up on next scan
- Useful for improving titles/descriptions before import

---

## 📋 Best Practices

### Folder Naming
✅ Use descriptive names: "30-Day-Customer-Retention"  
❌ Avoid generic names: "Guide1", "Resource"

### File Organization
✅ One main file per resource  
✅ Name it `main.pdf` or keep original name  
✅ Put all images in root (will be moved to images/)

### Images
✅ Name cover image with "cover" or "artwork"  
✅ Use JPG/PNG format  
✅ Include diagrams, screenshots, etc.

---

## 🔧 Manual Metadata Editing

You can manually create/edit metadata.json files:

```bash
# Navigate to resource folder
cd resources/guides/my-resource/

# Edit metadata.json
notepad metadata.json

# Update fields as needed
{
  "title": "My Custom Title",
  "description": "My custom description",
  "tags": ["custom", "tags", "here"],
  "category": "guides"
}

# Save and next scan will use these values
```

---

## 🐛 Troubleshooting

### "No folders to process"
→ Add folders to `/resources/import/`

### "No main file found"
→ Folder must contain PDF, DOCX, XLSX, or ZIP

### Organize button does nothing
→ Check server console for logs starting with `[ORGANIZE]`

### Wrong category detected
→ Rename folder to include category keyword  
→ Or manually create metadata.json with correct category

---

## 📞 API Reference

### POST /api/resources/organize
- **Auth:** Admin required
- **Purpose:** Process /resources/import/ folder
- **Returns:** Processing results

### GET /api/resources/scan-structured
- **Auth:** Admin required  
- **Purpose:** Scan organized resources
- **Returns:** Resources with metadata

### GET /api/resources/scan (existing)
- **Auth:** Admin required
- **Purpose:** Scan Desktop flat structure
- **Returns:** Files for import

---

## ✅ All Requirements Met

| Requirement | Status |
|-------------|--------|
| Base /resources folder | ✅ |
| Category subfolders (ebooks, checklists, etc.) | ✅ |
| Resource subfolders with slugs | ✅ |
| main.{ext} file | ✅ |
| images/ subfolder | ✅ |
| metadata.json generation | ✅ |
| Import folder processing | ✅ |
| Category detection | ✅ |
| Slug folder creation | ✅ |
| File reorganization | ✅ |
| Auto-metadata creation | ✅ |

---

## 🎉 Summary

**Structured resource system complete!**

- ✅ Automatic organization from ZIP extracts
- ✅ Slug-based folder structure
- ✅ Metadata.json for each resource
- ✅ Image organization
- ✅ Category detection
- ✅ Admin UI integration

**No linter errors. Ready for structured resource management! 📦**

---

**Implementation Date:** September 30, 2025  
**System Type:** Structured with metadata  
**Status:** Production Ready
