-- DropIndex
DROP INDEX "view_events_contentId_contentType_dedupHash_viewedAt_idx";

-- CreateIndex
CREATE INDEX "view_events_dedupHash_viewedAt_idx" ON "view_events"("dedupHash", "viewedAt");
