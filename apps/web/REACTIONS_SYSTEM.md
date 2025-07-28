# Reactions System

A flexible and extensible reactions system that allows users to react to any content with any emoji, designed to be easily integrated into various content types.

## Overview

The reactions system provides:
- **Unlimited emoji support** - Users can use any emoji they want
- **One reaction per user per content** - Users can only have one reaction per content item
- **Toggle functionality** - Clicking the same emoji removes the reaction
- **Authentication required** - Only logged-in users can react
- **Extensible architecture** - Works with any content type
- **Real-time updates** - Reactions update immediately

## Architecture

### Database Schema

```prisma
model Reaction {
  id          String      @id @default(cuid())
  contentId   String
  contentType ContentType
  emoji       String      // Store the actual emoji character
  userId      String      // Reactions require authentication
  createdAt   DateTime    @default(now())

  // Relations
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([contentId, contentType, userId]) // One reaction per user per content
  @@index([contentId, contentType])
  @@index([userId])
  @@map("reactions")
}
```

### Key Features

1. **Emoji Storage**: Stores actual emoji characters (e.g., "❤️", "👍", "😂")
2. **Unique Constraint**: Prevents multiple reactions from the same user on the same content
3. **Cascade Deletion**: Reactions are deleted when users are deleted
4. **Indexed Queries**: Optimized for fetching reactions by content

## API Endpoints

### POST `/api/reactions`

Adds or toggles a reaction for content.

**Request Body:**
```json
{
  "contentId": "string",
  "contentType": "NEWS" | "POST" | "EVENT" | "FORUM_THREAD" | "FORUM_REPLY" | "LFG_POST" | "CHAT_MESSAGE",
  "emoji": "string"
}
```

**Response:**
```json
{
  "success": true,
  "action": "created" | "updated" | "removed",
  "reaction": {
    "id": "string",
    "contentId": "string",
    "contentType": "string",
    "emoji": "string",
    "userId": "string",
    "createdAt": "string"
  } | null
}
```

**Features:**
- Creates new reaction if user hasn't reacted
- Updates reaction if user reacts with different emoji
- Removes reaction if user clicks same emoji
- Requires authentication

### GET `/api/reactions`

Retrieves reactions for content.

**Query Parameters:**
- `contentId`: Content identifier
- `contentType`: Content type

**Response:**
```json
{
  "data": {
    "contentId": "string",
    "contentType": "string",
    "reactions": {
      "❤️": {
        "count": 5,
        "users": [
          {
            "id": "string",
            "name": "string",
            "avatar": "string | null"
          }
        ]
      },
      "👍": {
        "count": 3,
        "users": [...]
      }
    },
    "userReaction": "❤️" | null,
    "totalReactions": 8
  }
}
```

## Client-Side Integration

### Hooks

#### `useReactions()`
Hook for adding reactions.

```typescript
import { useReactions } from "@/hooks/useReactions";

function MyComponent() {
  const { addReaction } = useReactions({
    contentId: "news-123",
    contentType: "NEWS",
    onSuccess: (response) => console.log("Reaction added:", response),
    onError: (error) => console.error("Failed to add reaction:", error)
  });

  const handleEmojiSelect = (emoji: string) => {
    addReaction(emoji);
  };
}
```

#### `useReactionData()`
Hook for fetching reaction data.

```typescript
import { useReactionData } from "@/hooks/useReactionData";

function MyComponent() {
  const { data, loading, error, refetch } = useReactionData({
    contentId: "news-123",
    contentType: "NEWS",
    enabled: true
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {Object.entries(data?.reactions || {}).map(([emoji, reactionData]) => (
        <div key={emoji}>
          {emoji} - {reactionData.count}
        </div>
      ))}
    </div>
  );
}
```

### Components

#### `Reactions`
Main reactions component that displays reaction buttons and handles interactions.

```typescript
import { Reactions } from "@/components/Reactions";

function NewsArticle({ article }: { article: NewsPost }) {
  return (
    <div>
      <h1>{article.title}</h1>
      <p>{article.content}</p>
      <Reactions 
        contentId={article.id} 
        contentType="NEWS"
        className="mt-4"
      />
    </div>
  );
}
```

#### `EmojiPickerButton`
Emoji picker component using emoji-picker-react.

```typescript
import { EmojiPickerButton } from "@/components/EmojiPicker";

function MyComponent() {
  const handleEmojiSelect = (emoji: string) => {
    console.log("Selected emoji:", emoji);
  };

  return (
    <EmojiPickerButton 
      onEmojiSelect={handleEmojiSelect}
      className="ml-2"
    />
  );
}
```

## Usage Examples

### Basic Integration

```typescript
// In a news article detail page
import { Reactions } from "@/components/Reactions";

export default function NewsPage({ article }: { article: NewsPost }) {
  return (
    <div>
      <h1>{article.title}</h1>
      <p>{article.content}</p>
      
      {/* Reactions section */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <Reactions contentId={article.id} contentType="NEWS" />
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
      
      {/* Reactions section */}
      <Card>
        <CardHeader>
          <CardTitle>Reactions</CardTitle>
        </CardHeader>
        <CardContent>
          <Reactions contentId={event.id} contentType="EVENT" />
        </CardContent>
      </Card>
    </div>
  );
}
```

### Custom Reaction Handling

```typescript
import { useReactions } from "@/hooks/useReactions";

function CustomReactionComponent() {
  const { addReaction } = useReactions({
    contentId: "event-456",
    contentType: "EVENT",
    onSuccess: (response) => {
      if (response.action === "created") {
        console.log("New reaction added!");
      } else if (response.action === "removed") {
        console.log("Reaction removed!");
      }
    }
  });

  const handleQuickReaction = (emoji: string) => {
    addReaction(emoji);
  };

  return (
    <div>
      <button onClick={() => handleQuickReaction("❤️")}>❤️</button>
      <button onClick={() => handleQuickReaction("👍")}>👍</button>
      <button onClick={() => handleQuickReaction("😂")}>😂</button>
    </div>
  );
}
```

### Manual Data Fetching

```typescript
import { useReactionData } from "@/hooks/useReactionData";

function ReactionStats({ contentId }: { contentId: string }) {
  const { data, loading, refetch } = useReactionData({
    contentId,
    contentType: "NEWS",
    enabled: true
  });

  if (loading) return <div>Loading reactions...</div>;

  const totalReactions = data?.totalReactions || 0;
  const topReaction = Object.entries(data?.reactions || {})
    .sort(([, a], [, b]) => b.count - a.count)[0];

  return (
    <div>
      <p>Total Reactions: {totalReactions}</p>
      {topReaction && (
        <p>Most Popular: {topReaction[0]} ({topReaction[1].count})</p>
      )}
    </div>
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
  COMMENT  // New content type
  REVIEW   // New content type
}
```

2. **Update API validation**:
```typescript
const reactionSchema = z.object({
  contentId: z.string().min(1, "Content ID is required"),
  contentType: z.enum([
    "NEWS", "POST", "EVENT", "FORUM_THREAD", 
    "FORUM_REPLY", "LFG_POST", "CHAT_MESSAGE",
    "COMMENT", "REVIEW"  // Add new types
  ]),
  emoji: z.string().min(1, "Emoji is required"),
});
```

3. **Add Reactions component to new content**:
```typescript
<Reactions contentId={comment.id} contentType="COMMENT" />
```

### Custom Emoji Picker

You can create custom emoji pickers by extending the base functionality:

```typescript
import { EmojiPickerButton } from "@/components/EmojiPicker";

function CustomEmojiPicker({ onEmojiSelect }: { onEmojiSelect: (emoji: string) => void }) {
  const quickEmojis = ["❤️", "👍", "👎", "😂", "😢", "😡", "🎉", "🔥"];

  return (
    <div className="flex items-center gap-2">
      {quickEmojis.map((emoji) => (
        <button
          key={emoji}
          onClick={() => onEmojiSelect(emoji)}
          className="text-2xl hover:scale-110 transition-transform"
        >
          {emoji}
        </button>
      ))}
      <EmojiPickerButton onEmojiSelect={onEmojiSelect} />
    </div>
  );
}
```

## Authentication & Security

### User Authentication
- Reactions require user authentication
- Anonymous users are prompted to login
- User sessions are validated on each request

### Data Validation
- Emoji strings are validated (non-empty)
- Content types are validated against allowed values
- Content IDs are validated (non-empty)

### Rate Limiting
Consider implementing rate limiting for reaction endpoints to prevent spam.

## Performance Considerations

### Database Indexes
- Composite index on `(contentId, contentType)` for efficient queries
- Index on `userId` for user-specific queries
- Unique constraint prevents duplicate reactions

### Caching Strategy
- Consider caching reaction counts for frequently accessed content
- Implement cache invalidation on new reactions
- Use Redis or similar for high-traffic scenarios

### Query Optimization
- Use `groupBy` for emoji aggregation
- Limit user data in responses to essential fields
- Consider pagination for content with many reactions

## Testing

### Unit Tests
```typescript
// Test reaction creation
test("should create new reaction", async () => {
  const response = await request(app)
    .post("/api/reactions")
    .set("Authorization", `Bearer ${userToken}`)
    .send({
      contentId: "test-123",
      contentType: "NEWS",
      emoji: "❤️"
    });

  expect(response.status).toBe(200);
  expect(response.body.action).toBe("created");
});

// Test reaction toggle
test("should remove reaction when same emoji clicked", async () => {
  // First, create a reaction
  await createReaction("test-123", "NEWS", "❤️", userId);
  
  // Then, click the same emoji
  const response = await request(app)
    .post("/api/reactions")
    .set("Authorization", `Bearer ${userToken}`)
    .send({
      contentId: "test-123",
      contentType: "NEWS",
      emoji: "❤️"
    });

  expect(response.body.action).toBe("removed");
});
```

### Integration Tests
```typescript
// Test complete reaction flow
test("should handle complete reaction lifecycle", async () => {
  // 1. Add reaction
  const addResponse = await addReaction("test-123", "NEWS", "❤️");
  expect(addResponse.action).toBe("created");

  // 2. Verify reaction exists
  const reactions = await getReactions("test-123", "NEWS");
  expect(reactions.userReaction).toBe("❤️");
  expect(reactions.reactions["❤️"].count).toBe(1);

  // 3. Change reaction
  const changeResponse = await addReaction("test-123", "NEWS", "👍");
  expect(changeResponse.action).toBe("updated");

  // 4. Verify reaction changed
  const updatedReactions = await getReactions("test-123", "NEWS");
  expect(updatedReactions.userReaction).toBe("👍");
  expect(updatedReactions.reactions["❤️"].count).toBe(0);
  expect(updatedReactions.reactions["👍"].count).toBe(1);
});
```

## Troubleshooting

### Common Issues

1. **Reaction not appearing**: Check if user is authenticated
2. **Duplicate reactions**: Verify unique constraint is working
3. **Emoji not displaying**: Ensure proper font support for emoji characters
4. **Performance issues**: Check database indexes and query optimization

### Debug Mode
Enable debug logging in the API:
```typescript
console.log("Reaction request:", { contentId, contentType, emoji, userId });
```

## Future Enhancements

- **Reaction analytics** - Track most popular reactions
- **Reaction notifications** - Notify content creators of reactions
- **Bulk reactions** - Allow multiple reactions per user
- **Reaction categories** - Group reactions by type (positive, negative, etc.)
- **Reaction history** - Track reaction changes over time
- **Reaction export** - Export reaction data for analysis 