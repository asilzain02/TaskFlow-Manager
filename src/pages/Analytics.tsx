import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, PieChart, BarChart3 } from 'lucide-react';
import Header from '../components/Layout/Header';
import FinanceChart from '../components/Charts/FinanceChart';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Transaction } from '../types';

const Analytics: React.FC = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user, timeRange]);

  const fetchTransactions = async () => {
    try {
      const now = new Date();
      let startDate: Date;

      switch (timeRange) {
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case 'year':
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
      }

      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user?.id)
        .gte('date', startDate.toISOString().split('T')[0])
        .order('date', { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getExpensesByCategory = () => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const categoryTotals: { [key: string]: number } = {};

    expenses.forEach(expense => {
      categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
    });

    return Object.entries(categoryTotals).map(([name, value]) => ({ name, value }));
  };

  const getIncomeByCategory = () => {
    const income = transactions.filter(t => t.type === 'income');
    const categoryTotals: { [key: string]: number } = {};

    income.forEach(transaction => {
      categoryTotals[transaction.category] = (categoryTotals[transaction.category] || 0) + transaction.amount;
    });

    return Object.entries(categoryTotals).map(([name, value]) => ({ name, value }));
  };

  const getMonthlyTrends = () => {
    const monthlyData: { [key: string]: { income: number; expenses: number } } = {};

    transactions.forEach(transaction => {
      const month = new Date(transaction.date).toLocaleDateString('en-IN', { 
        month: 'short', 
        year: 'numeric' 
      });
      
      if (!monthlyData[month]) {
        monthlyData[month] = { income: 0, expenses: 0 };
      }

      if (transaction.type === 'income') {
        monthlyData[month].income += transaction.amount;
      } else {
        monthlyData[month].expenses += transaction.amount;
      }
    });

    return Object.entries(monthlyData).map(([name, data]) => ({
      name,
      Income: data.income,
      Expenses: data.expenses,
      Net: data.income - data.expenses,
    }));
  };

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const netBalance = totalIncome - totalExpenses;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Analytics" subtitle="Insights into your productivity and financial patterns" />
      
      <div className="p-6">
        {/* Time Range Selector */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-2">
            {(['week', 'month', 'year'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  timeRange === range
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Income</p>
                <p className="text-2xl font-semibold text-green-600 mt-1">
                  ₹{totalIncome.toLocaleString('en-IN')}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-green-500">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Expenses</p>
                <p className="text-2xl font-semibold text-red-600 mt-1">
                  ₹{totalExpenses.toLocaleString('en-IN')}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-red-500">
                <TrendingDown className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Net Balance</p>
                <p className={`text-2xl font-semibold mt-1 ${
                  netBalance >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  ₹{netBalance.toLocaleString('en-IN')}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${
                netBalance >= 0 ? 'bg-green-500' : 'bg-red-500'
              }`}>
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FinanceChart
            data={getExpensesByCategory()}
            type="pie"
            title="Expenses by Category"
          />
          
          <FinanceChart
            data={getIncomeByCategory()}
            type="pie"
            title="Income by Source"
          />
        </div>
      </div>
    </div>
  );
};

export default Analytics;