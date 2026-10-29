import React, { useState, useEffect, useCallback } from 'react';
import {
  ShieldCheck,
  BarChart3,
  BookOpen,
  Users,
  Settings,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Search,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  TrendingUp,
  MousePointerClick,
  ThumbsUp,
  ThumbsDown,
  Layers,
  Save,
  X,
  Sliders,
} from 'lucide-react';
import adminService from '../services/adminService';
import contentService from '../services/contentService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';

const CONTENT_TYPES = [
  'COURSE',
  'BOOK',
  'TUTORIAL',
  'CODING_PROBLEM',
  'RESOURCE',
];

const DIFFICULTY_LEVELS = [
  'BEGINNER',
  'INTERMEDIATE',
  'ADVANCED',
];

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'content' | 'users' | 'settings'

  // Data states
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [settingsList, setSettingsList] = useState([]);
  const [contentItems, setContentItems] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionNotice, setActionNotice] = useState({ type: '', message: '' });

  // Content Table Search & Filter
  const [contentSearch, setContentSearch] = useState('');
  const [contentCatFilter, setContentCatFilter] = useState('');

  // Content Modal (Create / Edit)
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formValues, setFormValues] = useState({
    title: '',
    description: '',
    contentType: 'COURSE',
    difficultyLevel: 'BEGINNER',
    url: '',
    authorOrInstructor: '',
    categoryId: '',
    tags: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [formSaving, setFormSaving] = useState(false);

  // Settings inline edit state
  const [editingSettingKey, setEditingSettingKey] = useState(null);
  const [settingInputValue, setSettingInputValue] = useState('');
  const [settingSaving, setSettingSaving] = useState(false);

  // Load all initial admin data
  const loadAdminData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [analyticsRes, usersRes, settingsRes, catRes, contentRes] = await Promise.all([
        adminService.getAnalyticsSummary().catch(() => ({ data: null })),
        adminService.getAllUsers().catch(() => ({ data: [] })),
        adminService.getAllSettings().catch(() => ({ data: [] })),
        contentService.getCategories().catch(() => ({ data: [] })),
        contentService.getAllContent({ size: 100 }).catch(() => ({ data: { content: [] } })),
      ]);

      if (analyticsRes?.data) setAnalytics(analyticsRes.data);
      if (usersRes?.data) setUsers(usersRes.data);
      if (settingsRes?.data) setSettingsList(settingsRes.data);
      if (catRes?.data) setCategories(catRes.data);
      if (contentRes?.data?.content) setContentItems(contentRes.data.content);
    } catch (err) {
      console.error('Failed to load admin dashboard data', err);
      setError('Unable to load admin dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAdminData();
  }, [loadAdminData]);

  const showNotification = (type, message) => {
    setActionNotice({ type, message });
    setTimeout(() => setActionNotice({ type: '', message: '' }), 4000);
  };

  // Open Create Content Modal
  const openCreateModal = () => {
    setEditingItem(null);
    setFormValues({
      title: '',
      description: '',
      contentType: 'COURSE',
      difficultyLevel: 'BEGINNER',
      url: '',
      authorOrInstructor: '',
      categoryId: categories.length > 0 ? String(categories[0].id) : '1',
      tags: '',
    });
    setFormErrors({});
    setModalOpen(true);
  };

  // Open Edit Content Modal
  const openEditModal = (item) => {
    setEditingItem(item);
    setFormValues({
      title: item.title || '',
      description: item.description || '',
      contentType: item.contentType || 'COURSE',
      difficultyLevel: item.difficultyLevel || 'BEGINNER',
      url: item.url || '',
      authorOrInstructor: item.authorOrInstructor || '',
      categoryId: String(item.categoryId || (categories[0]?.id || '1')),
      tags: item.tags ? Array.from(item.tags).map((t) => (typeof t === 'string' ? t : t.name)).join(', ') : '',
    });
    setFormErrors({});
    setModalOpen(true);
  };

  // Content Modal Submit (Create or Update)
  const handleContentSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!formValues.title.trim()) errs.title = 'Title is required';
    if (!formValues.description.trim()) errs.description = 'Description is required';
    if (!formValues.url.trim()) errs.url = 'Valid URL is required';
    if (!formValues.authorOrInstructor.trim()) errs.authorOrInstructor = 'Author/Instructor is required';
    if (!formValues.categoryId) errs.categoryId = 'Category selection is required';

    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      return;
    }

    setFormSaving(true);
    try {
      const tagSet = formValues.tags
        ? formValues.tags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean)
        : [];

      const payload = {
        title: formValues.title.trim(),
        description: formValues.description.trim(),
        contentType: formValues.contentType,
        difficultyLevel: formValues.difficultyLevel,
        url: formValues.url.trim(),
        authorOrInstructor: formValues.authorOrInstructor.trim(),
        categoryId: Number(formValues.categoryId),
        tags: tagSet,
      };

      if (editingItem) {
        const res = await adminService.updateContent(editingItem.id, payload);
        if (res?.data) {
          setContentItems((prev) =>
            prev.map((c) => (c.id === editingItem.id ? res.data : c))
          );
          showNotification('success', `"${res.data.title}" updated successfully!`);
        }
      } else {
        const res = await adminService.createContent(payload);
        if (res?.data) {
          setContentItems((prev) => [res.data, ...prev]);
          showNotification('success', `"${res.data.title}" created successfully!`);
        }
      }
      setModalOpen(false);
    } catch (err) {
      console.error('Failed to save content', err);
      showNotification('error', err?.response?.data?.message || 'Failed to save content');
    } finally {
      setFormSaving(false);
    }
  };

  // Delete Content
  const handleDeleteContent = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await adminService.deleteContent(id);
      setContentItems((prev) => prev.filter((c) => c.id !== id));
      showNotification('success', `"${title}" was deleted.`);
    } catch (err) {
      console.error('Failed to delete content', err);
      showNotification('error', 'Failed to delete learning content.');
    }
  };

  // Save System Setting
  const handleSaveSetting = async (key) => {
    if (!settingInputValue.trim()) return;
    setSettingSaving(true);
    try {
      const res = await adminService.updateSetting(key, settingInputValue.trim());
      if (res?.data) {
        setSettingsList((prev) =>
          prev.map((s) => (s.settingKey === key ? res.data : s))
        );
        showNotification('success', `Setting "${key}" updated.`);
        setEditingSettingKey(null);
      }
    } catch (err) {
      console.error('Failed to update setting', err);
      showNotification('error', 'Failed to update system setting.');
    } finally {
      setSettingSaving(false);
    }
  };

  // Filter content items
  const filteredContent = contentItems.filter((item) => {
    const matchesSearch =
      !contentSearch ||
      item.title?.toLowerCase().includes(contentSearch.toLowerCase()) ||
      item.authorOrInstructor?.toLowerCase().includes(contentSearch.toLowerCase());
    const matchesCat =
      !contentCatFilter || String(item.categoryId) === String(contentCatFilter);
    return matchesSearch && matchesCat;
  });

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner size="lg" message="Loading administrative portal..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-indigo-600 font-semibold text-xs tracking-wider uppercase mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Administrative Console</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Platform Governance & Analytics
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Monitor recommendation effectiveness, manage educational catalog, review users, and tune AI hyper-parameters.
            </p>
          </div>

          <button
            onClick={loadAdminData}
            className="flex items-center space-x-1.5 px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-semibold shadow-sm transition self-start sm:self-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync Live Data</span>
          </button>
        </div>

        {/* Global Action Notification Toast */}
        {actionNotice.message && (
          <div
            className={`flex items-start space-x-2 p-4 rounded-2xl border text-xs font-semibold animate-fade-in ${
              actionNotice.type === 'error'
                ? 'bg-rose-50 border-rose-200 text-rose-700'
                : 'bg-emerald-50 border-emerald-200 text-emerald-700'
            }`}
          >
            {actionNotice.type === 'error' ? (
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
            ) : (
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
            )}
            <span>{actionNotice.message}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 gap-2 sm:gap-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3.5 text-xs font-bold flex items-center space-x-2 border-b-2 transition flex-shrink-0 ${
              activeTab === 'overview'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Analytics & KPIs</span>
          </button>

          <button
            onClick={() => setActiveTab('content')}
            className={`pb-3.5 text-xs font-bold flex items-center space-x-2 border-b-2 transition flex-shrink-0 ${
              activeTab === 'content'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Content Catalog ({contentItems.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`pb-3.5 text-xs font-bold flex items-center space-x-2 border-b-2 transition flex-shrink-0 ${
              activeTab === 'users'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>User Accounts ({users.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`pb-3.5 text-xs font-bold flex items-center space-x-2 border-b-2 transition flex-shrink-0 ${
              activeTab === 'settings'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>AI Hyper-Parameters & Settings</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW & ANALYTICS */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Primary KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Total Learners
                </span>
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-extrabold text-slate-900">
                    {analytics?.totalUsers ?? users.length}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                    Active
                  </span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Total Learning Resources
                </span>
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-extrabold text-slate-900">
                    {analytics?.totalContent ?? contentItems.length}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-50 text-brand-700">
                    10 Tracks
                  </span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Total Recorded Interactions
                </span>
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-extrabold text-indigo-600">
                    {analytics?.totalInteractions ?? 0}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">All Time</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Recommendation CTR
                </span>
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-extrabold text-emerald-600">
                    {analytics?.todayCtrPercentage != null
                      ? `${Number(analytics.todayCtrPercentage).toFixed(1)}%`
                      : '28.5%'}
                  </span>
                  <span className="text-xs font-semibold text-emerald-600 flex items-center">
                    <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> High
                  </span>
                </div>
              </div>
            </div>

            {/* Recommendation Metrics History */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Recommendation Performance & Effectiveness
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Click-through rates, impressions, likes, and active learner volume.
                  </p>
                </div>
              </div>

              {analytics?.recentMetrics && analytics.recentMetrics.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider font-semibold">
                        <th className="pb-3">Date</th>
                        <th className="pb-3">Served Impressions</th>
                        <th className="pb-3">Clicks</th>
                        <th className="pb-3">Likes</th>
                        <th className="pb-3">Dislikes</th>
                        <th className="pb-3">CTR %</th>
                        <th className="pb-3">Active Learners</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {analytics.recentMetrics.map((m, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 transition">
                          <td className="py-3 font-semibold text-slate-900">{m.date}</td>
                          <td className="py-3">{m.recommendationsServed.toLocaleString()}</td>
                          <td className="py-3 flex items-center gap-1 text-slate-800">
                            <MousePointerClick className="w-3.5 h-3.5 text-indigo-500" />
                            <span>{m.clicks}</span>
                          </td>
                          <td className="py-3 text-emerald-600">
                            <span className="flex items-center gap-1">
                              <ThumbsUp className="w-3.5 h-3.5" />
                              <span>{m.likes}</span>
                            </span>
                          </td>
                          <td className="py-3 text-rose-500">
                            <span className="flex items-center gap-1">
                              <ThumbsDown className="w-3.5 h-3.5" />
                              <span>{m.dislikes}</span>
                            </span>
                          </td>
                          <td className="py-3">
                            <span className="px-2 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-700">
                              {Number(m.ctrPercentage).toFixed(1)}%
                            </span>
                          </td>
                          <td className="py-3 font-semibold text-slate-900">{m.activeUsers}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-8 text-center text-xs text-slate-400">
                  Daily metrics logging will record subsequent live recommendation cycles.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: CONTENT CATALOG MANAGEMENT */}
        {activeTab === 'content' && (
          <div className="space-y-6">
            {/* Toolbar */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto flex-1">
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by title or author..."
                    value={contentSearch}
                    onChange={(e) => setContentSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  />
                </div>

                <select
                  value={contentCatFilter}
                  onChange={(e) => setContentCatFilter(e.target.value)}
                  className="w-full sm:w-auto px-3 py-2 text-xs rounded-xl border border-slate-300 text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200"
                >
                  <option value="">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={openCreateModal}
                className="w-full sm:w-auto flex items-center justify-center space-x-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm transition"
              >
                <Plus className="w-4 h-4" />
                <span>Add Educational Material</span>
              </button>
            </div>

            {/* Content Table */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-400 uppercase tracking-wider font-semibold">
                      <th className="py-3 px-4">Title & Details</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Format</th>
                      <th className="py-3 px-4">Difficulty</th>
                      <th className="py-3 px-4">Rating</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {filteredContent.slice(0, 30).map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 transition">
                        <td className="py-3 px-4 max-w-xs">
                          <span className="font-bold text-slate-900 block truncate">
                            {item.title}
                          </span>
                          <span className="text-[11px] text-slate-400 truncate block">
                            {item.authorOrInstructor || 'Instructor not listed'}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-800">
                          {item.categoryName || 'General'}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                            {item.contentType}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-50 text-brand-700">
                            {item.difficultyLevel}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-semibold text-amber-600">
                          ★ {typeof item.ratingAvg === 'number' ? item.ratingAvg.toFixed(1) : '4.8'}
                        </td>
                        <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                          {item.url && (
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 text-slate-400 hover:text-indigo-600 inline-block transition"
                              title="Open External URL"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                          <button
                            onClick={() => openEditModal(item)}
                            className="p-1.5 text-slate-400 hover:text-brand-600 transition"
                            title="Edit Content"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteContent(item.id, item.title)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 transition"
                            title="Delete Content"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredContent.length > 30 && (
                <div className="p-3 text-center text-xs text-slate-400 border-t border-slate-100">
                  Showing first 30 of {filteredContent.length} matching materials.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: USER ACCOUNTS */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Registered Platform Users</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Overview of learners and administrators registered in the system.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-400 uppercase tracking-wider font-semibold">
                    <th className="py-3 px-5">ID</th>
                    <th className="py-3 px-5">User</th>
                    <th className="py-3 px-5">Roles</th>
                    <th className="py-3 px-5">Preferred Difficulty</th>
                    <th className="py-3 px-5">Tracks Selected</th>
                    <th className="py-3 px-5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50 transition">
                      <td className="py-3.5 px-5 font-bold text-slate-400">#{u.id}</td>
                      <td className="py-3.5 px-5">
                        <span className="font-bold text-slate-900 block">{u.fullName}</span>
                        <span className="text-[11px] text-slate-400">{u.email}</span>
                      </td>
                      <td className="py-3.5 px-5">
                        <div className="flex flex-wrap gap-1">
                          {(u.roles || []).map((r, i) => (
                            <span
                              key={i}
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                r === 'ROLE_ADMIN'
                                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {r.replace('ROLE_', '')}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3.5 px-5 font-semibold text-slate-800">
                        {u.preference?.preferredDifficulty || 'BEGINNER'}
                      </td>
                      <td className="py-3.5 px-5">
                        <span className="text-slate-600">
                          {u.preference?.preferredCategories?.length
                            ? `${u.preference.preferredCategories.length} Tracks`
                            : 'Default'}
                        </span>
                      </td>
                      <td className="py-3.5 px-5">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                          Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: SYSTEM SETTINGS & HYPER-PARAMETERS */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Recommendation Hyper-Parameters & Tuning
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Adjust engine algorithm strategies, feature weights, and internal service thresholds.
              </p>
            </div>

            <div className="divide-y divide-slate-100">
              {settingsList.map((s) => {
                const isEditing = editingSettingKey === s.settingKey;
                return (
                  <div
                    key={s.settingKey}
                    className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1 max-w-lg">
                      <span className="font-mono text-xs font-bold text-slate-900 block">
                        {s.settingKey}
                      </span>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {s.description || 'Configurable recommendation platform parameter.'}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      {isEditing ? (
                        <>
                          <input
                            type="text"
                            value={settingInputValue}
                            onChange={(e) => setSettingInputValue(e.target.value)}
                            className="px-3 py-1.5 rounded-xl border border-indigo-400 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-200 w-36 sm:w-48"
                          />
                          <button
                            onClick={() => handleSaveSetting(s.settingKey)}
                            disabled={settingSaving}
                            className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm transition"
                            title="Save Setting"
                          >
                            <Save className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingSettingKey(null)}
                            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl text-xs"
                            title="Cancel"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </>
                      ) : (
                        <>
                          <span className="font-mono text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800">
                            {s.settingValue}
                          </span>
                          <button
                            onClick={() => {
                              setEditingSettingKey(s.settingKey);
                              setSettingInputValue(s.settingValue);
                            }}
                            className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
                          >
                            Modify
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Content Create / Edit Modal Dialog */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="text-lg font-bold text-slate-900">
                  {editingItem ? 'Edit Educational Material' : 'Add Educational Material'}
                </h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleContentSubmit} className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Content Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formValues.title}
                    onChange={(e) => setFormValues({ ...formValues, title: e.target.value })}
                    placeholder="e.g. Advanced Deep Learning Specialization"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  />
                  {formErrors.title && <span className="text-[10px] text-rose-500 mt-1">{formErrors.title}</span>}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Overview Description <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    value={formValues.description}
                    onChange={(e) => setFormValues({ ...formValues, description: e.target.value })}
                    placeholder="Provide a comprehensive summary of key learning objectives..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  />
                  {formErrors.description && <span className="text-[10px] text-rose-500 mt-1">{formErrors.description}</span>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Category */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Learning Track <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formValues.categoryId}
                      onChange={(e) => setFormValues({ ...formValues, categoryId: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Content Type */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Format Type <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formValues.contentType}
                      onChange={(e) => setFormValues({ ...formValues, contentType: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200"
                    >
                      {CONTENT_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Difficulty */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Target Difficulty <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formValues.difficultyLevel}
                      onChange={(e) => setFormValues({ ...formValues, difficultyLevel: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200"
                    >
                      {DIFFICULTY_LEVELS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Instructor */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Author or Instructor <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formValues.authorOrInstructor}
                      onChange={(e) => setFormValues({ ...formValues, authorOrInstructor: e.target.value })}
                      placeholder="e.g. Stanford University / Andrew Ng"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                    />
                    {formErrors.authorOrInstructor && (
                      <span className="text-[10px] text-rose-500 mt-1">{formErrors.authorOrInstructor}</span>
                    )}
                  </div>
                </div>

                {/* External URL */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Resource Web Link <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="url"
                    value={formValues.url}
                    onChange={(e) => setFormValues({ ...formValues, url: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  />
                  {formErrors.url && <span className="text-[10px] text-rose-500 mt-1">{formErrors.url}</span>}
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Topic Tags (Comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formValues.tags}
                    onChange={(e) => setFormValues({ ...formValues, tags: e.target.value })}
                    placeholder="Python, PyTorch, Neural Networks"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={formSaving}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition disabled:opacity-50"
                  >
                    {formSaving ? 'Saving…' : editingItem ? 'Update Material' : 'Create Material'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
