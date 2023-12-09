const mongoose = require('mongoose')

const jobSchema = mongoose.Schema({
    companyName: String,
    logoURL: String,
    jobPosition: String,
    monthlySalary: String,
    jobType: String,
    workModel: String,
    location: String,
    jobDescription: String,
    aboutCompany: String,
    skillsRequired: String,
    additionalInfo: String
}, { timestamps: true })

const Job = mongoose.model('Job', jobSchema)

module.exports = Job;