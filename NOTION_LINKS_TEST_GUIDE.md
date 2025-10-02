# Notion Links Compatibility Test Guide

## Overview
This guide tests the updated Resource system that now supports both `notion.so` and `notion.site` domains for Notion templates.

## Supported Link Formats

### Traditional Notion.so Links
```
https://notion.so/your-template-name
https://notion.so/template-id
```

### New Notion.site Links (Public Pages)
```
https://fascinated-galliform-766.notion.site/Task-Management-27f8a762df7c806ba92ecded3f2c49f7
https://workspace.notion.site/Page-Title-abc123def456
```

## Test Scenarios

### Test 1: Admin Form - notion.so Link
1. **Setup**: Go to `/admin/resources`
2. **Action**:
   - Title: "Test Notion Template"
   - Description: "A test template using notion.so"
   - Type: "Notion Template"
   - File URL: `https://notion.so/test-template`
   - Category: "Productivity"
   - Status: "Draft"
3. **Expected Results**:
   - ✅ Form submits successfully
   - ✅ Resource saved with `type: "notion"`
   - ✅ `fileUrl` contains the notion.so link

### Test 2: Admin Form - notion.site Link
1. **Setup**: Go to `/admin/resources`
2. **Action**:
   - Title: "Task Management Template"
   - Description: "A comprehensive task management system"
   - Type: "Notion Template"
   - File URL: `https://fascinated-galliform-766.notion.site/Task-Management-27f8a762df7c806ba92ecded3f2c49f7`
   - Category: "Productivity"
   - Status: "Live"
3. **Expected Results**:
   - ✅ Form submits successfully
   - ✅ Resource saved with `type: "notion"`
   - ✅ `fileUrl` contains the notion.site link

### Test 3: Admin Form - Invalid Link
1. **Setup**: Go to `/admin/resources`
2. **Action**:
   - Title: "Invalid Template"
   - Type: "Notion Template"
   - File URL: `https://google.com/invalid-link`
3. **Expected Results**:
   - ❌ Form shows validation error: "Notion templates must include a valid Notion link."
   - ❌ Form does not submit

### Test 4: Frontend Resource Card - notion.so
1. **Setup**: Create a notion resource with notion.so link
2. **Action**: Go to `/resources` page
3. **Expected Results**:
   - ✅ Button shows "Open in Notion"
   - ✅ Button has external link icon
   - ✅ Clicking button opens notion.so link in new tab

### Test 5: Frontend Resource Card - notion.site
1. **Setup**: Create a notion resource with notion.site link
2. **Action**: Go to `/resources` page
3. **Expected Results**:
   - ✅ Button shows "Open in Notion"
   - ✅ Button has external link icon
   - ✅ Clicking button opens notion.site link in new tab

### Test 6: Gated Resource - Logged-in User
1. **Setup**: 
   - Create a gated notion resource
   - Ensure you're logged in
2. **Action**: Click "Get Access" button
3. **Expected Results**:
   - ✅ Modal shows "✅ Logged in as [email]"
   - ✅ Single "Access Resource" button
   - ✅ Clicking button opens notion link directly
   - ✅ No email capture form

### Test 7: Gated Resource - Logged-out User
1. **Setup**: 
   - Create a gated notion resource
   - Ensure you're logged out
2. **Action**: Click "Get Access" button
3. **Expected Results**:
   - ✅ Modal shows email capture form
   - ✅ Must enter email before access
   - ✅ After email submission, opens notion link

## Validation Rules

### Schema Validation
```typescript
// Accepts both domains
if (this.type === 'notion') {
  return value && (value.includes('notion.so') || value.includes('notion.site'));
}
```

### API Validation
```typescript
// Create API validation
if (finalType === 'notion') {
  if (!fileUrl.includes('notion.so') && !fileUrl.includes('notion.site')) {
    return res.status(400).json({ 
      error: 'Notion templates must include a valid Notion link.' 
    });
  }
}
```

### Frontend Validation
```typescript
// Admin form validation
if (formData.type === 'notion') {
  if (!formData.fileUrl.includes('notion.so') && !formData.fileUrl.includes('notion.site')) {
    errors.fileUrl = 'Notion templates must include a valid Notion link.';
  }
}
```

## Error Messages

### Clean UI Messages
- "Notion templates must include a valid Notion link."
- "Ebooks must include a valid PDF link."

### Server Logs
- Full validation error details for debugging
- No Mongoose stack traces exposed to users

## Implementation Details

### Files Modified
1. **`src/models/Resource.ts`**
   - Updated validator to accept both domains
   - Improved error message

2. **`src/pages/api/resources/create.ts`**
   - Enhanced validation logic
   - Clean error messages

3. **`src/pages/admin/resources.tsx`**
   - Updated client-side validation
   - Improved placeholder text and help text

### Button Behavior
- **Notion Resources**: "Open in Notion" with external link icon
- **Gated Resources**: Email capture or direct access based on auth status
- **Direct Access**: Opens notion link in new tab

## Browser Compatibility
- ✅ **Chrome**: Full support
- ✅ **Firefox**: Full support  
- ✅ **Safari**: Full support
- ✅ **Edge**: Full support
- ✅ **Mobile**: Responsive design

## Performance
- ✅ **Fast Validation**: Client-side checks before API calls
- ✅ **Clean Errors**: No unnecessary network requests for invalid URLs
- ✅ **Optimized**: Minimal DOM updates for conditional rendering
