import React, { useState, useEffect } from 'react';
import { CheckSquare, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import Header from '../components/Layout/Header';
import StatsCard from '../components/Dashboard/StatsCard';
import QuickActions from '../components/Dashboard/QuickActions';
import RecentActivity from '../components/Dashboard/RecentActivity';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import { Task, Transaction, Note } from '../types';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    overdueTasks: 0,
    totalIncome: 0,
    totalExpenses: 0,
    monthlyBalance: 0,
    totalNotes: 0,
  });
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
      // Add welcome notification for new users
      const userCreatedAt = new Date(user.created_at || '');
      const now = new Date();
      const hoursSinceCreation = (now.getTime() - userCreatedAt.getTime()) / (1000 * 60 * 60);
      
      if (hoursSinceCreation < 24) {
        addNotification({
          title: 'Welcome to WORKLOOP!',
          message: 'Explore your dashboard and start organizing your productivity workflow.',
          type: 'info',
          actionUrl: '/dashboard'
        });
      }
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      // Fetch tasks
      const { data: tasks } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user?.id);

      // Fetch transactions for current month
      const currentMonth = new Date();
      const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

      const { data: transactions } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user?.id)
        .gte('date', firstDay.toISOString().split('T')[0])
        .lte('date', lastDay.toISOString().split('T')[0]);

      // Fetch notes
      const { data: notes } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', user?.id);

      // Calculate stats
      const completedTasks = tasks?.filter(task => task.completed).length || 0;
      const pendingTasks = tasks?.filter(task => !task.completed).length || 0;
      const overdueTasks = tasks?.filter(task => 
        !task.completed && task.due_date && new Date(task.due_date) < new Date()
      ).length || 0;

      const income = transactions?.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0) || 0;
      const expenses = transactions?.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0) || 0;

      setStats({
        totalTasks: tasks?.length || 0,
        completedTasks,
        pendingTasks,
        overdueTasks,
        totalIncome: income,
        totalExpenses: expenses,
        monthlyBalance: income - expenses,
        totalNotes: notes?.length || 0,
      });

      // Recent activities (combine recent tasks and transactions)
      const recentTasks = tasks?.slice(-3).map(task => ({
        id: task.id,
        type: 'task',
        title: `${task.completed ? 'Completed' : 'Created'} task: ${task.title}`,
        time: new Date(task.updated_at || task.created_at).toLocaleTimeString(),
      })) || [];

      const recentTransactions = transactions?.slice(-3).map(transaction => ({
        id: transaction.id,
        type: transaction.type,
        title: `${transaction.type === 'income' ? 'Received' : 'Spent'} on ${transaction.category}`,
        time: new Date(transaction.created_at).toLocaleTimeString(),
        amount: transaction.amount,
      })) || [];

      const recentNotes = notes?.slice(-2).map(note => ({
        id: note.id,
        type: 'note',
        title: `Created note: ${note.title}`,
        time: new Date(note.created_at).toLocaleTimeString(),
      })) || [];

      const combined = [...recentTasks, ...recentTransactions, ...recentNotes]
        .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
        .slice(0, 5);

      setRecentActivities(combined);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = () => {
    // This would typically open a task creation modal or navigate to tasks page
    window.location.href = '/tasks';
  };

  const handleAddTransaction = () => {
    // This would typically open a transaction creation modal or navigate to finance page
    window.location.href = '/finance';
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
      <Header 
        title="Dashboard" 
        subtitle="Welcome to WORKLOOP! Here's your productivity overview." 
      />
      
      <div className="p-4 sm:p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <StatsCard
            title="Total Tasks"
            value={stats.totalTasks}
            icon={CheckSquare}
            color="blue"
            change="2 new this week"
            changeType="increase"
          />
          <StatsCard
            title="Completed Tasks"
            value={stats.completedTasks}
            icon={CheckSquare}
            color="green"
            change={`${Math.round((stats.completedTasks / stats.totalTasks) * 100) || 0}% completion rate`}
          />
          <StatsCard
            title="Monthly Income"
            value={`₹${stats.totalIncome.toFixed(2)}`}
            icon={TrendingUp}
            color="green"
            change="5% from last month"
            changeType="increase"
          />
          <StatsCard
            title="Monthly Expenses"
            value={`₹${stats.totalExpenses.toFixed(2)}`}
            icon={TrendingDown}
            color="red"
            change="3% from last month"
            changeType="increase"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <QuickActions 
              onAddTask={handleAddTask}
              onAddTransaction={handleAddTransaction}
            />
          </div>
          
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <RecentActivity activities={recentActivities} />
          </div>
        </div>

        {/* Overdue Tasks Alert */}
        {stats.overdueTasks > 0 && (
          <div className="mt-4 sm:mt-6 bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm sm:text-base font-medium text-red-800">
                  {stats.overdueTasks} overdue task{stats.overdueTasks > 1 ? 's' : ''}
                </h3>
                <p className="mt-1 text-sm text-red-700">
                  You have tasks that are past their due date. Consider reviewing and updating them.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;