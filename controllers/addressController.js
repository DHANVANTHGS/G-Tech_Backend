const User = require('../model/User');
const expressAsyncHandler = require('express-async-handler');

const myaddresses = expressAsyncHandler(async (req, res) => {
    const user = req.user;
    const data = await User.findById(user._id).select('address');
    if (!data) {
        return res.status(404).json({ message: "No addresses found" });
    }
    return res.status(200).json(data);
});

const addAddress = expressAsyncHandler(async (req, res) => {
    const user = req.user;
    const address = req.body.address;
    if (!address) {
        return res.status(400).json({ message: "Address is required" });
    }
    const data = await User.findByIdAndUpdate(user._id, ({ $push: { address: address } }), { new: true }).select('address');
    if (!data) {
        return res.status(500).json({ message: "Failed to add address" });
    }
    return res.status(200).json({ data, message: "Address added successfully" });
});

const deleteAddress = expressAsyncHandler(async (req, res) => {
    const user = req.user;
    const address = req.body.address;
    if (!address) {
        return res.status(400).json({ message: "Address is required" });
    }
    const data = await User.findByIdAndUpdate(user._id, ({ $pull: { address: address } }), { new: true }).select('address');
    if (!data) {
        return res.status(500).json({ message: "Failed to delete address" });
    }
    return res.status(200).json({ data, message: "Address deleted successfully" });
});

const updateAddress = expressAsyncHandler(async (req, res) => {
    const user = req.user;
    const oldAddress = req.body.oldAddress;
    const newAddress = req.body.newAddress;
    if (!oldAddress || !newAddress) {
        return res.status(400).json({ message: "Both old and new addresses are required" });
    }
    const data = await User.findById(user._id);
    if (!data) {
        return res.status(404).json({ message: "User not found" });
    }
    const addressIndex = data.address.indexOf(oldAddress);
    if (addressIndex === -1) {
        return res.status(404).json({ message: "Old address not found" });
    }
    data.address[addressIndex] = newAddress;
    await data.save();
    return res.status(200).json({ addresses: data.address, message: "Address updated successfully" });
});

module.exports = { myaddresses, addAddress, deleteAddress, updateAddress };