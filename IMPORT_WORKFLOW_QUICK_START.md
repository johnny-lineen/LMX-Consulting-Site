# Import Workflow - Quick Start Guide

## 🚀 For Admins

### Step 1: Prepare Files

**Download your resource** (ZIP format)
```
Example: AI-Profit-Masterclass.zip
```

**Download product images** (optional but recommended)
```
Create folder: AI-Profit-Masterclass-images/
Add images:
  - cover.jpg (required - will be primary cover)
  - preview1.jpg
  - preview2.jpg
  - screenshot1.png
  - etc.
```

---

### Step 2: Drop into Import Folder

**Location:** `C:/Users/jline/OneDrive/Desktop/resources/`

**Structure:**
```
/resources/
  ├─ AI-Profit-Masterclass.zip           ← Main ZIP
  ├─ AI-Profit-Masterclass-images/       ← Images folder (exact name!)
  │  ├─ cover.jpg
  │  ├─ preview1.jpg
  │  └─ preview2.jpg
  │
  ├─ Customer-Retention-Guide.zip
  └─ Customer-Retention-Guide-images/
     ├─ cover.png
     └─ preview.jpg
```

**⚠️ Important:**
- Images folder must match ZIP name exactly
- Add `-images` suffix
- Case-sensitive!

---

### Step 3: Import

1. Go to Admin Panel (`/admin/resources`)
2. Click **"Import ZIP Files from Desktop"**
3. Wait for confirmation
4. ✅ Done!

**What happens:**
- ZIP extracted automatically
- Images copied to resource folder
- MongoDB record created
- Metadata generated
- Everything organized

---

## 📊 What Gets Created

### File System
```
/public/resources/guide/ai-profit-masterclass/
  ├─ main.pdf              ← Your resource
  ├─ metadata.json         ← Auto-generated
  └─ images/               ← Product images
     ├─ cover.jpg
     ├─ preview1.jpg
     └─ preview2.jpg
```

### MongoDB Document
```json
{
  "title": "AI Profit Masterclass",
  "slug": "ai-profit-masterclass",
  "type": "guide",
  "mainFile": "/resources/guide/ai-profit-masterclass/main.pdf",
  "coverImage": "/resources/guide/ai-profit-masterclass/images/cover.jpg",
  "images": [
    "/resources/guide/ai-profit-masterclass/images/cover.jpg",
    "/resources/guide/ai-profit-masterclass/images/preview1.jpg",
    "/resources/guide/ai-profit-masterclass/images/preview2.jpg"
  ],
  "description": "Auto-generated...",
  "tags": ["profit", "masterclass"]
}
```

---

## 🎨 User Experience

### Resource Card
```
┌──────────────┐
│ Cover Image  │  ← First image from folder
├──────────────┤
│ Title        │
│ [Open] [📥]  │
└──────────────┘
```

### Modal Gallery
```
┌────────────────────────────┐
│  1/3        [Large Image]  │  ← Navigate through all images
│  [◄]                  [►]  │
├────────────────────────────┤
│ [■] [□] [□]  ← Thumbnails  │
├────────────────────────────┤
│ Details & Download         │
└────────────────────────────┘
```

---

## ✅ Checklist

**Before Import:**
- [ ] Resource is in ZIP format
- [ ] Images folder created (if you have images)
- [ ] Folder name matches ZIP name exactly
- [ ] First image is your preferred cover
- [ ] Files in correct import directory

**After Import:**
- [ ] Resource appears in admin list
- [ ] Cover image displays correctly
- [ ] Gallery works (if multiple images)
- [ ] Download button works
- [ ] Description looks good

---

## 🔧 Troubleshooting

### Images not showing
**Problem:** Folder name doesn't match
```
❌ AI-Profit-Masterclass.zip
   AI-Profit-Masterclass-Images/  (capital I)

✅ AI-Profit-Masterclass.zip
   AI-Profit-Masterclass-images/  (lowercase i)
```

### Using default cover instead of custom
**Problem:** No images folder found
```
Check:
1. Folder exists in import directory
2. Name matches exactly
3. Contains at least one image file
```

### Resource not importing
**Problem:** Already exists
```
Check:
1. Resource with same slug may exist
2. Check admin panel for duplicates
3. Delete old resource if needed
```

---

## 📋 Naming Examples

### ✅ Correct

```
Resource: Growth-Social-Proof-Guide.zip
Folder:   Growth-Social-Proof-Guide-images/

Resource: 30-Day-Customer-Retention.zip
Folder:   30-Day-Customer-Retention-images/

Resource: AI_Productivity_Toolkit.zip
Folder:   AI_Productivity_Toolkit-images/
```

### ❌ Incorrect

```
Resource: AI-Profit-Masterclass.zip
Folder:   AI Profit Masterclass images/  ← Spaces, no hyphen

Resource: customer-guide.zip
Folder:   Customer-Guide-images/  ← Different case

Resource: toolkit.zip
Folder:   toolkit-imgs/  ← Wrong suffix
```

---

## 🎯 Best Practices

### Image Names
```
✅ cover.jpg           (First image, becomes cover)
✅ preview1.jpg        (Additional previews)
✅ preview2.jpg
✅ screenshot1.png
✅ screenshot2.png

Optional naming:
- Use descriptive names
- Number sequentially
- Use lowercase
```

### Image Quality
```
Cover:       800x600px minimum
Previews:    800x600px or larger
Screenshots: Full resolution
Format:      JPG, PNG, WebP
```

### Image Count
```
Minimum: 1 (cover only)
Optimal: 3-5 (cover + previews)
Maximum: No limit (but keep it reasonable)
```

---

## 💡 Tips

1. **First image matters** - It becomes the cover
2. **Name images clearly** - preview1, preview2, etc.
3. **Use high quality** - Users can zoom
4. **Keep organized** - One folder per resource
5. **Check imports** - Verify in admin panel

---

## 📊 Import Time

| Resource Size | Images | Time |
|---------------|--------|------|
| Small (<5MB) | 0-3 | ~5 sec |
| Medium (5-20MB) | 3-5 | ~10 sec |
| Large (>20MB) | 5+ | ~15 sec |

---

## ✨ Quick Reference

**Import Location:**
```
C:/Users/jline/OneDrive/Desktop/resources/
```

**Naming Pattern:**
```
{ResourceName}.zip
{ResourceName}-images/
```

**Image Types Supported:**
```
.jpg, .jpeg, .png, .webp, .svg, .gif
```

**Admin Panel:**
```
/admin/resources
```

**Import Button:**
```
"Import ZIP Files from Desktop"
```

---

**Status:** ✅ Ready to use  
**Difficulty:** Easy (2 steps)  
**Time:** < 1 minute per resource  
**Support:** Automatic everything 🚀
