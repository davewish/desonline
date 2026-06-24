import express from "express";
import {
  authMiddleware,
  adminMiddleware,
} from "../middlewares/authMiddleware.js"; // adjust path to your actual file name
import {
  getAllUsers,
  approveUser,
  updateUserRole,
  markEnrollmentAsPaid,
  grantCourseAccess,
  getAllEnrollments,
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/users", authMiddleware, adminMiddleware, getAllUsers);
router.patch(
  "/users/:id/approve",
  authMiddleware,
  adminMiddleware,
  approveUser,
);
router.patch(
  "/users/:id/role",
  authMiddleware,
  adminMiddleware,
  updateUserRole,
);
router.get("/enrollments", authMiddleware, adminMiddleware, getAllEnrollments);

router.patch(
  "/enrollments/:id/mark-paid",
  authMiddleware,
  adminMiddleware,
  markEnrollmentAsPaid,
);
router.post(
  "/enrollments/grant",
  authMiddleware,
  adminMiddleware,
  grantCourseAccess,
);

export default router;
