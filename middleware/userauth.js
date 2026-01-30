const jwt = require('jsonwebtoken');
const User = require('../model/User');

const userauth = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    try {
        const data = jwt.verify(token, process.env.JWT_SECRET);
        const mail = data.mail;

        // Admin Override Bypass
        if (data.userid === 'admin-override-id') {
            req.user = {
                _id: 'admin-override-id',
                name: 'Admin',
                mail: mail,
                role: 'admin',
                orders: [] // Mock orders can be handled by controller
            };
            return next();
        }

        const user = await User.findById(data.userid);
        if (!user) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        req.user = user;
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = userauth;