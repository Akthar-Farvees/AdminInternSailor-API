const { poolPromise } = require("../config/db");
const sql = require("mssql");

const getJobs = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
       SELECT 
    J.*, 
    CONVERT(VARCHAR(10), J.postedDate, 120) AS Date, 
    C.CompanyName, C.CompanyLocation
FROM job J
INNER JOIN company C 
    ON J.companyId = C.CompanyId;

        `);
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("Error fetching companies:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};

const deleteJob = async (req, res) => {
  const id = req.params.id;

  // Input validation
  if (!id) {
    return res.status(400).json({ error: "Job ID is required" });
  }

  try {
    // Get the pool from the connection pool manager
    const pool = await poolPromise;

    // SQL query with parameterized input to prevent SQL injection
    const query = `
            DELETE J
            FROM Job J
            INNER JOIN Company C 
            ON J.CompanyId = C.CompanyId
            WHERE J.id = @id`;

    // Execute the query using parameterized input
    const result = await pool
      .request()
      .input("id", sql.UniqueIdentifier, id) // Use the correct SQL type (e.g., UniqueIdentifier for GUIDs)
      .query(query);

    // If no rows were affected, the job was not found
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: "Job not found" });
    }

    // Successful deletion
    return res
      .status(200)
      .json({ message: "Job is deleted successfully" });
  } catch (err) {
    // Internal server error
    console.error("Error executing query", err);
    return res.status(500).json({ error: "Database error" });
  }
};

module.exports = {
    getJobs,
    deleteJob
};
