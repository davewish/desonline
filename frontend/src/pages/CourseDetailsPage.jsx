import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AlertCircle, Play, BookOpen, Award } from "lucide-react";
import { courseService, enrollmentService } from "../services/api";
import { useAuth } from "../hooks/useAuth";
import ExamModal from "../components/ExamModal";
import { getExamByCourseId } from "../services/mockQuizData";

const CourseDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [enrolling, setEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [showExam, setShowExam] = useState(false);
  const [examScores, setExamScores] = useState({});

  useEffect(() => {
    fetchCourse();
    if (isAuthenticated) {
      checkEnrollment();
    }
  }, [id, isAuthenticated]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      console.info("[COURSE] Loading course details - ID:", id);
      const response = await courseService.getCourseById(id);
      if (response.data.success) {
        console.info("[COURSE] Loaded:", response.data.data.title);
        setCourse(response.data.data);
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

  const handleExamSubmit = (result) => {
    console.info("[EXAM] Exam submitted:", result);
    setExamScores({
      ...examScores,
      [result.examId]: result,
    });
    // TODO: Send exam result to backend API
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
                  src={course.thumbnail}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailsPage;
