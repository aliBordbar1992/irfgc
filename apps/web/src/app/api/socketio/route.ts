import { NextRequest, NextResponse } from "next/server";
import { initSocket } from "@/lib/socket";

export async function GET(req: NextRequest) {
  try {
    // Initialize Socket.IO server
    initSocket(req as any, {} as any);

    return NextResponse.json({
      success: true,
      message: "Socket.IO server initialized",
    });
  } catch (error) {
    console.error("Socket.IO initialization error:", error);
    return NextResponse.json(
      { error: "Failed to initialize Socket.IO server" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Initialize Socket.IO server
    initSocket(req as any, {} as any);

    return NextResponse.json({
      success: true,
      message: "Socket.IO server initialized",
    });
  } catch (error) {
    console.error("Socket.IO initialization error:", error);
    return NextResponse.json(
      { error: "Failed to initialize Socket.IO server" },
      { status: 500 }
    );
  }
}
