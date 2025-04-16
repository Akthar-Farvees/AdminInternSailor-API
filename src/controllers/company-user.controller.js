const userService = require("../services/company-user.service");
const { poolPromise } = require('../config/db');
const sql = require('mssql');

const getUsersWithCompany = async (req, res) => {
  try {
    const users = await userService.getAllUsersWithCompany();
    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};

const deleteCompanyUser = async (req, res) => {
  const CompanyUserId = req.params.CompanyUserId;

  // Input validation
  if (!CompanyUserId) {
    return res.status(400).json({ error: "Job ID is required" });
  }

  try {
    // Get the pool from the connection pool manager
    const pool = await poolPromise;

    // SQL query with parameterized input to prevent SQL injection
    const query = `
            DELETE CU
            FROM CompanyUser CU
            INNER JOIN Company C 
            ON CU.CompanyId = C.CompanyId
            WHERE CU.CompanyUserId = @CompanyUserId`;

    // Execute the query using parameterized input
    const result = await pool
      .request()
      .input("CompanyUserId", sql.UniqueIdentifier, CompanyUserId) // Use the correct SQL type (e.g., UniqueIdentifier for GUIDs)
      .query(query);

    // If no rows were affected, the job was not found
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: "Company User not found" });
    }

    // Successful deletion
    return res
      .status(200)
      .json({ message: "Company User is deleted successfully" });
  } catch (err) {
    // Internal server error
    console.error("Error executing query", err);
    return res.status(500).json({ error: "Database error" });
  }
};


const approveAdminApproval = async (req, res) => {
    try {
      const { email } = req.body;
  
      const pool = await poolPromise;
      const request = pool.request();
      request.input("email", sql.NVarChar, email);
  
      const userQuery = `
        SELECT * FROM CompanyUser 
        WHERE Email = @email AND Status = 'WAITING_FOR_ADMIN'
      `;
      const userResult = await request.query(userQuery);
  
      if (userResult.recordset.length === 0) {
        return res
          .status(400)
          .json({ message: "No pending approvals for this email." });
      }
  
      const updateQuery = `
        UPDATE CompanyUser 
        SET Status = 'ACTIVE', OTP = NULL 
        WHERE Email = @email
      `;
      await request.query(updateQuery);
  
      return res
        .status(200)
        .json({ message: "Admin approved. User account is now active." });
    } catch (error) {
      console.error("Error in approveAdminApproval:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };

module.exports = {
  getUsersWithCompany,
  deleteCompanyUser,
  approveAdminApproval
};
