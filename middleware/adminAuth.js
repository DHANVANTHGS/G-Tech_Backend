const User = require('../model/User');
const jwt = require('jsonwebtoken');

const adminAuth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find user by ID then check role
        const user = await User.findById(decoded.userid);

        if (!user || user.role !== 'admin') {
            throw new Error();
        }

        req.user = user;
        next();
    } catch (e) {
        res.status(401).send({ error: 'Please authenticate as admin.' });
    }
};

module.exports = adminAuth;
