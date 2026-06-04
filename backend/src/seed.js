import 'dotenv/config'
import prisma from './src/utils/db.js'
import bcrypt from 'bcryptjs'

async function main() {
  console.log('🌱 Starting seed...')

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@desonline.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@desonline.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  })
  console.log('✅ Admin user created:', admin.email)

  // Create demo user
  const userPassword = await bcrypt.hash('user123', 10)
  const user = await prisma.user.upsert({
    where: { email: 'user@desonline.com' },
    update: {},
    create: {
      name: 'Demo User',
      email: 'user@desonline.com',
      password: userPassword,
      role: 'USER',
    },
  })
  console.log('✅ Demo user created:', user.email)

  // Create sample courses
  const courseData = [
    {
      title: 'Introduction to Web Development',
      description: 'Learn the fundamentals of web development including HTML, CSS, and JavaScript.',
      creatorId: admin.id,
    },
    {
      title: 'Advanced React.js',
      description: 'Master React with hooks, context, and advanced patterns for building scalable applications.',
      creatorId: admin.id,
    },
    {
      title: 'Full Stack Development',
      description: 'Complete guide to building full stack applications with modern technologies.',
      creatorId: admin.id,
    },
  ]

  const courses = await Promise.all(
    courseData.map((course) =>
      prisma.course.create({
        data: course,
      })
    )
  )

  console.log(`✅ ${courses.length} sample courses created`)

  // Create sample lessons
  for (const course of courses) {
    await prisma.lesson.create({
      data: {
        courseId: course.id,
        title: 'Getting Started',
        videoUrl: 'https://example.com/video1.mp4',
        pdfUrl: 'https://example.com/materials1.pdf',
        position: 1,
      },
    })

    await prisma.lesson.create({
      data: {
        courseId: course.id,
        title: 'Core Concepts',
        videoUrl: 'https://example.com/video2.mp4',
        pdfUrl: 'https://example.com/materials2.pdf',
        position: 2,
      },
    })

    await prisma.lesson.create({
      data: {
        courseId: course.id,
        title: 'Advanced Topics',
        videoUrl: 'https://example.com/video3.mp4',
        pdfUrl: 'https://example.com/materials3.pdf',
        position: 3,
      },
    })
  }

  console.log('✅ Sample lessons created')

  // Create sample enrollment
  await prisma.enrollment.create({
    data: {
      userId: user.id,
      courseId: courses[0].id,
    },
  })

  console.log('✅ Sample enrollment created')

  console.log('🎉 Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
