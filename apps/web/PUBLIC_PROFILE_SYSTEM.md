# Public Profile System

This document describes the public profile system that allows users to have public-facing profile pages accessible via `@username` URLs.

## Overview

The public profile system provides:
- Public profile pages accessible via `@username` URLs (e.g., `http://localhost:3000/@john.doe`)
- Read-only display of user information and activity
- Integration with existing profile components
- Proper URL rewriting via middleware

## URL Structure

### Public Profile URLs
- **Format**: `@username` (e.g., `/@john.doe`, `/@admin@irfgc.ir`)
- **Internal Route**: `/users/[username]`
- **Middleware**: Automatically rewrites `@username` to `/users/username`
- **Support**: Usernames can contain letters, numbers, dots, hyphens, and @ symbols

### Private Profile URLs
- **Format**: `/profile` (requires authentication)
- **Purpose**: User's own profile for editing and management

## Implementation Details

### Middleware Configuration

The middleware (`src/middleware.ts`) handles URL rewriting:

```typescript
// Handle @username pattern for public profiles
const matchUsername = pathname.match(/^\/@([\w.-]+)$/);
if (matchUsername) {
  const username = matchUsername[1];
  const url = request.nextUrl.clone();
  url.pathname = `/users/${username}`;
  return NextResponse.rewrite(url);
}
```

### File Structure

```
src/
├── app/
│   ├── users/
│   │   ├── layout.tsx                    # Layout for public profiles
│   │   └── [username]/
│   │       └── page.tsx                  # Public profile page
│   └── profile/
│       ├── layout.tsx                    # Layout for private profiles
│       └── page.tsx                      # Private profile page
├── features/
│   └── profile/
│       ├── ProfileContent.tsx            # Private profile content
│       └── PublicProfileContent.tsx      # Public profile content
└── lib/
    └── utils.ts                          # URL generation utilities
```

### Components

#### PublicProfileContent
- Displays user information in read-only format
- Shows user avatar, name, username, role, and join date
- Includes activity feed and statistics
- No editing capabilities

#### ProfileContent
- Full profile management interface
- Includes editing forms and settings
- Requires authentication

### URL Generation

Use the `getPublicProfileUrl` utility function:

```typescript
import { getPublicProfileUrl } from "@/lib/utils";

// Generate public profile URL
const profileUrl = getPublicProfileUrl("john.doe"); // Returns "/@john.doe"
```

## Usage Examples

### Linking to Public Profiles

```typescript
import Link from "next/link";
import { getPublicProfileUrl } from "@/lib/utils";

// In a component
<Link href={getPublicProfileUrl(user.username)}>
  View {user.name}'s Profile
</Link>
```

### User Menu Integration

The user menu includes a "Public Profile" link that uses the new URL format:

```typescript
<DropdownMenuItem asChild>
  <Link href={getPublicProfileUrl(session.user.username)}>
    <ExternalLink className="mr-2 h-4 w-4" />
    <span>Public Profile</span>
  </Link>
</DropdownMenuItem>
```

## Data Fetching

### Public Profile Data

The public profile page fetches user data with:

- Basic user information (name, username, role, avatar, join date)
- Recent activity (events, news posts, LFG posts, forum threads)
- Statistics (counts of various content types)
- Event registrations

### Privacy Considerations

- Only public information is displayed
- No sensitive data (email, password, etc.) is exposed
- Activity is filtered to show only public content
- Soft-deleted content is excluded from public views

## Testing

### Unit Tests

Run the middleware tests to verify URL rewriting:

```bash
npm test middleware.test.ts
```

### Manual Testing

1. Start the development server: `npm run dev`
2. Navigate to `http://localhost:3000/@username` (replace with actual username)
3. Verify the page loads correctly and displays user information
4. Test that the URL shows `@username` in the browser address bar

## Future Enhancements

Potential improvements to consider:

1. **Profile Customization**: Allow users to customize their public profile appearance
2. **Privacy Settings**: Add options to control what information is publicly visible
3. **Profile Verification**: Add verification badges for official accounts
4. **Social Features**: Add following/follower functionality
5. **Activity Privacy**: Allow users to hide specific activity types from public view 