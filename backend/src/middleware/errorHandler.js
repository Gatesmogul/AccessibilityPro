/**
 * Custom Operational Exception Subclass Abstraction
 * Use this to explicitly throw predictable runtime errors across controllers (e.g., 404, 400).
 */
class AppError extends Error {
  /**
   * @param {string} message - Clear informational issue description string
   * @param {number} statusCode - Standard HTTP Status Code mapping integer
   */
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    
    // Marks the exception as predictable/operational so the global handler knows it's safe to display
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Global Express Exception Response Interceptor Pipeline
 */
const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    // Development Mode: Output full debugging footprints including complete stack traces
    return res.status(err.statusCode).json({
      success: false,
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack
    });
  } else {
    // Production Mode: Sanitize output fields cleanly
    let errorCopy = { ...err };
    errorCopy.message = err.message;

    // 1. Trap Malformed PostgreSQL Database UUID/Cast Failures
    if (err.code === '22P02') {
      errorCopy = new AppError('The requested tracking identifier format invalid.', 400);
    }

    // 2. Trap PostgreSQL Database Unique Constraint Conflicts (e.g., duplicate email)
    if (err.code === '23505') {
      errorCopy = new AppError('A record string containing these parameters already exists inside database indexing records.', 409);
    }

    // 3. Trap Malformed JSON payload formatting errors
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
      errorCopy = new AppError('Inbound HTTP payload layout is malformed or invalid JSON structure format.', 400);
    }

    // 4. Trap Expired or Broken Cryptographic Token Signatures
    if (err.name === 'JsonWebTokenError') {
      errorCopy = new AppError('Authorization validation footprint signature rejected. Access denied.', 401);
    }
    if (err.name === 'TokenExpiredError') {
      errorCopy = new AppError('Your signature session validity window expired. Please re-authenticate context.', 401);
    }

    // Send the sanitized operational message out to the mobile front-end application
    if (errorCopy.isOperational) {
      return res.status(errorCopy.statusCode).json({
        success: false,
        status: errorCopy.status,
        message: errorCopy.message
      });
    }

    // Unhandled Infrastructure/Programmatic Drops: Mask internal details from users
    console.error('CRITICAL INTERNAL RUNTIME EXCEPTION FAULT 🚨:', err);
    return res.status(500).json({
      success: false,
      status: 'error',
      message: 'A core platform transaction processing failure occurred. Security parameters locked access.'
    });
  }
};

module.exports = {
  AppError,
  globalErrorHandler
};