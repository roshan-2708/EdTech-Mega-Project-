require("dotenv").config();
const mongoose = require("mongoose");
const dns = require("dns");

// Fallback to Google DNS to fix SRV resolution errors on some Windows/VPN setups
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const connectDB = async () => {
  try {
    mongoose.set("strictQuery", false);

    const conn = await mongoose.connect(process.env.MONGODB_URL);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB connection error:");
    console.error(error);
  }
};

module.exports = { connectDB };