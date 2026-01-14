const express = require('express');
const Router = express.Router();   
const {getProfile , updateProfile} = require('../controllers/userController');
const userauth = require('../middleware/userauth');

Router.use(userauth);

Router.get('/profile', getProfile);
Router.put('/profile', updateProfile);

module.exports = Router;

