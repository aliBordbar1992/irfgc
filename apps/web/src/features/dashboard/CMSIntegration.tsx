"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Newspaper,
  Gamepad2,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Save,
  X,
} from "lucide-react";

interface CMSIntegrationProps {
  gameSlug?: string;
}

interface CMSEvent {
  id: string;
  title: string;
  description: string;
  type: string;
  status: string;
  startDate: string;
  endDate: string;
  location?: string;
  maxParticipants?: number;
  featured: boolean;
}

interface CMSNewsPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  featured: boolean;
  publishedAt: string;
}

export function CMSIntegration({ gameSlug }: CMSIntegrationProps) {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("events");
  const [events, setEvents] = useState<CMSEvent[]>([]);
  const [newsPosts, setNewsPosts] = useState<CMSNewsPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [editingItem, setEditingItem] = useState<string | null>(null);

  // Form states
  const [eventForm, setEventForm] = useState({
    title: "",
    description: "",
    type: "TOURNAMENT",
    startDate: "",
    endDate: "",
    location: "",
    maxParticipants: "",
    featured: false,
  });

  const [newsForm, setNewsForm] = useState({
    title: "",
    content: "",
    excerpt: "",
    category: "GENERAL",
    featured: false,
  });

  useEffect(() => {
    if (session?.user?.role === "ADMIN") {
      fetchCMSData();
    }
  }, [session, gameSlug]);

  const fetchCMSData = async () => {
    setLoading(true);
    try {
      // Fetch events and news from Strapi
      const [eventsResponse, newsResponse] = await Promise.all([
        fetch(`/api/cms/events${gameSlug ? `?gameSlug=${gameSlug}` : ""}`),
        fetch(`/api/cms/news${gameSlug ? `?gameSlug=${gameSlug}` : ""}`),
      ]);

      if (eventsResponse.ok) {
        const eventsData = await eventsResponse.json();
        setEvents(eventsData.data || []);
      }

      if (newsResponse.ok) {
        const newsData = await newsResponse.json();
        setNewsPosts(newsData.data || []);
      }
    } catch (error) {
      console.error("Error fetching CMS data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async () => {
    if (!eventForm.title || !eventForm.description) return;

    setIsCreating(true);
    try {
      const response = await fetch("/api/cms/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...eventForm,
          gameSlug,
          maxParticipants: eventForm.maxParticipants
            ? parseInt(eventForm.maxParticipants)
            : undefined,
        }),
      });

      if (response.ok) {
        await fetchCMSData();
        resetEventForm();
        setIsCreating(false);
      }
    } catch (error) {
      console.error("Error creating event:", error);
      setIsCreating(false);
    }
  };

  const handleCreateNews = async () => {
    if (!newsForm.title || !newsForm.content || !newsForm.excerpt) return;

    setIsCreating(true);
    try {
      const response = await fetch("/api/cms/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newsForm,
          gameSlug,
        }),
      });

      if (response.ok) {
        await fetchCMSData();
        resetNewsForm();
        setIsCreating(false);
      }
    } catch (error) {
      console.error("Error creating news post:", error);
      setIsCreating(false);
    }
  };

  const handleUpdateEvent = async (id: string) => {
    setIsCreating(true);
    try {
      const response = await fetch(`/api/cms/events/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...eventForm,
          gameSlug,
          maxParticipants: eventForm.maxParticipants
            ? parseInt(eventForm.maxParticipants)
            : undefined,
        }),
      });

      if (response.ok) {
        await fetchCMSData();
        setEditingItem(null);
        resetEventForm();
        setIsCreating(false);
      }
    } catch (error) {
      console.error("Error updating event:", error);
      setIsCreating(false);
    }
  };

  const handleUpdateNews = async (id: string) => {
    setIsCreating(true);
    try {
      const response = await fetch(`/api/cms/news/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newsForm,
          gameSlug,
        }),
      });

      if (response.ok) {
        await fetchCMSData();
        setEditingItem(null);
        resetNewsForm();
        setIsCreating(false);
      }
    } catch (error) {
      console.error("Error updating news post:", error);
      setIsCreating(false);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
      const response = await fetch(`/api/cms/events/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchCMSData();
      }
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const handleDeleteNews = async (id: string) => {
    if (!confirm("Are you sure you want to delete this news post?")) return;

    try {
      const response = await fetch(`/api/cms/news/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchCMSData();
      }
    } catch (error) {
      console.error("Error deleting news post:", error);
    }
  };

  const resetEventForm = () => {
    setEventForm({
      title: "",
      description: "",
      type: "TOURNAMENT",
      startDate: "",
      endDate: "",
      location: "",
      maxParticipants: "",
      featured: false,
    });
  };

  const resetNewsForm = () => {
    setNewsForm({
      title: "",
      content: "",
      excerpt: "",
      category: "GENERAL",
      featured: false,
    });
  };

  const startEditEvent = (event: CMSEvent) => {
    setEditingItem(event.id);
    setEventForm({
      title: event.title,
      description: event.description,
      type: event.type,
      startDate: event.startDate.split("T")[0],
      endDate: event.endDate.split("T")[0],
      location: event.location || "",
      maxParticipants: event.maxParticipants?.toString() || "",
      featured: event.featured,
    });
  };

  const startEditNews = (news: CMSNewsPost) => {
    setEditingItem(news.id);
    setNewsForm({
      title: news.title,
      content: news.content,
      excerpt: news.excerpt,
      category: news.category,
      featured: news.featured,
    });
  };

  const cancelEdit = () => {
    setEditingItem(null);
    resetEventForm();
    resetNewsForm();
  };

  if (session?.user?.role !== "ADMIN") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>CMS Integration</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">
            Only administrators can access CMS integration.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ExternalLink className="w-5 h-5" />
            <span>Content Management System</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger
                value="events"
                className="flex items-center space-x-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Events ({events.length})</span>
              </TabsTrigger>
              <TabsTrigger value="news" className="flex items-center space-x-2">
                <Newspaper className="w-4 h-4" />
                <span>News ({newsPosts.length})</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="events" className="space-y-4">
              {/* Create Event Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Plus className="w-4 h-4" />
                    <span>{editingItem ? "Edit Event" : "Create Event"}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="eventTitle">Title</Label>
                      <Input
                        id="eventTitle"
                        value={eventForm.title}
                        onChange={(e) =>
                          setEventForm({ ...eventForm, title: e.target.value })
                        }
                        placeholder="Event title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="eventType">Type</Label>
                      <Select
                        value={eventForm.type}
                        onValueChange={(value) =>
                          setEventForm({ ...eventForm, type: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="TOURNAMENT">Tournament</SelectItem>
                          <SelectItem value="CASUAL">Casual</SelectItem>
                          <SelectItem value="ONLINE">Online</SelectItem>
                          <SelectItem value="OFFLINE">Offline</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={eventForm.startDate}
                        onChange={(e) =>
                          setEventForm({
                            ...eventForm,
                            startDate: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="endDate">End Date</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={eventForm.endDate}
                        onChange={(e) =>
                          setEventForm({
                            ...eventForm,
                            endDate: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={eventForm.location}
                        onChange={(e) =>
                          setEventForm({
                            ...eventForm,
                            location: e.target.value,
                          })
                        }
                        placeholder="Event location"
                      />
                    </div>
                    <div>
                      <Label htmlFor="maxParticipants">Max Participants</Label>
                      <Input
                        id="maxParticipants"
                        type="number"
                        value={eventForm.maxParticipants}
                        onChange={(e) =>
                          setEventForm({
                            ...eventForm,
                            maxParticipants: e.target.value,
                          })
                        }
                        placeholder="Maximum participants"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="eventDescription">Description</Label>
                    <Textarea
                      id="eventDescription"
                      value={eventForm.description}
                      onChange={(e) =>
                        setEventForm({
                          ...eventForm,
                          description: e.target.value,
                        })
                      }
                      placeholder="Event description"
                      rows={4}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="featuredEvent"
                      checked={eventForm.featured}
                      onChange={(e) =>
                        setEventForm({
                          ...eventForm,
                          featured: e.target.checked,
                        })
                      }
                    />
                    <Label htmlFor="featuredEvent">Featured Event</Label>
                  </div>
                  <div className="flex space-x-2">
                    {editingItem ? (
                      <>
                        <Button
                          onClick={() => handleUpdateEvent(editingItem)}
                          disabled={isCreating}
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Update Event
                        </Button>
                        <Button variant="outline" onClick={cancelEdit}>
                          <X className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button onClick={handleCreateEvent} disabled={isCreating}>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Event
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Events List */}
              <Card>
                <CardHeader>
                  <CardTitle>Events</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-2">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className="h-16 bg-gray-200 rounded animate-pulse"
                        />
                      ))}
                    </div>
                  ) : events.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">
                      No events found
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {events.map((event) => (
                        <div
                          key={event.id}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="font-medium">{event.title}</h3>
                              {event.featured && (
                                <Badge variant="secondary">Featured</Badge>
                              )}
                              <Badge>{event.type}</Badge>
                              <Badge variant="outline">{event.status}</Badge>
                            </div>
                            <p className="text-sm text-gray-600">
                              {new Date(event.startDate).toLocaleDateString()} -{" "}
                              {new Date(event.endDate).toLocaleDateString()}
                            </p>
                            {event.location && (
                              <p className="text-sm text-gray-500">
                                📍 {event.location}
                              </p>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => startEditEvent(event)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteEvent(event.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="news" className="space-y-4">
              {/* Create News Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Plus className="w-4 h-4" />
                    <span>
                      {editingItem ? "Edit News Post" : "Create News Post"}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="newsTitle">Title</Label>
                      <Input
                        id="newsTitle"
                        value={newsForm.title}
                        onChange={(e) =>
                          setNewsForm({ ...newsForm, title: e.target.value })
                        }
                        placeholder="News title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="newsCategory">Category</Label>
                      <Select
                        value={newsForm.category}
                        onValueChange={(value) =>
                          setNewsForm({ ...newsForm, category: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="GENERAL">General</SelectItem>
                          <SelectItem value="ANNOUNCEMENT">
                            Announcement
                          </SelectItem>
                          <SelectItem value="TOURNAMENT">Tournament</SelectItem>
                          <SelectItem value="COMMUNITY">Community</SelectItem>
                          <SelectItem value="GAME_UPDATE">
                            Game Update
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="newsExcerpt">Excerpt</Label>
                    <Textarea
                      id="newsExcerpt"
                      value={newsForm.excerpt}
                      onChange={(e) =>
                        setNewsForm({ ...newsForm, excerpt: e.target.value })
                      }
                      placeholder="Brief summary of the news"
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label htmlFor="newsContent">Content</Label>
                    <Textarea
                      id="newsContent"
                      value={newsForm.content}
                      onChange={(e) =>
                        setNewsForm({ ...newsForm, content: e.target.value })
                      }
                      placeholder="Full news content"
                      rows={6}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="featuredNews"
                      checked={newsForm.featured}
                      onChange={(e) =>
                        setNewsForm({ ...newsForm, featured: e.target.checked })
                      }
                    />
                    <Label htmlFor="featuredNews">Featured News</Label>
                  </div>
                  <div className="flex space-x-2">
                    {editingItem ? (
                      <>
                        <Button
                          onClick={() => handleUpdateNews(editingItem)}
                          disabled={isCreating}
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Update News
                        </Button>
                        <Button variant="outline" onClick={cancelEdit}>
                          <X className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button onClick={handleCreateNews} disabled={isCreating}>
                        <Plus className="w-4 h-4 mr-2" />
                        Create News
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* News List */}
              <Card>
                <CardHeader>
                  <CardTitle>News Posts</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-2">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className="h-16 bg-gray-200 rounded animate-pulse"
                        />
                      ))}
                    </div>
                  ) : newsPosts.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">
                      No news posts found
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {newsPosts.map((news) => (
                        <div
                          key={news.id}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="font-medium">{news.title}</h3>
                              {news.featured && (
                                <Badge variant="secondary">Featured</Badge>
                              )}
                              <Badge>{news.category}</Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              {news.excerpt}
                            </p>
                            <p className="text-xs text-gray-500">
                              Published:{" "}
                              {new Date(news.publishedAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => startEditNews(news)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteNews(news.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
