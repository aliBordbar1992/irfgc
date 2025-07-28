import { normalizeUsername, normalizeEmail } from "../../src/lib/normalization";

describe("Normalization Functions", () => {
  describe("normalizeUsername", () => {
    it("should convert username to lowercase", () => {
      expect(normalizeUsername("TestUser")).toBe("testuser");
      expect(normalizeUsername("ADMIN")).toBe("admin");
      expect(normalizeUsername("MixedCase123")).toBe("mixedcase123");
    });

    it("should trim whitespace", () => {
      expect(normalizeUsername("  testuser  ")).toBe("testuser");
      expect(normalizeUsername("\ttestuser\n")).toBe("testuser");
    });

    it("should handle empty strings", () => {
      expect(normalizeUsername("")).toBe("");
    });
  });

  describe("normalizeEmail", () => {
    it("should convert email to lowercase", () => {
      expect(normalizeEmail("Test@Example.COM")).toBe("test@example.com");
      expect(normalizeEmail("USER@DOMAIN.ORG")).toBe("user@domain.org");
    });

    it("should trim whitespace", () => {
      expect(normalizeEmail("  test@example.com  ")).toBe("test@example.com");
      expect(normalizeEmail("\ttest@example.com\n")).toBe("test@example.com");
    });

    it("should handle null and undefined", () => {
      expect(normalizeEmail(null)).toBe(null);
      expect(normalizeEmail(undefined)).toBe(null);
      expect(normalizeEmail("")).toBe(null);
    });

    it("should handle empty string", () => {
      expect(normalizeEmail("")).toBe(null);
    });
  });
});
