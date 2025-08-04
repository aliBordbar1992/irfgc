# Posts System

A comprehensive user posts system that allows users to create and share content with text, images, and videos, with full integration with the existing comments, reactions, and views infrastructure.

## Overview

The posts system provides:
- **Rich content support** - Text, images, and videos in a single post
- **User authentication** - Only logged-in users can create posts
- **Social interactions** - Comments, reactions, and view tracking
- **User profiles** - Posts are displayed on user profiles
- **Soft delete** - Posts are soft deleted, preserving data integrity
- **Extensible architecture** - Built on existing infrastructure

## Architecture

### Database Schema

```prisma
model Post {
  id          String   @id @default(cuid())
  content     String   // Text content
  images      String[] // Array of image URLs
  videos      String[] // Array of video URLs
  authorId    String
  isDeleted   Boolean  @default(false) // Soft delete
  createdAt   DateTime @default(now())
  updatedAt   DateTime?

  // Relations
  author User @relation(fields: [authorId], references: [id], onDelete: Cascade)

  @@index([authorId])
  @@index([createdAt])
  @@map("posts")
}
```

### Key Features

1. **Content Types**: Posts support text, images, and videos
2. **Soft Delete**: Posts are marked as deleted rather than physically removed
3. **Cascade Deletion**: Posts are deleted when users are deleted
4. **Indexed Queries**: Optimized for fetching posts by author and creation date

## API Endpoints

### GET `/api/posts`

Retrieves posts with pagination and filtering.

**Query Parameters:**
- `authorId`: Filter posts by specific user
- `page`: Page number (default: 1)
- `limit`: Posts per page (default: 10)

**Response:**
```json
{
  "data": {
    "posts": [
      {
        "id": "string",
        "content": "string",
        "images": ["string"],
        "videos": ["string"],
        "authorId": "string",
        "createdAt": "string",
        "updatedAt": "string",
        "author": {
          "id": "string",
          "name": "string",
          "username": "string",
          "avatar": "string"
        },
        "_count": {
          "comments": 0
        }
      }
    ],
    "total": 0,
    "totalPages": 0
  },
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 0,
    "totalPages": 0
  }
}
```

### POST `/api/posts`

Creates a new post.

**Request Body:**
```json
{
  "content": "string",
  "images": ["string"],
  "videos": ["string"]
}
```

**Response:**
```json
{
  "data": {
    "id": "string",
    "content": "string",
    "images": ["string"],
    "videos": ["string"],
    "authorId": "string",
    "createdAt": "string",
    "author": {
      "id": "string",
      "name": "string",
      "username": "string",
      "avatar": "string"
    }
  }
}
```

### GET `/api/posts/[id]`

Retrieves a specific post.

### PUT `/api/posts/[id]`

Updates a specific post (author only).

### DELETE `/api/posts/[id]`

Soft deletes a specific post (author only).

## Client-Side Integration

### Hooks

#### `usePosts()`
Hook for creating, updating, and deleting posts.

```typescript
import { usePosts } from "@/hooks/usePosts";

function MyComponent() {
  const { createPost, updatePost, deletePost } = usePosts({
    onSuccess: (response) => console.log("Post action successful:", response),
    onError: (error) => console.error("Post action failed:", error)
  });

  const handleCreatePost = async () => {
    await createPost("Great content!", ["image1.jpg"], ["video1.mp4"]);
  };
}
```

#### `usePostsData()`
Hook for fetching posts data with pagination.

```typescript
import { usePostsData } from "@/hooks/usePostsData";

function PostsList() {
  const { data, loading, error, refetch } = usePostsData({
    authorId: "user-123", // Optional: filter by user
    page: 1,
    limit: 10,
    enabled: true
  });

  if (loading) return <div>Loading posts...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {data?.posts.map(post => (
        <PostItem key={post.id} post={post} />
      ))}
    </div>
  );
}
```

### Components

#### `Post`
Individual post component with full interaction capabilities.

```typescript
import { Post } from "@/components/Post";

function PostItem({ post }: { post: PostData }) {
  return (
    <Post 
      post={post}
      onDelete={() => console.log("Post deleted")}
      onUpdate={() => console.log("Post updated")}
    />
  );
}
```

#### `PostsList`
List component for displaying multiple posts with pagination.

```typescript
import { PostsList } from "@/components/PostsList";

function PostsPage() {
  return (
    <PostsList 
      authorId="user-123" // Optional: filter by user
      title="My Posts"
      onPostDeleted={() => console.log("Post deleted")}
      onPostUpdated={() => console.log("Post updated")}
    />
  );
}
```

#### `CreatePostDialog`
Dialog component for creating new posts.

```typescript
import { CreatePostDialog } from "@/features/posts/CreatePostDialog";

function CreatePostButton() {
  return (
    <CreatePostDialog 
      onSuccess={() => console.log("Post created")}
      trigger={<Button>Create Post</Button>}
    />
  );
}
```

## Integration with Existing Systems

### Comments
Posts use the existing comments system with `contentType: "POST"`:

```typescript
<Comments contentId={post.id} contentType="POST" />
```

### Reactions
Posts use the existing reactions system with `contentType: "POST"`:

```typescript
<Reactions contentId={post.id} contentType="POST" />
```

### View Tracking
Posts use the existing view tracking system with `contentType: "POST"`:

```typescript
useViewTracking().trackView({
  contentId: post.id,
  contentType: "POST"
});
```

### Notifications
Posts can trigger notifications for:
- New comments on posts
- Reactions on posts
- Mentions in post content

## User Profile Integration

### Profile Page
Posts are displayed on user profiles with:
- Create post button for own profile
- Posts list with pagination
- Post count in activity stats

### Public Profile
Posts are displayed on public user profiles for:
- Community discovery
- User activity showcase
- Content engagement

## Content Guidelines

### Text Content
- Maximum 5000 characters
- Supports line breaks and formatting
- Content validation on creation

### Images
- Array of image URLs
- No file upload (external URLs only)
- Recommended: Optimized images for web

### Videos
- Array of video URLs
- No file upload (external URLs only)
- Recommended: Hosted video platforms

## Security & Validation

### Authentication
- Posts require user authentication
- Anonymous users can view but not create
- User sessions are validated on each request

### Authorization
- Users can only edit/delete their own posts
- Post ownership is verified on each action
- Soft delete preserves data integrity

### Data Validation
- Content is validated (1-5000 characters)
- Image/video URLs are validated
- Content types are validated against allowed values

## Performance Considerations

### Database Indexes
- Index on `authorId` for user-based queries
- Index on `createdAt` for chronological queries
- Composite indexes for complex queries

### Caching Strategy
- Consider caching post counts for frequently accessed users
- Implement cache invalidation on new posts
- Use Redis or similar for high-traffic scenarios

### Query Optimization
- Use pagination to limit result sets
- Lazy load images and videos
- Optimize post counts with database aggregation

## Future Enhancements

### Planned Features
- **Post categories/tags** - Organize posts by topic
- **Post scheduling** - Schedule posts for future publication
- **Post drafts** - Save posts as drafts
- **Post sharing** - Share posts to external platforms
- **Post analytics** - Track post engagement metrics
- **Post moderation** - Flag inappropriate posts
- **Post search** - Search through post content
- **Post export** - Export post data

### Technical Improvements
- **File upload** - Direct file upload for images/videos
- **Rich text editor** - Enhanced text formatting
- **Post templates** - Predefined post formats
- **Post collaboration** - Multi-author posts
- **Post versioning** - Track post edit history

## Testing

### Unit Tests
```typescript
// Test post creation
describe("Post Creation", () => {
  it("should create a post with valid data", async () => {
    const postData = {
      content: "Test post content",
      images: ["https://example.com/image.jpg"],
      videos: []
    };
    
    const response = await createPost(postData);
    expect(response.data.content).toBe(postData.content);
  });
});
```

### Integration Tests
```typescript
// Test post with comments and reactions
describe("Post Interactions", () => {
  it("should handle comments and reactions", async () => {
    const post = await createPost({ content: "Test post" });
    const comment = await createComment(post.id, "Great post!");
    const reaction = await addReaction(post.id, "👍");
    
    expect(comment).toBeDefined();
    expect(reaction).toBeDefined();
  });
});
```

## Deployment

### Database Migration
```bash
# Generate migration for posts table
npx prisma migrate dev --name add_posts_system

# Apply migration to production
npx prisma migrate deploy
```

### Environment Variables
No additional environment variables required. The posts system uses existing authentication and database configurations.

### Monitoring
Monitor the following metrics:
- Post creation rate
- Comment engagement on posts
- Reaction patterns
- User activity with posts
- Performance of post queries 