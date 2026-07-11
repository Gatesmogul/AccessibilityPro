const bcrypt = require('bcryptjs');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Secure runtime verification defaults for token payload issuance signing
const JWT_SECRET = process.env.JWT_SECRET || 'ACCESSIBILITY_PRO_ULTRA_HIDDEN_SECRET_KEY';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * Temp Cache Matrix for Mock Verification Channels
 * In high-scale systems, map this layer onto a transient cluster instance like Redis with a strict TTL.
 */
const tempOtpStorageCache = new Map();

/**
 * Dispatches a numeric OTP code structure to terminal verification targets.
 * Extend this handle with utility wrappers like Nodemailer or Twilio.
 */
const dispatchOtpCodePayload = async (email, otp) => {
  console.log(`[OTP DISPATCH INTEGRATION] sending security verification code [${otp}] to address: ${email}`);
};

const authController = {
  /**
   * Phase 1: Registration Entry Point
   * Creates a pending user state cache map and issues a 6-digit verification code.
   */
  async register(req, res) {
    try {
      const { fullName, email, phoneNumber, password, role } = req.body;

      if (!fullName || !email || !phoneNumber || !password || !role) {
        return res.status(400).json({ success: false, message: 'All registration parameters are required.' });
      }

      // Check if user already exists in storage arrays
      const checkUserResult = await db.query('SELECT id FROM users WHERE email = $1 OR phone_number = $2', [email.toLowerCase().trim(), phoneNumber.trim()]);
      if (checkUserResult.rows.length > 0) {
        return res.status(409).json({ success: false, message: 'An account with this email address or phone number already exists.' });
      }

      // Generate verification code parameters
      const generatedOtpCode = Math.floor(100000 + Math.random() * 900000).toString();
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Cache structural payload fields with an automated 10-minute validity window
      tempOtpStorageCache.set(email.toLowerCase().trim(), {
        fullName: fullName.trim(),
        email: email.toLowerCase().trim(),
        phoneNumber: phoneNumber.trim(),
        password: hashedPassword,
        role: role.trim(),
        otpCode: generatedOtpCode,
        expiresAt: Date.now() + 600000 // 10 minutes tracking lifespan
      });

      await dispatchOtpCodePayload(email, generatedOtpCode);

      return res.status(200).json({
        success: true,
        message: 'Security verification OTP code sent to your email address.',
        email: email.toLowerCase().trim()
      });

    } catch (error) {
      console.error('Registration entry point runtime process exception:', error.message);
      return res.status(500).json({ success: false, message: 'Internal server error processing account registration.' });
    }
  },

  /**
   * Phase 2: OTP Ledger Validation Check
   * Validates code inputs and commits verified profiles safely to PostgreSQL storage blocks.
   */
  async verifyOtp(req, res) {
    try {
      const { email, otpCode } = req.body;

      if (!email || !otpCode) {
        return res.status(400).json({ success: false, message: 'Email reference point and OTP string value are required fields.' });
      }

      const normalizedEmail = email.toLowerCase().trim();
      const pendingProfile = tempOtpStorageCache.get(normalizedEmail);

      if (!pendingProfile) {
        return res.status(404).json({ success: false, message: 'No registration session found or validation token session expired.' });
      }

      if (Date.now() > pendingProfile.expiresAt) {
        tempOtpStorageCache.delete(normalizedEmail);
        return res.status(410).json({ success: false, message: 'Verification security window expired. Please sign up again.' });
      }

      if (pendingProfile.otpCode !== otpCode.trim()) {
        return res.status(401).json({ success: false, message: 'Incorrect OTP code token entered.' });
      }

      // Commit the verified record to the PostgreSQL database
      const insertQuery = `
        INSERT INTO users (full_name, email, phone_number, password_hash, role, is_verified, created_at)
        VALUES ($1, $2, $3, $4, $5, true, NOW())
        RETURNING id, full_name, email, role, created_at;
      `;
      
      const insertParams = [
        pendingProfile.fullName,
        pendingProfile.email,
        pendingProfile.phoneNumber,
        pendingProfile.password,
        pendingProfile.role
      ];

      const saveResult = await db.query(insertQuery, insertParams);
      
      // Clean up cache once transaction is committed
      tempOtpStorageCache.delete(normalizedEmail);

      const createdUser = saveResult.rows[0];

      // Sign authorization access token
      const token = jwt.sign(
        { uid: createdUser.id, email: createdUser.email, role: createdUser.role },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      return res.status(201).json({
        success: true,
        message: 'Account verified and configured successfully.',
        token,
        user: {
          uid: createdUser.id,
          fullName: createdUser.full_name,
          email: createdUser.email,
          role: createdUser.role
        }
      });

    } catch (error) {
      console.error('OTP confirmation exception thread sequence failure:', error.message);
      return res.status(500).json({ success: false, message: 'Internal server verification validation failure.' });
    }
  },

  /**
   * Session Initialization Client Login Handler
   */
  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email address line and password credentials required.' });
      }

      const lookupQuery = 'SELECT id, full_name, email, password_hash, role FROM users WHERE email = $1';
      const userResult = await db.query(lookupQuery, [email.toLowerCase().trim()]);

      if (userResult.rows.length === 0) {
        return res.status(401).json({ success: false, message: 'Invalid credentials. Record profile entry mapping rejected.' });
      }

      const databaseUser = userResult.rows[0];
      const isPasswordMatched = await bcrypt.compare(password, databaseUser.password_hash);

      if (!isPasswordMatched) {
        return res.status(401).json({ success: false, message: 'Invalid credentials. Record profile entry mapping rejected.' });
      }

      const token = jwt.sign(
        { uid: databaseUser.id, email: databaseUser.email, role: databaseUser.role },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      return res.status(200).json({
        success: true,
        message: 'Authentication check authorized successfully.',
        token,
        user: {
          uid: databaseUser.id,
          fullName: databaseUser.full_name,
          email: databaseUser.email,
          role: databaseUser.role
        }
      });

    } catch (error) {
      console.error('Login process controller crash instance exception:', error.message);
      return res.status(500).json({ success: false, message: 'An internal server runtime failure blocked your authentication path.' });
    }
  },

  /**
   * Missing Endpoint Fix 1: Optional Email Verification Sync Handler
   * Resolves router.post('/verify-email', ...) reference crash
   */
  async verifyEmail(req, res) {
    try {
      // Expects payload containing email reference from authorized middleware tokens
      const email = req.user?.email || req.body.email;
      
      if (!email) {
        return res.status(400).json({ success: false, message: 'Email identifier could not be validated.' });
      }

      await db.query('UPDATE users SET is_verified = true WHERE email = $1', [email.toLowerCase().trim()]);

      return res.status(200).json({
        success: true,
        message: 'Email verification parameters verified and synchronized successfully.'
      });
    } catch (error) {
      console.error('Email verification execution thread sync exception:', error.message);
      return res.status(500).json({ success: false, message: 'Internal error syncing email verification state.' });
    }
  },

  /**
   * Missing Endpoint Fix 2: Fetch Current Profile Session Metadata
   * Resolves router.get('/me', ...) reference crash
   */
  async getCurrentUser(req, res) {
    try {
      // The verifyFirebaseToken or JWT middleware attaches user context variables onto req.user
      const userId = req.user?.uid;

      if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized profile request access context.' });
      }

      const lookupQuery = 'SELECT id, full_name, email, role, created_at FROM users WHERE id = $1';
      const userResult = await db.query(lookupQuery, [userId]);

      if (userResult.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'User profile session context not found.' });
      }

      const currentUser = userResult.rows[0];
      return res.status(200).json({
        success: true,
        user: {
          uid: currentUser.id,
          fullName: currentUser.full_name,
          email: currentUser.email,
          role: currentUser.role,
          createdAt: currentUser.created_at
        }
      });
    } catch (error) {
      console.error('Get current user record fetch exception:', error.message);
      return res.status(500).json({ success: false, message: 'Internal server error processing profile data lookup.' });
    }
  },

  /**
   * Invalidates authentication states on the client side
   */
  async logout(req, res) {
    return res.status(200).json({
      success: true,
      message: 'Session revoked. Client application session storage items should be evicted.'
    });
  }
};

module.exports = authController;
