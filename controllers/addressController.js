const User = require('../model/User');
const { admin } = require('../config/config');
const expressAsyncHandler = require('express-async-handler');

const myaddresses = expressAsyncHandler(async (req, res) => {
    const user = req.user;
    const data = await User.findById(user._id);
    if (!data) {
        return res.status(404).json({ message: "No addresses found" });
    }
    // Return object with only address field to match previous behavior if needed, 
    // or just return the address array?
    // Previous code: res.json(data). Data was result of select('address'), which is { _id, address: [...] }
    return res.status(200).json({ _id: data._id, address: data.address });
});

const addAddress = expressAsyncHandler(async (req, res) => {
    const user = req.user;
    const address = req.body.address;
    if (!address) {
        return res.status(400).json({ message: "Address is required" });
    }

    // Update
    await User.findByIdAndUpdate(user._id, {
        address: admin.firestore.FieldValue.arrayUnion(address)
    }, { new: true });

    // Fetch updated
    const data = await User.findById(user._id);

    return res.status(200).json({ data: { address: data.address }, message: "Address added successfully" });
});

const deleteAddress = expressAsyncHandler(async (req, res) => {
    const user = req.user;
    const address = req.body.address;
    if (!address) {
        return res.status(400).json({ message: "Address is required" });
    }

    await User.findByIdAndUpdate(user._id, {
        address: admin.firestore.FieldValue.arrayRemove(address)
    }, { new: true });

    const data = await User.findById(user._id);

    return res.status(200).json({ data: { address: data.address }, message: "Address deleted successfully" });
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

    // Since we can't atomically update an array element by index easily in Firestore without race condition 
    // (unless we read, modify and write back with transaction), we will do read-modify-write.
    // For simplicity here:
    data.address[addressIndex] = newAddress;

    // We update the entire address array
    await User.findByIdAndUpdate(user._id, { address: data.address });

    return res.status(200).json({ addresses: data.address, message: "Address updated successfully" });
});

module.exports = { myaddresses, addAddress, deleteAddress, updateAddress };