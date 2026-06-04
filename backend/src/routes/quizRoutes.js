import express from 'express'
import {
  getQuizById,
  getQuizzesByLesson,
  createQuiz,
  submitQuiz,
  getUserQuizHistory,
  deleteQuiz,
} from '../controllers/quizController.js'
import { authMiddleware, adminMiddleware } from '../middlewares/authMiddleware.js'

const router = express.Router()

/**
 * GET /api/quizzes/:id
 * Get quiz by ID with questions
 */
router.get('/:id', getQuizById)

/**
 * GET /api/quizzes/lesson/:lessonId
 * Get quizzes for a lesson
 */
router.get('/lesson/:lessonId', getQuizzesByLesson)

/**
 * POST /api/quizzes
 * Create quiz (admin only)
 */
router.post('/', authMiddleware, adminMiddleware, createQuiz)

/**
 * POST /api/quizzes/:quizId/submit
 * Submit quiz and get score
 */
router.post('/:quizId/submit', authMiddleware, submitQuiz)

/**
 * GET /api/quizzes/:quizId/history
 * Get user's quiz history
 */
router.get('/:quizId/history', authMiddleware, getUserQuizHistory)

/**
 * DELETE /api/quizzes/:id
 * Delete quiz (admin only)
 */
router.delete('/:id', authMiddleware, adminMiddleware, deleteQuiz)

export default router
