const db = require('../config/db');

/**
 * Verified Role Constraint Matrix
 * Restricts user accounts strictly to these authorized business designations.
 */
const VALID_ROLES = {
  CUSTOMER: 'customer',
  OWNER: 'owner',
  ADMIN: 'admin'
};

const User = {
  /**
   * Initializes the fundamental PostgreSQL user table schema infrastructure automatically.
   * Runs during backend service initialization to guarantee database structural integrity.
   */
  async initializeTable() {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    firebase_uid VARCHAR(128) UNIQUE NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(30),
    address TEXT,
    occupation VARCHAR(150),
    role VARCHAR(20) NOT NULL DEFAULT 'customer'
        CHECK(role IN ('customer','owner','admin')),
    profile_image TEXT,
    is_verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

      -- Build performance optimization index loops on looking up profiles
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    `;
    
    try {
      await db.query(createTableQuery);
      console.log('Database Migration Engine: "users" table structures checked and verified.');
    } catch (error) {
      console.error('Database Migration Error configuring the users entity table architecture:', error.message);
      throw error;
    }
  },

  /**
   * Commits and writes a verified new user registration record block into storage.
   * * @param {Object} userData
   * @param {string} userData.fullName - Full registration profile text name
   * @param {string} userData.email - Primary login communication email handle
   * @param {string} userData.phoneNumber - Active international phone contact channel 
   * @param {string} userData.passwordHash - Pre-hashed security password string sequence
   * @param {string} userData.role - Assigned profile access capability layer ('customer' or 'owner')
   */
  async create({ fullName, email, phoneNumber, passwordHash, role = VALID_ROLES.CUSTOMER }) {
    const normalizedEmail = email.toLowerCase().trim();
    const cleanRole = role.toLowerCase().trim();

    // Secondary sanity check step guarding model layer boundaries before query deployment
    if (!Object.values(VALID_ROLES).includes(cleanRole)) {
      throw new Error(`Inbound structural constraint violation. Role "${role}" is not an authenticated system designation.`);
    }

    const insertQuery = `
      INSERT INTO users (full_name, email, phone_number, password_hash, role, is_verified, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, true, NOW(), NOW())
      RETURNING id, full_name, email, phone_number, role, is_verified, created_at;
    `;

    const queryParams = [
      fullName.trim(),
      normalizedEmail,
      phoneNumber.trim(),
      passwordHash,
      cleanRole
    ];

    const result = await db.query(insertQuery, queryParams);
    return result.rows[0];
  },

  /**
   * Retrieves an active profile match by email handle address line.
   * Critically pulls back password_hash context safely to verify server credential inputs.
   */
  async findByEmail(email) {
    if (!email) return null;
    const selectQuery = `
      SELECT id, full_name, email, phone_number, password_hash, role, is_verified, avatar_url, created_at 
      FROM users 
      WHERE email = $1;
    `;
    const result = await db.query(selectQuery, [email.toLowerCase().trim()]);
    return result.rows.length > 0 ? result.rows[0] : null;
  },

  /**
   * Locates a user record based on their unique system-generated UUID token.
   * Intended for user validation logic running inside auth middleware cycles.
   */
  async findById(id) {
    if (!id) return null;
    const selectQuery = `
      SELECT id, full_name, email, phone_number, role, is_verified, avatar_url, created_at 
      FROM users 
      WHERE id = $1;
    `;
    const result = await db.query(selectQuery, [id]);
    return result.rows.length > 0 ? result.rows[0] : null;
  },

  /**
   * Modifies specific security settings, avatars, or base profile structures safely.
   */
  async updateProfile(id, updates = {}) {
    const queryParts = [];
    const queryParams = [];
    let paramCounter = 1;

    // Allowed updatable property map definitions
    const whiteListedFields = ['full_name', 'phone_number', 'avatar_url'];

    for (const [key, value] of Object.entries(updates)) {
      if (whiteListedFields.includes(key) && value !== undefined) {
        queryParts.push(`${key} = $${paramCounter}`);
        queryParams.push(typeof value === 'string' ? value.trim() : value);
        paramCounter++;
      }
    }

    if (queryParts.length === 0) return null;

    // Append standard management values dynamically
    queryParts.push(`updated_at = NOW()`);
    queryParams.push(id); // Target identifier position mappings binded to the final variable index placeholder
    
    const dynamicQuery = `
      UPDATE users
      SET ${queryParts.join(', ')}
      WHERE id = $${paramCounter}
      RETURNING id, full_name, email, phone_number, role, avatar_url, updated_at;
    `;

    const result = await db.query(dynamicQuery, queryParams);
    return result.rows.length > 0 ? result.rows[0] : null;
  },

  // Export constant markers to keep controller assignment workflows clean and robust
  Roles: VALID_ROLES
};

module.exports = User;
