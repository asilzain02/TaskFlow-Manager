export interface User {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
  updated_at?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  category?: string;
  due_date?: string;
  created_at: string;
  updated_at?: string;
  user_id: string;
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description?: string;
  date: string;
  created_at: string;
  user_id: string;
}

export interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasks: number;
  totalIncome: number;
  totalExpenses: number;
  monthlyBalance: number;
}

export interface Note {
  id: string;
  title: string;
  content?: string;
  category?: string;
  color: 'yellow' | 'blue' | 'green' | 'pink' | 'purple' | 'orange';
  pinned: boolean;
  created_at: string;
  updated_at?: string;
  user_id: string;
}