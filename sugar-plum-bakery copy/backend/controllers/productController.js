// controllers/productController.js - Product management logic

const Product = require('../models/Product');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error retrieving products',
            error: error.message
        });
    }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error retrieving product',
            error: error.message
        });
    }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
    try {
        const { name, description, price, category, image, inStock } = req.body;

        // Validation
        if (!name || !price) {
            return res.status(400).json({
                success: false,
                message: 'Please provide name and price'
            });
        }

        const product = new Product({
            name,
            description,
            price,
            category,
            image,
            inStock: inStock !== undefined ? inStock : true
        });

        const createdProduct = await product.save();

        res.status(201).json({
            success: true,
            data: createdProduct
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error creating product',
            error: error.message
        });
    }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        const { name, description, price, category, image, inStock } = req.body;

        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price || product.price;
        product.category = category || product.category;
        product.image = image || product.image;
        product.inStock = inStock !== undefined ? inStock : product.inStock;

        const updatedProduct = await product.save();

        res.json({
            success: true,
            data: updatedProduct
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error updating product',
            error: error.message
        });
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        await product.remove();

        res.json({
            success: true,
            message: 'Product removed'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error deleting product',
            error: error.message
        });
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};