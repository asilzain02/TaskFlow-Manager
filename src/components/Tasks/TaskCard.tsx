import React from 'react';
import { Calendar, Tag, AlertCircle, Check, Edit, Trash2 } from 'lucide-react';
import { Task } from '../../types';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onToggleComplete, onEdit, onDelete }) => {
  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && !task.completed;

  const priorityColors = {
    low: 'text-green-600 bg-green-50 border-green-200',
    medium: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    high: 'text-red-600 bg-red-50 border-red-200',
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border-2 transition-all duration-200 hover:shadow-md ${
      task.completed ? 'border-green-200 bg-green-50/30' : 'border-gray-200'
    } ${isOverdue ? 'border-red-300' : ''}`}>
      <div className="p-3 sm:p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <button
              onClick={() => onToggleComplete(task.id)}
              className={`mt-1 p-1 rounded-full transition-colors ${
                task.completed
                  ? 'bg-green-500 text-white'
                  : 'border-2 border-gray-300 hover:border-green-500'
              }`}
            >
              {task.completed && <Check className="h-3 w-3" />}
            </button>
            
            <div className="flex-1 min-w-0">
              <h3 className={`text-sm sm:text-base font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                {task.title}
              </h3>
              {task.description && (
                <p className={`text-xs sm:text-sm mt-1 ${task.completed ? 'text-gray-400' : 'text-gray-600'} line-clamp-2`}>
                  {task.description}
                </p>
              )}
              
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2 sm:mt-3">
                {task.due_date && (
                  <div className={`flex items-center space-x-1 text-xs ${
                    isOverdue ? 'text-red-600' : 'text-gray-500'
                  }`}>
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(task.due_date)}</span>
                    {isOverdue && <AlertCircle className="h-3 w-3" />}
                  </div>
                )}
                
                {task.category && (
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <Tag className="h-3 w-3" />
                    <span className="truncate max-w-20 sm:max-w-none">{task.category}</span>
                  </div>
                )}
                
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                  priorityColors[task.priority]
                }`}>
                  {task.priority}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-1 sm:space-x-2 ml-2 sm:ml-4 flex-shrink-0">
            <button
              onClick={() => onEdit(task)}
              className="p-1 sm:p-2 text-gray-400 hover:text-blue-600 transition-colors"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="p-1 sm:p-2 text-gray-400 hover:text-red-600 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;