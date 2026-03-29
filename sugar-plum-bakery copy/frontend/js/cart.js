// cart.js - Cart management logic for Sugar Plum Bakery

// Cart data structure
let cart = [];
let cartCount = 0;

// Initialize cart from localStorage if available
function initCart() {
    const savedCart = localStorage.getItem('sugarPlumCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
        updateCartDisplay();
    }
}

// Add item to cart
function addToCart(itemId) {
    // Find item in menu (this would normally come from API)
    const menuItems = [
        { id: 1, name: "Chocolate Croissant", price: 4.50 },
        { id: 2, name: "Blueberry Muffins", price: 3.25 },
        { id: 3, name: "Vanilla Cupcake", price: 2.75 },
        { id: 4, name: "Sourdough Bread", price: 6.00 },
        { id: 5, name: "Apple Pie", price: 15.00 },
        { id: 6, name: "Cinnamon Rolls", price: 4.00 }
    ];

    const item = menuItems.find(item => item.id === itemId);
    if (!item) return;

    // Check if item already in cart
    const existingItem = cart.find(cartItem => cartItem.id === itemId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: 1
        });
    }

    updateCartCount();
    saveCart();
    showNotification(`${item.name} added to cart!`);
}

// Remove item from cart
function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    updateCartCount();
    updateCartDisplay();
    saveCart();
}

// Update item quantity
function updateQuantity(itemId, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(itemId);
        return;
    }

    const item = cart.find(item => item.id === itemId);
    if (item) {
        item.quantity = newQuantity;
        updateCartDisplay();
        saveCart();
    }
}

// Update cart count in navbar
function updateCartCount() {
    cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = cartCount;
    }
}

// Update cart display on cart page
function updateCartDisplay() {
    const cartItemsElement = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');

    if (!cartItemsElement) return;

    if (cart.length === 0) {
        cartItemsElement.innerHTML = '<p>Your cart is empty.</p>';
        if (cartTotalElement) cartTotalElement.textContent = '0.00';
        return;
    }

    let cartHTML = '';
    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        cartHTML += `
            <div class="cart-item">
                <img src="assets/images/${item.name.toLowerCase().replace(' ', '-')}.jpg" alt="${item.name}" onerror="this.src='assets/images/placeholder.jpg'">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>$${item.price.toFixed(2)} each</p>
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                        <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
                    </div>
                </div>
                <div class="item-total">$${itemTotal.toFixed(2)}</div>
            </div>
        `;
    });

    cartItemsElement.innerHTML = cartHTML;
    if (cartTotalElement) cartTotalElement.textContent = total.toFixed(2);
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('sugarPlumCart', JSON.stringify(cart));
}

// Show notification
function showNotification(message) {
    // Simple notification - in a real app, you'd use a proper notification system
    alert(message);
}

// Initialize cart when DOM is loaded
document.addEventListener('DOMContentLoaded', initCart);