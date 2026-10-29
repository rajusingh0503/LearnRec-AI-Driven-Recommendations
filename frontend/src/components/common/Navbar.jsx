import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Sparkles,
  BookOpen,
  Layers,
  ShieldCheck,
  User,
  LogOut,
  Bookmark,
  Menu,
  X,
  Sliders
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-md shadow-brand-200">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-brand-600 to-indigo-800 bg-clip-text text-transparent">
                  LearnRec
                </span>
                <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
                  AI-Powered
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6 text-sm font-medium text-slate-600">
            <Link
              to="/"
              className={`hover:text-brand-600 transition-colors flex items-center space-x-1.5 py-1 ${
                isActive('/') ? 'text-brand-600 font-semibold border-b-2 border-brand-600' : ''
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Explore</span>
            </Link>

            <Link
              to="/catalog"
              className={`hover:text-brand-600 transition-colors flex items-center space-x-1.5 py-1 ${
                isActive('/catalog') ? 'text-brand-600 font-semibold border-b-2 border-brand-600' : ''
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Catalog</span>
            </Link>

            <Link
              to="/recommendations"
              className={`hover:text-brand-600 transition-colors flex items-center space-x-1.5 py-1 ${
                isActive('/recommendations') ? 'text-brand-600 font-semibold border-b-2 border-brand-600' : ''
              }`}
            >
              <Sparkles className="w-4 h-4 text-brand-500" />
              <span>Recommendations</span>
            </Link>

            {isAuthenticated && (
              <Link
                to="/bookmarks"
                className={`hover:text-brand-600 transition-colors flex items-center space-x-1.5 py-1 ${
                  isActive('/bookmarks') ? 'text-brand-600 font-semibold border-b-2 border-brand-600' : ''
                }`}
              >
                <Bookmark className="w-4 h-4 text-amber-500" />
                <span>Watchlist</span>
              </Link>
            )}
          </div>

          {/* Auth Actions (Desktop) */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className={`text-xs font-medium flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border transition ${
                      isActive('/admin')
                        ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 text-indigo-600" />
                    <span>Admin Portal</span>
                  </Link>
                )}

                <Link
                  to="/profile"
                  className={`text-xs font-medium flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border transition ${
                    isActive('/profile')
                      ? 'bg-brand-50 border-brand-300 text-brand-700'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                  title="Profile & Preferences"
                >
                  <User className="w-4 h-4 text-slate-500" />
                  <span className="max-w-[120px] truncate">{user?.fullName || user?.email}</span>
                  <Sliders className="w-3 h-3 text-slate-400" />
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-700 hover:text-brand-600 hover:bg-slate-50 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center space-x-1 px-4 py-2 rounded-lg text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 transition shadow-sm"
                >
                  <span>Get Started</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-2">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Explore
          </Link>
          <Link
            to="/catalog"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Catalog
          </Link>
          <Link
            to="/recommendations"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Recommendations
          </Link>
          {isAuthenticated && (
            <Link
              to="/bookmarks"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Watchlist
            </Link>
          )}

          <div className="pt-2 border-t border-slate-100">
            {isAuthenticated ? (
              <div className="space-y-2">
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Profile & Preferences ({user?.fullName || user?.email})
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm font-medium text-indigo-700 bg-indigo-50"
                  >
                    Admin Portal
                  </Link>
                )}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-rose-600 hover:bg-rose-50"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="space-y-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center px-4 py-2 rounded-lg text-sm font-medium text-slate-700 border border-slate-200"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center px-4 py-2 rounded-lg text-sm font-medium text-white bg-brand-600"
                >
                  Get Started Free
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
