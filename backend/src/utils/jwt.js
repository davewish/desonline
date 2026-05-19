import jwt from 'jsonwebtoken'

const SECRET_KEY = process.env.JWT_SECRET || 'your_super_secret_key'

/**
 * Generate JWT token
 */
export const generateToken = (userId, role) => {
  return jwt.sign({ userId, role }, SECRET_KEY, { expiresIn: '24h' })
}

/**
 * Verify JWT token
 */
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, SECRET_KEY)
  } catch (error) {
    return null
  }
}

/**
 * Decode JWT token
 */
export const decodeToken = (token) => {
  return jwt.decode(token)
}
