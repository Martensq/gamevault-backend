// src/prismaClient.js
// Export a single PrismaClient instance for the whole app.
// This avoids creating multiple clients and connection pool issues.
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
module.exports = prisma;
