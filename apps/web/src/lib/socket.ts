import { Server as SocketIOServer } from "socket.io";
import { Server as NetServer } from "http";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "./prisma";

export interface SocketServer extends SocketIOServer {
  room?: string;
}

export interface SocketWithIO extends NetServer {
  io?: SocketServer;
}

export interface NextApiResponseWithSocket extends NextApiResponse {
  socket: {
    server: SocketWithIO;
  };
}

export const initSocket = (
  req: NextApiRequest,
  res: NextApiResponseWithSocket
) => {
  if (!res.socket.server.io) {
    const io = new SocketIOServer(res.socket.server, {
      path: "/api/socketio",
      addTrailingSlash: false,
      cors: {
        origin: process.env.NEXTAUTH_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
      },
    });

    io.on("connection", (socket) => {
      console.log("Client connected:", socket.id);

      // Join a chat room
      socket.on(
        "join-room",
        async (data: { roomId: string; userId: string }) => {
          const { roomId, userId } = data;

          // Verify user exists
          const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, name: true, role: true },
          });

          if (!user) {
            socket.emit("error", { message: "User not found" });
            return;
          }

          // Join the room
          socket.join(roomId);
          (socket as any).room = roomId;

          // Send user joined notification
          socket.to(roomId).emit("user-joined", {
            userId: user.id,
            userName: user.name,
            timestamp: new Date(),
          });

          console.log(`User ${user.name} joined room ${roomId}`);
        }
      );

      // Handle chat messages
      socket.on(
        "send-message",
        async (data: {
          roomId: string;
          userId: string;
          content: string;
          messageType?: "TEXT" | "SYSTEM" | "NOTIFICATION";
        }) => {
          const { roomId, userId, content, messageType = "TEXT" } = data;

          try {
            // Verify user exists
            const user = await prisma.user.findUnique({
              where: { id: userId },
              select: { id: true, name: true, role: true },
            });

            if (!user) {
              socket.emit("error", { message: "User not found" });
              return;
            }

            // Verify room exists
            const room = await prisma.chatRoom.findUnique({
              where: { id: roomId },
            });

            if (!room) {
              socket.emit("error", { message: "Room not found" });
              return;
            }

            // Save message to database
            const message = await prisma.chatMessage.create({
              data: {
                content,
                roomId,
                authorId: userId,
                messageType: messageType as "TEXT" | "SYSTEM" | "NOTIFICATION",
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

            // Broadcast message to room
            const messageData = {
              id: message.id,
              content: message.content,
              roomId: message.roomId,
              author: {
                id: message.author.id,
                name: message.author.name,
                role: message.author.role,
              },
              messageType: message.messageType,
              createdAt: message.createdAt,
            };

            io.to(roomId).emit("new-message", messageData);
            console.log(`Message sent in room ${roomId} by ${user.name}`);
          } catch (error) {
            console.error("Error sending message:", error);
            socket.emit("error", { message: "Failed to send message" });
          }
        }
      );

      // Handle typing indicators
      socket.on(
        "typing",
        (data: { roomId: string; userId: string; isTyping: boolean }) => {
          const { roomId, userId, isTyping } = data;
          socket.to(roomId).emit("user-typing", { userId, isTyping });
        }
      );

      // Handle disconnection
      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
        const room = (socket as any).room;
        if (room) {
          socket.to(room).emit("user-left", {
            userId: socket.id,
            timestamp: new Date(),
          });
        }
      });
    });

    res.socket.server.io = io;
  }

  return res.socket.server.io;
};

export const getSocketIO = (res: NextApiResponseWithSocket) => {
  return res.socket.server.io;
};
