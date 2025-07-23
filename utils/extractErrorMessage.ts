import { AxiosError } from 'axios';

export const extractErrorMessage = (error: unknown): string => {
  if (typeof error === "string") {
    return error;
  }
  
  if (error instanceof AxiosError) {
    const responseData = error.response?.data;
    
    // Define possible error paths and their handling
    const errorPaths = [
      'message', 
      'error', 
      'details', 
      'errors',
      'validationErrors'
    ];
    
    for (const path of errorPaths) {
      const value = responseData?.[path];
      
      if (value) {
        if (Array.isArray(value)) {
          if (value.length > 0) {
            // Join all messages, handling both strings and objects
            const messages = value.map(item => {
              if (typeof item === 'string') return item;
              if (typeof item === 'object' && item !== null) {
                return item.message || item.error || String(item);
              }
              return String(item);
            });
            return messages.join(', ');
          }
        } else if (typeof value === 'string') {
          return value;
        }
      }
    }
    
    // Fallback to HTTP status info
    return (
      error.response?.statusText ||
      error.message ||
      `HTTP Error ${error.response?.status || 'Unknown'}`
    );
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  if (error && typeof error === 'object' && 'message' in error) {
    return String((error as any).message);
  }
  
  return 'An unknown error occurred';
};