import React, { useState, useEffect } from 'react';
import { Plus, Filter, Search, TrendingUp, TrendingDown, DollarSign, PieChart } from 'lucide-react';
import Header from '../components/Layout/Header';
import TransactionCard from '../components/Finance/TransactionCard';
import TransactionForm from '../components/Finance/TransactionForm';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Transaction } from '../types';

const Finance: React.FC = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const [monthlyStats, setMonthlyStats] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    transactionCount: 0,
  });

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user]);

  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user?.id)
        .order('date', { ascending: false });

      if (error) throw error;
      
      setTransactions(data || []);
      
      // Calculate monthly stats
      const currentMonth = new Date();
      const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
      
      const monthlyTransactions = data?.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate >= firstDay && transactionDate <= lastDay;
      }) || [];

      const income = monthlyTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
      const expenses = monthlyTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

      setMonthlyStats({
        totalIncome: income,
        totalExpenses: expenses,
        balance: income - expenses,
        transactionCount: monthlyTransactions.length,
      });
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTransaction = async (transactionData: Partial<Transaction>) => {
    try {
      if (editingTransaction) {
        // Update existing transaction
        const { error } = await supabase
          .from('transactions')
          .update(transactionData)
          .eq('id', editingTransaction.id);

        if (error) throw error;
      } else {
        // Create new transaction
        const { error } = await supabase
          .from('transactions')
          .insert({
            ...transactionData,
            user_id: user?.id,
          });

        if (error) throw error;
      }

      fetchTransactions();
      setShowForm(false);
      setEditingTransaction(null);
    } catch (error) {
      console.error('Error saving transaction:', error);
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        const { error } = await supabase
          .from('transactions')
          .delete()
          .eq('id', id);

        if (error) throw error;
        fetchTransactions();
      } catch (error) {
        console.error('Error deleting transaction:', error);
      }
    }
  };

  const categories = Array.from(new Set(transactions.map(t => t.category))).filter(Boolean);

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || transaction.type === filterType;
    const matchesCategory = filterCategory === 'all' || transaction.category === filterCategory;

    return matchesSearch && matchesType && matchesCategory;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Finance" subtitle="Master your financial workflow" />
      
      <div className="p-4 sm:p-6">
        {/* Monthly Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Income</p>
                <p className="text-lg sm:text-2xl font-semibold text-green-600 mt-1 break-all">
                  {formatCurrency(monthlyStats.totalIncome)}
                </p>
              </div>
              <div className="p-2 sm:p-3 rounded-lg bg-green-500 flex-shrink-0">
                <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Expenses</p>
                <p className="text-lg sm:text-2xl font-semibold text-red-600 mt-1 break-all">
                  {formatCurrency(monthlyStats.totalExpenses)}
                </p>
              </div>
              <div className="p-2 sm:p-3 rounded-lg bg-red-500 flex-shrink-0">
                <TrendingDown className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Balance</p>
                <p className={`text-2xl font-semibold mt-1 ${
                  monthlyStats.balance >= 0 ? 'text-green-600' : 'text-red-600'
                } break-all`}>
                  {formatCurrency(monthlyStats.balance)}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${
                monthlyStats.balance >= 0 ? 'bg-green-500' : 'bg-red-500'
              } flex-shrink-0`}>
                <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Transactions</p>
                <p className="text-lg sm:text-2xl font-semibold text-blue-600 mt-1">
                  {monthlyStats.transactionCount}
                </p>
              </div>
              <div className="p-2 sm:p-3 rounded-lg bg-blue-500 flex-shrink-0">
                <PieChart className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 sm:mb-6">
          <div className="flex items-center space-x-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors w-full sm:w-auto justify-center"
          >
            <Plus className="h-4 w-4" />
            <span>Add Transaction</span>
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-4 sm:mb-6 bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-xs sm:text-sm font-medium text-gray-700">Filters:</span>
          </div>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="border border-gray-300 rounded px-2 sm:px-3 py-1 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expenses</option>
          </select>
          
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="border border-gray-300 rounded px-2 sm:px-3 py-1 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          
          <span className="text-xs text-gray-500 ml-auto hidden sm:inline">
            Showing {filteredTransactions.length} of {transactions.length} transactions
          </span>
        </div>

        {/* Transactions List */}
        <div className="space-y-4">
          {filteredTransactions.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <div className="text-gray-400 mb-4">
                <DollarSign className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || filterType !== 'all' || filterCategory !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Get started by recording your first transaction'}
              </p>
              {!searchTerm && filterType === 'all' && filterCategory === 'all' && (
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Add Your First Transaction
                </button>
              )}
            </div>
          ) : (
            filteredTransactions.map((transaction) => (
              <TransactionCard
                key={transaction.id}
                transaction={transaction}
                onEdit={(transaction) => {
                  setEditingTransaction(transaction);
                  setShowForm(true);
                }}
                onDelete={handleDeleteTransaction}
              />
            ))
          )}
        </div>
      </div>

      {/* Transaction Form Modal */}
      {showForm && (
        <TransactionForm
          transaction={editingTransaction}
          onSave={handleSaveTransaction}
          onCancel={() => {
            setShowForm(false);
            setEditingTransaction(null);
          }}
        />
      )}
    </div>
  );
};

export default Finance;