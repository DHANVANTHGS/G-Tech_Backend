const express = require('express');
const Router = express.Router();
const { getCart, addToCart, removeFromCart, updateCartItem } = require('../controllers/cartController');
const userauth = require('../middleware/userauth');

Router.use(userauth);

Router.get('/', getCart);
Router.post('/add', addToCart);
Router.delete('/remove', removeFromCart);
Router.put('/update', updateCartItem);

module.exports = Router;
