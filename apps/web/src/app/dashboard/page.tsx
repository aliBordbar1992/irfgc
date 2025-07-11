import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Mock statistics - will be replaced with real data from database
const MOCK_STATS = {
  totalUsers: 1247,
  activeUsers: 892,
  totalEvents: 45,
  upcomingEvents: 12,
  totalNewsPosts: 89,
  totalForumThreads: 234,
  totalLFGPosts: 156,
  newUsersThisMonth: 89,
  eventsThisMonth: 8,
  newsPostsThisMonth: 12,
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user.role === "admin";

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {session?.user.name}!
        </h1>
        <p className="text-gray-600 mt-2">
          Here&apos;s what&apos;s happening with the IRFGC platform today.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/dashboard/events/new">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl mb-2">🏆</div>
                <h3 className="font-semibold">Create Event</h3>
                <p className="text-sm text-gray-600">
                  Add new tournament or meetup
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/news/new">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl mb-2">📰</div>
                <h3 className="font-semibold">Write News</h3>
                <p className="text-sm text-gray-600">Publish community news</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/users">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl mb-2">👥</div>
                <h3 className="font-semibold">Manage Users</h3>
                <p className="text-sm text-gray-600">View and manage members</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/forum">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl mb-2">💬</div>
                <h3 className="font-semibold">Moderate Forum</h3>
                <p className="text-sm text-gray-600">Review and manage posts</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <div className="text-2xl">👥</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {MOCK_STATS.totalUsers.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              +{MOCK_STATS.newUsersThisMonth} this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Events</CardTitle>
            <div className="text-2xl">🏆</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {MOCK_STATS.upcomingEvents}
            </div>
            <p className="text-xs text-muted-foreground">
              {MOCK_STATS.eventsThisMonth} created this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">News Posts</CardTitle>
            <div className="text-2xl">📰</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {MOCK_STATS.totalNewsPosts}
            </div>
            <p className="text-xs text-muted-foreground">
              +{MOCK_STATS.newsPostsThisMonth} this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Forum Threads</CardTitle>
            <div className="text-2xl">💬</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {MOCK_STATS.totalForumThreads}
            </div>
            <p className="text-xs text-muted-foreground">
              Active community discussions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Events */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Weekly Tournament</p>
                  <p className="text-sm text-gray-600">MK Community</p>
                </div>
                <span className="text-sm text-green-600">Active</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Casual Meetup</p>
                  <p className="text-sm text-gray-600">SF Community</p>
                </div>
                <span className="text-sm text-blue-600">Upcoming</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Championship Series</p>
                  <p className="text-sm text-gray-600">TK Community</p>
                </div>
                <span className="text-sm text-gray-600">Planning</span>
              </div>
            </div>
            <div className="mt-4">
              <Link href="/dashboard/events">
                <Button variant="outline" size="sm" className="w-full">
                  View All Events
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Recent Users */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">NewPlayer123</p>
                  <p className="text-sm text-gray-600">Joined 2 hours ago</p>
                </div>
                <span className="text-sm text-gray-500">Player</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Fighter456</p>
                  <p className="text-sm text-gray-600">Joined 1 day ago</p>
                </div>
                <span className="text-sm text-gray-500">Player</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">TournamentOrganizer</p>
                  <p className="text-sm text-gray-600">Joined 3 days ago</p>
                </div>
                <span className="text-sm text-blue-500">Moderator</span>
              </div>
            </div>
            <div className="mt-4">
              <Link href="/dashboard/users">
                <Button variant="outline" size="sm" className="w-full">
                  View All Users
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      {isAdmin && (
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">Database: Online</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">API: Healthy</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">Email Service: Active</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
