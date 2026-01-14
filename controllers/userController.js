const User = require('../model/User');
const expressAsyncHandler = require('express-async-handler');

const getProfile = expressAsyncHandler(async (req, res) => {
    const user = req.user;
    if(!user){
        console.log("User not found in getProfile");
        return res.status(404).json({ message: "User not found" });
    }
    const userData = await User.findById(user._id).select('-password');
    if(!userData){
        console.log("User data not found in database for ID:", user._id);
        return res.status(404).json({ message: "User data not found" });
    }
    return res.status(200).json(userData);
});

const updateProfile = expressAsyncHandler(async(req,res)=>{
    const {name,mail,mobileno,gender,verification_mail}=req.body;
    const user = req.user;
    if(!user){
        console.log("User not found in updateProfile");
        return res.status(404).json({ message: "User not found" });
    }
    const updatedData = {};
    if(name) updatedData.name = name;
    if(mail) updatedData.mail = mail;
    if(mobileno) updatedData.mobileno = mobileno;
    if(gender) updatedData.gender = gender;
    if(verification_mail !== undefined) updatedData.verification_mail = verification_mail;
    const updatedUser = await User.findByIdAndUpdate(user._id, updatedData, { new: true }).select('-password');
    if(!updatedUser){
        console.log("Failed to update user data for ID:", user._id);
        return res.status(500).json({ message: "Failed to update user data" });
    }   
    return res.status(200).json(updatedUser,{ message: "Profile updated successfully" });
});

module.exports = { getProfile, updateProfile };