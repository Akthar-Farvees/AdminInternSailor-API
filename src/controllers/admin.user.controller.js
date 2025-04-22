const { poolPromise } = require("../config/db");
const sql = require("mssql");
const bcrypt = require('bcrypt');

const getAdminUser = async (req, res) => {
    const adminUserId = req.params.adminUserId;
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
        SELECT AdminUserID, FirstName, LastName, Username, Email, Password, CONVERT(VARCHAR(10), CreatedDate, 120) AS Date FROM AdminUsers
        WHERE AdminUserID = '${adminUserId}'
       
       `);
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("Error fetching companies:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};


const updateAdminUser = async (req, res) => {
  const { AdminUserID } = req.params;
  const { FirstName, LastName,  Email, CurrentPassword, NewPassword } = req.body;

  try {
    const pool = await poolPromise;

    // Step 1: Get the existing user
    const result = await pool.request()
      .input('AdminUserID', sql.VarChar, AdminUserID)
      .query('SELECT * FROM AdminUsers WHERE AdminUserID = @AdminUserID');

    const user = result.recordset[0];

    if (!user) return res.status(404).json({ code: 'USER_NOT_FOUND', message: 'User not found' });

    // Step 2: Compare current password
    const isMatch = await bcrypt.compare(CurrentPassword, user.Password);
    if (!isMatch) return res.status(401).json({ code: 'INVALID_CURRENT_PASSWORD', message: 'Incorrect current password' });

    const request = pool.request()
      .input('FirstName', sql.VarChar, FirstName)
      .input('LastName', sql.VarChar, LastName)
      .input('Email', sql.VarChar, Email)
      .input('AdminUserID', sql.VarChar, AdminUserID);

    let query;

    // Step 3: Check if NewPassword is provided
    if (NewPassword && NewPassword.trim() !== "" ) {
      const isSameAsCurrent = await bcrypt.compare(NewPassword, user.Password);
      if (isSameAsCurrent) {
        return res.status(400).json({ code: 'PASSWORD_SAME_AS_CURRENT', message: 'New password cannot be the same as the current password' });
      }
    
      const salt = await bcrypt.genSalt(12);
      const hashedNewPassword = await bcrypt.hash(NewPassword, salt);
      request.input('NewPassword', sql.VarChar, hashedNewPassword);

      query = `
        UPDATE AdminUsers 
        SET 
          FirstName = @FirstName,
          LastName = @LastName,
          Email = @Email,
          Password = @NewPassword,
          LastUpdatedDate = GETDATE()
        WHERE 
          AdminUserID = @AdminUserID
      `;
    } else {
      query = `
        UPDATE AdminUsers 
        SET 
          FirstName = @FirstName,
          LastName = @LastName,
          Email = @Email,
          LastUpdatedDate = GETDATE()
        WHERE 
          AdminUserID = @AdminUserID
      `;
    }

    const updateResult = await request.query(query);

    console.log('Rows affected:', updateResult.rowsAffected);
    if (updateResult.rowsAffected[0] === 0) {
      return res.status(404).json({ code: 'NO_DATA_CHANGED', message: 'No changes were made to the user data' });
    }

    res.json({
      code: 'UPDATE_SUCCESS',
      message: NewPassword && NewPassword.trim() !== ""
        ? 'Password updated successfully'
        : 'User information updated successfully'
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};



module.exports = {
    getAdminUser,
    updateAdminUser
};
