const db = require('../config/db');

const productController = {
  /**
   * Retrieves global marketplace index feed with optional category/status query filters
   * GET /api/v1/products
   */
  async getAllProducts(req, res) {
    try {
      const { category, status } = req.query;
      let queryStr = 'SELECT * FROM products';
      const queryParams = [];

      // Dynamic conditional filter composition logic
      const conditions = [];
      if (category) {
        queryParams.push(category.trim());
        conditions.push(`category = $${queryParams.length}`);
      }
      if (status) {
        queryParams.push(status.trim());
        conditions.push(`status = $${queryParams.length}`);
      }

      if (conditions.length > 0) {
        queryStr += ' WHERE ' + conditions.join(' AND ');
      }

      queryStr += ' ORDER BY created_at DESC';

      const result = await db.query(queryStr, queryParams);

      return res.status(200).json({
        success: true,
        count: result.rows.length,
        data: result.rows
      });
    } catch (error) {
      console.error('Error executing global product index query:', error.message);
      return res.status(500).json({ success: false, message: 'Server error retrieving marketplace items.' });
    }
  },

  /**
   * Isolates property inventory rows managed explicitly by the authenticated user
   * GET /api/v1/products/my-listings
   */
  async getOwnerProducts(req, res) {
    try {
      // Accessing authorization context structural parameters established by protect middleware
      const ownerId = req.user?.uid || req.user?.id;

      if (!ownerId) {
        return res.status(401).json({ success: false, message: 'Unauthorized access context identity mapping.' });
      }

      const query = 'SELECT * FROM products WHERE owner_id = $1 ORDER BY created_at DESC';
      const result = await db.query(query, [ownerId]);

      return res.status(200).json({
        success: true,
        count: result.rows.length,
        data: result.rows
      });
    } catch (error) {
      console.error('Error fetching owner listings:', error.message);
      return res.status(500).json({ success: false, message: 'Server error retrieving your managed inventory listings.' });
    }
  },

  /**
   * Provisions, validates, and publishes a new real estate asset entry
   * POST /api/v1/products
   */
  async createProduct(req, res) {
    try {
      const { title, description, price, category, imageUrl } = req.body;
      const ownerId = req.user?.uid || req.user?.id;

      if (!title || !price || !category) {
        return res.status(400).json({ success: false, message: 'Product title, price, and category parameters are required.' });
      }

      const query = `
        INSERT INTO products (title, description, price, category, image_url, owner_id, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, NOW())
        RETURNING *;
      `;
      const values = [title.trim(), description?.trim() || null, price, category.trim(), imageUrl?.trim() || null, ownerId];

      const result = await db.query(query, values);

      return res.status(201).json({
        success: true,
        message: 'Product listing provisioned successfully.',
        data: result.rows[0]
      });
    } catch (error) {
      console.error('Error creating product database record row:', error.message);
      return res.status(500).json({ success: false, message: 'Server error publishing asset profile configuration.' });
    }
  },

  /**
   * Modifies explicit specification vectors or listing parameters for an asset
   * PUT /api/v1/products/:id
   */
  async updateProduct(req, res) {
    try {
      const productId = req.params.id;
      const ownerId = req.user?.uid || req.user?.id;
      const { title, description, price, category, imageUrl, status } = req.body;

      // Access control verification check block sequence checking document ownership
      const checkResult = await db.query('SELECT owner_id FROM products WHERE id = $1', [productId]);
      if (checkResult.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Target listing row not found in storage arrays.' });
      }

      if (checkResult.rows[0].owner_id !== ownerId) {
        return res.status(403).json({ success: false, message: 'Forbidden. Security cross-validation context mismatch.' });
      }

      const query = `
        UPDATE products 
        SET title = COALESCE($1, title),
            description = COALESCE($2, description),
            price = COALESCE($3, price),
            category = COALESCE($4, category),
            image_url = COALESCE($5, image_url),
            status = COALESCE($6, status),
            updated_at = NOW()
        WHERE id = $7
        RETURNING *;
      `;
      const values = [title, description, price, category, imageUrl, status, productId];
      const result = await db.query(query, values);

      return res.status(200).json({
        success: true,
        message: 'Product configuration details updated successfully.',
        data: result.rows[0]
      });
    } catch (error) {
      console.error('Error mutating data row values for listing item:', error.message);
      return res.status(500).json({ success: false, message: 'Server runtime failure updating selected listing.' });
    }
  },

  /**
   * Permanently purges a listing out of active storage array rows
   * DELETE /api/v1/products/:id
   */
  async deleteProduct(req, res) {
    try {
      const productId = req.params.id;
      const ownerId = req.user?.uid || req.user?.id;

      // Ownership authorization cross-validation
      const checkResult = await db.query('SELECT owner_id FROM products WHERE id = $1', [productId]);
      if (checkResult.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Target row item map reference not found.' });
      }

      if (checkResult.rows[0].owner_id !== ownerId) {
        return res.status(403).json({ success: false, message: 'Forbidden access scope mutation attempt.' });
      }

      await db.query('DELETE FROM products WHERE id = $1', [productId]);

      return res.status(200).json({
        success: true,
        message: 'Target real estate asset data listing row permanently evicted from cluster records.'
      });
    } catch (error) {
      console.error('Error executing delete statement query transactions:', error.message);
      return res.status(500).json({ success: false, message: 'Internal server processing error dropping resource listing.' });
    }
  }
};

module.exports = productController;
