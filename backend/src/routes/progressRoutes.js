import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  upsertLessonProgress,
  getLessonProgress,
  markLessonComplete,
} from "../controllers/progressController.js";

const router = express.Router();

/**
 * Save or update video progress
 */
router.post("/lesson", authMiddleware, upsertLessonProgress);

/**
 * Get resume progress for a lesson
 */
router.get("/lesson/:lessonId", authMiddleware, getLessonProgress);

/**
 * Mark lesson completed manually
 */
router.post("/lesson/:lessonId/complete", authMiddleware, markLessonComplete);

export default router;
