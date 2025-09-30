# Admin System - Quick Reference Card

## 🚀 Quick Start (First Time)

```bash
# 1. Sign up at http://localhost:3000 (create account)

# 2. Run migration (one time)
node src/scripts/ensureAdminField.js

# 3. Make yourself admin
node src/scripts/makeAdmin.js your-email@example.com

# 4. Verify
node src/scripts/checkAdmin.js your-email@example.com

# 5. Start server and test
npm run dev
# Navigate to http://localhost:3000
# Log in → Click account dropdown → See "Admin Panel" link
```

---

## 📋 Common Commands

```bash
# Check if user is admin
node src/scripts/checkAdmin.js email@example.com

# Make user admin
node src/scripts/makeAdmin.js email@example.com

# List all admins
node src/scripts/listAdmins.js

# Run migration (safe to run anytime)
node src/scripts/ensureAdminField.js
```

---

## 🔍 Verify Admin Access

### In Browser:
1. Log in as admin
2. Click your name (top right)
3. Should see: **"Admin Panel"** link
4. Click it → goes to `/admin/resources`

### In Database:
```javascript
// MongoDB shell
db.users.findOne({ email: "admin@example.com" })
// Should show: isAdmin: true
```

---

## 📂 File Locations

```
src/
├── models/User.ts               (isAdmin field definition)
├── components/Navbar.tsx        (Admin Panel link)
├── pages/admin/resources.tsx    (Admin page)
├── utils/auth.ts                (JWT with isAdmin)
└── scripts/
    ├── makeAdmin.js             (Promote user)
    ├── checkAdmin.js            (Check status)
    ├── listAdmins.js            (List admins)
    └── ensureAdminField.js      (Migration)
```

---

## 🎯 User Workflow

### Admin User:
```
Login → See account dropdown with:
  - Email header
  - Account
  - Admin Panel  ← Only admins see this
  - Sign Out
```

### Regular User:
```
Login → See account dropdown with:
  - Email header
  - Account
  - Sign Out
```

---

## 🛠️ Troubleshooting

| Problem | Solution |
|---------|----------|
| User not found | Sign up via website first |
| Admin Panel link not showing | Run `checkAdmin.js` to verify status |
| Can't access `/admin/resources` | Make sure you're logged in as admin |
| Connection error | Check `.env.local` has `MONGODB_URI` |

---

## 📊 Database Structure

```typescript
User {
  email: string
  password: string (hashed)
  name: string
  isAdmin: boolean  // ← Key field
  createdAt: Date
  updatedAt: Date
}
```

---

## ⚡ One-Line Checks

```bash
# Am I admin?
node src/scripts/checkAdmin.js $(whoami)@example.com

# Who are the admins?
node src/scripts/listAdmins.js

# Make me admin
node src/scripts/makeAdmin.js $(whoami)@example.com
```

---

## 🔐 Security Notes

- ✅ Admin status checked server-side
- ✅ JWT includes `isAdmin` flag
- ✅ `/admin/resources` protected with SSR
- ✅ Unauthorized users redirected
- ✅ No client-side bypass possible

---

## 📞 Need Help?

See full documentation:
- **PHASE_1_COMPLETE_SUMMARY.md** - Complete guide
- **src/scripts/README.md** - Script documentation
- **ADMIN_VERIFICATION_REPORT.md** - System verification
