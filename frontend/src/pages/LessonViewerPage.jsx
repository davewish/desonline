import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Download, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react'
import { courseService, lessonService } from '../services/api'

// Sample course data with lessons
const SAMPLE_COURSES_DATA = {
  1: {
    id: 1,
    title: 'Introduction to Web Development',
    description: 'Learn the fundamentals of web development including HTML, CSS, and JavaScript. Perfect for beginners!',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop',
    lessons: [
      { id: 101, title: 'HTML Basics', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', pdfUrl: 'https://example.com/lesson1.pdf', position: 1 },
      { id: 102, title: 'CSS Styling', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', pdfUrl: 'https://example.com/lesson2.pdf', position: 2 },
      { id: 103, title: 'JavaScript Intro', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', pdfUrl: 'https://example.com/lesson3.pdf', position: 3 },
    ],
  },
  2: {
    id: 2,
    title: 'Advanced React.js',
    description: 'Master React with hooks, context, and advanced patterns for building scalable applications.',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134ef2944f7?w=400&h=300&fit=crop',
    lessons: [
      { id: 201, title: 'React Hooks', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', pdfUrl: 'https://example.com/lesson1.pdf', position: 1 },
      { id: 202, title: 'Context API', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', pdfUrl: 'https://example.com/lesson2.pdf', position: 2 },
      { id: 203, title: 'State Management', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', pdfUrl: 'https://example.com/lesson3.pdf', position: 3 },
    ],
  },
  3: {
    id: 3,
    title: 'Full Stack Development',
    description: 'Complete guide to building full stack applications with modern technologies and best practices.',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop',
    lessons: [
      { id: 301, title: 'Frontend Setup', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', pdfUrl: 'https://example.com/lesson1.pdf', position: 1 },
      { id: 302, title: 'Backend Setup', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', pdfUrl: 'https://example.com/lesson2.pdf', position: 2 },
      { id: 303, title: 'Database Integration', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', pdfUrl: 'https://example.com/lesson3.pdf', position: 3 },
    ],
  },
  4: {
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
  },
  5: {
    id: 5,
    title: 'CSS & Responsive Design',
    description: 'Learn modern CSS techniques and create beautiful responsive designs that work on all devices.',
    thumbnail: 'https://images.unsplash.com/photo-1507238691526-01ec042607b2?w=400&h=300&fit=crop',
    lessons: [
      { id: 501, title: 'CSS Fundamentals', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', pdfUrl: 'https://example.com/lesson1.pdf', position: 1 },
      { id: 502, title: 'Flexbox & Grid', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', pdfUrl: 'https://example.com/lesson2.pdf', position: 2 },
      { id: 503, title: 'Responsive Design', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', pdfUrl: 'https://example.com/lesson3.pdf', position: 3 },
    ],
  },
  6: {
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
  },
}

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
    setLoading(true)
    try {
      // Get course data from sample data
      const courseData = SAMPLE_COURSES_DATA[parseInt(courseId)]
      if (!courseData) {
        setError('Course not found')
        setLoading(false)
        return
      }

      setCourse(courseData)

      // Find the lesson
      const foundLesson = courseData.lessons.find(
        (l) => l.id === parseInt(lessonId)
      )
      if (!foundLesson) {
        setError('Lesson not found')
        setLoading(false)
        return
      }

      setLesson(foundLesson)

      // Find current lesson index
      const index = courseData.lessons.findIndex(
        (l) => l.id === parseInt(lessonId)
      )
      setCurrentLessonIndex(index)
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
                {lesson.videoUrl.includes('youtube') || lesson.videoUrl.includes('youtu.be') ? (
                  <iframe
                    width="100%"
                    height="100%"
                    src={lesson.videoUrl}
                    title={lesson.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                ) : (
                  <video
                    controls
                    className="w-full h-full"
                    src={lesson.videoUrl}
                    preload="metadata"
                  >
                    Your browser does not support the video tag.
                  </video>
                )}
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
