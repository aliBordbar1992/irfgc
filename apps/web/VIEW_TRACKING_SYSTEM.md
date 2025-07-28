# View Tracking System

A comprehensive view tracking system for content analytics, designed to be extensible for multiple content types.

## Overview

The view tracking system provides:
- **Deduplicated view tracking** with 15-minute cooldown
- **Anonymous user support** via persistent cookies
- **Extensible architecture** for multiple content types
- **Performance-optimized** database queries
- **Privacy-conscious** design

## Architecture

### Database Schema

```prisma
model ViewEvent {
  id          String      @id @default(cuid())
  contentId   String
  contentType ContentType
  userId      String?     // For logged-in users
  anonId      String?     // For anonymous users
  ip          String?
  userAgent   String?
  viewedAt    DateTime    @default(now())
  dedupHash   String      // SHA256 hash for deduplication

  @@index([contentId, contentType, dedupHash, viewedAt])
  @@map("view_events")
}

enum ContentType {
  NEWS
  POST
  EVENT
  // Extensible for future content types
}
```

### Key Components

1. **ViewEvent Model**: Stores individual view events with deduplication
2. **DedupHash**: SHA256 hash of `(userId || anonId || ip) + userAgent` for efficient deduplication
3. **Anonymous ID Cookie**: Persistent `anon_id` cookie for anonymous user tracking
4. **15-minute Cooldown**: Prevents duplicate views from the same user within 15 minutes

## API Endpoints

### POST `/api/track-view`

Tracks a view for content with deduplication.

**Request Body:**
```json
{
  "contentId": "string",
  "contentType": "NEWS" | "POST" | "EVENT"
}
```

**Response:**
- `204 No Content`: View tracked successfully
- `400 Bad Request`: Missing anon_id cookie or invalid data
- `500 Internal Server Error`: Server error

**Features:**
- Extracts IP from `x-forwarded-for` header
- Gets user agent from request headers
- Retrieves user session if available
- Computes dedupHash for deduplication
- Checks for existing views in last 15 minutes

### GET `/api/views/stats`

Retrieves view statistics for content.

**Query Parameters:**
- `contentId`: Content identifier
- `contentType`: Content type ("NEWS", "POST", "EVENT")
- `period`: Time period ("day", "week", "month", "all")

**Response:**
```json
{
  "data": {
    "contentId": "string",
    "contentType": "NEWS",
    "period": "all",
    "totalViews": 1234,
    "uniqueViewers": 567,
    "recentViews": [...]
  }
}
```

## Client-Side Integration

### Utilities

#### `ensureAnonId()`
Generates and manages anonymous user ID cookie.

```typescript
import { ensureAnonId } from "@/lib/utils";

// Ensures anon_id cookie exists, creates if needed
const anonId = ensureAnonId();
```

#### `computeDedupHash()`
Computes deduplication hash for view tracking.

```typescript
import { computeDedupHash } from "@/lib/utils";

const hash = computeDedupHash(userId, anonId, ip, userAgent);
```

#### `formatViewCount()`
Formats view counts with appropriate suffixes.

```typescript
import { formatViewCount } from "@/lib/utils";

formatViewCount(1234); // "1.2K"
formatViewCount(1234567); // "1.2M"
```

### Hooks

#### `useViewTracking()`
Hook for tracking views from React components.

```typescript
import { useViewTracking } from "@/hooks/useViewTracking";

function MyComponent() {
  const { trackView } = useViewTracking();
  
  const handleView = () => {
    trackView({
      contentId: "news-123",
      contentType: "NEWS",
      onSuccess: () => console.log("View tracked"),
      onError: (error) => console.error("Failed to track:", error)
    });
  };
}
```

#### `useViewStats()`
Hook for fetching view statistics.

```typescript
import { useViewStats } from "@/hooks/useViewStats";

function StatsComponent({ contentId }: { contentId: string }) {
  const { stats, loading, error } = useViewStats({
    contentId,
    contentType: "NEWS",
    period: "all",
    enabled: true
  });
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      <p>Total Views: {stats?.totalViews}</p>
      <p>Unique Viewers: {stats?.uniqueViewers}</p>
    </div>
  );
}
```

### Components

#### `ViewTracker`
Automatic view tracking component.

```typescript
import { ViewTracker } from "@/features/news/ViewTracker";

function NewsArticle({ article }: { article: NewsPost }) {
  return (
    <div>
      <ViewTracker 
        contentId={article.id} 
        contentType="NEWS"
        onError={(error) => console.error("Failed to track view:", error)}
      />
      {/* Article content */}
    </div>
  );
}
```

## Usage Examples

### Basic View Tracking

```typescript
// In a news article page
import { ViewTracker } from "@/features/news/ViewTracker";

export default function NewsPage({ article }: { article: NewsPost }) {
  return (
    <div>
      <ViewTracker contentId={article.id} contentType="NEWS" />
      <h1>{article.title}</h1>
      {/* Article content */}
    </div>
  );
}
```

### Manual View Tracking

```typescript
import { useViewTracking } from "@/hooks/useViewTracking";

function CustomComponent() {
  const { trackView } = useViewTracking();
  
  const handleButtonClick = () => {
    trackView({
      contentId: "event-456",
      contentType: "EVENT",
      onSuccess: () => {
        console.log("Event view tracked");
      }
    });
  };
  
  return <button onClick={handleButtonClick}>Track View</button>;
}
```

### View Statistics

```typescript
import { useViewStats } from "@/hooks/useViewStats";
import { formatViewCount } from "@/lib/utils";

function ViewStats({ contentId }: { contentId: string }) {
  const { stats, loading } = useViewStats({
    contentId,
    contentType: "NEWS",
    period: "all"
  });
  
  if (loading) return <div>Loading stats...</div>;
  
  return (
    <div>
      <p>Total Views: {formatViewCount(stats?.totalViews || 0)}</p>
      <p>Unique Viewers: {formatViewCount(stats?.uniqueViewers || 0)}</p>
    </div>
  );
}
```

## Privacy & Security

### Data Collection
- **IP Addresses**: Stored for deduplication, consider GDPR compliance
- **User Agents**: Stored for deduplication
- **Anonymous IDs**: Stored in cookies for 1 year
- **User IDs**: Only stored for logged-in users

### Recommendations
1. **GDPR Compliance**: Implement data retention policies
2. **IP Anonymization**: Consider hashing IP addresses
3. **Cookie Consent**: Ensure cookie consent for anonymous tracking
4. **Data Export**: Provide user data export capabilities

## Performance Considerations

### Database Indexes
- Composite index on `(contentId, contentType, dedupHash, viewedAt)`
- Optimized for deduplication queries
- Efficient for time-based filtering

### Caching Strategy
- Consider caching view counts for frequently accessed content
- Implement cache invalidation on new views
- Use Redis or similar for high-traffic scenarios

### Query Optimization
- Use `count()` for view totals
- Use `groupBy()` for unique viewer counts
- Limit recent views to prevent large result sets

## Extensibility

### Adding New Content Types

1. **Update ContentType enum**:
```prisma
enum ContentType {
  NEWS
  POST
  EVENT
  FORUM_THREAD  // New content type
  COMMENT       // New content type
}
```

2. **Update API validation**:
```typescript
const trackViewSchema = z.object({
  contentId: z.string().min(1),
  contentType: z.enum(["NEWS", "POST", "EVENT", "FORUM_THREAD", "COMMENT"]),
});
```

3. **Add ViewTracker to new content pages**:
```typescript
<ViewTracker contentId={thread.id} contentType="FORUM_THREAD" />
```

### Custom Analytics

Extend the system with:
- **Engagement metrics** (time on page, scroll depth)
- **Referrer tracking** (where users came from)
- **Device/browser analytics**
- **Geographic data** (if IP geolocation is enabled)

## Testing

### Unit Tests
```typescript
// Test dedupHash computation
test("computeDedupHash generates consistent hashes", () => {
  const hash1 = computeDedupHash("user123", null, "192.168.1.1", "Mozilla/5.0");
  const hash2 = computeDedupHash("user123", null, "192.168.1.1", "Mozilla/5.0");
  expect(hash1).toBe(hash2);
});
```

### Integration Tests
```typescript
// Test view tracking API
test("POST /api/track-view creates new view event", async () => {
  const response = await request(app)
    .post("/api/track-view")
    .set("Cookie", "anon_id=test-anon-id")
    .send({ contentId: "test-123", contentType: "NEWS" });
  
  expect(response.status).toBe(204);
});
```

## Migration Guide

### From Simple View Counts

If migrating from a simple view count system:

1. **Keep existing view counts** for backward compatibility
2. **Gradually migrate** to ViewEvent-based tracking
3. **Update UI components** to use new hooks
4. **Remove old view count fields** after migration period

### Database Migration

```sql
-- Example migration for existing view counts
UPDATE news_posts 
SET views = (
  SELECT COUNT(*) 
  FROM view_events 
  WHERE content_id = news_posts.id 
  AND content_type = 'NEWS'
);
```

## Troubleshooting

### Common Issues

1. **Missing anon_id cookie**: Ensure `ensureAnonId()` is called on client
2. **Duplicate views**: Check dedupHash computation and 15-minute window
3. **Performance issues**: Verify database indexes are created
4. **TypeScript errors**: Regenerate Prisma client after schema changes

### Debug Mode

Enable debug logging:
```typescript
// In track-view API
console.log("Tracking view:", { contentId, contentType, dedupHash });
```

## Future Enhancements

- **Real-time analytics** with WebSocket updates
- **Advanced filtering** by user segments
- **Export capabilities** for analytics data
- **A/B testing integration** for content optimization
- **Machine learning** for view prediction and content recommendations 