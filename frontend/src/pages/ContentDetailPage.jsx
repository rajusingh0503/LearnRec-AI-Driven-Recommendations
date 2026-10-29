import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ExternalLink,
  Star,
  Bookmark,
  CheckCircle,
  ThumbsUp,
  User,
  Calendar,
  Layers,
  Sparkles,
  BookOpen,
  Share2,
  Check,
} from 'lucide-react';
import contentService from '../services/contentService';
import interactionService from '../services/interactionService';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import ContentCard from '../components/common/ContentCard';

const CONTENT_TYPE_STYLES = {
  COURSE: 'bg-blue-50 text-blue-700 border-blue-200',
  BOOK: 'bg-amber-50 text-amber-700 border-amber-200',
  TUTORIAL: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  CODING_PROBLEM: 'bg-purple-50 text-purple-700 border-purple-200',
  RESOURCE: 'bg-slate-50 text-slate-700 border-slate-200',
};

const DIFFICULTY_STYLES = {
  BEGINNER: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  INTERMEDIATE: 'bg-yellow-50 text-yellow-800 border-yellow-200',
  ADVANCED: 'bg-rose-50 text-rose-700 border-rose-200',
};

export default function ContentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Interaction states
  const [bookmarkId, setBookmarkId] = useState(null);
  const [userRating, setUserRating] = useState(null);
  const [hoverRating, setHoverRating] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [actionNotice, setActionNotice] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  // Related content in same category
  const [relatedContent, setRelatedContent] = useState([]);
  const hasRecordedView = useRef(false);

  // Load content details
  const fetchDetail = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await contentService.getContentById(id);
      if (res?.data) {
        setContent(res.data);

        // Fetch related recommendations in same category
        if (res.data.categoryId) {
          try {
            const relRes = await contentService.getAllContent({
              categoryId: res.data.categoryId,
              size: 4,
            });
            if (relRes?.data?.content) {
              setRelatedContent(
                relRes.data.content.filter((c) => String(c.id) !== String(id)).slice(0, 3)
              );
            }
          } catch {
            // Ignore related fetch failure
          }
        }
      } else {
        setError('Educational resource not found.');
      }
    } catch (err) {
      console.error('Failed to load content details', err);
      setError('Unable to load content details. Please verify the URL or try again.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    hasRecordedView.current = false;
    setUserRating(null);
    setIsLiked(false);
    setIsCompleted(false);
    setBookmarkId(null);
    fetchDetail();
  }, [id, fetchDetail]);

  // Load user interaction history for this content (Bookmark, Rating, etc.)
  useEffect(() => {
    if (!isAuthenticated || !content) return;

    async function loadUserInteractions() {
      try {
        const [bookmarksRes, historyRes] = await Promise.allSettled([
          interactionService.getBookmarks(),
          interactionService.getHistory(),
        ]);

        if (bookmarksRes.status === 'fulfilled' && bookmarksRes.value?.data) {
          const match = bookmarksRes.value.data.find((b) => String(b.contentId) === String(id));
          if (match) setBookmarkId(match.id);
        }

        if (historyRes.status === 'fulfilled' && historyRes.value?.data) {
          const historyForThis = historyRes.value.data.filter(
            (h) => String(h.contentId) === String(id)
          );
          historyForThis.forEach((item) => {
            if (item.interactionType === 'RATE' && item.ratingValue) {
              setUserRating(item.ratingValue);
            }
            if (item.interactionType === 'LIKE') {
              setIsLiked(true);
            }
            if (item.interactionType === 'COMPLETE') {
              setIsCompleted(true);
            }
          });
        }
      } catch (err) {
        console.error('Failed to load interaction state', err);
      }
    }

    loadUserInteractions();

    // Auto-record VIEW interaction once per content load
    if (!hasRecordedView.current) {
      hasRecordedView.current = true;
      interactionService
        .recordInteraction({ contentId: Number(id), interactionType: 'VIEW' })
        .catch(() => {});
    }
  }, [isAuthenticated, content, id]);

  const showFeedback = (msg) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(''), 3000);
  };

  // Bookmark Toggle
  const handleBookmarkToggle = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/content/${id}` } } });
      return;
    }

    if (bookmarkId) {
      const prevId = bookmarkId;
      setBookmarkId(null);
      showFeedback('Removed from Watchlist');
      try {
        await interactionService.removeInteraction(prevId);
      } catch (err) {
        console.error('Failed to remove bookmark', err);
        setBookmarkId(prevId);
      }
    } else {
      setBookmarkId('temp');
      showFeedback('Saved to Watchlist!');
      try {
        const res = await interactionService.recordInteraction({
          contentId: Number(id),
          interactionType: 'BOOKMARK',
        });
        if (res?.data?.id) setBookmarkId(res.data.id);
      } catch (err) {
        console.error('Failed to bookmark', err);
        setBookmarkId(null);
      }
    }
  };

  // Submit Rating
  const handleRating = async (stars) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/content/${id}` } } });
      return;
    }
    setUserRating(stars);
    showFeedback(`Rated ${stars} / 5 stars!`);
    try {
      await interactionService.recordInteraction({
        contentId: Number(id),
        interactionType: 'RATE',
        ratingValue: stars,
      });
    } catch (err) {
      console.error('Failed to record rating', err);
    }
  };

  // Like Toggle
  const handleLike = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/content/${id}` } } });
      return;
    }
    const nextState = !isLiked;
    setIsLiked(nextState);
    if (nextState) {
      showFeedback('Liked this resource!');
      try {
        await interactionService.recordInteraction({
          contentId: Number(id),
          interactionType: 'LIKE',
        });
      } catch (err) {
        console.error('Failed to like', err);
      }
    }
  };

  // Mark Completed
  const handleComplete = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/content/${id}` } } });
      return;
    }
    const nextState = !isCompleted;
    setIsCompleted(nextState);
    if (nextState) {
      showFeedback('Marked as Completed!');
      try {
        await interactionService.recordInteraction({
          contentId: Number(id),
          interactionType: 'COMPLETE',
        });
      } catch (err) {
        console.error('Failed to complete', err);
      }
    }
  };

  // Copy share link
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner size="lg" message="Loading educational resource..." />
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <EmptyState
          icon={BookOpen}
          title="Content Not Found"
          description={error || 'The requested educational resource could not be found.'}
          actionLabel="Back to Catalog"
          onAction={() => navigate('/catalog')}
        />
      </div>
    );
  }

  const typeClass = CONTENT_TYPE_STYLES[content.contentType] || 'bg-slate-50 text-slate-700 border-slate-200';
  const diffClass = DIFFICULTY_STYLES[content.difficultyLevel] || 'bg-slate-50 text-slate-700 border-slate-200';

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            to="/catalog"
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-600 hover:text-brand-600 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Catalog</span>
          </Link>

          {/* Action Notice Toast */}
          {actionNotice && (
            <div className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 animate-fade-in">
              {actionNotice}
            </div>
          )}
        </div>

        {/* Main Content Hero Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          {/* Badges & Meta */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-xs font-bold px-3 py-1 rounded-full border ${typeClass}`}>
                {content.contentType?.replace('_', ' ')}
              </span>
              <span className={`text-xs font-bold px-3 py-1 rounded-full border ${diffClass}`}>
                {content.difficultyLevel}
              </span>
              {content.categoryName && (
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                  {content.categoryName}
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleCopyLink}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
                title="Share link"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              </button>
              <button
                onClick={handleBookmarkToggle}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                  bookmarkId
                    ? 'bg-amber-50 border-amber-300 text-amber-700'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${bookmarkId ? 'fill-amber-500 text-amber-500' : ''}`} />
                <span>{bookmarkId ? 'In Watchlist' : 'Save to Watchlist'}</span>
              </button>
            </div>
          </div>

          {/* Title & Author */}
          <div className="space-y-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
              {content.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
              {content.authorOrInstructor && (
                <div className="flex items-center space-x-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-medium text-slate-700">Instructor:</span>
                  <span>{content.authorOrInstructor}</span>
                </div>
              )}

              <div className="flex items-center space-x-1 text-slate-700">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span className="font-bold">
                  {typeof content.ratingAvg === 'number' ? content.ratingAvg.toFixed(1) : '4.8'}
                </span>
                <span className="text-slate-400">
                  ({(content.ratingCount || 0).toLocaleString()} reviews)
                </span>
              </div>

              {content.createdAt && (
                <div className="flex items-center space-x-1.5 text-slate-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Added {new Date(content.createdAt).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>

          {/* External Access CTA Button */}
          {content.url && (
            <div className="pt-2">
              <a
                href={content.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl text-sm font-semibold shadow-md shadow-brand-200 transition"
              >
                <span>Access Course / Open External Link</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}

          {/* Description Section */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Overview</h2>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {content.description}
            </p>
          </div>

          {/* Tags */}
          {content.tags && content.tags.length > 0 && (
            <div className="space-y-2 pt-2">
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Topics & Skills</h2>
              <div className="flex flex-wrap gap-2">
                {Array.from(content.tags).map((tag, idx) => {
                  const tagName = typeof tag === 'string' ? tag : tag.name;
                  return (
                    <Link
                      key={idx}
                      to={`/catalog?keyword=${encodeURIComponent(tagName)}`}
                      className="text-xs font-medium px-3 py-1 bg-slate-100 hover:bg-brand-50 hover:text-brand-700 text-slate-700 rounded-lg transition"
                    >
                      #{tagName}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Interactive Engagement Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex items-center space-x-2 text-brand-600 font-semibold text-xs tracking-wider uppercase">
            <Sparkles className="w-4 h-4" />
            <span>Interactive Learning Progress & Feedback</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Interactive Rating Component */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Rate this material
                </span>
                {userRating && (
                  <span className="text-xs font-semibold text-brand-600 bg-brand-50 px-2 py-0.5 rounded">
                    Your rating: {userRating}/5
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                Help improve AI recommendations by rating the clarity and depth of this content.
              </p>

              {/* 5 Interactive Stars */}
              <div className="flex items-center space-x-1.5 pt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(null)}
                    onClick={() => handleRating(star)}
                    className="p-1 text-slate-300 hover:scale-110 transition-transform focus:outline-none"
                    title={`Rate ${star} star${star > 1 ? 's' : ''}`}
                  >
                    <Star
                      className={`w-6 h-6 transition-colors ${
                        (hoverRating || userRating) >= star
                          ? 'text-amber-500 fill-amber-500'
                          : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Actions (Like & Completed) */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Track Completion
              </span>
              <p className="text-xs text-slate-500">
                Mark completed to update your learning path and receive more advanced recommendations.
              </p>

              <div className="flex items-center space-x-3 pt-1">
                <button
                  onClick={handleComplete}
                  className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold border transition ${
                    isCompleted
                      ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                      : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <CheckCircle className={`w-4 h-4 ${isCompleted ? 'text-white' : 'text-slate-400'}`} />
                  <span>{isCompleted ? 'Completed' : 'Mark Complete'}</span>
                </button>

                <button
                  onClick={handleLike}
                  className={`flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold border transition ${
                    isLiked
                      ? 'bg-rose-50 border-rose-300 text-rose-600'
                      : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}
                  title="Like this resource"
                >
                  <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                  <span>{isLiked ? 'Liked' : 'Like'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Related Content in Category */}
        {relatedContent.length > 0 && (
          <div className="pt-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Related Educational Content</h2>
                <p className="text-xs text-slate-500">More resources in {content.categoryName}</p>
              </div>
              <Link
                to={`/catalog?categoryId=${content.categoryId}`}
                className="text-xs font-semibold text-brand-600 hover:text-brand-700 transition"
              >
                View all in category →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedContent.map((rel) => (
                <ContentCard key={rel.id} content={rel} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
