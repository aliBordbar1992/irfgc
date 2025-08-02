import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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
    const type = searchParams.get("type") || "received"; // "received" or "sent"
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const userId = session.user.id;

    let whereClause: {
      receiverId?: string;
      senderId?: string;
      status?: "PENDING";
    };
    let includeClause: {
      sender?: {
        select: {
          id: true;
          name: true;
          username: true;
          avatar: true;
        };
      };
      receiver?: {
        select: {
          id: true;
          name: true;
          username: true;
          avatar: true;
        };
      };
    };

    if (type === "received") {
      whereClause = {
        receiverId: userId,
        status: "PENDING",
      };
      includeClause = {
        sender: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
      };
    } else {
      whereClause = {
        senderId: userId,
      };
      includeClause = {
        receiver: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
      };
    }

    const [requests, totalRequests] = await Promise.all([
      prisma.followRequest.findMany({
        where: whereClause,
        include: includeClause,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.followRequest.count({
        where: whereClause,
      }),
    ]);

    return NextResponse.json({
      data: {
        requests,
        totalRequests,
        pagination: {
          page,
          limit,
          total: totalRequests,
          totalPages: Math.ceil(totalRequests / limit),
        },
      },
    });
  } catch (error) {
    console.error("Error fetching follow requests:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
