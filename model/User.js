const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    mail: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    mobileno : {
        type : Number,
        default : "NA"
    },
    address : [
        {
        type : String
         }
    ],
    gender : {
        type : String,
        default : "NA"
    }
});

module.exports = mongoose.model('User', userSchema);