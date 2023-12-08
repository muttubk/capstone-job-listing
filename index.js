const express = require('express')
const dotenv = require('dotenv').config()
const mongoose = require('mongoose')

const app = express()

const PORT = process.env.PORT || 3000

app.get('/', (req, res) => {
    res.send('Hello world!')
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
    mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`)
        .then(() => console.log(`Server running in http://localhost:${process.env.PORT}`))
        .catch((error) => console.log(error))
})