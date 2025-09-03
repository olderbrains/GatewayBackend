const express = require('express');
const cors = require('cors');
const Razorpay = require('razorpay');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Create order endpoint
app.post('/create-order', async (req, res) => {
    try {
        const { keyId, keySecret, amount } = req.body;
        
        // Validate inputs
        if (!keyId || !keySecret || !amount) {
            return res.status(400).json({
                error: 'Key ID, Key Secret, and Amount are required'
            });
        }
        
        // Initialize Razorpay instance with provided keys
        const razorpay = new Razorpay({
            key_id: keyId,
            key_secret: keySecret
        });
        
        // Create order
        const options = {
            amount: amount * 100, // amount in paise (so multiply by 100)
            currency: 'INR',
            receipt: 'receipt_' + Math.random().toString(36).substring(7)
        };
        
        const order = await razorpay.orders.create(options);
        
        res.json({
            message: 'Order created successfully',
            order: order
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({
            error: error.error ? error.error.description : 'Failed to create order'
        });
    }
});

// Payment verification endpoint (optional)
app.post('/verify-payment', (req, res) => {
    // In a real application, you would verify the payment signature here
    // For demo purposes, we'll just return a success message
    res.json({
        message: 'Payment verified successfully (demo)',
        status: 'success'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Razorpay demo backend is ready!');
});