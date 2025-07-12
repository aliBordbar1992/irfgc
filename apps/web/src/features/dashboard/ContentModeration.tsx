"use client";

import { useState } from "react";
import { UserRole } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertTriangle,
  MessageSquare,
  Gamepad2,
  MoreHorizontal,
  Eye,
  Lock,
  Pin,
  Trash2,
  Shield,
  UserX,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface ContentModerationProps {
  data: {
    reportedContent: any[];
    recentForumPosts: any[];
    recentLFGPosts: any[];
  };
  userRole: UserRole;
}

export function ContentModeration({ data, userRole }: ContentModerationProps) {
  const [activeTab, setActiveTab] = useState("reports");

  const handleModerationAction = async (
    contentId: string,
    action: string,
    contentType: string
  ) => {
    try {
      const response = await fetch(
        `/api/moderation/${contentType}/${contentId}/${action}`,
        {
          method: "PATCH",
        }
      );

      if (response.ok) {
        // Refresh the page or update the state
        window.location.reload();
      }
    } catch (error) {
      console.error(`Error ${action} ${contentType}:`, error);
    }
  };

  const getReportStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "RESOLVED":
        return <Badge className="bg-green-100 text-green-800">Resolved</Badge>;
      case "DISMISSED":
        return <Badge className="bg-gray-100 text-gray-800">Dismissed</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="reports" className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4" />
            <span>Reports ({data.reportedContent.length})</span>
          </TabsTrigger>
          <TabsTrigger value="forum" className="flex items-center space-x-2">
            <MessageSquare className="w-4 h-4" />
            <span>Forum Posts ({data.recentForumPosts.length})</span>
          </TabsTrigger>
          <TabsTrigger value="lfg" className="flex items-center space-x-2">
            <Gamepad2 className="w-4 h-4" />
            <span>LFG Posts ({data.recentLFGPosts.length})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reported Content</CardTitle>
            </CardHeader>
            <CardContent>
              {data.reportedContent.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <p className="text-gray-600">No pending reports</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {data.reportedContent.map((report) => (
                    <div key={report.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium">{report.reason}</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            Reported by {report.reporter.name} on{" "}
                            {formatDate(report.createdAt)}
                          </p>
                        </div>
                        {getReportStatusBadge(report.status)}
                      </div>
                      <p className="text-sm text-gray-700 mb-3">
                        {report.description}
                      </p>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-2" />
                          View Content
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleModerationAction(
                              report.id,
                              "resolve",
                              "reports"
                            )
                          }
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Resolve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleModerationAction(
                              report.id,
                              "dismiss",
                              "reports"
                            )
                          }
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Dismiss
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forum" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Forum Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.recentForumPosts.map((post) => (
                  <div key={post.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium">{post.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          By {post.author.name} in {post.game.fullName} •{" "}
                          {formatDate(post.createdAt)}
                        </p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" />
                            View Post
                          </DropdownMenuItem>
                          {!post.isPinned && (
                            <DropdownMenuItem
                              onClick={() =>
                                handleModerationAction(post.id, "pin", "forum")
                              }
                            >
                              <Pin className="w-4 h-4 mr-2" />
                              Pin Post
                            </DropdownMenuItem>
                          )}
                          {!post.isLocked && (
                            <DropdownMenuItem
                              onClick={() =>
                                handleModerationAction(post.id, "lock", "forum")
                              }
                            >
                              <Lock className="w-4 h-4 mr-2" />
                              Lock Post
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() =>
                              handleModerationAction(post.id, "delete", "forum")
                            }
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Post
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                      {post.content}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{post._count.replies} replies</span>
                      <span>{post.viewCount} views</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lfg" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent LFG Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.recentLFGPosts.map((post) => (
                  <div key={post.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium">{post.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          By {post.author.name} in {post.game.fullName} •{" "}
                          {formatDate(post.createdAt)}
                        </p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" />
                            View Post
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleModerationAction(
                                post.id,
                                "deactivate",
                                "lfg"
                              )
                            }
                          >
                            <Shield className="w-4 h-4 mr-2" />
                            Deactivate
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleModerationAction(post.id, "delete", "lfg")
                            }
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Post
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">
                      {post.description}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Platform: {post.platform}</span>
                      <span>Region: {post.region}</span>
                      {post.rank && <span>Rank: {post.rank}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
