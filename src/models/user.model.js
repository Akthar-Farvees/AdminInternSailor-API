const prisma = require('../config/prisma.config');

const getUserByUsername = async (username) => {
  return await prisma.adminUser.findUnique({
    where: { username }
  });
};

const createUser = async (userData) => {
  return await prisma.adminUser.create({
    data: userData
  });
};

const updateUser = async (id, userData) => {
  return await prisma.adminUser.update({
    where: { id },
    data: userData
  });
};

const deleteUser = async (id) => {
  return await prisma.adminUser.delete({
    where: { id }
  });
};

const getAllUsers = async () => {
  return await prisma.adminUser.findMany({
    select: {
      id: true,
      username: true,
      email: true,
      firstName: true,
      lastName: true,
      createdAt: true,
      updatedAt: true
      // Exclude password for security
    }
  });
};

module.exports = { 
  getUserByUsername,
  createUser,
  updateUser,
  deleteUser,
  getAllUsers
};