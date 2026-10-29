import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-slate-500">
        <p className="font-medium text-slate-700 mb-1">
          LearnRec — AI-Based Personalized Learning Recommendation System
        </p>
        <p className="text-xs text-slate-400">
          Powered by React, Spring Boot, MySQL, and Python FastAPI Hybrid Recommendation Engine
        </p>
      </div>
    </footer>
  );
}
