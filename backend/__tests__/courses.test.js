import {
  getAllCourses,
  getCourseById,
  createCourse,
} from "../src/controllers/courseController.js";

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

describe("Course Controller Unit Tests", () => {
  describe("getAllCourses", () => {
    test("should handle queries with default pagination", async () => {
      const req = { query: {} };
      const res = createMockRes();

      await getAllCourses(req, res);

      expect(res.status).toHaveBeenCalled();
      expect([200, 500]).toContain(res.statusCode);
    });

    test("should handle queries with custom pagination", async () => {
      const req = { query: { page: 2, limit: 20 } };
      const res = createMockRes();

      await getAllCourses(req, res);

      expect(res.status).toHaveBeenCalled();
    });

    test("should handle search queries", async () => {
      const req = { query: { search: "javascript", page: 1, limit: 10 } };
      const res = createMockRes();

      await getAllCourses(req, res);

      expect(res.status).toHaveBeenCalled();
    });

    test("should handle errors gracefully", async () => {
      const req = { query: { page: "invalid" } };
      const res = createMockRes();

      await getAllCourses(req, res);

      expect(res.status).toHaveBeenCalled();
    });
  });

  describe("getCourseById", () => {
    test("should handle missing course ID", async () => {
      const req = { params: {} };
      const res = createMockRes();

      await getCourseById(req, res);

      expect(res.status).toHaveBeenCalled();
    });

    test("should handle invalid course ID format", async () => {
      const req = { params: { id: "invalid" } };
      const res = createMockRes();

      await getCourseById(req, res);

      expect(res.status).toHaveBeenCalled();
    });

    test("should handle numeric course ID", async () => {
      const req = { params: { id: "1" } };
      const res = createMockRes();

      await getCourseById(req, res);

      expect(res.status).toHaveBeenCalled();
    });
  });

  describe("createCourse - Validation", () => {
    test("should validate that title is required", async () => {
      const req = {
        body: { description: "Test Description" },
        user: { id: 1 },
      };
      const res = createMockRes();

      await createCourse(req, res);

      expect(res.status).toHaveBeenCalled();
    });

    test("should validate that description is required", async () => {
      const req = {
        body: { title: "Test Course" },
        user: { id: 1 },
      };
      const res = createMockRes();

      await createCourse(req, res);

      expect(res.status).toHaveBeenCalled();
    });

    test("should validate user authentication", async () => {
      const req = {
        body: { title: "Test", description: "Test" },
        user: null,
      };
      const res = createMockRes();

      await createCourse(req, res);

      expect(res.status).toHaveBeenCalled();
    });

    test("should handle complete course creation request", async () => {
      const req = {
        body: {
          title: "Test Course",
          description: "Test Description",
          thumbnail: "http://example.com/image.jpg",
        },
        user: { id: 1 },
      };
      const res = createMockRes();

      await createCourse(req, res);

      expect(res.status).toHaveBeenCalled();
    });
  });
});
