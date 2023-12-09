const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    mobile: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    profileImage: String
})

const User = mongoose.model('User', userSchema)

module.exports = User;