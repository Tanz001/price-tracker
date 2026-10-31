import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Radio, Shield } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('shopper@example.com');
  const [password, setPassword] = useState('demo1234');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      addToast({
        type: 'success',
        title: `Welcome back, ${user.name.split(' ')[0]}`,
        message: 'Your trackers are ready.',
      });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100svh-4rem)] sm:min-h-[calc(100vh-4.5rem)] flex items-center justify-center px-4 py-20 sm:py-24 overflow-x-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-20 left-1/4 w-80 h-80 rounded-full bg-[#4F46E5] opacity-15 blur-3xl animate-blob-a" />
        <div className="absolute bottom-24 right-1/4 w-96 h-96 rounded-full bg-[#7C3AED] opacity-15 blur-3xl animate-blob-b" />
      </div>

      <div className="w-full max-w-md">
        <div className="text-center mb-8 space-y-3">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-radar-gradient items-center justify-center text-white shadow-lg shadow-indigo-500/30 mx-auto">
            <Radio className="w-5 h-5" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Sign in to PriceRadar
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Access your tracked products, alerts, and price history.
          </p>
        </div>

        <div className="rounded-[24px] bg-white dark:bg-[#121832] border border-slate-200 dark:border-slate-800 shadow-radar p-6 sm:p-8 space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
              placeholder="you@domain.com"
              required
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
              placeholder="Your password"
              required
            />

            {error && (
              <p className="text-xs font-medium text-rose-500 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 rounded-xl px-3 py-2">
                {error}
              </p>
            )}

            <Button
              type="submit"
              variant="primary"
              isLoading={loading}
              magnetic
              className="w-full h-12"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Sign in
            </Button>
          </form>

          <div className="rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-3.5 space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Demo accounts
            </p>
            <button
              type="button"
              onClick={() => {
                setEmail('shopper@example.com');
                setPassword('demo1234');
              }}
              className="w-full text-left text-xs text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
            >
              User · shopper@example.com / demo1234
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail('admin@priceradar.io');
                setPassword('admin1234');
              }}
              className="w-full text-left text-xs text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
            >
              Admin · admin@priceradar.io / admin1234
            </button>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
            <Shield className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>Frontend-only mock auth — credentials stay in your browser.</span>
          </div>
        </div>

        <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
          New here?{' '}
          <Link to="/register" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};
