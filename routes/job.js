const express = require('express')
const router = express.Router()
const Job = require('../models/job')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv').config()

const isLoggedIn = require('../middlewares/requestAuth')

const errorHandler = (res, error) => {
    console.error(error);
    res.status(500).json({
        error: 'Internal Server Error'
    })
}

router.post('/create-job', isLoggedIn, async (req, res) => {
    try {
        const { companyName, logoURL, jobPosition,
            monthlySalary, jobType, workModel, location, jobDescription,
            aboutCompany, skillsRequired, additionalInfo } = req.body
        const jobDetails = {
            companyName, logoURL, jobPosition,
            monthlySalary, jobType, workModel, location, jobDescription,
            aboutCompany, skillsRequired, additionalInfo
        }
        const existingJob = await Job.findOne(jobDetails)
        if (existingJob) {
            return res.status(409).json({
                message: "Similar Job Post already exists."
            })
        }
        const createdJob = await Job.create(jobDetails)
        res.status(200).json({
            message: "Job post created successfully!",
            createdJob
        })
    } catch (error) {
        errorHandler(res, error)
    }
})

module.exports = router