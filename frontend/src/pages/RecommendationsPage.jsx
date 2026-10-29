import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Sliders,
  TrendingUp,
  Zap,
  Bookmark,
  RefreshCw,
  Award,
  Layers,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Filter,
} from 'lucide-react';
import recommendationService from '../services/recommendationService';
import interactionService from '../services/interactionService';
import { useAuth } from '../context/AuthContext';
import ContentCard from '../components/common/ContentCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';

const STRATEGY_TABS = [
  { id: 'HYBRID', label: 'Top AI Matches', icon: Sparkles, desc: 'Weighted blend of your interests, skill target, and ratings' },
  { id: 'CHALLENGE', label: 'Skill Growth', icon: TrendingUp, desc: 'Challenging material to level up your technical depth' },
  { id: 'QUICK_START', label: 'Quick Starts', icon: Zap, desc: 'High-impact tutorials and focused reference materials' },
];

export default function RecommendationsPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [strategy, setStrategy] = useState('HYBRID');
  const [recommendations, setRecommendations] = useState([]);
  const [preferences, setPreferences] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Bookmark map: contentId -> interactionId
  const [bookmarkMap, setBookmarkMap] = useState({});
  const [categoryFilter, setCategoryFilter] = useState('');

  // Fetch bookmarks
  const loadBookmarks = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await interactionService.getBookmarks();
      if (res?.data) {
        const map = {};
        res.data.forEach((b) => {
          map[b.contentId] = b.id;
        });
        setBookmarkMap(map);
      }
    } catch (err) {
      console.error('Failed to load bookmarks', err);
    }
  }, [isAuthenticated]);

  // Fetch recommendations
  const loadRecommendations = useCallback(
    async (isManualRefresh = false) => {
      if (isManualRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);

      try {
        const data = await recommendationService.getPersonalizedRecommendations({
          strategy,
          limit: 16,
          categoryFilter: categoryFilter || null,
        });

        setRecommendations(data.recommendations || []);
        setPreferences(data.userPreferences || null);
      } catch (err) {
        console.error('Failed to load recommendations', err);
        setError('Unable to compute personalized recommendations. Please try again.');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [strategy, categoryFilter]
  );

  useEffect(() => {
    loadBookmarks();
  }, [loadBookmarks]);

  useEffect(() => {
    loadRecommendations();
  }, [loadRecommendations]);

  // Bookmark toggle
  const handleBookmarkToggle = async (contentId) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/recommendations' } } });
      return;
    }

    const interactionId = bookmarkMap[contentId];

    if (interactionId) {
      setBookmarkMap((prev) => {
        const next = { ...prev };
        delete next[contentId];
        return next;
      });
      try {
        await interactionService.removeInteraction(interactionId);
      } catch (err) {
        console.error('Failed to remove bookmark', err);
        setBookmarkMap((prev) => ({ ...prev, [contentId]: interactionId }));
      }
    } else {
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

  // Unique categories in the current recommendations
  const availableCategories = Array.from(
    new Set(recommendations.map((r) => r.categoryName).filter(Boolean))
  );

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Hero */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-brand-600 font-semibold text-xs tracking-wider uppercase">
              <Sparkles className="w-4 h-4 text-brand-500" />
              <span>Personalized AI Feed</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Curated for {user?.fullName || 'You'}
            </h1>
            <p className="text-sm text-slate-500 max-w-2xl leading-relaxed">
              Our AI engine continuously re-scores computer science courses, tutorials, and books based on your target difficulty, learning goals, and recent reviews.
            </p>
          </div>

          <div className="flex items-center space-x-3 self-start lg:self-auto">
            <button
              onClick={() => loadRecommendations(true)}
              disabled={refreshing || loading}
              className="flex items-center space-x-1.5 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-semibold shadow-sm transition disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-brand-600' : ''}`} />
              <span>{refreshing ? 'Re-calculating…' : 'Refresh Feed'}</span>
            </button>

            <Link
              to="/profile"
              className="flex items-center space-x-1.5 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-brand-200 transition"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Tune Preferences</span>
            </Link>
          </div>
        </div>

        {/* User Active Preferences Ribbon */}
        {preferences && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-bold text-slate-700 uppercase tracking-wider mr-1">Active Goals:</span>
              <span className="px-2.5 py-1 rounded-full bg-brand-50 text-brand-700 font-bold border border-brand-200">
                {preferences.preferredDifficulty || 'BEGINNER'} LEVEL
              </span>

              {preferences.preferredCategories && preferences.preferredCategories.length > 0 ? (
                preferences.preferredCategories.slice(0, 3).map((cat, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-medium"
                  >
                    {cat}
                  </span>
                ))
              ) : (
                <span className="text-slate-400 italic">No specific tracks selected</span>
              )}

              {preferences.preferredCategories && preferences.preferredCategories.length > 3 && (
                <span className="text-slate-400 font-medium">
                  +{preferences.preferredCategories.length - 3} more
                </span>
              )}
            </div>

            <Link
              to="/profile"
              className="inline-flex items-center space-x-1 text-xs font-semibold text-brand-600 hover:text-brand-700"
            >
              <span>Edit Goals</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        )}

        {/* Strategy Tabs Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {STRATEGY_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = strategy === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setStrategy(tab.id)}
                className={`text-left p-4 rounded-2xl border transition-all ${
                  isActive
                    ? 'bg-white border-brand-500 shadow-sm ring-2 ring-brand-100'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center space-x-2 mb-1">
                  <div
                    className={`p-1.5 rounded-lg ${
                      isActive ? 'bg-brand-50 text-brand-600' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span
                    className={`text-sm font-bold ${
                      isActive ? 'text-brand-600' : 'text-slate-800'
                    }`}
                  >
                    {tab.label}
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-snug">{tab.desc}</p>
              </button>
            );
          })}
        </div>

        {/* Category Pills Filter */}
        {availableCategories.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 flex-shrink-0">
              <Filter className="w-3 h-3" />
              <span>Track:</span>
            </span>
            <button
              onClick={() => setCategoryFilter('')}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition flex-shrink-0 ${
                !categoryFilter
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              All Matches
            </button>
            {availableCategories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition flex-shrink-0 ${
                  categoryFilter === cat
                    ? 'bg-brand-600 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Recommendations Grid */}
        {loading ? (
          <div className="py-20 flex justify-center">
            <LoadingSpinner size="lg" message="Computing tailored AI recommendations..." />
          </div>
        ) : error ? (
          <div className="py-16 text-center bg-white rounded-2xl border border-rose-200 p-8">
            <p className="text-rose-600 text-sm font-medium mb-3">{error}</p>
            <button
              onClick={() => loadRecommendations()}
              className="px-4 py-2 bg-brand-600 text-white rounded-xl text-sm font-medium hover:bg-brand-700 transition"
            >
              Try Again
            </button>
          </div>
        ) : recommendations.length === 0 ? (
          <EmptyState
            icon={Sparkles}
            title="No Matching Recommendations"
            description="We couldn't compute matches for your current filter combination. Try selecting a different track or updating your learning preferences."
            actionLabel="Tune Learning Preferences"
            onAction={() => navigate('/profile')}
          />
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recommendations.map((item) => (
                <div key={item.id} className="flex flex-col space-y-2">
                  {/* Rationale pill above card */}
                  <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl px-3 py-1.5 text-[11px] text-indigo-700 font-medium flex items-center space-x-1.5 truncate">
                    <Sparkles className="w-3 h-3 text-brand-500 flex-shrink-0" />
                    <span className="truncate">{item.primaryRationale}</span>
                  </div>

                  {/* ContentCard */}
                  <div className="flex-1">
                    <ContentCard
                      content={item}
                      showScore={true}
                      score={item.matchScore}
                      isBookmarked={Boolean(bookmarkMap[item.id])}
                      onBookmarkToggle={handleBookmarkToggle}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
