const express = require('express');

const router = express.Router();

const authController = require('../controllers/authController');
const { verifyFirebaseToken } = require('../middleware/authMiddleware');

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

// Firebase user registration.
// Firebase ID Token is sent in Authorization header.
router.post(
  '/register',
  verifyFirebaseToken,
  authController.register
);

// Login after Firebase sign-in.
// Backend verifies Firebase token and returns PostgreSQL profile.
router.post(
  '/login',
  verifyFirebaseToken,
  authController.login
);

// Optional email verification endpoint
router.post(
  '/verify-email',
  verifyFirebaseToken,
  authController.verifyEmail
);

// Refresh profile
router.get(
  '/me',
  verifyFirebaseToken,
  authController.getCurrentUser
);

/*
|--------------------------------------------------------------------------
| Protected Routes
|--------------------------------------------------------------------------
*/

router.post(
  '/logout',
  verifyFirebaseToken,
  authController.logout
);

module.exports = router;
