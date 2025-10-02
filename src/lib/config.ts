/**
 * Environment configuration utility with validation and type safety
 * Provides clean error messages and fallbacks for all environment variables
 */

// Required environment variables with validation
const requiredEnvVars = {
  MONGODB_URI: {
    description: 'MongoDB connection string',
    example: 'mongodb://localhost:27017/your-database',
    help: 'Add MONGODB_URI to your .env.local file or Vercel dashboard'
  },
  JWT_SECRET: {
    description: 'JWT secret for authentication',
    example: 'your-super-secret-jwt-key-here',
    help: 'Add JWT_SECRET to your .env.local file or Vercel dashboard'
  },
  OPENAI_API_KEY: {
    description: 'OpenAI API key for AI features',
    example: 'sk-your-openai-api-key-here',
    help: 'Add OPENAI_API_KEY to your .env.local file or Vercel dashboard'
  }
} as const;

// Optional environment variables with defaults
const optionalEnvVars = {
  MONGODB_DB: 'lmx-consulting',
  RESOURCE_IMPORT_PATH: process.platform === 'win32' 
    ? 'C:/Users/jline/OneDrive/Desktop/resources' 
    : '/resources-import',
  NEXT_PUBLIC_APP_NAME: 'LMX Consulting',
  NEXT_PUBLIC_APP_URL: 'http://localhost:3000',
  NEXT_PUBLIC_APP_DESCRIPTION: 'Strategic consulting and automation solutions'
} as const;

/**
 * Validates and returns a required environment variable
 * - In PRODUCTION: Throws strict error if missing (fails build/startup)
 * - In DEVELOPMENT: Returns empty string and logs warning (allows app to boot)
 * 
 * @param key - The environment variable key (must be in requiredEnvVars)
 * @returns The environment variable value, or empty string in development if missing
 */
export function getRequiredEnvVar(key: keyof typeof requiredEnvVars): string {
  const value = process.env[key];
  
  if (!value) {
    const config = requiredEnvVars[key];
    const isDev = process.env.NODE_ENV === 'development';
    
    if (isDev) {
      // In development: Log warning but don't crash
      const warningMessage = [
        `⚠️  Missing environment variable: ${key}`,
        `📝 Description: ${config.description}`,
        `💡 Example: ${key}=${config.example}`,
        `🔧 ${config.help}`,
        '',
        '📁 Create a .env.local file in your project root with this variable.',
        '🚀 The app will continue running but some features may not work.'
      ].join('\n');
      
      console.warn(warningMessage);
      console.warn(''); // Empty line for readability
      
      // Return empty string to allow app to continue
      return '';
    } else {
      // In production: Throw strict error to fail build/startup
      throw new Error(`Missing required environment variable: ${key}. Set this in your Vercel dashboard or deployment environment.`);
    }
  }
  
  return value;
}

/**
 * Returns an optional environment variable with fallback
 */
function getOptionalEnvVar<T extends keyof typeof optionalEnvVars>(
  key: T, 
  fallback?: string
): string {
  return process.env[key] || fallback || optionalEnvVars[key];
}

/**
 * Environment configuration object with validated values
 * In development, missing required vars will be empty strings with warnings
 * In production, missing required vars will cause startup failure
 */
export const config = {
  // Database
  database: {
    uri: getRequiredEnvVar('MONGODB_URI'),
    name: getOptionalEnvVar('MONGODB_DB')
  },
  
  // Authentication
  auth: {
    jwtSecret: getRequiredEnvVar('JWT_SECRET'),
    cookieSecure: process.env.NODE_ENV === 'production'
  },
  
  // AI Services
  ai: {
    openaiApiKey: getRequiredEnvVar('OPENAI_API_KEY')
  },
  
  // Application
  app: {
    nodeEnv: process.env.NODE_ENV || 'development',
    isProduction: process.env.NODE_ENV === 'production',
    isDevelopment: process.env.NODE_ENV === 'development'
  },
  
  // Resource Management
  resources: {
    importPath: getOptionalEnvVar('RESOURCE_IMPORT_PATH')
  },
  
  // Public configuration (safe for client-side)
  public: {
    appName: getOptionalEnvVar('NEXT_PUBLIC_APP_NAME'),
    appUrl: getOptionalEnvVar('NEXT_PUBLIC_APP_URL'),
    appDescription: getOptionalEnvVar('NEXT_PUBLIC_APP_DESCRIPTION')
  },
  
  // Feature flags based on environment variable availability
  features: {
    database: hasRequiredEnvVar('MONGODB_URI'),
    authentication: hasRequiredEnvVar('JWT_SECRET'),
    aiChat: hasRequiredEnvVar('OPENAI_API_KEY')
  }
} as const;

/**
 * Validates all required environment variables on startup
 * - In PRODUCTION: Strict validation - throws error if any required vars are missing
 * - In DEVELOPMENT: Permissive validation - logs warnings but allows app to boot
 */
export function validateEnvironment(): void {
  const missingVars: string[] = [];
  const isDev = process.env.NODE_ENV === 'development';
  
  // Check each required env var
  Object.keys(requiredEnvVars).forEach(key => {
    const value = process.env[key as keyof typeof requiredEnvVars];
    if (!value) {
      missingVars.push(key);
    }
  });
  
  if (missingVars.length > 0) {
    if (isDev) {
      // In development: Log summary but don't crash (individual warnings already logged by getRequiredEnvVar)
      console.warn(`📋 Summary: ${missingVars.length} environment variable(s) missing: ${missingVars.join(', ')}`);
      console.warn('🚀 App will continue running. Add missing variables to .env.local for full functionality.');
      console.warn(''); // Empty line for readability
    } else {
      // In production: Throw error to fail startup
      throw new Error(`Missing required environment variables: ${missingVars.join(', ')}. Set these in your Vercel dashboard or deployment environment.`);
    }
  } else {
    console.log('✅ All required environment variables are present');
  }
}

/**
 * Checks if a required environment variable is available
 * Useful for conditional feature enabling
 * 
 * @param key - The environment variable key
 * @returns true if the variable has a non-empty value
 */
export function hasRequiredEnvVar(key: keyof typeof requiredEnvVars): boolean {
  const value = process.env[key];
  return Boolean(value && value.trim() !== '');
}

/**
 * Gets a client-safe environment variable
 * Only returns variables prefixed with NEXT_PUBLIC_
 * 
 * @param key - The environment variable key (must start with NEXT_PUBLIC_)
 * @returns The environment variable value or undefined
 */
export function getPublicEnvVar(key: string): string | undefined {
  if (!key.startsWith('NEXT_PUBLIC_')) {
    console.warn(`⚠️ Attempted to access non-public env var on client: ${key}`);
    return undefined;
  }
  
  return process.env[key];
}

/**
 * Development helper to log current environment configuration
 * Only logs non-sensitive information
 */
export function logEnvironmentConfig(): void {
  if (config.app.isDevelopment) {
    console.log('🔧 Environment Configuration:');
    console.log(`  NODE_ENV: ${config.app.nodeEnv}`);
    console.log(`  Database: ${config.database.uri.replace(/\/\/.*@/, '//***@')}`); // Hide credentials
    console.log(`  JWT Secret: ${config.auth.jwtSecret ? '***' : 'NOT SET'}`);
    console.log(`  OpenAI API: ${config.ai.openaiApiKey ? '***' : 'NOT SET'}`);
    console.log(`  Resource Import Path: ${config.resources.importPath}`);
    console.log(`  Public App Name: ${config.public.appName}`);
  }
}
