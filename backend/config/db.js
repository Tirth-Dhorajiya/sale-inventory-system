const mongoose = require("mongoose");

const connectDB = async () => {
  const MAX_RETRIES = 3;
  let retries = 0;

  while (retries < MAX_RETRIES) {
    try {
      const conn = await mongoose.connect(process.env.MONGODB_URI);

      console.log(`✅ MongoDB connected: ${conn.connection.host}`);

      mongoose.connection.on("error", (err) => {
        console.error(`❌ MongoDB connection error: ${err.message}`);
      });

      mongoose.connection.on("disconnected", () => {
        console.warn("⚠️  MongoDB disconnected. Attempting reconnection...");
      });

      return conn;
    } catch (error) {
      retries += 1;
      console.error(
        `❌ MongoDB connection attempt ${retries}/${MAX_RETRIES} failed: ${error.message}`,
      );

      if (retries >= MAX_RETRIES) {
        console.error("❌ All MongoDB connection attempts failed. Exiting...");
        process.exit(1);
      }

      // Wait 3 seconds before retrying
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }
};

module.exports = connectDB;
