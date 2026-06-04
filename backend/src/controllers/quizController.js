import prisma from "../utils/db.js";

/**
 * Get quiz by ID with questions
 */
export const getQuizById = async (req, res) => {
  try {
    const { id } = req.params;

    const quiz = await prisma.quiz.findUnique({
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
        lesson: {
          select: {
            id: true,
            title: true,
            courseId: true,
          },
        },
      },
    });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    res.status(200).json({
      success: true,
      data: quiz,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch quiz",
    });
  }
};

/**
 * Get quizzes for a lesson
 */
export const getQuizzesByLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;

    const quizzes = await prisma.quiz.findMany({
      where: { lessonId: parseInt(lessonId) },
      include: {
        questions: {
          select: { id: true },
        },
      },
    });

    res.status(200).json({
      success: true,
      data: quizzes,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch quizzes",
    });
  }
};

/**
 * Create quiz (Admin only)
 */
export const createQuiz = async (req, res) => {
  try {
    const { lessonId, title, description, questions } = req.body;
    const userId = req.user.userId;

    // Validation
    if (!lessonId || !title || !questions || questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Lesson ID, title, and questions are required",
      });
    }

    // Check if lesson exists and user is course creator
    const lesson = await prisma.lesson.findUnique({
      where: { id: parseInt(lessonId) },
      include: {
        course: {
          select: { creatorId: true },
        },
      },
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
        message: "You do not have permission to create quizzes for this lesson",
      });
    }

    // Create quiz with questions
    const quiz = await prisma.quiz.create({
      data: {
        title,
        description: description || null,
        lessonId: parseInt(lessonId),
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
      message: "Quiz created successfully",
      data: quiz,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to create quiz",
    });
  }
};

/**
 * Submit quiz and calculate score
 */
export const submitQuiz = async (req, res) => {
  try {
    const { quizId, answers } = req.body;
    const userId = req.user.userId;

    if (!quizId || !answers) {
      return res.status(400).json({
        success: false,
        message: "Quiz ID and answers are required",
      });
    }

    // Get quiz with all questions
    const quiz = await prisma.quiz.findUnique({
      where: { id: parseInt(quizId) },
      include: {
        questions: {
          orderBy: { position: "asc" },
        },
      },
    });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    // Calculate score
    let correctCount = 0;
    quiz.questions.forEach((q) => {
      if (answers[q.id.toString()] === q.correctAnswer) {
        correctCount++;
      }
    });
    const score = Math.round((correctCount / quiz.questions.length) * 100);

    // Save quiz result
    const userQuiz = await prisma.userQuiz.upsert({
      where: {
        userId_quizId: {
          userId,
          quizId: parseInt(quizId),
        },
      },
      create: {
        userId,
        quizId: parseInt(quizId),
        score,
        answers: JSON.stringify(answers),
        completed: true,
        attempts: 1,
      },
      update: {
        score,
        answers: JSON.stringify(answers),
        completed: true,
        attempts: {
          increment: 1,
        },
        completedAt: new Date(),
      },
    });

    res.status(200).json({
      success: true,
      message: "Quiz submitted successfully",
      data: {
        score,
        correctAnswers: correctCount,
        totalQuestions: quiz.questions.length,
        attempts: userQuiz.attempts,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to submit quiz",
    });
  }
};

/**
 * Get user's quiz history
 */
export const getUserQuizHistory = async (req, res) => {
  try {
    const { quizId } = req.params;
    const userId = req.user.userId;

    const userQuiz = await prisma.userQuiz.findUnique({
      where: {
        userId_quizId: {
          userId,
          quizId: parseInt(quizId),
        },
      },
      include: {
        quiz: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    if (!userQuiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz attempt not found",
      });
    }

    res.status(200).json({
      success: true,
      data: userQuiz,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch quiz history",
    });
  }
};

/**
 * Delete quiz (Admin only)
 */
export const deleteQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // Check if quiz exists and user is course creator
    const quiz = await prisma.quiz.findUnique({
      where: { id: parseInt(id) },
      include: {
        lesson: {
          include: {
            course: {
              select: { creatorId: true },
            },
          },
        },
      },
    });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    if (quiz.lesson.course.creatorId !== userId) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to delete this quiz",
      });
    }

    await prisma.quiz.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({
      success: true,
      message: "Quiz deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to delete quiz",
    });
  }
};
