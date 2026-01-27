const express = require('express');
const Router = express.Router();
const { newOrder, myOrders, cancelOrder, getOrderDetail, confirmOrder, getAllOrders, updateOrderStatus } = require('../controllers/orderController');
const userauth = require('../middleware/userauth');
const adminAuth = require('../middleware/adminAuth');

Router.use(userauth);

Router.post('/neworder', newOrder);
Router.get('/myorders', myOrders);
Router.put('/confirmorder', confirmOrder);
Router.post('/cancelorder', cancelOrder);
Router.get('/orderdetail/:orderid', getOrderDetail);

Router.get('/allorders', adminAuth, getAllOrders);
Router.put('/updatestatus', adminAuth, updateOrderStatus);

module.exports = Router;