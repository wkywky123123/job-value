import { HistoryItem, JobFormData, AnalysisResult } from '../types';

const STORAGE_KEY = 'job_calculator_history';

export const getHistory = (): HistoryItem[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("Failed to parse history", e);
    return [];
  }
};

export const saveHistoryItem = (formData: JobFormData, result: AnalysisResult): HistoryItem => {
  const history = getHistory();
  const newItem: HistoryItem = {
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    formData,
    result
  };
  // Prepend new item
  const updated = [newItem, ...history];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return newItem;
};

export const deleteHistoryItem = (id: string): HistoryItem[] => {
  const history = getHistory();
  const updated = history.filter(item => item.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

export const clearHistory = () => {
  localStorage.removeItem(STORAGE_KEY);
};
