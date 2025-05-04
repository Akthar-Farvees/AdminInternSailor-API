const prisma = require('../config/');

const getAllUsersWithCompany = async () => {
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

module.exports = {
  getAllUsersWithCompany,
};
