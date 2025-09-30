# ZIP Import - Quick Start Guide

## ⚡ 3-Minute Setup

### 1. Install Required Package

```cmd
:: Open Command Prompt (cmd.exe) - NOT PowerShell
npm install adm-zip
npm install --save-dev @types/adm-zip
```

### 2. Create Archive Folder

```powershell
mkdir "C:\Users\jline\OneDrive\Desktop\resources\archive"
```

### 3. Add Test ZIP

```
1. Place any ZIP file in: C:\Users\jline\OneDrive\Desktop\resources\
2. ZIP should contain: PDF + images (optional)
```

### 4. Import

```
1. Restart dev server: npm run dev
2. Log in as admin
3. Go to /admin/resources
4. Click "Import ZIP Files from Desktop"
5. Success! ✅
```

---

## 📁 What Happens

```
Desktop/resources/My-Guide.zip
    ↓ Extracts
Temp folder
    ↓ Copies
/public/resources/guide/my-guide/
├── main.pdf
├── cover.jpg
└── metadata.json
    ↓ Archives
Desktop/resources/archive/My-Guide.zip
```

---

## 📊 MongoDB Document

```javascript
{
  title: "My Guide",
  slug: "my-guide",
  mainFile: "/resources/guide/my-guide/main.pdf",    // ← Relative!
  coverImage: "/resources/guide/my-guide/cover.jpg", // ← Relative!
  type: "guide"
}
```

**No absolute paths! ✅**

---

## ✅ Checklist

- [ ] Installed adm-zip
- [ ] Created archive folder
- [ ] Added test ZIP to Desktop/resources
- [ ] Restarted dev server
- [ ] Clicked "Import ZIP Files"
- [ ] Saw success message
- [ ] Checked /public/resources/
- [ ] Verified MongoDB has relative paths
- [ ] Tested download on /resources page

---

## 🐛 Common Issues

| Issue | Fix |
|-------|-----|
| "adm-zip not found" | Use Command Prompt to install |
| "No ZIP files found" | Add ZIPs to Desktop/resources |
| "Already imported" | Check archive/ folder |
| PowerShell execution policy | Use cmd.exe instead |

---

## 🎯 Quick Commands

```cmd
:: Install package
npm install adm-zip

:: Create archive
mkdir "C:\Users\jline\OneDrive\Desktop\resources\archive"

:: Check for ZIPs
dir "C:\Users\jline\OneDrive\Desktop\resources\*.zip"

:: Check imported resources
dir public\resources\guide
```

---

**Install adm-zip, add ZIPs, click import! 🚀**
