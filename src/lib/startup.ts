/**
 * Application startup validation and configuration
 * Call this early in your application lifecycle to validate environment
 */

import { validateEnvironment, logEnvironmentConfig } from './config';

/**
 * Initialize and validate the application environment
 * Should be called early in the application startup process
 */
export function initializeApp(): void {
  try {
    console.log('🚀 Initializing LMX Consulting Application...');
    
    // Validate all required environment variables
    validateEnvironment();
    
    // Log configuration in development
    logEnvironmentConfig();
    
    console.log('✅ Application environment validated successfully');
  } catch (error) {
    console.error('❌ Application startup failed:');
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

/**
 * Initialize the application (call this at startup)
 */
if (typeof window === 'undefined') {
  // Only run on server-side
  initializeApp();
}
