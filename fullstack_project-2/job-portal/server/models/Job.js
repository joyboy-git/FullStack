const mongoose = require('mongoose');

const jobSchema = mongoose.Schema(
    {
        recruiterId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        title: {
            type: String,
            required: [true, 'Please add a job title'],
        },
        company: {
            type: String,
            required: [true, 'Please add a company name'],
        },
        description: {
            type: String,
            required: [true, 'Please add a job description'],
        },
        salary: {
            type: String,
            required: [true, 'Please add salary information'],
        },
        location: {
            type: String,
            required: [true, 'Please add a location'],
        },
    },
    {
        timestamps: true,
    }
);

const Job = mongoose.model('Job', jobSchema);
module.exports = Job;
