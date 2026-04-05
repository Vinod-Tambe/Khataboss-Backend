const { PrismaClient } = require("./prisma/generated/master");

const prisma = new PrismaClient();

async function checkSeries() {
  try {
    const series = await prisma.dbSeries.findMany();
    console.log("Current DbSeries:", JSON.stringify(series, null, 2));
  } catch (error) {
    console.error("Error fetching series:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkSeries();
