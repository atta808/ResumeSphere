import { ERROR_CODES } from '../constants/appConstants';
import ENV from '../config/env';
import Logger from '../utils/logger';

/**
 * Centralized ErrorHandler Service
 * Responsible for formatting, logging, and mapping errors.
 */
class ErrorHandler {
  /**
   * Log error to console (and eventually to a remote service if configured)
   */
  static logError(error, context = {}) {
    if (ENV.DEBUG_MODE) {
      Logger.error('ErrorHandler Log:', error, context);
    }
    // TODO: Add remote logging service integration here (e.g., Sentry, Crashlytics)
  }

  /**
   * Process an error and return a standardized format
   * @param {Error|string} error
   * @param {string} code
   * @returns {Object} { message, code, originalError }
   */
  static process(error, code = ERROR_CODES.UNKNOWN_ERROR) {
    let message = 'An unexpected error occurred.';

    if (typeof error === 'string') {
      message = error;
    } else if (error instanceof Error) {
      message = error.message;
    }

    this.logError(error, { code });

    return {
      message,
      code,
      originalError: error
    };
  }

  /**
   * Returns a user-friendly message based on error code
   * @param {Object} processedError
   * @returns {string}
   */
  static getUserFriendlyMessage(processedError) {
    switch (processedError.code) {
      case ERROR_CODES.VALIDATION_ERROR:
        return `Validation failed: ${processedError.message}`;
      case ERROR_CODES.DATABASE_ERROR:
        return 'We encountered a problem saving your data. Please try again.';
      case ERROR_CODES.NETWORK_ERROR:
        return 'Network error. Please check your connection.';
      case ERROR_CODES.NOT_FOUND:
        return 'The requested resource could not be found.';
      default:
        return 'Something went wrong. Please try again later.';
    }
  }
}

export default ErrorHandler;
