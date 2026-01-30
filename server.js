const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config(); // Load env first
const connect = require('./config/config');

const auth = require('./routes/auth');
const user = require('./routes/Users');
const address = require('./routes/address');
const orders = require('./routes/orders');
const product = require('./routes/product');

const app = express();

// Initialize DB (logging only)
connect();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require('cors')({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

const PORT = process.env.PORT || 3000;

app.use('/api/auth', auth);
app.use('/api/users', user);
app.use('/api/address', address);
app.use('/api/product', product);
app.use('/api/orders', orders);
app.use('/api/cart', require('./routes/cart'));
app.use('/api/admin', require('./routes/admin'));

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Backend is running' });
});

const server = app.listen(PORT, () => {
    console.log(`Server v2 (Public Products) is running on port ${PORT}`);
});

// Handle errors
server.on('error', (error) => {
    console.error('Server execution error:', error);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // Keep running
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    // Keep running or exit gracefully
});

module.exports = app;
