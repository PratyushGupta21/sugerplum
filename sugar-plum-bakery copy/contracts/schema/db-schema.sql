-- Sugar Plum Bakery Database Schema
-- MySQL/MariaDB compatible

-- Create database
CREATE DATABASE IF NOT EXISTS sugar_plum_bakery;
USE sugar_plum_bakery;

-- Users table
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    avatar VARCHAR(255) DEFAULT '/images/default-avatar.jpg',
    phone VARCHAR(20),
    street VARCHAR(100),
    city VARCHAR(50),
    state VARCHAR(50),
    zip_code VARCHAR(20),
    country VARCHAR(50) DEFAULT 'USA',
    favorite_items JSON,
    dietary_restrictions JSON,
    email_notifications BOOLEAN DEFAULT TRUE,
    sms_notifications BOOLEAN DEFAULT FALSE,
    promotions_notifications BOOLEAN DEFAULT TRUE,
    last_login DATETIME,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_email (email),
    INDEX idx_is_active (is_active)
);

-- Products table
CREATE TABLE products (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL CHECK (price > 0),
    category ENUM('pastries', 'cakes', 'bread', 'cookies', 'pies', 'other') NOT NULL DEFAULT 'other',
    image VARCHAR(255) DEFAULT '/images/placeholder.jpg',
    in_stock BOOLEAN DEFAULT TRUE,
    stock_quantity INT DEFAULT 0 CHECK (stock_quantity >= 0),
    ingredients JSON,
    allergens JSON,
    calories INT,
    fat DECIMAL(5,2),
    carbs DECIMAL(5,2),
    protein DECIMAL(5,2),
    is_featured BOOLEAN DEFAULT FALSE,
    rating DECIMAL(3,2) DEFAULT 0.00 CHECK (rating >= 0 AND rating <= 5),
    num_reviews INT DEFAULT 0 CHECK (num_reviews >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_category (category),
    INDEX idx_in_stock (in_stock),
    INDEX idx_is_featured (is_featured),
    FULLTEXT idx_search (name, description)
);

-- Orders table
CREATE TABLE orders (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    shipping_address JSON NOT NULL,
    payment_method ENUM('card', 'paypal', 'crypto') NOT NULL DEFAULT 'card',
    payment_result JSON,
    tax_price DECIMAL(10,2) DEFAULT 0.00,
    shipping_price DECIMAL(10,2) DEFAULT 0.00,
    total_price DECIMAL(10,2) NOT NULL CHECK (total_price > 0),
    status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') NOT NULL DEFAULT 'pending',
    delivered_at DATETIME,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_order_number (order_number),
    INDEX idx_created_at (created_at)
);

-- Order items table
CREATE TABLE order_items (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    order_id VARCHAR(36) NOT NULL,
    product_id VARCHAR(36) NOT NULL,
    name VARCHAR(100) NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    price DECIMAL(10,2) NOT NULL CHECK (price > 0),

    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_order_id (order_id),
    INDEX idx_product_id (product_id)
);

-- Product reviews table
CREATE TABLE product_reviews (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    product_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_product_review (user_id, product_id),
    INDEX idx_product_id (product_id),
    INDEX idx_rating (rating)
);

-- Shopping cart table (for persistent carts)
CREATE TABLE shopping_cart (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    product_id VARCHAR(36) NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_product_cart (user_id, product_id),
    INDEX idx_user_id (user_id)
);

-- Coupons/Discounts table
CREATE TABLE coupons (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    code VARCHAR(50) UNIQUE NOT NULL,
    description VARCHAR(255),
    discount_type ENUM('percentage', 'fixed') NOT NULL,
    discount_value DECIMAL(10,2) NOT NULL CHECK (discount_value > 0),
    minimum_order DECIMAL(10,2) DEFAULT 0.00,
    usage_limit INT,
    used_count INT DEFAULT 0,
    valid_from DATETIME NOT NULL,
    valid_until DATETIME NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_code (code),
    INDEX idx_is_active (is_active),
    INDEX idx_valid_until (valid_until)
);

-- Order coupons junction table
CREATE TABLE order_coupons (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    order_id VARCHAR(36) NOT NULL,
    coupon_id VARCHAR(36) NOT NULL,

    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE CASCADE,
    UNIQUE KEY unique_order_coupon (order_id, coupon_id)
);

-- Delivery zones table
CREATE TABLE delivery_zones (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(100) NOT NULL,
    zip_codes JSON NOT NULL,
    delivery_fee DECIMAL(5,2) DEFAULT 0.00,
    minimum_order DECIMAL(5,2) DEFAULT 0.00,
    estimated_delivery_time VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,

    INDEX idx_is_active (is_active)
);

-- Store locations table
CREATE TABLE store_locations (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(100) NOT NULL,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(50) NOT NULL,
    state VARCHAR(50) NOT NULL,
    zip_code VARCHAR(20) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100),
    hours JSON,
    is_active BOOLEAN DEFAULT TRUE,

    INDEX idx_city (city),
    INDEX idx_is_active (is_active)
);

-- Insert sample data
INSERT INTO users (name, email, password, is_admin) VALUES
('Admin User', 'admin@sugarplumbakery.com', '$2a$10$hashedpassword', TRUE),
('John Doe', 'john@example.com', '$2a$10$hashedpassword', FALSE);

INSERT INTO products (name, description, price, category, in_stock, stock_quantity) VALUES
('Chocolate Croissant', 'Buttery croissant filled with rich chocolate', 4.50, 'pastries', TRUE, 50),
('Blueberry Muffins', 'Fresh blueberries in a moist muffin', 3.25, 'pastries', TRUE, 30),
('Vanilla Cupcake', 'Classic vanilla cupcake with buttercream frosting', 2.75, 'pastries', TRUE, 40),
('Sourdough Bread', 'Artisanal sourdough bread, perfect for sandwiches', 6.00, 'bread', TRUE, 20),
('Apple Pie', 'Traditional apple pie with lattice crust', 15.00, 'pies', TRUE, 10),
('Cinnamon Rolls', 'Soft, gooey cinnamon rolls with cream cheese frosting', 4.00, 'pastries', TRUE, 25);

-- Create indexes for better performance
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_product_reviews_product_id ON product_reviews(product_id);