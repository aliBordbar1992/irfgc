"use client";

import { UserRole } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  Calendar,
  Newspaper,
  MessageSquare,
  Settings,
  Shield,
  BarChart3,
  AlertTriangle,
  Plus,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";

interface QuickActionsProps {
  userRole: UserRole;
}

const adminActions = [
  {
    title: "Manage Users",
    description: "View, edit, and manage user accounts",
    icon: Users,
    href: "/dashboard/users",
    color: "text-blue-600",
    bgColor: "bg-blue-50 hover:bg-blue-100",
  },
  {
    title: "Create Event",
    description: "Create new tournaments and events",
    icon: Calendar,
    href: "/dashboard/events/create",
    color: "text-green-600",
    bgColor: "bg-green-50 hover:bg-green-100",
  },
  {
    title: "Write News",
    description: "Create news articles and announcements",
    icon: Newspaper,
    href: "/dashboard/news/create",
    color: "text-purple-600",
    bgColor: "bg-purple-50 hover:bg-purple-100",
  },
  {
    title: "Moderate Forum",
    description: "Review and moderate forum content",
    icon: MessageSquare,
    href: "/dashboard/moderation",
    color: "text-orange-600",
    bgColor: "bg-orange-50 hover:bg-orange-100",
  },
  {
    title: "View Analytics",
    description: "Platform statistics and insights",
    icon: BarChart3,
    href: "/dashboard/analytics",
    color: "text-indigo-600",
    bgColor: "bg-indigo-50 hover:bg-indigo-100",
  },
  {
    title: "System Settings",
    description: "Configure platform settings",
    icon: Settings,
    href: "/dashboard/settings",
    color: "text-gray-600",
    bgColor: "bg-gray-50 hover:bg-gray-100",
  },
  {
    title: "Discord Integration",
    description: "Send notifications to Discord",
    icon: MessageCircle,
    href: "/dashboard/discord",
    color: "text-indigo-600",
    bgColor: "bg-indigo-50 hover:bg-indigo-100",
  },
];

const moderatorActions = [
  {
    title: "Moderate Content",
    description: "Review reported content and users",
    icon: Shield,
    href: "/dashboard/moderation",
    color: "text-red-600",
    bgColor: "bg-red-50 hover:bg-red-100",
  },
  {
    title: "Create News",
    description: "Write news articles for your game",
    icon: Newspaper,
    href: "/dashboard/news/create",
    color: "text-purple-600",
    bgColor: "bg-purple-50 hover:bg-purple-100",
  },
  {
    title: "View Reports",
    description: "Review user reports and flags",
    icon: AlertTriangle,
    href: "/dashboard/reports",
    color: "text-yellow-600",
    bgColor: "bg-yellow-50 hover:bg-yellow-100",
  },
  {
    title: "Game Analytics",
    description: "View statistics for your game",
    icon: BarChart3,
    href: "/dashboard/analytics",
    color: "text-indigo-600",
    bgColor: "bg-indigo-50 hover:bg-indigo-100",
  },
];

export function QuickActions({ userRole }: QuickActionsProps) {
  const actions = userRole === "ADMIN" ? adminActions : moderatorActions;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Quick Actions</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {actions.map((action) => {
            const Icon = action.icon;

            return (
              <Link key={action.title} href={action.href}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start p-4 h-auto ${action.bgColor} border-0`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${action.bgColor}`}>
                      <Icon className={`w-4 h-4 ${action.color}`} />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-gray-900">
                        {action.title}
                      </div>
                      <div className="text-sm text-gray-600">
                        {action.description}
                      </div>
                    </div>
                  </div>
                </Button>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
