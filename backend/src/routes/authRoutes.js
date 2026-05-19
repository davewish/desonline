import express from 'express'
import {
  registerUser,
  loginUser,
  getProfile,
} from '../controllers/authController.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'

const router = express.Router()

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post('/register', registerUser)

/**
 * POST /api/auth/login
 * Login user
 */
router.post('/login', loginUser)

/**
 * GET /api/auth/profile
 * Get current user profile
 */
router.get('/profile', authMiddleware, getProfile)

export default router
