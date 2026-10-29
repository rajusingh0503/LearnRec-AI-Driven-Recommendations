import contentService from './contentService';
import userService from './userService';
import interactionService from './interactionService';

const DIFFICULTY_MAP = {
  BEGINNER: 1,
  INTERMEDIATE: 2,
  ADVANCED: 3,
};

export const recommendationService = {
  /**
   * Generates scored, personalized recommendations based on the user's
   * preferences, interaction history, and catalog contents.
   */
  async getPersonalizedRecommendations(options = {}) {
    const { strategy = 'HYBRID', limit = 12, categoryFilter = null } = options;

    // 1. Concurrently fetch user profile preferences, interaction history, and catalog
    const [prefRes, histRes, contentRes] = await Promise.all([
      userService.getPreferences().catch(() => ({ data: null })),
      interactionService.getHistory().catch(() => ({ data: [] })),
      contentService.getAllContent({ size: 100 }),
    ]);

    const preferences = prefRes?.data || {
      preferredCategories: [],
      preferredContentTypes: [],
      preferredDifficulty: 'BEGINNER',
    };

    const history = histRes?.data || [];
    const allContents = contentRes?.data?.content || [];

    // Map of interaction types by contentId
    const completedSet = new Set();
    const likedSet = new Set();
    const ratedMap = new Map();
    const viewedSet = new Set();

    history.forEach((h) => {
      const cid = h.contentId;
      if (h.interactionType === 'COMPLETE') completedSet.add(cid);
      if (h.interactionType === 'LIKE') likedSet.add(cid);
      if (h.interactionType === 'VIEW') viewedSet.add(cid);
      if (h.interactionType === 'RATE' && h.ratingValue) ratedMap.set(cid, h.ratingValue);
    });

    // Extract preferred attributes
    const prefCats = new Set((preferences.preferredCategories || []).map((c) => c.toLowerCase()));
    const prefTypes = new Set((preferences.preferredContentTypes || []).map((t) => t.toUpperCase()));
    const targetDiffNum = DIFFICULTY_MAP[preferences.preferredDifficulty] || 1;

    // Categories where the user has high engagement (liked or rated >= 4)
    const affinityCategories = new Set();
    history.forEach((h) => {
      if ((h.interactionType === 'LIKE' || (h.interactionType === 'RATE' && h.ratingValue >= 4)) && h.categoryName) {
        affinityCategories.add(h.categoryName.toLowerCase());
      }
    });

    // 2. Score and rank candidates
    const scoredList = allContents
      .filter((item) => {
        // Filter out completed items so recommendations stay fresh
        if (completedSet.has(item.id)) return false;
        // Optional category filter tab
        if (categoryFilter && String(item.categoryId) !== String(categoryFilter)) return false;
        return true;
      })
      .map((item) => {
        let score = 0.0;
        const rationales = [];

        // Category match (0.35 weight)
        const itemCat = (item.categoryName || '').toLowerCase();
        if (prefCats.has(itemCat)) {
          score += 0.35;
          rationales.push(`Matches your interest in ${item.categoryName}`);
        } else if (affinityCategories.has(itemCat)) {
          score += 0.25;
          rationales.push(`Recommended based on your positive reviews in ${item.categoryName}`);
        }

        // Difficulty alignment (0.25 weight)
        const itemDiffNum = DIFFICULTY_MAP[item.difficultyLevel] || 1;
        const diffDistance = Math.abs(itemDiffNum - targetDiffNum);

        if (strategy === 'CHALLENGE') {
          // Boost items at or one level above target
          if (itemDiffNum >= targetDiffNum) {
            score += 0.30;
            rationales.push(`Challenge resource for advancing your skill level`);
          } else {
            score += 0.10;
          }
        } else {
          // Standard hybrid matching
          if (diffDistance === 0) {
            score += 0.25;
            rationales.push(`Tailored to your target ${item.difficultyLevel} level`);
          } else if (diffDistance === 1) {
            score += 0.15;
          } else {
            score += 0.05;
          }
        }

        // Content format alignment (0.15 weight)
        if (prefTypes.size > 0 && prefTypes.has(item.contentType)) {
          score += 0.15;
          rationales.push(`In your preferred format (${item.contentType?.replace('_', ' ')})`);
        } else if (prefTypes.size === 0) {
          score += 0.10;
        }

        // Quality and community rating (0.15 weight)
        const ratingVal = typeof item.ratingAvg === 'number' ? item.ratingAvg : 4.5;
        const qualityScore = (ratingVal / 5.0) * 0.15;
        score += qualityScore;
        if (ratingVal >= 4.8) {
          rationales.push(`Highly rated by the learner community (${ratingVal.toFixed(1)} ★)`);
        }

        // Freshness boost for items not yet viewed (0.10 weight)
        if (!viewedSet.has(item.id)) {
          score += 0.10;
        }

        // Normalize score between 0.50 and 0.99 for clean presentation
        const normalizedScore = Math.min(0.99, Math.max(0.55, score));

        return {
          ...item,
          matchScore: normalizedScore,
          primaryRationale: rationales[0] || 'Recommended based on overall curriculum alignment',
          allRationales: rationales,
        };
      });

    // 3. Sort by matchScore descending
    scoredList.sort((a, b) => b.matchScore - a.matchScore);

    return {
      recommendations: scoredList.slice(0, limit),
      totalMatches: scoredList.length,
      userPreferences: preferences,
      strategyUsed: strategy,
    };
  },
};

export default recommendationService;
