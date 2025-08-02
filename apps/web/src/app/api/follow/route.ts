import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const followActionSchema = z.object({
  targetUserId: z.string().min(1),
  action: z.enum(["follow", "unfollow", "cancel_request", "accept", "reject"]),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { targetUserId, action } = followActionSchema.parse(body);

    // Prevent self-following
    if (targetUserId === session.user.id) {
      return NextResponse.json(
        { error: "Cannot follow yourself" },
        { status: 400 }
      );
    }

    // Verify target user exists
    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
      select: { id: true, name: true, username: true },
    });

    if (!targetUser) {
      return NextResponse.json(
        { error: "Target user not found" },
        { status: 404 }
      );
    }

    const currentUserId = session.user.id;

    switch (action) {
      case "follow": {
        // Check if already following
        const existingFollow = await prisma.follow.findUnique({
          where: {
            followerId_followingId: {
              followerId: currentUserId,
              followingId: targetUserId,
            },
          },
        });

        if (existingFollow) {
          return NextResponse.json(
            { error: "Already following this user" },
            { status: 400 }
          );
        }

        // Check if there's a pending request
        const existingRequest = await prisma.followRequest.findUnique({
          where: {
            senderId_receiverId: {
              senderId: currentUserId,
              receiverId: targetUserId,
            },
          },
        });

        if (existingRequest) {
          return NextResponse.json(
            { error: "Follow request already sent" },
            { status: 400 }
          );
        }

        // Create follow request
        const followRequest = await prisma.followRequest.create({
          data: {
            senderId: currentUserId,
            receiverId: targetUserId,
          },
        });

        // Create notification for the target user
        try {
          await prisma.notification.create({
            data: {
              userId: targetUserId,
              type: "FOLLOW_REQUEST",
              title: "New Follow Request",
              message: `${session.user.name} wants to follow you`,
              contentId: currentUserId,
              contentType: "USER",
            },
          });
        } catch (error) {
          console.error("Failed to create follow request notification:", error);
        }

        return NextResponse.json({
          success: true,
          action: "follow_request_sent",
          followRequest,
        });
      }

      case "unfollow": {
        // Remove follow relationship
        const deletedFollow = await prisma.follow.deleteMany({
          where: {
            followerId: currentUserId,
            followingId: targetUserId,
          },
        });

        if (deletedFollow.count === 0) {
          return NextResponse.json(
            { error: "Not following this user" },
            { status: 400 }
          );
        }

        return NextResponse.json({
          success: true,
          action: "unfollowed",
        });
      }

      case "cancel_request": {
        // First check if the request exists
        const existingRequest = await prisma.followRequest.findUnique({
          where: {
            senderId_receiverId: {
              senderId: currentUserId,
              receiverId: targetUserId,
            },
          },
        });

        if (!existingRequest) {
          return NextResponse.json(
            { error: "No follow request found" },
            { status: 400 }
          );
        }

        if (existingRequest.status !== "PENDING") {
          return NextResponse.json(
            { error: "Follow request is not pending" },
            { status: 400 }
          );
        }

        // Delete the request and the related notification
        // This ensures consistency: when a follow request is cancelled,
        // the recipient won't see a notification for a request that no longer exists
        await prisma.$transaction(async (tx) => {
          // Delete the follow request
          await tx.followRequest.delete({
            where: {
              id: existingRequest.id,
            },
          });

          // Delete the related notification
          const deletedNotifications = await tx.notification.updateMany({
            where: {
              userId: targetUserId,
              type: "FOLLOW_REQUEST",
              contentId: currentUserId,
              contentType: "USER",
            },
            data: {
              deletedAt: new Date(),
            },
          });

          console.log(
            `Deleted ${deletedNotifications.count} notifications for cancelled follow request`
          );
        });

        return NextResponse.json({
          success: true,
          action: "request_cancelled",
        });
      }

      case "accept": {
        // Accept follow request
        const followRequest = await prisma.followRequest.findUnique({
          where: {
            senderId_receiverId: {
              senderId: targetUserId,
              receiverId: currentUserId,
            },
          },
        });

        if (!followRequest || followRequest.status !== "PENDING") {
          return NextResponse.json(
            { error: "No pending follow request found" },
            { status: 400 }
          );
        }

        // Use transaction to ensure consistency
        await prisma.$transaction(async (tx) => {
          // Update request status
          await tx.followRequest.update({
            where: { id: followRequest.id },
            data: { status: "ACCEPTED" },
          });

          // Create follow relationship
          await tx.follow.create({
            data: {
              followerId: targetUserId,
              followingId: currentUserId,
            },
          });
        });

        // Create notification for the sender
        try {
          await prisma.notification.create({
            data: {
              userId: targetUserId,
              type: "FOLLOW_ACCEPTED",
              title: "Follow Request Accepted",
              message: `${session.user.name} accepted your follow request`,
              contentId: currentUserId,
              contentType: "USER",
            },
          });
        } catch (error) {
          console.error(
            "Failed to create follow accepted notification:",
            error
          );
        }

        return NextResponse.json({
          success: true,
          action: "request_accepted",
        });
      }

      case "reject": {
        // Reject follow request
        const followRequest = await prisma.followRequest.findUnique({
          where: {
            senderId_receiverId: {
              senderId: targetUserId,
              receiverId: currentUserId,
            },
          },
        });

        if (!followRequest || followRequest.status !== "PENDING") {
          return NextResponse.json(
            { error: "No pending follow request found" },
            { status: 400 }
          );
        }

        // Update request status
        await prisma.followRequest.update({
          where: { id: followRequest.id },
          data: { status: "REJECTED" },
        });

        // Create notification for the sender
        try {
          await prisma.notification.create({
            data: {
              userId: targetUserId,
              type: "FOLLOW_REJECTED",
              title: "Follow Request Rejected",
              message: `${session.user.name} rejected your follow request`,
              contentId: currentUserId,
              contentType: "USER",
            },
          });
        } catch (error) {
          console.error(
            "Failed to create follow rejected notification:",
            error
          );
        }

        return NextResponse.json({
          success: true,
          action: "request_rejected",
        });
      }

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error in follow action:", error);

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

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const targetUserId = searchParams.get("targetUserId");

    if (!targetUserId) {
      return NextResponse.json(
        { error: "targetUserId is required" },
        { status: 400 }
      );
    }

    const currentUserId = session.user.id;

    // Get follow status and counts
    const [
      followStatus,
      pendingRequestSent,
      pendingRequestReceived,
      followerCount,
      followingCount,
    ] = await Promise.all([
      // Check if current user is following target user
      prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: currentUserId,
            followingId: targetUserId,
          },
        },
      }),
      // Check if there's a pending request from current user to target user
      prisma.followRequest.findUnique({
        where: {
          senderId_receiverId: {
            senderId: currentUserId,
            receiverId: targetUserId,
          },
        },
      }),
      // Check if there's a pending request from target user to current user
      prisma.followRequest.findUnique({
        where: {
          senderId_receiverId: {
            senderId: targetUserId,
            receiverId: currentUserId,
          },
        },
      }),
      // Get follower count
      prisma.follow.count({
        where: { followingId: targetUserId },
      }),
      // Get following count
      prisma.follow.count({
        where: { followerId: targetUserId },
      }),
    ]);

    let status = "none";
    if (followStatus) {
      status = "following";
    } else if (pendingRequestSent) {
      status = "request_sent";
    } else if (pendingRequestReceived) {
      status = "request_received";
    }

    return NextResponse.json({
      data: {
        status,
        followerCount,
        followingCount,
      },
    });
  } catch (error) {
    console.error("Error getting follow status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
