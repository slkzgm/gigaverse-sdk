// path: src/utils/logger.ts

/**
 * Minimal logger for production use.
 */

export const logger = {
  info: (msg: string): void => console.log(`[INFO] ${msg}`),
  error: (msg: string): void => console.error(`[ERROR] ${msg}`),
  warn: (msg: string): void => console.warn(`[WARN] ${msg}`),
  success: (msg: string): void => console.log(`[SUCCESS] ${msg}`),
};
