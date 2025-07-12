import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { eventId } = await params;

    // Check if event exists and is open for registration
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        registrations: {
          where: { userId: session.user.id },
        },
      },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    if (event.status !== "UPCOMING") {
      return NextResponse.json(
        { error: "Event is not open for registration" },
        { status: 400 }
      );
    }

    // Check if registration deadline has passed
    if (
      event.registrationDeadline &&
      new Date(event.registrationDeadline) < new Date()
    ) {
      return NextResponse.json(
        { error: "Registration deadline has passed" },
        { status: 400 }
      );
    }

    // Check if user is already registered
    if (event.registrations.length > 0) {
      return NextResponse.json(
        { error: "Already registered for this event" },
        { status: 400 }
      );
    }

    // Check if event is full
    if (
      event.maxParticipants &&
      event.currentParticipants >= event.maxParticipants
    ) {
      return NextResponse.json({ error: "Event is full" }, { status: 400 });
    }

    // Create registration
    await prisma.$transaction([
      prisma.eventRegistration.create({
        data: {
          eventId,
          userId: session.user.id,
        },
      }),
      prisma.event.update({
        where: { id: eventId },
        data: {
          currentParticipants: {
            increment: 1,
          },
        },
      }),
    ]);

    return NextResponse.json(
      { message: "Successfully registered for event" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error registering for event:", error);
    return NextResponse.json(
      { error: "Failed to register for event" },
      { status: 500 }
    );
  }
}
