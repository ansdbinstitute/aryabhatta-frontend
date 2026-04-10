import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { GraduationCap, Eye, EyeOff, AlertCircle, ArrowLeft } from 'lucide-react';
import useStudentAuthStore from '../stores/studentAuthStore';

const StudentLoginPage = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, user, isAuthenticated, isLoading: authLoading } = useStudentAuthStore();

  // If already authenticated as student, redirect to student dashboard
  if (isAuthenticated && user?.roleType === 'student') {
    return <Navigate to="/student/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!identifier.trim() || !password.trim()) return;
    
    setError('');
    setIsLoading(true);
    
    try {
      const result = await login(identifier, password);
      
      if (!result.success) {
        setError(result.error || 'Invalid credentials');
      }
      // If success, the useAuth hook will navigate to /student/dashboard
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
            backgroundSize: '30px 30px',
          }}
        />
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="relative w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl shadow-xl mb-6 p-3">
            <img src="/favicon.png" alt="ANSDB Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-white text-2xl font-bold tracking-tight">ANSDB Student Portal</h1>
          <p className="text-blue-200/60 text-sm mt-2">Learning, results, notices, and payment access</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">Student Portal</p>
                <h2 className="text-xl font-bold text-slate-800">Welcome Back</h2>
              </div>
            </div>
            <p className="text-sm text-slate-500">
              Sign in with your student UID, email, or issued portal credentials.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Student UID Input */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Student UID or Email
              </label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Enter your student UID or email"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-slate-800 placeholder:text-slate-400"
                disabled={isLoading}
                required
                autoFocus
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-slate-800 placeholder:text-slate-400"
                  disabled={isLoading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500/20" 
                />
                <span className="text-slate-500">Remember me</span>
              </label>
              <a href="#" className="text-blue-600 hover:text-blue-700 hover:underline font-medium">
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In to Student Portal'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-4 text-sm text-slate-400">OR</span>
            </div>
          </div>

          {/* Back to Portal Selection */}
          <Link
            to="/login"
            className="flex items-center justify-center gap-2 text-slate-600 hover:text-slate-800 transition-colors py-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Portal Selection
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-blue-200/40 text-xs">
            Aryabhatta National Skill Development Board
          </p>
          <p className="text-blue-200/30 text-[10px] mt-1">
            © {new Date().getFullYear()} All Rights Reserved
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentLoginPage;
