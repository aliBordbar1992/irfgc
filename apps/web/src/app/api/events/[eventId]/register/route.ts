import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getEffectiveEventStatus, StatusOverrideType } from "@/lib/eventStatus";

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

    const effectiveStatus = getEffectiveEventStatus(
      event.startDate,
      event.endDate,
      (event as { statusOverride?: StatusOverrideType }).statusOverride
    );

    if (effectiveStatus !== "UPCOMING") {
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

export async function GET(
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

    // Check if user is registered for this event
    const registration = await prisma.eventRegistration.findUnique({
      where: {
        eventId_userId: {
          eventId,
          userId: session.user.id,
        },
      },
    });

    return NextResponse.json({
      isRegistered: !!registration,
    });
  } catch (error) {
    console.error("Error checking registration status:", error);
    return NextResponse.json(
      { error: "Failed to check registration status" },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    // Check if event exists
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

    // Check if user is registered
    if (event.registrations.length === 0) {
      return NextResponse.json(
        { error: "Not registered for this event" },
        { status: 400 }
      );
    }

    const effectiveStatus = getEffectiveEventStatus(
      event.startDate,
      event.endDate,
      (event as { statusOverride?: StatusOverrideType }).statusOverride
    );

    // Check if event is still upcoming (allow unregistration for upcoming events)
    if (effectiveStatus !== "UPCOMING") {
      return NextResponse.json(
        { error: "Cannot unregister from event that has already started" },
        { status: 400 }
      );
    }

    // Remove registration
    await prisma.$transaction([
      prisma.eventRegistration.delete({
        where: {
          eventId_userId: {
            eventId,
            userId: session.user.id,
          },
        },
      }),
      prisma.event.update({
        where: { id: eventId },
        data: {
          currentParticipants: {
            decrement: 1,
          },
        },
      }),
    ]);

    return NextResponse.json(
      { message: "Successfully unregistered from event" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error unregistering from event:", error);
    return NextResponse.json(
      { error: "Failed to unregister from event" },
      { status: 500 }
    );
  }
}
