import 'express-async-errors'
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

// Load environment variables
dotenv.config()

// Import routes
import authRoutes from './routes/authRoutes.js'
import courseRoutes from './routes/courseRoutes.js'
import lessonRoutes from './routes/lessonRoutes.js'
import enrollmentRoutes from './routes/enrollmentRoutes.js'
import quizRoutes from './routes/quizRoutes.js'
import examRoutes from './routes/examRoutes.js'

// Import middleware
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Serve static files for uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/courses', courseRoutes)
app.use('/api/lessons', lessonRoutes)
app.use('/api/enrollments', enrollmentRoutes)
app.use('/api/quizzes', quizRoutes)
app.use('/api/exams', examRoutes)

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
  })
})

// Error handling
app.use(notFoundHandler)
app.use(errorHandler)

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`)
  console.log(`📚 E-learning platform backend started`)
})

export default app
