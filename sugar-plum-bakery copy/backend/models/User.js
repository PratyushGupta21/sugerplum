// models/User.js - User database schema

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        trim: true,
        maxlength: [50, 'Name cannot be more than 50 characters']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        lowercase: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false // Don't include password in queries by default
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    avatar: {
        type: String,
        default: '/images/default-avatar.jpg'
    },
    phone: {
        type: String,
        match: [/^\+?[\d\s\-\(\)]+$/, 'Please add a valid phone number']
    },
    address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: {
            type: String,
            default: 'USA'
        }
    },
    preferences: {
        favoriteItems: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        }],
        dietaryRestrictions: [{
            type: String,
            enum: ['vegetarian', 'vegan', 'gluten-free', 'nut-free', 'dairy-free']
        }],
        notifications: {
            email: { type: Boolean, default: true },
            sms: { type: Boolean, default: false },
            promotions: { type: Boolean, default: true }
        }
    },
    lastLogin: {
        type: Date
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Encrypt password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Update last login
userSchema.methods.updateLastLogin = function() {
    this.lastLogin = new Date();
    return this.save({ validateBeforeSave: false });
};

// Virtual for full name (if we want to split first/last later)
userSchema.virtual('fullName').get(function() {
    return this.name;
});

// Virtual for account age
userSchema.virtual('accountAge').get(function() {
    return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24)); // days
});

// Ensure virtual fields are serialized
userSchema.set('toJSON', { virtuals: true });

// Remove password from JSON output
userSchema.methods.toJSON = function() {
    const userObject = this.toObject();
    delete userObject.password;
    return userObject;
};

module.exports = mongoose.model('User', userSchema);