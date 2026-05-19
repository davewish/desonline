import { verifyToken } from '../utils/jwt.js'

/**
 * Auth middleware to verify JWT token
 */
export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.startsWith('Bearer ')
      ? authHeader.slice(7)
      : null

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided',
      })
    }

    const decoded = verifyToken(token)

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
      })
    }

    req.user = decoded
    next()
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Authentication failed',
    })
  }
}

/**
 * Admin role middleware
 */
export const adminMiddleware = (req, res, next) => {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required',
    })
  }
  next()
}

/**
 * User role middleware (optional, mainly for clarity)
 */
export const userMiddleware = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'User authentication required',
    })
  }
  next()
}
