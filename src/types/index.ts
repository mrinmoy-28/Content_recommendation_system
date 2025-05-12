export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  preferences: {
    genres: string[];
    likedActors: string[];
    likedDirectors: string[];
    watchedContent: string[];
  };
}

export interface Content {
  id: string;
  title: string;
  description: string;
  type: 'movie' | 'series';
  releaseYear: number;
  genres: string[];
  poster: string;
  backdrop: string;
  rating: number;
  duration: number; // minutes for movies, seasons for series
  cast: string[];
  directors: string[];
  similarContent: string[];
  trailerUrl?: string;
}

export interface Genre {
  id: string;
  name: string;
  description: string;
}

export interface ViewingHistory {
  id: string;
  userId: string;
  contentId: string;
  watchedAt: string; // ISO date string
  watchedPercentage: number;
  completed: boolean;
}

export interface Recommendation {
  id: string;
  userId: string;
  contentId: string;
  score: number; // 0-100 indicating confidence
  reason: string;
  createdAt: string; // ISO date string
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}