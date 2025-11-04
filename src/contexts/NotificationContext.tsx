import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'read' | 'createdAt'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Generate sample notifications based on user data
  useEffect(() => {
    if (user) {
      generateSampleNotifications();
      // Check for overdue tasks
      checkOverdueTasks();
      // Check for recent financial activity
      checkFinancialActivity();
    }
  }, [user]);

  const generateSampleNotifications = () => {
    const sampleNotifications: Notification[] = [
      {
        id: '1',
        title: 'Welcome to WORKLOOP!',
        message: 'Start organizing your tasks and managing your finances effectively.',
        type: 'info',
        read: false,
        createdAt: new Date().toISOString(),
        actionUrl: '/dashboard'
      },
      {
        id: '2',
        title: 'Profile Setup',
        message: 'Complete your profile setup to get personalized recommendations.',
        type: 'warning',
        read: false,
        createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        actionUrl: '/profile'
      }
    ];

    setNotifications(sampleNotifications);
  };

  const checkOverdueTasks = async () => {
    try {
      const { data: tasks } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user?.id)
        .eq('completed', false)
        .lt('due_date', new Date().toISOString().split('T')[0]);

      if (tasks && tasks.length > 0) {
        const overdueNotification: Notification = {
          id: `overdue-${Date.now()}`,
          title: 'Overdue Tasks',
          message: `You have ${tasks.length} overdue task${tasks.length > 1 ? 's' : ''}. Review and update them.`,
          type: 'error',
          read: false,
          createdAt: new Date().toISOString(),
          actionUrl: '/tasks'
        };

        setNotifications(prev => [overdueNotification, ...prev]);
      }
    } catch (error) {
      console.error('Error checking overdue tasks:', error);
    }
  };

  const checkFinancialActivity = async () => {
    try {
      const today = new Date();
      const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);

      const { data: transactions } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user?.id)
        .gte('created_at', yesterday.toISOString());

      if (transactions && transactions.length > 0) {
        const totalAmount = transactions.reduce((sum, t) => sum + (t.type === 'expense' ? t.amount : 0), 0);
        
        if (totalAmount > 0) {
          const financialNotification: Notification = {
            id: `financial-${Date.now()}`,
            title: 'Daily Spending Summary',
            message: `You've spent ₹${totalAmount.toFixed(2)} in the last 24 hours across ${transactions.length} transaction${transactions.length > 1 ? 's' : ''}.`,
            type: 'info',
            read: false,
            createdAt: new Date().toISOString(),
            actionUrl: '/finance'
          };

          setNotifications(prev => [financialNotification, ...prev]);
        }
      }
    } catch (error) {
      console.error('Error checking financial activity:', error);
    }
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'read' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      read: false,
      createdAt: new Date().toISOString(),
    };

    setNotifications(prev => [newNotification, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const value = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};