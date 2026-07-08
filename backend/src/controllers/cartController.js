const db = require('../config/db');

const cartController = {
  /**
   * READ: Retrieve all active cart products matching the user's session token.
   * Joins the cart records against the properties table to fetch real-time metadata (name, price, status, image).
   */
  async getCart(req, res) {
    try {
      const userId = req.user?.uid;

      const selectQuery = `
        SELECT 
          c.id AS cart_item_id,
          c.property_id AS id,
          c.quantity,
          p.name,
          p.price,
          p.status,
          p.location
        FROM cart c
        INNER JOIN properties p ON c.property_id = p.id
        WHERE c.user_id = $1
        ORDER BY c.created_at DESC;
      `;

      const result = await db.query(selectQuery, [userId]);

      return res.status(200).json({
        success: true,
        message: 'Active customer shopping cart layout retrieved successfully.',
        data: result.rows
      });

    } catch (error) {
      console.error('Fetch global cart controller data sequence error:', error.message);
      return res.status(500).json({ success: false, message: 'Failed to synchronize basket records from storage rows.' });
    }
  },

  /**
   * CREATE / UPDATE: Add an item to the cart or increment its quantity if it already exists.
   */
  async addToCart(req, res) {
    try {
      const userId = req.user?.uid;
      const { propertyId } = req.body;

      if (!propertyId) {
        return res.status(400).json({ success: false, message: 'Target property mapping identifier missing.' });
      }

      // Verify the property actually exists in our asset ledger before attaching it to a cart
      const propertyCheck = await db.query('SELECT id FROM properties WHERE id = $1', [propertyId]);
      if (propertyCheck.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Requested real estate listing cannot be found.' });
      }

      // Check if the item is already added to this user's cart
      const checkCartQuery = 'SELECT id, quantity FROM cart WHERE user_id = $1 AND property_id = $2';
      const existingItem = await db.query(checkCartQuery, [userId, propertyId]);

      if (existingItem.rows.length > 0) {
        // If it exists, increment the quantity safely
        const updatedQuantity = existingItem.rows[0].quantity + 1;
        const updateQuery = 'UPDATE cart SET quantity = $1, updated_at = NOW() WHERE id = $2 RETURNING id, property_id, quantity;';
        const result = await db.query(updateQuery, [updatedQuantity, existingItem.rows[0].id]);

        return res.status(200).json({
          success: true,
          message: 'Property baseline selection count incremented successfully.',
          data: result.rows[0]
        });
      }

      // Otherwise, create a clean entry row configuration
      const insertQuery = `
        INSERT INTO cart (user_id, property_id, quantity, created_at, updated_at)
        VALUES ($1, $2, 1, NOW(), NOW())
        RETURNING id, property_id, quantity;
      `;
      const result = await db.query(insertQuery, [userId, propertyId]);

      return res.status(201).json({
        success: true,
        message: 'Property package bound to customer basket index cleanly.',
        data: result.rows[0]
      });

    } catch (error) {
      console.error('Cart item insertion engine validation runtime crash:', error.message);
      return res.status(500).json({ success: false, message: 'Internal server error processing cart insertion.' });
    }
  },

  /**
   * DELETE SINGLE STEP: Decrement item counter or completely drop the row if quantity drops below 1.
   */
  async removeFromCart(req, res) {
    try {
      const userId = req.user?.uid;
      const { propertyId } = req.params;

      const checkCartQuery = 'SELECT id, quantity FROM cart WHERE user_id = $1 AND property_id = $2';
      const result = await db.query(checkCartQuery, [userId, propertyId]);

      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Target item reference not found within your active cart.' });
      }

      const currentItem = result.rows[0];

      if (currentItem.quantity <= 1) {
        // Delete the entry entirely if dropping past zero count
        await db.query('DELETE FROM cart WHERE id = $1', [currentItem.id]);
        return res.status(200).json({
          success: true,
          message: 'Property row dropped out of active selection completely.'
        });
      }

      // Otherwise, decrement by 1
      const decrementedQuantity = currentItem.quantity - 1;
      const updateResult = await db.query(
        'UPDATE cart SET quantity = $1, updated_at = NOW() WHERE id = $2 RETURNING id, property_id, quantity;',
        [decrementedQuantity, currentItem.id]
      );

      return res.status(200).json({
        success: true,
        message: 'Cart row entity volume updated.',
        data: updateResult.rows[0]
      });

    } catch (error) {
      console.error('Remove operation processing engine logic fault:', error.message);
      return res.status(500).json({ success: false, message: 'Failed to remove requested index matching parameter values.' });
    }
  },

  /**
   * PURGE CART: Completely empty the user's active shopping basket allocation.
   * Typically executed on manual clear actions or right after a successful checkout validation.
   */
  async clearCart(req, res) {
    try {
      const userId = req.user?.uid;
      
      await db.query('DELETE FROM cart WHERE user_id = $1', [userId]);

      return res.status(200).json({
        success: true,
        message: 'All selection assets purged out of your user session cart layout successfully.'
      });

    } catch (error) {
      console.error('Clear endpoint runtime processing drop error:', error.message);
      return res.status(500).json({ success: false, message: 'Internal server error clearing shopping cart blocks.' });
    }
  }
};

module.exports = cartController;