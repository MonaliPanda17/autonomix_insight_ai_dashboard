import React from 'react';
import type { FilterOptions, SortOptions, Priority } from '../types';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Filter, 
  SortAsc, 
  SortDesc, 
  Search, 
  X,
  Calendar,
  AlertTriangle,
  Minus,
  ArrowDown
} from 'lucide-react';

interface FilterAndSortProps {
  filterOptions: FilterOptions;
  sortOptions: SortOptions;
  onFilterChange: (filters: FilterOptions) => void;
  onSortChange: (sort: SortOptions) => void;
  onClearFilters: () => void;
  totalItems: number;
  filteredCount: number;
}

export const FilterAndSort: React.FC<FilterAndSortProps> = ({
  filterOptions,
  sortOptions,
  onFilterChange,
  onSortChange,
  onClearFilters,
  totalItems,
  filteredCount
}) => {
  const priorityIcons = {
    high: <AlertTriangle className="h-3 w-3" />,
    medium: <Minus className="h-3 w-3" />,
    low: <ArrowDown className="h-3 w-3" />
  };

  const priorityColors = {
    high: 'bg-red-100 text-red-800 border-red-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    low: 'bg-green-100 text-green-800 border-green-200'
  };

  const hasActiveFilters = filterOptions.status || filterOptions.priority || filterOptions.search;

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200 p-4 mb-4">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
        
        {/* Search Input */}
        <div className="flex-1 min-w-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search action items..."
              value={filterOptions.search || ''}
              onChange={(e) => onFilterChange({ ...filterOptions, search: e.target.value || undefined })}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            {filterOptions.search && (
              <button
                onClick={() => onFilterChange({ ...filterOptions, search: undefined })}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          {/* Status Filter */}
          <div className="flex gap-1">
            <Button
              variant={filterOptions.status === 'pending' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onFilterChange({ 
                ...filterOptions, 
                status: filterOptions.status === 'pending' ? undefined : 'pending' 
              })}
              className="text-xs"
            >
              Pending
            </Button>
            <Button
              variant={filterOptions.status === 'completed' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onFilterChange({ 
                ...filterOptions, 
                status: filterOptions.status === 'completed' ? undefined : 'completed' 
              })}
              className="text-xs"
            >
              Completed
            </Button>
          </div>

          {/* Priority Filter */}
          <div className="flex gap-1">
            {(['high', 'medium', 'low'] as Priority[]).map((priority) => (
              <Button
                key={priority}
                variant={filterOptions.priority === priority ? 'default' : 'outline'}
                size="sm"
                onClick={() => onFilterChange({ 
                  ...filterOptions, 
                  priority: filterOptions.priority === priority ? undefined : priority 
                })}
                className={`text-xs ${filterOptions.priority === priority ? priorityColors[priority] : ''}`}
              >
                <div className="flex items-center gap-1">
                  {priorityIcons[priority]}
                  {priority}
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Sort Options */}
        <div className="flex gap-2">
          <Button
            variant={sortOptions.field === 'createdAt' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onSortChange({ 
              field: 'createdAt', 
              direction: sortOptions.field === 'createdAt' && sortOptions.direction === 'asc' ? 'desc' : 'asc' 
            })}
            className="text-xs"
          >
            <Calendar className="h-3 w-3 mr-1" />
            Date
            {sortOptions.field === 'createdAt' && (
              sortOptions.direction === 'asc' ? <SortAsc className="h-3 w-3 ml-1" /> : <SortDesc className="h-3 w-3 ml-1" />
            )}
          </Button>

          <Button
            variant={sortOptions.field === 'priority' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onSortChange({ 
              field: 'priority', 
              direction: sortOptions.field === 'priority' && sortOptions.direction === 'asc' ? 'desc' : 'asc' 
            })}
            className="text-xs"
          >
            <AlertTriangle className="h-3 w-3 mr-1" />
            Priority
            {sortOptions.field === 'priority' && (
              sortOptions.direction === 'asc' ? <SortAsc className="h-3 w-3 ml-1" /> : <SortDesc className="h-3 w-3 ml-1" />
            )}
          </Button>

          <Button
            variant={sortOptions.field === 'status' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onSortChange({ 
              field: 'status', 
              direction: sortOptions.field === 'status' && sortOptions.direction === 'asc' ? 'desc' : 'asc' 
            })}
            className="text-xs"
          >
            <Filter className="h-3 w-3 mr-1" />
            Status
            {sortOptions.field === 'status' && (
              sortOptions.direction === 'asc' ? <SortAsc className="h-3 w-3 ml-1" /> : <SortDesc className="h-3 w-3 ml-1" />
            )}
          </Button>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            className="text-xs text-gray-600 hover:text-gray-800"
          >
            <X className="h-3 w-3 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Results Summary */}
      <div className="mt-3 pt-3 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span>
              Showing {filteredCount} of {totalItems} action items
              {hasActiveFilters && (
                <span className="ml-2 text-blue-600 font-medium">(filtered)</span>
              )}
            </span>
          </div>
          
          {/* Active Filter Badges */}
          {hasActiveFilters && (
            <div className="flex gap-1">
              {filterOptions.status && (
                <Badge variant="secondary" className="text-xs">
                  Status: {filterOptions.status}
                </Badge>
              )}
              {filterOptions.priority && (
                <Badge variant="secondary" className="text-xs">
                  Priority: {filterOptions.priority}
                </Badge>
              )}
              {filterOptions.search && (
                <Badge variant="secondary" className="text-xs">
                  Search: "{filterOptions.search}"
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
