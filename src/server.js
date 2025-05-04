require('dotenv').config();
const app = require('./app');
const http = require('http');
const prisma = require('./config/prisma.config'); // Adjust the path as necessary

const server = http.createServer(app);

const PORT = process.env.PORT || 5050;

async function startServer() {
  try {
    // Connect to the database using Prisma
    await prisma.$connect();
    console.log('✅ Connected to PostgreSQL with Prisma');
    
    // Start the server
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Database Connection Failed: ', error);
    process.exit(1);
  }
}

startServer();

// Handle graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  console.log('Disconnected from database');
  process.exit(0);
});