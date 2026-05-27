const express = require('express');
const router = express.Router();
const {
    getJobs,
    getJobById,
    createJob,
    updateJob,
    deleteJob,
    getMyJobs,
} = require('../controllers/jobController');
const { protect, recruiter } = require('../middlewares/authMiddleware');

router.route('/')
    .get(getJobs)
    .post(protect, recruiter, createJob);

router.route('/my-jobs').get(protect, recruiter, getMyJobs);

router.route('/:id')
    .get(getJobById)
    .put(protect, recruiter, updateJob)
    .delete(protect, recruiter, deleteJob);

module.exports = router;
