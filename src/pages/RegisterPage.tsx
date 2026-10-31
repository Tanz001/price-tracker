import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Radio, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const user = await register(name, email, password);
      addToast({
        type: 'success',
        title: 'Account created',
        message: `Welcome to PriceRadar, ${user.name.split(' ')[0]}!`,
      });
      navigate('/dashboard/add');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100svh-4rem)] sm:min-h-[calc(100vh-4.5rem)] flex items-center justify-center px-4 py-20 sm:py-24 overflow-x-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-16 right-1/4 w-80 h-80 rounded-full bg-[#06B6D4] opacity-10 blur-3xl animate-blob-a" />
        <div className="absolute bottom-20 left-1/5 w-96 h-96 rounded-full bg-[#4F46E5] opacity-15 blur-3xl animate-blob-b" />
      </div>

      <div className="w-full max-w-[920px] grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <div className="hidden lg:flex flex-col justify-between rounded-[24px] bg-radar-gradient p-8 text-white shadow-2xl shadow-indigo-500/20 relative overflow-hidden">
          <div className="absolute -bottom-16 -right-10 w-56 h-56 rounded-full bg-white/10 blur-2xl" />
          <div className="relative space-y-4">
            <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center">
              <Radio className="w-5 h-5" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight leading-tight">
              Start catching price drops in minutes
            </h2>
            <p className="text-sm text-indigo-100 leading-relaxed">
              Create a free account to save trackers, set target prices, and control email alerts from one place.
            </p>
          </div>
          <ul className="relative space-y-3 pt-8">
            {[
              'Track products from any store URL',
              'Interactive 365-day price history',
              'Instant drop & target-price emails',
            ].map((item) => (
              <li key={item} className="flex items-center gap-2.5 text-sm text-indigo-50">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-[24px] bg-white dark:bg-[#121832] border border-slate-200 dark:border-slate-800 shadow-radar p-6 sm:p-8">
          <div className="mb-6 space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Create your account
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Free forever. No credit card required.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              leftIcon={<User className="w-4 h-4" />}
              placeholder="Alex Shopper"
              required
            />
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
              placeholder="At least 6 characters"
              helperText="Use 6+ characters for this mock signup"
              required
            />
            <Input
              label="Confirm password"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
              placeholder="Repeat password"
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
              Create account
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
