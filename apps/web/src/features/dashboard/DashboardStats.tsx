"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  Calendar,
  Newspaper,
  Gamepad2,
  MessageSquare,
} from "lucide-react";

interface DashboardStatsProps {
  stats: {
    totalUsers: number;
    totalEvents: number;
    totalNewsPosts: number;
    totalLFGPosts: number;
    totalForumThreads: number;
  };
}

const statCards = [
  {
    title: "Total Users",
    value: "totalUsers",
    icon: Users,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    description: "Registered community members",
  },
  {
    title: "Total Events",
    value: "totalEvents",
    icon: Calendar,
    color: "text-green-600",
    bgColor: "bg-green-50",
    description: "Tournaments and casual events",
  },
  {
    title: "News Articles",
    value: "totalNewsPosts",
    icon: Newspaper,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    description: "Published news and updates",
  },
  {
    title: "LFG Posts",
    value: "totalLFGPosts",
    icon: Gamepad2,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    description: "Looking for game requests",
  },
  {
    title: "Forum Threads",
    value: "totalForumThreads",
    icon: MessageSquare,
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
    description: "Community discussions",
  },
];

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <>
      {statCards.map((card) => {
        const Icon = card.icon;
        const value = stats[card.value as keyof typeof stats];

        return (
          <Card key={card.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {value.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 mt-1">{card.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </>
  );
}
