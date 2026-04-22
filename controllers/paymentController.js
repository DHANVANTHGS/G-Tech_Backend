const axios = require('axios');

const CASHFREE_BASE_URL = process.env.CASHFREE_ENV === 'production'
    ? 'https://api.cashfree.com/pg'
    : 'https://sandbox.cashfree.com/pg';

const cashfreeHeaders = () => ({
    'x-client-id': process.env.CASHFREE_APP_ID,
    'x-client-secret': process.env.CASHFREE_SECRET_KEY,
    'x-api-version': '2023-08-01',
    'Content-Type': 'application/json'
});

// Create Order
exports.createOrder = async (req, res) => {
    try {
        const { amount, currency } = req.body;

        if (!amount) {
            return res.status(400).json({ success: false, message: "Amount is required" });
        }

        const orderId = `order_${Date.now()}`;

        const orderData = {
            order_id: orderId,
            order_amount: amount,
            order_currency: currency || 'INR',
            customer_details: {
                customer_id: `cust_${Date.now()}`,
                customer_phone: '9999999999'
            }
        };

        const response = await axios.post(
            `${CASHFREE_BASE_URL}/orders`,
            orderData,
            { headers: cashfreeHeaders() }
        );

        res.status(200).json({
            success: true,
            order: response.data
        });
    } catch (error) {
        console.error("Error creating Cashfree order:", error.response?.data || error.message);
        res.status(500).json({
            success: false,
            message: "Something went wrong at payment creation",
            error: error.response?.data
        });
    }
};

// Verify Payment
exports.verifyPayment = async (req, res) => {
    try {
        const { order_id } = req.body;

        if (!order_id) {
            return res.status(400).json({ success: false, message: "order_id is required" });
        }

        const response = await axios.get(
            `${CASHFREE_BASE_URL}/orders/${order_id}`,
            { headers: cashfreeHeaders() }
        );

        const orderData = response.data;

        if (orderData.order_status === 'PAID') {
            res.status(200).json({
                success: true,
                message: "Payment verified successfully",
                order: orderData
            });
        } else {
            res.status(400).json({
                success: false,
                message: `Payment not completed. Status: ${orderData.order_status}`
            });
        }
    } catch (error) {
        console.error("Error verifying Cashfree payment:", error.response?.data || error.message);
        res.status(500).json({
            success: false,
            message: "Payment verification failed",
            error: error.response?.data
        });
    }
};
