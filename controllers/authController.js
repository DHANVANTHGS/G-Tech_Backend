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
    return res.status(200).json({
        token,
        message: "Login successful",
        user: {
            id: user._id,
            name: user.name,
            email: user.mail,
            role: user.role
        }
    });
});

const signup = expressAsyncHandler(async (req, res) => {
    console.log("🔔 Signup controller hit!");
    const { name, mail, password } = req.body;
    console.log("📝 Signup Request:", JSON.stringify(req.body, null, 2));

    const existingUser = await User.findOne({ mail: mail });
    if (existingUser) {
        console.log("⚠️ User already exists:", mail);
        return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("🔒 Password hashed. Creating user...");

    // User.create returns the created user object with _id
    const newUser = await User.create({
        name: name,
        mail: mail,
        password: hashedPassword
    });
    const token = jwt.sign({ userid: newUser._id, mail: newUser.mail }, JWT_SECRET, { expiresIn: '1d' });
    console.log("✅ User created successfully:", newUser._id);

    return res.status(201).json({
        message: "User created successfully",
        token,
        user: {
            id: newUser._id,
            name: newUser.name,
            email: newUser.mail,
            role: newUser.role
        }
    });
});


const updatePassword = expressAsyncHandler(async (req, res) => {
    const user = req.user; // From middleware
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
        return res.status(400).json({ message: "Both old and new passwords are required" });
    }

    const userData = await User.findById(user._id);
    if (!userData) {
        return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, userData.password);
    if (!isMatch) {
        return res.status(400).json({ message: "Invalid old password" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(user._id, { password: hashedPassword });

    return res.status(200).json({ message: "Password updated successfully" });
});

module.exports = { login, signup, updatePassword };
