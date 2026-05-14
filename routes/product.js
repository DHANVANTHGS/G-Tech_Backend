const Router = require('express').Router();

const middleware = require('../middleware/userauth');
const adminAuth = require('../middleware/adminAuth');

const { getproducts, checkProductsExist, getproduct, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
Router.get('/', getproducts);
Router.get('/exists', checkProductsExist);
Router.get('/:id', getproduct);
Router.post('/create', adminAuth, createProduct);
Router.put('/update/:id', adminAuth, updateProduct);
Router.delete('/delete/:id', adminAuth, deleteProduct);

module.exports = Router;