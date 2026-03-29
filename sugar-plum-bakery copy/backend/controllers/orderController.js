// controllers/orderController.js - Order management logic

const Order = require('../models/Order');
const Product = require('../models/Product');
const { sendOrderConfirmation } = require('../utils/sendEmail');

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate('user', 'name email')
            .populate('orderItems.product', 'name price')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error retrieving orders',
            error: error.message
        });
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private/Admin
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'name email')
            .populate('orderItems.product', 'name price');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.json({
            success: true,
            data: order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error retrieving order',
            error: error.message
        });
    }
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
    try {
        const { orderItems, paymentMethod, paymentResult } = req.body;

        if (!orderItems || orderItems.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No order items provided'
            });
        }

        // Calculate total price and check stock
        let totalPrice = 0;
        for (const item of orderItems) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: `Product ${item.product} not found`
                });
            }
            if (!product.inStock) {
                return res.status(400).json({
                    success: false,
                    message: `Product ${product.name} is out of stock`
                });
            }
            totalPrice += product.price * item.quantity;
        }

        const order = new Order({
            user: req.user._id,
            orderItems,
            totalPrice,
            paymentMethod: paymentMethod || 'card',
            paymentResult: paymentResult || {}
        });

        const createdOrder = await order.save();

        // Send confirmation email
        try {
            await sendOrderConfirmation(createdOrder);
        } catch (emailError) {
            console.error('Email sending failed:', emailError);
            // Don't fail the order if email fails
        }

        res.status(201).json({
            success: true,
            data: createdOrder
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error creating order',
            error: error.message
        });
    }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        const { status } = req.body;

        if (!['pending', 'processing', 'shipped', 'delivered', 'cancelled'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status'
            });
        }

        order.status = status;
        order.updatedAt = Date.now();

        const updatedOrder = await order.save();

        res.json({
            success: true,
            data: updatedOrder
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error updating order status',
            error: error.message
        });
    }
};

// @desc    Get user orders
// @route   GET /api/orders/myorders
// @access  Private
const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate('orderItems.product', 'name price')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error retrieving user orders',
            error: error.message
        });
    }
};

module.exports = {
    getOrders,
    getOrderById,
    createOrder,
    updateOrderStatus,
    getUserOrders
};