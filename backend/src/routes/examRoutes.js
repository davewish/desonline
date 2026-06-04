import express from "express";
import {
  getExamById,
  getExamByCourse,
  createExam,
  submitExam,
  getUserExamHistory,
  deleteExam,
} from "../controllers/examController.js";
import {
  authMiddleware,
  adminMiddleware,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * GET /api/exams/course/:courseId
 * Get exam for a course (specific route MUST come first)
 */
router.get("/course/:courseId", getExamByCourse);

/**
 * GET /api/exams/:id
 * Get exam by ID with questions
 */
router.get("/:id", getExamById);

/**
 * POST /api/exams
 * Create exam (admin only)
 */
router.post("/", authMiddleware, adminMiddleware, createExam);

/**
 * POST /api/exams/:examId/submit
 * Submit exam and get score
 */
router.post("/:examId/submit", authMiddleware, submitExam);

/**
 * GET /api/exams/:examId/history
 * Get user's exam history
 */
router.get("/:examId/history", authMiddleware, getUserExamHistory);

/**
 * DELETE /api/exams/:id
 * Delete exam (admin only)
 */
router.delete("/:id", authMiddleware, adminMiddleware, deleteExam);

export default router;
