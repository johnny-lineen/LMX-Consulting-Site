/**
 * Environment variable type definitions for TypeScript strict mode
 * This file provides type safety for all environment variables used in the application
 */

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // Database Configuration
      MONGODB_URI: string;
      MONGODB_DB?: string;
      
      // Authentication & Security
      JWT_SECRET: string;
      
      // OpenAI API Configuration
      OPENAI_API_KEY: string;
      
      // Development & Build Configuration
      NODE_ENV: 'development' | 'production' | 'test';
      
      // Resource Management
      RESOURCE_IMPORT_PATH?: string;
      
      // Client-side public variables (prefixed with NEXT_PUBLIC_)
      NEXT_PUBLIC_APP_NAME?: string;
      NEXT_PUBLIC_APP_URL?: string;
      NEXT_PUBLIC_APP_DESCRIPTION?: string;
    }
  }
}

export {};
