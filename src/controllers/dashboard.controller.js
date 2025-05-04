const prisma = require("../config/prisma.config");

const getDashboardCounts = async (req, res) => {
  try {
    const companyCount = await prisma.company.count(); // Check the model name here
    const jobCount = await prisma.job.count(); // Check the model name here
    const companyUserCount = await prisma.companyuser.count(); // Check the model name here
    
    // Get today's posted jobs
    const todayPostedJobs = await prisma.job.count({
      where: {
        postedDate: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)), // start of today
          lt: new Date(new Date().setHours(23, 59, 59, 999)) // end of today
        }
      }
    });

    res.status(200).json({
      CompanyCount: companyCount,
      JobCount: jobCount,
      CompanyUserCount: companyUserCount,
      todayPostedJobs: todayPostedJobs
    });
  } catch (error) {
    console.error("Error fetching dashboard details:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};


const getJobApplicationsTrend = async (req, res) => {
  try {
    const jobApplicationsTrend = await prisma.job.groupBy({
      by: ['postedDate'],
      _count: {
        postedDate: true
      },
      orderBy: {
        postedDate: 'asc'
      }
    });

    // Format the result to have 'yyyy-MM' format for date
    const formattedTrend = jobApplicationsTrend.map((item) => {
      const date = item.postedDate.toISOString().split('T')[0].slice(0, 7); // Get 'yyyy-MM'
      return {
        date: date,
        value: item._count.postedDate
      };
    });

    res.status(200).json(formattedTrend);
  } catch (error) {
    console.error("Error fetching Job Applications Trend details:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};

module.exports = {
  getDashboardCounts,
  getJobApplicationsTrend
};
