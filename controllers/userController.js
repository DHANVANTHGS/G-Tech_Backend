const User = require('../model/User');
const expressAsyncHandler = require('express-async-handler');

const getProfile = expressAsyncHandler(async (req, res) => {
    const user = req.user;
    if (!user) {
        console.log("User not found in getProfile");
        return res.status(404).json({ message: "User not found" });
    }
    const userData = await User.findById(user._id);
    if (!userData) {
        console.log("User data not found in database for ID:", user._id);
        return res.status(404).json({ message: "User data not found" });
    }
    delete userData.password;
    return res.status(200).json(userData);
});

const updateProfile = expressAsyncHandler(async (req, res) => {
    const { name, mail, mobileno, gender, verification_mail } = req.body;
    const user = req.user;
    if (!user) {
        console.log("User not found in updateProfile");
        return res.status(404).json({ message: "User not found" });
    }
    const updatedData = {};
    if (name) updatedData.name = name;
    if (mail) updatedData.mail = mail;
    if (mobileno) updatedData.mobileno = mobileno;
    if (gender) updatedData.gender = gender;
    if (verification_mail !== undefined) updatedData.verification_mail = verification_mail;

    const updatedUser = await User.findByIdAndUpdate(user._id, updatedData, { new: true });

    if (!updatedUser) {
        console.log("Failed to update user data for ID:", user._id);
        return res.status(500).json({ message: "Failed to update user data" });
    }
    delete updatedUser.password;
    const response = {
        ...updatedUser,
        message: "Profile updated successfully"
    };
    return res.status(200).json(response);
});


const getAllUsers = expressAsyncHandler(async (req, res) => {
    // Manual query to get all since our User.find() helper isn't fully robust for 'all' without args if not defined
    // But checking User.js, it has 'collection' exposed.
    // Let's use User.collection.get() to be direct and safe, or implement a findAll in model.
    // User.js doesn't have findAll, but has findOne.
    // Let's rely on direct Firestore access via collection since it's cleaner than adding to model right now, 
    // or better: iterate via `collection.get()` 

    const snapshot = await User.collection.get();
    const users = snapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));

    // safe check
    if (!users) return res.status(200).json([]);

    // Filter sensitive data
    const safeUsers = users.map(u => {
        const { password, ...rest } = u;
        return rest;
    });

    return res.status(200).json(safeUsers);
});

const deleteUser = expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    await User.collection.doc(id).delete();
    // Also likely need to remove related data (orders, cart) but for now just user deletion as per request.
    return res.status(200).json({ message: "User deleted successfully" });
});

module.exports = { getProfile, updateProfile, getAllUsers, deleteUser };