import React from 'react';
import { Sparkles, Brain, Cpu, Database, Cloud, BookOpen, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const DOMAINS = [
  "Artificial Intelligence",
  "Machine Learning",
  "Python Programming",
  "Java Programming",
  "C++ Programming",
  "Data Science",
  "Data Structures & Algorithms",
  "Web Development",
  "Databases & SQL",
  "Cloud Computing"
];

export default function HomePage() {
  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto px-4 sm:px-6">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold uppercase tracking-wider mb-6">
          <Sparkles className="w-3.5 h-3.5 text-brand-600" />
          <span>Next-Generation Personalized Learning</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Master Modern Tech with <br />
          <span className="bg-gradient-to-r from-brand-600 to-indigo-700 bg-clip-text text-transparent">
            AI-Driven Recommendations
          </span>
        </h1>
        <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
          LearnRec evaluates your skill level, goals, and interactions to recommend the optimal courses, books, tutorials, and coding challenges tailored specifically to you.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/register"
            className="inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-brand-600 text-white font-medium hover:bg-brand-700 transition shadow-md shadow-brand-200"
          >
            <span>Get Started Free</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/catalog"
            className="inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-white border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition"
          >
            <BookOpen className="w-4 h-4 text-slate-500" />
            <span>Browse 100+ Seed Resources</span>
          </Link>
        </div>
      </section>

      {/* 10 Domains Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-slate-900">Supported Learning Tracks</h2>
          <p className="text-sm text-slate-500 mt-1">
            Curated resources across 10 high-impact technical disciplines
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {DOMAINS.map((domain, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-white border border-slate-200 hover:border-brand-300 hover:shadow-md transition text-center group cursor-pointer"
            >
              <div className="w-10 h-10 mx-auto rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Brain className="w-5 h-5" />
              </div>
              <h3 className="text-xs font-semibold text-slate-800 line-clamp-2">
                {domain}
              </h3>
            </div>
          ))}
        </div>
      </section>

      {/* Recommendation Engine Features */}
      <section className="bg-white border-y border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-12 h-12 mx-auto rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-4">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Content-Based Filtering</h3>
              <p className="text-xs text-slate-600">
                TF-IDF and Cosine Similarity vectorization mapping your goals to exact item tags, descriptions, and difficulty levels.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-12 h-12 mx-auto rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center mb-4">
                <Database className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Collaborative Filtering</h3>
              <p className="text-xs text-slate-600">
                User-Item matrix factorization powered by TruncatedSVD discovering latent affinities from learner peer behavior.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-12 h-12 mx-auto rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Hybrid Fusion Engine</h3>
              <p className="text-xs text-slate-600">
                Dynamic weighted blending (0.6 Content-Based + 0.4 Collaborative) with seamless cold-start handling and admin parameter tuning.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
