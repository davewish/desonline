import prisma from '../utils/db.js'

/**
 * Get user enrollments
 */
export const getUserEnrollments = async (req, res) => {
  try {
    const userId = req.user.userId

    const enrollments = await prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          include: {
            lessons: {
              orderBy: { position: 'asc' },
            },
          },
        },
      },
    })

    res.status(200).json({
      success: true,
      data: enrollments,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch enrollments',
    })
  }
}

/**
 * Enroll user in course
 */
export const enrollCourse = async (req, res) => {
  try {
    const userId = req.user.userId
    const { courseId } = req.body

    // Validation
    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: 'Course ID is required',
      })
    }

    // Check if course exists
    const course = await prisma.course.findUnique({
      where: { id: parseInt(courseId) },
    })

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      })
    }

    // Check if already enrolled
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId: parseInt(courseId),
        },
      },
    })

    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: 'Already enrolled in this course',
      })
    }

    // Create enrollment
    const enrollment = await prisma.enrollment.create({
      data: {
        userId,
        courseId: parseInt(courseId),
      },
      include: {
        course: true,
      },
    })

    res.status(201).json({
      success: true,
      message: 'Enrolled successfully',
      data: enrollment,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: 'Failed to enroll course',
    })
  }
}

/**
 * Unenroll user from course
 */
export const unenrollCourse = async (req, res) => {
  try {
    const userId = req.user.userId
    const { enrollmentId } = req.params

    const enrollment = await prisma.enrollment.findUnique({
      where: { id: parseInt(enrollmentId) },
    })

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found',
      })
    }

    if (enrollment.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to unenroll',
      })
    }

    await prisma.enrollment.delete({
      where: { id: parseInt(enrollmentId) },
    })

    res.status(200).json({
      success: true,
      message: 'Unenrolled successfully',
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: 'Failed to unenroll course',
    })
  }
}
