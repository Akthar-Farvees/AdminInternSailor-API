import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// GET /api/users/:id
export const getUserById = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await prisma.adminUsers.findUnique({
      where: { AdminUserID: userId },
      select: {
        FirstName: true,
        LastName: true,
        Username: true,
        Email: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).send("Server Error");
  }
};
