const admin = require('../config/firebaseAdmin');

/**
 * --------------------------------------------------------------------------
 * Verify Firebase Authentication Token
 * --------------------------------------------------------------------------
 */

const verifyFirebaseToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authorization token is missing.',
      });
    }

    const token = authHeader.split(' ')[1];

    const decodedToken = await admin.auth().verifyIdToken(token);

    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      emailVerified: decodedToken.email_verified,
      name: decodedToken.name || '',
      picture: decodedToken.picture || '',
    };

    next();
  } catch (error) {
    console.error('Firebase authentication error:', error);

    return res.status(401).json({
      success: false,
      message: 'Invalid or expired Firebase authentication token.',
    });
  }
};

/**
 * --------------------------------------------------------------------------
 * Role Authorization
 * --------------------------------------------------------------------------
 */

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User authentication required.',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to access this resource.',
      });
    }

    next();
  };
};

module.exports = {
  verifyFirebaseToken,
  authorize,
};
