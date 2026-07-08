const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect, authorize } = require('../middleware/authMiddleware');

/**
 * ============================================================================
 * Public / Open Access Marketplace Routes
 * ============================================================================
 */

/**
 * @route   GET /api/v1/products
 * @desc    Retrieves global marketplace index feed with optional category/status query filters
 * @access  Public
 */
router.get('/', productController.getAllProducts);

/**
 * ============================================================================
 * Protected / Restricted Management Routes (Requires Valid Session JWT)
 * ============================================================================
 */

/**
 * @route   GET /api/v1/products/my-listings
 * @desc    Isolates property inventory rows managed explicitly by the authenticated user
 * @access  Protected (Requires 'owner' role specification)
 */
router.get(
  '/my-listings', 
  protect, 
  authorize('owner'), 
  productController.getOwnerProducts
);

/**
 * @route   POST /api/v1/products
 * @desc    Provisions, validates, and publishes a new real estate asset entry
 * @access  Protected (Requires 'owner' role specification)
 */
router.post(
  '/', 
  protect, 
  authorize('owner'), 
  productController.createProduct
);

/**
 * @route   PUT /api/v1/products/:id
 * @desc    Modifies explicit specification vectors or listing parameters for an asset
 * @access  Protected (Requires 'owner' role specification + document ownership match)
 */
router.put(
  '/:id', 
  protect, 
  authorize('owner'), 
  productController.updateProduct
);

/**
 * @route   DELETE /api/v1/products/:id
 * @desc    Permanently purges a listing out of active storage array rows
 * @access  Protected (Requires 'owner' role specification + document ownership match)
 */
router.delete(
  '/:id', 
  protect, 
  authorize('owner'), 
  productController.deleteProduct
);

module.exports = router;