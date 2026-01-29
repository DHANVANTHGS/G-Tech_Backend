const express = require('express');
const Router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const { getDashboardStats } = require('../controllers/adminController');

Router.get('/stats', adminAuth, getDashboardStats);

module.exports = Router;
