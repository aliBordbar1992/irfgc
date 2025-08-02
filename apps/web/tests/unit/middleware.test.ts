import { NextRequest } from "next/server";
import { middleware } from "@/middleware";

// Mock NextResponse
const mockNextResponse = {
  next: jest.fn(() => ({ type: "next" })),
  redirect: jest.fn((url) => ({ type: "redirect", url })),
  rewrite: jest.fn((url) => ({ type: "rewrite", url })),
};

jest.mock("next/server", () => ({
  NextResponse: mockNextResponse,
}));

describe("Middleware", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("@username pattern", () => {
    it("should rewrite @username URLs to /users/username", () => {
      const request = {
        nextUrl: {
          pathname: "/@testuser",
          clone: () => ({
            pathname: "/@testuser",
          }),
        },
      } as NextRequest;

      middleware(request);

      expect(mockNextResponse.rewrite).toHaveBeenCalledWith(
        expect.objectContaining({
          pathname: "/users/testuser",
        })
      );
    });

    it("should handle @username with dots, dashes, and @ symbols", () => {
      const request = {
        nextUrl: {
          pathname: "/@test.user-name@domain.com",
          clone: () => ({
            pathname: "/@test.user-name@domain.com",
          }),
        },
      } as NextRequest;

      middleware(request);

      expect(mockNextResponse.rewrite).toHaveBeenCalledWith(
        expect.objectContaining({
          pathname: "/users/test.user-name@domain.com",
        })
      );
    });

    it("should not rewrite non-@username paths", () => {
      const request = {
        nextUrl: {
          pathname: "/profile",
          clone: () => ({
            pathname: "/profile",
          }),
        },
      } as NextRequest;

      middleware(request);

      expect(mockNextResponse.rewrite).not.toHaveBeenCalled();
      expect(mockNextResponse.next).toHaveBeenCalled();
    });
  });

  describe("static files and API routes", () => {
    it("should skip middleware for API routes", () => {
      const request = {
        nextUrl: {
          pathname: "/api/users",
        },
      } as NextRequest;

      middleware(request);

      expect(mockNextResponse.next).toHaveBeenCalled();
    });

    it("should skip middleware for static files", () => {
      const request = {
        nextUrl: {
          pathname: "/_next/static/chunks/main.js",
        },
      } as NextRequest;

      middleware(request);

      expect(mockNextResponse.next).toHaveBeenCalled();
    });
  });
});
