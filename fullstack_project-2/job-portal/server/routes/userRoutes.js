const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, upload.single('resume'), updateUserProfile);

module.exports = router;
