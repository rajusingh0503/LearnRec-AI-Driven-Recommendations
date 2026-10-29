import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  X,
  BookOpen,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import contentService from '../services/contentService';
import interactionService from '../services/interactionService';
import { useAuth } from '../context/AuthContext';
import ContentCard from '../components/common/ContentCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';

const CONTENT_TYPES = [
  { value: '', label: 'All Types' },
  { value: 'COURSE', label: 'Courses' },
  { value: 'BOOK', label: 'Books' },
  { value: 'TUTORIAL', label: 'Tutorials' },
  { value: 'CODING_PROBLEM', label: 'Coding Problems' },
  { value: 'RESOURCE', label: 'Resources' },
];

const DIFFICULTY_LEVELS = [
  { value: '', label: 'All Levels' },
  { value: 'BEGINNER', label: 'Beginner' },
  { value: 'INTERMEDIATE', label: 'Intermediate' },
  { value: 'ADVANCED', label: 'Advanced' },
];

export default function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Search and filter state synced with URL
  const keywordParam = searchParams.get('keyword') || '';
  const categoryParam = searchParams.get('categoryId') || '';
  const typeParam = searchParams.get('type') || '';
  const diffParam = searchParams.get('difficulty') || '';
  const pageParam = parseInt(searchParams.get('page') || '0', 10);

  const [searchInput, setSearchInput] = useState(keywordParam);
  const [categories, setCategories] = useState([]);
  const [contentList, setContentList] = useState([]);
  const [pagedData, setPagedData] = useState({
    pageNumber: 0,
    pageSize: 12,
    totalElements: 0,
    totalPages: 0,
    lastPage: true,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Map of contentId -> interactionId for fast bookmark lookups
  const [bookmarkMap, setBookmarkMap] = useState({});
  const searchTimeoutRef = useRef(null);

  // Load categories once
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await contentService.getCategories();
        if (res?.data) {
          setCategories(res.data);
        }
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    }
    fetchCategories();
  }, []);

  // Fetch bookmarks if authenticated
  const fetchBookmarks = useCallback(async () => {
    if (!isAuthenticated) {
      setBookmarkMap({});
      return;
    }
    try {
      const res = await interactionService.getBookmarks();
      if (res?.data) {
        const map = {};
        res.data.forEach((item) => {
          map[item.contentId] = item.id;
        });
        setBookmarkMap(map);
      }
    } catch (err) {
      console.error('Failed to load bookmarks', err);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  // Fetch catalog content based on URL query params
  const fetchContent = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page: pageParam,
        size: 12,
      };
      if (keywordParam) params.keyword = keywordParam;
      if (categoryParam) params.categoryId = categoryParam;
      if (typeParam) params.contentType = typeParam;
      if (diffParam) params.difficultyLevel = diffParam;

      const res = await contentService.getAllContent(params);
      if (res?.data) {
        setContentList(res.data.content || []);
        setPagedData({
          pageNumber: res.data.pageNumber || 0,
          pageSize: res.data.pageSize || 12,
          totalElements: res.data.totalElements || 0,
          totalPages: res.data.totalPages || 0,
          lastPage: res.data.lastPage ?? true,
        });
      }
    } catch (err) {
      console.error('Failed to load content', err);
      setError('Unable to load catalog content. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [pageParam, keywordParam, categoryParam, typeParam, diffParam]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  // Update query params helper
  const updateQuery = (updates) => {
    const nextParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        nextParams.set(key, val);
      } else {
        nextParams.delete(key);
      }
    });
    // Reset to page 0 if filters or search change (unless page itself is being updated)
    if (!('page' in updates)) {
      nextParams.delete('page');
    }
    setSearchParams(nextParams);
  };

  // Debounced search input handler
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      updateQuery({ keyword: value.trim() });
    }, 400);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    updateQuery({ keyword: '' });
  };

  const handleResetFilters = () => {
    setSearchInput('');
    setSearchParams(new URLSearchParams());
  };

  // Bookmark toggle handler
  const handleBookmarkToggle = async (contentId) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/catalog' } } });
      return;
    }

    const interactionId = bookmarkMap[contentId];

    if (interactionId) {
      // Optimistic remove
      setBookmarkMap((prev) => {
        const next = { ...prev };
        delete next[contentId];
        return next;
      });
      try {
        await interactionService.removeInteraction(interactionId);
      } catch (err) {
        console.error('Failed to remove bookmark', err);
        // Revert on error
        setBookmarkMap((prev) => ({ ...prev, [contentId]: interactionId }));
      }
    } else {
      // Optimistic add (temporary placeholder ID)
      setBookmarkMap((prev) => ({ ...prev, [contentId]: true }));
      try {
        const res = await interactionService.recordInteraction({
          contentId,
          interactionType: 'BOOKMARK',
        });
        if (res?.data?.id) {
          setBookmarkMap((prev) => ({ ...prev, [contentId]: res.data.id }));
        }
      } catch (err) {
        console.error('Failed to add bookmark', err);
        setBookmarkMap((prev) => {
          const next = { ...prev };
          delete next[contentId];
          return next;
        });
      }
    }
  };

  const hasActiveFilters = Boolean(
    keywordParam || categoryParam || typeParam || diffParam
  );

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 text-brand-600 font-semibold text-xs tracking-wider uppercase mb-1">
                <BookOpen className="w-4 h-4" />
                <span>Learning Catalog</span>
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Explore Educational Resources
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Browse our curated repository of computer science tutorials, courses, and reference material.
              </p>
            </div>

            {/* Quick summary badge */}
            <div className="flex items-center gap-2 text-xs text-slate-600 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm self-start md:self-auto">
              <Sparkles className="w-4 h-4 text-brand-500" />
              <span>
                <strong>{pagedData.totalElements}</strong> total resources available
              </span>
            </div>
          </div>

          {/* Search & Filters Bar */}
          <div className="mt-6 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by topic, skill, course title, or author (e.g., Python, React, Algorithms)..."
                value={searchInput}
                onChange={handleSearchChange}
                className="w-full pl-11 pr-10 py-2.5 rounded-xl border border-slate-300 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-500 transition"
              />
              {searchInput && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-lg"
                  title="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filter Dropdowns Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3 pt-1">
              {/* Category Filter */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Category</label>
                <select
                  value={categoryParam}
                  onChange={(e) => updateQuery({ categoryId: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-500 transition text-slate-700"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Content Type Filter */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Content Type</label>
                <select
                  value={typeParam}
                  onChange={(e) => updateQuery({ type: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-500 transition text-slate-700"
                >
                  {CONTENT_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Difficulty Level Filter */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Difficulty</label>
                <select
                  value={diffParam}
                  onChange={(e) => updateQuery({ difficulty: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-500 transition text-slate-700"
                >
                  {DIFFICULTY_LEVELS.map((d) => (
                    <option key={d.value} value={d.value}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Reset Filters Action */}
              <div className="flex items-end">
                {hasActiveFilters ? (
                  <button
                    onClick={handleResetFilters}
                    className="w-full flex items-center justify-center space-x-1.5 px-3 py-2 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 hover:text-slate-800 rounded-xl transition"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Filters</span>
                  </button>
                ) : (
                  <div className="hidden lg:flex items-center text-xs text-slate-400 py-2">
                    <SlidersHorizontal className="w-3.5 h-3.5 mr-1" />
                    <span>Filter by attributes</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="py-20 flex justify-center">
            <LoadingSpinner size="lg" message="Loading curated educational resources..." />
          </div>
        ) : error ? (
          <div className="py-16 text-center bg-white rounded-2xl border border-rose-200 p-8">
            <p className="text-rose-600 text-sm font-medium mb-3">{error}</p>
            <button
              onClick={fetchContent}
              className="px-4 py-2 bg-brand-600 text-white rounded-xl text-sm font-medium hover:bg-brand-700 transition"
            >
              Try Again
            </button>
          </div>
        ) : contentList.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="No Resources Found"
            description={
              hasActiveFilters
                ? 'No educational resources match your selected search or filter criteria. Try broadening your parameters.'
                : 'The learning catalog is currently empty. Please check back later.'
            }
            actionLabel={hasActiveFilters ? 'Clear All Filters' : undefined}
            onAction={hasActiveFilters ? handleResetFilters : undefined}
          />
        ) : (
          <>
            {/* Catalog Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {contentList.map((item) => (
                <ContentCard
                  key={item.id}
                  content={item}
                  isBookmarked={Boolean(bookmarkMap[item.id])}
                  onBookmarkToggle={handleBookmarkToggle}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {pagedData.totalPages > 1 && (
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white px-6 py-4 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-xs text-slate-500 font-medium">
                  Showing page <strong className="text-slate-800">{pagedData.pageNumber + 1}</strong> of{' '}
                  <strong className="text-slate-800">{pagedData.totalPages}</strong> (
                  {pagedData.totalElements} total items)
                </span>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateQuery({ page: Math.max(0, pagedData.pageNumber - 1) })}
                    disabled={pagedData.pageNumber === 0}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Previous</span>
                  </button>

                  <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(5, pagedData.totalPages) }, (_, i) => {
                      // Simple sliding window around current page
                      let p = i;
                      if (pagedData.totalPages > 5) {
                        const start = Math.max(
                          0,
                          Math.min(pagedData.pageNumber - 2, pagedData.totalPages - 5)
                        );
                        p = start + i;
                      }
                      const isCurrent = p === pagedData.pageNumber;
                      return (
                        <button
                          key={p}
                          onClick={() => updateQuery({ page: p })}
                          className={`w-8 h-8 rounded-lg text-xs font-bold transition ${
                            isCurrent
                              ? 'bg-brand-600 text-white shadow-sm'
                              : 'text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {p + 1}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => updateQuery({ page: pagedData.pageNumber + 1 })}
                    disabled={pagedData.lastPage || pagedData.pageNumber >= pagedData.totalPages - 1}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
