import { atom } from 'jotai';
import { ViewingHistory, Content } from '../types';
import { historyAPI } from '../utils/api';
import { userAtom } from './auth';
import { contentListAtom } from './content';

// Base atoms
export const viewingHistoryAtom = atom<ViewingHistory[]>([]);
export const historyLoadingAtom = atom<boolean>(false);
export const historyErrorAtom = atom<string | null>(null);

// Action atoms
export const fetchHistoryAtom = atom(
  null,
  async (get, set) => {
    const user = get(userAtom);
    if (!user) return;
    
    try {
      set(historyLoadingAtom, true);
      set(historyErrorAtom, null);
      
      const history = await historyAPI.getUserHistory(user.id);
      set(viewingHistoryAtom, history);
    } catch (error) {
      set(historyErrorAtom, error instanceof Error ? error.message : 'Failed to fetch viewing history');
    } finally {
      set(historyLoadingAtom, false);
    }
  }
);

export const addToHistoryAtom = atom(
  null,
  async (get, set, { contentId, watchedPercentage, completed }: { contentId: string; watchedPercentage: number; completed: boolean }) => {
    const user = get(userAtom);
    if (!user) return;
    
    try {
      set(historyLoadingAtom, true);
      
      const newHistoryItem = await historyAPI.addToHistory({
        userId: user.id,
        contentId,
        watchedAt: new Date().toISOString(),
        watchedPercentage,
        completed
      });
      
      set(viewingHistoryAtom, prev => [...prev, newHistoryItem]);
    } catch (error) {
      set(historyErrorAtom, error instanceof Error ? error.message : 'Failed to update viewing history');
    } finally {
      set(historyLoadingAtom, false);
    }
  }
);

export const updateHistoryAtom = atom(
  null,
  async (get, set, { id, watchedPercentage, completed }: { id: string; watchedPercentage: number; completed: boolean }) => {
    try {
      set(historyLoadingAtom, true);
      
      const updatedHistory = await historyAPI.updateHistory(id, {
        watchedPercentage,
        completed,
        watchedAt: new Date().toISOString()
      });
      
      set(viewingHistoryAtom, prev => 
        prev.map(item => item.id === id ? updatedHistory : item)
      );
    } catch (error) {
      set(historyErrorAtom, error instanceof Error ? error.message : 'Failed to update viewing history');
    } finally {
      set(historyLoadingAtom, false);
    }
  }
);

// Derived atom to get content details for history items
export const historyWithContentAtom = atom(
  (get) => {
    const history = get(viewingHistoryAtom);
    const allContent = get(contentListAtom);
    
    return history.map(item => ({
      ...item,
      content: allContent.find(content => content.id === item.contentId)
    }))
    .filter(item => item.content) // Only include items where we have the content data
    .sort((a, b) => new Date(b.watchedAt).getTime() - new Date(a.watchedAt).getTime()); // Sort by most recent
  }
);

// Atom to get continue watching content
export const continueWatchingAtom = atom(
  (get) => {
    const historyWithContent = get(historyWithContentAtom);
    
    return historyWithContent
      .filter(item => !item.completed && item.watchedPercentage > 0 && item.watchedPercentage < 95)
      .slice(0, 6); // Limit to 6 items
  }
);