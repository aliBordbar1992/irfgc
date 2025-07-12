import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const session = await getServerSession(authOptions);

  // Check if user is authenticated and has admin/moderator role
  if (
    !session ||
    (session.user.role !== "ADMIN" && session.user.role !== "MODERATOR")
  ) {
    redirect("/auth/signin");
  }

  const isAdmin = session.user.role === "ADMIN";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold text-gray-900">
                IRFGC
              </Link>
              <span className="mx-2 text-gray-400">/</span>
              <span className="text-lg font-semibold text-gray-700">
                Dashboard
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-sm">
                <p className="font-medium text-gray-900">{session.user.name}</p>
                <p className="text-gray-500 capitalize">{session.user.role}</p>
              </div>
              <Link href="/">
                <Button variant="outline" size="sm">
                  Back to Site
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Navigation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/dashboard">
                  <Button variant="ghost" className="w-full justify-start">
                    📊 Overview
                  </Button>
                </Link>

                <Link href="/dashboard/events">
                  <Button variant="ghost" className="w-full justify-start">
                    🏆 Events
                  </Button>
                </Link>

                <Link href="/dashboard/news">
                  <Button variant="ghost" className="w-full justify-start">
                    📰 News
                  </Button>
                </Link>

                <Link href="/dashboard/users">
                  <Button variant="ghost" className="w-full justify-start">
                    👥 Users
                  </Button>
                </Link>

                <Link href="/dashboard/forum">
                  <Button variant="ghost" className="w-full justify-start">
                    💬 Forum
                  </Button>
                </Link>

                <Link href="/dashboard/moderation">
                  <Button variant="ghost" className="w-full justify-start">
                    🛡️ Moderation
                  </Button>
                </Link>

                {isAdmin && (
                  <>
                    <Link href="/dashboard/games">
                      <Button variant="ghost" className="w-full justify-start">
                        🎮 Games
                      </Button>
                    </Link>

                    <Link href="/dashboard/settings">
                      <Button variant="ghost" className="w-full justify-start">
                        ⚙️ Settings
                      </Button>
                    </Link>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">{children}</div>
        </div>
      </div>
    </div>
  );
}
