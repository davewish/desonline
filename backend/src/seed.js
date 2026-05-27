import "dotenv/config";
import prisma from "./utils/db.js";
import bcrypt from "bcryptjs";

async function main() {
  console.log("🌱 Starting seed...");

  // Clear existing data
  await prisma.enrollment.deleteMany({});
  await prisma.lesson.deleteMany({});
  await prisma.course.deleteMany({});
  await prisma.user.deleteMany({});

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@desonline.com",
      password: adminPassword,
      role: "ADMIN",
    },
  });
  console.log("✅ Admin user created:", admin.email);

  // Create demo user
  const userPassword = await bcrypt.hash("user123", 10);
  const user = await prisma.user.create({
    data: {
      name: "Demo User",
      email: "user@desonline.com",
      password: userPassword,
      role: "USER",
    },
  });
  console.log("✅ Demo user created:", user.email);

  // Create another user
  const user2Password = await bcrypt.hash("user456", 10);
  const user2 = await prisma.user.create({
    data: {
      name: "John Developer",
      email: "john@desonline.com",
      password: user2Password,
      role: "USER",
    },
  });
  console.log("✅ Second user created:", user2.email);

  // Create comprehensive course data
  const courseData = [
    {
      title: "Introduction to Web Development",
      description:
        "Learn the fundamentals of web development including HTML, CSS, and JavaScript. Perfect for beginners!",
      thumbnail:
        "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop",
      creatorId: admin.id,
    },
    {
      title: "Advanced React.js",
      description:
        "Master React with hooks, context, and advanced patterns for building scalable applications.",
      thumbnail:
        "https://images.unsplash.com/photo-1633356122544-f134ef2944f7?w=400&h=300&fit=crop",
      creatorId: admin.id,
    },
    {
      title: "Full Stack Development",
      description:
        "Complete guide to building full stack applications with modern technologies and best practices.",
      thumbnail:
        "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop",
      creatorId: admin.id,
    },
    {
      title: "JavaScript Fundamentals",
      description:
        "Master the basics of JavaScript programming from variables to advanced concepts.",
      thumbnail:
        "https://images.unsplash.com/photo-1516321318423-f06f70e504cb?w=400&h=300&fit=crop",
      creatorId: admin.id,
    },
    {
      title: "CSS & Responsive Design",
      description:
        "Learn modern CSS techniques and create beautiful responsive designs that work on all devices.",
      thumbnail:
        "https://images.unsplash.com/photo-1507238691526-01ec042607b2?w=400&h=300&fit=crop",
      creatorId: admin.id,
    },
    {
      title: "Node.js Backend Development",
      description:
        "Build powerful backend applications using Node.js, Express, and databases.",
      thumbnail:
        "https://images.unsplash.com/photo-1558694491-dfc8a3c1ef08?w=400&h=300&fit=crop",
      creatorId: admin.id,
    },
  ];

  const courses = await Promise.all(
    courseData.map((course) =>
      prisma.course.create({
        data: course,
      }),
    ),
  );

  console.log(`✅ ${courses.length} sample courses created`);

  // Create lessons for each course
  const lessonTemplates = [
    { title: "Getting Started", position: 1 },
    { title: "Core Concepts", position: 2 },
    { title: "Building Projects", position: 3 },
    { title: "Best Practices", position: 4 },
    { title: "Advanced Techniques", position: 5 },
  ];

  for (const course of courses) {
    for (let i = 0; i < 4; i++) {
      const lesson = lessonTemplates[i];
      await prisma.lesson.create({
        data: {
          courseId: course.id,
          title: lesson.title,
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          pdfUrl: "https://example.com/materials.pdf",
          position: lesson.position,
        },
      });
    }
  }

  console.log("✅ Lessons created for all courses");

  // Create sample enrollments
  // User enrolls in first 3 courses
  await prisma.enrollment.create({
    data: {
      userId: user.id,
      courseId: courses[0].id,
      progress: 50,
    },
  });

  await prisma.enrollment.create({
    data: {
      userId: user.id,
      courseId: courses[1].id,
      progress: 25,
    },
  });

  await prisma.enrollment.create({
    data: {
      userId: user.id,
      courseId: courses[2].id,
      progress: 0,
    },
  });

  // User2 enrolls in different courses
  await prisma.enrollment.create({
    data: {
      userId: user2.id,
      courseId: courses[1].id,
      progress: 75,
    },
  });

  await prisma.enrollment.create({
    data: {
      userId: user2.id,
      courseId: courses[3].id,
      progress: 10,
    },
  });

  console.log("✅ Sample enrollments created");

  console.log("🎉 Seed completed successfully!");
  console.log("\nTest Credentials:");
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
