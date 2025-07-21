# Prisma Soft Delete Implementation

This document outlines the implementation of conditional `updatedAt` control for soft delete operations in the IRFGC application.

## Overview

We've moved away from Prisma's `@updatedAt` feature to gain conditional control over when `updatedAt` is changed. This is particularly useful for soft deletes, where we want to preserve the original `updatedAt` timestamp for audit purposes.

## Changes Made

### 1. Prisma Schema Changes

**File:** `apps/web/prisma/schema.prisma`

- **Removed** all `@updatedAt` annotations from every model
- **Added** `@default(now())` to all `updatedAt` fields to ensure inserts still populate the timestamp
- **Affected Models:**
  - `User`
  - `Game`
  - `Event`
  - `NewsPost`
  - `LFGPost`
  - `ForumThread`
  - `ForumReply`
  - `Report`
  - `ChatRoom`

### 2. Prisma Client Setup

**File:** `apps/web/src/lib/prisma.ts`

- **Implemented** `softDeleteAwareMiddleware` using Prisma middleware
- **Functionality:**
  - Intercepts all `update` and `updateMany` operations
  - Detects soft delete operations (when only `deletedAt` or `deleted_at` is being set)
  - Explicitly removes `updatedAt` from the data during soft deletes to prevent null constraint violations
  - Ensures `updatedAt` is set for normal updates if not manually provided
  - Preserves manually set `updatedAt` values

### 3. Client Usage

**Centralized Import:**
- All files now import the extended Prisma client from `@/lib/prisma`
- No direct `new PrismaClient()` instantiation in the codebase
- Updated `apps/web/prisma/seed.ts` to use the extended client

## How It Works

### Soft Delete Detection

The middleware detects soft delete operations by checking if the update data contains only a `deletedAt` or `deleted_at` field:

```typescript
const isSoftDelete =
  Object.keys(data).length === 1 &&
  ("deletedAt" in data || "deleted_at" in data);
```

### Behavior Examples

#### 1. Soft Delete Operation
```typescript
// This will NOT update updatedAt - the existing value is preserved
await prisma.event.update({
  where: { id: eventId },
  data: {
    deletedAt: new Date(),
  },
});
```

#### 2. Normal Update Operation
```typescript
// This WILL update updatedAt automatically
await prisma.event.update({
  where: { id: eventId },
  data: {
    title: "New Title",
  },
});
```

#### 3. Manual UpdatedAt
```typescript
// This will preserve the manually set updatedAt
await prisma.event.update({
  where: { id: eventId },
  data: {
    title: "New Title",
    updatedAt: new Date("2024-01-01T12:00:00Z"),
  },
});
```

## Database Migration

**Migration:** `20250721191600_remove_updated_at_annotations`

The migration updated all `updatedAt` columns to have `DEFAULT CURRENT_TIMESTAMP` instead of being automatically managed by Prisma:

```sql
-- Example for events table
ALTER TABLE "events" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;
```

## Benefits

1. **Audit Trail Preservation:** Soft deletes maintain the original `updatedAt` timestamp
2. **Conditional Control:** Full control over when `updatedAt` is updated
3. **Backward Compatibility:** Normal updates still work as expected
4. **Manual Override:** Ability to set specific `updatedAt` values when needed
5. **Null Constraint Safety:** Explicitly removes `updatedAt` during soft deletes to prevent constraint violations

## Safety Measures

1. **Middleware Interception:** All update operations are intercepted and validated
2. **Soft Delete Detection:** Reliable detection of soft delete operations
3. **Manual Value Preservation:** Manually set `updatedAt` values are never overridden
4. **Centralized Client:** Single source of truth for Prisma client usage
5. **Constraint Safety:** Prevents null constraint violations during soft deletes

## Testing

The implementation has been tested with:
- Soft delete operations (preserving `updatedAt`)
- Normal update operations (updating `updatedAt`)
- Manual `updatedAt` setting (preserving manual values)
- Null constraint validation (preventing violations)

## Usage Guidelines

1. **For Soft Deletes:** Only set `deletedAt` field - `updatedAt` will be preserved automatically
2. **For Normal Updates:** Don't set `updatedAt` - it will be updated automatically
3. **For Manual Timestamps:** Set `updatedAt` explicitly when you need a specific timestamp
4. **Always Import:** Use `import { prisma } from "@/lib/prisma"` - never create new PrismaClient instances

## Files Modified

1. `apps/web/prisma/schema.prisma` - Removed @updatedAt annotations
2. `apps/web/src/lib/prisma.ts` - Added soft delete middleware
3. `apps/web/prisma/seed.ts` - Updated to use extended client
4. `apps/web/prisma/migrations/20250721191600_remove_updated_at_annotations/migration.sql` - Database migration

## Future Considerations

1. **Additional Soft Delete Fields:** The middleware can be extended to handle other soft delete field patterns
2. **Restore Operations:** Consider implementing restore operations that reset `deletedAt` to null
3. **Audit Logging:** Consider adding audit logging for soft delete operations
4. **Testing:** Add comprehensive unit tests for the middleware functionality 