import { atom } from 'jotai';
import { Content, Genre, Recommendation } from '../types';
import { contentAPI, genreAPI, recommendationAPI } from '../utils/api';

// Base atoms
export const contentListAtom = atom<Content[]>([]);
export const genresAtom = atom<Genre[]>([]);
export const recommendationsAtom = atom<Recommendation[]>([]);
export const selectedContentAtom = atom<Content | null>(null);
export const contentLoadingAtom = atom<boolean>(false);
export const contentErrorAtom = atom<string | null>(null);
export const searchQueryAtom = atom<string>('');
export const selectedGenreAtom = atom<string | null>(null);

// Action atoms
export const fetchContentAtom = atom(
  null,
  async (get, set) => {
    try {
      set(contentLoadingAtom, true);
      set(contentErrorAtom, null);
      
      const content = await contentAPI.getAllContent();
      set(contentListAtom, content);
    } catch (error) {
      set(contentErrorAtom, error instanceof Error ? error.message : 'Failed to fetch content');
    } finally {
      set(contentLoadingAtom, false);
    }
  }
);

export const fetchGenresAtom = atom(
  null,
  async (get, set) => {
    try {
      const genres = await genreAPI.getAllGenres();
      set(genresAtom, genres);
    } catch (error) {
      set(contentErrorAtom, error instanceof Error ? error.message : 'Failed to fetch genres');
    }
  }
);

export const fetchRecommendationsAtom = atom(
  null,
  async (get, set, userId: string) => {
    try {
      set(contentLoadingAtom, true);
      
      const recommendations = await recommendationAPI.getUserRecommendations(userId);
      set(recommendationsAtom, recommendations);
    } catch (error) {
      set(contentErrorAtom, error instanceof Error ? error.message : 'Failed to fetch recommendations');
    } finally {
      set(contentLoadingAtom, false);
    }
  }
);

export const fetchContentByIdAtom = atom(
  null,
  async (get, set, contentId: string) => {
    try {
      set(contentLoadingAtom, true);
      
      const content = await contentAPI.getContentById(contentId);
      set(selectedContentAtom, content);
    } catch (error) {
      set(contentErrorAtom, error instanceof Error ? error.message : 'Failed to fetch content details');
    } finally {
      set(contentLoadingAtom, false);
    }
  }
);

export const searchContentAtom = atom(
  null,
  async (get, set, query: string) => {
    try {
      set(contentLoadingAtom, true);
      set(searchQueryAtom, query);
      
      if (!query.trim()) {
        await get(fetchContentAtom)(null);
        return;
      }
      
      const results = await contentAPI.searchContent(query);
      set(contentListAtom, results);
    } catch (error) {
      set(contentErrorAtom, error instanceof Error ? error.message : 'Search failed');
    } finally {
      set(contentLoadingAtom, false);
    }
  }
);

export const filterByGenreAtom = atom(
  null,
  async (get, set, genreId: string | null) => {
    try {
      set(contentLoadingAtom, true);
      set(selectedGenreAtom, genreId);
      
      if (!genreId) {
        await get(fetchContentAtom)(null);
        return;
      }
      
      const results = await contentAPI.getContentByGenre(genreId);
      set(contentListAtom, results);
    } catch (error) {
      set(contentErrorAtom, error instanceof Error ? error.message : 'Failed to filter by genre');
    } finally {
      set(contentLoadingAtom, false);
    }
  }
);

// Derived atoms for filtered/processed content
export const recommendedContentAtom = atom(
  (get) => {
    const recommendations = get(recommendationsAtom);
    const allContent = get(contentListAtom);
    
    return recommendations
      .map(rec => ({
        ...allContent.find(content => content.id === rec.contentId),
        score: rec.score,
        reason: rec.reason
      }))
      .filter(content => content !== undefined);
  }
);

export const trendingContentAtom = atom(
  (get) => {
    const allContent = get(contentListAtom);
    // Simulate trending by taking recent content with high ratings
    return [...allContent]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 10);
  }
);