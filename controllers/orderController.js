const expressAsyncHandler = require('express-async-handler');
const Order = require('../model/Order');
const User = require('../model/User');
const Product = require('../model/Product');
const { admin } = require('../config/config');

const newOrder = expressAsyncHandler(async (req, res) => {
    console.log("🔔 newOrder controller hit!");
    const user = req.user;
    console.log("👤 User from token:", user._id, user.mail);

    const { products, totalAmount, address } = req.body;
    console.log("📦 Request Body:", JSON.stringify(req.body, null, 2));

    if (!products || products.length === 0) {
        console.log("❌ No products provided");
        return res.status(400).json({ message: "Products are required to place an order" });
    }
    const orderItems = [];
    let Amount = 0;
    var orderAddress = '';

    // Debug User Check
    const check = await User.findById(user._id);
    if (!check) {
        console.log("❌ User not found in DB check");
        return res.status(404).json({ message: "User not found" });
    }

    // Debug Address Logic
    console.log("🏠 User Address List:", check.address);
    console.log("📍 Requested Address:", address);

    // Address check logic (exact match)
    if (check.address && check.address.includes(address)) {
        orderAddress = address;
    } else {
        console.log("❌ Address mismatch. User has:", check.address, "Requested:", address);
        return res.status(400).json({ message: "Address not found in user's address list" });
    }

    for (const item of products) {
        const product = await Product.findById(item.productId);
        if (!product) {
            console.log("❌ Product not found:", item.productId);
            return res.status(404).json({ message: `Product with ID ${item.productId} not found` });
        }
        orderItems.push({
            product: product._id, // Store ID only
            quantity: item.quantity,
            price: product.price
        });
        Amount += product.price * item.quantity;
    }

    console.log("💰 Calculated Amount:", Amount, "Provided Total:", totalAmount);
    if (Amount !== totalAmount) {
        console.log("❌ Amount mismatch");
        return res.status(400).json({ message: "Total amount mismatch" });
    }

    console.log("💾 Saving order to Firestore...");
    const newOrderData = await Order.create({
        user: user._id,
        items: orderItems,
        totalAmount: Amount,
        address: orderAddress,
        status: 'Payment Pending'
    });
    console.log("✅ Order saved with ID:", newOrderData._id);

    // Update user's orders list using arrayUnion
    console.log("🔗 Linking to user...");
    await User.findByIdAndUpdate(user._id, {
        orders: admin.firestore.FieldValue.arrayUnion(newOrderData._id)
    });
    console.log("✅ User updated.");

    return res.status(201).json({ message: "Order placed successfully", order: newOrderData });
});

const confirmOrder = expressAsyncHandler(async (req, res) => {
    const user = req.user;
    const { orderId } = req.body;
    let order = await Order.findById(orderId);

    if (!order || order.user !== user._id) {
        return res.status(404).json({ message: "Order not found" });
    }

    order = await Order.findByIdAndUpdate(orderId, { status: 'Pending' }, { new: true });
    return res.status(200).json({ message: "Order confirmed successfully", order });
});

const myOrders = expressAsyncHandler(async (req, res) => {
    const user = req.user;
    const userData = await User.findById(user._id);
    if (!userData || !userData.orders || userData.orders.length === 0) {
        return res.status(200).json([]);
    }

    const orderPromises = userData.orders.map(orderId => Order.findById(orderId));
    const orders = (await Promise.all(orderPromises)).filter(o => o !== null);

    return res.status(200).json(orders);
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

    await User.findByIdAndUpdate(user._id, {
        orders: admin.firestore.FieldValue.arrayRemove(orderid)
    });

    const order_update = await Order.findByIdAndUpdate(orderid, { status: 'Cancelled-Refund pending' }, { new: true });
    const user_data = await User.findById(user._id);

    return res.status(200).json({ order_update, user_data, message: "Order cancelled successfully" });
});

const getOrderDetail = expressAsyncHandler(async (req, res) => {
    const user = req.user;
    const orderId = req.params.orderid;
    const data = await Order.findById(orderId);
    if (!data || data.user !== user._id) {
        return res.status(404).json({ message: "Order not found" });
    }
    return res.status(200).json(data);
});

const getAllOrders = expressAsyncHandler(async (req, res) => {
    const orders = await Order.find();

    for (let order of orders) {
        if (order.user) {
            const u = await User.findById(order.user);
            if (u) {
                order.user = { _id: u._id, name: u.name, mail: u.mail };
            }
        }
        if (order.items) {
            for (let item of order.items) {
                if (item.product) {
                    const p = await Product.findById(item.product);
                    if (p) {
                        item.product = { _id: p._id, name: p.name, price: p.price };
                    }
                }
            }
        }
    }

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