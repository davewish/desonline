import "dotenv/config";
import prisma from "./utils/db.js";
import bcrypt from "bcryptjs";

async function main() {
  console.log("🌱 Running production-safe seed...");

  // Define essential users
  const adminPassword = await bcrypt.hash("admin123", 10);
  const userPassword = await bcrypt.hash("user123", 10);
  const user2Password = await bcrypt.hash("user456", 10);

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

  // John Developer
  await prisma.user.upsert({
    where: { email: "john@desonline.com" },
    update: {},
    create: {
      name: "John Developer",
      email: "john@desonline.com",
      password: user2Password,
      role: "USER",
    },
  });

  console.log("✅ Essential users verified/created.");
  console.log("\n🚀 Production-ready environment with test credentials:");
  console.log("  Admin: admin@desonline.com / admin123");
  console.log("  User 1: user@desonline.com / user123");
  console.log("  User 2: john@desonline.com / user456");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
