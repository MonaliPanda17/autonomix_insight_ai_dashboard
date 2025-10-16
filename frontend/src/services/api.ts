import axios from 'axios';
import type { TranscriptRequest, TranscriptAnalysisResponse } from '../types';

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`Response received: ${response.status}`);
    return response;
  },
  (error) => {
    console.error('Response error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const analyzeTranscript = async (transcript: string): Promise<TranscriptAnalysisResponse> => {
  try {
    const request: TranscriptRequest = { transcript };
    const response = await api.post<TranscriptAnalysisResponse>('/api/transcripts/analyze', request);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.detail || error.message);
    }
    throw new Error('An unexpected error occurred');
  }
};

export const healthCheck = async () => {
  try {
    const response = await api.get('/api/health');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.detail || error.message);
    }
    throw new Error('Health check failed');
  }
};

export const getAllActionItems = async (): Promise<TranscriptAnalysisResponse> => {
  try {
    const response = await api.get<TranscriptAnalysisResponse>('/api/action-items');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.detail || error.message);
    }
    throw new Error('Failed to fetch action items');
  }
};

export const updateActionItem = async (itemId: string, updates: { status?: string; priority?: string }) => {
  try {
    const response = await api.put(`/api/action-items/${itemId}`, updates);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.detail || error.message);
    }
    throw new Error('Failed to update action item');
  }
};

export const deleteActionItem = async (itemId: string) => {
  try {
    const response = await api.delete(`/api/action-items/${itemId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.detail || error.message);
    }
    throw new Error('Failed to delete action item');
  }
};

export default api;
