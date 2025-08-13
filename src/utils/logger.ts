// Simple logger utility for better error handling
export const logger = {
  error: (message: string, error?: unknown) => {
    if (import.meta.env.DEV) {
      console.error(message, error);
    }
  },
  
  warn: (message: string, error?: unknown) => {
    if (import.meta.env.DEV) {
      console.warn(message, error);
    }
  },
  
  info: (message: string) => {
    if (import.meta.env.DEV) {
      console.info(message);
    }
  }
};