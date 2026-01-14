const express = require('express');
const Router = express.Router();    
const {login,signup}=require('controllers/authController');

Router.post('/login',login);
Router.post('/register',signup);

module.exports = Router;