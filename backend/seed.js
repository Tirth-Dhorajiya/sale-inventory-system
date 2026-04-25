require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/User");

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to DB for seeding..."))
  .catch((err) => {
    console.error("DB Connection Error:", err);
    process.exit(1);
  });

const seed = async () => {
  try {
    // Clear existing users to prevent duplicate key errors
    await User.deleteMany({});

    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 12;

    const adminPassword = await bcrypt.hash("password123", saltRounds);
    await User.create({
      name: "System Admin",
      email: "admin@example.com",
      password: adminPassword,
      role: "admin",
    });
    console.log("✅ Admin user created (admin@example.com / password123)");

    const userPassword = await bcrypt.hash("password123", saltRounds);
    await User.create({
      name: "Regular User",
      email: "user@example.com",
      password: userPassword,
      role: "user",
    });
    console.log("✅ Normal user created (user@example.com / password123)");

    console.log("🎉 Seeding complete!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding Error:", err);
    process.exit(1);
  }
};

seed();
