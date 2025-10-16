import { useState } from 'react';
import { TranscriptForm } from './components/TranscriptForm';
import { ActionItemsList } from './components/ActionItemsList';
import { ProgressChart } from './components/ProgressChart';
import type { ActionItem } from './types';
import { analyzeTranscript } from './services/api';
import { Brain, AlertCircle } from 'lucide-react';

function App() {
  const [actionItems, setActionItems] = useState<ActionItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTranscriptSubmit = async (transcript: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await analyzeTranscript(transcript);
      if (response.success) {
        // Add new action items to existing ones
        setActionItems(prev => [...prev, ...response.action_items]);
      } else {
        throw new Error('Failed to generate action items');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      console.error('Error analyzing transcript:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleComplete = (id: string) => {
    setActionItems(prev => 
      prev.map(item => 
        item.id === id 
          ? { ...item, status: item.status === 'completed' ? 'pending' : 'completed' }
          : item
      )
    );
  };

  const handleDelete = (id: string) => {
    setActionItems(prev => prev.filter(item => item.id !== id));
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-4 max-w-9xl flex flex-col">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-full">
              <Brain className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-blue-600">
              InsightBoard AI
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Transform your meeting transcripts into actionable tasks with AI-powered analysis
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="max-w-6xl mx-auto mb-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-3">
              <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
              <button
                onClick={clearError}
                className="text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Left Column - Transcript Form */}
          <div className="flex flex-col">
            <TranscriptForm onSubmit={handleTranscriptSubmit} isLoading={isLoading} />
          </div>

          {/* Right Column - Progress Chart */}
          <div className="flex flex-col">
            <ProgressChart actionItems={actionItems} />
          </div>
        </div>

        {/* Action Items - Full Width Below */}
        <div className="mt-4">
          <ActionItemsList
            actionItems={actionItems}
            onToggleComplete={handleToggleComplete}
            onDelete={handleDelete}
          />
        </div>

        {/* Footer */}
        <footer className="text-center mt-8 text-sm text-gray-500">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/50 rounded-full backdrop-blur-sm">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
            <p>Built with React, FastAPI, and OpenAI • Level 1 Complete</p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;