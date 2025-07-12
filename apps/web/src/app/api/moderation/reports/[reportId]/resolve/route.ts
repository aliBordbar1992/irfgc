import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { reportId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (
      !session ||
      (session.user.role !== "admin" && session.user.role !== "moderator")
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const report = await prisma.report.findUnique({
      where: { id: params.reportId },
      include: {
        reporter: true,
        reportedUser: true,
      },
    });

    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    if (report.status !== "PENDING") {
      return NextResponse.json(
        { error: "Report is not pending" },
        { status: 400 }
      );
    }

    // Update report status to resolved
    const updatedReport = await prisma.report.update({
      where: { id: params.reportId },
      data: {
        status: "RESOLVED",
        moderatorId: session.user.id,
        updatedAt: new Date(),
      },
      include: {
        reporter: {
          select: { id: true, name: true },
        },
        reportedUser: {
          select: { id: true, name: true },
        },
        moderator: {
          select: { id: true, name: true },
        },
      },
    });

    return NextResponse.json({
      data: updatedReport,
      message: "Report resolved successfully",
    });
  } catch (error) {
    console.error("Error resolving report:", error);
    return NextResponse.json(
      { error: "Failed to resolve report" },
      { status: 500 }
    );
  }
}
