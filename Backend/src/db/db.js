const mongoose = require('mongoose');

async function connectDB() {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
        throw new Error('MONGODB_URI is missing in Backend/.env');
    }

    if (mongoUri.includes('xxxxx')) {
        throw new Error("MONGODB_URI still contains placeholder values like 'xxxxx'. Replace it with your real MongoDB Atlas connection string.");
    }

    try {
        await mongoose.connect(mongoUri);
        console.log('connected to db');
    } catch (error) {
        console.error('DB error', error);
        throw error;
    }
}

module.exports = connectDB;
