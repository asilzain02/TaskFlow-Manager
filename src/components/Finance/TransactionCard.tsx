import React from 'react';
import { TrendingUp, TrendingDown, Edit, Trash2, Tag, Calendar } from 'lucide-react';
import { Transaction } from '../../types';

interface TransactionCardProps {
  transaction: Transaction;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

const TransactionCard: React.FC<TransactionCardProps> = ({ 
  transaction, 
  onEdit, 
  onDelete 
}) => {
  const isIncome = transaction.type === 'income';
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border-l-4 transition-all duration-200 hover:shadow-md ${
      isIncome ? 'border-l-green-500' : 'border-l-red-500'
    }`}>
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <div className={`p-2 rounded-lg ${
              isIncome ? 'bg-green-50' : 'bg-red-50'
            }`}>
              {isIncome ? (
                <TrendingUp className="h-5 w-5 text-green-600" />
              ) : (
                <TrendingDown className="h-5 w-5 text-red-600" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <span className={`text-lg font-semibold ${
                  isIncome ? 'text-green-600' : 'text-red-600'
                }`}>
                  {isIncome ? '+' : '-'}{formatAmount(transaction.amount)}
                </span>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {transaction.type}
                </span>
              </div>
              
              {transaction.description && (
                <p className="text-sm text-gray-600 mt-1">
                  {transaction.description}
                </p>
              )}
              
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <Tag className="h-3 w-3" />
                  <span>{transaction.category}</span>
                </div>
                
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(transaction.date)}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 ml-4">
            <button
              onClick={() => onEdit(transaction)}
              className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(transaction.id)}
              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionCard;