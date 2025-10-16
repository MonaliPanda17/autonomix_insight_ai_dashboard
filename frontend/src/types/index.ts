export interface ActionItem {
  id: string;
  text: string;
  status: 'pending' | 'completed';
  createdAt: string;
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
