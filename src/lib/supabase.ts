import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to get the correct redirect URL
const getRedirectUrl = (path: string) => {
  // In production, always use the production URL
  if (typeof window !== 'undefined') {
    const currentOrigin = window.location.origin;
    
    // If we're on localhost during development, use production URL for emails
    if (currentOrigin.includes('localhost') || currentOrigin.includes('127.0.0.1')) {
      return `https://taskflow-manager-ful-7jub.bolt.host${path}`;
    }
    
    // Otherwise use current origin
    return `${currentOrigin}${path}`;
  }
  
  // Fallback to production URL
  return `https://taskflow-manager-ful-7jub.bolt.host${path}`;
};

// Auth helpers
export const signUp = async (email: string, password: string, fullName: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const resetPassword = async (email: string) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: getRedirectUrl('/reset-password'),
  });
  return { data, error };
};

export const updatePassword = async (password: string) => {
  const { data, error } = await supabase.auth.updateUser({
    password: password
  });
  return { data, error };
};

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
}