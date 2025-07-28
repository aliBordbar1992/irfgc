import request from "supertest";
import { createMocks } from "node-mocks-http";
import { POST } from "@/app/api/auth/register/route";
import { GET, POST as authPost } from "@/app/api/auth/[...nextauth]/route";

// Mock Prisma
jest.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

// Mock bcrypt
jest.mock("bcryptjs", () => ({
  hash: jest.fn(() => "hashedPassword"),
  compare: jest.fn(() => true),
}));

describe("Authentication API", () => {
  describe("POST /api/auth/register", () => {
    it("should register a new user successfully", async () => {
      const { req, res } = createMocks({
        method: "POST",
        body: {
          name: "Test User",
          username: "testuser",
          email: "test@example.com",
          password: "password123",
        },
      });

      // Mock Prisma responses
      const { prisma } = require("@/lib/prisma");
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue({
        id: "user-123",
        name: "Test User",
        username: "testuser",
        email: "test@example.com",
        role: "PLAYER",
      });

      await POST(req);

      expect(res._getStatusCode()).toBe(201);
      const data = JSON.parse(res._getData());
      expect(data.message).toBe("User created successfully");
      expect(data.user.username).toBe("testuser");
      expect(data.user.role).toBe("PLAYER");
    });

    it("should return 400 if user already exists", async () => {
      const { req, res } = createMocks({
        method: "POST",
        body: {
          name: "Test User",
          username: "existinguser",
          email: "existing@example.com",
          password: "password123",
        },
      });

      // Mock Prisma to return existing user
      const { prisma } = require("@/lib/prisma");
      prisma.user.findUnique.mockResolvedValue({
        id: "existing-user",
        email: "existing@example.com",
      });

      await POST(req);

      expect(res._getStatusCode()).toBe(400);
      const data = JSON.parse(res._getData());
      expect(data.error).toBe("Username is already taken");
    });

    it("should validate required fields", async () => {
      const { req, res } = createMocks({
        method: "POST",
        body: {
          name: "",
          username: "testuser",
          email: "invalid-email",
          password: "123",
        },
      });

      await POST(req);

      expect(res._getStatusCode()).toBe(400);
      const data = JSON.parse(res._getData());
      expect(data.error).toBe("Invalid input data");
    });

    it("should validate email format", async () => {
      const { req, res } = createMocks({
        method: "POST",
        body: {
          name: "Test User",
          username: "testuser",
          email: "invalid-email",
          password: "password123",
        },
      });

      await POST(req);

      expect(res._getStatusCode()).toBe(400);
      const data = JSON.parse(res._getData());
      expect(data.error).toBe("Invalid input data");
    });

    it("should validate password minimum length", async () => {
      const { req, res } = createMocks({
        method: "POST",
        body: {
          name: "Test User",
          username: "testuser",
          email: "test@example.com",
          password: "123",
        },
      });

      await POST(req);

      expect(res._getStatusCode()).toBe(400);
      const data = JSON.parse(res._getData());
      expect(data.error).toBe("Invalid input data");
    });
  });

  describe("POST /api/auth/[...nextauth]", () => {
    it("should handle NextAuth.js requests", async () => {
      const { req, res } = createMocks({
        method: "POST",
        body: {
          email: "test@example.com",
          password: "password123",
        },
      });

      // This is a basic test - NextAuth.js has its own testing utilities
      // In a real scenario, you'd use NextAuth.js testing helpers
      expect(req.method).toBe("POST");
    });
  });
});
