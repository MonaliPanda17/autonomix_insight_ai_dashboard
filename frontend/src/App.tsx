import { useState, useEffect } from 'react';
import { TranscriptForm } from './components/TranscriptForm';
import { ActionItemsList } from './components/ActionItemsList';
import { ProgressChart } from './components/ProgressChart';
import { PriorityChart } from './components/PriorityChart';
import { FilterAndSort } from './components/FilterAndSort';
import type { ActionItem, FilterOptions, SortOptions } from './types';
import { analyzeTranscript, getAllActionItems, updateActionItem, deleteActionItem } from './services/api';
import { Brain, AlertCircle } from 'lucide-react';

function App() {
  const [actionItems, setActionItems] = useState<ActionItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({});
  const [sortOptions, setSortOptions] = useState<SortOptions>({ field: 'createdAt', direction: 'desc' });

  // Load action items from database on component mount
  useEffect(() => {
    loadActionItems();
  }, []);

  const loadActionItems = async () => {
    try {
      const response = await getAllActionItems();
      if (response.success) {
        setActionItems(response.action_items);
      }
    } catch (err) {
      console.error('Failed to load action items:', err);
      // Don't show error to user for initial load, just log it
    }
  };

  const handleTranscriptSubmit = async (transcript: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await analyzeTranscript(transcript);
      if (response.success) {
        // Reload all action items from database to get the latest data
        await loadActionItems();
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

  const handleToggleComplete = async (id: string) => {
    try {
      const item = actionItems.find(item => item.id === id);
      if (!item) return;

      const newStatus = item.status === 'completed' ? 'pending' : 'completed';
      
      // Update in database
      await updateActionItem(id, { status: newStatus });
      
      // Reload from database to get updated data
      await loadActionItems();
    } catch (err) {
      console.error('Failed to update action item:', err);
      setError('Failed to update action item. Please try again.');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      // Delete from database
      await deleteActionItem(id);
      
      // Reload from database to get updated data
      await loadActionItems();
    } catch (err) {
      console.error('Failed to delete action item:', err);
      setError('Failed to delete action item. Please try again.');
    }
  };

  const clearError = () => {
    setError(null);
  };

  // Filter and sort logic
  const getFilteredAndSortedItems = (items: ActionItem[]): ActionItem[] => {
    let filtered = items;

    // Apply filters
    if (filterOptions.status) {
      filtered = filtered.filter(item => item.status === filterOptions.status);
    }
    
    if (filterOptions.priority) {
      filtered = filtered.filter(item => item.priority === filterOptions.priority);
    }
    
    if (filterOptions.search) {
      const searchTerm = filterOptions.search.toLowerCase();
      filtered = filtered.filter(item => 
        item.text.toLowerCase().includes(searchTerm)
      );
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      let comparison = 0;
      
      switch (sortOptions.field) {
        case 'createdAt':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        default:
          comparison = 0;
      }
      
      return sortOptions.direction === 'asc' ? comparison : -comparison;
    });

    return sorted;
  };

  const filteredAndSortedItems = getFilteredAndSortedItems(actionItems);

  const handleFilterChange = (filters: FilterOptions) => {
    setFilterOptions(filters);
  };

  const handleSortChange = (sort: SortOptions) => {
    setSortOptions(sort);
  };

  const handleClearFilters = () => {
    setFilterOptions({});
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

        {/* Charts Row - Priority Chart */}
        <div className="mb-6">
          <PriorityChart actionItems={actionItems} />
        </div>

        {/* Filter and Sort */}
        <div className="mb-4">
          <FilterAndSort
            filterOptions={filterOptions}
            sortOptions={sortOptions}
            onFilterChange={handleFilterChange}
            onSortChange={handleSortChange}
            onClearFilters={handleClearFilters}
            totalItems={actionItems.length}
            filteredCount={filteredAndSortedItems.length}
          />
        </div>

        {/* Action Items - Full Width Below */}
        <div className="mt-4">
          <ActionItemsList
            actionItems={filteredAndSortedItems}
            onToggleComplete={handleToggleComplete}
            onDelete={handleDelete}
          />
        </div>

        {/* Footer */}
        <footer className="text-center mt-8 text-sm text-gray-500">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/50 rounded-full backdrop-blur-sm">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
            <p>Built with React, FastAPI, and OpenAI • Level 2 Complete</p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;