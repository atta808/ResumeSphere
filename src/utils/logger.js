import ENV from '../config/env';

/**
 * Centralized structured logger.
 * Replaces console.log/warn/error across the application.
 */
class Logger {
  static _formatMessage(level, message, data) {
    const timestamp = new Date().toISOString();
    return {
      timestamp,
      level,
      message,
      ...(data && { data }),
    };
  }

  static info(message, data = null) {
    if (ENV.APP_ENV !== 'production' || ENV.DEBUG_MODE) {
      console.info(JSON.stringify(this._formatMessage('INFO', message, data)));
    }
  }

  static warn(message, data = null) {
    if (ENV.APP_ENV !== 'production' || ENV.DEBUG_MODE) {
      console.warn(JSON.stringify(this._formatMessage('WARN', message, data)));
    }
  }

  static error(message, error = null, context = null) {
    // Errors should generally be logged in production, but structurally
    const payload = this._formatMessage('ERROR', message, {
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      context,
    });

    // Use console.error directly so it can be picked up by native crash reporters if any
    console.error(JSON.stringify(payload));
  }

  static debug(message, data = null) {
    if (ENV.APP_ENV !== 'production' && ENV.DEBUG_MODE) {
      console.debug(JSON.stringify(this._formatMessage('DEBUG', message, data)));
    }
  }
}

export default Logger;
