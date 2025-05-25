// Pagination constants
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
} as const;

// File upload constants
export const FILE_UPLOAD = {
  MAX_SIZE_BYTES: 5 * 1024 * 1024, // 5MB
  MAX_SIZE_MB: 5,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
} as const;

// Authentication constants
export const AUTH = {
  PASSWORD_MIN_LENGTH: 8,
  JWT_EXPIRY: '7d',
  JWT_EXPIRY_SECONDS: 7 * 24 * 60 * 60, // 7 days in seconds
  COOKIE_MAX_AGE: 7 * 24 * 60 * 60, // 7 days in seconds
} as const;

// HTTP Status codes (commonly used ones)
export const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// Common error messages
export const ERROR_MESSAGES = {
  MISSING_REQUIRED_FIELDS: 'Missing required fields',
  USER_ALREADY_EXISTS: 'User already exists',
  INVALID_CREDENTIALS: 'Invalid credentials',
  AUTHENTICATION_REQUIRED: 'Authentication required',
  USER_NOT_FOUND: 'User not found',
  INVALID_TOKEN: 'Invalid token',
  FILE_TOO_LARGE: 'File size must be less than 5MB',
  INVALID_FILE_TYPE: 'Only image files are allowed',
  PASSWORD_TOO_SHORT: 'Password must be at least 8 characters long',
  PASSWORDS_DONT_MATCH: 'Passwords do not match',
} as const; 