import axios from 'axios';
import { Content, User, ViewingHistory, Recommendation, Genre } from '../types';

// Base API URL
const API_URL = 'http://localhost:3001';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if user is logged in
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: async (email: string, password: string): Promise<{ user: User; token: string }> => {
    try {
      const response = await api.post('/auth/login', { email, password });
      localStorage.setItem('authToken', response.data.token);
      return response.data;
    } catch (error) {
      throw new Error('Login failed. Please check your credentials.');
    }
  },

  register: async (name: string, email: string, password: string): Promise<{ user: User; token: string }> => {
    try {
      const response = await api.post('/auth/register', { name, email, password });
      localStorage.setItem('authToken', response.data.token);
      return response.data;
    } catch (error) {
      throw new Error('Registration failed. Email may already be in use.');
    }
  },

  logout: (): void => {
    localStorage.removeItem('authToken');
  },

  getCurrentUser: async (): Promise<User> => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      throw new Error('Failed to get current user');
    }
  },
};

// Content API
export const contentAPI = {
  getAllContent: async (): Promise<Content[]> => {
    const response = await api.get('/content');
    return response.data;
  },

  getContentById: async (id: string): Promise<Content> => {
    const response = await api.get(`/content/${id}`);
    return response.data;
  },

  getContentByGenre: async (genreId: string): Promise<Content[]> => {
    const response = await api.get(`/content?genre=${genreId}`);
    return response.data;
  },

  searchContent: async (query: string): Promise<Content[]> => {
    const response = await api.get(`/content?q=${query}`);
    return response.data;
  },
};

// Genres API
export const genreAPI = {
  getAllGenres: async (): Promise<Genre[]> => {
    const response = await api.get('/genres');
    return response.data;
  },
};

// Viewing History API
export const historyAPI = {
  getUserHistory: async (userId: string): Promise<ViewingHistory[]> => {
    const response = await api.get(`/history?userId=${userId}`);
    return response.data;
  },

  addToHistory: async (history: Omit<ViewingHistory, 'id'>): Promise<ViewingHistory> => {
    const response = await api.post('/history', history);
    return response.data;
  },

  updateHistory: async (id: string, data: Partial<ViewingHistory>): Promise<ViewingHistory> => {
    const response = await api.patch(`/history/${id}`, data);
    return response.data;
  },
};

// Recommendations API
export const recommendationAPI = {
  getUserRecommendations: async (userId: string): Promise<Recommendation[]> => {
    const response = await api.get(`/recommendations?userId=${userId}`);
    return response.data;
  },

  getContentRecommendations: async (contentId: string): Promise<Content[]> => {
    const response = await api.get(`/recommendations/similar/${contentId}`);
    return response.data;
  },

  refreshRecommendations: async (userId: string): Promise<Recommendation[]> => {
    const response = await api.post(`/recommendations/refresh/${userId}`);
    return response.data;
  },
};

export default api;