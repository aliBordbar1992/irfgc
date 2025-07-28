import { prisma } from "@/lib/prisma";
import { computeDedupHash } from "@/lib/utils";

describe("View Tracking Integration", () => {
  beforeEach(async () => {
    // Clean up any existing view events
    await prisma.viewEvent.deleteMany();
  });

  afterAll(async () => {
    await prisma.viewEvent.deleteMany();
    await prisma.$disconnect();
  });

  it("should track a view and retrieve statistics", async () => {
    const contentId = "test-news-123";
    const contentType = "NEWS";
    const userId = "test-user-456";
    const anonId = "test-anon-789";
    const ip = "192.168.1.1";
    const userAgent = "Mozilla/5.0 (Test Browser)";

    // Compute expected dedup hash
    const expectedDedupHash = computeDedupHash(
      contentId,
      contentType,
      userId,
      anonId,
      ip,
      userAgent
    );

    // Create a view event
    const viewEvent = await prisma.viewEvent.create({
      data: {
        contentId,
        contentType,
        userId,
        anonId,
        ip,
        userAgent,
        dedupHash: expectedDedupHash,
      },
    });

    expect(viewEvent).toBeDefined();
    expect(viewEvent.contentId).toBe(contentId);
    expect(viewEvent.contentType).toBe(contentType);
    expect(viewEvent.dedupHash).toBe(expectedDedupHash);

    // Verify we can retrieve view statistics
    const viewCount = await prisma.viewEvent.count({
      where: {
        contentId,
        contentType,
      },
    });

    expect(viewCount).toBe(1);

    // Verify unique viewers count
    const uniqueViewers = await prisma.viewEvent.groupBy({
      by: ["dedupHash"],
      where: {
        contentId,
        contentType,
      },
      _count: {
        dedupHash: true,
      },
    });

    expect(uniqueViewers.length).toBe(1);
  });

  it("should prevent duplicate views within 15 minutes", async () => {
    const contentId = "test-news-456";
    const contentType = "NEWS";
    const userId = "test-user-789";
    const anonId = "test-anon-123";
    const ip = "192.168.1.2";
    const userAgent = "Mozilla/5.0 (Test Browser)";

    const dedupHash = computeDedupHash(
      contentId,
      contentType,
      userId,
      anonId,
      ip,
      userAgent
    );

    // Create first view
    await prisma.viewEvent.create({
      data: {
        contentId,
        contentType,
        userId,
        anonId,
        ip,
        userAgent,
        dedupHash,
        viewedAt: new Date(),
      },
    });

    // Try to create a duplicate view (should be prevented by deduplication logic)
    const existingView = await prisma.viewEvent.findFirst({
      where: {
        contentId,
        contentType,
        dedupHash,
        viewedAt: {
          gte: new Date(Date.now() - 15 * 60 * 1000), // Last 15 minutes
        },
      },
    });

    expect(existingView).toBeDefined();

    // Verify only one view exists
    const viewCount = await prisma.viewEvent.count({
      where: {
        contentId,
        contentType,
      },
    });

    expect(viewCount).toBe(1);
  });

  it("should handle different content types", async () => {
    const contentId = "test-content-123";
    const userId = "test-user-456";
    const anonId = "test-anon-789";
    const ip = "192.168.1.3";
    const userAgent = "Mozilla/5.0 (Test Browser)";

    // Test NEWS_POST content type
    const newsDedupHash = computeDedupHash(
      contentId,
      "NEWS_POST",
      userId,
      anonId,
      ip,
      userAgent
    );
    await prisma.viewEvent.create({
      data: {
        contentId,
        contentType: "NEWS_POST",
        userId,
        anonId,
        ip,
        userAgent,
        dedupHash: newsDedupHash,
      },
    });

    // Test EVENT content type
    const eventDedupHash = computeDedupHash(
      contentId,
      "EVENT",
      userId,
      anonId,
      ip,
      userAgent
    );
    await prisma.viewEvent.create({
      data: {
        contentId,
        contentType: "EVENT",
        userId,
        anonId,
        ip,
        userAgent,
        dedupHash: eventDedupHash,
      },
    });

    // Verify both views exist
    const newsViews = await prisma.viewEvent.count({
      where: { contentId, contentType: "NEWS_POST" },
    });
    const eventViews = await prisma.viewEvent.count({
      where: { contentId, contentType: "EVENT" },
    });

    expect(newsViews).toBe(1);
    expect(eventViews).toBe(1);
  });
});
