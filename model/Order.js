const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,   
                ref: 'Product',
                required: true
            },
            quantity: { 
                type: Number,
                required: true,
                default: 1
            }
        }
    ],
    totalAmount: {
        type: Number,
        required: true
    },  
    status: {
        type: String,
        enum: ['Payment Pending','Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled-Refund pending','Cancelled-Refunded'],
        default: 'Payment Pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Order', orderSchema);