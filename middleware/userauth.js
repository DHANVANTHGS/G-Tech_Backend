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