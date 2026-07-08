const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

/**
 * ============================================================================
 * Public Authentication Endpoints
 * ============================================================================
 */

/**
 * @route   POST /api/v1/auth/register
 * @desc    Initiates user sign-up by caching data and staging a 6-digit OTP dispatch
 * @access  Public
 */
router.post('/register', authController.register);

/**
 * @route   POST /api/v1/auth/verify-otp
 * @desc    Validates an email OTP token and commits the verified account to PostgreSQL
 * @access  Public
 */
router.post('/verify-otp', authController.verifyOtp);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Authenticates customer or owner credentials and returns a signed session JWT
 * @access  Public
 */
router.post('/login', authController.login);

/**
 * ============================================================================
 * Protected Authentication Endpoints
 * ============================================================================
 */

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Revokes client session context (Client evicts local storage tokens)
 * @access  Protected (Requires valid JWT signature)
 */
router.post('/logout', protect, authController.logout);

module.exports = router;