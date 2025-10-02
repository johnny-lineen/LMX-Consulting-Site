# 🔧 Environment Variables Setup Guide

## Overview

This project uses a robust environment variable system that behaves differently in development vs production:

- **Development**: Missing variables show warnings but allow the app to boot
- **Production**: Missing variables cause build/startup failure for reliability

## 📁 Local Development Setup

### 1. Create `.env.local` File

Create a `.env.local` file in your project root (same directory as `package.json`):

```bash
# Copy the example file
cp env.example .env.local
```

### 2. Required Environment Variables

Add these variables to your `.env.local` file:

```bash
# ===========================================
# REQUIRED VARIABLES
# ===========================================

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/lmx-consulting
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/lmx-consulting

# Authentication & Security
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random

# OpenAI API Configuration
OPENAI_API_KEY=sk-your-openai-api-key-here

# ===========================================
# OPTIONAL VARIABLES (have defaults)
# ===========================================

# Database Name (defaults to 'lmx-consulting')
MONGODB_DB=lmx-consulting

# Resource Import Path (defaults to platform-specific path)
RESOURCE_IMPORT_PATH=C:/Users/jline/OneDrive/Desktop/resources

# ===========================================
# PUBLIC VARIABLES (safe for client-side)
# ===========================================

# Application Branding
NEXT_PUBLIC_APP_NAME=LMX Consulting
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_DESCRIPTION=Strategic consulting and automation solutions
```

### 3. Development Behavior

When you run `npm run dev`:

- ✅ **With all variables**: App runs normally with full functionality
- ⚠️ **With missing variables**: App boots with warnings, some features disabled

Example warning output:
```
⚠️  Missing environment variable: OPENAI_API_KEY
📝 Description: OpenAI API key for AI features
💡 Example: OPENAI_API_KEY=sk-your-openai-api-key-here
🔧 Add OPENAI_API_KEY to your .env.local file or Vercel dashboard

📁 Create a .env.local file in your project root with this variable.
🚀 The app will continue running but some features may not work.
```

## 🚀 Production Deployment

### Vercel Deployment

1. **Go to your Vercel dashboard**
2. **Select your project**
3. **Navigate to Settings > Environment Variables**
4. **Add all required variables:**

| Variable | Value | Environment |
|----------|-------|-------------|
| `MONGODB_URI` | `mongodb+srv://...` | Production, Preview, Development |
| `JWT_SECRET` | `your-production-secret` | Production, Preview, Development |
| `OPENAI_API_KEY` | `sk-prod-key...` | Production, Preview, Development |

### Production Behavior

- ❌ **Missing required variables**: Build/deployment fails immediately
- ✅ **All variables present**: Deployment succeeds

Example production error:
```
Missing required environment variables: MONGODB_URI, JWT_SECRET. 
Set these in your Vercel dashboard or deployment environment.
```

## 🛠️ Environment Variable Usage

### For Developers

#### ✅ Correct Usage

```typescript
import { config, getRequiredEnvVar, hasRequiredEnvVar } from '@/lib/config';

// Use the config object (recommended)
const dbUri = config.database.uri;
const jwtSecret = config.auth.jwtSecret;

// Check if feature is available
if (config.features.aiChat) {
  // OpenAI functionality
}

// Direct access when needed
const customVar = getRequiredEnvVar('MONGODB_URI');

// Check availability
if (hasRequiredEnvVar('OPENAI_API_KEY')) {
  // AI features enabled
}
```

#### ❌ Incorrect Usage

```typescript
// DON'T: Direct process.env access
const dbUri = process.env.MONGODB_URI; // No validation or fallback

// DON'T: Client-side access to sensitive vars
const apiKey = process.env.OPENAI_API_KEY; // Security risk

// DON'T: Hard-coded values
const secret = 'hardcoded-secret'; // Not configurable
```

### Client-Side Variables

Only variables prefixed with `NEXT_PUBLIC_` are safe for client-side use:

```typescript
import { getPublicEnvVar } from '@/lib/config';

// ✅ Safe for client-side
const appName = getPublicEnvVar('NEXT_PUBLIC_APP_NAME');
const appUrl = process.env.NEXT_PUBLIC_APP_URL; // Also OK

// ❌ Never do this on client-side
const apiKey = process.env.OPENAI_API_KEY; // Security vulnerability!
```

## 🔍 Troubleshooting

### Common Issues

#### 1. "App won't start in development"
- **Check**: Do you have a `.env.local` file?
- **Solution**: Create `.env.local` with required variables

#### 2. "Features not working in development"
- **Check**: Console for environment variable warnings
- **Solution**: Add missing variables to `.env.local`

#### 3. "Production build fails"
- **Check**: Vercel dashboard environment variables
- **Solution**: Add all required variables to production environment

#### 4. "Variables not loading"
- **Check**: File is named `.env.local` (not `.env`)
- **Check**: File is in project root (same level as `package.json`)
- **Check**: No spaces around `=` in variable definitions

### Debugging Commands

```bash
# Check if .env.local exists
ls -la .env.local

# Test environment loading
npm run dev

# Check production build
npm run build
```

## 📋 Environment Variable Reference

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | Database connection string | `mongodb://localhost:27017/lmx-consulting` |
| `JWT_SECRET` | Authentication secret | `your-super-secret-jwt-key-here` |
| `OPENAI_API_KEY` | OpenAI API access | `sk-your-openai-api-key-here` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_DB` | Database name | `lmx-consulting` |
| `RESOURCE_IMPORT_PATH` | Resource import directory | Platform-specific |
| `NEXT_PUBLIC_APP_NAME` | Application name | `LMX Consulting` |
| `NEXT_PUBLIC_APP_URL` | Application URL | `http://localhost:3000` |
| `NEXT_PUBLIC_APP_DESCRIPTION` | App description | `Strategic consulting...` |

## 🔒 Security Best Practices

### Development
- ✅ Use `.env.local` for local development
- ✅ Never commit `.env.local` to version control
- ✅ Use strong, unique values for `JWT_SECRET`
- ✅ Keep API keys secure and rotate regularly

### Production
- ✅ Set environment variables in Vercel dashboard
- ✅ Use different values for development/production
- ✅ Monitor for environment variable exposure
- ✅ Use secrets management for sensitive data

### Client-Side Safety
- ✅ Only use `NEXT_PUBLIC_*` variables on client
- ✅ Never expose API keys or secrets to client
- ✅ Validate all client-accessible variables

## 🆘 Getting Help

If you encounter issues:

1. **Check this documentation** for common solutions
2. **Review console output** for specific error messages
3. **Verify file locations** and naming conventions
4. **Test with minimal configuration** to isolate issues

---

**Remember**: The app is designed to be forgiving in development but strict in production. This ensures a smooth development experience while maintaining production reliability.
