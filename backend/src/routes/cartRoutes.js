const db = require('../config/db');

const cartController = {
  /**
   * Retrieves all active property line items saved in the customer's cart
   */
  async getCart(req, res) {
    try {
      const userId = req.user?.uid || req.user?.id;
      
      const query = `
        SELECT c.id, c.property_id, c.quantity, p.title, p.price, p.image_url 
        FROM cart c
        JOIN products p ON c.property_id = p.id
        WHERE c.user_id = $1;
      `;
      const result = await db.query(query, [userId]);
      
      return res.status(200).json({ success: true, data: result.rows });
    } catch (error) {
      console.error('Error fetching cart:', error.message);
      return res.status(500).json({ success: false, message: 'Server error retrieving cart items.' });
    }
  },

  /**
   * Adds a property selection to the user's cart or increments its count
   */
  async addToCart(req, res) {
    try {
      const userId = req.user?.uid || req.user?.id;
      const { propertyId, quantity = 1 } = req.body;

      if (!propertyId) {
        return res.status(400).json({ success: false, message: 'Property ID is required.' });
      }

      // Check if item already exists in user's cart
      const checkQuery = 'SELECT id, quantity FROM cart WHERE user_id = $1 AND property_id = $2';
      const existing = await db.query(checkQuery, [userId, propertyId]);

      if (existing.rows.length > 0) {
        const newQuantity = existing.rows[0].quantity + quantity;
        const updateQuery = 'UPDATE cart SET quantity = $1, updated_at = NOW() WHERE id = $2 RETURNING *';
        const updated = await db.query(updateQuery, [newQuantity, existing.rows[0].id]);
        return res.status(200).json({ success: true, data: updated.rows[0] });
      }

      const insertQuery = `
        INSERT INTO cart (user_id, property_id, quantity, created_at)
        VALUES ($1, $2, $3, NOW())
        RETURNING *;
      `;
      const result = await db.query(insertQuery, [userId, propertyId, quantity]);
      return res.status(201).json({ success: true, data: result.rows[0] });
    } catch (error) {
      console.error('Error adding to cart:', error.message);
      return res.status(500).json({ success: false, message: 'Server error adding item to cart.' });
    }
  },

  /**
   * Decrements an item count or drops the record row completely if volume hits 0
   */
  async removeFromCart(req, res) {
    try {
      const userId = req.user?.uid || req.user?.id;
      const { propertyId } = req.params;

      const checkQuery = 'SELECT id, quantity FROM cart WHERE user_id = $1 AND property_id = $2';
      const existing = await db.query(checkQuery, [userId, propertyId]);

      if (existing.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Item not found in your cart.' });
      }

      if (existing.rows[0].quantity > 1) {
        const newQuantity = existing.rows[0].quantity - 1;
        const updateQuery = 'UPDATE cart SET quantity = $1, updated_at = NOW() WHERE id = $2 RETURNING *';
        const updated = await db.query(updateQuery, [newQuantity, existing.rows[0].id]);
        return res.status(200).json({ success: true, data: updated.rows[0] });
      }

      await db.query('DELETE FROM cart WHERE id = $1', [existing.rows[0].id]);
      return res.status(200).json({ success: true, message: 'Item removed completely from cart.' });
    } catch (error) {
      console.error('Error removing from cart:', error.message);
      return res.status(500).json({ success: false, message: 'Server error updating cart line item.' });
    }
  },

  /**
   * Completely purges all items from the authenticated user's cart
   */
  async clearCart(req, res) {
    try {
      const userId = req.user?.uid || req.user?.id;
      await db.query('DELETE FROM cart WHERE user_id = $1', [userId]);
      return res.status(200).json({ success: true, message: 'Cart cleared successfully.' });
    } catch (error) {
      console.error('Error clearing cart:', error.message);
      return res.status(500).json({ success: false, message: 'Server error purging cart state.' });
    }
  }
};

module.exports = cartController;
