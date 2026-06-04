import React, { createContext, useState, useCallback, useEffect } from 'react'

/**
 * Auth Context for managing user authentication state
 */
export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Initialize token from localStorage on mount
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('token')
      if (storedToken) {
        setToken(storedToken)
        // Verify token is still valid
        getUserProfile(storedToken)
      }
    } catch (err) {
      console.warn('localStorage access denied:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const getUserProfile = useCallback(async (authToken) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      const data = await response.json()
      if (data.success) {
        setUser(data.data)
      } else {
        setToken(null)
        try {
          localStorage.removeItem('token')
        } catch (err) {
          console.warn('localStorage access denied:', err)
        }
      }
    } catch (err) {
      console.error('Profile fetch error:', err)
    }
  }, [])

  const login = useCallback((newToken, userData) => {
    setToken(newToken)
    setUser(userData)
    try {
      localStorage.setItem('token', newToken)
    } catch (err) {
      console.warn('localStorage access denied:', err)
    }
    setError(null)
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
    try {
      localStorage.removeItem('token')
    } catch (err) {
      console.warn('localStorage access denied:', err)
    }
    setError(null)
  }, [])

  const register = useCallback((userData) => {
    setUser(userData)
    setError(null)
  }, [])

  const value = {
    user,
    token,
    loading,
    error,
    login,
    logout,
    register,
    isAuthenticated: !!token,
    isAdmin: user?.role === 'ADMIN',
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
