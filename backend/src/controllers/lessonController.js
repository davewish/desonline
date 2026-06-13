import prisma from "../utils/db.js";

/**
 * Get all lessons (Admin only)
 */
export const getAllLessons = async (req, res) => {
  try {
    const lessons = await prisma.lesson.findMany({
      include: {
        course: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      data: lessons,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch lessons",
    });
  }
};

/**
 * Get lesson by ID
 */
export const getLessonById = async (req, res) => {
  try {
    const { id } = req.params;

    const lesson = await prisma.lesson.findUnique({
      where: { id: parseInt(id) },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            description: true,
          },
        },
      },
    });

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      });
    }

    res.status(200).json({
      success: true,
      data: lesson,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch lesson",
    });
  }
};

/**
 * Create lesson (Admin only)
 */
export const createLesson = async (req, res) => {
  try {
    const { courseId, title, position, videoUrl: bodyVideoUrl } = req.body;
    const userId = req.user.userId;

    // Validation
    if (!courseId || !title) {
      return res.status(400).json({
        success: false,
        message: "Course ID and title are required",
      });
    }

    // Check if course exists and user is creator
    const course = await prisma.course.findUnique({
      where: { id: parseInt(courseId) },
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    if (course.creatorId !== userId) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to add lessons to this course",
      });
    }

    let videoUrl = bodyVideoUrl || null;
    let pdfUrl = null;

    if (req.files?.video) {
      videoUrl = `/uploads/videos/${req.files.video[0].filename}`;
    }

    if (req.files?.pdf) {
      pdfUrl = `/uploads/pdfs/${req.files.pdf[0].filename}`;
    }

    const lesson = await prisma.lesson.create({
      data: {
        courseId: parseInt(courseId),
        title,
        videoUrl,
        pdfUrl,
        position: parseInt(position) || 0,
      },
    });

    res.status(201).json({
      success: true,
      message: "Lesson created successfully",
      data: lesson,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to create lesson",
    });
  }
};

/**
 * Update lesson (Admin only)
 */
export const updateLesson = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, position, courseId, videoUrl: bodyVideoUrl } = req.body;
    const userId = req.user.userId;

    const lesson = await prisma.lesson.findUnique({
      where: { id: parseInt(id) },
      include: { course: true },
    });

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      });
    }

    if (lesson.course.creatorId !== userId) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to update this lesson",
      });
    }

    // Prioritize new uploaded file, then body URL (YouTube), otherwise keep existing
    let videoUrl = bodyVideoUrl || lesson.videoUrl;
    let pdfUrl = lesson.pdfUrl;

    if (req.files?.video) {
      videoUrl = `/uploads/videos/${req.files.video[0].filename}`;
    }

    if (req.files?.pdf) {
      pdfUrl = `/uploads/pdfs/${req.files.pdf[0].filename}`;
    }

    const updatedLesson = await prisma.lesson.update({
      where: { id: parseInt(id) },
      data: {
        courseId: courseId ? parseInt(courseId) : lesson.courseId,
        title: title || lesson.title,
        videoUrl,
        pdfUrl,
        position: position !== undefined ? parseInt(position) : lesson.position,
      },
    });

    res.status(200).json({
      success: true,
      message: "Lesson updated successfully",
      data: updatedLesson,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to update lesson",
    });
  }
};

/**
 * Delete lesson (Admin only)
 */
export const deleteLesson = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const lesson = await prisma.lesson.findUnique({
      where: { id: parseInt(id) },
      include: { course: true },
    });

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      });
    }

    if (lesson.course.creatorId !== userId) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to delete this lesson",
      });
    }

    await prisma.lesson.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({
      success: true,
      message: "Lesson deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to delete lesson",
    });
  }
};
