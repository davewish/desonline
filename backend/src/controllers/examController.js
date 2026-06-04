import prisma from "../utils/db.js";

/**
 * Get exam by ID with questions
 */
export const getExamById = async (req, res) => {
  try {
    const { id } = req.params;

    const exam = await prisma.exam.findUnique({
      where: { id: parseInt(id) },
      include: {
        questions: {
          orderBy: { position: "asc" },
          select: {
            id: true,
            text: true,
            options: true,
            position: true,
            // Don't send correctAnswer to frontend
          },
        },
        course: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found",
      });
    }

    res.status(200).json({
      success: true,
      data: exam,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch exam",
    });
  }
};

/**
 * Get exam for a course
 */
export const getExamByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const exam = await prisma.exam.findFirst({
      where: { courseId: parseInt(courseId) },
      include: {
        questions: {
          select: { id: true },
        },
      },
    });

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found for this course",
      });
    }

    res.status(200).json({
      success: true,
      data: exam,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch exam",
    });
  }
};

/**
 * Create exam (Admin only)
 */
export const createExam = async (req, res) => {
  try {
    const { courseId, title, description, passingScore, questions } = req.body;
    const userId = req.user.userId;

    // Validation
    if (!courseId || !title || !questions || questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Course ID, title, and questions are required",
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
        message: "You do not have permission to create exams for this course",
      });
    }

    // Create exam with questions
    const exam = await prisma.exam.create({
      data: {
        title,
        description: description || null,
        courseId: parseInt(courseId),
        passingScore: passingScore || 70,
        questions: {
          create: questions.map((q, index) => ({
            text: q.text,
            options: q.options,
            correctAnswer: q.correctAnswer,
            position: index,
          })),
        },
      },
      include: {
        questions: {
          orderBy: { position: "asc" },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: "Exam created successfully",
      data: exam,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to create exam",
    });
  }
};

/**
 * Submit exam and calculate score
 */
export const submitExam = async (req, res) => {
  try {
    const { examId, answers } = req.body;
    const userId = req.user.userId;

    if (!examId || !answers) {
      return res.status(400).json({
        success: false,
        message: "Exam ID and answers are required",
      });
    }

    // Get exam with all questions
    const exam = await prisma.exam.findUnique({
      where: { id: parseInt(examId) },
      include: {
        questions: {
          orderBy: { position: "asc" },
        },
      },
    });

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found",
      });
    }

    // Calculate score
    let correctCount = 0;
    exam.questions.forEach((q) => {
      if (answers[q.id.toString()] === q.correctAnswer) {
        correctCount++;
      }
    });
    const score = Math.round((correctCount / exam.questions.length) * 100);
    const passed = score >= exam.passingScore;

    // Save exam result
    const userExam = await prisma.userExam.upsert({
      where: {
        userId_examId: {
          userId,
          examId: parseInt(examId),
        },
      },
      create: {
        userId,
        examId: parseInt(examId),
        score,
        answers: JSON.stringify(answers),
        passed,
        attempts: 1,
      },
      update: {
        score,
        answers: JSON.stringify(answers),
        passed,
        attempts: {
          increment: 1,
        },
        completedAt: new Date(),
      },
    });

    res.status(200).json({
      success: true,
      message: "Exam submitted successfully",
      data: {
        score,
        correctAnswers: correctCount,
        totalQuestions: exam.questions.length,
        passed,
        passingScore: exam.passingScore,
        attempts: userExam.attempts,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to submit exam",
    });
  }
};

/**
 * Get user's exam history
 */
export const getUserExamHistory = async (req, res) => {
  try {
    const { examId } = req.params;
    const userId = req.user.userId;

    const userExam = await prisma.userExam.findUnique({
      where: {
        userId_examId: {
          userId,
          examId: parseInt(examId),
        },
      },
      include: {
        exam: {
          select: {
            id: true,
            title: true,
            passingScore: true,
          },
        },
      },
    });

    if (!userExam) {
      return res.status(404).json({
        success: false,
        message: "Exam attempt not found",
      });
    }

    res.status(200).json({
      success: true,
      data: userExam,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch exam history",
    });
  }
};

/**
 * Delete exam (Admin only)
 */
export const deleteExam = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // Check if exam exists and user is course creator
    const exam = await prisma.exam.findUnique({
      where: { id: parseInt(id) },
      include: {
        course: {
          select: { creatorId: true },
        },
      },
    });

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found",
      });
    }

    if (exam.course.creatorId !== userId) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to delete this exam",
      });
    }

    await prisma.exam.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({
      success: true,
      message: "Exam deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to delete exam",
    });
  }
};
