import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Trash2,
  Bell,
  BellOff,
  ExternalLink,
  Search,
  Plus,
  Target,
  LineChart,
} from 'lucide-react';
import { Tracker } from '../types';
import { getTrackers, deleteTracker, toggleTracker } from '../services/api';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

const Sparkline: React.FC<{ data: number[]; isDrop: boolean }> = ({ data, isDrop }) => {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 110;
  const height = 36;
  const padding = 3;
  const points = data
    .map((val, idx) => {
      const x = padding + (idx / (data.length - 1)) * (width - 2 * padding);
      const y = height - padding - ((val - min) / range) * (height - 2 * padding);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        fill="none"
        stroke={isDrop ? '#10B981' : '#EF4444'}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
};

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [trackers, setTrackers] = useState<Tracker[]>([]);
  const [loading, setLoading] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Tracker | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { addToast } = useToast();
  const navigate = useNavigate();

  const loadTrackers = async () => {
    if (!user) return;
    setLoading(true);
    try {
      let list = await getTrackers(user.email);
      // Frontend demo: new accounts still see seeded products so the dashboard isn't empty
      if (list.length === 0) {
        const seed = await getTrackers('shopper@example.com');
        list = seed.map((t) => ({ ...t, email: user.email }));
      }
      setTrackers(list);
    } catch {
      addToast({
        type: 'error',
        title: 'Error loading trackers',
        message: 'Could not fetch your tracked products.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrackers();
  }, [user?.email]);

  const handleToggle = async (tracker: Tracker) => {
    const nextState = !tracker.active;
    setTrackers((prev) => prev.map((t) => (t.id === tracker.id ? { ...t, active: nextState } : t)));
    try {
      await toggleTracker(tracker.id, nextState);
      addToast({
        type: 'success',
        title: nextState ? 'Radar Alert Resumed' : 'Radar Alert Paused',
        message: nextState
          ? `We will notify you when ${tracker.product.title.substring(0, 30)}... drops.`
          : 'Alerts paused for this item.',
      });
    } catch {
      setTrackers((prev) => prev.map((t) => (t.id === tracker.id ? { ...t, active: tracker.active } : t)));
      addToast({ type: 'error', message: 'Failed to update alert status.' });
    }
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    setDeleting(true);
    try {
      await deleteTracker(itemToDelete.id);
      setTrackers((prev) => prev.filter((t) => t.id !== itemToDelete.id));
      addToast({
        type: 'info',
        title: 'Tracker removed',
        message: `Removed ${itemToDelete.product.title.substring(0, 35)} from radar.`,
      });
      setItemToDelete(null);
    } catch {
      addToast({ type: 'error', message: 'Failed to remove tracker.' });
    } finally {
      setDeleting(false);
    }
  };

  const activeCount = trackers.filter((t) => t.active).length;
  const withTarget = trackers.filter((t) => t.mode === 'target').length;

  return (
    <div className="min-h-screen pt-28 pb-24 px-4 sm:px-6 max-w-[1200px] mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            My tracked products
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Welcome back, {user?.name.split(' ')[0]} · {activeCount} active radar
            {activeCount === 1 ? '' : 's'}
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate('/add-product')}
          leftIcon={<Plus className="w-3.5 h-3.5" />}
          rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
        >
          Add product by URL
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { label: 'Tracked items', value: trackers.length, icon: Search },
          { label: 'Active alerts', value: activeCount, icon: Bell },
          { label: 'With target price', value: withTarget, icon: Target },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-[18px] p-4 bg-white dark:bg-[#121832] border border-slate-200 dark:border-slate-800 flex items-center justify-between"
            >
              <div>
                <p className="text-[11px] uppercase tracking-wider font-semibold text-slate-400">{stat.label}</p>
                <p className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Icon className="w-4 h-4" />
              </div>
            </div>
          );
        })}
      </div>

      {loading ? (
        <div className="py-16 text-center space-y-3">
          <div className="w-8 h-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin mx-auto" />
          <p className="text-xs text-slate-500">Checking your live trackers...</p>
        </div>
      ) : trackers.length === 0 ? (
        <div className="py-16 px-6 text-center max-w-md mx-auto space-y-5 rounded-[24px] bg-white dark:bg-[#121832] border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
            <Search className="w-8 h-8" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              You're not tracking anything yet
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Paste any product link to compare prices and receive alerts when prices drop.
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => navigate('/add-product')}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Track your first product
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trackers.map((tracker) => {
            const isDrop = tracker.priceChange <= 0;
            return (
              <div
                key={tracker.id}
                className={`rounded-[20px] p-5 bg-white dark:bg-[#121832] border transition-all duration-200 flex flex-col justify-between gap-4 ${
                  tracker.active
                    ? 'border-slate-200 dark:border-slate-800 shadow-radar hover:shadow-radar-hover'
                    : 'border-slate-200/60 dark:border-slate-800/60 opacity-70 bg-slate-50/50 dark:bg-slate-900/30'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <Link to={`/product/${tracker.id}`} className="flex items-center gap-3 min-w-0 group">
                      <div className="w-14 h-14 rounded-xl bg-slate-50 dark:bg-slate-800 p-1.5 border border-slate-200/80 dark:border-slate-700/60 shrink-0 flex items-center justify-center overflow-hidden">
                        <img
                          src={tracker.product.imageUrl}
                          alt={tracker.product.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                          {tracker.product.brand}
                        </span>
                        <h4 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {tracker.product.title}
                        </h4>
                      </div>
                    </Link>
                    <button
                      onClick={() => setItemToDelete(tracker)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                      title="Delete tracker"
                      aria-label="Delete tracker"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80">
                    <div>
                      <span className="text-[10px] font-medium text-slate-400 uppercase">Current Lowest</span>
                      <div className="flex items-baseline gap-2">
                        <span className="font-mono text-xl font-bold text-slate-900 dark:text-white tabular-nums">
                          ${tracker.currentLowestPrice.toFixed(2)}
                        </span>
                        <span
                          className={`inline-flex items-center gap-0.5 text-xs font-bold font-mono tabular-nums ${
                            isDrop ? 'text-emerald-500' : 'text-rose-500'
                          }`}
                        >
                          {isDrop ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
                          <span>{Math.abs(tracker.priceChangePercent)}%</span>
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        on {tracker.bestStoreName}
                        {tracker.targetPrice != null && (
                          <> · target ${tracker.targetPrice.toFixed(0)}</>
                        )}
                      </span>
                    </div>
                    <div className="shrink-0 text-right">
                      <span className="text-[10px] text-slate-400">Trend</span>
                      <Sparkline data={tracker.sparklineData} isDrop={isDrop} />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs gap-2">
                  <button
                    onClick={() => handleToggle(tracker)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium transition-colors cursor-pointer border ${
                      tracker.active
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {tracker.active ? (
                      <>
                        <Bell className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Active</span>
                      </>
                    ) : (
                      <>
                        <BellOff className="w-3.5 h-3.5" />
                        <span>Paused</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-3">
                    <Link
                      to={`/product/${tracker.id}`}
                      className="inline-flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      <LineChart className="w-3 h-3" />
                      History
                    </Link>
                    <Link
                      to={`/results?url=${encodeURIComponent(tracker.productId)}`}
                      className="inline-flex items-center gap-1 font-semibold text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400"
                    >
                      Stores
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        title="Remove this tracker?"
        description="You will no longer receive price drop emails for this product."
      >
        <div className="space-y-4">
          {itemToDelete && (
            <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
              {itemToDelete.product.title}
            </p>
          )}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setItemToDelete(null)}>
              Cancel
            </Button>
            <Button variant="danger" isLoading={deleting} onClick={confirmDelete}>
              Yes, delete tracker
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
