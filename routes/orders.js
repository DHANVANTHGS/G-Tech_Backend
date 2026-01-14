const express = require('express');
const Router = express.Router();
const {newOrder,myOrders,cancelOrder,getOrderDetail,confirmOrder}=require('../controllers/orderController');
const userauth = require('../middleware/userauth');

Router.use(userauth);

Router.post('/neworder',newOrder);
Router.get('/myorders',myOrders);
Router.put('/confirmorder',confirmOrder);
Router.post('/cancelorder',cancelOrder);
Router.get('/orderdetail/:orderid',getOrderDetail);