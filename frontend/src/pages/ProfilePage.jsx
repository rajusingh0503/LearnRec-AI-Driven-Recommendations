import React, { useState, useEffect, useCallback } from 'react';
import {
  User,
  Mail,
  Shield,
  Sliders,
  Sparkles,
  CheckCircle,
  Save,
  AlertCircle,
  History,
  BookOpen,
  ThumbsUp,
  Star,
  Bookmark,
  Award,
} from 'lucide-react';
import userService from '../services/userService';
import contentService from '../services/contentService';
import interactionService from '../services/interactionService';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

const CONTENT_TYPES = [
  { id: 'COURSE', label: 'Courses' },
  { id: 'BOOK', label: 'Books' },
  { id: 'TUTORIAL', label: 'Tutorials' },
  { id: 'CODING_PROBLEM', label: 'Coding Problems' },
  { id: 'RESOURCE', label: 'Reference Resources' },
];

const DIFFICULTY_LEVELS = [
  {
    id: 'BEGINNER',
    title: 'Beginner',
    desc: 'Foundational concepts, guided tutorials, and step-by-step walk-throughs.',
  },
  {
    id: 'INTERMEDIATE',
    title: 'Intermediate',
    desc: 'Practical projects, algorithmic problem-solving, and deep technical dives.',
  },
  {
    id: 'ADVANCED',
    title: 'Advanced',
    desc: 'System design, specialized research, optimization, and expert mastery.',
  },
];

export default function ProfilePage() {
  const { user, refreshUserProfile } = useAuth();

  // Profile data
  const [profile, setProfile] = useState(null);
  const [fullName, setFullName] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileNotice, setProfileNotice] = useState({ type: '', message: '' });

  // Preferences data
  const [categories, setCategories] = useState([]);
  const [preferredCategories, setPreferredCategories] = useState([]);
  const [preferredContentTypes, setPreferredContentTypes] = useState([]);
  const [preferredDifficulty, setPreferredDifficulty] = useState('BEGINNER');
  const [prefSaving, setPrefSaving] = useState(false);
  const [prefNotice, setPrefNotice] = useState({ type: '', message: '' });

  // Interaction history stats
  const [historyItems, setHistoryItems] = useState([]);
  const [stats, setStats] = useState({
    views: 0,
    likes: 0,
    ratings: 0,
    completed: 0,
    bookmarks: 0,
  });

  const [loading, setLoading] = useState(true);

  // Load profile, categories, preferences, and history
  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [profRes, prefRes, catRes, histRes, bmRes] = await Promise.allSettled([
        userService.getProfile(),
        userService.getPreferences(),
        contentService.getCategories(),
        interactionService.getHistory(),
        interactionService.getBookmarks(),
      ]);

      if (profRes.status === 'fulfilled' && profRes.value?.data) {
        const p = profRes.value.data;
        setProfile(p);
        setFullName(p.fullName || '');
      }

      if (catRes.status === 'fulfilled' && catRes.value?.data) {
        setCategories(catRes.value.data);
      }

      if (prefRes.status === 'fulfilled' && prefRes.value?.data) {
        const pr = prefRes.value.data;
        setPreferredCategories(pr.preferredCategories || []);
        setPreferredContentTypes(pr.preferredContentTypes || []);
        setPreferredDifficulty(pr.preferredDifficulty || 'BEGINNER');
      }

      const hist = histRes.status === 'fulfilled' ? histRes.value?.data || [] : [];
      setHistoryItems(hist);

      const bms = bmRes.status === 'fulfilled' ? bmRes.value?.data || [] : [];

      // Calculate stats
      const counts = {
        views: 0,
        likes: 0,
        ratings: 0,
        completed: 0,
        bookmarks: bms.length,
      };
      hist.forEach((h) => {
        if (h.interactionType === 'VIEW') counts.views++;
        if (h.interactionType === 'LIKE') counts.likes++;
        if (h.interactionType === 'RATE') counts.ratings++;
        if (h.interactionType === 'COMPLETE') counts.completed++;
      });
      setStats(counts);
    } catch (err) {
      console.error('Failed to load profile data', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  // Handle Full Name Profile Update
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!fullName.trim() || fullName.trim().length < 2) {
      setProfileNotice({
        type: 'error',
        message: 'Full name must be at least 2 characters.',
      });
      return;
    }

    setProfileSaving(true);
    setProfileNotice({ type: '', message: '' });
    try {
      const res = await userService.updateProfile(fullName.trim());
      if (res?.data) {
        setProfile((prev) => ({ ...prev, fullName: res.data.fullName }));
        await refreshUserProfile();
        setProfileNotice({
          type: 'success',
          message: 'Profile updated successfully!',
        });
        setTimeout(() => setProfileNotice({ type: '', message: '' }), 4000);
      }
    } catch (err) {
      console.error('Failed to update profile', err);
      setProfileNotice({
        type: 'error',
        message: err?.response?.data?.message || 'Failed to update profile.',
      });
    } finally {
      setProfileSaving(false);
    }
  };

  // Toggle Category Selection
  const toggleCategory = (catName) => {
    setPreferredCategories((prev) =>
      prev.includes(catName) ? prev.filter((c) => c !== catName) : [...prev, catName]
    );
  };

  // Toggle Content Type Selection
  const toggleContentType = (typeId) => {
    setPreferredContentTypes((prev) =>
      prev.includes(typeId) ? prev.filter((t) => t !== typeId) : [...prev, typeId]
    );
  };

  // Handle Preferences Save
  const handlePreferencesSubmit = async (e) => {
    e.preventDefault();
    if (!preferredDifficulty) {
      setPrefNotice({
        type: 'error',
        message: 'Please choose a preferred difficulty level.',
      });
      return;
    }

    setPrefSaving(true);
    setPrefNotice({ type: '', message: '' });
    try {
      await userService.updatePreferences({
        preferredCategories,
        preferredContentTypes,
        preferredDifficulty,
      });
      setPrefNotice({
        type: 'success',
        message: 'Learning preferences updated! Recommendations will now adapt to these goals.',
      });
      setTimeout(() => setPrefNotice({ type: '', message: '' }), 4000);
    } catch (err) {
      console.error('Failed to update preferences', err);
      setPrefNotice({
        type: 'error',
        message: err?.response?.data?.message || 'Failed to update preferences.',
      });
    } finally {
      setPrefSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner size="lg" message="Loading your profile and preferences..." />
      </div>
    );
  }

  const initials = (profile?.fullName || user?.fullName || 'User')
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Page Title */}
        <div>
          <div className="flex items-center space-x-2 text-brand-600 font-semibold text-xs tracking-wider uppercase mb-1">
            <User className="w-4 h-4" />
            <span>Account Center</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Profile & Learning Goals
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Configure your technical background, tracks of interest, and target content formats.
          </p>
        </div>

        {/* User Identity Banner Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-700 text-white flex items-center justify-center font-bold text-2xl shadow-lg shadow-brand-200 flex-shrink-0">
            {initials}
          </div>

          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h2 className="text-2xl font-bold text-slate-900">
                {profile?.fullName || user?.fullName || 'Learner'}
              </h2>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
                {(profile?.roles || user?.roles || ['ROLE_USER']).map((role, idx) => (
                  <span
                    key={idx}
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                      role === 'ROLE_ADMIN'
                        ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                        : 'bg-brand-50 text-brand-700 border-brand-200'
                    }`}
                  >
                    {role.replace('ROLE_', '')}
                  </span>
                ))}
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Active
                </span>
              </div>
            </div>

            <div className="flex items-center justify-center sm:justify-start space-x-2 text-xs text-slate-500">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>{profile?.email || user?.email}</span>
            </div>
          </div>
        </div>

        {/* Interactive Stats Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
            <span className="block text-2xl font-extrabold text-slate-900">{stats.views}</span>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Views
            </span>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
            <span className="block text-2xl font-extrabold text-amber-600">{stats.bookmarks}</span>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Watchlist
            </span>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
            <span className="block text-2xl font-extrabold text-emerald-600">{stats.completed}</span>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Completed
            </span>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
            <span className="block text-2xl font-extrabold text-brand-600">{stats.ratings}</span>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Rated
            </span>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center col-span-2 sm:col-span-1">
            <span className="block text-2xl font-extrabold text-rose-600">{stats.likes}</span>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Likes
            </span>
          </div>
        </div>

        {/* Edit Profile Form Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Personal Information</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Update the display name associated with your learning records and reviews.
            </p>
          </div>

          {profileNotice.message && (
            <div
              className={`flex items-start space-x-2 p-3.5 rounded-xl border text-xs font-semibold ${
                profileNotice.type === 'error'
                  ? 'bg-rose-50 border-rose-200 text-rose-700'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-700'
              }`}
            >
              {profileNotice.type === 'error' ? (
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
              ) : (
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
              )}
              <span>{profileNotice.message}</span>
            </div>
          )}

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  disabled
                  value={profile?.email || user?.email || ''}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-500 cursor-not-allowed"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Email cannot be modified directly.
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={profileSaving}
                className="flex items-center space-x-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-sm transition"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{profileSaving ? 'Saving…' : 'Save Profile'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* AI Learning Preferences Customization Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center space-x-2 text-brand-600 font-semibold text-xs tracking-wider uppercase mb-1">
                <Sparkles className="w-4 h-4" />
                <span>AI Recommendation Tailoring</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">Learning Preferences</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Our recommendation algorithms prioritize content matching your specified difficulty, technical tracks, and preferred formats.
              </p>
            </div>
          </div>

          {prefNotice.message && (
            <div
              className={`flex items-start space-x-2 p-3.5 rounded-xl border text-xs font-semibold ${
                prefNotice.type === 'error'
                  ? 'bg-rose-50 border-rose-200 text-rose-700'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-700'
              }`}
            >
              {prefNotice.type === 'error' ? (
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
              ) : (
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
              )}
              <span>{prefNotice.message}</span>
            </div>
          )}

          <form onSubmit={handlePreferencesSubmit} className="space-y-6">
            {/* Preferred Difficulty Level (Radio Cards) */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Target Difficulty Level <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {DIFFICULTY_LEVELS.map((diff) => {
                  const isSelected = preferredDifficulty === diff.id;
                  return (
                    <div
                      key={diff.id}
                      onClick={() => setPreferredDifficulty(diff.id)}
                      className={`cursor-pointer p-4 rounded-2xl border transition-all ${
                        isSelected
                          ? 'border-brand-500 bg-brand-50/50 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-sm text-slate-900">{diff.title}</span>
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected ? 'border-brand-600 bg-brand-600' : 'border-slate-300'
                          }`}
                        >
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">{diff.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Preferred Categories (Multi-select Pills) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Technical Tracks of Interest
                </label>
                <span className="text-xs text-slate-400">
                  {preferredCategories.length} selected
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Click to toggle areas you want prioritized in your personalized recommendation feed.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {categories.map((cat) => {
                  const isChecked = preferredCategories.includes(cat.name);
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => toggleCategory(cat.name)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                        isChecked
                          ? 'bg-brand-600 border-brand-600 text-white shadow-sm'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {cat.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Preferred Content Types (Multi-select Pills) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Preferred Media Formats
                </label>
                <span className="text-xs text-slate-400">
                  {preferredContentTypes.length} selected
                </span>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {CONTENT_TYPES.map((t) => {
                  const isChecked = preferredContentTypes.includes(t.id);
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => toggleContentType(t.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                        isChecked
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {t.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={prefSaving}
                className="flex items-center space-x-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-md shadow-brand-200 transition"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{prefSaving ? 'Updating Goals…' : 'Update Learning Preferences'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Recent Learning Activity Timeline */}
        {historyItems.length > 0 && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-4">
            <div className="flex items-center space-x-2 text-slate-900 font-bold text-base">
              <History className="w-4 h-4 text-brand-600" />
              <span>Recent Activity Log</span>
            </div>

            <div className="divide-y divide-slate-100">
              {historyItems.slice(0, 6).map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3">
                    <span
                      className={`p-1.5 rounded-lg ${
                        item.interactionType === 'LIKE'
                          ? 'bg-rose-50 text-rose-600'
                          : item.interactionType === 'COMPLETE'
                          ? 'bg-emerald-50 text-emerald-600'
                          : item.interactionType === 'RATE'
                          ? 'bg-amber-50 text-amber-600'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.interactionType === 'LIKE' && <ThumbsUp className="w-3.5 h-3.5" />}
                      {item.interactionType === 'COMPLETE' && <Award className="w-3.5 h-3.5" />}
                      {item.interactionType === 'RATE' && <Star className="w-3.5 h-3.5" />}
                      {item.interactionType === 'VIEW' && <BookOpen className="w-3.5 h-3.5" />}
                      {item.interactionType === 'BOOKMARK' && <Bookmark className="w-3.5 h-3.5" />}
                    </span>
                    <div>
                      <span className="font-semibold text-slate-900 block">{item.contentTitle}</span>
                      <span className="text-[11px] text-slate-400">
                        {item.interactionType}
                        {item.ratingValue ? ` (${item.ratingValue}/5 stars)` : ''} • {item.categoryName}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
