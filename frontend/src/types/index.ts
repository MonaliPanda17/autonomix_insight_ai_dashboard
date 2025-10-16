export type Priority = 'high' | 'medium' | 'low';

export interface ActionItem {
  id: string;
  text: string;
  status: 'pending' | 'completed';
  priority: Priority;
  createdAt: string;
  updatedAt?: string;
}

export interface TranscriptAnalysisResponse {
  success: boolean;
  action_items: ActionItem[];
  total_count: number;
}

export interface TranscriptRequest {
  transcript: string;
}

export type TaskStatus = 'pending' | 'completed';

export type SortOption = 'createdAt' | 'priority' | 'status';
export type SortDirection = 'asc' | 'desc';

export interface FilterOptions {
  status?: TaskStatus;
  priority?: Priority;
  search?: string;
}

export interface SortOptions {
  field: SortOption;
  direction: SortDirection;
}
