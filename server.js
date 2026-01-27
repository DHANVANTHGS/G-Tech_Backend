const express = require('express');
const bodyParser = require('body-parser');
const auth = require('./routes/auth');
const connect = require('./config/config');
const user = require('./routes/Users');
const address = require('./routes/address');
const orders = require('./routes/orders');
const product = require('./routes/product');
require('dotenv').config();

const app = express();
connect();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require('cors')());
const PORT = process.env.PORT || 3000;

app.use('/api/auth', auth);
app.use('/api/users', user);
app.use('/api/address', address);
app.use('/api/product', product);
app.use('/api/orders', orders);
app.use('/api/cart', require('./routes/cart'));


app.listen(PORT, (req, res) => {
    console.log(`Server is running on port ${PORT}`);
});
