# Resource Upload API Reference

## Quick Reference

### Upload Resource
```bash
POST /api/resources/upload
Content-Type: multipart/form-data
Auth: Admin required

# Success: 201 Created
# Error: 400 Bad Request, 403 Forbidden, 500 Internal Server Error
```

### List Resources
```bash
GET /api/resources
GET /api/resources?type=ebook
GET /api/resources?tags=AI,automation

# Success: 200 OK
```

### Delete Resource
```bash
DELETE /api/resources/{id}
Auth: Admin required

# Success: 200 OK
# Error: 403 Forbidden, 404 Not Found
```

---

## API Details

### POST /api/resources/upload

**Authentication:** Admin only (JWT token required)

**Content-Type:** `multipart/form-data`

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | ✅ Yes | Resource title (max 200 chars) |
| `description` | string | ✅ Yes | Resource description (max 1000 chars) |
| `type` | string | ✅ Yes | One of: `ebook`, `checklist`, `notion-template`, `guide`, `toolkit`, `other` |
| `tags` | string | ❌ No | Comma-separated tags |
| `file` | File | ✅ Yes | Main resource file (max 50MB) |
| `coverImage` | File | ❌ No | Cover image (JPG/PNG recommended) |

**Example Request (JavaScript):**
```javascript
const formData = new FormData();
formData.append('title', 'AI for Faculty Starter Kit');
formData.append('description', 'Complete guide to leveraging AI in education');
formData.append('type', 'ebook');
formData.append('tags', 'AI, education, automation');
formData.append('file', fileInput.files[0]);
formData.append('coverImage', coverInput.files[0]); // optional

const response = await fetch('/api/resources/upload', {
  method: 'POST',
  body: formData,
  // Note: Don't set Content-Type header, browser will set it with boundary
});

const data = await response.json();
```

**Success Response (201):**
```json
{
  "success": true,
  "resource": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "AI for Faculty Starter Kit",
    "description": "Complete guide to leveraging AI in education",
    "type": "ebook",
    "filePath": "/resources/ebook/AI_Starter_Kit_1696078800.pdf",
    "coverImage": "/resources/covers/cover_1696078800.jpg",
    "tags": ["AI", "education", "automation"],
    "createdAt": "2025-09-30T12:00:00.000Z",
    "updatedAt": "2025-09-30T12:00:00.000Z"
  },
  "message": "Resource uploaded successfully"
}
```

**Error Responses:**

**400 Bad Request:**
```json
{
  "error": "Missing required fields: title, description, and type are required"
}
```

**400 Bad Request (Invalid Type):**
```json
{
  "error": "Invalid type. Must be one of: ebook, checklist, notion-template, guide, toolkit, other"
}
```

**400 Bad Request (No File):**
```json
{
  "error": "No file uploaded"
}
```

**403 Forbidden:**
```json
{
  "error": "Admin access required"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Failed to upload resource"
}
```

---

### GET /api/resources

**Authentication:** Public (authenticated users)

**Query Parameters:**

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `type` | string | Filter by resource type | `?type=ebook` |
| `tags` | string or array | Filter by tags | `?tags=AI` or `?tags=AI,education` |

**Example Requests:**
```bash
# Get all resources
GET /api/resources

# Filter by type
GET /api/resources?type=ebook

# Filter by single tag
GET /api/resources?tags=AI

# Filter by multiple tags
GET /api/resources?tags=AI,education
```

**Success Response (200):**
```json
{
  "resources": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "AI for Faculty Starter Kit",
      "description": "Complete guide...",
      "type": "ebook",
      "filePath": "/resources/ebook/AI_Starter_Kit_1696078800.pdf",
      "coverImage": "/resources/covers/cover_1696078800.jpg",
      "tags": ["AI", "education", "automation"],
      "createdAt": "2025-09-30T12:00:00.000Z",
      "updatedAt": "2025-09-30T12:00:00.000Z"
    },
    // ... more resources
  ]
}
```

**Error Response (500):**
```json
{
  "error": "Failed to fetch resources"
}
```

---

### DELETE /api/resources/{id}

**Authentication:** Admin only (JWT token required)

**URL Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | MongoDB ObjectId of the resource |

**Example Request:**
```javascript
const response = await fetch('/api/resources/507f1f77bcf86cd799439011', {
  method: 'DELETE',
});

const data = await response.json();
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Resource deleted"
}
```

**Error Responses:**

**400 Bad Request:**
```json
{
  "error": "Invalid resource ID"
}
```

**403 Forbidden:**
```json
{
  "error": "Admin access required"
}
```

**404 Not Found:**
```json
{
  "error": "Resource not found"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Failed to delete resource"
}
```

---

## Database Schema

### Resource Collection

```typescript
interface IResource {
  _id: ObjectId;                 // Auto-generated
  title: string;                 // Max 200 chars, required
  description: string;           // Max 1000 chars, required
  type: string;                  // Enum, required
  filePath: string;              // Required
  coverImage?: string;           // Optional
  tags: string[];                // Default: []
  createdAt: Date;              // Auto-generated
  updatedAt: Date;              // Auto-generated
}
```

**Indexes:**
```javascript
{ type: 1, createdAt: -1 }  // For filtering and sorting
{ tags: 1 }                  // For tag queries
```

**Type Enum Values:**
- `ebook`
- `checklist`
- `notion-template`
- `guide`
- `toolkit`
- `other`

---

## File Storage

### Directory Structure
```
public/
  resources/
    ebook/
      {sanitized-name}_{timestamp}.{ext}
    checklist/
      {sanitized-name}_{timestamp}.{ext}
    notion-template/
      {sanitized-name}_{timestamp}.{ext}
    guide/
      {sanitized-name}_{timestamp}.{ext}
    toolkit/
      {sanitized-name}_{timestamp}.{ext}
    other/
      {sanitized-name}_{timestamp}.{ext}
    covers/
      {sanitized-name}_{timestamp}.{ext}
```

### File Naming Convention
```
Original: "My Resource File.pdf"
Sanitized: "My_Resource_File"
Timestamp: "1696078800000"
Result: "My_Resource_File_1696078800000.pdf"
```

### File Paths in Database
```
Main files:  /resources/{type}/{filename}
Cover images: /resources/covers/{filename}
```

---

## Authentication

### JWT Token

All admin endpoints require a valid JWT token with `isAdmin: true`.

**Token Location:** httpOnly cookie named `token`

**Token Payload:**
```json
{
  "userId": "507f1f77bcf86cd799439011",
  "email": "admin@example.com",
  "name": "Admin User",
  "isAdmin": true,
  "iat": 1696078800,
  "exp": 1696683600
}
```

**Authentication Flow:**
1. User logs in → receives JWT token in httpOnly cookie
2. Token automatically sent with subsequent requests
3. Server verifies token and checks `isAdmin` flag
4. Admin-only endpoints require `isAdmin: true`

---

## Error Handling

### HTTP Status Codes

| Code | Meaning | When Used |
|------|---------|-----------|
| 200 | OK | Successful GET, DELETE |
| 201 | Created | Successful POST (resource created) |
| 400 | Bad Request | Invalid input, missing fields |
| 401 | Unauthorized | Not logged in |
| 403 | Forbidden | Not admin |
| 404 | Not Found | Resource doesn't exist |
| 405 | Method Not Allowed | Wrong HTTP method |
| 500 | Internal Server Error | Server error |

### Error Response Format

All errors follow this format:
```json
{
  "error": "Human-readable error message"
}
```

---

## Rate Limiting

**Current:** No rate limiting implemented

**Recommendation:** Implement rate limiting for upload endpoint:
```javascript
// Example: 10 uploads per hour per admin
maxUploads: 10,
windowMs: 60 * 60 * 1000
```

---

## File Size Limits

**Maximum File Size:** 50MB

**Configured in:** `src/pages/api/resources/upload.ts`
```javascript
const form = new IncomingForm({
  maxFileSize: 50 * 1024 * 1024, // 50MB
});
```

**To Change Limit:**
```javascript
// For 100MB:
maxFileSize: 100 * 1024 * 1024

// For 500MB:
maxFileSize: 500 * 1024 * 1024
```

---

## Security Considerations

### Input Validation
- ✅ File size limit enforced
- ✅ Type enum validation
- ✅ Filename sanitization
- ✅ Required field validation
- ✅ Admin authentication check

### File Safety
- ✅ Unique filenames (timestamp-based)
- ✅ Directory traversal prevention
- ✅ Extension preservation
- ✅ Separate cover image directory

### Recommendations
- [ ] Add file type/MIME validation
- [ ] Implement virus scanning
- [ ] Add rate limiting
- [ ] Log upload activities
- [ ] Add file hash verification

---

## Testing

### cURL Examples

**Upload Resource:**
```bash
curl -X POST \
  -H "Cookie: token=YOUR_JWT_TOKEN" \
  -F "title=Test Resource" \
  -F "description=Test description" \
  -F "type=ebook" \
  -F "tags=test,example" \
  -F "file=@/path/to/file.pdf" \
  -F "coverImage=@/path/to/cover.jpg" \
  http://localhost:3000/api/resources/upload
```

**List Resources:**
```bash
curl http://localhost:3000/api/resources
```

**Delete Resource:**
```bash
curl -X DELETE \
  -H "Cookie: token=YOUR_JWT_TOKEN" \
  http://localhost:3000/api/resources/507f1f77bcf86cd799439011
```

---

## Integration Examples

### React Component
```tsx
function UploadForm() {
  const [file, setFile] = useState(null);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('title', e.target.title.value);
    formData.append('description', e.target.description.value);
    formData.append('type', e.target.type.value);
    formData.append('tags', e.target.tags.value);
    formData.append('file', file);
    
    const res = await fetch('/api/resources/upload', {
      method: 'POST',
      body: formData,
    });
    
    const data = await res.json();
    console.log(data);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}
```

### Node.js Script
```javascript
const FormData = require('form-data');
const fs = require('fs');
const fetch = require('node-fetch');

const form = new FormData();
form.append('title', 'My Resource');
form.append('description', 'Description here');
form.append('type', 'ebook');
form.append('tags', 'test,example');
form.append('file', fs.createReadStream('file.pdf'));

fetch('http://localhost:3000/api/resources/upload', {
  method: 'POST',
  body: form,
  headers: {
    'Cookie': 'token=YOUR_JWT_TOKEN'
  }
})
.then(res => res.json())
.then(data => console.log(data));
```

---

**API Reference Complete! 📚**
