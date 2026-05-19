import express from 'express'
import {
  getUserEnrollments,
  enrollCourse,
  unenrollCourse,
} from '../controllers/enrollmentController.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'

const router = express.Router()

/**
 * GET /api/enrollments
 * Get user's enrollments
 */
router.get('/', authMiddleware, getUserEnrollments)

/**
 * POST /api/enrollments
 * Enroll in a course
 */
router.post('/', authMiddleware, enrollCourse)

/**
 * DELETE /api/enrollments/:enrollmentId
 * Unenroll from a course
 */
router.delete('/:enrollmentId', authMiddleware, unenrollCourse)

export default router
