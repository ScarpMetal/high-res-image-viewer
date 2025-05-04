/**
 * Returns true if the app is running in development mode
 */
export function isDevelopment(): boolean {
  return import.meta.env.DEV === true;
}

/**
 * Returns true if the app is running in production mode
 */
export function isProduction(): boolean {
  return import.meta.env.PROD === true;
}
