const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv').config()
const User = require('../models/user')

const errorHandler = (res, error) => {
    console.error(error);
    res.status(500).json({
        error: 'Internal Server Error'
    })
}

router.post('/register', async (req, res) => {
    try {
        const { fullName, email, mobile, password } = req.body
        if (!fullName || !email || !mobile || !password) {
            return res.status(400).json({
                message: "All fileds are required!"
            })
        }
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(409).json({
                message: "Email is already registered!"
            })
        }
        const encryptedPassword = await bcrypt.hash(password, 10)
        const userDetails = { fullName, email, mobile, password: encryptedPassword }
        await User.create(userDetails)
        const jwtoken = jwt.sign({ user: userDetails.email }, process.env.JWT_SECRET, { expiresIn: 60 * 60 })
        res.status(200).json({
            message: "User registered successfully!",
            jwtoken
        })
    } catch (error) {
        errorHandler(res, error)
    }
})

router.get('/login', async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(401).json({
                message: "User does not exist!"
            })
        }
        let passwordMatched = await bcrypt.compare(password, user.password)
        if (!passwordMatched) {
            return res.status(401).json({
                message: "Invalid credentials!"
            })
        }
        const jwtoken = jwt.sign(user.toJSON(), process.env.JWT_SECRET, { expiresIn: 60 * 60 })
        res.status(200).json({
            message: "You've logged in successfully!",
            jwtoken
        })
    } catch (error) {
        errorHandler(res, error)
    }
})

module.exports = router