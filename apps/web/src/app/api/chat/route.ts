import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createMessageSchema = z.object({
  content: z.string().min(1, "Message content is required"),
  roomId: z.string().min(1, "Room ID is required"),
  messageType: z.enum(["TEXT", "SYSTEM", "NOTIFICATION"]).optional(),
});

const createRoomSchema = z.object({
  name: z.string().min(1, "Room name is required"),
  gameSlug: z.string().optional(),
  type: z
    .enum(["GENERAL", "GAME_SPECIFIC", "TOURNAMENT", "PRIVATE"])
    .optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const roomId = searchParams.get("roomId");
    const gameSlug = searchParams.get("gameSlug");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const skip = (page - 1) * limit;

    if (roomId) {
      // Get messages for a specific room
      const messages = await prisma.chatMessage.findMany({
        where: { roomId },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              role: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      });

      return NextResponse.json({
        data: messages.reverse(), // Show oldest first
        pagination: {
          page,
          limit,
          total: await prisma.chatMessage.count({ where: { roomId } }),
        },
      });
    } else {
      // Get chat rooms
      const where: { gameSlug?: string; isActive?: boolean } = {
        isActive: true,
      };
      if (gameSlug) where.gameSlug = gameSlug;

      const rooms = await prisma.chatRoom.findMany({
        where,
        include: {
          game: true,
          _count: {
            select: {
              messages: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      return NextResponse.json({ data: rooms });
    }
  } catch (error) {
    console.error("Error fetching chat data:", error);
    return NextResponse.json(
      { error: "Failed to fetch chat data" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");

    if (action === "create-room") {
      const validatedData = createRoomSchema.parse(body);

      // Check if game exists if gameSlug is provided
      if (validatedData.gameSlug) {
        const game = await prisma.game.findUnique({
          where: { slug: validatedData.gameSlug },
        });

        if (!game) {
          return NextResponse.json(
            { error: "Game not found" },
            { status: 404 }
          );
        }
      }

      const room = await prisma.chatRoom.create({
        data: {
          name: validatedData.name,
          gameSlug: validatedData.gameSlug,
          type: validatedData.type || "GENERAL",
        },
        include: {
          game: true,
        },
      });

      return NextResponse.json(
        { data: room, message: "Chat room created successfully" },
        { status: 201 }
      );
    } else {
      // Create message
      const validatedData = createMessageSchema.parse(body);

      // Verify room exists
      const room = await prisma.chatRoom.findUnique({
        where: { id: validatedData.roomId },
      });

      if (!room) {
        return NextResponse.json({ error: "Room not found" }, { status: 404 });
      }

      const message = await prisma.chatMessage.create({
        data: {
          content: validatedData.content,
          roomId: validatedData.roomId,
          authorId: session.user.id,
          messageType: validatedData.messageType || "TEXT",
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              role: true,
            },
          },
        },
      });

      return NextResponse.json(
        { data: message, message: "Message sent successfully" },
        { status: 201 }
      );
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input data", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error creating chat data:", error);
    return NextResponse.json(
      { error: "Failed to create chat data" },
      { status: 500 }
    );
  }
}
