import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  Check,
  Trash2,
  Edit2,
  X,
  Download,
  Play,
} from "lucide-react";
import { courseService, lessonService } from "../services/api";
import { useAuth } from "../hooks/useAuth";

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState("courses");
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [showLessonForm, setShowLessonForm] = useState(false);
  const [adminCourses, setAdminCourses] = useState([]);
  const [adminLessons, setAdminLessons] = useState([]);
  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    thumbnail: null,
  });
  const [lessonData, setLessonData] = useState({
    courseId: "",
    title: "",
    position: 0,
    video: null,
    pdf: null,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedPdf, setSelectedPdf] = useState(null);

  useEffect(() => {
    fetchAdminCourses();
  }, []);

  const fetchAdminCourses = async () => {
    try {
      const response = await courseService.getAdminCourses();
      if (response.data.success && Array.isArray(response.data.data)) {
        console.info("[ADMIN] Loaded", response.data.data.length, "courses");
        setAdminCourses(response.data.data);
      } else {
        setAdminCourses([]);
      }
    } catch (err) {
      console.error("Failed to fetch courses:", err);
      setAdminCourses([]);
    }

    try {
      const lessonsResponse = await lessonService.getAdminLessons();
      if (lessonsResponse.data.success && Array.isArray(lessonsResponse.data.data)) {
        console.info("[ADMIN] Loaded", lessonsResponse.data.data.length, "lessons");
        setAdminLessons(lessonsResponse.data.data);
      } else {
        setAdminLessons([]);
      }
    } catch (err) {
      console.error("Failed to fetch lessons:", err);
      setAdminLessons([]);
    }
  };

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
            onClick={() => navigate("/courses")}
            className="btn-primary w-full"
          >
            Go to Courses
          </button>
        </div>
      </div>
    );
  }

  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!courseData.title || !courseData.description) {
      setError("Title and description are required");
      return;
    }

    try {
      setLoading(true);
      console.info("[ADMIN] Creating course:", courseData.title);
      await courseService.createCourse(courseData);
      console.info("[ADMIN] Course created successfully:", courseData.title);
      setSuccess("Course created successfully!");
      setCourseData({ title: "", description: "", thumbnail: null });
      setShowCourseForm(false);
      fetchAdminCourses();
    } catch (err) {
      console.error("[ADMIN] Failed to create course:", err.response?.data?.message);
      setError(err.response?.data?.message || "Failed to create course");
    } finally {
      setLoading(false);
    }
  };

  const handleLessonSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!lessonData.courseId || !lessonData.title || !lessonData.video) {
      setError("Course, title, and video are required");
      return;
    }

    try {
      setLoading(true);
      console.info("[ADMIN] Creating lesson:", lessonData.title, "for course:", lessonData.courseId);
      await lessonService.createLesson(lessonData);
      console.info("[ADMIN] Lesson created successfully:", lessonData.title);
      setSuccess("Lesson created successfully!");
      setLessonData({
        courseId: "",
        title: "",
        position: 0,
        video: null,
        pdf: null,
      });
      setShowLessonForm(false);
      fetchAdminCourses();
    } catch (err) {
      console.error("[ADMIN] Failed to create lesson:", err.response?.data?.message);
      setError(err.response?.data?.message || "Failed to create lesson");
    } finally {
      setLoading(false);
    }
  };

  const handleViewVideo = (videoUrl, title) => {
    setSelectedVideo({ url: videoUrl, title });
  };

  const handleDownloadPdf = (pdfUrl, title) => {
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = `${title}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const closeVideoModal = () => {
    setSelectedVideo(null);
  };

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
            onClick={() => setActiveTab("courses")}
            className={`py-4 px-6 font-semibold border-b-2 transition-colors ${
              activeTab === "courses"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            Manage Courses
          </button>
          <button
            onClick={() => setActiveTab("lessons")}
            className={`py-4 px-6 font-semibold border-b-2 transition-colors ${
              activeTab === "lessons"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
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

        {activeTab === "courses" && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                Manage Courses
              </h2>
              <button
                onClick={() => setShowCourseForm(!showCourseForm)}
                className="btn-primary"
              >
                {showCourseForm ? "Cancel" : "Create Course"}
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
                    {loading ? "Creating..." : "Create Course"}
                  </button>
                </form>
              </div>
            )}

            {/* Courses List */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Your Courses
              </h3>
              {!Array.isArray(adminCourses) || adminCourses.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                  <p className="text-gray-600">
                    No courses yet. Create your first course!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {adminCourses.map((course) => (
                    <div
                      key={course.id}
                      className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
                    >
                      {course.thumbnail && (
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-full h-40 object-cover rounded-t-lg"
                        />
                      )}
                      <div className="p-4">
                        <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                          {course.title}
                        </h4>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {course.description}
                        </p>
                        <div className="flex items-center justify-between text-sm mb-4">
                          <span className="text-gray-500">
                            {Array.isArray(course.lessons) ? course.lessons.length : 0} lessons
                          </span>
                          <span className="text-gray-500">
                            {course.createdAt ? new Date(course.createdAt).toLocaleDateString() : 'N/A'}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <button className="flex-1 btn-secondary text-sm py-2 flex items-center justify-center gap-2">
                            <Edit2 className="w-4 h-4" />
                            Edit
                          </button>
                          <button className="flex-1 bg-red-100 text-red-600 hover:bg-red-200 font-semibold py-2 px-4 rounded text-sm flex items-center justify-center gap-2">
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "lessons" && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                Manage Lessons
              </h2>
              <button
                onClick={() => setShowLessonForm(!showLessonForm)}
                className="btn-primary"
              >
                {showLessonForm ? "Cancel" : "Create Lesson"}
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
                        setLessonData({
                          ...lessonData,
                          courseId: e.target.value,
                        })
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
                    {loading ? "Creating..." : "Create Lesson"}
                  </button>
                </form>
              </div>
            )}

            {/* Lessons List Grouped by Course */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Your Lessons
              </h3>
              {Array.isArray(adminLessons) && adminLessons.length > 0 ? (
                <div className="space-y-8">
                  {Array.isArray(adminCourses) && adminCourses.map((course) => {
                    const courseLessons = adminLessons.filter(
                      (lesson) => lesson.courseId === course.id
                    );

                    if (courseLessons.length === 0) return null;

                    return (
                      <div
                        key={course.id}
                        className="bg-white rounded-lg shadow overflow-hidden"
                      >
                        {/* Course Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              {course.thumbnail && (
                                <img
                                  src={course.thumbnail}
                                  alt={course.title}
                                  className="w-16 h-16 object-cover rounded"
                                />
                              )}
                              <div>
                                <h3 className="font-bold text-white text-lg">
                                  {course.title}
                                </h3>
                                <p className="text-blue-100 text-sm">
                                  {courseLessons.length} lesson
                                  {courseLessons.length !== 1 ? "s" : ""}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Lessons List */}
                        <div className="divide-y">
                          {courseLessons
                            .sort((a, b) => a.position - b.position)
                            .map((lesson) => (
                              <div
                                key={lesson.id}
                                className="p-4 hover:bg-gray-50 transition-colors"
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-3">
                                      <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-semibold text-sm">
                                        {lesson.position}
                                      </span>
                                      <h4 className="font-semibold text-gray-900">
                                        {lesson.title}
                                      </h4>
                                    </div>
                                    <div className="flex gap-3 mt-3 ml-11">
                                      {lesson.videoUrl && (
                                        <button
                                          onClick={() =>
                                            handleViewVideo(
                                              lesson.videoUrl,
                                              lesson.title,
                                            )
                                          }
                                          className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-200 transition-colors flex items-center gap-1"
                                        >
                                          <Play className="w-3 h-3" />
                                          Play
                                        </button>
                                      )}
                                      {lesson.pdfUrl && (
                                        <button
                                          onClick={() =>
                                            handleDownloadPdf(
                                              lesson.pdfUrl,
                                              lesson.title,
                                            )
                                          }
                                          className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded-full hover:bg-red-200 transition-colors flex items-center gap-1"
                                        >
                                          <Download className="w-3 h-3" />
                                          Download
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex gap-2 ml-4">
                                    <button className="btn-secondary p-2 hover:bg-gray-200">
                                      <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button className="bg-red-100 text-red-600 hover:bg-red-200 p-2 rounded">
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                  <p className="text-gray-600">
                    No lessons yet. Create your first lesson!
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">
                {selectedVideo.title}
              </h2>
              <button
                onClick={closeVideoModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* Video Player */}
            <div className="p-6 bg-black flex items-center justify-center aspect-video">
              {selectedVideo.url.includes("youtube") ||
              selectedVideo.url.includes("youtu.be") ? (
                <iframe
                  width="100%"
                  height="100%"
                  src={selectedVideo.url}
                  title={selectedVideo.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              ) : (
                <video
                  controls
                  className="w-full h-full"
                  src={selectedVideo.url}
                >
                  Your browser does not support the video tag.
                </video>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t bg-gray-50 flex justify-end">
              <button
                onClick={closeVideoModal}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
