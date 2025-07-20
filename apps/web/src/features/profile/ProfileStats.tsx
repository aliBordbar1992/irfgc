import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  MessageSquare,
  Users,
  FileText,
  Trophy,
  UserPlus,
} from "lucide-react";

interface ProfileStatsProps {
  stats: {
    events: number;
    newsPosts: number;
    lfgPosts: number;
    forumThreads: number;
    forumReplies: number;
    eventRegistrations: number;
  };
}

export function ProfileStats({ stats }: ProfileStatsProps) {
  const statItems = [
    {
      label: "Events Created",
      value: stats.events,
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: "News Articles",
      value: stats.newsPosts,
      icon: FileText,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      label: "LFG Posts",
      value: stats.lfgPosts,
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      label: "Forum Threads",
      value: stats.forumThreads,
      icon: MessageSquare,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      label: "Forum Replies",
      value: stats.forumReplies,
      icon: MessageSquare,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
    {
      label: "Event Registrations",
      value: stats.eventRegistrations,
      icon: Trophy,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="w-5 h-5" />
          Activity Stats
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {statItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="flex items-center justify-between p-3 rounded-lg border"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${item.bgColor}`}>
                    <Icon className={`w-4 h-4 ${item.color}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {item.label}
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-lg font-semibold">
                  {item.value}
                </Badge>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
