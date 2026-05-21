import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertCircle } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { authService } from '../services/api'

// Hardcoded test credentials
const TEST_USERS = {
  'admin@desonline.com': {
    password: 'admin123',
    id: '1',
    name: 'Admin User',
    role: 'ADMIN',
  },
  'user@desonline.com': {
    password: 'user123',
    id: '2',
    name: 'Demo User',
    role: 'USER',
  },
}

const LoginPage = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!formData.email || !formData.password) {
      setError('Email and password are required')
      return
    }

    try {
      setLoading(true)
      
      // Check hardcoded credentials first
      const testUser = TEST_USERS[formData.email]
      
      if (testUser && testUser.password === formData.password) {
        // Use hardcoded credentials
        const mockToken = `mock-token-${testUser.id}-${Date.now()}`
        const userData = {
          id: testUser.id,
          email: formData.email,
          name: testUser.name,
          role: testUser.role,
        }
        
        login(mockToken, userData)
        navigate(testUser.role === 'ADMIN' ? '/admin' : '/dashboard')
        return
      }
      
      // If hardcoded credentials don't match, try backend
      const response = await authService.login({
        email: formData.email,
        password: formData.password,
      })

      if (response.data.success) {
        const { token, user } = response.data.data
        login(token, user)
        navigate(user.role === 'ADMIN' ? '/admin' : '/dashboard')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
          Welcome Back
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Sign in to your account
        </p>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="input"
              placeholder="Enter password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full font-semibold py-3 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          Don't have an account?{' '}
          <a href="/register" className="text-blue-600 font-semibold hover:underline">
            Register
          </a>
        </p>

        {/* Test Credentials Info */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs font-semibold text-gray-600 mb-3">TEST CREDENTIALS:</p>
          <div className="space-y-2 text-xs">
            <div className="bg-blue-50 p-2 rounded">
              <p className="font-semibold text-blue-900">Admin:</p>
              <p className="text-blue-800">admin@desonline.com</p>
              <p className="text-blue-800">admin123</p>
            </div>
            <div className="bg-purple-50 p-2 rounded">
              <p className="font-semibold text-purple-900">User:</p>
              <p className="text-purple-800">user@desonline.com</p>
              <p className="text-purple-800">user123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
