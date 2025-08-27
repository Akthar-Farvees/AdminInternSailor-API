import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getCompanies = async (req, res) => {
  try {
    const companies = await prisma.company.findMany({
      include: {
        industries: true,  // Include related industries
        noofemployees: true, // Include related employee types
        companydepartment: {
          include: {
            departments: true, // Include departments for each company
          }
        }
      }
    });

    const formattedCompanies = companies.map(company => ({
      CompanyId: company.CompanyId,
      CompanyLogo: company.CompanyLogo,
      CompanyName: company.CompanyName,
      CompanyDescription: company.CompanyDescription,
      CompanyLocation: company.CompanyLocation,
      IndustryName: company.industries?.IndustryName || null,
      NoOfEmployeeType: company.noofemployees?.NoOfEmployeeType || null,
      Departments: company.companydepartment.map(cd => cd.departments?.DepartmentName).join(', ') || ''
    }));

    res.status(200).json(formattedCompanies);
  } catch (error) {
    console.error('Error fetching companies:', error);
    res.status(500).json({ message: 'Server Error', error });
  }
};

export const getIndustries = async (req, res) => {
  try {
    const industries = await prisma.industries.findMany();
    res.status(200).json(industries);
  } catch (error) {
    console.error('Error fetching Industries:', error);
    res.status(500).json({ message: 'Server Error', error });
  }
};

export const getEmployeeType = async (req, res) => {
  try {
    const employeeTypes = await prisma.noofemployees.findMany();
    res.status(200).json(employeeTypes);
  } catch (error) {
    console.error('Error fetching Employee Type:', error);
    res.status(500).json({ message: 'Server Error', error });
  }
};

export const getIndustryById = async (req, res) => {
  try {
    const { id } = req.params;
    const industry = await prisma.industries.findUnique({
      where: { IndustryID: id },
      select: {
        IndustryName: true
      }
    });

    if (!industry) {
      return res.status(404).json({ message: 'Industry not found' });
    }

    res.status(200).json(industry);
  } catch (error) {
    console.error('Error fetching Industry by ID:', error);
    res.status(500).json({ message: 'Server Error', error });
  }
};

export const updateCompany = async (req, res) => {
  const { CompanyId } = req.params;
  let {
    CompanyName,
    CompanyDescription,
    CompanyLocation,
    IndustryName,
    NoOfEmployeeType,
  } = req.body;

  // Basic validation
  if (!CompanyName || !CompanyDescription || !CompanyLocation || !IndustryName || !NoOfEmployeeType) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Find Industry ID based on IndustryName
    const industry = await prisma.industries.findUnique({
      where: { IndustryName },
    });

    if (!industry) {
      return res.status(400).json({ error: "Invalid IndustryName" });
    }

    // Find NoOfEmployee ID based on NoOfEmployeeType
    const employeeType = await prisma.noofemployees.findUnique({
      where: { NoOfEmployeeType },
    });

    if (!employeeType) {
      return res.status(400).json({ error: "Invalid NoOfEmployeeType" });
    }

    const updatedCompany = await prisma.company.update({
      where: { CompanyId },
      data: {
        CompanyName,
        CompanyDescription,
        CompanyLocation,
        IndustryID: industry.IndustryID,
        NoOfEmployeeID: employeeType.NoOfEmployeeID,
        LastUpdatedDate: new Date(),
      },
    });

    res.json({ message: "Company updated successfully!" });
  } catch (error) {
    console.error('Error updating Company:', error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteCompany = async (req, res) => {
  const { CompanyId } = req.params;

  if (!CompanyId) {
    return res.status(400).json({ error: "CompanyId is required" });
  }

  try {
    await prisma.$transaction(async (tx) => {
      // Delete related companydepartments
      await tx.companydepartment.deleteMany({
        where: { CompanyId: CompanyId },
      });

      // Delete related companyusers
      await tx.companyuser.deleteMany({
        where: { CompanyId: CompanyId },
      });

      // Delete related jobs
      await tx.job.deleteMany({
        where: { companyId: CompanyId },
      });

      // Finally, delete the company
      const deletedCompany = await tx.company.delete({
        where: { CompanyId: CompanyId },
      });

      if (!deletedCompany) {
        throw new Error("Company not found");
      }
    });

    res.json({ message: "Company and related departments, users, jobs deleted successfully!" });

  } catch (error) {
    console.error("Error deleting company:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

  
export default { 
  getCompanies,
  getIndustries,
  getEmployeeType,
  getIndustryById,
  updateCompany,
  deleteCompany
};
