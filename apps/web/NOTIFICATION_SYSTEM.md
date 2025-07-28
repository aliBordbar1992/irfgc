# Notification System Implementation

A comprehensive notification system that allows users to receive notifications for various activities, with a focus on comment replies and user engagement.

## Overview

The notification system provides:
- **Comment reply notifications** - Users get notified when someone replies to their comments
- **User profile integration** - Users can see their comments in their profile
- **Real-time notification badges** - Unread notification count displayed in the user menu
- **Notification management** - Mark notifications as read individually or all at once
- **Extensible architecture** - Easy to add new notification types

## Architecture

### Database Schema

```prisma
model Notification {
  id          String           @id @default(cuid())
  userId      String           // User receiving the notification
  type        NotificationType
  title       String
  message     String
  contentId   String?          // ID of the related content
  contentType ContentType?     // Type of the related content
  isRead      Boolean          @default(false)
  createdAt   DateTime         @default(now())

  // Relations
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId, isRead])
  @@index([createdAt])
  @@map("notifications")
}

enum NotificationType {
  COMMENT_REPLY
  EVENT_REGISTRATION
  FORUM_REPLY
  LFG_MATCH
  SYSTEM
}
```

### Key Features

1. **Comment Reply Notifications**: Automatically created when someone replies to a user's comment
2. **User Profile Comments**: Users can see all their comments in their profile
3. **Notification Badge**: Real-time unread notification count in the user menu
4. **Notification Management**: Mark as read functionality
5. **Content Linking**: Notifications link to the relevant content

## API Endpoints

### GET `/api/notifications`

Retrieves user notifications with pagination and filtering.

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Notifications per page (default: 20)
- `unreadOnly`: Filter to unread notifications only (default: false)

**Response:**
```json
{
  "data": {
    "notifications": [...],
    "totalNotifications": 42,
    "unreadCount": 5,
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 42,
      "totalPages": 3
    }
  }
}
```

### PATCH `/api/notifications`

Marks notifications as read.

**Request Body:**
```json
{
  "notificationIds": ["id1", "id2"], // Optional: specific notifications
  "markAllAsRead": true              // Optional: mark all as read
}
```

## Client-Side Integration

### Hooks

#### `useNotifications()`
Hook for managing user notifications.

```typescript
import { useNotifications } from "@/hooks/useNotifications";

function NotificationsComponent() {
  const { data, loading, error, markAsRead } = useNotifications({
    page: 1,
    limit: 20,
    unreadOnly: false,
    enabled: true,
  });

  const handleMarkAsRead = async (notificationId: string) => {
    await markAsRead([notificationId]);
  };

  const handleMarkAllAsRead = async () => {
    await markAsRead(); // No IDs = mark all as read
  };
}
```

#### `useUserComments()`
Hook for fetching user comments.

```typescript
import { useUserComments } from "@/hooks/useUserComments";

function UserCommentsComponent({ userId }: { userId: string }) {
  const { data, loading, error } = useUserComments({
    userId,
    page: 1,
    limit: 20,
    enabled: true,
  });
}
```

### Components

#### `Notifications`
Main notifications component that displays the notification list.

```typescript
import { Notifications } from "@/components/Notifications";

function MyPage() {
  return (
    <div>
      <Notifications className="mt-6" />
    </div>
  );
}
```

#### `UserComments`
Component that displays user comments in their profile.

```typescript
import { UserComments } from "@/components/UserComments";

function ProfilePage({ userId }: { userId: string }) {
  return (
    <div>
      <UserComments userId={userId} className="mt-6" />
    </div>
  );
}
```

#### `NotificationBadge`
Component that shows unread notification count.

```typescript
import { NotificationBadge } from "@/components/NotificationBadge";

function UserMenu() {
  return (
    <div className="relative">
      <Avatar />
      <NotificationBadge />
    </div>
  );
}
```

## User Profile Integration

### Profile Page Updates

The profile page now includes:
1. **User Comments Section**: Shows all comments made by the user
2. **Notifications Section**: Shows user's notifications
3. **Content Context**: Each comment shows which content it was made on

### Features

- **Comment History**: Users can see all their comments with timestamps
- **Content Links**: Each comment links to the original content
- **Reply Context**: Shows if a comment was a reply to someone else
- **Pagination**: Load more comments functionality

## Notification Types

### Current Types

1. **COMMENT_REPLY**: When someone replies to a user's comment
2. **EVENT_REGISTRATION**: When a user registers for an event (future)
3. **FORUM_REPLY**: When someone replies to a forum post (future)
4. **LFG_MATCH**: When there's a match in LFG (future)
5. **SYSTEM**: System notifications (future)

### Adding New Notification Types

1. **Update NotificationType enum** in schema.prisma
2. **Add notification creation logic** in the relevant API endpoint
3. **Update notification components** to handle the new type
4. **Add appropriate icons and colors** for the new type

## Usage Examples

### Basic Integration

```typescript
// In a user profile page
import { UserComments } from "@/components/UserComments";
import { Notifications } from "@/components/Notifications";

function UserProfile({ user }: { user: User }) {
  return (
    <div>
      <h1>User Profile</h1>
      
      {/* User comments */}
      <UserComments userId={user.id} />
      
      {/* User notifications */}
      <Notifications />
    </div>
  );
}
```

### Notification Badge in Navigation

```typescript
// In the user menu
import { NotificationBadge } from "@/components/NotificationBadge";

function UserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative">
          <Avatar />
          <NotificationBadge />
        </Button>
      </DropdownMenuTrigger>
      {/* Menu content */}
    </DropdownMenu>
  );
}
```

### Custom Notification Handling

```typescript
import { useNotifications } from "@/hooks/useNotifications";

function CustomNotificationHandler() {
  const { data, markAsRead } = useNotifications({
    unreadOnly: true,
    enabled: true,
  });

  const handleNotificationClick = async (notification: Notification) => {
    // Mark as read when clicked
    await markAsRead([notification.id]);
    
    // Navigate to content
    if (notification.contentId) {
      router.push(`/content/${notification.contentId}`);
    }
  };
}
```

## Testing

### Test Page

Visit `/test-notifications` to test the notification system:

1. **Create Test Comments**: Add comments to see them in your profile
2. **Create Test Replies**: Add replies to trigger notifications
3. **View Notifications**: See real-time notification updates
4. **Test Badge**: See the notification badge in the user menu

### Manual Testing

1. **Create a comment** on any content
2. **Have another user reply** to your comment
3. **Check notifications** for the reply notification
4. **Visit your profile** to see your comment history
5. **Mark notifications as read** to test the functionality

## Future Enhancements

### Planned Features

- **Email Notifications**: Send email notifications for important events
- **Push Notifications**: Browser push notifications
- **Notification Preferences**: User settings for notification types
- **Real-time Updates**: WebSocket integration for live notifications
- **Notification Templates**: Customizable notification messages
- **Bulk Actions**: Bulk mark as read/delete notifications

### Extensibility

The system is designed to be easily extensible:

- **New Notification Types**: Add new enum values and creation logic
- **Custom Notification Content**: Extend the notification model
- **Notification Channels**: Add email, push, SMS, etc.
- **Notification Rules**: Add complex notification logic
- **Notification Analytics**: Track notification engagement

## Performance Considerations

### Database Indexes

- `@@index([userId, isRead])` for efficient user notification queries
- `@@index([createdAt])` for chronological sorting

### Caching Strategy

- Consider caching notification counts for frequently accessed users
- Implement cache invalidation on new notifications
- Use Redis for high-traffic scenarios

### Query Optimization

- Use pagination to limit result sets
- Lazy load notification content
- Optimize notification counts with database aggregation

## Security Considerations

### Authentication

- All notification endpoints require authentication
- Users can only access their own notifications
- Notification creation is validated and sanitized

### Data Validation

- Notification content is validated
- User permissions are checked
- Content IDs are validated against existing content

### Privacy

- Notifications are user-specific
- No cross-user notification access
- Soft delete for data integrity 