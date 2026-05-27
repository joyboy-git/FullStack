const asyncHandler = require('express-async-handler');
const Job = require('../models/Job');

// @desc    Get all jobs (with search/filter/pagination)
// @route   GET /api/jobs
// @access  Public
const getJobs = asyncHandler(async (req, res) => {
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;

    const keyword = req.query.keyword
        ? {
              $or: [
                  { title: { $regex: req.query.keyword, $options: 'i' } },
                  { company: { $regex: req.query.keyword, $options: 'i' } },
              ],
          }
        : {};

    const location = req.query.location
        ? { location: { $regex: req.query.location, $options: 'i' } }
        : {};

    const filter = { ...keyword, ...location };

    const count = await Job.countDocuments(filter);
    const jobs = await Job.find(filter)
        .populate('recruiterId', 'name')
        .limit(pageSize)
        .skip(pageSize * (page - 1))
        .sort({ createdAt: -1 });

    res.json({ jobs, page, pages: Math.ceil(count / pageSize), total: count });
});

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = asyncHandler(async (req, res) => {
    const job = await Job.findById(req.params.id).populate('recruiterId', 'name email');

    if (job) {
        res.json(job);
    } else {
        res.status(404);
        throw new Error('Job not found');
    }
});

// @desc    Create a job
// @route   POST /api/jobs
// @access  Private/Recruiter
const createJob = asyncHandler(async (req, res) => {
    const { title, company, description, salary, location } = req.body;

    const job = new Job({
        recruiterId: req.user.id,
        title,
        company,
        description,
        salary,
        location,
    });

    const createdJob = await job.save();
    res.status(201).json(createdJob);
});

// @desc    Update a job
// @route   PUT /api/jobs/:id
// @access  Private/Recruiter
const updateJob = asyncHandler(async (req, res) => {
    const { title, company, description, salary, location } = req.body;

    const job = await Job.findById(req.params.id);

    if (job) {
        // Check if the user is the owner of the job
        if (job.recruiterId.toString() !== req.user.id) {
            res.status(401);
            throw new Error('Not authorized to update this job');
        }

        job.title = title || job.title;
        job.company = company || job.company;
        job.description = description || job.description;
        job.salary = salary || job.salary;
        job.location = location || job.location;

        const updatedJob = await job.save();
        res.json(updatedJob);
    } else {
        res.status(404);
        throw new Error('Job not found');
    }
});

// @desc    Delete a job
// @route   DELETE /api/jobs/:id
// @access  Private/Recruiter
const deleteJob = asyncHandler(async (req, res) => {
    const job = await Job.findById(req.params.id);

    if (job) {
        if (job.recruiterId.toString() !== req.user.id) {
            res.status(401);
            throw new Error('Not authorized to delete this job');
        }

        await job.deleteOne();
        res.json({ message: 'Job removed' });
    } else {
        res.status(404);
        throw new Error('Job not found');
    }
});

// @desc    Get recruiter's jobs
// @route   GET /api/jobs/my-jobs
// @access  Private/Recruiter
const getMyJobs = asyncHandler(async (req, res) => {
    const jobs = await Job.find({ recruiterId: req.user.id }).sort({ createdAt: -1 });
    res.json(jobs);
});

module.exports = {
    getJobs,
    getJobById,
    createJob,
    updateJob,
    deleteJob,
    getMyJobs,
};
