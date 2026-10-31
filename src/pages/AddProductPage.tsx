import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Link2,
  Clipboard,
  ArrowRight,
  Sparkles,
  Store,
  Bell,
  LineChart,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { analyzeProductUrl, createTracker } from '../services/api';

const DEMO_LINKS = [
  {
    name: 'Sony WH-1000XM5',
    url: 'https://example.com/product/sony-wh-1000xm5-headphones',
  },
  {
    name: 'iPhone 15 Pro',
    url: 'https://example.com/product/iphone-15-pro-titanium',
  },
  {
    name: 'PS5 Slim Console',
    url: 'https://example.com/product/playstation-5-slim-console',
  },
];

export const AddProductPage: React.FC = () => {
  const [url, setUrl] = useState('');
  const [urlError, setUrlError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'drop' | 'target' | 'any'>('drop');
  const [targetPrice, setTargetPrice] = useState('');
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { user } = useAuth();

  const validateUrl = (testUrl: string): boolean => {
    try {
      const parsed = new URL(testUrl);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrl(text);
        setUrlError('');
        addToast({ type: 'info', message: 'Pasted URL from clipboard' });
      }
    } catch {
      addToast({ type: 'info', message: 'Clipboard access denied — paste manually.' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = url.trim();
    if (!trimmed || !validateUrl(trimmed)) {
      setUrlError("That doesn't look like a valid product link");
      return;
    }

    setUrlError('');
    setLoading(true);
    try {
      const { product, offers } = await analyzeProductUrl(trimmed);
      const best = offers.find((o) => o.isBestPrice) || offers[0];
      const result = await createTracker({
        email: user?.email || 'shopper@example.com',
        productId: product.id,
        mode,
        targetPrice:
          mode === 'target'
            ? parseFloat(targetPrice) || Math.floor(best.price * 0.95)
            : undefined,
      });

      addToast({
        type: 'success',
        title: 'Product added to radar',
        message: `${product.brand} is now being tracked across stores.`,
      });
      navigate(`/dashboard/product/${result.trackerId}`);
    } catch {
      addToast({
        type: 'error',
        title: 'Could not add product',
        message: 'Please try another URL or one of the demo links.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative space-y-8 overflow-hidden">
      <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[280px] -z-10">
        <div className="absolute top-0 left-1/4 w-56 h-56 rounded-full bg-[#4F46E5] opacity-15 blur-3xl animate-blob-a" />
        <div className="absolute top-10 right-1/4 w-64 h-64 rounded-full bg-[#7C3AED] opacity-12 blur-3xl animate-blob-b" />
      </div>

      <div className="max-w-[920px] space-y-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-slate-700 dark:text-slate-200">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            Add product by URL
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Paste a link. We handle the rest.
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl">
            Drop any product URL. PriceRadar identifies the item, finds prices across the internet, and starts monitoring.
          </p>
        </div>

        <div className="rounded-[24px] bg-white dark:bg-[#121832] border border-slate-200 dark:border-slate-800 shadow-radar p-5 sm:p-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Product URL
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-4 text-slate-400">
                  <Link2 className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value);
                    if (urlError) setUrlError('');
                  }}
                  placeholder="https://example.com/product/..."
                  className={`w-full h-14 pl-12 pr-24 rounded-[16px] bg-slate-50 dark:bg-slate-800/80 border text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                    urlError
                      ? 'border-rose-500 focus:ring-rose-500/20'
                      : 'border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/20'
                  }`}
                />
                <button
                  type="button"
                  onClick={handlePaste}
                  className="absolute right-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center gap-1 cursor-pointer"
                >
                  <Clipboard className="w-3.5 h-3.5" />
                  Paste
                </button>
              </div>
              {urlError && <p className="text-xs font-medium text-rose-500">{urlError}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Alert mode
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { id: 'drop' as const, label: 'Price drops', desc: 'When lower than today' },
                  { id: 'target' as const, label: 'Target price', desc: 'Below your budget' },
                  { id: 'any' as const, label: 'Any change', desc: 'Drops or increases' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setMode(opt.id)}
                    className={`text-left p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      mode === opt.id
                        ? 'border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/40'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="text-sm font-semibold text-slate-900 dark:text-white">{opt.label}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {mode === 'target' && (
              <div className="animate-in fade-in slide-in-from-top-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Target price ($)
                </label>
                <input
                  type="number"
                  step="1"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(e.target.value)}
                  placeholder="e.g. 299"
                  className="mt-2 w-full h-12 px-4 rounded-[14px] bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={loading}
              magnetic
              className="w-full sm:w-auto px-8 shadow-lg shadow-indigo-500/25"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Analyze & track
            </Button>
          </form>

          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs text-slate-500">Try:</span>
            {DEMO_LINKS.map((demo) => (
              <button
                key={demo.name}
                type="button"
                onClick={() => {
                  setUrl(demo.url);
                  setUrlError('');
                }}
                className="px-3 py-1 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 hover:border-indigo-400 hover:text-indigo-600 cursor-pointer transition-colors"
              >
                {demo.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: Store, title: 'Internet-wide match', desc: 'We find the same product across the best available sources online.' },
            { icon: LineChart, title: 'History unlocked', desc: 'See trends before you commit to an alert.' },
            { icon: Bell, title: 'Alerts on autopilot', desc: 'Emails fire when your conditions are met.' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="rounded-[20px] p-5 bg-white dark:bg-[#121832] border border-slate-200 dark:border-slate-800 shadow-sm"
              >
                <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3">
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">{item.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          Tracking as {user?.email || 'guest'} · You can change alert settings anytime
        </div>
      </div>
    </div>
  );
};
