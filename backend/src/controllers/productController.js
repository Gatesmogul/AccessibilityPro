const db = require('../config/db');

const productController = {
  /**
   * CREATE: Provision and publish a new property listing
   * Accessible only by verified users with the 'owner' role matrix.
   */
  async createProduct(req, res) {
    try {
      const { name, category, price, status, location, gpsLink, description } = req.body;
      const ownerId = req.user?.uid; // Extracted dynamically from your JWT authentication validation middleware

      if (!name || !category || !price || !status || !location) {
        return res.status(400).json({ 
          success: false, 
          message: 'Required core metadata attributes (name, category, price, status, location) cannot be empty.' 
        });
      }

      const insertQuery = `
        INSERT INTO properties (name, category, price, status, location, gps_link, description, owner_id, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
        RETURNING id, name, category, price, status, location, gps_link, description, owner_id, created_at;
      `;

      const queryParams = [
        name.trim(), 
        category.trim(), 
        price.trim(), 
        status.trim(), 
        location.trim(), 
        gpsLink ? gpsLink.trim() : null, 
        description ? description.trim() : null, 
        ownerId
      ];

      const result = await db.query(insertQuery, queryParams);

      return res.status(201).json({
        success: true,
        message: 'Real estate asset profile written and published successfully.',
        data: result.rows[0]
      });

    } catch (error) {
      console.error('Create product router sequence controller exception:', error.message);
      return res.status(500).json({ success: false, message: 'Internal server error processing property entry storage.' });
    }
  },

  /**
   * READ ALL: Query the marketplace index feed with optional category/status filters
   */
  async getAllProducts(req, res) {
    try {
      const { category, status } = req.query;
      let queryText = 'SELECT id, name, category, price, status, location, gps_link, description, owner_id, created_at FROM properties WHERE 1=1';
      const queryParams = [];

      if (category) {
        queryParams.push(category.trim());
        queryText += ` AND category = $${queryParams.length}`;
      }

      if (status) {
        queryParams.push(status.trim());
        queryText += ` AND status = $${queryParams.length}`;
      }

      // Order by newest listings first
      queryText += ' ORDER BY created_at DESC';

      const result = await db.query(queryText, queryParams);

      return res.status(200).json({
        success: true,
        message: 'Global marketplace index queried successfully.',
        data: result.rows
      });

    } catch (error) {
      console.error('Fetch global product index instance error:', error.message);
      return res.status(500).json({ success: false, message: 'Failed to retrieve marketplace catalog index logs.' });
    }
  },

  /**
   * READ INDIVIDUAL OWNER LISTINGS: Filters assets mapped explicitly to the authenticated merchant
   */
  async getOwnerProducts(req, res) {
    try {
      const ownerId = req.user?.uid;
      const selectQuery = 'SELECT id, name, category, price, status, location, gps_link, description, created_at FROM properties WHERE owner_id = $1 ORDER BY created_at DESC';
      
      const result = await db.query(selectQuery, [ownerId]);

      return res.status(200).json({
        success: true,
        message: 'Owner isolation catalog subset processed successfully.',
        data: result.rows
      });

    } catch (error) {
      console.error('Fetch owner isolated array record processing fault:', error.message);
      return res.status(500).json({ success: false, message: 'Failed to parse inventory rows matching your account parameters.' });
    }
  },

  /**
   * UPDATE: Modify property structural specifications or status settings
   * Includes ownership validation steps to reject external mutations.
   */
  async updateProduct(req, res) {
    try {
      const { id } = req.params;
      const ownerId = req.user?.uid;
      const { name, category, price, status, location, gpsLink, description } = req.body;

      // Assert security verification step to confirm ownership authority profile matches target document
      const verifyQuery = 'SELECT owner_id FROM properties WHERE id = $1';
      const verifyResult = await db.query(verifyQuery, [id]);

      if (verifyResult.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Target property listing document not found.' });
      }

      if (verifyResult.rows[0].owner_id !== ownerId) {
        return res.status(403).json({ success: false, message: 'Mutation rejected. You do not hold ownership clearance for this asset instance.' });
      }

      const updateQuery = `
        UPDATE properties
        SET name = COALESCE($1, name),
            category = COALESCE($2, category),
            price = COALESCE($3, price),
            status = COALESCE($4, status),
            location = COALESCE($5, location),
            gps_link = COALESCE($6, gps_link),
            description = COALESCE($7, description),
            updated_at = NOW()
        WHERE id = $8
        RETURNING id, name, category, price, status, location, gps_link, description, owner_id, updated_at;
      `;

      const queryParams = [
        name ? name.trim() : null,
        category ? category.trim() : null,
        price ? price.trim() : null,
        status ? status.trim() : null,
        location ? location.trim() : null,
        gpsLink ? gpsLink.trim() : null,
        description ? description.trim() : null,
        id
      ];

      const result = await db.query(updateQuery, queryParams);

      return res.status(200).json({
        success: true,
        message: 'Asset details updated and pushed to feed records successfully.',
        data: result.rows[0]
      });

    } catch (error) {
      console.error('Update product validation parameter update error:', error.message);
      return res.status(500).json({ success: false, message: 'Internal server error editing structural listing record details.' });
    }
  },

  /**
   * DELETE: Purge a property listing entry completely out of the database architecture
   */
  async deleteProduct(req, res) {
    try {
      const { id } = req.params;
      const ownerId = req.user?.uid;

      // Assert ownership permissions match before purging indexes from table blocks
      const verifyQuery = 'SELECT owner_id FROM properties WHERE id = $1';
      const verifyResult = await db.query(verifyQuery, [id]);

      if (verifyResult.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Target property listing document record not found.' });
      }

      if (verifyResult.rows[0].owner_id !== ownerId) {
        return res.status(403).json({ success: false, message: 'De-registration command rejected. Insufficient security access parameters.' });
      }

      const deleteQuery = 'DELETE FROM properties WHERE id = $1';
      await db.query(deleteQuery, [id]);

      return res.status(200).json({
        success: true,
        message: 'The selected property listing index has been permanently erased from active server arrays.'
      });

    } catch (error) {
      console.error('Delete database tracking entry lifecycle exception logic drop:', error.message);
      return res.status(500).json({ success: false, message: 'Internal server engine fault dropping property table instance row.' });
    }
  }
};

module.exports = productController;