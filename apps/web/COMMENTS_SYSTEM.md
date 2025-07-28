# Comments System

A comprehensive and extensible comments system that allows users to comment on any content type, with support for replies, reactions, and sorting.

## Overview

The comments system provides:
- **Extensible architecture** - Works with any content type (news, events, forum posts, etc.)
- **Nested replies** - Users can reply to comments with unlimited nesting
- **Comment reactions** - Users can react to comments with emojis
- **Sorting options** - Sort by date (newest/oldest) or replies (most/least)
- **Authentication required** - Only logged-in users can comment
- **Soft delete** - Comments are soft deleted, preserving data integrity
- **User profile integration** - Users can see their comments in their profile

## Architecture

### Database Schema

```prisma
model Comment {
  id          String      @id @default(cuid())
  content     String
  contentId   String      // ID of the content being commented on
  contentType ContentType
  authorId    String
  parentId    String?     // For replies to comments
  isDeleted   Boolean     @default(false) // Soft delete
  createdAt   DateTime    @default(now())
  updatedAt   DateTime?

  // Relations
  author   User           @relation(fields: [authorId], references: [id], onDelete: Cascade)
  parent   Comment?       @relation("CommentReplies", fields: [parentId], references: [id], onDelete: Cascade)
  replies  Comment[]      @relation("CommentReplies")

  @@index([contentId, contentType])
  @@index([authorId])
  @@index([parentId])
  @@map("comments")
}
```

**Note**: Comments use the existing `Reaction` table with `contentType: "COMMENT"` for reactions, maintaining consistency with other content types.

### Key Features

1. **Polymorphic Content**: Comments can be attached to any content type via `contentId` and `contentType`
2. **Nested Replies**: Comments can have parent comments, enabling threaded discussions
3. **Soft Delete**: Comments are marked as deleted rather than physically removed
4. **Cascade Deletion**: Comments are deleted when users are deleted
5. **Optimized Indexes**: Efficient queries for content-based and user-based lookups

## API Endpoints

### POST `/api/comments`

Creates a new comment or reply.

**Request Body:**
```json
{
  "content": "string",
  "contentId": "string",
  "contentType": "NEWS" | "POST" | "EVENT" | "FORUM_THREAD" | "FORUM_REPLY" | "LFG_POST" | "CHAT_MESSAGE",
  "parentId": "string" // Optional, for replies
}
```

**Response:**
```json
{
  "success": true,
  "action": "created",
  "comment": {
    "id": "string",
    "content": "string",
    "contentId": "string",
    "contentType": "string",
    "authorId": "string",
    "parentId": "string | null",
    "isDeleted": false,
    "createdAt": "string",
    "updatedAt": "string",
    "author": {
      "id": "string",
      "name": "string",
      "avatar": "string | null"
    },
    "parent": {
      "id": "string",
      "author": {
        "id": "string",
        "name": "string"
      }
    } | null,
    "_count": {
      "replies": 0,
      "reactions": 0
    }
  }
}
```

### GET `/api/comments`

Retrieves comments for content with pagination and sorting.

**Query Parameters:**
- `contentId`: Content identifier
- `contentType`: Content type
- `sortBy`: "date" | "replies" (default: "date")
- `sortOrder`: "asc" | "desc" (default: "desc")
- `page`: Page number (default: 1)
- `limit`: Comments per page (default: 20)
- `parentId`: For getting replies to a specific comment

**Response:**
```json
{
  "data": {
    "contentId": "string",
    "contentType": "string",
    "comments": [...],
    "totalComments": 42,
    "userComment": {...} | null,
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 42,
      "totalPages": 3
    }
  }
}
```

### PUT `/api/comments?commentId=string`

Updates a comment.

**Request Body:**
```json
{
  "content": "string"
}
```

### DELETE `/api/comments?commentId=string`

Soft deletes a comment.

### Comment Reactions

Comments use the existing reactions system. To react to a comment:

**POST `/api/reactions`**
```json
{
  "contentId": "comment-id",
  "contentType": "COMMENT",
  "emoji": "string"
}
```

**GET `/api/reactions?contentId=comment-id&contentType=COMMENT`**

Retrieves reactions for a comment.

### GET `/api/users/[userId]/comments`

Retrieves comments made by a specific user.

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Comments per page (default: 20)

## Client-Side Integration

### Hooks

#### `useComments()`
Hook for creating, updating, and deleting comments.

```typescript
import { useComments } from "@/hooks/useComments";

function MyComponent() {
  const { createComment, updateComment, deleteComment } = useComments({
    contentId: "news-123",
    contentType: "NEWS",
    onSuccess: (response) => console.log("Comment action successful:", response),
    onError: (error) => console.error("Comment action failed:", error)
  });

  const handleCreateComment = async () => {
    await createComment("Great article!", "parent-comment-id"); // parentId is optional
  };
}
```

#### `useCommentData()`
Hook for fetching comment data with sorting and pagination.

```typescript
import { useCommentData } from "@/hooks/useCommentData";

function CommentsList() {
  const { data, loading, error, refetch } = useCommentData({
    contentId: "news-123",
    contentType: "NEWS",
    sortBy: "date",
    sortOrder: "desc",
    page: 1,
    limit: 20,
    enabled: true
  });

  if (loading) return <div>Loading comments...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {data?.comments.map(comment => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </div>
  );
}
```

#### Comment Reactions

Comments use the existing `useReactions()` hook:

```typescript
import { useReactions } from "@/hooks/useReactions";

function CommentReactions({ commentId }: { commentId: string }) {
  const { addReaction } = useReactions({
    contentId: commentId,
    contentType: "COMMENT",
    onSuccess: (response) => console.log("Reaction added:", response),
    onError: (error) => console.error("Failed to add reaction:", error)
  });

  const handleReaction = (emoji: string) => {
    addReaction(emoji);
  };
}
```

#### `useUserComments()`
Hook for fetching comments made by a specific user.

```typescript
import { useUserComments } from "@/hooks/useUserComments";

function UserProfile({ userId }: { userId: string }) {
  const { data, loading, error } = useUserComments({
    userId,
    page: 1,
    limit: 20,
    enabled: true
  });

  if (loading) return <div>Loading user comments...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h3>User Comments ({data?.totalComments})</h3>
      {data?.comments.map(comment => (
        <UserCommentItem key={comment.id} comment={comment} />
      ))}
    </div>
  );
}
```

### Components

#### `Comments`
Main comments component that displays the comment interface.

```typescript
import { Comments } from "@/components/Comments";

function NewsArticle({ article }: { article: NewsPost }) {
  return (
    <div>
      <h1>{article.title}</h1>
      <p>{article.content}</p>
      
      {/* Comments section */}
      <div className="mt-8">
        <Comments 
          contentId={article.id} 
          contentType="NEWS"
          className="mt-6"
        />
      </div>
    </div>
  );
}
```

#### `CommentItem`
Individual comment component with replies and actions. Uses the existing `Reactions` component for comment reactions.

```typescript
import { CommentItem } from "@/components/CommentItem";

function CommentItemExample({ comment }: { comment: Comment }) {
  return (
    <CommentItem
      comment={comment}
      contentId="news-123"
      contentType="NEWS"
      onCommentUpdate={() => {
        // Refresh comments list
        refetch();
      }}
    />
  );
}
```

## Usage Examples

### Basic Integration

```typescript
// In a news article page
import { Comments } from "@/components/Comments";

export default function NewsPage({ article }: { article: NewsPost }) {
  return (
    <div>
      <h1>{article.title}</h1>
      <p>{article.content}</p>
      
      {/* Comments section */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <Comments contentId={article.id} contentType="NEWS" />
      </div>
    </div>
  );
}

// In an event detail page
export default function EventPage({ event }: { event: Event }) {
  return (
    <div>
      <h1>{event.title}</h1>
      <p>{event.description}</p>
      
      {/* Comments section */}
      <Card>
        <CardHeader>
          <CardTitle>Comments</CardTitle>
        </CardHeader>
        <CardContent>
          <Comments contentId={event.id} contentType="EVENT" />
        </CardContent>
      </Card>
    </div>
  );
}
```

### User Profile Integration

```typescript
// In a user profile page
import { useUserComments } from "@/hooks/useUserComments";
import { CommentItem } from "@/components/CommentItem";

function UserProfile({ user }: { user: User }) {
  const { data, loading } = useUserComments({
    userId: user.id,
    enabled: true
  });

  return (
    <div>
      <h2>User Profile</h2>
      <p>Name: {user.name}</p>
      
      {/* User's comments */}
      <div className="mt-6">
        <h3>Comments ({data?.totalComments || 0})</h3>
        {loading ? (
          <div>Loading comments...</div>
        ) : (
          data?.comments.map(comment => (
            <CommentItem
              key={comment.id}
              comment={comment}
              contentId={comment.contentId}
              contentType={comment.contentType}
              onCommentUpdate={() => {}}
            />
          ))
        )}
      </div>
    </div>
  );
}
```

### Custom Comment Handling

```typescript
import { useComments } from "@/hooks/useComments";

function CustomCommentForm() {
  const { createComment } = useComments({
    contentId: "event-456",
    contentType: "EVENT",
    onSuccess: (response) => {
      if (response.action === "created") {
        console.log("New comment added!");
        // Refresh comments list
        refetch();
      }
    }
  });

  const handleSubmit = async (content: string, parentId?: string) => {
    try {
      await createComment(content, parentId);
    } catch (error) {
      console.error("Failed to create comment:", error);
    }
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      handleSubmit(formData.get("content") as string);
    }}>
      <textarea name="content" placeholder="Write a comment..." />
      <button type="submit">Post Comment</button>
    </form>
  );
}
```

## Extensibility

### Adding New Content Types

1. **Update ContentType enum** (if needed):
```prisma
enum ContentType {
  NEWS
  POST
  EVENT
  FORUM_THREAD
  FORUM_REPLY
  LFG_POST
  CHAT_MESSAGE
  COMMENT
  REVIEW   // New content type
  ARTICLE  // New content type
}
```

2. **Update API validation**:
```typescript
const createCommentSchema = z.object({
  content: z.string().min(1).max(1000),
  contentId: z.string().min(1),
  contentType: z.enum([
    "NEWS", "POST", "EVENT", "FORUM_THREAD", 
    "FORUM_REPLY", "LFG_POST", "CHAT_MESSAGE",
    "REVIEW", "ARTICLE"  // Add new types
  ]),
  parentId: z.string().optional(),
});
```

3. **Add Comments component to new content**:
```typescript
<Comments contentId={review.id} contentType="REVIEW" />
```

### Custom Comment Features

You can extend the system with:
- **Comment moderation** - Flag inappropriate comments
- **Comment notifications** - Notify users of replies
- **Comment search** - Search through comments
- **Comment export** - Export comment data
- **Comment analytics** - Track comment engagement

## Authentication & Security

### User Authentication
- Comments require user authentication
- Anonymous users are prompted to login via AuthModal
- User sessions are validated on each request

### Data Validation
- Comment content is validated (1-1000 characters)
- Content types are validated against allowed values
- Content IDs are validated (non-empty)
- Parent comment validation for replies

### Authorization
- Users can only edit/delete their own comments
- Comment ownership is verified on each action
- Soft delete preserves data integrity

## Performance Considerations

### Database Indexes
- Composite index on `(contentId, contentType)` for content-based queries
- Index on `authorId` for user-based queries
- Index on `parentId` for reply queries
- Unique constraint on comment reactions

### Caching Strategy
- Consider caching comment counts for frequently accessed content
- Implement cache invalidation on new comments
- Use Redis or similar for high-traffic scenarios

### Query Optimization
- Use pagination to limit result sets
- Lazy load replies to reduce initial load time
- Optimize comment counts with database aggregation

## Testing

### Unit Tests
```typescript
// Test comment creation
test("should create new comment", async () => {
  const response = await request(app)
    .post("/api/comments")
    .set("Authorization", `Bearer ${userToken}`)
    .send({
      content: "Great article!",
      contentId: "test-123",
      contentType: "NEWS"
    });

  expect(response.status).toBe(200);
  expect(response.body.action).toBe("created");
});

// Test comment reply
test("should create reply to comment", async () => {
  const response = await request(app)
    .post("/api/comments")
    .set("Authorization", `Bearer ${userToken}`)
    .send({
      content: "I agree!",
      contentId: "test-123",
      contentType: "NEWS",
      parentId: "parent-comment-id"
    });

  expect(response.status).toBe(200);
  expect(response.body.comment.parentId).toBe("parent-comment-id");
});
```

### Integration Tests
```typescript
// Test complete comment flow
test("should handle complete comment lifecycle", async () => {
  // 1. Create comment
  const createResponse = await createComment("Test comment", "test-123", "NEWS");
  expect(createResponse.action).toBe("created");

  // 2. Update comment
  const updateResponse = await updateComment(createResponse.comment.id, "Updated comment");
  expect(updateResponse.action).toBe("updated");

  // 3. Add reaction
  const reactionResponse = await addCommentReaction(createResponse.comment.id, "❤️");
  expect(reactionResponse.action).toBe("created");

  // 4. Delete comment
  const deleteResponse = await deleteComment(createResponse.comment.id);
  expect(deleteResponse.action).toBe("deleted");
});
```

## Troubleshooting

### Common Issues

1. **Comment not appearing**: Check if user is authenticated
2. **Reply not working**: Verify parent comment exists and is on same content
3. **Reaction not working**: Check if comment exists and is not deleted
4. **Performance issues**: Verify database indexes and query optimization

### Debug Mode
Enable debug logging in the API:
```typescript
console.log("Comment request:", { contentId, contentType, parentId, userId });
```

## Future Enhancements

- **Comment notifications** - Notify users of replies and reactions
- **Comment moderation** - Flag and moderate inappropriate comments
- **Comment search** - Search through comments with filters
- **Comment export** - Export comment data for analysis
- **Comment analytics** - Track comment engagement and trends
- **Comment threading** - Better visual representation of comment threads
- **Comment mentions** - @mention users in comments
- **Comment formatting** - Rich text formatting in comments
- **Comment attachments** - Allow images/files in comments
- **Comment voting** - Upvote/downvote comments 