"use client";

import { useState, useEffect } from "react";
import { UserRole } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Eye,
  Shield,
  ShieldOff,
  UserX,
  Mail,
} from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  _count: {
    events: number;
    newsPosts: number;
    lfgPosts: number;
    forumThreads: number;
  };
}

interface UserManagementProps {
  initialUsers: User[];
}

export function UserManagement({ initialUsers }: UserManagementProps) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [filteredUsers, setFilteredUsers] = useState<User[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(false); // Used in handleRoleChange and handleUserAction

  useEffect(() => {
    let filtered = users;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply role filter
    if (roleFilter) {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    setFilteredUsers(filtered);
  }, [users, searchQuery, roleFilter]);

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/users/${userId}/role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (response.ok) {
        setUsers((prev) =>
          prev.map((user) =>
            user.id === userId ? { ...user, role: newRole } : user
          )
        );
      }
    } catch (error) {
      console.error("Error updating user role:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserAction = async (userId: string, action: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/users/${userId}/${action}`, {
        method: "PATCH",
      });

      if (response.ok) {
        // Refresh user list or update specific user
        // For now, we'll just log the action
        console.log(`User ${userId} ${action} successful`);
      }
    } catch (error) {
      console.error(`Error ${action} user:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case "ADMIN":
        return "bg-red-100 text-red-800";
      case "MODERATOR":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-green-100 text-green-800";
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <span>Filters</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="MODERATOR">Moderator</SelectItem>
                <SelectItem value="PLAYER">Player</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setRoleFilter("all");
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Activity</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-gray-600">{user.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getRoleBadgeColor(user.role)}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{formatDate(user.createdAt)}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm space-y-1">
                      <div>{user._count.events} events</div>
                      <div>{user._count.newsPosts} news</div>
                      <div>{user._count.lfgPosts} LFG posts</div>
                      <div>{user._count.forumThreads} forum threads</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" />
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Mail className="w-4 h-4 mr-2" />
                          Send Message
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit User
                        </DropdownMenuItem>
                        {user.role !== "ADMIN" && (
                          <DropdownMenuItem
                            onClick={() => handleRoleChange(user.id, "ADMIN")}
                          >
                            <Shield className="w-4 h-4 mr-2" />
                            Make Admin
                          </DropdownMenuItem>
                        )}
                        {user.role !== "MODERATOR" && (
                          <DropdownMenuItem
                            onClick={() =>
                              handleRoleChange(user.id, "MODERATOR")
                            }
                          >
                            <Shield className="w-4 h-4 mr-2" />
                            Make Moderator
                          </DropdownMenuItem>
                        )}
                        {user.role !== "PLAYER" && (
                          <DropdownMenuItem
                            onClick={() => handleRoleChange(user.id, "PLAYER")}
                          >
                            <ShieldOff className="w-4 h-4 mr-2" />
                            Make Player
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={() => handleUserAction(user.id, "suspend")}
                          className="text-yellow-600"
                        >
                          <UserX className="w-4 h-4 mr-2" />
                          Suspend User
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleUserAction(user.id, "ban")}
                          className="text-red-600"
                        >
                          <UserX className="w-4 h-4 mr-2" />
                          Ban User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
