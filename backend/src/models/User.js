const db = require('../config/db');

/**
 * Valid application roles
 */
const VALID_ROLES = {
  CUSTOMER: 'customer',
  OWNER: 'owner',
  ADMIN: 'admin',
};

const User = {
  /**
   * Initialize users table
   */
  async initializeTable() {
    const createTableQuery = `
      CREATE EXTENSION IF NOT EXISTS "pgcrypto";

      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        firebase_uid VARCHAR(128) UNIQUE NOT NULL,
        full_name VARCHAR(150) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone_number VARCHAR(30),
        address TEXT,
        occupation VARCHAR(150),
        role VARCHAR(20) NOT NULL DEFAULT 'customer'
          CHECK (role IN ('customer','owner','admin')),
        profile_image TEXT,
        is_verified BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_users_email
      ON users(email);

      CREATE INDEX IF NOT EXISTS idx_users_firebase_uid
      ON users(firebase_uid);
    `;

    try {
      await db.query(createTableQuery);
      console.log('Users table initialized successfully.');
    } catch (error) {
      console.error('Failed to initialize users table:', error);
      throw error;
    }
  },

  /**
   * Create new user
   */
  async create({
    firebaseUid,
    fullName,
    email,
    phoneNumber,
    address,
    occupation,
    role = VALID_ROLES.CUSTOMER,
    profileImage = null,
  }) {
    const query = `
      INSERT INTO users (
        firebase_uid,
        full_name,
        email,
        phone_number,
        address,
        occupation,
        role,
        profile_image,
        is_verified
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,TRUE)
      RETURNING *;
    `;

    const values = [
      firebaseUid,
      fullName.trim(),
      email.toLowerCase().trim(),
      phoneNumber || null,
      address || null,
      occupation || null,
      role,
      profileImage,
    ];

    const result = await db.query(query, values);
    return result.rows[0];
  },

  /**
   * Find by Firebase UID
   */
  async findByFirebaseUid(firebaseUid) {
    const result = await db.query(
      `SELECT * FROM users WHERE firebase_uid = $1`,
      [firebaseUid]
    );

    return result.rows[0] || null;
  },

  /**
   * Find by Email
   */
  async findByEmail(email) {
    const result = await db.query(
      `SELECT * FROM users WHERE email = $1`,
      [email.toLowerCase().trim()]
    );

    return result.rows[0] || null;
  },

  /**
   * Find by ID
   */
  async findById(id) {
    const result = await db.query(
      `SELECT * FROM users WHERE id = $1`,
      [id]
    );

    return result.rows[0] || null;
  },

  /**
   * Update user profile
   */
  async updateProfile(id, updates) {
    const query = `
      UPDATE users
      SET
        full_name = $1,
        phone_number = $2,
        address = $3,
        occupation = $4,
        profile_image = $5,
        updated_at = NOW()
      WHERE id = $6
      RETURNING *;
    `;

    const values = [
      updates.full_name,
      updates.phone_number,
      updates.address,
      updates.occupation,
      updates.profile_image,
      id,
    ];

    const result = await db.query(query, values);

    return result.rows[0] || null;
  },

  /**
   * Delete user
   */
  async delete(id) {
    await db.query(
      `DELETE FROM users WHERE id = $1`,
      [id]
    );

    return true;
  },

  /**
   * Get all users
   */
  async findAll() {
    const result = await db.query(
      `SELECT * FROM users ORDER BY created_at DESC`
    );

    return result.rows;
  },

  /**
   * Export roles
   */
  Roles: VALID_ROLES,
};

module.exports = User;
