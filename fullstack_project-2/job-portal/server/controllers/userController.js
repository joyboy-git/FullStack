const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).select('-password');

    if (user) {
        res.json(user);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);

    if (user) {
        user.name = req.body.name || user.name;
        user.skills = req.body.skills ? req.body.skills.split(',').map(s => s.trim()) : user.skills;
        user.experience = req.body.experience || user.experience;

        if (req.file) {
            user.resumeUrl = `/${req.file.path.replace(/\\/g, '/')}`; // Ensure path uses forward slashes
        }

        if (req.body.password) {
            if (!req.body.otp) {
                res.status(400);
                throw new Error('OTP is required to change password');
            }
            if (user.resetPasswordOtp !== req.body.otp || user.resetPasswordExpires < Date.now()) {
                res.status(400);
                throw new Error('OTP is invalid or has expired');
            }
            user.password = req.body.password;
            user.resetPasswordOtp = undefined;
            user.resetPasswordExpires = undefined;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser.id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            skills: updatedUser.skills,
            experience: updatedUser.experience,
            resumeUrl: updatedUser.resumeUrl,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

module.exports = {
    getUserProfile,
    updateUserProfile,
};
