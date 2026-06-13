import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  AlertCircle,
  Play,
  BookOpen,
  FileText,
  CheckCircle,
  XCircle,
  RotateCcw,
  Download,
} from "lucide-react";
import { courseService, enrollmentService, examService } from "../services/api";
import { useAuth } from "../hooks/useAuth";

const CourseDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [enrolling, setEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [exams, setExams] = useState([]);

  // Exam State
  const [activeExam, setActiveExam] = useState(null);
  const [examStep, setExamStep] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [examResults, setExamResults] = useState({}); // Stores results by examId
  const [isSubmittingExam, setIsSubmittingExam] = useState(false);

  const getMediaUrl = (url) => {
    if (!url) return null;
    if (url.startsWith("http")) return url;
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
    const baseUrl = apiUrl.split("/api")[0];
    return `${baseUrl}${url}`;
  };

  useEffect(() => {
    fetchCourse();
    if (isAuthenticated) {
      checkEnrollment();
    }
  }, [id]);

  // Dedicated effect to load exam history whenever authentication state changes
  useEffect(() => {
    const loadExamHistory = async () => {
      if (isAuthenticated) {
        try {
          console.info("[COURSE] Fetching user exam history...");
          const historyRes = await examService.getUserExamHistory();
          if (historyRes.data.success && Array.isArray(historyRes.data.data)) {
            const historyMap = {};
            historyRes.data.data.forEach((attempt) => {
              historyMap[attempt.examId.toString()] = attempt;
            });
            setExamResults(historyMap);
          }
        } catch (err) {
          console.warn("[COURSE] Could not load exam history:", err.message);
        }
      }
    };
    loadExamHistory();
  }, [isAuthenticated]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      console.info("[COURSE] Loading course details - ID:", id);
      const response = await courseService.getCourseById(id);

      if (response.data.success) {
        console.info("[COURSE] Loaded:", response.data.data.title);
        setCourse(response.data.data);

        // Fetch exams for this course
        try {
          const examsRes = await examService.getExamByCourse(id);
          if (examsRes.data.success) {
            setExams(examsRes.data.data || []);
            console.info(
              "[COURSE] Exams loaded:",
              examsRes.data.data?.length || 0,
            );
          }
        } catch (examErr) {
          console.warn("[COURSE] Failed to load exams:", examErr.message);
        }
      }
    } catch (err) {
      console.error(
        "[COURSE] Failed to load course:",
        err.response?.data?.message || err.message,
      );
      setError("Failed to load course. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const checkEnrollment = async () => {
    try {
      const response = await enrollmentService.getUserEnrollments();
      if (response.data.success) {
        const enrolled = response.data.data.some(
          (e) => e.courseId === parseInt(id),
        );
        setIsEnrolled(enrolled);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      setEnrolling(true);
      console.info(
        "[ENROLLMENT] Enrolling user:",
        user?.email,
        "Course:",
        course?.title,
      );
      const response = await enrollmentService.enrollCourse(parseInt(id));
      if (response.data.success) {
        console.info("[ENROLLMENT] Success - User enrolled in:", course?.title);
        setIsEnrolled(true);
      }
    } catch (err) {
      console.error(
        "[ENROLLMENT] Failed:",
        err.response?.data?.message || err.message,
      );
    } finally {
      setEnrolling(false);
    }
  };

  const handleStartExam = (exam) => {
    setActiveExam(exam);
    setExamStep(0);
    setSelectedAnswers({});
  };

  const handleSelectAnswer = (questionId, answerIndex) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId.toString()]: answerIndex,
    }));
  };

  const handleSubmitExam = async () => {
    if (!activeExam) return;

    setIsSubmittingExam(true);
    try {
      const response = await examService.submitExam(
        activeExam.id,
        selectedAnswers,
      );
      if (response.data.success) {
        setExamResults((prev) => ({
          ...prev,
          [activeExam.id.toString()]: response.data.data,
        }));
        setActiveExam(null); // Return to list view to show result
      }
    } catch (err) {
      console.error("Exam submission error:", err);
      alert("Failed to submit exam. Please try again.");
    } finally {
      setIsSubmittingExam(false);
    }
  };

  const handleRetakeExam = (examId) => {
    const exam = exams.find((e) => e.id === examId);
    if (exam) {
      setExamResults((prev) => {
        const newResults = { ...prev };
        delete newResults[examId.toString()];
        return newResults;
      });
      handleStartExam(exam);
    }
  };

  const handleDownloadCertificate = () => {
    alert("Certificate download started! (Mock feature)");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course...</p>
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

  if (!course) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="container">
          <button
            onClick={() => navigate("/courses")}
            className="text-blue-100 hover:text-white mb-4 font-semibold"
          >
            ← Back to Courses
          </button>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
              <p className="text-blue-100 text-lg mb-6">{course.description}</p>
              <div className="flex items-center gap-4">
                <span className="inline-block bg-white/20 px-4 py-2 rounded-full font-semibold">
                  {course.lessons.length} Lessons
                </span>
                {course.creator && (
                  <span className="text-blue-100">
                    By {course.creator.name}
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col justify-center">
              {course.thumbnail && (
                <img
                  src={getMediaUrl(course.thumbnail)}
                  alt={course.title}
                  className="rounded-lg w-full h-48 object-cover mb-4"
                />
              )}
              <button
                onClick={handleEnroll}
                disabled={isEnrolled || enrolling}
                className={`btn font-semibold py-3 px-6 rounded-lg transition-all w-full ${
                  isEnrolled
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-white text-blue-600 hover:bg-gray-100"
                }`}
              >
                {isEnrolled
                  ? "✓ Enrolled"
                  : enrolling
                    ? "Enrolling..."
                    : "Enroll Now"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Course Information
              </h2>
              <div className="prose max-w-none mb-8">
                <p className="text-gray-600 leading-relaxed">
                  {course.description}
                </p>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-4">
                What you'll learn
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>Master the fundamentals and advanced concepts</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>Learn from industry experts</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>Get hands-on experience with real projects</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>Access premium learning materials and resources</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Course Curriculum
                </h3>
              </div>
              <div className="divide-y">
                {course.lessons.map((lesson, index) => (
                  <button
                    key={lesson.id}
                    onClick={() => {
                      if (isEnrolled) {
                        navigate(`/course/${id}/lesson/${lesson.id}`);
                      }
                    }}
                    disabled={!isEnrolled}
                    className={`w-full text-left p-4 transition-colors flex items-start gap-3 ${
                      isEnrolled
                        ? "hover:bg-gray-50 cursor-pointer"
                        : "opacity-60 cursor-not-allowed"
                    }`}
                  >
                    <Play className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-medium text-sm text-gray-900">
                        Lesson {index + 1}: {lesson.title}
                      </p>
                      {!isEnrolled && (
                        <p className="text-xs text-gray-500 mt-1">
                          Enroll to view
                        </p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Course Exams */}
            {isEnrolled && exams.length > 0 && (
              <div className="bg-white rounded-lg shadow mt-6">
                <div className="p-6 border-b">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Course Exams
                  </h3>
                </div>
                <div className="divide-y">
                  {exams.map((exam) => {
                    const result = examResults[exam.id.toString()];
                    const isTaking = activeExam?.id === exam.id;

                    if (isTaking) {
                      const currentQuestion = exam.questions[examStep];
                      const totalQuestions = exam.questions.length;
                      const isAnswered =
                        selectedAnswers[currentQuestion.id.toString()] !==
                        undefined;

                      return (
                        <div
                          key={exam.id}
                          className="p-4 bg-purple-50 border-l-4 border-purple-600"
                        >
                          <div className="flex justify-between items-center mb-4">
                            <span className="text-xs font-bold text-purple-700 uppercase">
                              Exam Mode
                            </span>
                            <span className="text-xs font-medium text-purple-700">
                              Q {examStep + 1}/{totalQuestions}
                            </span>
                          </div>

                          <p className="text-sm font-semibold text-gray-900 mb-4">
                            {currentQuestion.text || currentQuestion.question}
                          </p>

                          <div className="space-y-2 mb-4">
                            {currentQuestion.options.map((option, idx) => (
                              <button
                                key={idx}
                                onClick={() =>
                                  handleSelectAnswer(currentQuestion.id, idx)
                                }
                                className={`w-full p-3 text-left text-sm rounded-lg border transition-all ${
                                  selectedAnswers[currentQuestion.id] === idx
                                    ? "border-purple-600 bg-purple-100 font-medium"
                                    : "border-gray-200 bg-white hover:border-gray-300"
                                }`}
                              >
                                {option}
                              </button>
                            ))}
                          </div>

                          <div className="flex justify-between items-center pt-2">
                            <button
                              onClick={() =>
                                setExamStep((s) => Math.max(0, s - 1))
                              }
                              disabled={examStep === 0}
                              className="text-xs font-bold text-gray-500 disabled:opacity-30"
                            >
                              Back
                            </button>
                            {examStep < totalQuestions - 1 ? (
                              <button
                                onClick={() => setExamStep((s) => s + 1)}
                                disabled={!isAnswered}
                                className={`px-4 py-1.5 rounded-lg font-bold text-xs transition-all ${
                                  isAnswered
                                    ? "bg-purple-600 text-white hover:bg-purple-700"
                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                }`}
                              >
                                Next
                              </button>
                            ) : (
                              <button
                                onClick={handleSubmitExam}
                                disabled={isSubmittingExam || !isAnswered}
                                className={`px-4 py-1.5 rounded-lg font-bold text-xs transition-all ${
                                  !isSubmittingExam && isAnswered
                                    ? "bg-green-600 text-white hover:bg-green-700"
                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                }`}
                              >
                                {isSubmittingExam ? "..." : "Submit"}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    }

                    if (result) {
                      const passed = result.score >= (exam.passingScore || 70);
                      return (
                        <div
                          key={exam.id}
                          className={`p-4 ${passed ? "bg-green-50" : "bg-red-50"}`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {passed ? (
                                <CheckCircle className="w-5 h-5 text-green-600" />
                              ) : (
                                <XCircle className="w-5 h-5 text-red-600" />
                              )}
                              <p className="font-bold text-gray-900 text-sm">
                                {exam.title}
                              </p>
                            </div>
                            <span
                              className={`text-xs font-bold px-2 py-0.5 rounded-full ${passed ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                            >
                              {result.score}%
                            </span>
                          </div>
                          <div className="flex gap-4">
                            <button
                              onClick={() => handleRetakeExam(exam.id)}
                              className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700"
                            >
                              <RotateCcw className="w-3 h-3" /> Retake
                            </button>
                            {passed && (
                              <button
                                onClick={handleDownloadCertificate}
                                className="flex items-center gap-1 text-xs font-bold text-green-600 hover:text-green-700"
                              >
                                <Download className="w-3 h-3" /> Certificate
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={exam.id}
                        className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between"
                      >
                        <div>
                          <p className="font-medium text-gray-900 text-sm">
                            {exam.title}
                          </p>
                          <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider font-bold">
                            Passing: {exam.passingScore}%
                          </p>
                        </div>
                        <button
                          onClick={() => handleStartExam(exam)}
                          className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold text-xs"
                        >
                          Take Exam
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailsPage;
