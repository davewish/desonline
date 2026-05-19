import prisma from '../utils/db.js'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * Get all courses
 */
export const getAllCourses = async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query

    const skip = (page - 1) * limit

    let whereClause = {}
    if (search) {
      whereClause = {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      }
    }

    const courses = await prisma.course.findMany({
      where: whereClause,
      include: {
        creator: {
          select: { id: true, name: true, email: true },
        },
        lessons: true,
        enrollments: true,
      },
      skip: parseInt(skip),
      take: parseInt(limit),
      orderBy: { createdAt: 'desc' },
    })

    const total = await prisma.course.count({ where: whereClause })

    res.status(200).json({
      success: true,
      data: courses,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch courses',
    })
  }
}

/**
 * Get single course
 */
export const getCourseById = async (req, res) => {
  try {
    const { id } = req.params

    const course = await prisma.course.findUnique({
      where: { id: parseInt(id) },
      include: {
        creator: {
          select: { id: true, name: true, email: true },
        },
        lessons: {
          orderBy: { position: 'asc' },
        },
        enrollments: true,
      },
    })

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      })
    }

    res.status(200).json({
      success: true,
      data: course,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch course',
    })
  }
}

/**
 * Create course (Admin only)
 */
export const createCourse = async (req, res) => {
  try {
    const { title, description } = req.body
    const creatorId = req.user.userId

    // Validation
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Title and description are required',
      })
    }

    let thumbnail = null
    if (req.file) {
      thumbnail = `/uploads/thumbnails/${req.file.filename}`
    }

    const course = await prisma.course.create({
      data: {
        title,
        description,
        thumbnail,
        creatorId,
      },
      include: {
        creator: {
          select: { id: true, name: true, email: true },
        },
      },
    })

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: course,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: 'Failed to create course',
    })
  }
}

/**
 * Update course (Admin only)
 */
export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params
    const { title, description } = req.body
    const userId = req.user.userId

    const course = await prisma.course.findUnique({
      where: { id: parseInt(id) },
    })

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      })
    }

    if (course.creatorId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this course',
      })
    }

    let thumbnail = course.thumbnail
    if (req.file) {
      thumbnail = `/uploads/thumbnails/${req.file.filename}`
    }

    const updatedCourse = await prisma.course.update({
      where: { id: parseInt(id) },
      data: {
        title: title || course.title,
        description: description || course.description,
        thumbnail,
      },
      include: {
        creator: {
          select: { id: true, name: true, email: true },
        },
      },
    })

    res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      data: updatedCourse,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: 'Failed to update course',
    })
  }
}

/**
 * Delete course (Admin only)
 */
export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.userId

    const course = await prisma.course.findUnique({
      where: { id: parseInt(id) },
    })

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      })
    }

    if (course.creatorId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this course',
      })
    }

    await prisma.course.delete({
      where: { id: parseInt(id) },
    })

    res.status(200).json({
      success: true,
      message: 'Course deleted successfully',
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: 'Failed to delete course',
    })
  }
}
