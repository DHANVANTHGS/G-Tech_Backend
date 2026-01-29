const expressAsyncHandler = require('express-async-handler');
const User = require('../model/User');
const Order = require('../model/Order');
const Product = require('../model/Product');

const getDashboardStats = expressAsyncHandler(async (req, res) => {
    // Aggregate data
    const usersSnapshot = await User.collection.get();
    const totalUsers = usersSnapshot.size;

    const productsSnapshot = await Product.collection.get();
    const totalProducts = productsSnapshot.size;

    let lowStockProducts = 0;
    productsSnapshot.forEach(doc => {
        const data = doc.data();
        if (data.stock < 10) { // Arbitrary low stock threshold
            lowStockProducts++;
        }
    });

    const ordersSnapshot = await Order.collection.get();
    const totalOrders = ordersSnapshot.size;

    let totalRevenue = 0;
    let pendingOrders = 0;

    ordersSnapshot.forEach(doc => {
        const data = doc.data();
        if (data.status !== 'Cancelled' && data.status !== 'Refunded') {
            totalRevenue += (data.totalAmount || 0);
        }
        if (data.status === 'Pending' || data.status === 'Payment Pending') {
            pendingOrders++;
        }
    });

    return res.status(200).json({
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue,
        lowStockProducts,
        pendingOrders
    });
});

module.exports = { getDashboardStats };
