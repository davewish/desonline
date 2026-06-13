import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Play, BookOpen, BarChart3, LogOut } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { courseService, enrollmentService } from "../services/api";
import { getMediaUrl } from "../utils/mediaUtils";

const UserDashboardPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      console.info("[USER-DASHBOARD] Fetching user data for:", user?.email);
      // Fetch user enrollments
      const enrollmentRes = await enrollmentService.getUserEnrollments();
      setEnrollments(enrollmentRes.data.data || []);
      console.info(
        "[USER-DASHBOARD] Loaded",
        enrollmentRes.data.data?.length || 0,
        "enrollments",
      );

      // Fetch all courses
      const coursesRes = await courseService.getCourses({ limit: 100 });
      setAllCourses(coursesRes.data.data || []);
      console.info(
        "[USER-DASHBOARD] Loaded",
        coursesRes.data.data?.length || 0,
        "courses",
      );
    } catch (error) {
      console.error(
        "[USER-DASHBOARD] Failed to fetch data:",
        error.response?.data?.message || error.message,
      );
    }
    setLoading(false);
  };

  const isEnrolled = (courseId) => {
    return enrollments.some((enrollment) => enrollment.courseId === courseId);
  };

  const handleLogout = () => {
    console.info("[USER-DASHBOARD] User logging out:", user?.email);
    logout();
    navigate("/");
  };

  const handleEnroll = async (courseId) => {
    try {
      console.info("[USER-DASHBOARD] Enrolling in course ID:", courseId);
      await enrollmentService.enrollCourse(courseId);
      console.info("[USER-DASHBOARD] Enrollment successful");
      fetchUserData();
    } catch (error) {
      console.error(
        "[USER-DASHBOARD] Failed to enroll:",
        error.response?.data?.message || error.message,
      );
    }
  };

  const handleContinueCourse = (courseId) => {
    navigate(`/course/${courseId}`);
  };

  const totalProgress =
    enrollments.length > 0
      ? Math.round(
          enrollments.reduce((sum, e) => sum + (e.progress || 0), 0) /
            enrollments.length,
        )
      : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8">
        <div className="container">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                Welcome, {user?.name}! 👋
              </h1>
              <p className="text-blue-100">
                {user?.role === "ADMIN"
                  ? "Admin Account"
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
                  {enrollments.reduce(
                    (sum, e) => sum + (e.lessonsCompleted || 0),
                    0,
                  )}
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
              onClick={() => setActiveTab("dashboard")}
              className={`py-4 px-6 font-semibold border-b-2 transition-colors ${
                activeTab === "dashboard"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              My Courses
            </button>
            <button
              onClick={() => setActiveTab("available")}
              className={`py-4 px-6 font-semibold border-b-2 transition-colors ${
                activeTab === "available"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              Available Courses
            </button>
            <button
              onClick={() => setActiveTab("profile")}
              className={`py-4 px-6 font-semibold border-b-2 transition-colors ${
                activeTab === "profile"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
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
            {activeTab === "dashboard" && (
              <div>
                {enrollments.length === 0 ? (
                  <div className="bg-white rounded-lg p-12 text-center">
                    <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">
                      You haven't enrolled in any courses yet.
                    </p>
                    <button
                      onClick={() => navigate("/courses")}
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
                        <div className="flex flex-col md:flex-row items-start gap-3 md:gap-6 p-4 md:p-6">
                          {enrollment.course?.thumbnail && (
                            <img
                              src={getMediaUrl(enrollment.course.thumbnail)}
                              alt={enrollment.course.title}
                              className="w-full md:w-40 h-32 md:h-24 object-cover rounded-lg flex-shrink-0"
                            />
                          )}
                          <div className="flex-1 w-full">
                            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                              {enrollment.course?.title}
                            </h3>
                            <p className="text-sm md:text-base text-gray-600 mb-4 line-clamp-2">
                              {enrollment.course?.description}
                            </p>
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-xs md:text-sm font-semibold text-gray-700">
                                    Progress
                                  </span>
                                  <span className="text-xs md:text-sm font-bold text-blue-600">
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
                                onClick={() =>
                                  handleContinueCourse(enrollment.courseId)
                                }
                                className="btn-primary px-4 md:px-6 py-2 w-full md:w-auto"
                              >
                                Continue
                              </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-3">
                              Last accessed:{" "}
                              {new Date(
                                enrollment.lastAccessed,
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
            {activeTab === "available" && (
              <div>
                {allCourses.length === 0 ? (
                  <div className="bg-white rounded-lg p-12 text-center">
                    <p className="text-gray-600">No courses available.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {allCourses.map((course) => {
                      const courseIsEnrolled = isEnrolled(course.id);
                      return (
                        <div
                          key={course.id}
                          className="bg-white rounded-lg shadow hover:shadow-lg transition-all overflow-hidden"
                        >
                          {course.thumbnail && (
                            <img
                              src={getMediaUrl(course.thumbnail)}
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
                                if (courseIsEnrolled) {
                                  // Go to course details for enrolled courses
                                  navigate(`/course/${course.id}`);
                                } else {
                                  // Go to course details for enrollment
                                  navigate(`/course/${course.id}`);
                                }
                              }}
                              className={`w-full py-2 px-4 rounded-lg font-semibold transition-colors ${
                                courseIsEnrolled
                                  ? "bg-blue-600 text-white hover:bg-blue-700"
                                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                              }`}
                            >
                              {courseIsEnrolled ? "Continue" : "Enroll"}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === "profile" && (
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
                        {user?.role === "ADMIN" ? "Administrator" : "Student"}
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
  );
};

export default UserDashboardPage;
