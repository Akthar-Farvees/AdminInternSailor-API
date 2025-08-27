import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();


// GET all jobs with company name and location
export const getJobs = async (req, res) => {
  try {
    const jobs = await prisma.job.findMany({
      select: {
        id: true,
        name: true,
        position: true,
        postedDate: true,
        description: true,
        requirements: true,
        image: true,
        type: true,
        company: {
          select: {
            CompanyName: true,
            CompanyLocation: true,
          },
        },
      },
    });

    // Map to match your original structure (adding formatted Date)
    const formattedJobs = jobs.map(job => ({
      ...job,
      Date: job.postedDate ? job.postedDate.toISOString().split('T')[0] : null, // format: yyyy-mm-dd
      CompanyName: job.company?.CompanyName || null,
      CompanyLocation: job.company?.CompanyLocation || null,
    }));

    res.status(200).json(formattedJobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};

// DELETE a job by id
export const deleteJob = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Job ID is required" });
  }

  try {
    // First, find if the job exists
    const job = await prisma.job.findUnique({
      where: { id },
    });

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    // If job exists, delete it
    await prisma.job.delete({
      where: { id },
    });

    return res.status(200).json({ message: "Job is deleted successfully" });
  } catch (error) {
    console.error("Error deleting job:", error);
    res.status(500).json({ error: "Database error" });
  }
};

export default {
  getJobs,
  deleteJob,
};
