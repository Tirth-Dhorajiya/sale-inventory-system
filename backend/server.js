require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

// Bootstrap — connect to DB, then start server
const startServer = async () => {
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`\n Server running on http://localhost:${PORT}`);
    console.log(` API base URL: http://localhost:${PORT}/api`);
    console.log(`Frontend: http://localhost:${PORT}\n`);
  });

  const shutdown = (signal) => {
    console.log(`\n${signal} received. Shutting down gracefully...`);
    server.close(() => {
      console.log(" Server closed.");
      process.exit(0);
    });
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));

  // Handle unhandled promise rejections
  process.on("unhandledRejection", (err) => {
    console.error(" Unhandled Rejection:", err.message);
    server.close(() => process.exit(1));
  });
};

startServer();
