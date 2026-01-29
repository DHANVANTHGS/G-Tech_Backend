const express = require('express');
const Router = express.Router();
const { getProfile, updateProfile, getAllUsers, deleteUser } = require('../controllers/userController');
const userauth = require('../middleware/userauth');
const adminAuth = require('../middleware/adminAuth');

// User routes
Router.get('/profile', userauth, getProfile);
Router.put('/profile', userauth, updateProfile);

// Admin routes
Router.get('/all', adminAuth, getAllUsers);
Router.delete('/delete/:id', adminAuth, deleteUser);

module.exports = Router;

