const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'ACCESSIBILITY_PRO_ULTRA_HIDDEN_SECRET_KEY';

/**
 * Core Authentication Protection Middleware
 * Intercepts inbound route requests to validate bearer token signatures.
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token within the incoming HTTP Authorization Request Header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      // Split the string structure ("Bearer <token_string>") to isolate the raw cryptographic signature
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access Denied. No authorization token detected in header blocks.'
      });
    }

    // Verify token validity against your environment secret key configuration matrix
    jwt.verify(token, JWT_SECRET, (err, decodedPayload) => {
      if (err) {
        // Handle token variations like expired validations gracefully
        const errorMessage = err.name === 'TokenExpiredError' 
          ? 'Your active authentication session has expired. Please sign in again.' 
          : 'Malformed token verification signature. Authorization mapping rejected.';
        
        return res.status(401).json({ success: false, message: errorMessage });
      }

      /**
       * Inject decoded user session parameters directly into the downstream request pipeline.
       * Decoded properties include: user identifier (uid), email address, and role permissions type.
       */
      req.user = decodedPayload;
      
      // Move execution thread onto the matching controller handler method safely
      next();
    });

  } catch (error) {
    console.error('Security authorization middleware tracking process instance exception:', error.message);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal token verification engine processing pipeline failure.' 
    });
  }
};

/**
 * Granular Role Authorization Access Evaluator
 * Rejects operations if the user's mapped token role does not match specified permission levels.
 * * @param {...string} allowedRoles - Spread list of permitted system roles (e.g., 'owner', 'customer', 'admin')
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    // Ensure route has cleared the root protect middleware verification block first
    if (!req.user) {
      return res.status(500).json({ 
        success: false, 
        message: 'Authorization context missing. Ensure protection middleware runs upstream.' 
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden Action. Your account role (${req.user.role}) lacks structural permissions to modify this endpoint asset.`
      });
    }

    next();
  };
};

module.exports = {
  protect,
  authorize
};