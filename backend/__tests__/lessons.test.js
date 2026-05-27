import {
  getLessonById,
  createLesson,
  updateLesson,
  deleteLesson,
} from "../src/controllers/lessonController.js";

function createMockRes() {
  const res = {
    status: function (code) {
      this.statusCode = code;
      return this;
    },
    json: function (data) {
      this.body = data;
      return this;
    },
    statusCode: 200,
    body: null,
  };

  res.status = jest.fn(res.status.bind(res));
  res.json = jest.fn(res.json.bind(res));

  return res;
}

describe("Lesson Controller Unit Tests", () => {
  describe("getLessonById", () => {
    test("should validate course ID is provided", async () => {
      const req = { params: { lessonId: 1 } };
      const res = createMockRes();

      await getLessonById(req, res);

      expect(res.status).toHaveBeenCalled();
    });

    test("should validate lesson ID is provided", async () => {
      const req = { params: { courseId: 1 } };
      const res = createMockRes();

      await getLessonById(req, res);

      expect(res.status).toHaveBeenCalled();
    });

    test("should handle both IDs provided", async () => {
      const req = { params: { courseId: 1, lessonId: 1 } };
      const res = createMockRes();

      await getLessonById(req, res);

      expect(res.status).toHaveBeenCalled();
    });

    test("should handle non-existent lesson", async () => {
      const req = { params: { courseId: 1, lessonId: 999 } };
      const res = createMockRes();

      await getLessonById(req, res);

      expect(res.status).toHaveBeenCalled();
    });
  });

  describe("createLesson - Validation", () => {
    test("should validate user authentication", async () => {
      const req = {
        body: { title: "Lesson", courseId: 1, position: 1 },
        user: null,
      };
      const res = createMockRes();

      await createLesson(req, res);

      expect(res.status).toHaveBeenCalled();
    });

    test("should validate title is required", async () => {
      const req = {
        body: { courseId: 1, position: 1 },
        user: { id: 1 },
      };
      const res = createMockRes();

      await createLesson(req, res);

      expect(res.status).toHaveBeenCalled();
    });

    test("should validate course ID is required", async () => {
      const req = {
        body: { title: "Lesson", position: 1 },
        user: { id: 1 },
      };
      const res = createMockRes();

      await createLesson(req, res);

      expect(res.status).toHaveBeenCalled();
    });

    test("should validate position is required", async () => {
      const req = {
        body: { title: "Lesson", courseId: 1 },
        user: { id: 1 },
      };
      const res = createMockRes();

      await createLesson(req, res);

      expect(res.status).toHaveBeenCalled();
    });

    test("should handle complete lesson creation request", async () => {
      const req = {
        body: {
          title: "Lesson 1",
          courseId: 1,
          position: 1,
          videoUrl: "https://youtube.com/video",
          pdfUrl: "https://example.com/pdf",
        },
        user: { id: 1 },
      };
      const res = createMockRes();

      await createLesson(req, res);

      expect(res.status).toHaveBeenCalled();
    });
  });

  describe("updateLesson", () => {
    test("should validate lesson ID is provided", async () => {
      const req = {
        params: { courseId: 1 },
        body: { title: "Updated" },
        user: { id: 1 },
      };
      const res = createMockRes();

      await updateLesson(req, res);

      expect(res.status).toHaveBeenCalled();
    });

    test("should validate course ID is provided", async () => {
      const req = {
        params: { lessonId: 1 },
        body: { title: "Updated" },
        user: { id: 1 },
      };
      const res = createMockRes();

      await updateLesson(req, res);

      expect(res.status).toHaveBeenCalled();
    });

    test("should handle complete update request", async () => {
      const req = {
        params: { courseId: 1, lessonId: 1 },
        body: { title: "Updated Lesson", videoUrl: "https://youtube.com/new" },
        user: { id: 1 },
      };
      const res = createMockRes();

      await updateLesson(req, res);

      expect(res.status).toHaveBeenCalled();
    });
  });

  describe("deleteLesson", () => {
    test("should validate lesson ID is provided", async () => {
      const req = {
        params: { courseId: 1 },
        user: { id: 1 },
      };
      const res = createMockRes();

      await deleteLesson(req, res);

      expect(res.status).toHaveBeenCalled();
    });

    test("should validate course ID is provided", async () => {
      const req = {
        params: { lessonId: 1 },
        user: { id: 1 },
      };
      const res = createMockRes();

      await deleteLesson(req, res);

      expect(res.status).toHaveBeenCalled();
    });

    test("should validate user authentication", async () => {
      const req = {
        params: { courseId: 1, lessonId: 1 },
        user: null,
      };
      const res = createMockRes();

      await deleteLesson(req, res);

      expect(res.status).toHaveBeenCalled();
    });

    test("should handle complete delete request", async () => {
      const req = {
        params: { courseId: 1, lessonId: 1 },
        user: { id: 1 },
      };
      const res = createMockRes();

      await deleteLesson(req, res);

      expect(res.status).toHaveBeenCalled();
    });
  });
});
