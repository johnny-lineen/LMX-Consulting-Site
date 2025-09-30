# Resource Management System

A complete resource management system for uploading, organizing, and distributing files to authenticated users.

## Overview

This system allows administrators to upload resources (PDFs, templates, guides, etc.) that logged-in users can browse and download. Files are organized by category and tagged for easy discovery.

## Features

- **Admin Upload Interface**: Dedicated admin page for uploading resources
- **File Storage**: Organized file storage in `/public/resources/{category}/{filename}`
- **Database Integration**: MongoDB storage for resource metadata
- **Category Filtering**: Users can filter resources by category
- **Tag System**: Resources can be tagged for better organization
- **Protected Routes**: Only authenticated users can view resources
- **Role-Based Access**: Only admins can upload/delete resources

## System Components

### 1. Database Model (`src/models/Resource.ts`)

```typescript
{
  title: string,
  description: string,
  category: string,
  filePath: string,
  tags: string[],
  createdAt: Date,
  updatedAt: Date
}
```

### 2. API Routes

#### `GET /api/resources`
- Fetch all resources or filter by category/tags
- Query params: `category`, `tags`
- Public (authenticated users only)

#### `POST /api/resources/upload`
- Upload a new resource
- Requires admin authentication
- Accepts multipart/form-data with fields: `title`, `description`, `category`, `tags`, `file`
- Returns created resource object

#### `GET /api/resources/[id]`
- Get a specific resource by ID
- Public (authenticated users only)

#### `DELETE /api/resources/[id]`
- Delete a resource and its file
- Requires admin authentication

### 3. Pages

#### `/admin` - Admin Dashboard
- Upload form with validation
- List of all uploaded resources
- Delete functionality
- Only accessible to admin users

#### `/resources` - User Resources Page
- Browse and download resources
- Filter by category
- View tags and descriptions
- Only accessible to authenticated users

## Installation & Setup

### 1. Install Required Dependencies

**IMPORTANT**: You need to install the `formidable` package for file uploads.

Run PowerShell as Administrator and execute:

```bash
npm install formidable
npm install --save-dev @types/formidable
```

If you encounter PowerShell execution policy issues, you can:

**Option A**: Temporarily bypass the policy
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
npm install formidable
```

**Option B**: Use Command Prompt instead
```cmd
npm install formidable
```

### 2. Create Admin User

You need at least one admin user in your database. You can:

**Option A**: Manually update a user in MongoDB:
```javascript
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

**Option B**: Create a script to make a user admin:

Create `src/scripts/makeAdmin.js`:
```javascript
const mongoose = require('mongoose');
const User = require('../models/User').User;

async function makeAdmin(email) {
  await mongoose.connect(process.env.MONGODB_URI);
  
  const user = await User.findOne({ email });
  if (!user) {
    console.log('User not found');
    return;
  }
  
  user.role = 'admin';
  await user.save();
  
  console.log(`User ${email} is now an admin`);
  await mongoose.disconnect();
}

makeAdmin(process.argv[2]);
```

Run it:
```bash
node src/scripts/makeAdmin.js your-email@example.com
```

### 3. File Storage Directory

The system will automatically create the necessary directories when you upload files. The structure will be:

```
public/
  resources/
    AI Tools/
    Productivity/
    Templates/
    Guides/
    ... (other categories)
```

## Usage

### For Admins

1. **Log in** to your account
2. Navigate to `/admin`
3. Fill out the upload form:
   - **Title**: Resource name (required)
   - **Description**: Detailed description (required)
   - **Category**: Select from dropdown (required)
   - **Tags**: Comma-separated tags (optional)
   - **File**: Upload your file (required)
4. Click "Upload Resource"
5. The resource will appear in the list below
6. You can delete resources using the "Delete" button

### For Users

1. **Log in** to your account
2. Navigate to `/resources`
3. Browse available resources
4. Use category filters to narrow down results
5. Click "Download" to download any resource

## Categories

Default categories include:
- AI Tools
- Productivity
- Templates
- Guides
- Checklists
- Microsoft 365
- Education
- Other

You can modify the categories in `src/pages/admin.tsx` by editing the `CATEGORIES` array.

## Security Features

- **Authentication Required**: All routes are protected
- **Admin-Only Uploads**: Only users with `role: 'admin'` can upload/delete
- **File Path Sanitization**: Filenames are sanitized to prevent security issues
- **Unique Filenames**: Timestamps prevent file overwrites

## File Naming Convention

Uploaded files are automatically renamed to:
```
{sanitized-original-name}_{timestamp}.{extension}
```

Example: `AI_Starter_Kit_1234567890.pdf`

## Error Handling

The system includes comprehensive error handling for:
- Missing required fields
- File upload failures
- Database errors
- Authentication failures
- File system errors

## API Response Formats

### Success Response (Upload)
```json
{
  "success": true,
  "resource": {
    "_id": "...",
    "title": "...",
    "description": "...",
    "category": "...",
    "filePath": "/resources/category/file.pdf",
    "tags": ["tag1", "tag2"],
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

### Success Response (List)
```json
{
  "resources": [
    {
      "_id": "...",
      "title": "...",
      // ... other fields
    }
  ]
}
```

### Error Response
```json
{
  "error": "Error message here"
}
```

## Troubleshooting

### Issue: "formidable is not installed"
**Solution**: Install formidable package as described in the Installation section.

### Issue: "Admin access required"
**Solution**: Make sure your user account has `role: 'admin'` in the database.

### Issue: File upload fails
**Solution**: 
- Check file permissions on the `public/resources` directory
- Ensure the directory exists or can be created
- Check file size limits in Next.js config

### Issue: Cannot see resources
**Solution**: 
- Make sure you're logged in
- Check that resources exist in the database
- Check browser console for API errors

## Database Indexes

The Resource model includes indexes for optimal query performance:
- `{ category: 1, createdAt: -1 }` - For category filtering and sorting
- `{ tags: 1 }` - For tag-based queries

## Future Enhancements

Potential improvements you could add:
- File size limits and validation
- Allowed file type restrictions
- Search functionality
- Resource versioning
- Download tracking/analytics
- Bulk upload capability
- Resource preview/thumbnails
- User favorites/bookmarks

## Technical Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **File Handling**: Formidable
- **Authentication**: JWT with httpOnly cookies

## Support

If you encounter any issues or have questions, please refer to the main project README or contact the development team.
