import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import http from "http";
import { PrismaClient } from "@prisma/client";// Adjust the path as necessary

const prisma = new PrismaClient();
const server = http.createServer(app);

const PORT = process.env.PORT || 5050;

async function startServer() {
  try {
    // Run database migrations first
    console.log("🔄 Running database migrations...");
    await prisma.$executeRaw`SELECT 1`; // Test connection
    
    console.log("✅ Connected to PostgreSQL with Prisma");

    server.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    console.error("❌ Database Connection Failed: ", error);
    console.error("Database URL:", process.env.DATABASE_URL ? "Set" : "Missing");
    process.exit(1);
  }
}

// Handle shutdown signals
["SIGINT", "SIGTERM"].forEach((signal) =>
  process.on(signal, async () => {
    console.log(`📴 Received ${signal}, shutting down gracefully...`);
    await prisma.$disconnect();
    console.log(`Disconnected from database (${signal})`);
    process.exit(0);
  })
);

// Catch unhandled promise rejections
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
  process.exit(1);
});

startServer();