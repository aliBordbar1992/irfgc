import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Get all view events with deduplication analysis
    const viewEvents = await prisma.viewEvent.findMany({
      orderBy: {
        viewedAt: "desc",
      },
      take: 50, // Limit to recent 50 events
    });

    // Group by dedupHash to see duplicates
    const hashGroups = viewEvents.reduce((acc, event) => {
      const key = `${event.contentId}-${event.contentType}-${event.dedupHash}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(event);
      return acc;
    }, {} as Record<string, typeof viewEvents>);

    // Find duplicates
    const duplicates = Object.entries(hashGroups)
      .filter(([, events]) => events.length > 1)
      .map(([key, events]) => ({
        key,
        count: events.length,
        events: events.map((e) => ({
          id: e.id,
          viewedAt: e.viewedAt,
          userId: e.userId,
          anonId: e.anonId,
          ip: e.ip,
        })),
      }));

    // Get summary statistics
    const totalViews = await prisma.viewEvent.count();
    const uniqueHashes = await prisma.viewEvent.groupBy({
      by: ["dedupHash"],
      _count: {
        dedupHash: true,
      },
    });

    const summary = {
      totalViews,
      uniqueHashes: uniqueHashes.length,
      duplicateGroups: duplicates.length,
      recentEvents: viewEvents.slice(0, 10).map((e) => ({
        id: e.id,
        contentId: e.contentId,
        contentType: e.contentType,
        dedupHash: e.dedupHash.substring(0, 8) + "...",
        viewedAt: e.viewedAt,
        userId: e.userId,
        anonId: e.anonId?.substring(0, 8) + "...",
        ip: e.ip,
      })),
      duplicates: duplicates.slice(0, 5), // Show first 5 duplicate groups
    };

    return NextResponse.json({
      success: true,
      data: summary,
    });
  } catch (error) {
    console.error("Error in debug endpoint:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
