import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertCircle, Check } from 'lucide-react'
import { courseService, lessonService } from '../services/api'
import { useAuth } from '../hooks/useAuth'

const AdminDashboardPage = () => {
  const navigate = useNavigate()
  const { user, isAdmin } = useAuth()
  const [activeTab, setActiveTab] = useState('courses')
  const [showCourseForm, setShowCourseForm] = useState(false)
  const [showLessonForm, setShowLessonForm] = useState(false)
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    thumbnail: null,
  })
  const [lessonData, setLessonData] = useState({
    courseId: '',
    title: '',
    position: 0,
    video: null,
    pdf: null,
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md">
          <AlertCircle className="w-12 h-12 text-red-600 mb-4" />
          <h2 className="font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">
            You do not have permission to access the admin dashboard.
          </p>
          <button
            onClick={() => navigate('/courses')}
            className="btn-primary w-full"
          >
            Go to Courses
          </button>
        </div>
      </div>
    )
  }

  const handleCourseSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!courseData.title || !courseData.description) {
      setError('Title and description are required')
      return
    }

    try {
      setLoading(true)
      await courseService.createCourse(courseData)
      setSuccess('Course created successfully!')
      setCourseData({ title: '', description: '', thumbnail: null })
      setShowCourseForm(false)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create course')
    } finally {
      setLoading(false)
    }
  }

  const handleLessonSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!lessonData.courseId || !lessonData.title || !lessonData.video) {
      setError('Course, title, and video are required')
      return
    }

    try {
      setLoading(true)
      await lessonService.createLesson(lessonData)
      setSuccess('Lesson created successfully!')
      setLessonData({
        courseId: '',
        title: '',
        position: 0,
        video: null,
        pdf: null,
      })
      setShowLessonForm(false)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create lesson')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="container py-6">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome, {user?.name}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="container flex gap-8">
          <button
            onClick={() => setActiveTab('courses')}
            className={`py-4 px-6 font-semibold border-b-2 transition-colors ${
              activeTab === 'courses'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Manage Courses
          </button>
          <button
            onClick={() => setActiveTab('lessons')}
            className={`py-4 px-6 font-semibold border-b-2 transition-colors ${
              activeTab === 'lessons'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Manage Lessons
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="container py-12">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
            <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <p className="text-green-700">{success}</p>
          </div>
        )}

        {activeTab === 'courses' && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Manage Courses</h2>
              <button
                onClick={() => setShowCourseForm(!showCourseForm)}
                className="btn-primary"
              >
                {showCourseForm ? 'Cancel' : 'Create Course'}
              </button>
            </div>

            {showCourseForm && (
              <div className="bg-white rounded-lg shadow p-8 mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Create New Course
                </h3>
                <form onSubmit={handleCourseSubmit} className="space-y-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Course Title
                    </label>
                    <input
                      type="text"
                      value={courseData.title}
                      onChange={(e) =>
                        setCourseData({ ...courseData, title: e.target.value })
                      }
                      className="input"
                      placeholder="Enter course title"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Description
                    </label>
                    <textarea
                      value={courseData.description}
                      onChange={(e) =>
                        setCourseData({
                          ...courseData,
                          description: e.target.value,
                        })
                      }
                      className="input"
                      placeholder="Enter course description"
                      rows="4"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Thumbnail Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setCourseData({
                          ...courseData,
                          thumbnail: e.target.files[0],
                        })
                      }
                      className="input"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full disabled:opacity-50"
                  >
                    {loading ? 'Creating...' : 'Create Course'}
                  </button>
                </form>
              </div>
            )}
          </div>
        )}

        {activeTab === 'lessons' && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Manage Lessons</h2>
              <button
                onClick={() => setShowLessonForm(!showLessonForm)}
                className="btn-primary"
              >
                {showLessonForm ? 'Cancel' : 'Create Lesson'}
              </button>
            </div>

            {showLessonForm && (
              <div className="bg-white rounded-lg shadow p-8 mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Create New Lesson
                </h3>
                <form onSubmit={handleLessonSubmit} className="space-y-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Course ID
                    </label>
                    <input
                      type="number"
                      value={lessonData.courseId}
                      onChange={(e) =>
                        setLessonData({ ...lessonData, courseId: e.target.value })
                      }
                      className="input"
                      placeholder="Enter course ID"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Lesson Title
                    </label>
                    <input
                      type="text"
                      value={lessonData.title}
                      onChange={(e) =>
                        setLessonData({ ...lessonData, title: e.target.value })
                      }
                      className="input"
                      placeholder="Enter lesson title"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Position
                    </label>
                    <input
                      type="number"
                      value={lessonData.position}
                      onChange={(e) =>
                        setLessonData({
                          ...lessonData,
                          position: parseInt(e.target.value),
                        })
                      }
                      className="input"
                      placeholder="Lesson order"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Video File
                    </label>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) =>
                        setLessonData({
                          ...lessonData,
                          video: e.target.files[0],
                        })
                      }
                      className="input"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      PDF Materials
                    </label>
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={(e) =>
                        setLessonData({
                          ...lessonData,
                          pdf: e.target.files[0],
                        })
                      }
                      className="input"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full disabled:opacity-50"
                  >
                    {loading ? 'Creating...' : 'Create Lesson'}
                  </button>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboardPage
