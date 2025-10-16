import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { ActionItem } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { BarChart3 } from 'lucide-react';

interface PriorityChartProps {
  actionItems: ActionItem[];
}

export const PriorityChart: React.FC<PriorityChartProps> = ({ actionItems }) => {
  // Calculate priority counts
  const priorityData = [
    {
      priority: 'High',
      count: actionItems.filter(item => item.priority === 'high').length,
      color: '#ef4444' // red-500
    },
    {
      priority: 'Medium', 
      count: actionItems.filter(item => item.priority === 'medium').length,
      color: '#eab308' // yellow-500
    },
    {
      priority: 'Low',
      count: actionItems.filter(item => item.priority === 'low').length,
      color: '#22c55e' // green-500
    }
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label} Priority</p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">{payload[0].value}</span> tasks
          </p>
        </div>
      );
    }
    return null;
  };

  if (actionItems.length === 0) {
    return (
      <Card className="w-full shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="p-3 bg-gray-100 rounded-full mb-4">
            <BarChart3 className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">No Data Yet</h3>
          <p className="text-gray-500 text-center text-base max-w-sm">
            Generate action items to see priority distribution.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg py-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <div className="p-1.5 bg-blue-100 rounded-lg">
            <BarChart3 className="h-5 w-5 text-blue-600" />
          </div>
          Priority Distribution
        </CardTitle>
        <CardDescription className="text-base text-gray-600">
          Task count by priority level
        </CardDescription>
      </CardHeader>
      <CardContent className="py-6">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={priorityData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="priority" 
                stroke="#6b7280"
                fontSize={12}
                fontWeight={500}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
                fontWeight={500}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="count" 
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
                className="hover:opacity-80 transition-opacity"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Priority Legend */}
        <div className="flex justify-center gap-6 mt-4 pt-4 border-t border-gray-100">
          {priorityData.map((item) => (
            <div key={item.priority} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-gray-600 font-medium">
                {item.priority}: {item.count}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
