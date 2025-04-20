const { poolPromise } = require('../config/db');
const sql = require('mssql');

const getCompanies = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(`
            SELECT 
                C.CompanyId,
                C.CompanyLogo, 
                C.CompanyName, 
                C.CompanyDescription, 
                C.CompanyLocation, 
                I.IndustryName, 
                STRING_AGG(D.DepartmentName, ', ') AS Departments,  
                N.NoOfEmployeeType  
            FROM 
                company C
            INNER JOIN Industries I ON C.IndustryID = I.IndustryID
            INNER JOIN NoOfEmployees N ON C.NoOfEmployeeID = N.NoOfEmployeeID
            INNER JOIN CompanyDepartment CD ON C.CompanyId = CD.CompanyId
            INNER JOIN Departments D ON CD.DepartmentId = D.DepartmentID
            GROUP BY 
                C.CompanyId,
                C.CompanyLogo, 
                C.CompanyName, 
                C.CompanyDescription, 
                C.CompanyLocation, 
                I.IndustryName, 
                N.NoOfEmployeeType
        `);
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error('Error fetching companies:', error);
        res.status(500).json({ message: 'Server Error', error });
    }
};

const getIndustries = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(`SELECT * FROM Industries`);
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error('Error fetching Industries:', error);
        res.status(500).json({ message: 'Server Error', error });
    }
}

const getEmployeeType = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(`SELECT * FROM NoOfEmployees`);
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error('Error fetching Employee Type:', error);
        res.status(500).json({ message: 'Server Error', error });
    }
}

const getIndustryById = async (req, res) => {
    try {
        const { id } = req.params; // or req.query / req.body depending on how you're sending it
        const pool = await poolPromise;

        const result = await pool.request()
            .input('IndustryID', id) // assuming id is a string, otherwise specify sql.Int or sql.VarChar
            .query(`SELECT IndustryName FROM Industries WHERE IndustryID = @IndustryID`);

        res.status(200).json(result.recordset);
    } catch (error) {
        console.error('Error fetching Industry by ID:', error);
        res.status(500).json({ message: 'Server Error', error });
    }
};



const updateCompany = async (req, res) => {
    const { CompanyId } = req.params;
    let {
      CompanyName,
      CompanyDescription,
      CompanyLocation,
      IndustryName,
      NoOfEmployeeType,
    } = req.body;
  
    // Basic validation
    if (
      !CompanyName ||
      !CompanyDescription ||
      !CompanyLocation ||
      !IndustryName ||
      !NoOfEmployeeType
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }
  
    try {
      const pool = await poolPromise;
  
      // ✅ Secure parameterized query (no SQL injection)
      const industryResult = await pool
        .request()
        .input("IndustryName", sql.NVarChar(255), IndustryName)
        .query(`SELECT IndustryID FROM Industries WHERE IndustryName = @IndustryName`);
  
      const industryRow = industryResult.recordset[0];
      if (!industryRow) {
        return res.status(400).json({ error: "Invalid IndustryName" });
      }
  
      const IndustryID = industryRow.IndustryID;
  
      const employeeTypeResult = await pool
        .request()
        .input("NoOfEmployeeType", sql.NVarChar(255), NoOfEmployeeType)
        .query(`SELECT NoOfEmployeeID FROM NoOfEmployees WHERE NoOfEmployeeType = @NoOfEmployeeType`);
  
      const employeeTypeRow = employeeTypeResult.recordset[0];
      if (!employeeTypeRow) {
        return res.status(400).json({ error: "Invalid NoOfEmployeeType" });
      }
  
      const NoOfEmployeeID = employeeTypeRow.NoOfEmployeeID;
  
      const result = await pool
        .request()
        .input("CompanyId", sql.UniqueIdentifier, CompanyId)
        .input("CompanyName", sql.NVarChar(255), CompanyName)
        .input("CompanyDescription", sql.NVarChar(sql.MAX), CompanyDescription)
        .input("CompanyLocation", sql.NVarChar(sql.MAX), CompanyLocation)
        .input("IndustryID", sql.UniqueIdentifier, IndustryID)
        .input("NoOfEmployeeID", sql.UniqueIdentifier, NoOfEmployeeID)
        .query(`
          UPDATE Company
          SET
            CompanyName = @CompanyName,
            CompanyDescription = @CompanyDescription,
            CompanyLocation = @CompanyLocation,
            IndustryID = @IndustryID,
            NoOfEmployeeID = @NoOfEmployeeID,
            LastUpdatedDate = GETDATE()
          WHERE CompanyId = @CompanyId
        `);
  
      if (result.rowsAffected[0] === 0) {
        return res.status(404).json({ error: "Company not found" });
      }
  
      res.json({ message: "Company updated successfully!" });
    } catch (error) {
      console.error("Error updating Company:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };


  const deleteCompany = async (req, res) => {
    const { CompanyId } = req.params;
  
    if (!CompanyId) {
      return res.status(400).json({ error: "CompanyId is required" });
    }
  
    try {
      const pool = await poolPromise;
      const transaction = new sql.Transaction(pool);
  
      await transaction.begin();
  
      // Use a fresh request object for each query
      const deleteDepartmentsRequest = new sql.Request(transaction);
      await deleteDepartmentsRequest
        .input("CompanyId", sql.UniqueIdentifier, CompanyId)
        .query(`
          DELETE FROM CompanyDepartment WHERE CompanyId = @CompanyId
        `);
  
      const deleteCompanyRequest = new sql.Request(transaction);
      const deleteCompanyResult = await deleteCompanyRequest
        .input("CompanyId", sql.UniqueIdentifier, CompanyId)
        .query(`
          DELETE FROM Company WHERE CompanyId = @CompanyId
        `);
  
      if (deleteCompanyResult.rowsAffected[0] === 0) {
        await transaction.rollback();
        return res.status(404).json({ error: "Company not found" });
      }
  
      await transaction.commit();
  
      res.json({ message: "Company and related departments deleted successfully!" });
  
    } catch (error) {
      console.error("Error deleting company:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
  
  
module.exports = { 
    getCompanies,
    getIndustries,
    getEmployeeType,
    getIndustryById,
    updateCompany,
    deleteCompany
};
