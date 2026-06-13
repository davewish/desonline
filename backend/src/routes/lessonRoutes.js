import express from "express";
import {
  getAllLessons,
  getLessonById,
  createLesson,
  updateLesson,
  deleteLesson,
} from "../controllers/lessonController.js";
import {
  authMiddleware,
  adminMiddleware,
} from "../middlewares/authMiddleware.js";
import { uploadLesson } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

/**
 * GET /api/lessons
 * Get all lessons (admin only)
 */
router.get("/", authMiddleware, adminMiddleware, getAllLessons);

/**
 * GET /api/lessons/:id
 * Get lesson by ID
 */
router.get("/:id", getLessonById);

/**
 * POST /api/lessons
 * Create lesson (admin only)
 */
router.post("/", authMiddleware, adminMiddleware, uploadLesson, createLesson);

/**
 * PUT /api/lessons/:id
 * Update lesson (admin only)
 */
router.put("/:id", authMiddleware, adminMiddleware, uploadLesson, updateLesson);

/**
 * DELETE /api/lessons/:id
 * Delete lesson (admin only)
 */
router.delete("/:id", authMiddleware, adminMiddleware, deleteLesson);

export default router;
