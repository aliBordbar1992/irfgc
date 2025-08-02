import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PublicProfileContent } from "@/features/profile/PublicProfileContent";
import { normalizeUsername } from "@/lib/normalization";

interface PublicProfilePageProps {
  params: {
    username: string;
  };
}

export default async function PublicProfilePage({
  params,
}: PublicProfilePageProps) {
  const { username } = await params;
  const decodedUsername = decodeURIComponent(username);
  console.log("Looking for user with username:", decodedUsername);
  console.log("Normalized username:", normalizeUsername(decodedUsername));

  // Fetch public user data - try both username and usernameNormalized
  const normalizedUsername = normalizeUsername(decodedUsername);
  console.log("Searching with normalized username:", normalizedUsername);

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { username: decodedUsername },
        { usernameNormalized: normalizedUsername },
      ],
    },
    include: {
      events: {
        take: 5,
        orderBy: { createdAt: "desc" },
        where: { deletedAt: null },
        include: {
          game: true,
        },
      },
      newsPosts: {
        take: 5,
        orderBy: { publishedAt: "desc" },
        where: { deletedAt: null },
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
          events: {
            where: { deletedAt: null },
          },
          newsPosts: {
            where: { deletedAt: null },
          },
          lfgPosts: true,
          forumThreads: true,
          forumReplies: true,
          eventRegistrations: true,
        },
      },
    },
  });

  if (!user) {
    console.log("User not found in database");
    notFound();
  }

  console.log("User found:", user.username);

  return <PublicProfileContent user={user} />;
}
