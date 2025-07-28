import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { computeDedupHash } from "@/lib/utils";
import { z } from "zod";

const trackViewSchema = z.object({
  contentId: z.string().min(1, "Content ID is required"),
  contentType: z.enum(["NEWS", "POST", "EVENT"]),
});

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const { contentId, contentType } = trackViewSchema.parse(body);

    // Extract anonId from cookie
    const anonId = request.cookies.get("anon_id")?.value;
    if (!anonId) {
      return NextResponse.json(
        { error: "Anonymous ID cookie is required" },
        { status: 400 }
      );
    }

    // Extract IP address
    const forwardedFor = request.headers.get("x-forwarded-for");
    const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "unknown";

    // Extract user agent
    const userAgent = request.headers.get("user-agent") || "unknown";

    // Get user session if available
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id || null;

    // Compute deduplication hash (includes content identification)
    const dedupHash = computeDedupHash(
      contentId,
      contentType,
      userId,
      anonId,
      ip,
      userAgent
    );

    // Use a transaction to prevent race conditions and ensure proper deduplication
    const result = await prisma.$transaction(async (tx) => {
      const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);

      console.log(
        `🔍 Checking for existing view: ${contentId} (${contentType}) - Hash: ${dedupHash.substring(
          0,
          8
        )}...`
      );
      console.log(`🔍 Time window: ${fifteenMinutesAgo.toISOString()} to now`);

      // Check for existing view in the last 15 minutes (hash includes content info)
      const existingView = await tx.viewEvent.findFirst({
        where: {
          dedupHash,
          viewedAt: {
            gte: fifteenMinutesAgo,
          },
        },
      });

      console.log(`🔍 Existing view found: ${existingView ? "YES" : "NO"}`);
      if (existingView) {
        console.log(
          `🔍 Existing view time: ${existingView.viewedAt.toISOString()}`
        );
        return { action: "skipped", view: existingView };
      }

      // If no recent view exists for this content, create a new one
      const newView = await tx.viewEvent.create({
        data: {
          contentId,
          contentType,
          userId,
          anonId,
          ip,
          userAgent,
          dedupHash,
        },
      });

      console.log(
        `✅ View tracked: ${contentId} (${contentType}) - Hash: ${dedupHash.substring(
          0,
          8
        )}... - ID: ${newView.id}`
      );

      return { action: "created", view: newView };
    });

    if (result.action === "skipped") {
      console.log(
        `⏭️ View skipped (duplicate): ${contentId} (${contentType}) - Hash: ${dedupHash.substring(
          0,
          8
        )}... - Existing ID: ${result.view.id}`
      );
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error tracking view:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
