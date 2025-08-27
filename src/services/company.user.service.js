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
      UserMobile: true,
      Status: true,
      OTP: true,
      Company: {
        select: {
          CompanyName: true,
        },
      },
    },
  });
  return users;
};

export default {
  getAllUsersWithCompany,
};
