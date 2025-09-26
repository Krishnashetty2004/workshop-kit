/**
 * Custom error classes and error handling utilities
 */

export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly details?: any;

  constructor(
    message: string,
    code: string = 'UNKNOWN_ERROR',
    statusCode: number = 500,
    details?: any
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

export class ValidationError extends AppError {
  constructor(message: string, field?: string) {
    super(message, 'VALIDATION_ERROR', 400, { field });
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, id?: string) {
    super(
      `${resource} not found${id ? ` with id: ${id}` : ''}`,
      'NOT_FOUND',
      404,
      { resource, id }
    );
    this.name = 'NotFoundError';
  }
}

export class ApiError extends AppError {
  constructor(message: string, statusCode: number = 500, details?: any) {
    super(message, 'API_ERROR', statusCode, details);
    this.name = 'ApiError';
  }
}

export class WorkshopError extends AppError {
  constructor(message: string, workshopId?: string) {
    super(message, 'WORKSHOP_ERROR', 400, { workshopId });
    this.name = 'WorkshopError';
  }
}

/**
 * Error codes
 */
export const ERROR_CODES = {
  // Validation errors
  INVALID_EMAIL: 'INVALID_EMAIL',
  INVALID_WORKSHOP_DATA: 'INVALID_WORKSHOP_DATA',
  MISSING_REQUIRED_FIELD: 'MISSING_REQUIRED_FIELD',
  
  // API errors
  API_REQUEST_FAILED: 'API_REQUEST_FAILED',
  API_RATE_LIMIT: 'API_RATE_LIMIT',
  API_INVALID_RESPONSE: 'API_INVALID_RESPONSE',
  
  // Workshop errors
  WORKSHOP_NOT_FOUND: 'WORKSHOP_NOT_FOUND',
  WORKSHOP_ALREADY_PUBLISHED: 'WORKSHOP_ALREADY_PUBLISHED',
  WORKSHOP_REGISTRATION_CLOSED: 'WORKSHOP_REGISTRATION_CLOSED',
  
  // System errors
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  FILE_UPLOAD_ERROR: 'FILE_UPLOAD_ERROR',
} as const;

/**
 * Error messages
 */
export const ERROR_MESSAGES = {
  [ERROR_CODES.INVALID_EMAIL]: 'Please provide a valid email address',
  [ERROR_CODES.INVALID_WORKSHOP_DATA]: 'Invalid workshop data provided',
  [ERROR_CODES.MISSING_REQUIRED_FIELD]: 'Required field is missing',
  [ERROR_CODES.API_REQUEST_FAILED]: 'API request failed',
  [ERROR_CODES.API_RATE_LIMIT]: 'API rate limit exceeded',
  [ERROR_CODES.API_INVALID_RESPONSE]: 'Invalid API response',
  [ERROR_CODES.WORKSHOP_NOT_FOUND]: 'Workshop not found',
  [ERROR_CODES.WORKSHOP_ALREADY_PUBLISHED]: 'Workshop is already published',
  [ERROR_CODES.WORKSHOP_REGISTRATION_CLOSED]: 'Workshop registration is closed',
  [ERROR_CODES.INTERNAL_SERVER_ERROR]: 'Internal server error',
  [ERROR_CODES.DATABASE_ERROR]: 'Database error occurred',
  [ERROR_CODES.FILE_UPLOAD_ERROR]: 'File upload failed',
} as const;

/**
 * Create standardized error response
 */
export function createErrorResponse(
  error: Error | AppError,
  includeDetails: boolean = false
) {
  if (error instanceof AppError) {
    return {
      success: false,
      error: {
        code: error.code,
        message: error.message,
        ...(includeDetails && { details: error.details }),
      },
      statusCode: error.statusCode,
    };
  }

  return {
    success: false,
    error: {
      code: ERROR_CODES.INTERNAL_SERVER_ERROR,
      message: error.message || 'An unexpected error occurred',
    },
    statusCode: 500,
  };
}

/**
 * Handle API errors
 */
export function handleApiError(error: any): AppError {
  if (error.response) {
    // API responded with error status
    return new ApiError(
      error.response.data?.message || 'API request failed',
      error.response.status,
      error.response.data
    );
  } else if (error.request) {
    // Request was made but no response received
    return new ApiError('No response from API server', 503);
  } else {
    // Something else happened
    return new ApiError(error.message || 'Unknown API error', 500);
  }
}

/**
 * Validation helpers
 */
export function validateEmail(email: string): void {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ValidationError(ERROR_MESSAGES[ERROR_CODES.INVALID_EMAIL]);
  }
}

export function validateRequired(value: any, fieldName: string): void {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    throw new ValidationError(
      `${fieldName} is required`,
      fieldName
    );
  }
}

export function validateWorkshopData(data: any): void {
  validateRequired(data.prompt, 'Workshop description');
  
  if (data.prompt.length < 10) {
    throw new ValidationError('Workshop description must be at least 10 characters long');
  }
  
  if (data.prompt.length > 1000) {
    throw new ValidationError('Workshop description must be less than 1000 characters');
  }
}
