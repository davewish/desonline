import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, AlertCircle } from "lucide-react";
import { courseService } from "../services/api";

const CoursesPage = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    fetchCourses();
  }, [search, currentPage]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      console.info("[COURSES] Fetching courses - Page:", currentPage, "Search:", search || "none");
      const response = await courseService.getCourses({
        search: search || undefined,
        page: currentPage,
        limit: 12,
      });
      if (response.data.success) {
        console.info("[COURSES] Loaded", response.data.data.length, "courses");
        setCourses(response.data.data);
        setPagination(response.data.pagination);
      }
    } catch (err) {
      console.error("[COURSES] Failed to fetch courses:", err.response?.data?.message || err.message);
      setError("Failed to load courses. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="container py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Browse Courses
          </h1>
          <p className="text-gray-600 text-lg">
            Discover our collection of courses and start learning today
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white border-b">
        <div className="container py-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search courses..."
              value={search}
              onChange={handleSearch}
              className="input pl-10"
            />
          </div>
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

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading courses...</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No courses found</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {courses.map((course) => (
                <button
                  key={course.id}
                  onClick={() => navigate(`/course/${course.id}`)}
                  className="card overflow-hidden hover:shadow-xl transition-all text-left"
                >
                  {course.thumbnail && (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-40 object-cover"
                    />
                  )}
                  <div className="p-6">
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {course.description}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>{course.lessons.length} Lessons</span>
                      <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                        {course.enrollments.length} Enrolled
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 rounded-lg ${
                        currentPage === page
                          ? "bg-blue-600 text-white"
                          : "border hover:bg-gray-100"
                      }`}
                    >
                      {page}
                    </button>
                  ),
                )}
                <button
                  onClick={() =>
                    setCurrentPage(Math.min(pagination.pages, currentPage + 1))
                  }
                  disabled={currentPage === pagination.pages}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CoursesPage;
