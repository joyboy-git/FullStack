const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a name'],
        },
        email: {
            type: String,
            required: [true, 'Please add an email'],
            unique: true,
        },
        password: {
            type: String,
            required: [true, 'Please add a password'],
        },
        role: {
            type: String,
            enum: ['seeker', 'recruiter'],
            required: [true, 'Please specify a role'],
        },
        skills: {
            type: [String],
            default: [],
        },
        resumeUrl: {
            type: String,
            default: '',
        },
        experience: {
            type: String,
            default: '',
        },
        resetPasswordOtp: String,
        resetPasswordExpires: Date,
    },
    {
        timestamps: true,
    }
);

// Encrypt password before saving
userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
