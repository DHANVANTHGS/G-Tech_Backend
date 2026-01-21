const Router = require('express').Router();

const middleware = require('../middleware/authMiddleware');

const {getproducts, getproduct} = require('../controllers/productController');
Router.get('/',middleware,getproducts);
Router.get('/:id',middleware,getproduct);   

module.exports = Router;