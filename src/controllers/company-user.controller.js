import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// ----------------------
// Get All Users with Company
// ----------------------
export const getUsersWithCompany = async (req, res) => {
  try {
    const users = await prisma.companyUser.findMany({
      include: {
        company: true, // Assuming relation exists in Prisma schema
      },
    });

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

// ----------------------
// Delete Company User
// ----------------------
export const deleteCompanyUser = async (req, res) => {
  const { CompanyUserId } = req.params;

  if (!CompanyUserId) {
    return res.status(400).json({ error: "CompanyUserId is required" });
  }

  try {
    const user = await prisma.companyUser.findUnique({
      where: { CompanyUserId },
    });

    if (!user) {
      return res.status(404).json({ error: "Company User not found" });
    }

    await prisma.companyUser.delete({
      where: { CompanyUserId },
    });

    res.status(200).json({ message: "Company User deleted successfully" });
  } catch (error) {
    console.error("Error deleting Company User:", error);
    res.status(500).json({ error: "Database error" });
  }
};

// ----------------------
// Approve Admin Approval
// ----------------------
export const approveAdminApproval = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await prisma.companyUser.findFirst({
      where: {
        Email: email,
        Status: "WAITING_FOR_ADMIN",
      },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "No pending approvals for this email." });
    }

    await prisma.companyUser.update({
      where: { CompanyUserId: user.CompanyUserId },
      data: {
        Status: "ACTIVE",
        OTP: null,
      },
    });

    return res
      .status(200)
      .json({ message: "Admin approved. User account is now active." });
  } catch (error) {
    console.error("Error in approveAdminApproval:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// ----------------------
// Update Company User
// ----------------------
export const updateCompanyUser = async (req, res) => {
  const { CompanyUserId } = req.params;
  const { FirstName, LastName, Email, Username, UserMobile, Status } = req.body;

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
    const user = await prisma.companyUser.findUnique({
      where: { CompanyUserId },
    });

    if (!user) {
      return res.status(404).json({ error: "Company User not found" });
    }

    await prisma.companyUser.update({
      where: { CompanyUserId },
      data: {
        FirstName,
        LastName,
        Email,
        Username,
        UserMobile,
        Status,
        OTP: Status === "ACTIVE" ? null : user.OTP,
        LastUpdatedDate: new Date(),
      },
    });

    res.json({ message: "Company User updated successfully!" });
  } catch (error) {
    console.error("Error updating Company User:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default {
  getUsersWithCompany,
  deleteCompanyUser,
  approveAdminApproval,
  updateCompanyUser,
};
