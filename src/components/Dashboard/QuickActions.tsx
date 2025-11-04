import React from 'react';
import { Plus, CheckSquare, DollarSign, StickyNote, BarChart2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface QuickAction {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  onClick: () => void;
}

interface QuickActionsProps {
  onAddTask: () => void;
  onAddTransaction: () => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onAddTask, onAddTransaction }) => {
  const navigate = useNavigate();

  const actions: QuickAction[] = [
    {
      title: 'Add Task',
      description: 'Create a new task',
      icon: CheckSquare,
      color: 'bg-blue-500 hover:bg-blue-600',
      onClick:() => {
        onAddTask
        navigate('/tasks')
      },
    },
    {
      title: 'Add Expense',
      description: 'Record an expense',
      icon: DollarSign,
      color: 'bg-green-500 hover:bg-green-600',
      onClick:() => {
        navigate('/finance')
        onAddTransaction
      },
    },
    {
      title: 'View Analytics',
      description: 'Analys the Expneses',
      icon: BarChart2,
      color: 'bg-purple-500 hover:bg-purple-600',
      onClick:() => {
        navigate('/analytics')
        onAddTransaction
      },
    },
    {
      title: 'Add Note',
      description: 'Quick note',
      icon: StickyNote,
      color: 'bg-orange-500 hover:bg-orange-600',
      onClick: () => navigate('/notes'),
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-2 sm:gap-4">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className={`${action.color} text-white p-3 sm:p-4 rounded-lg transition-all duration-200 hover:scale-105 shadow-sm hover:shadow-md`}
          >
            <action.icon className="h-5 w-5 sm:h-6 sm:w-6 mx-auto mb-2" />
            <p className="font-medium text-xs sm:text-sm">{action.title}</p>
            <p className="text-xs opacity-90 hidden sm:block">{action.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;