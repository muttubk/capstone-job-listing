const express = require('express')
const dotenv = require('dotenv').config()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors())

const PORT = process.env.PORT || 3000

const user = require('./routes/user')
const job = require('./routes/job')

app.get('/', async (req, res) => {
    try {
        res.status(200).json({
            message: "Hello Muttu!"
        })
    } catch (error) {
        res.status(500).json({
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

app.use('/user', user)
app.use('/job', job)

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