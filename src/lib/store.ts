import { create } from 'zustand';
import { UserContext, RecommendationResponse } from '@/types';

interface RecommendationsStore {
  userContext: UserContext | null;
  recommendations: RecommendationResponse | null;
  isLoading: boolean;
  error: string | null;
  setUserContext: (context: UserContext) => void;
  setRecommendations: (recommendations: RecommendationResponse) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useRecommendationsStore = create<RecommendationsStore>((set) => ({
  userContext: null,
  recommendations: null,
  isLoading: false,
  error: null,
  setUserContext: (context) => set({ userContext: context }),
  setRecommendations: (recommendations) => set({ recommendations, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error, isLoading: false }),
  reset: () => set({ userContext: null, recommendations: null, isLoading: false, error: null }),
})); 