import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'

// Pages
import HomePage from './pages/HomePage'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import CoursesPage from './pages/CoursesPage'
import CourseDetailsPage from './pages/CourseDetailsPage'
import LessonViewerPage from './pages/LessonViewerPage'
import AdminDashboardPage from './pages/AdminDashboardPage'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Protected routes */}
          <Route
            path="/courses"
            element={
              <ProtectedRoute>
                <CoursesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/course/:id"
            element={
              <ProtectedRoute>
                <CourseDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/course/:courseId/lesson/:lessonId"
            element={
              <ProtectedRoute>
                <LessonViewerPage />
              </ProtectedRoute>
            }
          />

          {/* Admin routes */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboardPage />
              </AdminRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<h1 className="text-center mt-20">Not Found</h1>} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
