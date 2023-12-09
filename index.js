const express = require('express')
const dotenv = require('dotenv').config()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const PORT = process.env.PORT || 3000

// Database models
const User = require('./models/user')
const Job = require('./models/job.js')

app.get('/', async (req, res) => {
    try {
        const users = await User.find({})
        res.json({
            data: users
        })
    } catch (error) {
        res.json({
            message: "Something went wrong!"
        })
    }
})

// health api
app.get('/health', (req, res) => {
    res.json({
        serverName: 'Job Listing Server',
        status: 'Active',
        currentTime: Date.now(),
        responseTime: process.hrtime()
    })
})

// register route
app.post('/register', async (req, res) => {
    try {
        const { fullName, email, mobile, password } = req.body
        if (fullName.length === 0 || email.length === 0 || mobile.length === 0 || password.length === 0) {
            return res.json({
                message: "All fileds are required!"
            })
        }
        const existingUser = await User.find({ email })
        if (existingUser.length > 0) {
            return res.json({
                message: "Email is already registered!"
            })
        }
        const encryptedPassword = await bcrypt.hash(password, 10)
        const userDetails = { fullName, email, mobile, password: encryptedPassword }
        await User.create(userDetails)
        const jwtoken = jwt.sign(userDetails, process.env.JWT_SECRET, { expiresIn: 60 * 60 })
        res.json({
            message: "User registered successfully!",
            jwtoken
        })
    } catch (error) {
        res.json({
            message: "Something went wrong!"
        })
    }
})

// login route
app.get('/login', async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            return res.json({
                message: "User does not exist!"
            })
        }
        let passwordMatched = await bcrypt.compare(password, user.password)
        if (!passwordMatched) {
            return res.json({
                message: "Invalid credentials!"
            })
        }
        const jwtoken = jwt.sign(user.toJSON(), process.env.JWT_SECRET, { expiresIn: 60 * 60 })
        res.json({
            message: "You've logged in successfully!",
            jwtoken
        })
    } catch (error) {
        res.json({
            message: "Something went wrong!"
        })
    }
})


app.use((req, res, next) => {
    const err = new Error("Not found")
    err.status = 404
    next(err)
})

// error handler
app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.json({
        error: {
            status: err.status || 500,
            message: err.message
        }
    })
})

app.listen(PORT, () => {
    mongoose.connect(process.env.MONGODB_URI)
        .then(() => console.log(`Server running in http://localhost:${process.env.PORT}`))
        .catch((error) => console.log(error))
})