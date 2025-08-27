import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getAllUsersWithCompany = async () => {
  const users = await prisma.companyUser.findMany({
    select: {
      CompanyUserId: true,
      FirstName: true,
      LastName: true,
      Username: true,
      Email: true,
      Password: true,
      UserMobile: true,
      Status: true,
      OTP: true,
      company: {
        select: {
          CompanyName: true,
        },
      },
    },
  });

  // Flatten structure to match original MSSQL output (include CompanyName at root level)
  return users.map(user => ({
    ...user,
    CompanyName: user.company?.CompanyName || null,
  }));
};

export default {
  getAllUsersWithCompany,
};
