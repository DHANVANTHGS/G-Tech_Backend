const express = require('express');
const Router = express.Router();
const { login, signup, updatePassword } = require('../controllers/authController');
const userauth = require('../middleware/userauth');

Router.post('/login', login);
Router.post('/register', signup);
Router.put('/updatepassword', userauth, updatePassword);

module.exports = Router;