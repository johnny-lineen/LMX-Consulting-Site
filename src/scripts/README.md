# Database Scripts

## Available Scripts

### 1. `fixNullSessionIds.js` - Clean Null SessionIds

**Purpose:** Fixes MongoDB duplicate key errors by assigning unique sessionIds to all conversations that have null sessionIds.

**Usage:**
```bash
# Set environment variables
export MONGODB_URI="your-mongodb-connection-string"
export MONGODB_DB="lmx-consulting"

# Run the script
node src/scripts/fixNullSessionIds.js
```

**What it does:**
- Finds all conversations with `sessionId: null`
- Assigns unique UUIDs to each
- Verifies no duplicates remain
- Creates sessionId index if missing

**When to run:**
- After deploying the sessionId fix
- If you encounter E11000 duplicate key errors
- During database migrations

---

### 2. `testConversationCreation.js` - Test SessionId Generation

**Purpose:** Validates that new conversations are created with unique sessionIds and no duplicate key errors occur.

**Usage:**
```bash
node src/scripts/testConversationCreation.js
```

**What it tests:**
- ✅ Creating conversations WITH sessionId
- ✅ Creating conversations WITHOUT sessionId (should fail)
- ✅ Rapid creation of multiple conversations
- ✅ Verifies no null sessionIds exist
- ✅ Database cleanup after tests

**When to run:**
- After running fixNullSessionIds.js
- Before deploying to production
- As part of CI/CD pipeline
- When debugging conversation creation issues

---

### 3. `migrateCollections.js` - Database Migration

**Purpose:** Migrates old database schema to new restructured schema.

**Usage:**
```bash
node src/scripts/migrateCollections.js
```

---

## Quick Start

### First Time Setup
```bash
# 1. Fix existing null sessionIds
export MONGODB_URI="your-connection-string"
export MONGODB_DB="lmx-consulting"
node src/scripts/fixNullSessionIds.js

# 2. Test that everything works
node src/scripts/testConversationCreation.js

# 3. Verify in MongoDB
# All conversations should now have unique sessionIds
```

### Regular Testing
```bash
# Run tests before deployment
node src/scripts/testConversationCreation.js
```

---

## Environment Variables

All scripts use these environment variables:

| Variable | Default | Description |
|----------|---------|-------------|
| `MONGODB_URI` | `mongodb://localhost:27017` | MongoDB connection string |
| `MONGODB_DB` | `lmx-consulting` | Database name |

**Example `.env.local`:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
MONGODB_DB=lmx-consulting
```

---

## Troubleshooting

### "Connection refused" error
- Ensure MongoDB is running
- Verify MONGODB_URI is correct
- Check network connectivity

### "Authentication failed" error
- Verify MongoDB credentials
- Check user permissions
- Ensure IP whitelist includes your IP

### "Database not found" error
- Verify MONGODB_DB name is correct
- Database will be created if it doesn't exist

---

## Safety Notes

- ✅ All scripts are read-only by default (except fixNullSessionIds.js)
- ✅ testConversationCreation.js cleans up its test data
- ✅ Always backup database before running migrations
- ✅ Test in development environment first

---

## Need Help?

See the full documentation in `SESSIONID_FIX_GUIDE.md`

---

## Admin Management Scripts (NEW)

### 1. `makeAdmin.js` - Promote User to Admin

**Purpose:** Grant admin privileges to a user

**Usage:**
```bash
node src/scripts/makeAdmin.js email@example.com
```

**What it does:**
- Finds user by email
- Sets `isAdmin: true`
- Prints updated user document
- Shows verification details

---

### 2. `checkAdmin.js` - Check Admin Status

**Purpose:** Verify if a user has admin privileges

**Usage:**
```bash
node src/scripts/checkAdmin.js email@example.com
```

**What it does:**
- Finds user by email  
- Shows complete user document
- Displays admin status clearly
- Provides next steps if not admin

---

### 3. `listAdmins.js` - List All Admins

**Purpose:** Display all users with admin privileges

**Usage:**
```bash
node src/scripts/listAdmins.js
```

**What it does:**
- Queries all users with `isAdmin: true`
- Shows total user count
- Lists each admin with details

---

### 4. `ensureAdminField.js` - Database Migration

**Purpose:** One-time migration to ensure all users have `isAdmin` field

**Usage:**
```bash
node src/scripts/ensureAdminField.js
```

**What it does:**
- Scans all users in database
- Finds users without `isAdmin` field
- Sets `isAdmin: false` for those users
- Prevents undefined values
- Shows before/after statistics

---

## Admin Setup Workflow

```bash
# 1. Sign up a user account via the website
# 2. Run migration to ensure all users have isAdmin field
node src/scripts/ensureAdminField.js

# 3. Promote your account to admin
node src/scripts/makeAdmin.js your-email@example.com

# 4. Verify it worked
node src/scripts/checkAdmin.js your-email@example.com

# 5. List all admins
node src/scripts/listAdmins.js
```