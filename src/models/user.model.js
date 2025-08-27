import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getUserByUsername = async (username) => {
  return await prisma.adminUser.findUnique({
    where: { username }
  });
};

export const createUser = async (userData) => {
  return await prisma.adminUser.create({
    data: userData
  });
};

export const updateUser = async (id, userData) => {
  return await prisma.adminUser.update({
    where: { id },
    data: userData
  });
};

export const deleteUser = async (id) => {
  return await prisma.adminUser.delete({
    where: { id }
  });
};

export const getAllUsers = async () => {
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

export default { 
  getUserByUsername,
  createUser,
  updateUser,
  deleteUser,
  getAllUsers
};