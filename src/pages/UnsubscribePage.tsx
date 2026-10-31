import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, BellOff, ArrowLeft, Mail, ShieldAlert } from 'lucide-react';
import { Button } from '../components/common/Button';
import { unsubscribe } from '../services/api';
import { useToast } from '../context/ToastContext';

export const UnsubscribePage: React.FC = () => {
  const [submittedScope, setSubmittedScope] = useState<'product' | 'all' | null>(null);
  const [loadingScope, setLoadingScope] = useState<'product' | 'all' | null>(null);
  const { addToast } = useToast();

  const handleUnsubscribe = async (scope: 'product' | 'all') => {
    setLoadingScope(scope);
    try {
      await unsubscribe('token_demo_user', scope);
      setSubmittedScope(scope);
      addToast({
        type: 'info',
        title: 'Preferences saved',
        message: scope === 'all'
          ? 'You have been unsubscribed from all PriceRadar alerts.'
          : 'You have been unsubscribed from alerts for this product.',
      });
    } catch {
      addToast({
        type: 'error',
        message: 'Could not update your preferences. Please try again.',
      });
    } finally {
      setLoadingScope(null);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-24 px-4 sm:px-6 flex items-center justify-center">
      <div className="w-full max-w-lg rounded-[24px] bg-white dark:bg-[#121832] border border-slate-200 dark:border-slate-800 shadow-2xl p-8 sm:p-10 text-center space-y-6">
        {!submittedScope ? (
          <>
            <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
              <BellOff className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Sorry to see you go.
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
                Manage your notification preferences below. You will never receive unwanted emails from PriceRadar.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300 flex items-center gap-3 text-left">
              <Mail className="w-4 h-4 text-slate-400 shrink-0" />
              <div>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  shopper@example.com
                </span>
                <p className="text-[11px] text-slate-400">
                  Subscribed to 3 active price drop radars
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <Button
                variant="outline"
                isLoading={loadingScope === 'product'}
                onClick={() => handleUnsubscribe('product')}
                className="w-full h-12"
              >
                Unsubscribe from this product only
              </Button>

              <Button
                variant="danger"
                isLoading={loadingScope === 'all'}
                onClick={() => handleUnsubscribe('all')}
                className="w-full h-12"
              >
                Unsubscribe from all PriceRadar alerts
              </Button>
            </div>

            <div className="pt-2">
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to PriceRadar home</span>
              </Link>
            </div>
          </>
        ) : (
          <div className="space-y-6 py-4 animate-in fade-in duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-500 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Preferences updated
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {submittedScope === 'all'
                  ? "You have been removed from all email notifications. You won't hear from us again."
                  : 'You will no longer receive alerts for this product.'}
              </p>
            </div>

            <div className="pt-4">
              <Button
                variant="primary"
                onClick={() => (window.location.href = '/')}
                className="w-full"
              >
                Back to Homepage
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
