const prisma = require('../config/prisma.config');  // Prisma client
const bcrypt = require('bcrypt');

const getAdminUser = async (req, res) => {
  const adminUserId = req.params.adminUserId;
  try {
    // Fetch user using Prisma
    const user = await prisma.adminusers.findUnique({
      where: { AdminUserID: adminUserId },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the user data
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};

const updateAdminUser = async (req, res) => {
  const { adminUserId } = req.params;
  const { FirstName, LastName, Email, CurrentPassword, NewPassword } = req.body;

  try {
    // Fetch the user using Prisma
    const user = await prisma.adminusers.findUnique({
      where: { AdminUserID: adminUserId },
    });

    if (!user) {
      return res.status(404).json({ code: 'USER_NOT_FOUND', message: 'User not found' });
    }

    // Step 2: Compare current password
    const isMatch = await bcrypt.compare(CurrentPassword, user.Password);
    if (!isMatch) {
      return res.status(401).json({ code: 'INVALID_CURRENT_PASSWORD', message: 'Incorrect current password' });
    }

    // Step 3: Check if NewPassword is provided and not same as current password
    if (NewPassword && NewPassword.trim() !== "") {
      const isSameAsCurrent = await bcrypt.compare(NewPassword, user.Password);
      if (isSameAsCurrent) {
        return res.status(400).json({ code: 'PASSWORD_SAME_AS_CURRENT', message: 'New password cannot be the same as the current password' });
      }

      const salt = await bcrypt.genSalt(12);
      const hashedNewPassword = await bcrypt.hash(NewPassword, salt);

      // Update the user with the new password
      await prisma.adminusers.update({
        where: { AdminUserID: adminUserId },
        data: {
          FirstName,
          LastName,
          Email,
          Password: hashedNewPassword,
          CreatedDate: user.CreatedDate,  // Keep the original CreatedDate
        },
      });

      return res.json({
        code: 'UPDATE_SUCCESS',
        message: 'Password updated successfully',
      });
    } else {
      // Update user info without changing the password
      await prisma.adminusers.update({
        where: { AdminUserID: adminUserId },
        data: {
          FirstName,
          LastName,
          Email,
        },
      });

      return res.json({
        code: 'UPDATE_SUCCESS',
        message: 'User information updated successfully',
      });
    }

  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ message: 'Server error' });
  }
};


module.exports = {
  getAdminUser,
  updateAdminUser,
};
