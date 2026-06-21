import axios from "axios";
import { storage } from "../utils/storage";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5555/api";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = storage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Handle responses
api.interceptors.response.use(
  (response) => {
    // Log successful mutations (POST, PUT, DELETE)
    if (
      ["post", "put", "delete"].includes(response.config.method?.toLowerCase())
    ) {
      console.info(
        `[API] ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`,
      );
    }
    return response;
  },
  (error) => {
    console.error(
      "API Response Error:",
      error.response?.status,
      error.config?.url,
      error.response?.data,
    );
    // Only redirect to login on 401 if NOT the login endpoint itself
    if (
      error.response?.status === 401 &&
      !error.config?.url?.includes("/auth/login")
    ) {
      storage.removeItem("token");
      // Don't use window.location.href - let the app handle the navigation
    }
    return Promise.reject(error);
  },
);

// Auth services
export const authService = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  getProfile: () => api.get("/auth/profile"),
  activate: (token) => api.post("/auth/activate", { token }),
};

// Course services
export const courseService = {
  getCourses: (params) => api.get("/courses", { params }),
  getCourseById: (id) => api.get(`/courses/${id}`),
  getAdminCourses: (params) => api.get("/courses", { params }),
  createCourse: (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    if (data.thumbnail) formData.append("thumbnail", data.thumbnail);
    return api.post("/courses", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  updateCourse: (id, data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    if (data.thumbnail) formData.append("thumbnail", data.thumbnail);
    return api.put(`/courses/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  deleteCourse: (id) => api.delete(`/courses/${id}`),
};

// Lesson services
export const lessonService = {
  getLessonById: (id) => api.get(`/lessons/${id}`),
  getAdminLessons: (params) => api.get("/lessons", { params }),
  createLesson: (data) => {
    const formData = new FormData();
    formData.append("courseId", data.courseId);
    formData.append("title", data.title);
    formData.append("position", data.position || 0);
    if (data.videoType === "youtube") {
      formData.append("videoUrl", data.videoUrl);
    } else if (data.video) {
      formData.append("video", data.video);
    }
    if (data.pdf) formData.append("pdf", data.pdf);
    return api.post("/lessons", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  updateLesson: (id, data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("position", data.position);
    if (data.videoType === "youtube") {
      formData.append("videoUrl", data.videoUrl);
    } else if (data.video) {
      formData.append("video", data.video);
    }
    if (data.pdf) formData.append("pdf", data.pdf);
    return api.put(`/lessons/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  deleteLesson: (id) => api.delete(`/lessons/${id}`),
};

// Enrollment services
export const enrollmentService = {
  getUserEnrollments: () => api.get("/enrollments"),
  enrollCourse: (courseId) => api.post("/enrollments", { courseId }),
  unenrollCourse: (enrollmentId) => api.delete(`/enrollments/${enrollmentId}`),
};

// Quiz services
export const quizService = {
  getQuizById: (id) => api.get(`/quizzes/${id}`),
  getQuizzesByLesson: (lessonId) => api.get(`/quizzes/lesson/${lessonId}`),
  createQuiz: (data) => api.post("/quizzes", data),
  submitQuiz: (quizId, answers) =>
    api.post(`/quizzes/${quizId}/submit`, { quizId, answers }),
  getUserQuizHistory: (quizId) => api.get(`/quizzes/${quizId}/history`),
  deleteQuiz: (id) => api.delete(`/quizzes/${id}`),
};

// Exam services
export const examService = {
  getExamById: (id) => api.get(`/exams/${id}`),
  getExamByCourse: (courseId) => api.get(`/exams/course/${courseId}`),
  createExam: (data) => api.post("/exams", data),
  submitExam: (examId, answers) =>
    api.post(`/exams/${examId}/submit`, { examId, answers }),
  getUserExamHistory: (examId) => api.get(`/exams/${examId}/history`),
  deleteExam: (id) => api.delete(`/exams/${id}`),
};
export const adminService = {
  getUsers: () => api.get(`/admin/users`),
  approveUser: (userId) => api.patch(`/admin/users/${userId}/approve`),
  updateUserRole: (userId, newRole) =>
    api.patch(`/admin/users/${userId}/role`, { role: newRole }),
  getEnrollments: (params) => api.get("/admin/enrollments", { params }),
  markEnrollmentPaid: (id) => api.patch(`/admin/enrollments/${id}/mark-paid`),
  grantCourseAccess: (userId, courseId) =>
    api.post("/admin/enrollments/grant", { userId, courseId }),
};
export default api;
