import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const { searchParams } = new URL(request.url);

    const type = searchParams.get("type") || "followers"; // "followers", "following", "mutual"
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const session = await getServerSession(authOptions);

    // Verify that the user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let users: Array<{
      id: string;
      name: string;
      username: string;
      avatar: string | null;
      isCurrentUser?: boolean;
    }> = [];
    let totalCount = 0;

    const userSelect = {
      id: true,
      name: true,
      username: true,
      avatar: true,
    };

    if (type === "followers") {
      // Get users who are following this user
      const [followersData, count] = await Promise.all([
        prisma.follow.findMany({
          where: { followingId: userId },
          select: {
            follower: { select: userSelect },
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
          skip: (page - 1) * limit,
          take: limit,
        }),
        prisma.follow.count({
          where: { followingId: userId },
        }),
      ]);

      users = followersData.map((follow) => ({
        ...follow.follower,
        isCurrentUser: session?.user?.id === follow.follower.id,
      }));

      // If current user is in the list and this is page 1, move them to the top
      if (page === 1 && session?.user?.id) {
        const currentUserIndex = users.findIndex((user) => user.isCurrentUser);
        if (currentUserIndex > 0) {
          const currentUser = users.splice(currentUserIndex, 1)[0];
          users.unshift(currentUser);
        }
      }

      totalCount = count;
    } else if (type === "following") {
      // Get users this user is following
      const [followingData, count] = await Promise.all([
        prisma.follow.findMany({
          where: { followerId: userId },
          select: {
            following: { select: userSelect },
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
          skip: (page - 1) * limit,
          take: limit,
        }),
        prisma.follow.count({
          where: { followerId: userId },
        }),
      ]);

      users = followingData.map((follow) => ({
        ...follow.following,
        isCurrentUser: session?.user?.id === follow.following.id,
      }));

      // If current user is in the list and this is page 1, move them to the top
      if (page === 1 && session?.user?.id) {
        const currentUserIndex = users.findIndex((user) => user.isCurrentUser);
        if (currentUserIndex > 0) {
          const currentUser = users.splice(currentUserIndex, 1)[0];
          users.unshift(currentUser);
        }
      }

      totalCount = count;
    } else if (type === "mutual") {
      // Get mutual connections (users who follow each other)
      // This requires the current user to be authenticated
      if (!session?.user?.id) {
        return NextResponse.json(
          { error: "Authentication required for mutual connections" },
          { status: 401 }
        );
      }

      const currentUserId = session.user.id;

      // Find users who both follow the target user and are followed by the current user
      // Exclude the current user from mutual connections
      const [mutualData, count] = await Promise.all([
        prisma.follow.findMany({
          where: {
            followingId: userId,
            followerId: { not: currentUserId }, // Exclude current user
            follower: {
              followers: {
                some: {
                  followerId: currentUserId,
                },
              },
            },
          },
          select: {
            follower: { select: userSelect },
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
          skip: (page - 1) * limit,
          take: limit,
        }),
        prisma.follow.count({
          where: {
            followingId: userId,
            followerId: { not: currentUserId }, // Exclude current user
            follower: {
              followers: {
                some: {
                  followerId: currentUserId,
                },
              },
            },
          },
        }),
      ]);

      users = mutualData.map((follow) => ({
        ...follow.follower,
        isCurrentUser: false, // Mutual connections should never include current user
      }));

      totalCount = count;
    }

    return NextResponse.json({
      data: {
        users,
        pagination: {
          page,
          limit,
          total: totalCount,
          totalPages: Math.ceil(totalCount / limit),
          hasMore: page < Math.ceil(totalCount / limit),
        },
      },
    });
  } catch (error) {
    console.error("Error fetching follow list:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
