import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

/**
 * Protected Route component
 * Only allows authenticated users to access the route
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, token } = useAuth()

  if (!isAuthenticated || !token) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
