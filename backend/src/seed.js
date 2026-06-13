import "dotenv/config";
import prisma from "./utils/db.js";
import bcrypt from "bcryptjs";

async function main() {
  console.log("🌱 Running idempotent seed...");
  console.log("🛡️ Verifying essential users (no data will be deleted)...");

  // Define essential users
  const adminPassword = await bcrypt.hash("admin123", 10);
  const userPassword = await bcrypt.hash("user123", 10);

  // Admin User (admin@desonline.com)
  // Admin User
  await prisma.user.upsert({
    where: { email: "admin@desonline.com" },
    update: {}, // Don't change password if already exists
    create: {
      name: "Admin User",
      email: "admin@desonline.com",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  // Regular User (user@desonline.com)
  // Demo User
  await prisma.user.upsert({
    where: { email: "user@desonline.com" },
    update: {},
    create: {
      name: "Demo User",
      email: "user@desonline.com",
      password: userPassword,
      role: "USER",
    },
  });

  console.log("✅ One admin and one user verified/created.");
  console.log("\n🚀 Fresh environment with essential test credentials:");
  console.log("  Admin: admin@desonline.com / admin123");
  console.log("  User 1: user@desonline.com / user123");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
