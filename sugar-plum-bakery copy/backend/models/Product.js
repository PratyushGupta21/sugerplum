// models/Product.js - Product database schema

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a product name'],
        trim: true,
        maxlength: [100, 'Name cannot be more than 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Please add a product description'],
        maxlength: [500, 'Description cannot be more than 500 characters']
    },
    price: {
        type: Number,
        required: [true, 'Please add a price'],
        min: [0, 'Price must be positive']
    },
    category: {
        type: String,
        required: [true, 'Please add a category'],
        enum: ['pastries', 'cakes', 'bread', 'cookies', 'pies', 'other'],
        default: 'other'
    },
    image: {
        type: String,
        default: '/images/placeholder.jpg'
    },
    inStock: {
        type: Boolean,
        default: true
    },
    stockQuantity: {
        type: Number,
        default: 0,
        min: [0, 'Stock quantity cannot be negative']
    },
    ingredients: [{
        type: String,
        trim: true
    }],
    allergens: [{
        type: String,
        enum: ['nuts', 'dairy', 'eggs', 'wheat', 'soy', 'shellfish'],
        trim: true
    }],
    nutritionalInfo: {
        calories: Number,
        fat: Number,
        carbs: Number,
        protein: Number
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    numReviews: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Index for search functionality
productSchema.index({ name: 'text', description: 'text' });

// Virtual for formatted price
productSchema.virtual('formattedPrice').get(function() {
    return `$${this.price.toFixed(2)}`;
});

// Ensure virtual fields are serialized
productSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);