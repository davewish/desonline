import prisma from "../utils/db.js";

const ALLOWED_ROLES = ["USER", "ADMIN"];

/**
 * List registered users for the admin dashboard, with optional filters.
 * GET /api/admin/users?isActive=false&role=USER&page=1&limit=20
 */
export const getAllUsers = async (req, res) => {
  try {
    const { isActive, role, page = 1, limit = 20 } = req.query;

    const where = {};
    if (isActive !== undefined) {
      where.isActive = isActive === "true";
    }
    if (role) {
      where.role = role;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isActive: true,
          createdAt: true,
          enrollments: true,
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: Number(limit),
      }),
      prisma.user.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error("Failed to fetch users:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};

/**
 * Manually activate a user's account. Lets an admin approve someone even
 * if the activation email never arrived or expired, without needing the
 * user to click a link.
 * PATCH /api/admin/users/:id/approve
 */
export const approveUser = async (req, res) => {
  try {
    const userId = Number(req.params.id);

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isActive) {
      return res.status(200).json({
        success: true,
        message: "User is already active",
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { isActive: true },
      select: { id: true, name: true, email: true, role: true, isActive: true },
    });

    res.status(200).json({
      success: true,
      message: "User approved successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Failed to approve user:", error);
    res.status(500).json({
      success: false,
      message: "Failed to approve user",
    });
  }
};

/**
 * Manually mark an enrollment as paid — for cash, bank transfer, or any
 * payment confirmed outside the app, before a real payment provider is
 * wired up.
 * PATCH /api/admin/enrollments/:id/mark-paid
 */
export const markEnrollmentAsPaid = async (req, res) => {
  try {
    const enrollmentId = Number(req.params.id);

    const enrollment = await prisma.enrollment.findUnique({
      where: { id: enrollmentId },
    });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: "Enrollment not found",
      });
    }

    if (enrollment.paymentStatus === "PAID") {
      return res.status(200).json({
        success: true,
        message: "Enrollment is already marked as paid",
      });
    }

    const updatedEnrollment = await prisma.enrollment.update({
      where: { id: enrollmentId },
      data: {
        paymentStatus: "PAID",
        paidAt: new Date(),
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        course: { select: { id: true, title: true } },
      },
    });

    res.status(200).json({
      success: true,
      message: "Enrollment marked as paid",
      data: updatedEnrollment,
    });
  } catch (error) {
    console.error("Failed to mark enrollment as paid:", error);
    res.status(500).json({
      success: false,
      message: "Failed to mark enrollment as paid",
    });
  }
};

/**
 * Grant a user paid access to a course directly, creating the enrollment
 * if it doesn't already exist. Useful for comps, manual grants, or
 * enrolling someone who paid before ever clicking "enroll" in the app.
 * POST /api/admin/enrollments/grant
 * body: { userId, courseId }
 */
export const grantCourseAccess = async (req, res) => {
  try {
    const { userId, courseId } = req.body;

    if (!userId || !courseId) {
      return res.status(400).json({
        success: false,
        message: "userId and courseId are required",
      });
    }

    const enrollment = await prisma.enrollment.upsert({
      where: {
        userId_courseId: { userId: Number(userId), courseId: Number(courseId) },
      },
      update: { paymentStatus: "PAID", paidAt: new Date() },
      create: {
        userId: Number(userId),
        courseId: Number(courseId),
        paymentStatus: "PAID",
        paidAt: new Date(),
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        course: { select: { id: true, title: true } },
      },
    });

    res.status(200).json({
      success: true,
      message: "Course access granted",
      data: enrollment,
    });
  } catch (error) {
    console.error("Failed to grant course access:", error);
    res.status(500).json({
      success: false,
      message: "Failed to grant course access",
    });
  }
};
export const updateUserRole = async (req, res) => {
  try {
    const userId = Number(req.params.id);
    const { role } = req.body;

    if (!ALLOWED_ROLES.includes(role)) {
      return res.status(400).json({
        success: false,
        message: `Role must be one of: ${ALLOWED_ROLES.join(", ")}`,
      });
    }

    // Prevent an admin from demoting themselves and getting locked out
    // of the admin panel with no other admin to reverse it.
    if (req.user?.userId === userId && role !== "ADMIN") {
      return res.status(400).json({
        success: false,
        message: "You cannot change your own role away from ADMIN",
      });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: { id: true, name: true, email: true, role: true, isActive: true },
    });

    res.status(200).json({
      success: true,
      message: `User role updated to ${role}`,
      data: updatedUser,
    });
  } catch (error) {
    console.error("Failed to update user role:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update user role",
    });
  }
};
