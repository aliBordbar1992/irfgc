import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    // Verify that the user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get follower and following counts (public information)
    const [followerCount, followingCount] = await Promise.all([
      // Get follower count - people following this user
      prisma.follow.count({
        where: { followingId: userId },
      }),
      // Get following count - people this user is following
      prisma.follow.count({
        where: { followerId: userId },
      }),
    ]);

    return NextResponse.json({
      data: {
        userId,
        followerCount,
        followingCount,
      },
    });
  } catch (error) {
    console.error("Error fetching follow stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
