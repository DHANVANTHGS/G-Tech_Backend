const Router = require('express').Router();

const middleware = require('../middleware/userauth');
const adminAuth = require('../middleware/adminAuth');

const { getproducts, getproduct, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
Router.get('/', middleware, getproducts);
Router.get('/:id', middleware, getproduct);
Router.post('/create', adminAuth, createProduct);
Router.put('/update/:id', adminAuth, updateProduct);
Router.delete('/delete/:id', adminAuth, deleteProduct);

module.exports = Router;