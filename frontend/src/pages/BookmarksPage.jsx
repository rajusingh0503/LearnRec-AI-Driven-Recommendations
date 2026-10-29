import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bookmark,
  Trash2,
  ExternalLink,
  BookOpen,
  Sparkles,
  ArrowRight,
  Search,
  SlidersHorizontal,
} from 'lucide-react';
import interactionService from '../services/interactionService';
import contentService from '../services/contentService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import ContentCard from '../components/common/ContentCard';

export default function BookmarksPage() {
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState([]);
  const [contentMap, setContentMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterQuery, setFilterQuery] = useState('');
  const [removingId, setRemovingId] = useState(null);

  // Load bookmarks and their respective content items
  const loadBookmarks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await interactionService.getBookmarks();
      const items = res?.data || [];
      setBookmarks(items);

      if (items.length > 0) {
        // Fetch full content card data for each bookmarked item in parallel
        const contentResults = await Promise.allSettled(
          items.map((b) => contentService.getContentById(b.contentId))
        );

        const map = {};
        contentResults.forEach((result, idx) => {
          if (result.status === 'fulfilled' && result.value?.data) {
            map[items[idx].contentId] = result.value.data;
          }
        });
        setContentMap(map);
      }
    } catch (err) {
      console.error('Failed to load bookmarks', err);
      setError('Unable to load your watchlist. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBookmarks();
  }, [loadBookmarks]);

  // Remove bookmark handler
  const handleRemoveBookmark = async (contentId) => {
    const target = bookmarks.find((b) => b.contentId === contentId);
    if (!target) return;

    setRemovingId(target.id);
    // Optimistic removal
    setBookmarks((prev) => prev.filter((b) => b.id !== target.id));

    try {
      await interactionService.removeInteraction(target.id);
    } catch (err) {
      console.error('Failed to remove bookmark', err);
      // Revert if API fails
      setBookmarks((prev) => [...prev, target]);
    } finally {
      setRemovingId(null);
    }
  };

  // Filter bookmarks by search keyword
  const filteredBookmarks = bookmarks.filter((b) => {
    if (!filterQuery) return true;
    const query = filterQuery.toLowerCase();
    const titleMatch = b.contentTitle?.toLowerCase().includes(query);
    const catMatch = b.categoryName?.toLowerCase().includes(query);
    const typeMatch = b.contentType?.toLowerCase().includes(query);
    return titleMatch || catMatch || typeMatch;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-amber-600 font-semibold text-xs tracking-wider uppercase mb-1">
              <Bookmark className="w-4 h-4 fill-amber-500" />
              <span>Personal Watchlist</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Saved Learning Resources
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage courses, tutorials, and articles you have bookmarked for later study.
            </p>
          </div>

          {/* Quick stats badge */}
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm self-start sm:self-auto">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span>
              <strong>{bookmarks.length}</strong> saved resource{bookmarks.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Search within bookmarks (if more than 2 items) */}
        {bookmarks.length > 2 && (
          <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
            <Search className="w-4 h-4 text-slate-400 ml-2" />
            <input
              type="text"
              placeholder="Filter saved items by title, category, or type..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full text-sm text-slate-900 placeholder-slate-400 bg-transparent focus:outline-none"
            />
            {filterQuery && (
              <button
                onClick={() => setFilterQuery('')}
                className="text-xs text-slate-400 hover:text-slate-600 px-2 py-1"
              >
                Clear
              </button>
            )}
          </div>
        )}

        {/* Content Display */}
        {loading ? (
          <div className="py-20 flex justify-center">
            <LoadingSpinner size="lg" message="Loading your saved resources..." />
          </div>
        ) : error ? (
          <div className="py-16 text-center bg-white rounded-2xl border border-rose-200 p-8">
            <p className="text-rose-600 text-sm font-medium mb-3">{error}</p>
            <button
              onClick={loadBookmarks}
              className="px-4 py-2 bg-brand-600 text-white rounded-xl text-sm font-medium hover:bg-brand-700 transition"
            >
              Try Again
            </button>
          </div>
        ) : bookmarks.length === 0 ? (
          <EmptyState
            icon={Bookmark}
            title="Your Watchlist is Empty"
            description="You haven't bookmarked any educational resources yet. Explore the catalog to discover curated tutorials and courses."
            actionLabel="Explore Catalog"
            onAction={() => navigate('/catalog')}
          />
        ) : filteredBookmarks.length === 0 ? (
          <EmptyState
            icon={Search}
            title="No Matching Bookmarks"
            description={`No saved resources match "${filterQuery}". Try a different keyword.`}
            actionLabel="Clear Filter"
            onAction={() => setFilterQuery('')}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBookmarks.map((b) => {
              const fullContent = contentMap[b.contentId];

              // If full content is fetched, render with ContentCard
              if (fullContent) {
                return (
                  <ContentCard
                    key={b.id}
                    content={fullContent}
                    isBookmarked={true}
                    onBookmarkToggle={handleRemoveBookmark}
                  />
                );
              }

              // Fallback simple card if full content isn't loaded
              return (
                <div
                  key={b.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between hover:shadow-md transition"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {b.contentType}
                      </span>
                      <button
                        onClick={() => handleRemoveBookmark(b.contentId)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded-lg transition"
                        title="Remove from Watchlist"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <Link
                      to={`/content/${b.contentId}`}
                      className="font-bold text-slate-900 text-sm line-clamp-2 hover:text-brand-600 transition"
                    >
                      {b.contentTitle}
                    </Link>

                    {b.categoryName && (
                      <span className="text-xs text-slate-500 font-medium block">
                        {b.categoryName}
                      </span>
                    )}
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-3">
                    <span className="text-[10px] text-slate-400">
                      Saved {new Date(b.createdAt).toLocaleDateString()}
                    </span>
                    <Link
                      to={`/content/${b.contentId}`}
                      className="inline-flex items-center space-x-1 text-xs font-semibold text-brand-600 hover:text-brand-700"
                    >
                      <span>View</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
