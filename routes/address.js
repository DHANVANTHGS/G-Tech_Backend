const express = require('express');
const Router = express.Router();

const {myaddresses,updateAddress,addAddress,deleteAddress} = require('../controllers/addressController');
const userauth = require('../middleware/userauth');

Router.use(userauth);

Router.get('/myaddresses',myaddresses);
Router.put('/update',updateAddress);
Router.post('/add',addAddress);
Router.delete('/delete',deleteAddress);

module.exports = Router;