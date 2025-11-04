import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { Transaction } from '../../types';
import { useNotifications } from '../../contexts/NotificationContext';

interface TransactionFormProps {
  transaction?: Transaction | null;
  onSave: (transactionData: Partial<Transaction>) => void;
  onCancel: () => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ 
  transaction, 
  onSave, 
  onCancel 
}) => {
  const { addNotification } = useNotifications();
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const expenseCategories = [
    'Food & Dining',
    'Transportation',
    'Shopping',
    'Entertainment',
    'Bills & Utilities',
    'Healthcare',
    'Education',
    'Travel',
    'Groceries',
    'Rent',
    'Insurance',
    'Fuel',
    'Mobile & Internet',
    'Other',
  ];

  const incomeCategories = [
    'Salary',
    'Freelance',
    'Business',
    'Investments',
    'Bonus',
    'Rental Income',
    'Interest',
    'Gifts',
    'Other',
  ];

  useEffect(() => {
    if (transaction) {
      setType(transaction.type);
      setAmount(transaction.amount.toString());
      setCategory(transaction.category);
      setDescription(transaction.description || '');
      setDate(transaction.date);
    }
  }, [transaction]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Add notification for transaction creation/update
    const amountValue = parseFloat(amount);
    if (!transaction) {
      addNotification({
        title: `${type === 'income' ? 'Income' : 'Expense'} Added`,
        message: `Successfully recorded ${type}: ₹${amountValue.toFixed(2)} for ${category}`,
        type: 'success',
        actionUrl: '/finance'
      });
    } else {
      addNotification({
        title: 'Transaction Updated',
        message: `Successfully updated ${type}: ₹${amountValue.toFixed(2)}`,
        type: 'success',
        actionUrl: '/finance'
      });
    }
    
    onSave({
      type,
      amount: parseFloat(amount),
      category,
      description: description || undefined,
      date,
    });
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            {transaction ? 'Edit Transaction' : 'Add New Transaction'}
          </h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type *
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="income"
                  checked={type === 'income'}
                  onChange={(e) => setType(e.target.value as 'income' | 'expense')}
                  className="mr-2 text-green-600"
                />
                <span className="text-sm text-gray-700">Income</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="expense"
                  checked={type === 'expense'}
                  onChange={(e) => setType(e.target.value as 'income' | 'expense')}
                  className="mr-2 text-red-600"
                />
                <span className="text-sm text-gray-700">Expense</span>
              </label>
            </div>
          </div>

          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
              Amount *
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">₹</span>
              </div>
              <input
                type="number"
                id="amount"
                step="0.01"
                min="0"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-7 pr-3 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category *
            </label>
            <select
              id="category"
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select a category</option>
              {(type === 'income' ? incomeCategories : expenseCategories).map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <input
              type="text"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Optional description"
            />
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
              Date *
            </label>
            <input
              type="date"
              id="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>{transaction ? 'Update' : 'Add'} Transaction</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;