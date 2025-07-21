import { PrismaClient, Prisma } from "@prisma/client";

/**
 * Middleware to handle soft delete operations without updating updatedAt
 *
 * This middleware intercepts all update and updateMany operations and:
 * 1. Detects soft delete operations (when only deletedAt/deleted_at is being set)
 * 2. Prevents updatedAt from being automatically updated during soft deletes
 * 3. Ensures updatedAt is set for normal updates if not manually provided
 * 4. Preserves manually set updatedAt values
 *
 * Since updatedAt fields are now nullable, this middleware ensures they are
 * properly managed for audit trail purposes.
 */
const softDeleteAwareMiddleware: Prisma.Middleware = async (params, next) => {
  if (params.action === "update" || params.action === "updateMany") {
    const data = params.args.data as Record<string, unknown>;

    // Check if this is a soft delete operation
    // A soft delete is when we're only setting deletedAt (or deleted_at) field
    const isSoftDelete =
      Object.keys(data).length === 1 &&
      ("deletedAt" in data || "deleted_at" in data);

    if (isSoftDelete) {
      // For soft deletes, explicitly remove updatedAt from the data
      // This prevents updatedAt from being modified during soft deletes
      if ("updatedAt" in data) {
        delete data.updatedAt;
      }
    } else {
      // For normal updates, ensure updatedAt is set if not manually provided
      // This maintains the expected behavior for regular updates
      if (!("updatedAt" in data)) {
        data.updatedAt = new Date();
      }
    }

    params.args.data = data;
  }

  return next(params);
};

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Create and export the Prisma client with soft delete middleware
export const prisma = globalForPrisma.prisma ?? new PrismaClient();

// Apply the middleware to handle soft deletes
prisma.$use(softDeleteAwareMiddleware);

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
