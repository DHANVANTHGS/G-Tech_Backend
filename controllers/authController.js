const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../model/User');
const expressAsyncHandler = require('express-async-handler');

const JWT_SECRET = process.env.JWT_SECRET

const login = expressAsyncHandler(async (req, res) => {
    const { mail, password } = req.body;
    const user = await User.findOne({ mail: mail });
    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid password" });
    }
    const token = jwt.sign({ userid: user._id, mail: user.mail }, JWT_SECRET, { expiresIn: '1d' });
    return res.status(200).json({ token, message: "Login successful" });
});

const signup = expressAsyncHandler(async (req, res) => {
    const { name, mail, password } = req.body;
    const existingUser = await User.findOne({ mail: mail });
    if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
        name: name,
        mail: mail,
        password: hashedPassword
    });
    await newUser.save();
    return res.status(201).json({ message: "User created successfully" });
});

module.exports = { login, signup };

