import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Play, BookOpen, BarChart3, Settings, LogOut } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { courseService, enrollmentService } from '../services/api'

// Sample available courses
const SAMPLE_ALL_COURSES = [
  {
    id: 1,
    title: 'Introduction to Web Development',
    description: 'Learn the fundamentals of web development including HTML, CSS, and JavaScript. Perfect for beginners!',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop',
    lessons: [
      { id: 101, title: 'HTML Basics', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', pdfUrl: 'https://example.com/lesson1.pdf', position: 1 },
      { id: 102, title: 'CSS Styling', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', pdfUrl: 'https://example.com/lesson2.pdf', position: 2 },
      { id: 103, title: 'JavaScript Intro', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', pdfUrl: 'https://example.com/lesson3.pdf', position: 3 },
    ],
    enrollments: [{}, {}, {}],
  },
  {
    id: 2,
    title: 'Advanced React.js',
    description: 'Master React with hooks, context, and advanced patterns for building scalable applications.',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134ef2944f7?w=400&h=300&fit=crop',
    lessons: [
      { id: 201, title: 'React Hooks', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', pdfUrl: 'https://example.com/lesson1.pdf', position: 1 },
      { id: 202, title: 'Context API', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', pdfUrl: 'https://example.com/lesson2.pdf', position: 2 },
      { id: 203, title: 'State Management', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', pdfUrl: 'https://example.com/lesson3.pdf', position: 3 },
    ],
    enrollments: [{}, {}],
  },
  {
    id: 3,
    title: 'Full Stack Development',
    description: 'Complete guide to building full stack applications with modern technologies and best practices.',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop',
    lessons: [
      { id: 301, title: 'Frontend Setup', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', pdfUrl: 'https://example.com/lesson1.pdf', position: 1 },
      { id: 302, title: 'Backend Setup', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', pdfUrl: 'https://example.com/lesson2.pdf', position: 2 },
      { id: 303, title: 'Database Integration', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', pdfUrl: 'https://example.com/lesson3.pdf', position: 3 },
    ],
    enrollments: [{}, {}, {}, {}],
  },
  {
    id: 4,
    title: 'JavaScript Fundamentals',
    description: 'Master the basics of JavaScript programming from variables to advanced concepts.',
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f70e504cb?w=400&h=300&fit=crop',
    lessons: [
      { id: 401, title: 'Variables & Types', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', pdfUrl: 'https://example.com/lesson1.pdf', position: 1 },
      { id: 402, title: 'Functions', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', pdfUrl: 'https://example.com/lesson2.pdf', position: 2 },
      { id: 403, title: 'Async/Await', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', pdfUrl: 'https://example.com/lesson3.pdf', position: 3 },
      { id: 404, title: 'ES6+ Features', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', pdfUrl: 'https://example.com/lesson4.pdf', position: 4 },
    ],
    enrollments: [{}],
  },
  {
    id: 5,
    title: 'CSS & Responsive Design',
    description: 'Learn modern CSS techniques and create beautiful responsive designs that work on all devices.',
    thumbnail: 'https://images.unsplash.com/photo-1507238691526-01ec042607b2?w=400&h=300&fit=crop',
    lessons: [
      { id: 501, title: 'CSS Fundamentals', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', pdfUrl: 'https://example.com/lesson1.pdf', position: 1 },
      { id: 502, title: 'Flexbox & Grid', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', pdfUrl: 'https://example.com/lesson2.pdf', position: 2 },
      { id: 503, title: 'Responsive Design', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', pdfUrl: 'https://example.com/lesson3.pdf', position: 3 },
    ],
    enrollments: [{}, {}],
  },
  {
    id: 6,
    title: 'Node.js Backend Development',
    description: 'Build powerful backend applications using Node.js, Express, and databases.',
    thumbnail: 'https://images.unsplash.com/photo-1558694491-dfc8a3c1ef08?w=400&h=300&fit=crop',
    lessons: [
      { id: 601, title: 'Node.js Basics', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', pdfUrl: 'https://example.com/lesson1.pdf', position: 1 },
      { id: 602, title: 'Express Framework', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', pdfUrl: 'https://example.com/lesson2.pdf', position: 2 },
      { id: 603, title: 'Database Queries', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', pdfUrl: 'https://example.com/lesson3.pdf', position: 3 },
      { id: 604, title: 'API Development', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', pdfUrl: 'https://example.com/lesson4.pdf', position: 4 },
    ],
    enrollments: [{}, {}, {}, {}, {}],
  },
]

const UserDashboardPage = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [enrollments, setEnrollments] = useState([])
  const [availableCourses, setAvailableCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('dashboard')

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    setLoading(true)
    // Use sample data directly
    setEnrollments([
      {
        id: 1,
        courseId: 1,
        course: {
          id: 1,
          title: 'Introduction to Web Development',
          description: 'Learn the fundamentals of web development including HTML, CSS, and JavaScript. Perfect for beginners!',
          thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop',
          lessons: 3,
        },
        progress: 66,
        lastAccessed: '2024-05-20',
        lessonsCompleted: 2,
      },
      {
        id: 2,
        courseId: 2,
        course: {
          id: 2,
          title: 'Advanced React.js',
          description: 'Master React with hooks, context, and advanced patterns for building scalable applications.',
          thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134ef2944f7?w=400&h=300&fit=crop',
          lessons: 3,
        },
        progress: 33,
        lastAccessed: '2024-05-19',
        lessonsCompleted: 1,
      },
    ])
    setAvailableCourses(SAMPLE_ALL_COURSES)
    setLoading(false)
  }

  const isEnrolled = (courseId) => {
    return enrollments.some((enrollment) => enrollment.courseId === courseId)
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const totalProgress =
    enrollments.length > 0
      ? Math.round(
          enrollments.reduce((sum, e) => sum + (e.progress || 0), 0) /
            enrollments.length
        )
      : 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8">
        <div className="container">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Welcome, {user?.name}! 👋</h1>
              <p className="text-blue-100">
                {user?.role === 'ADMIN'
                  ? 'Admin Account'
                  : `Student Account • ${enrollments.length} courses enrolled`}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold mb-1">
                  Courses Enrolled
                </p>
                <p className="text-4xl font-bold text-blue-600">
                  {enrollments.length}
                </p>
              </div>
              <BookOpen className="w-12 h-12 text-blue-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold mb-1">
                  Overall Progress
                </p>
                <p className="text-4xl font-bold text-purple-600">
                  {totalProgress}%
                </p>
              </div>
              <BarChart3 className="w-12 h-12 text-purple-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold mb-1">
                  Lessons Completed
                </p>
                <p className="text-4xl font-bold text-green-600">
                  {enrollments.reduce((sum, e) => sum + (e.lessonsCompleted || 0), 0)}
                </p>
              </div>
              <Play className="w-12 h-12 text-green-600 opacity-20" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white border-b mb-8">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-4 px-6 font-semibold border-b-2 transition-colors ${
                activeTab === 'dashboard'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              My Courses
            </button>
            <button
              onClick={() => setActiveTab('available')}
              className={`py-4 px-6 font-semibold border-b-2 transition-colors ${
                activeTab === 'available'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Available Courses
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-4 px-6 font-semibold border-b-2 transition-colors ${
                activeTab === 'profile'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Profile
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        ) : (
          <>
            {/* My Courses Tab */}
            {activeTab === 'dashboard' && (
              <div>
                {enrollments.length === 0 ? (
                  <div className="bg-white rounded-lg p-12 text-center">
                    <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">
                      You haven't enrolled in any courses yet.
                    </p>
                    <button
                      onClick={() => navigate('/courses')}
                      className="btn-primary"
                    >
                      Browse Courses
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {enrollments.map((enrollment) => (
                      <div
                        key={enrollment.id}
                        className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden"
                      >
                        <div className="flex items-start gap-6 p-6">
                          {enrollment.course?.thumbnail && (
                            <img
                              src={enrollment.course.thumbnail}
                              alt={enrollment.course.title}
                              className="w-40 h-24 object-cover rounded-lg flex-shrink-0"
                            />
                          )}
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                              {enrollment.course?.title}
                            </h3>
                            <p className="text-gray-600 mb-4 line-clamp-2">
                              {enrollment.course?.description}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex-1 mr-4">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm font-semibold text-gray-700">
                                    Progress
                                  </span>
                                  <span className="text-sm font-bold text-blue-600">
                                    {enrollment.progress}%
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-blue-600 h-2 rounded-full transition-all"
                                    style={{ width: `${enrollment.progress}%` }}
                                  ></div>
                                </div>
                              </div>
                              <button
                                onClick={() => {
                                  const courseData = SAMPLE_ALL_COURSES.find(c => c.id === enrollment.courseId)
                                  if (courseData && courseData.lessons && courseData.lessons.length > 0) {
                                    navigate(`/course/${enrollment.courseId}/lesson/${courseData.lessons[0].id}`)
                                  }
                                }}
                                className="btn-primary px-6 py-2"
                              >
                                Continue
                              </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-3">
                              Last accessed:{' '}
                              {new Date(
                                enrollment.lastAccessed
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Available Courses Tab */}
            {activeTab === 'available' && (
              <div>
                {availableCourses.length === 0 ? (
                  <div className="bg-white rounded-lg p-12 text-center">
                    <p className="text-gray-600">No courses available.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {availableCourses.map((course) => {
                      const courseIsEnrolled = isEnrolled(course.id)
                      return (
                        <div
                          key={course.id}
                          className="bg-white rounded-lg shadow hover:shadow-lg transition-all overflow-hidden"
                        >
                          {course.thumbnail && (
                            <img
                              src={course.thumbnail}
                              alt={course.title}
                              className="w-full h-40 object-cover"
                            />
                          )}
                          <div className="p-4">
                            <h4 className="font-bold text-gray-900 mb-2 line-clamp-2">
                              {course.title}
                            </h4>
                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                              {course.description}
                            </p>
                            <div className="flex items-center justify-between mb-4">
                              <span className="text-xs text-gray-500">
                                {course.lessons?.length || 0} lessons
                              </span>
                              {courseIsEnrolled && (
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
                                  ✓ Enrolled
                                </span>
                              )}
                            </div>
                            <button
                              onClick={() => {
                                if (courseIsEnrolled && course.lessons && course.lessons.length > 0) {
                                  // Go to first lesson for enrolled courses
                                  navigate(`/course/${course.id}/lesson/${course.lessons[0].id}`)
                                } else {
                                  // Go to course details for enrollment
                                  navigate(`/course/${course.id}`)
                                }
                              }}
                              className={`w-full py-2 px-4 rounded-lg font-semibold transition-colors ${
                                courseIsEnrolled
                                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                              }`}
                            >
                              {courseIsEnrolled ? 'Continue' : 'Enroll'}
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    Profile Information
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <p className="text-gray-600 text-sm font-semibold mb-2">
                        Full Name
                      </p>
                      <p className="text-gray-900 text-lg font-medium">
                        {user?.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm font-semibold mb-2">
                        Email Address
                      </p>
                      <p className="text-gray-900 text-lg font-medium">
                        {user?.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm font-semibold mb-2">
                        Account Type
                      </p>
                      <div className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-semibold">
                        {user?.role === 'ADMIN' ? 'Administrator' : 'Student'}
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm font-semibold mb-2">
                        Member Since
                      </p>
                      <p className="text-gray-900 text-lg font-medium">
                        May 2024
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    Learning Statistics
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <p className="text-gray-600 text-sm font-semibold mb-3">
                        Total Learning Time
                      </p>
                      <p className="text-gray-900 text-3xl font-bold">
                        {enrollments.length * 12}h 30m
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm font-semibold mb-3">
                        Courses in Progress
                      </p>
                      <p className="text-gray-900 text-3xl font-bold">
                        {enrollments.filter((e) => e.progress < 100).length}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm font-semibold mb-3">
                        Courses Completed
                      </p>
                      <p className="text-gray-900 text-3xl font-bold">
                        {enrollments.filter((e) => e.progress === 100).length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default UserDashboardPage
