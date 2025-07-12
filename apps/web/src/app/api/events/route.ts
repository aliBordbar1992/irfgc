import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createEventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  gameSlug: z.string().min(1, "Game is required"),
  type: z.enum(["TOURNAMENT", "CASUAL", "ONLINE", "OFFLINE"]),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  location: z.string().optional(),
  onlineUrl: z.string().url().optional(),
  maxParticipants: z.number().positive().optional(),
  registrationDeadline: z.string().datetime().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const gameSlug = searchParams.get("gameSlug");
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const where: {
      gameSlug?: string;
      status?: "UPCOMING" | "ONGOING" | "COMPLETED" | "CANCELLED";
    } = {};
    if (gameSlug) where.gameSlug = gameSlug;
    if (
      status &&
      ["UPCOMING", "ONGOING", "COMPLETED", "CANCELLED"].includes(status)
    ) {
      where.status = status as
        | "UPCOMING"
        | "ONGOING"
        | "COMPLETED"
        | "CANCELLED";
    }

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        include: {
          game: true,
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          registrations: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
        orderBy: { startDate: "asc" },
        skip,
        take: limit,
      }),
      prisma.event.count({ where }),
    ]);

    return NextResponse.json({
      data: events,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (
      !session ||
      (session.user.role !== "admin" && session.user.role !== "moderator")
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createEventSchema.parse(body);

    // Check if game exists
    const game = await prisma.game.findUnique({
      where: { slug: validatedData.gameSlug },
    });

    if (!game) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    const event = await prisma.event.create({
      data: {
        ...validatedData,
        startDate: new Date(validatedData.startDate),
        endDate: new Date(validatedData.endDate),
        registrationDeadline: validatedData.registrationDeadline
          ? new Date(validatedData.registrationDeadline)
          : null,
        createdById: session.user.id,
      },
      include: {
        game: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(
      { data: event, message: "Event created successfully" },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input data", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}
