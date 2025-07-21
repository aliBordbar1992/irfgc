import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardOverview } from "@/features/dashboard/DashboardOverview";
import { DashboardStats } from "@/features/dashboard/DashboardStats";
import { RecentActivity } from "@/features/dashboard/RecentActivity";
import { QuickActions } from "@/features/dashboard/QuickActions";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  if (session.user.role !== "ADMIN" && session.user.role !== "MODERATOR") {
    notFound();
  }

  // Fetch dashboard data
  const [
    totalUsers,
    totalEvents,
    totalNewsPosts,
    totalLFGPosts,
    totalForumThreads,
    recentUsers,
    recentEvents,
    recentNews,
    recentLFG,
    recentForumThreads,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.event.count(),
    prisma.newsPost.count(),
    prisma.lFGPost.count(),
    prisma.forumThread.count(),
    prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    }),
    prisma.event.findMany({
      take: 10,
      orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
      include: {
        game: true,
        createdBy: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    }),
    prisma.newsPost.findMany({
      take: 5,
      orderBy: { publishedAt: "desc" },
      include: {
        game: true,
        author: {
          select: {
            name: true,
          },
        },
      },
    }),
    prisma.lFGPost.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        game: true,
        author: {
          select: {
            name: true,
          },
        },
      },
    }),
    prisma.forumThread.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        game: true,
        author: {
          select: {
            name: true,
          },
        },
      },
    }),
  ]);

  const dashboardData = {
    stats: {
      totalUsers,
      totalEvents,
      totalNewsPosts,
      totalLFGPosts,
      totalForumThreads,
    },
    recentActivity: {
      users: recentUsers,
      events: recentEvents.map((event) => ({
        id: event.id,
        title: event.title,
        game: {
          slug: event.game.slug,
          fullName: event.game.fullName,
        },
        createdBy: event.createdBy,
        createdAt: event.createdAt,
        updatedAt: event.updatedAt || event.createdAt, // Fallback to createdAt if updatedAt is null
        deletedAt: event.deletedAt || undefined, // Convert null to undefined
      })),
      news: recentNews,
      lfg: recentLFG,
      forumThreads: recentForumThreads,
    },
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back, {session.user.name}. Here&apos;s what&apos;s happening
          across the platform.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <Suspense fallback={<DashboardStatsSkeleton />}>
          <DashboardStats stats={dashboardData.stats} />
        </Suspense>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <Suspense fallback={<DashboardOverviewSkeleton />}>
            <DashboardOverview />
          </Suspense>
        </div>
        <div>
          <Suspense fallback={<QuickActionsSkeleton />}>
            <QuickActions userRole={session.user.role} />
          </Suspense>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Suspense fallback={<RecentActivitySkeleton />}>
          <RecentActivity data={dashboardData.recentActivity} />
        </Suspense>
      </div>
    </div>
  );
}

function DashboardStatsSkeleton() {
  return (
    <>
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-lg p-6 shadow-sm border animate-pulse"
        >
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      ))}
    </>
  );
}

function DashboardOverviewSkeleton() {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
      <div className="h-64 bg-gray-200 rounded"></div>
    </div>
  );
}

function QuickActionsSkeleton() {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-10 bg-gray-200 rounded"></div>
        ))}
      </div>
    </div>
  );
}

function RecentActivitySkeleton() {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-12 bg-gray-200 rounded"></div>
        ))}
      </div>
    </div>
  );
}
