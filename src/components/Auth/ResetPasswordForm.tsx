import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { updatePassword, supabase } from '../../lib/supabase';

const ResetPasswordForm: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [validToken, setValidToken] = useState(true);

  // Handle the session from URL parameters
  useEffect(() => {
    const handleAuthCallback = async () => {
      // Handle both hash and search params for better compatibility
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const searchParams = new URLSearchParams(window.location.search);
      
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');
      const type = hashParams.get('type');

      if (accessToken && refreshToken && type === 'recovery') {
        console.log('Setting recovery session with tokens');
        // Set the session
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken
        });

        if (error) {
          console.error('Session error:', error);
          setError('Invalid or expired reset link. Please request a new password reset.');
          setValidToken(false);
        } else {
          console.log('Recovery session set successfully');
          setValidToken(true);
        }
      } else {
        console.log('Missing required parameters for password reset');
        setError('Invalid or expired reset link. Please request a new password reset.');
        setValidToken(false);
      }
    };

    handleAuthCallback();
  }, []);

  useEffect(() => {
    // Also check URL search params as fallback
    const accessToken = searchParams.get('access_token');
    const refreshToken = searchParams.get('refresh_token');
    const type = searchParams.get('type');
    
    if (accessToken && refreshToken && type === 'recovery') {
      // Handle session setting for search params
      supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken
      });
    } else if (!window.location.hash.includes('access_token')) {
      setError('Invalid or expired reset link. Please request a new password reset.');
      setValidToken(false);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const { error } = await updatePassword(password);

      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
        // Redirect to login after 3 seconds
        setTimeout(() => {
          // Sign out to clear the recovery session
          supabase.auth.signOut();
          navigate('/login');
        }, 3000);
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-6 sm:space-y-8 p-6 sm:p-8 bg-white rounded-xl shadow-lg text-center">
          <div className="mx-auto h-16 w-16 mb-4">
            <img src="/Untitled design.png" alt="WORKLOOP" className="h-full w-full object-contain" />
          </div>
          
          <div className="text-center">
            <div className="mx-auto h-12 w-12 mb-4">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Password Reset Successful!</h2>
            <p className="text-sm sm:text-base text-gray-600 mb-6">
              Your password has been successfully updated. You will be redirected to the login page shortly.
            </p>
            <div className="animate-pulse text-sm text-gray-500">
              Redirecting in 3 seconds...
            </div>
            <button
              onClick={() => {
                supabase.auth.signOut();
                navigate('/login');
              }}
              className="mt-4 text-blue-600 hover:text-blue-500 text-sm font-medium"
            >
              Go to Login Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!validToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-6 sm:space-y-8 p-6 sm:p-8 bg-white rounded-xl shadow-lg text-center">
          <div className="mx-auto h-16 w-16 mb-4">
            <img src="/Untitled design.png" alt="WORKLOOP" className="h-full w-full object-contain" />
          </div>
          
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Invalid Reset Link</h2>
            <p className="text-sm sm:text-base text-gray-600 mb-6">
              This password reset link is invalid or has expired. Please request a new password reset.
            </p>
            <div className="space-y-4">
              <Link
                to="/forgot-password"
                className="w-full flex justify-center py-3 sm:py-4 px-4 border border-transparent rounded-lg shadow-sm text-sm sm:text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Request New Reset Link
              </Link>
              <Link
                to="/login"
                className="w-full flex justify-center py-2 px-4 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
              >
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 sm:space-y-8 p-6 sm:p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 mb-4">
            <img src="/Untitled design.png" alt="WORKLOOP" className="h-full w-full object-contain" />
          </div>
          <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-gray-900">Reset Your Password</h2>
          <p className="mt-2 text-sm sm:text-base text-gray-600">
            Enter your new password below
          </p>
        </div>

        <form className="mt-6 sm:mt-8 space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="password" className="block text-sm sm:text-base font-medium text-gray-700">
              New Password
            </label>
            <div className="mt-1 relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-12 py-2 sm:py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                placeholder="Enter new password"
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm sm:text-base font-medium text-gray-700">
              Confirm New Password
            </label>
            <div className="mt-1 relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-10 pr-12 py-2 sm:py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                placeholder="Confirm new password"
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="text-xs text-gray-500">
            <ul className="list-disc list-inside space-y-1">
              <li>Password must be at least 6 characters long</li>
              <li>Use a combination of letters, numbers, and symbols for better security</li>
            </ul>
          </div>

          <button
            type="submit"
            disabled={loading || !password || !confirmPassword}
            className="w-full flex justify-center py-3 sm:py-4 px-4 border border-transparent rounded-lg shadow-sm text-sm sm:text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Updating password...' : 'Update password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordForm;