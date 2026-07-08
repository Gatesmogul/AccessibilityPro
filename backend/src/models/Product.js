const db = require('../config/db');

/**
 * Valid Status Constraints for Listings
 */
const VALID_STATUSES = ['sell', 'rent', 'lease'];

const Product = {
  /**
   * Initializes the fundamental PostgreSQL properties table schema infrastructure.
   * Leverages JSONB structures for accessibility mapping to allow rapid querying 
   * and high schema flexibility for diverse structural feature matrices.
   */
  async initializeTable() {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS properties (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL, -- e.g., 'House (Residential)', 'Commercial Depot'
        price NUMERIC(15, 2) NOT NULL,
        currency_code VARCHAR(3) DEFAULT 'USD',
        status VARCHAR(20) NOT NULL DEFAULT 'sell' CHECK (status IN ('sell', 'rent', 'lease')),
        
        -- Geolocation & Physical Routing Blocks
        address TEXT NOT NULL,
        city VARCHAR(100) NOT NULL,
        country VARCHAR(100) NOT NULL,
        gps_link VARCHAR(500),
        
        -- Media Asset Architecture
        images TEXT[] DEFAULT '{}', -- String arrays storing compiled CDN resource links
        
        -- Accessibility Feature Infrastructure Engine
        -- Structure matches: { "wheelchairAccessible": true, "elevator": true, "brailleSignage": false, "stepFreeAccess": true }
        accessibility_features JSONB DEFAULT '{}'::jsonb,
        
        description TEXT,
        owner_id UUID NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        
        -- Establish database link layer boundaries constraints
        CONSTRAINT fk_properties_owner FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
      );

      -- Build performance indexes targeting high-traffic lookup vectors
      CREATE INDEX IF NOT EXISTS idx_properties_owner ON properties(owner_id);
      CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
      CREATE INDEX IF NOT EXISTS idx_properties_accessibility ON properties USING gin (accessibility_features);
    `;

    try {
      await db.query(createTableQuery);
      console.log('Database Migration Engine: "properties" table structures checked and verified.');
    } catch (error) {
      console.error('Database Migration Error configuring the properties entity table architecture:', error.message);
      throw error;
    }
  },

  /**
   * Commits and writes a verified new property listing entry row into storage.
   * * @param {Object} propertyData
   * @param {string} propertyData.name - High-level listing title text name
   * @param {string} propertyData.category - Functional classification context 
   * @param {number|string} propertyData.price - Asset monetary balance valuation
   * @param {string} propertyData.status - Listing operational transaction mode ('sell', 'rent', 'lease')
   * @param {string} propertyData.address - Precise location data line
   * @param {string} propertyData.city - Metrological municipality zone
   * @param {string} propertyData.country - National boundary marker
   * @param {string} [propertyData.gpsLink] - Optional mapping link coordinates
   * @param {Array<string>} [propertyData.images] - Compiled array of layout photography links
   * @param {Object} [propertyData.accessibilityFeatures] - Map configurations specifying adaptive features
   * @param {string} [propertyData.description] - Extended text field specifying property highlights
   * @param {string} propertyData.ownerId - Account identifier binding the listing to its author
   */
  async create(propertyData) {
    const {
      name, category, price, status = 'sell', address, city, country,
      gpsLink = null, images = [], accessibilityFeatures = {}, description = null, ownerId
    } = propertyData;

    const cleanStatus = status.toLowerCase().trim();
    if (!VALID_STATUSES.includes(cleanStatus)) {
      throw new Error(`Inbound constraint violation. Status type "${status}" is invalid.`);
    }

    const insertQuery = `
      INSERT INTO properties (
        name, category, price, status, address, city, country, 
        gps_link, images, accessibility_features, description, owner_id, created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW(), NOW())
      RETURNING *;
    `;

    const queryParams = [
      name.trim(),
      category.trim(),
      parseFloat(price) || 0,
      cleanStatus,
      address.trim(),
      city.trim(),
      country.trim(),
      gpsLink ? gpsLink.trim() : null,
      images,
      JSON.stringify(accessibilityFeatures),
      description ? description.trim() : null,
      ownerId
    ];

    const result = await db.query(insertQuery, queryParams);
    return result.rows[0];
  },

  /**
   * Custom Marketplace Query Engine with Dynamic Filter Matching
   * Allows searching listings based on dynamic criteria, including complex accessibility filters.
   * * @param {Object} filters
   * @param {string} [filters.category] - Filter by asset category
   * @param {string} [filters.status] - Filter by availability state
   * @param {string} [filters.city] - Targeted municipal region filter
   * @param {Array<string>} [filters.requiredAccessibilityFeatures] - Keys that must be flagged true in JSONB data
   */
  async findFiltered(filters = {}) {
    let queryText = 'SELECT * FROM properties WHERE 1=1';
    const queryParams = [];
    let paramCounter = 1;

    if (filters.category) {
      queryText += ` AND category = $${paramCounter}`;
      queryParams.push(filters.category.trim());
      paramCounter++;
    }

    if (filters.status) {
      queryText += ` AND status = $${paramCounter}`;
      queryParams.push(filters.status.toLowerCase().trim());
      paramCounter++;
    }

    if (filters.city) {
      queryText += ` AND city ILIKE $${paramCounter}`;
      queryParams.push(`%${filters.city.trim()}%`);
      paramCounter++;
    }

    // Dynamic JSONB Accessibility Verification Drill-down
    if (filters.requiredAccessibilityFeatures && Array.isArray(filters.requiredAccessibilityFeatures)) {
      for (const feature of filters.requiredAccessibilityFeatures) {
        queryText += ` AND accessibility_features ->> $${paramCounter} = 'true'`;
        queryParams.push(feature.trim());
        paramCounter++;
      }
    }

    queryText += ' ORDER BY created_at DESC;';

    const result = await db.query(query