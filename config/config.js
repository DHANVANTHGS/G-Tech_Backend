const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    console.log("📡 Connecting to MongoDB URI:", uri); // Helpful debug

    if (!uri) {
      throw new Error("MONGODB_URI is undefined. Did you forget to load the .env file?");
    }

    const conn = await mongoose.connect(uri);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;