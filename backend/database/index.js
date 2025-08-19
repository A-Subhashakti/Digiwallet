const mongoose = require("mongoose");
const { MONGODB_CONNECTION_STRING } = require('../config/index');

const dbconnect = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_CONNECTION_STRING);

    console.log(` Database connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(" MongoDB connection error:", error.message);
    process.exit(1);
  }
};

module.exports = dbconnect;
