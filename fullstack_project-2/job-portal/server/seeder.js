require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');
const Job = require('./models/Job');
const Application = require('./models/Application');
const connectDB = require('./config/db');

connectDB();

const importData = async () => {
    try {
        await User.deleteMany();
        await Job.deleteMany();
        await Application.deleteMany();

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        // Dummy Users
        const users = [
            {
                name: 'Admin Recruiter',
                email: 'admin@recruiter.com',
                password: hashedPassword,
                role: 'recruiter',
            },
            {
                name: 'Tech Recruiter',
                email: 'tech@recruiter.com',
                password: hashedPassword,
                role: 'recruiter',
            },
            {
                name: 'John Seeker',
                email: 'john@seeker.com',
                password: hashedPassword,
                role: 'seeker',
                skills: ['JavaScript', 'React', 'Node.js'],
                experience: '3 years of web development',
            },
        ];

        const createdUsers = await User.insertMany(users);
        const recruiter1 = createdUsers[0]._id;
        const recruiter2 = createdUsers[1]._id;

        // Dummy Jobs
        const jobs = [
            {
                recruiterId: recruiter1,
                title: 'Senior React Developer',
                company: 'Tech Innovators Inc',
                description: 'We are looking for an experienced React developer to lead our frontend team. You will be responsible for architecture, code reviews, and feature development.\n\nRequirements:\n- 5+ years of React experience\n- Strong understanding of state management (Redux, Context)\n- Tailwind CSS expertise',
                salary: '$120,000 - $150,000',
                location: 'Remote (US)',
            },
            {
                recruiterId: recruiter1,
                title: 'Full Stack Node.js Engineer',
                company: 'StartupX',
                description: 'Join our fast-growing startup to build scalable microservices using Node.js and Express. You will work closely with the product team to deliver new features rapidly.\n\nRequirements:\n- Strong Node.js and MongoDB skills\n- API design experience\n- Agile mindset',
                salary: '$100,000 - $130,000',
                location: 'New York, NY',
            },
            {
                recruiterId: recruiter2,
                title: 'UI/UX Designer',
                company: 'Creative Agency',
                description: 'We need a talented UI/UX designer to craft beautiful, intuitive interfaces for our clients. Figma proficiency is a must.',
                salary: '$80,000 - $110,000',
                location: 'San Francisco, CA',
            },
            {
                recruiterId: recruiter2,
                title: 'DevOps Engineer',
                company: 'Cloud Systems',
                description: 'Looking for a DevOps engineer to manage our AWS infrastructure, CI/CD pipelines, and Kubernetes clusters.',
                salary: '$130,000 - $160,000',
                location: 'Austin, TX',
            },
            {
                recruiterId: recruiter1,
                title: 'Frontend Developer (Entry Level)',
                company: 'Tech Innovators Inc',
                description: 'Great opportunity for a junior developer to learn and grow. You will assist in building responsive web pages and fixing UI bugs.',
                salary: '$60,000 - $80,000',
                location: 'Chicago, IL',
            }
        ];

        await Job.insertMany(jobs);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`Error with data import: ${error}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await User.deleteMany();
        await Job.deleteMany();
        await Application.deleteMany();

        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`Error with data destroy: ${error}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
