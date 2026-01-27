const expressAsyncHandler = require('express-async-handler');
const Order = require('../model/Order');
const User = require('../model/User');
const Product = require('../model/Product');
const { findById, findByIdAndUpdate } = require('../model/User');

const newOrder = expressAsyncHandler(async (req, res) => {
    const user = req.user;
    const { products, totalAmount, address } = req.body;
    if (!products || products.length === 0) {
        return res.status(400).json({ message: "Products are required to place an order" });
    }
    const orderItems = [];
    let Amount = 0;
    var orderAddress = '';
    const check = await User.findById(user._id).select('address');
    if (!check) {
        return res.status(404).json({ message: "User not found" });
    }
    if (check.address.includes(address)) {
        orderAddress = address;
    } else {
        return res.status(400).json({ message: "Address not found in user's address list" });
    }
    for (const item of products) {
        const product = await Product.findById(item.productId);
        if (!product) {
            return res.status(404).json({ message: `Product with ID ${item.productId} not found` });
        }
        orderItems.push({
            product: product._id,
            quantity: item.quantity,
            price: product.price
        });
        Amount += product.price * item.quantity;
    }
    if (Amount !== totalAmount) {
        return res.status(400).json({ message: "Total amount mismatch" });
    }
    const newOrder = new Order({
        user: user._id,
        items: orderItems,
        totalAmount: Amount,
        address: orderAddress,
        status: 'Payment Pending'
    });
    await newOrder.save();
    await newOrder.save();
    return res.status(201).json({ message: "Order placed successfully", order: newOrder });
});

const confirmOrder = expressAsyncHandler(async (req, res) => {
    const user = req.user;
    const { orderId } = req.body;
    const order = await Order.findOne({ _id: orderId, user: user._id });
    if (!order) {
        return res.status(404).json({ message: "Order not found" });
    }
    order.status = 'Pending';
    await order.save();
    return res.status(200).json({ message: "Order confirmed successfully", order });
});

const myOrders = expressAsyncHandler(async (req, res) => {
    const user = req.user;
    const data = await User.findById(user._id).populate('orders');
    if (!data) {
        return res.status(404).json({ message: "No orders found" });
    }
    return res.status(200).json(data.orders);
});

const cancelOrder = expressAsyncHandler(async (req, res) => {
    const user = req.user;
    const { orderid } = req.body;
    const order_data = await Order.findById(orderid);
    if (!order_data) {
        return res.status(404).json({ message: "Order not found" });
    }
    if (order_data.status == 'Shipped' || order_data.status == 'Delivered') {
        return res.status(400).json({ message: 'Order cancellation is not available at this stage' });
    }
    const user_data = await User.findByIdAndUpdate(user._id, { $pull: { orders: orderid } }, { new: true }).select('orders');
    if (!user_data) {
        return res.status(500).json({ message: "Failed to cancel order from the user orders" });
    }
    const order_update = await Order.findByIdAndUpdate(orderid, { status: 'Cancelled-Refund pending' }, { new: true });
    if (!order_update) {
        return res.status(500).json({ message: "Failed to cancel order" });
    }
    return res.status(200).json({ order_update, user_data, message: "Order cancelled successfully" });
});

const getOrderDetail = expressAsyncHandler(async (req, res) => {
    const user = req.user;
    const orderId = req.params.orderid;
    const data = await Order.findOne({ _id: orderId, user: user._id });
    if (!data) {
        res.status(404).json({ message: "Order not found" });
    }
    return res.status(200).json(data);
});

const getAllOrders = expressAsyncHandler(async (req, res) => {
    const orders = await Order.find().populate('user', 'name mail').populate('items.product', 'name price');
    if (!orders) {
        return res.status(404).json({ message: "No orders found" });
    }
    return res.status(200).json(orders);
});

const updateOrderStatus = expressAsyncHandler(async (req, res) => {
    const { orderid, status } = req.body;
    const order = await Order.findByIdAndUpdate(orderid, { status: status }, { new: true });
    if (!order) {
        return res.status(404).json({ message: "Order not found" });
    }
    return res.status(200).json({ order, message: "Order status updated successfully" });
});

module.exports = { newOrder, confirmOrder, myOrders, cancelOrder, getOrderDetail, getAllOrders, updateOrderStatus };