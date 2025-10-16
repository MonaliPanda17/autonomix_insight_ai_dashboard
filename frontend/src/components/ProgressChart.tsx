import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { TrendingUp } from 'lucide-react';

interface ProgressChartProps {
  actionItems: Array<{ status: 'pending' | 'completed' }>;
}

export const ProgressChart: React.FC<ProgressChartProps> = ({ actionItems }) => {
  const completedCount = actionItems.filter(item => item.status === 'completed').length;
  const pendingCount = actionItems.filter(item => item.status === 'pending').length;
  const totalCount = actionItems.length;

  const data = [
    { name: 'Completed', value: completedCount, color: '#10b981' },
    { name: 'Pending', value: pendingCount, color: '#f59e0b' },
  ];

  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  if (totalCount === 0) {
    return (
      <Card className="w-full shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-lg py-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="p-1.5 bg-purple-100 rounded-lg">
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </div>
            Progress Overview
          </CardTitle>
          <CardDescription className="text-sm text-gray-600">
            Track your task completion progress
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-300 mb-2">0%</div>
            <p className="text-sm text-gray-500">No tasks yet</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-lg py-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="p-1.5 bg-purple-100 rounded-lg">
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </div>
          Progress Overview
        </CardTitle>
        <CardDescription className="text-sm text-gray-600">
          {completionPercentage}% of tasks completed
        </CardDescription>
      </CardHeader>
      <CardContent className="py-4">
        <div className="space-y-3">
          {/* Completion percentage */}
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {completionPercentage}%
            </div>
            <p className="text-xs text-muted-foreground">
              {completedCount} of {totalCount} tasks completed
            </p>
          </div>

          {/* Pie Chart */}
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`${value} tasks`, '']}
                  labelFormatter={(label) => `${label} Tasks`}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={30}
                  formatter={(value) => (
                    <span style={{ color: '#374151', fontSize: '11px' }}>
                      {value}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="space-y-1">
              <div className="text-lg font-bold text-green-600">{completedCount}</div>
              <div className="text-xs text-muted-foreground">Completed</div>
            </div>
            <div className="space-y-1">
              <div className="text-lg font-bold text-yellow-600">{pendingCount}</div>
              <div className="text-xs text-muted-foreground">Pending</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
