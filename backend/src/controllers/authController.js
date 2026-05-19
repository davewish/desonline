import bcrypt from 'bcryptjs'
import prisma from '../utils/db.js'
import { generateToken } from '../utils/jwt.js'

/**
 * Register user
 */
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      })
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists',
      })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'USER',
      },
    })

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: 'Registration failed',
    })
  }
}

/**
 * Login user
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      })
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials',
      })
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials',
      })
    }

    // Generate token
    const token = generateToken(user.id, user.role)

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: 'Login failed',
    })
  }
}

/**
 * Get current user profile
 */
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    })

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      })
    }

    res.status(200).json({
      success: true,
      data: user,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
    })
  }
}
