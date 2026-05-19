import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

/**
 * Admin Protected Route component
 * Only allows admin users to access the route
 */
const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (!isAdmin) {
    return <Navigate to="/courses" replace />
  }

  return children
}

export default AdminRoute
