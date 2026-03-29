// models/Order.js - Order database schema

const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity must be at least 1']
    },
    price: {
        type: Number,
        required: true,
        min: [0, 'Price must be positive']
    }
});

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    orderItems: [orderItemSchema],
    shippingAddress: {
        address: {
            type: String,
            required: [true, 'Please add a shipping address']
        },
        city: {
            type: String,
            required: [true, 'Please add a city']
        },
        postalCode: {
            type: String,
            required: [true, 'Please add a postal code']
        },
        country: {
            type: String,
            required: [true, 'Please add a country'],
            default: 'USA'
        }
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ['card', 'paypal', 'crypto'],
        default: 'card'
    },
    paymentResult: {
        id: String,
        status: String,
        update_time: String,
        email_address: String
    },
    taxPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    shippingPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    deliveredAt: {
        type: Date
    },
    orderNumber: {
        type: String,
        unique: true
    },
    notes: {
        type: String,
        maxlength: [500, 'Notes cannot be more than 500 characters']
    }
}, {
    timestamps: true
});

// Generate unique order number before saving
orderSchema.pre('save', function(next) {
    if (!this.orderNumber) {
        this.orderNumber = 'SPB-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();
    }
    next();
});

// Virtual for order age
orderSchema.virtual('orderAge').get(function() {
    return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24)); // days
});

// Virtual for formatted total
orderSchema.virtual('formattedTotal').get(function() {
    return `$${this.totalPrice.toFixed(2)}`;
});

// Ensure virtual fields are serialized
orderSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Order', orderSchema);