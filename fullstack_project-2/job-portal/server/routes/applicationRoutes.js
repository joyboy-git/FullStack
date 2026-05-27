const express = require('express');
const router = express.Router();
const {
    applyForJob,
    getMyApplications,
    getJobApplicants,
    updateApplicationStatus,
} = require('../controllers/applicationController');
const { protect, seeker, recruiter } = require('../middlewares/authMiddleware');

router.route('/apply/:jobId').post(protect, seeker, applyForJob);
router.route('/my-applications').get(protect, seeker, getMyApplications);
router.route('/job/:jobId').get(protect, recruiter, getJobApplicants);
router.route('/:id').put(protect, recruiter, updateApplicationStatus);

module.exports = router;
