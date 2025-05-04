const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Fetch all users with their company name
const getUsersWithCompany = async (req, res) => {
  try {
    const users = await prisma.companyuser.findMany({
      include: {
        company: {
          select: {
            CompanyName: true,
          },
        },
      },
    });

    const formattedUsers = users.map(user => ({
      CompanyUserId: user.CompanyUserId,
      FirstName: user.FirstName,
      LastName: user.LastName,
      Username: user.Username,
      Email: user.Email,
      Password: user.Password,
      UserMobile: user.UserMobile,
      Status: user.Status,
      OTP: user.OTP,
      CompanyName: user.company?.CompanyName || null,
    }));

    res.status(200).json({
      success: true,
      data: formattedUsers,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};

// Delete a company user
const deleteCompanyUser = async (req, res) => {
  const { CompanyUserId } = req.params;

  if (!CompanyUserId) {
    return res.status(400).json({ error: "Company User ID is required" });
  }

  try {
    // Check if exists
    const user = await prisma.companyuser.findUnique({
      where: { CompanyUserId },
    });

    if (!user) {
      return res.status(404).json({ error: "Company User not found" });
    }

    await prisma.companyuser.delete({
      where: { CompanyUserId },
    });

    return res
      .status(200)
      .json({ message: "Company User is deleted successfully" });
  } catch (err) {
    console.error("Error executing delete", err);
    return res.status(500).json({ error: "Database error" });
  }
};

// Approve user by admin
const approveAdminApproval = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await prisma.companyuser.findFirst({
      where: {
        Email: email,
        Status: 'WAITING_FOR_ADMIN',
      },
    });

    if (!user) {
      return res.status(400).json({ message: "No pending approvals for this email." });
    }

    await prisma.companyuser.update({
      where: { CompanyUserId: user.CompanyUserId },
      data: {
        Status: 'ACTIVE',
        OTP: null,
      },
    });

    return res.status(200).json({ message: "Admin approved. User account is now active." });
  } catch (error) {
    console.error("Error in approveAdminApproval:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update a company user
const updateCompanyUser = async (req, res) => {
  const { CompanyUserId } = req.params;
  const {
    FirstName,
    LastName,
    Email,
    Username,
    UserMobile,
    Status,
  } = req.body;

  if (
    !FirstName ||
    !LastName ||
    !Email ||
    !Username ||
    !UserMobile ||
    !Status
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const existingUser = await prisma.companyuser.findUnique({
      where: { CompanyUserId },
    });

    if (!existingUser) {
      return res.status(404).json({ error: "Company User is not found" });
    }

    const updatedData = {
      FirstName,
      LastName,
      Email,
      Username,
      UserMobile,
      Status,
      LastUpdatedDate: new Date(),
    };

    if (Status === "ACTIVE") {
      updatedData.OTP = null;
    }

    await prisma.companyuser.update({
      where: { CompanyUserId },
      data: updatedData,
    });

    res.json({ message: "Company User is updated successfully!" });
  } catch (error) {
    console.error("Error updating Company User:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getUsersWithCompany,
  deleteCompanyUser,
  approveAdminApproval,
  updateCompanyUser,
};
