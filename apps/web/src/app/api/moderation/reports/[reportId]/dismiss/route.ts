import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ reportId: string }> }
) {
  try {
    const { reportId } = await params;
    const session = await getServerSession(authOptions);
    if (
      !session ||
      (session.user.role !== "ADMIN" && session.user.role !== "MODERATOR")
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const report = await prisma.report.findUnique({
      where: { id: reportId },
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

    // Update report status to dismissed
    const updatedReport = await prisma.report.update({
      where: { id: reportId },
      data: {
        status: "DISMISSED",
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
      message: "Report dismissed successfully",
    });
  } catch (error) {
    console.error("Error dismissing report:", error);
    return NextResponse.json(
      { error: "Failed to dismiss report" },
      { status: 500 }
    );
  }
}
