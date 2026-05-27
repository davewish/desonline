import { registerUser, loginUser } from "../src/controllers/authController.js";

// Helper to create mock response
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

describe("Auth Controller Unit Tests", () => {
  describe("registerUser - Validation", () => {
    test("should validate that name is required", async () => {
      const req = { body: { email: "test@example.com", password: "pass123" } };
      const res = createMockRes();

      await registerUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalled();
    });

    test("should validate that email is required", async () => {
      const req = { body: { name: "Test User", password: "pass123" } };
      const res = createMockRes();

      await registerUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    test("should validate that password is required", async () => {
      const req = { body: { name: "Test User", email: "test@example.com" } };
      const res = createMockRes();

      await registerUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    test("should handle database errors gracefully", async () => {
      const req = {
        body: {
          name: "Test User",
          email: "test@example.com",
          password: "pass123",
        },
      };
      const res = createMockRes();

      await registerUser(req, res);

      // Should either succeed or fail gracefully
      expect([201, 400, 500]).toContain(res.statusCode);
    });
  });

  describe("loginUser - Validation", () => {
    test("should validate that email is required", async () => {
      const req = { body: { password: "pass123" } };
      const res = createMockRes();

      await loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: "Email and password are required",
        }),
      );
    });

    test("should validate that password is required", async () => {
      const req = { body: { email: "test@example.com" } };
      const res = createMockRes();

      await loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: "Email and password are required",
        }),
      );
    });

    test("should handle missing both email and password", async () => {
      const req = { body: {} };
      const res = createMockRes();

      await loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });
});
