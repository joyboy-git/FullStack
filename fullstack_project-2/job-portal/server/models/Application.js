const mongoose = require('mongoose');

const applicationSchema = mongoose.Schema(
    {
        jobId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Job',
        },
        applicantId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        resumeUrl: {
            type: String,
            required: [true, 'Please provide a resume'],
        },
        status: {
            type: String,
            enum: ['pending', 'accepted', 'rejected'],
            default: 'pending',
        },
    },
    {
        timestamps: true,
    }
);

const Application = mongoose.model('Application', applicationSchema);
module.exports = Application;
