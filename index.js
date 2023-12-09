const express = require('express')
const dotenv = require('dotenv').config()
const mongoose = require('mongoose')

const app = express()

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

app.listen(PORT, () => {
    mongoose.connect(process.env.MONGODB_URI)
        .then(() => console.log(`Server running in http://localhost:${process.env.PORT}`))
        .catch((error) => console.log(error))
})