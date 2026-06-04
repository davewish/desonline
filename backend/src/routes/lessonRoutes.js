import express from 'express'
import {
  getLessonById,
  createLesson,
  updateLesson,
  deleteLesson,
} from '../controllers/lessonController.js'
import { authMiddleware, adminMiddleware } from '../middlewares/authMiddleware.js'
import { uploadVideo, uploadPDF } from '../middlewares/uploadMiddleware.js'

const router = express.Router()

/**
 * GET /api/lessons/:id
 * Get lesson by ID
 */
router.get('/:id', getLessonById)

/**
 * POST /api/lessons
 * Create lesson (admin only)
 */
router.post(
  '/',
  authMiddleware,
  adminMiddleware,
  uploadVideo.single('video'),
  uploadPDF.single('pdf'),
  createLesson
)

/**
 * PUT /api/lessons/:id
 * Update lesson (admin only)
 */
router.put(
  '/:id',
  authMiddleware,
  adminMiddleware,
  uploadVideo.single('video'),
  uploadPDF.single('pdf'),
  updateLesson
)

/**
 * DELETE /api/lessons/:id
 * Delete lesson (admin only)
 */
router.delete('/:id', authMiddleware, adminMiddleware, deleteLesson)

export default router
