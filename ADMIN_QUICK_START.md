# Admin Panel Quick Start Guide

## 🚀 Getting Started (5 Minutes)

### Step 1: Create Your First Admin User

```bash
# Make sure you have an existing user account first
# (Sign up at http://localhost:3000 if needed)

# Then run this command with your email:
node src/scripts/makeAdmin.js your-email@example.com
```

**Expected Output:**
```
Connecting to MongoDB...
Connected successfully

✓ Success! User 'your-email@example.com' is now an admin

You can now:
1. Log in with this account
2. Access the admin panel at /admin
3. Upload and manage resources

Database connection closed
```

### Step 2: Log In

1. Go to `http://localhost:3000`
2. Click "Login" in top right
3. Enter your admin credentials
4. You should now see your name in the top right

### Step 3: Access Admin Panel

1. Click on your name (top right corner)
2. You should see a dropdown menu with:
   - **Admin Panel** ← This is new! (Only visible to admins)
   - Account
   - Sign Out
3. Click "Admin Panel"
4. You're now at `/admin/resources`

## ✅ Verification

### How to know it's working:

**For Admin Users:**
- ✅ You see "Admin Panel" in account dropdown
- ✅ Clicking it takes you to `/admin/resources`
- ✅ You see the admin resources page
- ✅ Page shows "Welcome, [Your Name]"

**For Regular Users:**
- ✅ No "Admin Panel" option in dropdown
- ✅ Visiting `/admin/resources` directly redirects to home
- ✅ Only see Account and Sign Out options

## 🔒 Security Testing

### Test 1: Non-Admin Access
```bash
# Create a regular user (don't run makeAdmin.js)
# Log in as that user
# Check account dropdown
# Result: Should NOT see "Admin Panel" link
```

### Test 2: Direct URL Access
```bash
# As non-admin user, navigate to:
http://localhost:3000/admin/resources

# Result: Should redirect to home page (/)
```

### Test 3: Not Logged In
```bash
# Log out
# Navigate to:
http://localhost:3000/admin/resources

# Result: Should redirect to home page (/)
```

## 📋 Common Tasks

### Make Another User Admin
```bash
node src/scripts/makeAdmin.js another-user@example.com
```

### Check if User is Admin (MongoDB)
```javascript
// In MongoDB shell or Compass:
db.users.findOne({ email: "user@example.com" }, { isAdmin: 1 })

// Should return:
{ "_id": ..., "isAdmin": true }  // For admins
{ "_id": ..., "isAdmin": false } // For regular users
```

### Revoke Admin Access (MongoDB)
```javascript
// In MongoDB shell or Compass:
db.users.updateOne(
  { email: "user@example.com" },
  { $set: { isAdmin: false } }
)
```

## 🎨 UI Components

### Account Dropdown (Admin View)
```
┌─────────────────────┐
│ your@email.com      │
├─────────────────────┤
│ 🛡️  Admin Panel     │ ← NEW
│ ⚙️  Account         │
│ 🚪 Sign Out         │
└─────────────────────┘
```

### Account Dropdown (Regular User View)
```
┌─────────────────────┐
│ your@email.com      │
├─────────────────────┤
│ ⚙️  Account         │
│ 🚪 Sign Out         │
└─────────────────────┘
```

## 🐛 Troubleshooting

### Problem: "Admin Panel" not showing

**Check 1:** Verify database
```bash
# In MongoDB:
db.users.findOne({ email: "your@email.com" })

# Look for: isAdmin: true
```

**Check 2:** Re-login
```bash
# Sometimes you need to log out and back in
# for the new isAdmin status to take effect
```

**Check 3:** Check browser console
```bash
# Open DevTools (F12)
# Check Console tab for errors
# Check Network tab for API responses
```

### Problem: Page redirects to home

**Possible Causes:**
- Not logged in
- Not an admin user
- Session expired

**Solution:**
1. Log out
2. Log back in
3. Try accessing `/admin/resources` again

### Problem: Script says user not found

**Solution:**
```bash
# First create the user by signing up
# Then run the makeAdmin script

# Or check the email spelling:
node src/scripts/makeAdmin.js correct-email@example.com
```

## 📊 Database Schema

### User Document
```javascript
{
  _id: ObjectId("..."),
  email: "admin@example.com",
  password: "$2a$12$...",  // Hashed
  name: "Admin User",
  isAdmin: true,           // ← KEY FIELD
  createdAt: ISODate("..."),
  updatedAt: ISODate("...")
}
```

## 🔐 JWT Token

### Token Payload
```javascript
{
  userId: "...",
  email: "admin@example.com",
  name: "Admin User",
  isAdmin: true,  // ← Included in JWT
  iat: 1234567890,
  exp: 1234567890
}
```

## 🌐 API Responses

### Login Response (Admin)
```json
{
  "success": true,
  "user": {
    "id": "...",
    "email": "admin@example.com",
    "name": "Admin User",
    "isAdmin": true
  },
  "message": "Login successful"
}
```

### Login Response (Regular User)
```json
{
  "success": true,
  "user": {
    "id": "...",
    "email": "user@example.com",
    "name": "Regular User",
    "isAdmin": false
  },
  "message": "Login successful"
}
```

## 📝 Development Tips

### Check Auth State in Components
```typescript
import { useAuth } from '@/context/AuthContext';

function MyComponent() {
  const { user } = useAuth();
  
  console.log('Is Admin?', user?.isAdmin);
  
  if (user?.isAdmin) {
    // Show admin-only features
  }
}
```

### Server-Side Admin Check
```typescript
// In getServerSideProps or API routes:
import { getCurrentUser } from '@/utils/auth';
import { User } from '@/models/User';

const currentUser = getCurrentUser(req);
if (!currentUser) return { redirect: { destination: '/' } };

const user = await User.findById(currentUser.userId);
if (!user?.isAdmin) return { redirect: { destination: '/' } };
```

## 🎯 Next Steps

1. ✅ Create admin user
2. ✅ Test admin panel access
3. ✅ Verify non-admin users can't access
4. 📦 Add resource upload functionality
5. 📊 Add user management
6. 📈 Add analytics dashboard

## 📞 Support

For detailed information, see:
- `ADMIN_PANEL_UPDATE_SUMMARY.md` - Complete technical details
- `RESOURCE_MANAGEMENT_SYSTEM_README.md` - Resource system docs

---

**Happy Administrating! 🎉**
