import prisma from "../utils/db.js";

export const upsertLessonProgress = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { courseId, lessonId, currentTime, duration } = req.body;

    if (!courseId || !lessonId) {
      return res.status(400).json({
        success: false,
        message: "courseId and lessonId are required",
      });
    }

    const progress = await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId,
          lessonId: parseInt(lessonId),
        },
      },
      update: {
        currentTime: currentTime ?? 0,
        duration: duration ?? 0,
        lastWatchedAt: new Date(),
      },
      create: {
        userId,
        courseId: parseInt(courseId),
        lessonId: parseInt(lessonId),
        currentTime: currentTime ?? 0,
        duration: duration ?? 0,
      },
    });

    res.json({
      success: true,
      data: progress,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to save progress",
    });
  }
};

export const getLessonProgress = async (req, res) => {
  try {
    const userId = req.user.userId;
    const lessonId = parseInt(req.params.lessonId);

    const progress = await prisma.lessonProgress.findUnique({
      where: {
        userId_lessonId: {
          userId,
          lessonId,
        },
      },
    });

    res.json({
      success: true,
      data: progress || null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch progress",
    });
  }
};

export const markLessonComplete = async (req, res) => {
  try {
    const userId = req.user.userId;
    const lessonId = parseInt(req.params.lessonId);

    const progress = await prisma.lessonProgress.update({
      where: {
        userId_lessonId: {
          userId,
          lessonId,
        },
      },
      data: {
        completed: true,
        currentTime: 0,
        lastWatchedAt: new Date(),
      },
    });

    res.json({
      success: true,
      data: progress,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to mark complete",
    });
  }
};
