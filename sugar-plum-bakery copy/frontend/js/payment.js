// payment.js - Payment form validation and processing for Sugar Plum Bakery

// Payment form validation
document.addEventListener('DOMContentLoaded', function() {
    const paymentForm = document.getElementById('payment-form');
    if (paymentForm) {
        paymentForm.addEventListener('submit', handlePaymentSubmit);
    }

    // Format card number input
    const cardNumberInput = document.getElementById('card-number');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', formatCardNumber);
    }

    // Format expiry input
    const expiryInput = document.getElementById('expiry');
    if (expiryInput) {
        expiryInput.addEventListener('input', formatExpiry);
    }

    // Format CVV input
    const cvvInput = document.getElementById('cvv');
    if (cvvInput) {
        cvvInput.addEventListener('input', limitCVV);
    }
});

// Handle payment form submission
function handlePaymentSubmit(event) {
    event.preventDefault();

    if (validatePaymentForm()) {
        processPayment();
    }
}

// Validate payment form
function validatePaymentForm() {
    const cardNumber = document.getElementById('card-number').value.replace(/\s/g, '');
    const expiry = document.getElementById('expiry').value;
    const cvv = document.getElementById('cvv').value;
    const name = document.getElementById('name').value.trim();

    // Basic validation
    if (!isValidCardNumber(cardNumber)) {
        showError('Please enter a valid card number');
        return false;
    }

    if (!isValidExpiry(expiry)) {
        showError('Please enter a valid expiry date (MM/YY)');
        return false;
    }

    if (!isValidCVV(cvv)) {
        showError('Please enter a valid CVV (3-4 digits)');
        return false;
    }

    if (name.length < 2) {
        showError('Please enter the name on the card');
        return false;
    }

    return true;
}

// Validate card number using Luhn algorithm
function isValidCardNumber(cardNumber) {
    if (!/^\d{13,19}$/.test(cardNumber)) return false;

    let sum = 0;
    let shouldDouble = false;

    for (let i = cardNumber.length - 1; i >= 0; i--) {
        let digit = parseInt(cardNumber.charAt(i));

        if (shouldDouble) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }

        sum += digit;
        shouldDouble = !shouldDouble;
    }

    return sum % 10 === 0;
}

// Validate expiry date
function isValidExpiry(expiry) {
    const match = expiry.match(/^(\d{2})\/(\d{2})$/);
    if (!match) return false;

    const month = parseInt(match[1]);
    const year = parseInt(match[2]) + 2000;

    if (month < 1 || month > 12) return false;

    const now = new Date();
    const expiryDate = new Date(year, month - 1);

    return expiryDate > now;
}

// Validate CVV
function isValidCVV(cvv) {
    return /^\d{3,4}$/.test(cvv);
}

// Format card number with spaces
function formatCardNumber(event) {
    let value = event.target.value.replace(/\s/g, '');
    value = value.replace(/\D/g, '');
    value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    event.target.value = value;
}

// Format expiry date
function formatExpiry(event) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    event.target.value = value;
}

// Limit CVV to 4 digits
function limitCVV(event) {
    let value = event.target.value.replace(/\D/g, '');
    event.target.value = value.slice(0, 4);
}

// Process payment (mock implementation)
function processPayment() {
    // Show loading state
    const submitBtn = document.querySelector('.checkout-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Processing...';
    submitBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;

        // Show success modal
        showOrderSuccess();
    }, 2000);
}

// Show order success modal
function showOrderSuccess() {
    const modal = document.createElement('div');
    modal.className = 'success-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h2>Order Successful!</h2>
            <p>Thank you for your order. You will receive a confirmation email shortly.</p>
            <button onclick="closeModal()">Continue Shopping</button>
        </div>
    `;

    // Add modal styles
    const style = document.createElement('style');
    style.textContent = `
        .success-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        }
        .modal-content {
            background-color: white;
            padding: 2rem;
            border-radius: 10px;
            text-align: center;
            max-width: 400px;
        }
        .modal-content h2 {
            color: var(--plum);
            margin-bottom: 1rem;
        }
        .modal-content button {
            background-color: var(--rose-pink);
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 5px;
            cursor: pointer;
            margin-top: 1rem;
        }
    `;
    document.head.appendChild(style);

    document.body.appendChild(modal);
}

// Close modal
function closeModal() {
    const modal = document.querySelector('.success-modal');
    if (modal) {
        modal.remove();
    }
    // Clear cart and redirect to home
    localStorage.removeItem('sugarPlumCart');
    showPage('home');
}

// Show error message
function showError(message) {
    alert(message); // In a real app, you'd use a proper error display
}