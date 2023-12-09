const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    fullName: String,
    email: String,
    mobile: String,
    password: String,
    profileImage: String
})

const User = mongoose.model('User', userSchema)

module.exports = User;