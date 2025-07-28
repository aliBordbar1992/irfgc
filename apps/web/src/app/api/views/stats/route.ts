import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const statsQuerySchema = z.object({
  contentId: z.string().min(1, "Content ID is required"),
  contentType: z.enum([
    "FORUM_THREAD",
    "FORUM_REPLY",
    "LFG_POST",
    "NEWS_POST",
    "USER",
    "NEWS",
    "POST",
    "EVENT",
    "COMMENT",
  ]),
  period: z.enum(["day", "week", "month", "all"]).default("all"),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const contentId = searchParams.get("contentId");
    const contentType = searchParams.get("contentType");
    const period = searchParams.get("period") || "all";

    // Validate query parameters
    const {
      contentId: validatedContentId,
      contentType: validatedContentType,
      period: validatedPeriod,
    } = statsQuerySchema.parse({ contentId, contentType, period });

    // Calculate date filter based on period
    let dateFilter: { gte?: Date } | undefined;
    if (validatedPeriod !== "all") {
      const now = new Date();
      const periods = {
        day: new Date(now.getTime() - 24 * 60 * 60 * 1000),
        week: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        month: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      };
      dateFilter = { gte: periods[validatedPeriod] };
    }

    // Get view count
    const viewCount = await prisma.viewEvent.count({
      where: {
        contentId: validatedContentId,
        contentType: validatedContentType,
        ...(dateFilter && { viewedAt: dateFilter }),
      },
    });

    // Get unique viewers (by dedupHash)
    const uniqueViewers = await prisma.viewEvent.groupBy({
      by: ["dedupHash"],
      where: {
        contentId: validatedContentId,
        contentType: validatedContentType,
        ...(dateFilter && { viewedAt: dateFilter }),
      },
      _count: {
        dedupHash: true,
      },
    });

    const uniqueViewerCount = uniqueViewers.length;

    // Get recent views (last 10)
    const recentViews = await prisma.viewEvent.findMany({
      where: {
        contentId: validatedContentId,
        contentType: validatedContentType,
      },
      orderBy: {
        viewedAt: "desc",
      },
      take: 10,
      select: {
        viewedAt: true,
        userId: true,
        anonId: true,
        ip: true,
      },
    });

    return NextResponse.json({
      data: {
        contentId: validatedContentId,
        contentType: validatedContentType,
        period: validatedPeriod,
        totalViews: viewCount,
        uniqueViewers: uniqueViewerCount,
        recentViews,
      },
    });
  } catch (error) {
    console.error("Error fetching view stats:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
