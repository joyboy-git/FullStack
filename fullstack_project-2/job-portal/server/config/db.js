const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        console.log('Connecting to MongoDB...');
        
        await mongoose.connect(uri);
        console.log(`MongoDB Connected: ${mongoose.connection.host}`);
    } catch (error) {
        console.error(`MongoDB Connection Error: ${error.message}`);
        console.error('Please ensure MongoDB is running or provide a valid MongoDB Atlas URI in the .env file.');
        process.exit(1);
    }
};

module.exports = connectDB;
