const { poolPromise } = require('../config/db');
const sql = require('mssql');

// GET /api/users/:id
exports.getUserById = async (req, res) => {
  const userId = req.params.id;

  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input('AdminUserID', sql.UniqueIdentifier, userId)
      .query('SELECT FirstName, LastName, Username, Email FROM AdminUsers WHERE AdminUserID = @AdminUserID');

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(result.recordset[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};
