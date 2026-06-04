import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Download, ChevronLeft, ChevronRight, AlertCircle, BookOpen } from "lucide-react";
import { courseService, lessonService } from "../services/api";
import QuizModal from "../components/QuizModal";
import { getQuizByLessonId } from "../services/mockQuizData";

const LessonViewerPage = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [course, setCourse] = useState(null);
  const [allLessons, setAllLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizScores, setQuizScores] = useState({});

  useEffect(() => {
    fetchLessonData();
  }, [lessonId, courseId]);

  const fetchLessonData = async () => {
    setLoading(true);
    try {
      console.info("[LESSON] Loading - Course:", courseId, "Lesson:", lessonId);
      // Get course data from API
      const courseRes = await courseService.getCourseById(courseId);
      if (!courseRes.data.success) {
        console.error("[LESSON] Course not found");
        setError("Course not found");
        setLoading(false);
        return;
      }

      const courseData = courseRes.data.data;
      setCourse(courseData);
      console.info("[LESSON] Course loaded:", courseData.title);

      // Get lesson data from API
      const lessonRes = await lessonService.getLessonById(lessonId);
      if (!lessonRes.data.success) {
        console.error("[LESSON] Lesson not found");
        setError("Lesson not found");
        setLoading(false);
        return;
      }

      const lessonData = lessonRes.data.data;
      setLesson(lessonData);
      console.info("[LESSON] Lesson loaded:", lessonData.title);

      // Get all lessons for the course to enable navigation
      const lessonsRes = await courseService.getCourseById(courseId);
      const lessons = lessonsRes.data.data.lessons || [];
      setAllLessons(lessons);

      // Find current lesson index
      const index = lessons.findIndex((l) => l.id === parseInt(lessonId));
      setCurrentLessonIndex(index >= 0 ? index : 0);
    } catch (err) {
      console.error(
        "[LESSON] Failed to load:",
        err.response?.data?.message || err.message,
      );
      setError("Failed to load lesson. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handlePreviousLesson = () => {
    if (currentLessonIndex > 0) {
      const previousLesson = allLessons[currentLessonIndex - 1];
      console.info(
        "[LESSON] Navigating to previous lesson:",
        previousLesson.title,
      );
      navigate(`/course/${courseId}/lesson/${previousLesson.id}`);
    }
  };

  const handleNextLesson = () => {
    if (currentLessonIndex < allLessons.length - 1) {
      const nextLesson = allLessons[currentLessonIndex + 1];
      console.info("[LESSON] Navigating to next lesson:", nextLesson.title);
      navigate(`/course/${courseId}/lesson/${nextLesson.id}`);
    }
  };

  const handleQuizSubmit = (result) => {
    console.info("[LESSON] Quiz submitted:", result);
    setQuizScores({
      ...quizScores,
      [result.quizId]: result,
    });
    // TODO: Send quiz result to backend API
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading lesson...</p>
        </div>
      </div>
    );
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
    );
  }

  if (!lesson || !course) {
    return null;
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
              <h1 className="text-2xl font-bold text-gray-900">
                {lesson.title}
              </h1>
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
                {lesson.videoUrl.includes("youtube") ||
                lesson.videoUrl.includes("youtu.be") ? (
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

              {/* Quiz Button */}
              {getQuizByLessonId(lessonId) && (
                <div className="mt-6 pt-6 border-t">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-1">
                        <BookOpen className="w-4 h-4" />
                        Test Your Knowledge
                      </h3>
                      <p className="text-sm text-gray-600">
                        Take the quiz to reinforce what you learned
                      </p>
                    </div>
                    <button
                      onClick={() => setShowQuiz(true)}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold whitespace-nowrap"
                    >
                      {quizScores[getQuizByLessonId(lessonId)?.id]
                        ? `Retake Quiz (Score: ${quizScores[getQuizByLessonId(lessonId)?.id].score}%)`
                        : "Take Quiz"}
                    </button>
                  </div>
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
                        ? "bg-blue-50 border-l-4 border-blue-600"
                        : ""
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
                              ? "text-blue-600"
                              : "text-gray-900"
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

      {/* Quiz Modal */}
      {showQuiz && (
        <QuizModal
          quiz={getQuizByLessonId(lessonId)}
          onClose={() => setShowQuiz(false)}
          onSubmit={handleQuizSubmit}
        />
      )}
    </div>
  );
};

export default LessonViewerPage;
