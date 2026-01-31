
const Razorpay = require('razorpay');
// crypto is a built-in Node module
const crypto = require('crypto');

const paymentInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create Order
exports.createOrder = async (req, res) => {
    try {
        const { amount, currency } = req.body;

        if (!amount) {
            return res.status(400).json({ success: false, message: "Amount is required" });
        }

        const options = {
            amount: amount * 100, // Razorpay works in smallest currency unit (paise for INR)
            currency: currency || "INR",
            receipt: `order_${Date.now()}`
        };

        const order = await paymentInstance.orders.create(options);

        res.status(200).json({
            success: true,
            order
        });
    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        res.status(500).json({ success: false, message: "Something went wrong at payment creation" });
    }
};

// Verify Payment (Optional but recommended for security)
exports.verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature === razorpay_signature) {
            // Payment is authentic & successful
            // Here you can save payment details to your database
            res.status(200).json({
                success: true,
                message: "Payment verified successfully"
            });
        } else {
            res.status(400).json({
                success: false,
                message: "Invalid signature sent!"
            });
        }
    } catch (error) {
        console.error("Error verifying payment:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
