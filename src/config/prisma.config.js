const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();  // Correct initialization of Prisma client

module.exports = prisma;
