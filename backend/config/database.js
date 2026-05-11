const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        mongoose.set("strictQuery", false);
        
        // Options add karne se connection stable rehta hai
        const conn = await mongoose.connect(process.env.MONGODB_URL);

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error("❌ MongoDB connection error details:");
        console.error(error.message);
        
        // Restarting nodemon properly instead of killing the process during dev
        // process.exit(1); 
    }
};

module.exports = { connectDB };