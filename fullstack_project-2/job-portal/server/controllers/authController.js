const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
        res.status(400);
        throw new Error('Please add all fields');
    }

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    // Create user
    const user = await User.create({
        name,
        email,
        password,
        role,
    });

    if (user) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(401);
        throw new Error('Invalid credentials');
    }
});

// @desc    Forgot password (Generate OTP)
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        res.status(404);
        throw new Error('There is no user with that email address');
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Set OTP and expiration (10 minutes)
    user.resetPasswordOtp = otp;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;
    
    // We save with validateBeforeSave false just in case, though standard save() is fine here
    await user.save();

    // Send email
    try {
        const sendEmail = require('../utils/sendEmail');
        await sendEmail({
            email: user.email,
            subject: 'Job Portal Password Reset OTP',
            message: `Your password reset OTP is: ${otp}\n\nThis OTP is valid for 10 minutes.\nIf you did not request this, please ignore this email.`,
        });

        res.status(200).json({ success: true, message: 'OTP sent to email' });
    } catch (error) {
        user.resetPasswordOtp = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        
        console.error(error);
        res.status(500);
        throw new Error('There was an error sending the email. Try again later!');
    }
});

// @desc    Reset password (Verify OTP)
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
    const { email, otp, password } = req.body;

    if (!email || !otp || !password) {
        res.status(400);
        throw new Error('Please provide email, OTP, and new password');
    }

    const user = await User.findOne({
        email,
        resetPasswordOtp: otp,
        resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
        res.status(400);
        throw new Error('OTP is invalid or has expired');
    }

    // Set new password
    user.password = password;
    user.resetPasswordOtp = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ success: true, message: 'Password reset successful. You can now log in.' });
});

module.exports = {
    registerUser,
    loginUser,
    forgotPassword,
    resetPassword,
};
