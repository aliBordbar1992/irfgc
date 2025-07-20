"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useGames } from "@/hooks/useGames";

// Mock data for charts - in real app, this would come from API
const userGrowthData = [
  { month: "Jan", users: 120, events: 8, posts: 45 },
  { month: "Feb", users: 180, events: 12, posts: 67 },
  { month: "Mar", users: 250, events: 15, posts: 89 },
  { month: "Apr", users: 320, events: 18, posts: 112 },
  { month: "May", users: 410, events: 22, posts: 145 },
  { month: "Jun", users: 520, events: 25, posts: 178 },
];

const activityData = [
  { day: "Mon", events: 4, posts: 12, users: 45 },
  { day: "Tue", events: 6, posts: 18, users: 52 },
  { day: "Wed", events: 3, posts: 15, users: 38 },
  { day: "Thu", events: 8, posts: 22, users: 67 },
  { day: "Fri", events: 5, posts: 19, users: 58 },
  { day: "Sat", events: 12, posts: 35, users: 89 },
  { day: "Sun", events: 7, posts: 28, users: 72 },
];

// Colors for game distribution chart
const gameColors = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#8B5CF6",
  "#EF4444",
  "#06B6D4",
];

export function DashboardOverview() {
  const { games } = useGames({ isActive: true });

  // Generate game distribution data from actual games
  const gameDistributionData = games.map((game, index) => ({
    name: game.fullName,
    value: game._count?.events || 0,
    color: gameColors[index % gameColors.length],
  }));

  return (
    <div className="space-y-6">
      {/* User Growth Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Growth</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="users"
                stroke="#3B82F6"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="events"
                stroke="#10B981"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="posts"
                stroke="#F59E0B"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Game Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Game Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={gameDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${((percent || 0) * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {gameDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Weekly Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="events" fill="#3B82F6" />
                <Bar dataKey="posts" fill="#10B981" />
                <Bar dataKey="users" fill="#F59E0B" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
