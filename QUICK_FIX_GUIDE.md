# 🚀 Quick Fix Guide - Conversation Start API

## Issue
POST `/api/conversation/start` returns 500 errors.

## Root Cause
Missing npm packages: `mongoose`, `jsonwebtoken`, `bcryptjs`, `mongodb`

---

## ⚡ Quick Fix (3 Steps)

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

```bash
# Copy environment template
cp env.example .env.local

# Edit with your credentials (use any text editor)
notepad .env.local   # Windows
nano .env.local      # Mac/Linux
```

**Required values in `.env.local`:**
```env
MONGODB_URI=mongodb+srv://your-connection-string-here
MONGODB_DB=lmx-consulting
JWT_SECRET=your-secret-key-at-least-32-chars
OPENAI_API_KEY=sk-your-openai-key
```

### 3. Restart Server

```bash
npm run dev
```

---

## ✅ Test It Works

**Browser console (http://localhost:3000):**
```javascript
fetch('/api/conversation/start', { method: 'POST' })
  .then(r => r.json())
  .then(console.log);
```

**Expected:** Status 201 with conversation data

**If you get 401:** Log in first, then try again

---

## 🔍 Check Logs

You should see detailed logs:
```
[conversation/start] Starting conversation creation...
[conversation/start] User authenticated: { userId: '...', email: '...' }
[conversation/start] MongoDB connected successfully
[conversation/start] Conversation saved successfully
```

---

## 📚 Full Documentation

- **Detailed guide:** `DEBUGGING_CONVERSATION_START.md`
- **Complete summary:** `CONVERSATION_START_FIX_SUMMARY.md`
- **SessionId fix:** `SESSIONID_FIX_GUIDE.md`

---

## 🆘 Still Having Issues?

### Module Not Found Error
```bash
rm -rf node_modules package-lock.json
npm install
```

### Environment Variable Error
```bash
# Verify .env.local exists and has all variables
cat .env.local
```

### MongoDB Connection Error
- Check MONGODB_URI is correct
- Verify IP whitelist in MongoDB Atlas
- Test connection string in MongoDB Compass

### Authentication Error (401)
- Log in to get JWT token first
- Check cookie is being set

---

**That's it!** You should now be able to create conversations without 500 errors.

✅ Dependencies installed  
✅ Environment configured  
✅ Server restarted  
✅ API working  
