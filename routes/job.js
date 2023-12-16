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
        let skillsArray = []
        if (typeof skillsRequired === "string") {
            skillsArray = skillsRequired.split(',')
            skillsArray = skillsArray.map(item => item.trim())
        }
        const jobDetails = {
            companyName, logoURL, jobPosition,
            monthlySalary, jobType, workModel, location, jobDescription,
            aboutCompany, skillsRequired: skillsArray, additionalInfo
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

router.patch('/edit-job', isLoggedIn, async (req, res) => {
    try {
        const { job_id } = req.body
        const existingJob = await Job.findOne({ _id: job_id })
        if (!existingJob) {
            return res.status(401).json({
                message: "Job doesn't exists."
            })
        }
        const { companyName, logoURL, jobPosition,
            monthlySalary, jobType, workModel, location, jobDescription,
            aboutCompany, skillsRequired, additionalInfo } = req.body
        let newJobDetails = {
            companyName, logoURL, jobPosition,
            monthlySalary, jobType, workModel, location, jobDescription,
            aboutCompany, skillsRequired, additionalInfo
        }
        const newJob = await Job.findByIdAndUpdate({ _id: job_id }, newJobDetails, { new: true })
        res.status(200).json({
            message: "Updated job successfully.",
            newJob
        })
    } catch (error) {
        errorHandler(res, error);
    }
})

router.get('/display-jobs', async (req, res) => {
    try {
        // using req.body
        // const { skillsRequired, jobPosition } = req.body
        // const jobPosts = await Job.find({
        //     $or: [
        //         { skillsRequired: { $in: skillsRequired } },
        //         { jobPosition }
        //     ]
        // }).sort({ createdAt: - 1 })

        // using req.query
        const { skillsRequired, jobPosition } = req.query
        const query = {}
        if (jobPosition) {
            query.jobPosition = jobPosition
        }
        if (skillsRequired) {
            query.skillsRequired = { $in: skillsRequired.split('&') }
        }
        console.log(query)
        const jobPosts = await Job.find(query).sort({ createdAt: -1 })

        if (jobPosts.length === 0) {
            return res.status(401).json({
                message: "No jobs found."
            })
        }
        res.status(200).json({
            message: "Success",
            jobPosts
        })
    } catch (error) {
        errorHandler(res, error)
    }
})

router.get('/details', async (req, res) => {
    try {
        const { job_id } = req.body
        const jobDetails = await Job.findOne({ _id: job_id })
        if (!jobDetails) {
            return res.status(401).json({
                message: "Job doesn't exists."
            })
        }
        res.status(200).json({
            message: "Success",
            jobDetails
        })
    } catch (error) {
        errorHandler(res, error);
    }
})

module.exports = router