# Quick Installation Guide - Resource Management System

## Step 1: Install Required Package

You need to install the `formidable` package for file upload handling.

### Windows PowerShell (Run as Administrator)

```powershell
npm install formidable
npm install --save-dev @types/formidable
```

### If PowerShell Won't Run NPM

**Option A**: Use Command Prompt instead
1. Open Command Prompt (cmd.exe)
2. Navigate to your project folder: `cd C:\Users\jline\LMX-Consulting`
3. Run: `npm install formidable`

**Option B**: Temporarily bypass execution policy
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
npm install formidable
```

**Option C**: Use npx
```powershell
npx -y npm install formidable
```

## Step 2: Create Your First Admin User

You need at least one admin user to access the admin panel.

### Method 1: Using the Script (Recommended)

1. Make sure you have a user account already created (sign up first if needed)
2. Run the admin script with your email:

```bash
node src/scripts/makeAdmin.js your-email@example.com
```

Example:
```bash
node src/scripts/makeAdmin.js admin@lmx-consulting.com
```

### Method 2: Manually in MongoDB

If you have direct access to MongoDB:

```javascript
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

## Step 3: Test the System

1. **Start your development server**:
   ```bash
   npm run dev
   ```

2. **Log in** with your admin account

3. **Navigate to** `http://localhost:3000/admin`

4. **Upload a test resource**:
   - Fill in title and description
   - Select a category
   - Add some tags (optional)
   - Choose a file to upload
   - Click "Upload Resource"

5. **View resources** at `http://localhost:3000/resources`

## Verification Checklist

- [ ] `formidable` package installed
- [ ] At least one user has `role: 'admin'` in database
- [ ] Can access `/admin` page when logged in as admin
- [ ] Can upload a file successfully
- [ ] File appears in `/public/resources/{category}/` directory
- [ ] Resource appears in MongoDB `resources` collection
- [ ] Can view and download resource on `/resources` page
- [ ] Can delete resources from admin panel

## File Structure After Setup

```
LMX-Consulting/
├── src/
│   ├── models/
│   │   └── Resource.ts          ✓ NEW
│   ├── pages/
│   │   ├── admin.tsx            ✓ NEW
│   │   ├── resources.tsx        ✓ UPDATED
│   │   └── api/
│   │       └── resources/
│   │           ├── index.ts     ✓ NEW
│   │           ├── upload.ts    ✓ NEW
│   │           └── [id].ts      ✓ NEW
│   ├── utils/
│   │   └── adminAuth.ts         ✓ NEW
│   └── scripts/
│       └── makeAdmin.js         ✓ NEW
├── public/
│   └── resources/              ✓ AUTO-CREATED
│       ├── AI Tools/
│       ├── Productivity/
│       └── ... (more categories)
└── package.json                ✓ UPDATED
```

## Common Issues

### "Cannot find module 'formidable'"
**Fix**: Install the package (see Step 1)

### "Admin access required" when accessing /admin
**Fix**: Make sure your user has `role: 'admin'` (see Step 2)

### PowerShell script execution disabled
**Fix**: Use Command Prompt or see alternative methods in Step 1

### Upload fails silently
**Fix**: 
- Check browser console for errors
- Verify you're logged in as admin
- Check file permissions on `public/resources/` folder

## Next Steps

After installation:
1. Customize categories in `src/pages/admin.tsx` (search for `CATEGORIES` array)
2. Upload your real resources
3. Share the `/resources` page with your users
4. Consider adding file type restrictions or size limits

## Need Help?

Refer to the complete documentation: `RESOURCE_MANAGEMENT_SYSTEM_README.md`
