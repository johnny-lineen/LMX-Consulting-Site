# Resource Type Mapping Test Guide

## Overview
This guide tests the new type mapping system that handles conversion between UI display labels and backend enum values.

## Mapping Rules

### UI Display Labels → Backend Enum Values
- "Notion Template" → "notion"
- "E-Book" → "ebook" 
- "Cheat Sheet" → "cheatsheet"
- "Video" → "video"
- "Scanned Resource" → "scanned"

### Backend Enum Values → UI Display Labels
- "notion" → "Notion Template"
- "ebook" → "E-Book"
- "cheatsheet" → "Cheat Sheet"
- "video" → "Video"
- "scanned" → "Scanned Resource"

## Test Scenarios

### 1. Admin Form Submission
**Test**: Create a Notion Template via admin form
1. Go to `/admin/resources`
2. Fill out form:
   - Title: "Test Notion Template"
   - Description: "A test template"
   - Type: Select "Notion Template" from dropdown
   - Category: "AI & Automation"
   - File URL: "https://notion.so/test-template"
   - Status: "Draft"
3. Submit form
4. **Expected**: Should save successfully with `type: "notion"` in database

### 2. Schema Validation
**Test**: Verify schema accepts lowercase enum values
1. Check database directly or via API
2. **Expected**: Resource should have `type: "notion"` (lowercase)

### 3. Error Handling
**Test**: Submit invalid type
1. Try to submit form with invalid type value
2. **Expected**: Clean error message "Invalid resource type. Please select from Notion Template, Ebook, Cheat Sheet, or Video."

### 4. Import API
**Test**: Import scanned resource
1. Use import API with type "scanned"
2. **Expected**: Should save with `type: "scanned"` in database

## Implementation Details

### Schema Changes
- Added `lowercase: true` to type field
- Enhanced enum validation with custom error message
- Force-refreshed model to prevent caching issues

### API Updates
- **Create API**: Uses `normalizeTypeValue()` before saving
- **Import API**: Uses `normalizeTypeValue()` before saving
- **List API**: Returns enum values (frontend handles display)

### Error Handling
- Server logs: Full stack traces for debugging
- UI errors: Clean, user-friendly messages
- No Mongoose validation errors exposed to users

## Files Modified
1. `src/lib/resourceTypeMapper.ts` - New mapping utility
2. `src/models/Resource.ts` - Enhanced schema with lowercase validation
3. `src/pages/api/resources/create.ts` - Type normalization
4. `src/pages/api/resources/import.ts` - Type normalization
5. `src/pages/admin/resources.tsx` - Uses mapping constants

## Verification Commands
```bash
# Check if mapping utility works
node -e "
const { normalizeTypeValue, enumToLabel } = require('./src/lib/resourceTypeMapper.ts');
console.log('Notion Template ->', normalizeTypeValue('Notion Template'));
console.log('notion ->', enumToLabel('notion'));
"
```
