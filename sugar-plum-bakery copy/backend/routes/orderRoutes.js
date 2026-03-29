// routes/orderRoutes.js - API routes for customer orders

const express = require('express');
const router = express.Router();
const {
    getOrders,
    getOrderById,
    createOrder,
    updateOrderStatus,
    getUserOrders
} = require('../controllers/orderController');

// Import middleware
const { protect, admin } = require('../middleware/authMiddleware');

// User routes (require authentication)
router.post('/', protect, createOrder);
router.get('/myorders', protect, getUserOrders);

// Admin routes (require authentication and admin role)
router.get('/', protect, admin, getOrders);
router.get('/:id', protect, admin, getOrderById);
router.put('/:id/status', protect, admin, updateOrderStatus);

module.exports = router;