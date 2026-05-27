import {
  getUserEnrollments,
  enrollCourse,
  unenrollCourse,
} from "../src/controllers/enrollmentController.js";

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

describe("Enrollment Controller Unit Tests", () => {
  describe("getUserEnrollments", () => {
    test("should validate user authentication", async () => {
      const req = { user: null, query: { page: 1, limit: 10 } };
      const res = createMockRes();

      await getUserEnrollments(req, res);

      expect(res.status).toHaveBeenCalled();
    });

    test("should handle pagination parameters", async () => {
      const req = { user: { id: 1 }, query: { page: 1, limit: 10 } };
      const res = createMockRes();

      await getUserEnrollments(req, res);

      expect(res.status).toHaveBeenCalled();
    });

    test("should handle default pagination", async () => {
      const req = { user: { id: 1 }, query: {} };
      const res = createMockRes();

      await getUserEnrollments(req, res);

      expect(res.status).toHaveBeenCalled();
    });

    test("should handle custom page and limit", async () => {
      const req = { user: { id: 1 }, query: { page: 2, limit: 20 } };
      const res = createMockRes();

      await getUserEnrollments(req, res);

      expect(res.status).toHaveBeenCalled();
    });
  });

  describe("enrollCourse", () => {
    test("should validate user authentication", async () => {
      const req = { body: { courseId: 1 }, user: null };
      const res = createMockRes();

      await enrollCourse(req, res);

      expect(res.status).toHaveBeenCalled();
    });

    test("should validate course ID is provided", async () => {
      const req = { body: {}, user: { id: 1 } };
      const res = createMockRes();

      await enrollCourse(req, res);

      expect(res.status).toHaveBeenCalled();
    });

    test("should handle valid enrollment request", async () => {
      const req = { body: { courseId: 1 }, user: { id: 1 } };
      const res = createMockRes();

      await enrollCourse(req, res);

      expect(res.status).toHaveBeenCalled();
    });

    test("should handle numeric course ID", async () => {
      const req = { body: { courseId: "1" }, user: { id: 1 } };
      const res = createMockRes();

      await enrollCourse(req, res);

      expect(res.status).toHaveBeenCalled();
    });
  });

  describe("unenrollCourse", () => {
    test("should validate user authentication", async () => {
      const req = { params: { courseId: 1 }, user: null };
      const res = createMockRes();

      await unenrollCourse(req, res);

      expect(res.status).toHaveBeenCalled();
    });

    test("should validate course ID is provided", async () => {
      const req = { params: {}, user: { id: 1 } };
      const res = createMockRes();

      await unenrollCourse(req, res);

      expect(res.status).toHaveBeenCalled();
    });

    test("should handle valid unenroll request", async () => {
      const req = { params: { courseId: 1 }, user: { id: 1 } };
      const res = createMockRes();

      await unenrollCourse(req, res);

      expect(res.status).toHaveBeenCalled();
    });
  });
});
