import express from 'express'
import {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} from '../controllers/courseController.js'
import { authMiddleware, adminMiddleware } from '../middlewares/authMiddleware.js'
import { uploadThumbnail } from '../middlewares/uploadMiddleware.js'

const router = express.Router()

/**
 * GET /api/courses
 * Get all courses (public)
 */
router.get('/', getAllCourses)

/**
 * GET /api/courses/:id
 * Get single course (public)
 */
router.get('/:id', getCourseById)

/**
 * POST /api/courses
 * Create course (admin only)
 */
router.post(
  '/',
  authMiddleware,
  adminMiddleware,
  uploadThumbnail.single('thumbnail'),
  createCourse
)

/**
 * PUT /api/courses/:id
 * Update course (admin only)
 */
router.put(
  '/:id',
  authMiddleware,
  adminMiddleware,
  uploadThumbnail.single('thumbnail'),
  updateCourse
)

/**
 * DELETE /api/courses/:id
 * Delete course (admin only)
 */
router.delete('/:id', authMiddleware, adminMiddleware, deleteCourse)

export default router
