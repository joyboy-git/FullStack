const asyncHandler = require('express-async-handler');
const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');

// @desc    Apply to a job
// @route   POST /api/applications/apply/:jobId
// @access  Private/Seeker
const applyForJob = asyncHandler(async (req, res) => {
    const jobId = req.params.jobId;
    const applicantId = req.user.id;

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
        res.status(404);
        throw new Error('Job not found');
    }

    // Check if user already applied
    const existingApplication = await Application.findOne({ jobId, applicantId });
    if (existingApplication) {
        res.status(400);
        throw new Error('You have already applied for this job');
    }

    // Get user resume
    const user = await User.findById(applicantId);
    if (!user.resumeUrl) {
        res.status(400);
        throw new Error('Please upload a resume in your profile before applying');
    }

    const application = await Application.create({
        jobId,
        applicantId,
        resumeUrl: user.resumeUrl,
    });

    res.status(201).json(application);
});

// @desc    Get user's applications
// @route   GET /api/applications/my-applications
// @access  Private/Seeker
const getMyApplications = asyncHandler(async (req, res) => {
    const applications = await Application.find({ applicantId: req.user.id })
        .populate('jobId', 'title company location salary')
        .sort({ createdAt: -1 });

    res.json(applications);
});

// @desc    Get applicants for a job
// @route   GET /api/applications/job/:jobId
// @access  Private/Recruiter
const getJobApplicants = asyncHandler(async (req, res) => {
    const jobId = req.params.jobId;

    // Check if job exists and belongs to recruiter
    const job = await Job.findById(jobId);
    if (!job) {
        res.status(404);
        throw new Error('Job not found');
    }

    if (job.recruiterId.toString() !== req.user.id) {
        res.status(401);
        throw new Error('Not authorized');
    }

    const applications = await Application.find({ jobId })
        .populate('applicantId', 'name email skills experience resumeUrl')
        .sort({ createdAt: -1 });

    res.json(applications);
});

// @desc    Update application status
// @route   PUT /api/applications/:id
// @access  Private/Recruiter
const updateApplicationStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const application = await Application.findById(req.params.id).populate('jobId');

    if (!application) {
        res.status(404);
        throw new Error('Application not found');
    }

    // Check if job belongs to recruiter
    if (application.jobId.recruiterId.toString() !== req.user.id) {
        res.status(401);
        throw new Error('Not authorized');
    }

    application.status = status;
    const updatedApplication = await application.save();

    res.json(updatedApplication);
});

module.exports = {
    applyForJob,
    getMyApplications,
    getJobApplicants,
    updateApplicationStatus,
};
