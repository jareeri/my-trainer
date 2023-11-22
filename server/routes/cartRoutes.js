// cartRoutes.js

const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const verifyToken = require("../middleware/authenticateToken");

// Define routes
router.get('/cart', verifyToken.authenticateToken, cartController.getAllItems);
router.get('/cart/:cart_id', verifyToken.authenticateToken, cartController.getItemById);
router.post('/cart', verifyToken.authenticateToken, cartController.addItemToCart);
router.put('/cart/:cart_id', verifyToken.authenticateToken, cartController.updateCartItem);
router.delete('/cart/:cart_id', verifyToken.authenticateToken, cartController.deleteCartItem);

module.exports = router;
