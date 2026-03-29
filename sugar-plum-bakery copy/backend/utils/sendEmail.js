// utils/sendEmail.js - Email sending utility for order confirmations

const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
    return nodemailer.createTransporter({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
};

// Send order confirmation email
const sendOrderConfirmation = async (order) => {
    try {
        const transporter = createTransporter();

        // Email content
        const orderItemsHTML = order.orderItems.map(item => `
            <tr>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>$${(item.price * item.quantity).toFixed(2)}</td>
            </tr>
        `).join('');

        const mailOptions = {
            from: `"Sugar Plum Bakery" <${process.env.EMAIL_USER}>`,
            to: order.user.email,
            subject: `Order Confirmation - ${order.orderNumber}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #FFB6C1; text-align: center;">Sugar Plum Bakery</h1>
                    <h2>Order Confirmation</h2>
                    <p>Thank you for your order! Here are the details:</p>

                    <div style="background-color: #FFFDD0; padding: 20px; border-radius: 10px; margin: 20px 0;">
                        <h3>Order #${order.orderNumber}</h3>
                        <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
                        <p><strong>Status:</strong> ${order.status}</p>
                        <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
                    </div>

                    <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                        <thead>
                            <tr style="background-color: #8B4513; color: white;">
                                <th style="padding: 10px; text-align: left;">Item</th>
                                <th style="padding: 10px; text-align: center;">Qty</th>
                                <th style="padding: 10px; text-align: center;">Price</th>
                                <th style="padding: 10px; text-align: center;">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${orderItemsHTML}
                        </tbody>
                        <tfoot>
                            <tr style="border-top: 2px solid #8B4513;">
                                <td colspan="3" style="padding: 10px; text-align: right; font-weight: bold;">Total:</td>
                                <td style="padding: 10px; font-weight: bold;">$${order.totalPrice.toFixed(2)}</td>
                            </tr>
                        </tfoot>
                    </table>

                    <div style="background-color: #FFD700; padding: 20px; border-radius: 10px; margin: 20px 0;">
                        <h3>Shipping Address</h3>
                        <p>
                            ${order.shippingAddress.address}<br>
                            ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}<br>
                            ${order.shippingAddress.country}
                        </p>
                    </div>

                    <p style="text-align: center; margin: 30px 0;">
                        <a href="${process.env.FRONTEND_URL}/orders/${order._id}"
                           style="background-color: #FFB6C1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                            View Order Details
                        </a>
                    </p>

                    <p style="text-align: center; color: #666; font-size: 12px;">
                        If you have any questions, please contact us at ${process.env.EMAIL_USER}
                    </p>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Order confirmation email sent:', info.messageId);

        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Email sending failed:', error);
        throw new Error('Failed to send order confirmation email');
    }
};

// Send password reset email
const sendPasswordReset = async (email, resetToken) => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: `"Sugar Plum Bakery" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Password Reset Request',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #FFB6C1; text-align: center;">Sugar Plum Bakery</h1>
                    <h2>Password Reset</h2>
                    <p>You requested a password reset. Click the link below to reset your password:</p>
                    <p style="text-align: center; margin: 30px 0;">
                        <a href="${process.env.FRONTEND_URL}/reset-password/${resetToken}"
                           style="background-color: #FFB6C1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                            Reset Password
                        </a>
                    </p>
                    <p style="color: #666; font-size: 12px;">
                        This link will expire in 1 hour. If you didn't request this reset, please ignore this email.
                    </p>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Password reset email sent:', info.messageId);

        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Password reset email sending failed:', error);
        throw new Error('Failed to send password reset email');
    }
};

module.exports = {
    sendOrderConfirmation,
    sendPasswordReset
};