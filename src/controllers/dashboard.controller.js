const { poolPromise } = require("../config/db");
const sql = require("mssql");

const getDashboardCounts = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
        SELECT 
            (SELECT COUNT(*) FROM company) AS CompanyCount,
            (SELECT COUNT(*) FROM job) AS JobCount,
            (SELECT COUNT(*) FROM CompanyUser) AS CompanyUserCount,
            (SELECT COUNT(*) 
            FROM Job 
            WHERE postedDate >= CAST(GETDATE() AS DATE) 
            AND postedDate < DATEADD(DAY, 1, CAST(GETDATE() AS DATE))) AS todayPostedJobs;
        `);
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("Error fetching dashboard details:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};

const getJobApplicationsTrend = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
        SELECT 
            FORMAT(postedDate, 'yyyy-MM') AS [date],
            COUNT(*) AS [value]
        FROM 
            Job
        GROUP BY 
            FORMAT(postedDate, 'yyyy-MM')
        ORDER BY 
            [date];
        `);
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("Error fetching Job Applications Trend details:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};

module.exports = {
  getDashboardCounts,
  getJobApplicationsTrend
};
