import React from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Star, ExternalLink, User } from 'lucide-react';

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

export default function ContentCard({
  content,
  isBookmarked = false,
  onBookmarkToggle,
  showScore = false,
  score,
}) {
  if (!content) return null;

  const typeClass = CONTENT_TYPE_STYLES[content.contentType] || 'bg-slate-50 text-slate-700 border-slate-200';
  const diffClass = DIFFICULTY_STYLES[content.difficultyLevel] || 'bg-slate-50 text-slate-700 border-slate-200';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between overflow-hidden group">
      {/* Card Header & Badges */}
      <div className="p-5 pb-3">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${typeClass}`}>
              {content.contentType?.replace('_', ' ')}
            </span>
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${diffClass}`}>
              {content.difficultyLevel}
            </span>
          </div>

          {onBookmarkToggle && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onBookmarkToggle(content.id);
              }}
              title={isBookmarked ? 'Remove from Watchlist' : 'Save to Watchlist'}
              className={`p-1.5 rounded-lg transition-colors ${
                isBookmarked
                  ? 'bg-amber-50 text-amber-600 hover:bg-amber-100'
                  : 'text-slate-400 hover:text-amber-500 hover:bg-slate-100'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500' : ''}`} />
            </button>
          )}
        </div>

        {/* Content Title */}
        <Link to={`/content/${content.id}`} className="block group-hover:text-brand-600 transition-colors">
          <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-2 mb-1.5">
            {content.title}
          </h3>
        </Link>

        {/* Category & Instructor */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
          {content.categoryName && (
            <span className="font-medium text-slate-600">{content.categoryName}</span>
          )}
          {content.authorOrInstructor && (
            <>
              <span>•</span>
              <span className="truncate flex items-center gap-1">
                <User className="w-3 h-3 text-slate-400" />
                {content.authorOrInstructor}
              </span>
            </>
          )}
        </div>

        {/* Description snippet */}
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
          {content.description}
        </p>

        {/* Tags */}
        {content.tags && content.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {content.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="text-[10px] font-medium px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md"
              >
                #{typeof tag === 'string' ? tag : tag.name}
              </span>
            ))}
            {content.tags.length > 3 && (
              <span className="text-[10px] font-medium px-1.5 py-0.5 text-slate-400">
                +{content.tags.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Card Footer: Rating & CTA */}
      <div className="px-5 py-3.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between mt-2">
        <div className="flex items-center space-x-1.5 text-xs text-slate-700">
          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span className="font-bold">
            {typeof content.ratingAvg === 'number' ? content.ratingAvg.toFixed(1) : '4.8'}
          </span>
          {content.ratingCount > 0 && (
            <span className="text-slate-400">({content.ratingCount.toLocaleString()})</span>
          )}
        </div>

        {showScore && score !== undefined && (
          <span className="text-[11px] font-semibold text-brand-600 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
            Match: {(score * 100).toFixed(0)}%
          </span>
        )}

        <Link
          to={`/content/${content.id}`}
          className="inline-flex items-center space-x-1 text-xs font-semibold text-brand-600 hover:text-brand-700 transition"
        >
          <span>Details</span>
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
