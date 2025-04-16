const { poolPromise } = require('../config/db.js');

const getAllUsersWithCompany = async () => {
  const pool = await poolPromise;
  const result = await pool.request().query(`
    SELECT 
      CU.CompanyUserId,CU.FirstName, CU.LastName, CU.Username, 
      CU.Email,CU.Password, CU.UserMobile, CU.Status, CU.OTP, 
      C.CompanyName 
    FROM CompanyUser CU
    INNER JOIN Company C ON CU.CompanyId = C.CompanyId
  `);
  return result.recordset;
};

module.exports = {
  getAllUsersWithCompany
};
