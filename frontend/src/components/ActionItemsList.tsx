import React from 'react';
import type { ActionItem, Priority } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { CheckCircle2, Circle, Trash2, ListTodo, AlertTriangle, Minus, ArrowDown } from 'lucide-react';

interface ActionItemsListProps {
  actionItems: ActionItem[];
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

// Helper function to get priority styling
const getPriorityStyling = (priority: Priority) => {
  switch (priority) {
    case 'high':
      return {
        badge: 'bg-red-100 text-red-800 border-red-200',
        icon: <AlertTriangle className="h-3 w-3" />,
        label: 'High Priority'
      };
    case 'medium':
      return {
        badge: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: <Minus className="h-3 w-3" />,
        label: 'Medium Priority'
      };
    case 'low':
      return {
        badge: 'bg-green-100 text-green-800 border-green-200',
        icon: <ArrowDown className="h-3 w-3" />,
        label: 'Low Priority'
      };
    default:
      return {
        badge: 'bg-gray-100 text-gray-800 border-gray-200',
        icon: <Minus className="h-3 w-3" />,
        label: 'Medium Priority'
      };
  }
};

export const ActionItemsList: React.FC<ActionItemsListProps> = ({ 
  actionItems, 
  onToggleComplete, 
  onDelete 
}) => {
  const completedCount = actionItems.filter(item => item.status === 'completed').length;
  const pendingCount = actionItems.filter(item => item.status === 'pending').length;

  if (actionItems.length === 0) {
    return (
      <Card className="w-full shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="p-3 bg-gray-100 rounded-full mb-4">
            <ListTodo className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">No Action Items Yet</h3>
          <p className="text-gray-500 text-center text-base max-w-sm">
            Submit a meeting transcript to generate actionable tasks.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg py-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <div className="p-1.5 bg-green-100 rounded-lg">
            <ListTodo className="h-5 w-5 text-green-600" />
          </div>
          Action Items
        </CardTitle>
        <CardDescription className="text-base text-gray-600">
          {actionItems.length} total tasks • {completedCount} completed • {pendingCount} pending
        </CardDescription>
      </CardHeader>
      <CardContent className="py-4">
        <div className="space-y-2">
          {actionItems.map((item) => (
            <div
              key={item.id}
              className={`flex items-start gap-3 p-3 rounded-lg border transition-all hover:shadow-sm ${
                item.status === 'completed' 
                  ? 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800' 
                  : 'bg-background border-border'
              }`}
            >
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 p-0 mt-0.5"
                onClick={() => onToggleComplete(item.id)}
              >
                {item.status === 'completed' ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                ) : (
                  <Circle className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
              
              <div className="flex-1 min-w-0">
                <p className={`text-sm leading-relaxed ${
                  item.status === 'completed' 
                    ? 'line-through text-muted-foreground' 
                    : 'text-foreground'
                }`}>
                  {item.text}
                </p>
                <div className="flex items-center gap-2 mt-1.5">
                  <Badge 
                    variant={item.status === 'completed' ? 'success' : 'secondary'}
                    className="text-xs"
                  >
                    {item.status}
                  </Badge>
                  <Badge 
                    className={`text-xs ${getPriorityStyling(item.priority).badge}`}
                  >
                    <div className="flex items-center gap-1">
                      {getPriorityStyling(item.priority).icon}
                      {item.priority}
                    </div>
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                onClick={() => onDelete(item.id)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
