# MongoDB SessionId Duplicate Key Error - Fix Guide

## 🔴 Problem

The `conversations` collection was experiencing `E11000 duplicate key error` because multiple documents were being created with `sessionId: null`. Since `sessionId` has a unique index, inserting null repeatedly causes MongoDB to reject the duplicate.

## ✅ Solution Summary

We've implemented a **triple-layer defense** to ensure `sessionId` is NEVER null:

1. **Schema Default**: Auto-generates UUID if not provided
2. **Pre-save Hook**: Last line of defense that generates sessionId if missing
3. **Explicit Generation**: All API routes explicitly generate sessionId

---

## 📋 Changes Made

### 1. Enhanced Conversation Model (`src/models/Conversation.ts`)

```typescript
// Added import
import { randomUUID } from 'crypto';

// Schema with auto-generation
sessionId: {
  type: String,
  required: true,
  index: true,
  sparse: false,  // All documents must have sessionId
  default: () => randomUUID()  // Auto-generate if not provided
}

// Pre-save safety hook
ConversationSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  
  // Critical: Auto-generate sessionId if somehow still missing
  if (!this.sessionId) {
    this.sessionId = randomUUID();
    console.warn('⚠️  sessionId was missing and auto-generated:', this.sessionId);
  }
  
  next();
});
```

### 2. Updated API Routes

All conversation creation endpoints now explicitly generate `sessionId`:

**`/api/conversation/start`**
```typescript
const conversationId = randomUUID();
const sessionId = randomUUID();  // Always unique

const conversation = new Conversation({
  conversationId,
  sessionId,  // Never null
  userId: currentUser.userId,
  messages: [...],
  createdAt: new Date()
});
```

**`/api/conversation/[conversationId]/message`**
```typescript
if (!conversation) {
  conversation = new Conversation({
    conversationId,
    sessionId: randomUUID(),  // Always unique
    userId: currentUser.userId,
    // ...
  });
}
```

---

## 🔧 Database Cleanup

### Option 1: Run Cleanup Script (Recommended)

```bash
# Set your MongoDB connection string
export MONGODB_URI="your-mongodb-connection-string"
export MONGODB_DB="lmx-consulting"

# Run the cleanup script
node src/scripts/fixNullSessionIds.js
```

**What it does:**
- Finds all documents with `sessionId: null`
- Assigns unique UUIDs to each
- Verifies no duplicates remain
- Checks indexes

### Option 2: Manual MongoDB Cleanup

```javascript
// Connect to MongoDB shell or Compass

// 1. Find all null sessionIds
db.conversations.find({ 
  $or: [
    { sessionId: null }, 
    { sessionId: { $exists: false } }
  ] 
}).count()

// 2. Fix each document
db.conversations.find({ 
  $or: [
    { sessionId: null }, 
    { sessionId: { $exists: false } }
  ] 
}).forEach(doc => {
  db.conversations.updateOne(
    { _id: doc._id },
    { $set: { 
      sessionId: UUID().hex(),  // MongoDB generates UUID
      updatedAt: new Date()
    }}
  );
});

// 3. Verify cleanup
db.conversations.find({ sessionId: null }).count()  // Should be 0
```

### Option 3: Delete Broken Documents (Use with Caution)

```javascript
// Only if documents are test data and can be deleted
db.conversations.deleteMany({ 
  $or: [
    { sessionId: null }, 
    { sessionId: { $exists: false } }
  ] 
})
```

---

## 🧪 Testing

### Run Test Script

```bash
# Test conversation creation
node src/scripts/testConversationCreation.js
```

**What it tests:**
- ✅ Creating conversations WITH sessionId
- ✅ Creating conversations WITHOUT sessionId (should fail)
- ✅ Rapid creation of multiple conversations
- ✅ Verifies no null sessionIds exist
- ✅ Confirms all sessionIds are unique

### Manual API Testing

```bash
# Test the start conversation endpoint
curl -X POST http://localhost:3000/api/conversation/start \
  -H "Content-Type: application/json" \
  -H "Cookie: your-auth-cookie" \
  -v

# Expected response:
{
  "success": true,
  "conversationId": "uuid-here",
  "sessionId": "uuid-here",  # ✅ Should NEVER be null
  "conversation": {
    "conversationId": "...",
    "sessionId": "...",
    "messages": [...]
  }
}
```

### Verify in MongoDB

```javascript
// Check a recently created conversation
db.conversations.findOne({}, { sort: { createdAt: -1 } })

// Expected output should include:
{
  "_id": ObjectId("..."),
  "conversationId": "uuid-string",
  "sessionId": "uuid-string",  // ✅ Should exist and be unique
  "userId": "user-id",
  "messages": [...],
  "createdAt": ISODate("..."),
  "updatedAt": ISODate("...")
}
```

---

## 📊 Verification Checklist

- [ ] Schema has `sessionId` field with `required: true` and `default: () => randomUUID()`
- [ ] Pre-save hook auto-generates sessionId if missing
- [ ] All API routes explicitly generate sessionId
- [ ] Ran cleanup script to fix existing null sessionIds
- [ ] Verified no documents with `sessionId: null` remain
- [ ] Tested creating new conversations (no duplicate key errors)
- [ ] Confirmed all new conversations have unique sessionIds

---

## 🎯 How It Prevents Future Errors

| Defense Layer | When It Activates | Purpose |
|--------------|-------------------|---------|
| **Schema Default** | When document created without sessionId | Auto-generates UUID |
| **Pre-save Hook** | Before every save operation | Last-chance safety net |
| **Explicit API Generation** | At creation time in routes | Primary generation point |
| **Required Field** | On save validation | Prevents null from being saved |

**Result:** `sessionId` can NEVER be null. Triple redundancy ensures reliability.

---

## 🚀 Deployment Steps

1. **Deploy Code Changes**
   ```bash
   git add .
   git commit -m "Fix: Prevent sessionId null duplicate key errors"
   git push
   ```

2. **Run Database Cleanup** (in production)
   ```bash
   # SSH into production server or run via CI/CD
   export MONGODB_URI="production-mongodb-uri"
   node src/scripts/fixNullSessionIds.js
   ```

3. **Monitor Logs**
   - Watch for any `⚠️ sessionId was missing` warnings (shouldn't happen)
   - Verify no more E11000 errors in logs

4. **Verify Production**
   ```bash
   # Create a test conversation
   curl -X POST https://your-domain.com/api/conversation/start
   
   # Check response has sessionId
   ```

---

## 🐛 Troubleshooting

### Error: Still getting duplicate key errors

**Solution:**
```bash
# 1. Check if cleanup script ran successfully
node src/scripts/fixNullSessionIds.js

# 2. Manually verify in MongoDB
db.conversations.find({ sessionId: null }).count()

# 3. If still exists, drop and recreate index
db.conversations.dropIndex("sessionId_1")
node src/scripts/fixNullSessionIds.js
```

### Error: Pre-save hook logging warnings

If you see `⚠️ sessionId was missing and auto-generated` in logs:

**This means:**
- Something is bypassing the API routes
- Direct database writes are happening
- Review code for `new Conversation()` without sessionId

**Action:**
- Search codebase: `grep -r "new Conversation" src/`
- Ensure all instances include sessionId

---

## 📚 Related Files

- `src/models/Conversation.ts` - Schema definition with auto-generation
- `src/pages/api/conversation/start.ts` - Primary conversation creation
- `src/pages/api/conversation/[conversationId]/message.ts` - Fallback creation
- `src/scripts/fixNullSessionIds.js` - Cleanup script
- `src/scripts/testConversationCreation.js` - Testing script

---

## ✅ Success Criteria

Your fix is successful when:

1. ✅ No `E11000 duplicate key error` in logs
2. ✅ All new conversations have `sessionId` populated
3. ✅ `db.conversations.find({ sessionId: null }).count()` returns `0`
4. ✅ Can create multiple conversations without errors
5. ✅ All sessionIds are unique UUIDs

---

**Last Updated:** 2025-09-30  
**Status:** ✅ FIXED - Triple-layer defense implemented
