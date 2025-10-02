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
 * Throws a clean error with instructions if missing
 */
function getRequiredEnvVar(key: keyof typeof requiredEnvVars): string {
  const value = process.env[key];
  
  if (!value) {
    const config = requiredEnvVars[key];
    const errorMessage = [
      `❌ Missing required environment variable: ${key}`,
      `📝 Description: ${config.description}`,
      `💡 Example: ${key}=${config.example}`,
      `🔧 ${config.help}`,
      '',
      'For local development, create a .env.local file in your project root.',
      'For production deployment, add this variable to your Vercel dashboard.'
    ].join('\n');
    
    throw new Error(errorMessage);
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
  }
} as const;

/**
 * Validates all required environment variables on startup
 * Call this function early in your application lifecycle
 */
export function validateEnvironment(): void {
  try {
    // This will throw if any required env vars are missing
    Object.keys(requiredEnvVars).forEach(key => {
      getRequiredEnvVar(key as keyof typeof requiredEnvVars);
    });
    
    console.log('✅ All required environment variables are present');
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

/**
 * Gets a client-safe environment variable
 * Only returns variables prefixed with NEXT_PUBLIC_
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
