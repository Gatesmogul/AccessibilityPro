const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

/**
 * ============================================================================
 * Protected Customer Shopping Cart Routes (Requires Valid JWT Signature)
 * ============================================================================
 */

// Bind the security verification middleware globally to all sub-routes in this module
router.use(protect);

/**
 * @route   GET /api/v1/cart
 * @desc    Retrieves all active property line items saved in the customer's cart
 * @access  Protected
 */
router.get('/', cartController.getCart);

/**
 * @route   POST /api/v1/cart
 * @desc    Adds a property selection to the user's cart or increments its count
 * @access  Protected
 */
router.post('/', cartController.addToCart);

/**
 * @route   DELETE /api/v1/cart/:propertyId
 * @desc    Decrements an item count or drops the record row completely if volume hits 0
 * @access  Protected
 */
router.delete('/:propertyId', cartController.removeFromCart);

/**
 * @route   DELETE /api/v1/cart/clear/all
 * @desc    Completely purges all items from the authenticated user's cart
 * @access  Protected
 */
router.delete('/clear/all', cartController.clearCart);

module.exports = router;