const { poolPromise } = require('../config/db.js');

const getUserByUsername = async (username) => {
    const pool = await poolPromise;
    const result = await pool
        .request()
        .input('username', username)
        .query('SELECT * FROM AdminUsers WHERE username = @username');
    return result.recordset[0];
};

module.exports = { getUserByUsername };
