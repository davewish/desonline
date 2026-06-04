import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Download, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react'
import { courseService, lessonService } from '../services/api'

const LessonViewerPage = () => {
  const { courseId, lessonId } = useParams()
  const navigate = useNavigate()
  const [lesson, setLesson] = useState(null)
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0)

  useEffect(() => {
    fetchLessonData()
  }, [lessonId, courseId])

  const fetchLessonData = async () => {
    try {
      setLoading(true)
      const lessonResponse = await lessonService.getLessonById(lessonId)
      const courseResponse = await courseService.getCourseById(courseId)

      if (lessonResponse.data.success && courseResponse.data.success) {
        setLesson(lessonResponse.data.data)
        setCourse(courseResponse.data.data)
        
        // Find current lesson index
        const index = courseResponse.data.data.lessons.findIndex(
          (l) => l.id === parseInt(lessonId)
        )
        setCurrentLessonIndex(index)
      }
    } catch (err) {
      setError('Failed to load lesson')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handlePreviousLesson = () => {
    if (currentLessonIndex > 0) {
      const previousLesson = course.lessons[currentLessonIndex - 1]
      navigate(`/course/${courseId}/lesson/${previousLesson.id}`)
    }
  }

  const handleNextLesson = () => {
    if (currentLessonIndex < course.lessons.length - 1) {
      const nextLesson = course.lessons[currentLessonIndex + 1]
      navigate(`/course/${courseId}/lesson/${nextLesson.id}`)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading lesson...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="font-semibold text-gray-900">Error</h2>
              <p className="text-gray-600 text-sm mt-1">{error}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!lesson || !course) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={() => navigate(`/course/${courseId}`)}
                className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 mb-2"
              >
                ← Back to Course
              </button>
              <h1 className="text-2xl font-bold text-gray-900">{lesson.title}</h1>
              <p className="text-gray-600 text-sm mt-1">{course.title}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Video Player */}
            {lesson.videoUrl && (
              <div className="bg-black rounded-lg overflow-hidden mb-6 aspect-video">
                <video
                  controls
                  className="w-full h-full"
                  src={lesson.videoUrl}
                  preload="metadata"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            )}

            {/* Lesson Info */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                About this lesson
              </h2>
              <div className="prose max-w-none">
                <p className="text-gray-600">
                  This lesson covers the key concepts related to {lesson.title}.
                </p>
              </div>

              {/* PDF Download */}
              {lesson.pdfUrl && (
                <div className="mt-6 pt-6 border-t">
                  <a
                    href={lesson.pdfUrl}
                    download
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                  >
                    <Download className="w-4 h-4" />
                    Download PDF Materials
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Lessons List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h3 className="font-semibold text-gray-900">
                  Course Lessons ({course.lessons.length})
                </h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {course.lessons.map((l, index) => (
                  <button
                    key={l.id}
                    onClick={() =>
                      navigate(`/course/${courseId}/lesson/${l.id}`)
                    }
                    className={`w-full text-left p-4 border-b hover:bg-gray-50 transition-colors ${
                      l.id === lesson.id
                        ? 'bg-blue-50 border-l-4 border-blue-600'
                        : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-700">
                        {index + 1}
                      </span>
                      <div>
                        <p
                          className={`font-medium text-sm ${
                            l.id === lesson.id
                              ? 'text-blue-600'
                              : 'text-gray-900'
                          }`}
                        >
                          {l.title}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="mt-4 flex gap-2">
              <button
                onClick={handlePreviousLesson}
                disabled={currentLessonIndex === 0}
                className="flex-1 py-2 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center justify-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
              <button
                onClick={handleNextLesson}
                disabled={currentLessonIndex === course.lessons.length - 1}
                className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center justify-center gap-2"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LessonViewerPage
