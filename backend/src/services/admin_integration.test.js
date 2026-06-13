import request from "supertest";
import app from "../index.js"; // Assuming your Express app is exported from index.js

/**
 * Admin Dashboard Integration Tests
 * Verifies: Create, Edit, Delete for Courses and Lessons
 */
describe("Admin Dashboard Integration", () => {
  let adminToken;
  let testCourseId;
  let testLessonId;

  beforeAll(async () => {
    // Login as admin to get token
    const res = await request(app).post("/api/auth/login").send({
      email: "admin@desonline.com",
      password: "admin123",
    });
    adminToken = res.body.data.token;
  });

  describe("Course Management", () => {
    test("POST /api/courses - Create Course with Thumbnail", async () => {
      const res = await request(app)
        .post("/api/courses")
        .set("Authorization", `Bearer ${adminToken}`)
        .field("title", "Integration Test Course")
        .field("description", "Testing admin create functionality")
        .attach("thumbnail", Buffer.from("fake-image"), "test.jpg");

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeDefined();
      testCourseId = res.body.data.id;
      // Ensure thumbnail path was generated correctly
      expect(res.body.data.thumbnail).toMatch(/^\/uploads\/thumbnails\//);
    });

    test("PUT /api/courses/:id - Edit Course", async () => {
      const res = await request(app)
        .put(`/api/courses/${testCourseId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .field("title", "Updated Integration Test Course");

      expect(res.status).toBe(200);
      expect(res.body.data.title).toBe("Updated Integration Test Course");
    });
  });

  describe("Lesson Management", () => {
    test("POST /api/lessons - Create Lesson with Video", async () => {
      const res = await request(app)
        .post("/api/lessons")
        .set("Authorization", `Bearer ${adminToken}`)
        .field("courseId", testCourseId)
        .field("title", "Test Lesson 1")
        .field("position", 1)
        .attach("video", Buffer.from("fake-video"), "test.mp4");

      expect(res.status).toBe(201);
      testLessonId = res.body.data.id;
      // Check that video path is stored
      expect(res.body.data.videoUrl).toBeDefined();
    });

    test("PUT /api/lessons/:id - Edit Lesson", async () => {
      const res = await request(app)
        .put(`/api/lessons/${testLessonId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .field("title", "Updated Lesson Title");

      expect(res.status).toBe(200);
      expect(res.body.data.title).toBe("Updated Lesson Title");
    });
  });

  describe("Cleanup (Delete)", () => {
    test("DELETE /api/lessons/:id - Delete Lesson", async () => {
      const res = await request(app)
        .delete(`/api/lessons/${testLessonId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    test("DELETE /api/courses/:id - Delete Course", async () => {
      const res = await request(app)
        .delete(`/api/courses/${testCourseId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});
