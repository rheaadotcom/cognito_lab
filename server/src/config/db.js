const mongoose = require('mongoose');

const connectDB = async () => {
  console.log('Connecting to MongoDB...');
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    if (error.message.includes('MongooseServerSelectionError')) {
      console.error('DIAGNOSTIC: This usually means the Atlas IP Whitelist is blocking this connection.');
    }
    process.exit(1);
  }
};

module.exports = connectDB;
