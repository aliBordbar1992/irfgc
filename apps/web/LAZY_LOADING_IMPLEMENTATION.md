# News List Lazy Loading Implementation

## Overview

This implementation adds lazy loading functionality to the news list with the following requirements:
- **Scroll-based lazy loading** for the first 10 pages of news articles (automatic loading as user scrolls)
- **Manual "Load More Articles" button** after 10 pages
- Maintain scroll position and page content when navigating between list and news details

## Implementation Details

### 1. Store Updates (`apps/web/src/features/news/store/newsStore.ts`)

**New State:**
- Added `showLoadMoreButton: boolean` to track when to show the "Load More Articles" button

**New Atom:**
- `showLoadMoreButtonAtom` - manages the visibility of the load more button

### 2. Hook Updates (`apps/web/src/features/news/hooks/useNewsStore.ts`)

**New Exposed State:**
- `showLoadMoreButton` - boolean indicating whether to show the load more button

**New Action:**
- `setShowLoadMoreButton` - function to update the showLoadMoreButton state

**Updated Function:**
- `loadMoreArticles` - now handles the logic for showing the "Load More Articles" button only after 10 pages

### 3. Component Updates (`apps/web/src/features/news/NewsList.tsx`)

**New Features:**
- **Intersection Observer** for scroll-based lazy loading
- **Observer element** that triggers automatic loading when scrolled into view
- **Scroll-based loading** for first 10 pages, manual button for pages after 10

**Changes:**
- Added `observerRef` for Intersection Observer
- Added `handleObserver` callback for scroll detection
- Updated `fetchNews` to accept page parameter
- Added observer element in JSX (only shown for first 10 pages)
- Updated to use `showLoadMoreButton` instead of `hasMore` for button visibility

### 4. NewsListItem Updates (`apps/web/src/features/news/NewsListItem.tsx`)

**Changes:**
- Removed custom sessionStorage scroll restoration logic
- Now uses the Jotai store's `handleArticleClick` function for consistent scroll management
- Removed unused `gameSlug` prop and `useSearchParams` import

## How It Works

### Lazy Loading Logic

1. **First 10 Pages (Pages 1-10):**
   - **Scroll-based automatic loading**: Articles are loaded automatically as the user scrolls near the bottom
   - **Intersection Observer**: Detects when user scrolls within 100px of the bottom
   - **No manual button**: No "Load More Articles" button is shown
   - `showLoadMoreButton` remains `false`

2. **Page 11 and Beyond:**
   - **Manual loading**: The "Load More Articles" button appears
   - **No automatic loading**: Scroll-based loading is disabled
   - `showLoadMoreButton` is set to `true`
   - Users must click the button to load more articles

### Scroll Position Management

1. **When clicking on a news article:**
   - `handleArticleClick` saves the current scroll position to the Jotai store
   - User navigates to the news detail page

2. **When returning to the news list:**
   - `handleBackToNews` restores the scroll position from the store
   - The page content and scroll position are maintained

### Intersection Observer Configuration

- **Root**: `null` (viewport)
- **Root Margin**: `100px` (triggers 100px before reaching the bottom)
- **Threshold**: `0.1` (10% of the element must be visible)
- **Condition**: Only active for `currentPage < 10`

### State Persistence

- All state is persisted in sessionStorage via Jotai's `atomWithStorage`
- This ensures that scroll positions and loaded articles are maintained during the session
- State is reset when the game slug changes

## API Integration

The implementation works with the existing `/api/news` endpoint which supports:
- Pagination via `page` and `limit` parameters
- Game-specific filtering via `gameSlug` parameter
- Returns pagination metadata including `totalPages`

## Benefits

1. **Performance:** Reduces initial load time by loading articles in chunks
2. **User Experience:** 
   - Smooth scroll-based loading for first 10 pages
   - Manual control for deeper pages
   - Maintains scroll position and content when navigating
3. **Scalability:** Handles large numbers of articles efficiently
4. **Consistency:** Uses a centralized state management approach

## Testing

The implementation can be tested by:
1. Loading the news list page
2. Scrolling down to trigger automatic loading (first 10 pages)
3. Reaching page 11 (should see "Load More Articles" button)
4. Clicking on a news article and returning (scroll position should be maintained)
5. Clicking "Load More Articles" to load additional pages manually

## Technical Details

### Intersection Observer Setup
```typescript
const observer = new IntersectionObserver(handleObserver, {
  root: null,
  rootMargin: "100px",
  threshold: 0.1,
});
```

### Observer Element
```jsx
{currentPage < 10 && (
  <div ref={observerRef} className="h-4" />
)}
```

### Loading Logic
- **Automatic**: Triggers when observer element comes into view (pages 1-10)
- **Manual**: User clicks "Load More Articles" button (pages 11+)

## Future Enhancements

Potential improvements could include:
- Loading indicators during automatic article fetching
- Error handling for failed automatic loads
- Caching strategies for better performance
- Configurable threshold for when to switch from automatic to manual loading 