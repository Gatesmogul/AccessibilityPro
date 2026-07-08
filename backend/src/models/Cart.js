const db = require('../config/db');

const Cart = {
  /**
   * Initializes the fundamental PostgreSQL cart database infrastructure table.
   * Maps many-to-many relationships matching User UUIDs securely to Property listings.
   */
  async initializeTable() {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS cart (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL,
        property_id UUID NOT NULL,
        quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

        -- Set strict cascade constraint boundaries to enforce database integrity
        CONSTRAINT fk_cart_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        CONSTRAINT fk_cart_property FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
        
        -- Prevent duplicate disjointed row fragmentation matching the exact same asset pairing
        CONSTRAINT unique_user_property_cart UNIQUE (user_id, property_id)
      );

      -- Build performance indexes targeting customer session access paths
      CREATE INDEX IF NOT EXISTS idx_cart_user ON cart(user_id);
    `;

    try {
      await db.query(createTableQuery);
      console.log('Database Migration Engine: "cart" relational linkage table verified.');
    } catch (error) {
      console.error('Database Migration Error configuring the cart mapping architecture:', error.message);
      throw error;
    }
  },

  /**
   * Upserts (inserts or increments) an item allocation within a customer's workspace.
   * Uses an atomic PostgreSQL constraint conflict clause to increment quantity smoothly 
   * if the user adds the same property multiple times.
   * * @param {string} userId - UUID identifier matching the active customer session
   * @param {string} propertyId - UUID mapping back to the targeted real estate property
   */
  async addItem(userId, propertyId) {
    const upsertQuery = `
      INSERT INTO cart (user_id, property_id, quantity, created_at, updated_at)
      VALUES ($1, $2, 1, NOW(), NOW())
      ON CONFLICT (user_id, property_id) 
      DO UPDATE SET 
        quantity = cart.quantity + 1,
        updated_at = NOW()
      RETURNING id, user_id, property_id, quantity, updated_at;
    `;

    const result = await db.query(upsertQuery, [userId, propertyId]);
    return result.rows[0];
  },

  /**
   * Fetches the compiled contents of a user's cart alongside active property metadata.
   */
  async findByUserId(userId) {
    const selectQuery = `
      SELECT 
        c.id AS cart_item_id,
        c.property_id,
        c.quantity,
        c.updated_at AS added_at,
        p.name,
        p.category,
        p.price,
        p.status,
        p.location,
        p.images[1] AS primary_image_url
      FROM cart c
      INNER JOIN properties p ON c.property_id = p.id
      WHERE c.user_id = $1
      ORDER BY c.created_at DESC;
    `;

    const result = await db.query(selectQuery, [userId]);
    return result.rows;
  },

  /**
   * Safely updates item allocations by direct assignment.
   */
  async updateQuantity(userId, propertyId, targetQuantity) {
    if (parseInt(targetQuantity) <= 0) {
      return await this.removeItem(userId, propertyId);
    }

    const updateQuery = `
      UPDATE cart
      SET quantity = $1, updated_at = NOW()
      WHERE user_id = $2 AND property_id = $3
      RETURNING id, user_id, property_id, quantity, updated_at;
    `;

    const result = await db.query(updateQuery, [parseInt(targetQuantity), userId, propertyId]);
    return result.rows.length > 0 ? result.rows[0] : null;
  },

  /**
   * Cleanses a specific property assignment completely out of a user's active cart list.
   */
  async removeItem(userId, propertyId) {
    const deleteQuery = `
      DELETE FROM cart
      WHERE user_id = $1 AND property_id = $2
      RETURNING id, property_id;
    `;

    const result = await db.query(deleteQuery, [userId, propertyId]);
    return result.rows.length > 0;
  },

  /**
   * Empties the entire cart storage allocation bound to a customer instance profile.
   */
  async clearAll(userId) {
    const purgeQuery = `
      DELETE FROM cart
      WHERE user_id = $1;
    `;
    
    await db.query(purgeQuery, [userId]);
    return true;
  }
};

module.exports = Cart;