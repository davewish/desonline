import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Download,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  BookOpen,
  CheckCircle,
  XCircle,
  RotateCcw,
} from "lucide-react";
import {
  courseService,
  lessonService,
  quizService,
  enrollmentService,
} from "../services/api";
import { useAuth } from "../hooks/useAuth";

const LessonViewerPage = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [lesson, setLesson] = useState(null);
  const [course, setCourse] = useState(null);
  const [allLessons, setAllLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [quizzes, setQuizzes] = useState([]);

  // Quiz State
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [quizStep, setQuizStep] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizResults, setQuizResults] = useState({}); // Stores results by quizId
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchLessonData();
  }, [lessonId, courseId]);

  // Dedicated effect to load quiz history whenever authentication state changes
  useEffect(() => {
    const loadQuizHistory = async () => {
      if (isAuthenticated) {
        try {
          console.info("[LESSON] Fetching user quiz history...");
          const historyRes = await quizService.getUserQuizHistory();
          if (historyRes.data.success && Array.isArray(historyRes.data.data)) {
            const historyMap = {};
            historyRes.data.data.forEach((attempt) => {
              historyMap[attempt.quizId.toString()] = attempt;
            });
            setQuizResults(historyMap);
          }
        } catch (err) {
          console.warn("[LESSON] Could not load quiz history:", err.message);
        }
      }
    };
    loadQuizHistory();
  }, [isAuthenticated]);

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

      const lessons = courseData.lessons || []; // Use lessons from course data already fetched
      setAllLessons(lessons);

      // Fetch quizzes for this lesson
      try {
        const quizzesRes = await quizService.getQuizzesByLesson(lessonId);
        if (quizzesRes.data.success) {
          setQuizzes(quizzesRes.data.data || []);
          console.info(
            "[LESSON] Quizzes loaded:",
            quizzesRes.data.data?.length || 0,
          );
          console.info("[LESSON] Quizzes loaded:", quizzesRes.data.data);
        }
      } catch (quizErr) {
        console.warn("[LESSON] Failed to load quizzes:", quizErr.message);
      }
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

  const handleStartQuiz = (quiz) => {
    setActiveQuiz(quiz);
    setQuizStep(0);
    setSelectedAnswers({});
  };

  const handleSelectAnswer = (questionId, answerIndex) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId.toString()]: answerIndex,
    }));
  };

  const handleSubmitQuiz = async () => {
    if (!activeQuiz) return;

    setIsSubmitting(true);
    try {
      const response = await quizService.submitQuiz(
        activeQuiz.id,
        selectedAnswers,
      );
      if (response.data.success) {
        setQuizResults((prev) => ({
          ...prev,
          [activeQuiz.id.toString()]: response.data.data,
        }));
        setActiveQuiz(null); // Return to list view which will now show results
      }
    } catch (err) {
      console.error("Quiz submission error:", err);
      alert("Failed to submit quiz. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetakeQuiz = (quizId) => {
    const quiz = quizzes.find((q) => q.id === quizId);
    if (quiz) {
      // Clear local result to show quiz again
      setQuizResults((prev) => {
        const newResults = { ...prev };
        delete newResults[quizId.toString()];
        return newResults;
      });
      handleStartQuiz(quiz);
    }
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

              {/* Quizzes Section */}
              {quizzes.length > 0 && (
                <div className="mt-6 pt-6 border-t">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Lesson Quizzes
                  </h3>

                  <div className="space-y-6">
                    {quizzes.map((quiz) => {
                      // Use string key to ensure match
                      const result = quizResults[quiz.id.toString()];
                      const isTaking = activeQuiz?.id === quiz.id;

                      if (isTaking) {
                        const currentQuestion = quiz.questions[quizStep];
                        const totalQuestions = quiz.questions.length;
                        const isAnswered =
                          selectedAnswers[currentQuestion.id.toString()] !==
                          undefined;

                        return (
                          <div
                            key={quiz.id}
                            className="bg-blue-50 border border-blue-200 rounded-xl p-6"
                          >
                            <div className="flex justify-between items-center mb-6">
                              <h4 className="font-bold text-blue-900">
                                {quiz.title}
                              </h4>
                              <span className="text-sm font-medium text-blue-700">
                                Question {quizStep + 1} of {totalQuestions}
                              </span>
                            </div>

                            <div className="mb-6">
                              <p className="text-lg text-gray-900 font-medium mb-4">
                                {currentQuestion.text ||
                                  currentQuestion.question}
                              </p>
                              <div className="space-y-3">
                                {currentQuestion.options.map((option, idx) => (
                                  <button
                                    key={idx}
                                    onClick={() =>
                                      handleSelectAnswer(
                                        currentQuestion.id,
                                        idx,
                                      )
                                    }
                                    className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                                      selectedAnswers[currentQuestion.id] ===
                                      idx
                                        ? "border-blue-600 bg-blue-100"
                                        : "border-gray-200 bg-white hover:border-gray-300"
                                    }`}
                                  >
                                    {option}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div className="flex justify-between items-center">
                              <button
                                onClick={() =>
                                  setQuizStep((s) => Math.max(0, s - 1))
                                }
                                disabled={quizStep === 0}
                                className="px-4 py-2 text-gray-600 font-semibold disabled:opacity-30"
                              >
                                Previous
                              </button>
                              {quizStep < totalQuestions - 1 ? (
                                <button
                                  onClick={() => setQuizStep((s) => s + 1)}
                                  disabled={!isAnswered}
                                  className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                                    isAnswered
                                      ? "bg-blue-600 text-white hover:bg-blue-700"
                                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                  }`}
                                >
                                  Next
                                </button>
                              ) : (
                                <button
                                  onClick={handleSubmitQuiz}
                                  disabled={isSubmitting || !isAnswered}
                                  className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                                    !isSubmitting && isAnswered
                                      ? "bg-green-600 text-white hover:bg-green-700"
                                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                  }`}
                                >
                                  {isSubmitting
                                    ? "Submitting..."
                                    : "Submit Quiz"}
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      }

                      if (result) {
                        return (
                          <div
                            key={quiz.id}
                            className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg"
                          >
                            <div className="flex items-center gap-4">
                              <div className="bg-white p-2 rounded-full">
                                {result.score >= 70 ? (
                                  <CheckCircle className="w-6 h-6 text-green-600" />
                                ) : (
                                  <XCircle className="w-6 h-6 text-red-600" />
                                )}
                              </div>
                              <div>
                                <p className="font-bold text-gray-900">
                                  {quiz.title}
                                </p>
                                <p className="text-sm text-gray-600">
                                  Last Score:{" "}
                                  <span className="font-bold text-blue-600">
                                    {result.score}%
                                  </span>
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => handleRetakeQuiz(quiz.id)}
                              className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700"
                            >
                              <RotateCcw className="w-4 h-4" />
                              Retake
                            </button>
                          </div>
                        );
                      }

                      return (
                        <div
                          key={quiz.id}
                          className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                        >
                          <div>
                            <p className="font-semibold text-gray-900">
                              {quiz.title}
                            </p>
                            <p className="text-xs text-gray-500">
                              {quiz.questions.length} Questions
                            </p>
                          </div>
                          <button
                            onClick={() => handleStartQuiz(quiz)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-sm"
                          >
                            Take Quiz
                          </button>
                        </div>
                      );
                    })}
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
    </div>
  );
};

export default LessonViewerPage;
