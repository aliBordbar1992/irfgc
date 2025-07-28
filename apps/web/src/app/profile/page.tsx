import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProfileContent } from "@/features/profile/ProfileContent";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  if (!session.user?.id) {
    console.error("Session user ID is missing:", session);
    redirect("/auth/signin");
  }

  // Fetch user data with related information
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      events: {
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          game: true,
        },
      },
      newsPosts: {
        take: 5,
        orderBy: { publishedAt: "desc" },
        include: {
          game: true,
        },
      },
      lfgPosts: {
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          game: true,
        },
      },
      forumThreads: {
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          game: true,
          _count: {
            select: {
              replies: true,
            },
          },
        },
      },
      eventRegistrations: {
        take: 10,
        orderBy: { createdAt: "desc" },
        include: {
          event: {
            include: {
              game: true,
            },
          },
        },
      },
      _count: {
        select: {
          events: true,
          newsPosts: true,
          lfgPosts: true,
          forumThreads: true,
          forumReplies: true,
          eventRegistrations: true,
        },
      },
    },
  });

  if (!user) {
    redirect("/auth/signin");
  }

  return <ProfileContent user={user} />;
}
