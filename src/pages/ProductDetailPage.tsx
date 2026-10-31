import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Bell,
  BellOff,
  DollarSign,
  ExternalLink,
  Target,
  TrendingDown,
  TrendingUp,
  Save,
} from 'lucide-react';
import { Tracker } from '../types';
import { getTrackerById, toggleTracker, updateTrackerTarget } from '../services/api';
import { PriceChart } from '../components/results/PriceChart';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { useToast } from '../context/ToastContext';

export const ProductDetailPage: React.FC = () => {
  const { trackerId } = useParams<{ trackerId: string }>();
  const [tracker, setTracker] = useState<Tracker | null>(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<Tracker['mode']>('drop');
  const [targetPrice, setTargetPrice] = useState('');
  const [saving, setSaving] = useState(false);
  const { addToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!trackerId) return;
      setLoading(true);
      try {
        const data = await getTrackerById(trackerId);
        if (!alive) return;
        if (!data) {
          setTracker(null);
        } else {
          setTracker(data);
          setMode(data.mode);
          setTargetPrice(
            data.targetPrice != null
              ? String(data.targetPrice)
              : Math.floor(data.currentLowestPrice * 0.95).toString()
          );
        }
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [trackerId]);

  const handleSaveTarget = async () => {
    if (!tracker) return;
    setSaving(true);
    try {
      const updated = await updateTrackerTarget(tracker.id, {
        mode,
        targetPrice: mode === 'target' ? parseFloat(targetPrice) : undefined,
      });
      setTracker(updated);
      addToast({
        type: 'success',
        title: 'Target updated',
        message:
          mode === 'target'
            ? `You'll be notified at $${parseFloat(targetPrice).toFixed(2)} or below.`
            : 'Alert mode saved for this product.',
      });
    } catch {
      addToast({ type: 'error', message: 'Could not save target price.' });
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async () => {
    if (!tracker) return;
    const next = !tracker.active;
    setTracker({ ...tracker, active: next });
    try {
      await toggleTracker(tracker.id, next);
      addToast({
        type: 'success',
        title: next ? 'Alerts resumed' : 'Alerts paused',
        message: next ? 'Radar is watching this product again.' : 'No emails will be sent for this item.',
      });
    } catch {
      setTracker({ ...tracker, active: tracker.active });
      addToast({ type: 'error', message: 'Failed to update alert status.' });
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin mx-auto" />
          <p className="text-xs text-slate-500">Loading product radar…</p>
        </div>
      </div>
    );
  }

  if (!tracker) {
    return (
      <div className="py-24 flex items-center justify-center">
        <div className="text-center space-y-4 max-w-sm">
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Product not found</h1>
          <p className="text-sm text-slate-500">This tracker may have been removed.</p>
          <Button variant="primary" onClick={() => navigate('/dashboard/products')}>
            Back to products
          </Button>
        </div>
      </div>
    );
  }

  const isDrop = tracker.priceChange <= 0;
  const savingsVsTarget =
    tracker.targetPrice != null ? tracker.currentLowestPrice - tracker.targetPrice : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <Link
            to="/dashboard/products"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to products
          </Link>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Price history
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Trajectory, target price, and alert controls.
          </p>
        </div>
        <Button
          variant={tracker.active ? 'secondary' : 'primary'}
          size="sm"
          onClick={handleToggle}
          leftIcon={tracker.active ? <BellOff className="w-3.5 h-3.5" /> : <Bell className="w-3.5 h-3.5" />}
        >
          {tracker.active ? 'Pause alerts' : 'Resume alerts'}
        </Button>
      </div>

      {/* Product hero strip */}
      <div className="rounded-[24px] bg-white dark:bg-[#121832] border border-slate-200 dark:border-slate-800 shadow-radar p-5 sm:p-6">
        <div className="flex flex-col md:flex-row gap-5 md:items-center">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 shrink-0 flex items-center justify-center overflow-hidden">
            <img
              src={tracker.product.imageUrl}
              alt={tracker.product.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex-1 min-w-0 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              {tracker.product.brand}
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-snug">
              {tracker.product.title}
            </h2>
            <p className="text-xs text-slate-500">
              Model {tracker.product.model} · Last checked {tracker.lastCheckedAt}
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:min-w-[320px]">
            <div className="rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 p-3">
              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Lowest</p>
              <p className="font-mono text-xl font-bold text-slate-900 dark:text-white tabular-nums">
                ${tracker.currentLowestPrice.toFixed(2)}
              </p>
              <p className="text-[11px] text-slate-500">on {tracker.bestStoreName}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 p-3">
              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Change</p>
              <p
                className={`font-mono text-xl font-bold tabular-nums inline-flex items-center gap-1 ${
                  isDrop ? 'text-emerald-500' : 'text-rose-500'
                }`}
              >
                {isDrop ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
                {Math.abs(tracker.priceChangePercent)}%
              </p>
              <p className="text-[11px] text-slate-500">vs first tracked</p>
            </div>
            <div className="rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 p-3 col-span-2 sm:col-span-1">
              <p className="text-[10px] uppercase tracking-wider text-indigo-500 font-semibold">Target</p>
              <p className="font-mono text-xl font-bold text-indigo-700 dark:text-indigo-300 tabular-nums">
                {tracker.targetPrice != null ? `$${tracker.targetPrice.toFixed(2)}` : '—'}
              </p>
              <p className="text-[11px] text-indigo-600/80 dark:text-indigo-400/80">
                {tracker.mode === 'target'
                  ? savingsVsTarget != null && savingsVsTarget <= 0
                    ? 'Target reached'
                    : 'Waiting for target'
                  : `Mode: ${tracker.mode}`}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2">
          <PriceChart productId={tracker.productId} />
        </div>

        {/* Set target price panel */}
        <div className="rounded-[20px] bg-white dark:bg-[#121832] border border-slate-200 dark:border-slate-800 shadow-radar p-6 space-y-5 sticky top-24">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">Set target price</h3>
              <p className="text-[11px] text-slate-500">Choose when we should email you</p>
            </div>
          </div>

          <div className="space-y-2">
            {[
              { id: 'drop' as const, label: 'Price drops only', desc: 'Lower than today’s lowest' },
              { id: 'target' as const, label: 'Below target price', desc: 'Your custom budget threshold' },
              { id: 'any' as const, label: 'Any price change', desc: 'Drops and increases' },
            ].map((opt) => (
              <label
                key={opt.id}
                className={`flex items-start gap-3 p-3 rounded-xl border text-xs cursor-pointer transition-colors ${
                  mode === opt.id
                    ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                <input
                  type="radio"
                  name="mode"
                  checked={mode === opt.id}
                  onChange={() => setMode(opt.id)}
                  className="mt-0.5"
                />
                <div>
                  <div className="font-semibold text-slate-900 dark:text-slate-200">{opt.label}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{opt.desc}</div>
                </div>
              </label>
            ))}
          </div>

          {mode === 'target' && (
            <Input
              label="Target price ($)"
              type="number"
              step="1"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              leftIcon={<DollarSign className="w-4 h-4" />}
              helperText={`Current lowest is $${tracker.currentLowestPrice.toFixed(2)}`}
            />
          )}

          <Button
            variant="primary"
            isLoading={saving}
            onClick={handleSaveTarget}
            className="w-full"
            leftIcon={<Save className="w-4 h-4" />}
          >
            Save alert settings
          </Button>

          <Link
            to={`/results?url=${encodeURIComponent(tracker.productId)}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Compare all store offers
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
};
