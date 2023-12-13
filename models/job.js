const mongoose = require('mongoose')

const jobSchema = mongoose.Schema({
    companyName: {
        type: String,
        required: true
    },
    logoURL: {
        type: String,
        required: true
    },
    jobPosition: {
        type: String,
        required: true
    },
    monthlySalary: {
        type: String,
        required: true
    },
    jobType: {
        type: String,
        enum: ['Full-time', 'Part-time', 'Intern'],
        required: true
    },
    workModel: {
        type: String,
        enum: ['Remote', 'Office', 'Hybrid'],
        required: true
    },
    location: {
        type: String,
        required: true
    },
    jobDescription: {
        type: String,
        required: true
    },
    aboutCompany: {
        type: String,
        required: true
    },
    skillsRequired: {
        type: [String],
        required: true
    },
    additionalInfo: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
}, { timestamps: true })

const Job = mongoose.model('Job', jobSchema)

module.exports = Job;