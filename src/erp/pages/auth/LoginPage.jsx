import React, { useMemo, useState } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';

const LoginPage = ({
  portalOverride = null,
  redirectTo = '/erp/dashboard',
  fallbackRedirectTo = '/erp/dashboard',
  forgotPasswordPath = '#',
  backToPath = '/',
  brandTitle = 'ANSDB ERP',
  brandSubtitle = 'Institute Management System',
}) => {
  const { login, logout, user, isAuthenticated, isLoading, error, clearError } = useAuth();
  const [searchParams] = useSearchParams();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const portal = portalOverride || searchParams.get('portal');
  const forceLogin = searchParams.get('force') === 'true';

  React.useEffect(() => {
    if (forceLogin && isAuthenticated) {
      logout();
    }
  }, [forceLogin, isAuthenticated, logout]);

  const portalCopy = useMemo(() => {
    if (portal === 'student') {
      return {
        eyebrow: 'Student Portal',
        title: 'Student Access',
        subtitle: 'Sign in with your student UID, email, or issued portal credentials to open your student portal.',
      };
    }

    if (portal === 'institute') {
      return {
        eyebrow: 'Institute Portal',
        title: 'Institute ERP Access',
        subtitle: 'Sign in as an affiliated institute, training center, or branch operator.',
      };
    }

    if (portal === 'administration') {
      return {
        eyebrow: 'Administration Portal',
        title: 'Administration ERP Access',
        subtitle: 'Sign in as a board official, institute admin, or privileged ERP operator.',
      };
    }

    return {
      eyebrow: 'ERP Login',
      title: 'Welcome Back',
      subtitle: 'Sign in to your account to continue.',
    };
  }, [portal]);

  if (isAuthenticated) {
    const target = user?.roleType === 'student' ? redirectTo : fallbackRedirectTo;
    return <Navigate to={target} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!identifier.trim() || !password.trim()) return;
    clearError();
    await login(identifier, password, { redirectTo, portal });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-secondary to-primary flex items-center justify-center p-4 font-erp">
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, rgba(255,255,255,0.1) 0px, rgba(255,255,255,0.1) 1px, transparent 1px, transparent 12px)',
          }}
        />
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white shadow-lg shadow-black/10 mb-4 p-2">
            <img src="/logo.png" alt="ANSDB Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-white text-2xl font-bold tracking-tight">{brandTitle}</h1>
          <p className="text-blue-200/60 text-sm mt-1">{brandSubtitle}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="mb-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">{portalCopy.eyebrow}</p>
            <h2 className="text-xl font-bold text-slate-800 mt-2">{portalCopy.title}</h2>
            <p className="text-sm text-slate-400 mt-1">{portalCopy.subtitle}</p>
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          )}

          <form 
            onSubmit={handleSubmit} 
            autoComplete="off" 
            autoCorrect="off" 
            spellCheck="off" 
            className="space-y-4"
          >
            <Input
              label={portal === 'student' ? 'Student UID' : 'Email or Username'}
              icon="person"
              type="text"
              placeholder={portal === 'student' ? 'Enter your student UID' : 'Enter your email'}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              autoFocus={false}
              disabled={isLoading}
              autoComplete="off"
              autoCorrect="off"
            />

            <div className="relative">
              <Input
                label="Password"
                icon="lock"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                autoComplete="off"
                autoCorrect="off"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[34px] text-slate-400 hover:text-slate-600 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-slate-300 text-primary focus:ring-primary/20" />
                <span className="text-slate-500">Remember me</span>
              </label>
              <a href={forgotPasswordPath} className="text-primary hover:underline font-medium">
                Forgot password?
              </a>
            </div>

            <Button type="submit" fullWidth size="lg" loading={isLoading} variant="primary">
              Sign In
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-400">Aryabhatta National Skill Development Board</p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <a href={backToPath} className="text-sm text-blue-200/60 hover:text-white transition-colors">
            Back to Website
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
