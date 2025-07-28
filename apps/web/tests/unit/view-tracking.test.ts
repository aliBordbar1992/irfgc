import { computeDedupHash, formatViewCount } from "@/lib/utils";

describe("View Tracking Utilities", () => {
  describe("computeDedupHash", () => {
    it("generates consistent hashes for same inputs", () => {
      const hash1 = computeDedupHash(
        "news-123",
        "NEWS_POST",
        "user123",
        null,
        "192.168.1.1",
        "Mozilla/5.0"
      );
      const hash2 = computeDedupHash(
        "news-123",
        "NEWS_POST",
        "user123",
        null,
        "192.168.1.1",
        "Mozilla/5.0"
      );
      expect(hash1).toBe(hash2);
    });

    it("generates different hashes for different content", () => {
      const hash1 = computeDedupHash(
        "news-123",
        "NEWS_POST",
        "user123",
        null,
        "192.168.1.1",
        "Mozilla/5.0"
      );
      const hash2 = computeDedupHash(
        "news-456",
        "NEWS_POST",
        "user123",
        null,
        "192.168.1.1",
        "Mozilla/5.0"
      );
      expect(hash1).not.toBe(hash2);
    });

    it("generates different hashes for different content types", () => {
      const hash1 = computeDedupHash(
        "content-123",
        "NEWS_POST",
        "user123",
        null,
        "192.168.1.1",
        "Mozilla/5.0"
      );
      const hash2 = computeDedupHash(
        "content-123",
        "EVENT",
        "user123",
        null,
        "192.168.1.1",
        "Mozilla/5.0"
      );
      expect(hash1).not.toBe(hash2);
    });

    it("generates different hashes for different users", () => {
      const hash1 = computeDedupHash(
        "news-123",
        "NEWS_POST",
        "user123",
        null,
        "192.168.1.1",
        "Mozilla/5.0"
      );
      const hash2 = computeDedupHash(
        "news-123",
        "NEWS_POST",
        "user456",
        null,
        "192.168.1.1",
        "Mozilla/5.0"
      );
      expect(hash1).not.toBe(hash2);
    });

    it("prioritizes userId over anonId", () => {
      const hash1 = computeDedupHash(
        "news-123",
        "NEWS_POST",
        "user123",
        "anon456",
        "192.168.1.1",
        "Mozilla/5.0"
      );
      const hash2 = computeDedupHash(
        "news-123",
        "NEWS_POST",
        "user123",
        "anon789",
        "192.168.1.1",
        "Mozilla/5.0"
      );
      expect(hash1).toBe(hash2);
    });

    it("uses anonId when userId is null", () => {
      const hash1 = computeDedupHash(
        "news-123",
        "NEWS_POST",
        null,
        "anon456",
        "192.168.1.1",
        "Mozilla/5.0"
      );
      const hash2 = computeDedupHash(
        "news-123",
        "NEWS_POST",
        null,
        "anon456",
        "192.168.1.1",
        "Mozilla/5.0"
      );
      expect(hash1).toBe(hash2);
    });

    it("uses IP when both userId and anonId are null", () => {
      const hash1 = computeDedupHash(
        "news-123",
        "NEWS",
        null,
        null,
        "192.168.1.1",
        "Mozilla/5.0"
      );
      const hash2 = computeDedupHash(
        "news-123",
        "NEWS",
        null,
        null,
        "192.168.1.1",
        "Mozilla/5.0"
      );
      expect(hash1).toBe(hash2);
    });
  });

  describe("formatViewCount", () => {
    it("formats numbers less than 1000 correctly", () => {
      expect(formatViewCount(0)).toBe("0");
      expect(formatViewCount(123)).toBe("123");
      expect(formatViewCount(999)).toBe("999");
    });

    it("formats numbers between 1000 and 999999 correctly", () => {
      expect(formatViewCount(1000)).toBe("1.0K");
      expect(formatViewCount(1500)).toBe("1.5K");
      expect(formatViewCount(12345)).toBe("12.3K");
      expect(formatViewCount(999999)).toBe("1000.0K");
    });

    it("formats numbers 1000000 and above correctly", () => {
      expect(formatViewCount(1000000)).toBe("1.0M");
      expect(formatViewCount(1500000)).toBe("1.5M");
      expect(formatViewCount(12345678)).toBe("12.3M");
    });

    it("handles decimal precision correctly", () => {
      expect(formatViewCount(1234)).toBe("1.2K");
      expect(formatViewCount(1236)).toBe("1.2K");
      expect(formatViewCount(1234567)).toBe("1.2M");
    });
  });
});
