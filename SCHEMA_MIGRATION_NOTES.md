# Resource Schema Migration Notes

## Changes Made

### 1. Schema Updates
- Added `'scanned'` to type enum: `['notion', 'ebook', 'cheatsheet', 'video', 'scanned']`
- Made `fileUrl` optional for scanned resources
- Added conditional validation:
  - `notion` type → requires `fileUrl` with notion.so domain
  - `ebook` type → requires `fileUrl` with .pdf extension
  - `scanned` type → requires `filePath` (no fileUrl needed)
  - Other types → require either `fileUrl` or file upload

### 2. Model Refresh
- Force-deleted existing model to ensure new schema is used
- This prevents caching issues with Mongoose

### 3. API Updates
- **Create API**: Enhanced validation with clean error messages
- **Import API**: Uses 'scanned' type for imported resources
- **List API**: Handles optional fileUrl for scanned resources

### 4. UI Updates
- **Admin Form**: Type-specific validation and error messages
- **Components**: Updated to handle 'scanned' type

## Testing

To test the fixes:

1. **Notion Template**:
   - Type: `notion`
   - File URL: `https://notion.so/your-template-link`
   - Should save successfully

2. **Ebook**:
   - Type: `ebook` 
   - File URL: `https://example.com/book.pdf`
   - Should save successfully

3. **Scanned Resource**:
   - Type: `scanned`
   - File Path: `/path/to/local/file.pdf`
   - Should save successfully

## Error Messages

The system now provides clean, user-friendly error messages:
- "Notion templates require a Notion share link."
- "Ebooks must include a valid PDF link."
- "Scanned resources must include a file path."

Server logs still contain full stack traces for debugging.
