import React from 'react';
import { CheckSquare, DollarSign, TrendingUp, TrendingDown, StickyNote } from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'task' | 'income' | 'expense' | 'note';
  title: string;
  time: string;
  amount?: number;
}

interface RecentActivityProps {
  activities: ActivityItem[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'task':
        return <CheckSquare className="h-4 w-4 text-blue-500" />;
      case 'income':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'expense':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      case 'note':
        return <StickyNote className="h-4 w-4 text-orange-500" />;
      default:
        return <DollarSign className="h-4 w-4 text-gray-500" />;
    }
  };

  const getAmountColor = (type: string) => {
    return type === 'income' ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activities.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No recent activity</p>
        ) : (
          activities.map((activity) => (
            <div key={activity.id} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="flex-shrink-0">
                {getIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {activity.title}
                </p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
              {activity.amount && (
                <div className={`text-sm font-medium ${getAmountColor(activity.type)}`}>
                  {activity.type === 'income' ? '+' : '-'}₹{Math.abs(activity.amount).toFixed(2)}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentActivity;