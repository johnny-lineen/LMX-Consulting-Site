# PHASE 1 — Database Admin Flag Verification

## Step 1: ✅ User Model Verification

**File:** `src/models/User.ts` (lines 31-34)

```typescript
isAdmin: {
  type: Boolean,
  default: false
}
```

**Status:** ✅ **VERIFIED**
- Field name: `isAdmin` ✓
- Type: Boolean ✓
- Default value: `false` ✓
- Required: No (optional field with default) ✓

**TypeScript Interface:** (lines 3-10)
```typescript
export interface IUser {
  _id: string;
  email: string;
  password: string;
  name: string;
  isAdmin: boolean;  // ✓ Defined
  createdAt: Date;
}
```

---

## Step 2: Database Inspection Commands

### Check User Document in MongoDB

**Using MongoDB Compass:**
1. Connect to your MongoDB instance
2. Select your database
3. Open `users` collection
4. Find document by email
5. Check `isAdmin` field

**Using MongoDB Shell:**
```javascript
// Connect to your MongoDB
use your_database_name

// Find user by email
db.users.findOne({ email: "your-email@example.com" })

// Expected output should include:
// {
//   _id: ObjectId("..."),
//   email: "your-email@example.com",
//   name: "Your Name",
//   isAdmin: true,  // ← Should be true for admin
//   ...
// }
```

**Using Node.js Script (created below):**
```bash
node src/scripts/checkAdmin.js your-email@example.com
```

---

## Step 3: ✅ makeAdmin.js Verification

**File:** `src/scripts/makeAdmin.js`

**Current Features:**
- ✅ Loads environment from `.env.local`
- ✅ Connects to MongoDB
- ✅ Finds user by email
- ✅ Sets `isAdmin: true`
- ⚠️ Prints success message (but not full user doc)

**Enhancement Needed:** Print updated user document for verification

---

## Step 4: Running the makeAdmin Script

**Command:**
```bash
node src/scripts/makeAdmin.js your-email@example.com
```

**Example:**
```bash
node src/scripts/makeAdmin.js admin@lmx-consulting.com
```

**Expected Output:**
```
Connecting to MongoDB...
Connected successfully

✓ Success! User 'admin@lmx-consulting.com' is now an admin

You can now:
1. Log in with this account
2. Access the admin panel at /admin
3. Upload and manage resources

Database connection closed
```

**If Already Admin:**
```
Connecting to MongoDB...
Connected successfully
User 'admin@lmx-consulting.com' is already an admin
Database connection closed
```

**If User Not Found:**
```
Connecting to MongoDB...
Connected successfully
Error: User with email 'admin@lmx-consulting.com' not found

Make sure the user exists in the database first.
```

---

## Step 5: Migration Script

A one-time migration to ensure all existing users have `isAdmin` field.

**Status:** Script created (see below)

---

## Scripts Created

1. ✅ Enhanced makeAdmin.js with user doc printing
2. ✅ checkAdmin.js - Check if user is admin
3. ✅ ensureAdminField.js - Migration to add isAdmin to all users
4. ✅ listAdmins.js - List all admin users

---

## Verification Checklist

- [x] User model has `isAdmin: boolean` field
- [x] Default value is `false`
- [x] makeAdmin.js loads environment variables
- [x] makeAdmin.js connects to MongoDB
- [x] makeAdmin.js finds user by email
- [x] makeAdmin.js sets `isAdmin: true`
- [ ] Run makeAdmin.js for your email
- [ ] Verify database shows `isAdmin: true`
- [ ] Run migration to ensure all users have field
- [ ] Test admin panel access

---

## Next Steps

1. Run the check script to see current admin status
2. Run makeAdmin.js to promote a user
3. Run migration to ensure all users have the field
4. Verify admin panel access works
