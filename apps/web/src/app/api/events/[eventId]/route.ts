import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getEffectiveEventStatus } from "@/lib/eventStatus";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (
      !session ||
      (session.user.role !== "ADMIN" && session.user.role !== "MODERATOR")
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { eventId } = await params;

    // Check if event exists
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Soft delete the event by setting deletedAt timestamp
    await prisma.event.update({
      where: { id: eventId },
      data: {
        deletedAt: new Date(),
      },
    });

    return NextResponse.json(
      { message: "Event deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json(
      { error: "Failed to delete event" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (
      !session ||
      (session.user.role !== "ADMIN" && session.user.role !== "MODERATOR")
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { eventId } = await params;
    const body = await request.json();

    // Check if event exists
    const existingEvent = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!existingEvent) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Update the event
    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: {
        title: body.title,
        description: body.description,
        type: body.type,
        statusOverride:
          body.statusOverride === "AUTO" ? null : body.statusOverride || null,
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
        location: body.location,
        onlineUrl: body.onlineUrl,
        maxParticipants: body.maxParticipants,
        registrationDeadline: body.registrationDeadline
          ? new Date(body.registrationDeadline)
          : null,
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

    // Apply effective status
    const eventWithEffectiveStatus = {
      ...updatedEvent,
      status: getEffectiveEventStatus(
        updatedEvent.startDate,
        updatedEvent.endDate,
        updatedEvent.statusOverride
      ),
    };

    return NextResponse.json(
      { data: eventWithEffectiveStatus, message: "Event updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating event:", error);
    return NextResponse.json(
      { error: "Failed to update event" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params;
    const { searchParams } = new URL(request.url);
    const includeDeleted = searchParams.get("includeDeleted") === "true";

    const where: { id: string; deletedAt?: null } = { id: eventId };

    // Only include soft-deleted events if explicitly requested
    if (!includeDeleted) {
      where.deletedAt = null;
    }

    const event = await prisma.event.findUnique({
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
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Apply effective status
    const eventWithEffectiveStatus = {
      ...event,
      status: getEffectiveEventStatus(
        event.startDate,
        event.endDate,
        event.statusOverride
      ),
    };

    return NextResponse.json({ data: eventWithEffectiveStatus });
  } catch (error) {
    console.error("Error fetching event:", error);
    return NextResponse.json(
      { error: "Failed to fetch event" },
      { status: 500 }
    );
  }
}
