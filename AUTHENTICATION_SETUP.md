# Authentication System Setup

This document outlines the complete authentication system implementation for the LMX Consulting Next.js application.

## 🚀 **Features Implemented**

### **1. User Authentication**
- ✅ User registration with email/password
- ✅ User login with email/password
- ✅ Secure password hashing with bcryptjs
- ✅ JWT token-based authentication
- ✅ HttpOnly cookies for session management
- ✅ User logout functionality

### **2. UI Components**
- ✅ Login/Signup modal with tab switching
- ✅ User dropdown menu in navbar
- ✅ Protected route wrapper
- ✅ Responsive design for mobile/desktop

### **3. Security Features**
- ✅ Password validation (minimum 6 characters)
- ✅ Email format validation
- ✅ Duplicate email prevention
- ✅ Secure token storage in HttpOnly cookies
- ✅ Token expiration (7 days)
- ✅ Input sanitization and validation

### **4. Protected Routes**
- ✅ `/resources` - Requires authentication
- ✅ `/bot` - Requires authentication
- ✅ Automatic redirect to intended destination after login

## 📁 **File Structure**

```
src/
├── models/
│   └── User.ts                    # MongoDB User schema
├── lib/
│   └── mongodb.ts                 # MongoDB connection utility
├── utils/
│   └── auth.ts                    # JWT and auth helper functions
├── context/
│   └── AuthContext.tsx            # React context for auth state
├── components/
│   ├── AuthModal.tsx              # Login/Signup modal
│   ├── ProtectedRoute.tsx         # Route protection wrapper
│   └── Navbar.tsx                 # Updated with auth UI
├── pages/
│   ├── api/auth/
│   │   ├── signup.ts              # User registration API
│   │   ├── login.ts               # User login API
│   │   ├── logout.ts              # User logout API
│   │   └── me.ts                  # Get current user API
│   ├── resources.tsx              # Protected page
│   ├── bot.tsx                    # Protected page
│   └── _app.tsx                   # Updated with AuthProvider
```

## 🔧 **Setup Instructions**

### **1. Install Dependencies**
```bash
npm install bcryptjs jsonwebtoken cookie mongoose
npm install @types/bcryptjs @types/jsonwebtoken @types/cookie
```

### **2. Environment Variables**
Create a `.env.local` file in the root directory:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name

# JWT Secret (generate a strong random string)
JWT_SECRET=your-super-secret-jwt-key-here

# Next.js Environment
NODE_ENV=development
```

### **3. MongoDB Setup**
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Add it to your `.env.local` file
5. The User model will be created automatically

### **4. JWT Secret**
Generate a strong JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## 🎯 **Usage Examples**

### **Login a User**
```typescript
const { login } = useAuth();
const result = await login('user@example.com', 'password123');
if (result.success) {
  // User is logged in
} else {
  // Handle error: result.error
}
```

### **Sign Up a User**
```typescript
const { signup } = useAuth();
const result = await signup('John Doe', 'user@example.com', 'password123');
if (result.success) {
  // User is registered and logged in
} else {
  // Handle error: result.error
}
```

### **Check Authentication Status**
```typescript
const { user, loading } = useAuth();
if (loading) return <div>Loading...</div>;
if (user) {
  // User is authenticated
} else {
  // User is not authenticated
}
```

### **Protect a Page**
```typescript
import ProtectedRoute from '@/components/ProtectedRoute';

export default function MyPage() {
  return (
    <ProtectedRoute>
      <div>This content is only visible to authenticated users</div>
    </ProtectedRoute>
  );
}
```

## 🔒 **Security Considerations**

### **Password Security**
- Passwords are hashed with bcryptjs (12 salt rounds)
- Minimum 6 character requirement
- Passwords are never stored in plain text

### **Token Security**
- JWT tokens are stored in HttpOnly cookies
- Tokens expire after 7 days
- Secure flag enabled in production
- SameSite=Strict for CSRF protection

### **Input Validation**
- Email format validation
- Password length validation
- Name length validation (max 50 characters)
- Duplicate email prevention

### **Error Handling**
- Generic error messages to prevent information leakage
- Proper HTTP status codes
- Input sanitization

## 🧪 **Testing the Implementation**

### **1. Test User Registration**
1. Click "Login" in the navbar
2. Switch to "Sign Up" tab
3. Fill in the form with valid data
4. Submit and verify success

### **2. Test User Login**
1. Click "Login" in the navbar
2. Enter valid credentials
3. Submit and verify success

### **3. Test Protected Routes**
1. Try to access `/resources` or `/bot` without logging in
2. Verify the login modal appears
3. Login and verify redirect to intended page

### **4. Test User Menu**
1. After logging in, click on your name in the navbar
2. Verify dropdown appears with "Account" and "Sign Out" options
3. Test logout functionality

## 🐛 **Troubleshooting**

### **Common Issues**

1. **"MongoDB connection failed"**
   - Check your MONGODB_URI in `.env.local`
   - Ensure your IP is whitelisted in MongoDB Atlas
   - Verify the database name exists

2. **"JWT secret not defined"**
   - Add JWT_SECRET to your `.env.local` file
   - Restart your development server

3. **"User already exists"**
   - This is expected behavior for duplicate emails
   - Use a different email or try logging in instead

4. **"Invalid email or password"**
   - Check your credentials
   - Ensure the user exists in the database
   - Verify password is correct

### **Debug Mode**
Add console logs to see what's happening:
```typescript
console.log('Auth state:', { user, loading });
console.log('API response:', response);
```

## 🚀 **Next Steps**

1. **Email Verification**: Add email verification for new accounts
2. **Password Reset**: Implement forgot password functionality
3. **Social Login**: Add Google/GitHub OAuth
4. **User Profiles**: Create user profile management
5. **Admin Panel**: Add admin user roles and permissions

## 📚 **API Endpoints**

### **POST /api/auth/signup**
Register a new user
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### **POST /api/auth/login**
Login a user
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### **POST /api/auth/logout**
Logout current user (no body required)

### **GET /api/auth/me**
Get current user information (requires authentication)

---

**Note**: This authentication system is production-ready with proper security measures. Make sure to use strong JWT secrets and secure MongoDB connections in production.
