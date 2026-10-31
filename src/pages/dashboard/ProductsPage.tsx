import React, { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Bell,
  BellOff,
  ExternalLink,
  LayoutGrid,
  LineChart,
  List,
  Plus,
  Search,
  Trash2,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { Tracker } from '../../types';
import { deleteTracker, toggleTracker } from '../../services/api';
import { useTrackers } from '../../hooks/useTrackers';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { useToast } from '../../context/ToastContext';

const Sparkline: React.FC<{ data: number[]; isDrop: boolean }> = ({ data, isDrop }) => {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 100;
  const height = 32;
  const padding = 2;
  const points = data
    .map((val, idx) => {
      const x = padding + (idx / (data.length - 1)) * (width - 2 * padding);
      const y = height - padding - ((val - min) / range) * (height - 2 * padding);
      return `${x},${y}`;
    })
    .join(' ');
  return (
    <svg width={width} height={height}>
      <polyline
        fill="none"
        stroke={isDrop ? '#10B981' : '#EF4444'}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
};

export const ProductsPage: React.FC = () => {
  const { trackers, setTrackers, loading } = useTrackers();
  const [itemToDelete, setItemToDelete] = useState<Tracker | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [view, setView] = useState<'grid' | 'table'>('grid');
  const [status, setStatus] = useState<'all' | 'active' | 'paused'>('all');
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const { addToast } = useToast();
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    return trackers.filter((t) => {
      if (status === 'active' && !t.active) return false;
      if (status === 'paused' && t.active) return false;
      if (!query.trim()) return true;
      const q = query.toLowerCase();
      return (
        t.product.title.toLowerCase().includes(q) ||
        t.product.brand.toLowerCase().includes(q) ||
        t.bestStoreName.toLowerCase().includes(q)
      );
    });
  }, [trackers, status, query]);

  const handleToggle = async (tracker: Tracker) => {
    const next = !tracker.active;
    setTrackers((prev) => prev.map((t) => (t.id === tracker.id ? { ...t, active: next } : t)));
    try {
      await toggleTracker(tracker.id, next);
      addToast({
        type: 'success',
        title: next ? 'Alerts resumed' : 'Alerts paused',
        message: tracker.product.brand,
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
      addToast({ type: 'info', title: 'Removed', message: 'Tracker deleted from radar.' });
      setItemToDelete(null);
    } catch {
      addToast({ type: 'error', message: 'Failed to remove tracker.' });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Tracked products
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {filtered.length} of {trackers.length} product{trackers.length === 1 ? '' : 's'}
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate('/dashboard/add')}
          leftIcon={<Plus className="w-3.5 h-3.5" />}
        >
          Add product
        </Button>
      </div>

      {/* Toolbar */}
      <div className="rounded-[18px] bg-white dark:bg-[#121832] border border-slate-200/80 dark:border-slate-800 p-3 flex flex-col md:flex-row gap-3 md:items-center">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter by name, brand, store…"
            className="w-full h-10 pl-9 pr-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {(['all', 'active', 'paused'] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatus(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize border cursor-pointer transition-colors ${
                status === s
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-transparent text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
            >
              {s}
            </button>
          ))}
          <div className="ml-auto md:ml-1 flex rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <button
              type="button"
              onClick={() => setView('grid')}
              className={`p-2 cursor-pointer ${view === 'grid' ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600' : 'text-slate-400'}`}
              aria-label="Grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setView('table')}
              className={`p-2 cursor-pointer ${view === 'table' ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600' : 'text-slate-400'}`}
              aria-label="Table view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center rounded-[22px] bg-white dark:bg-[#121832] border border-dashed border-slate-300 dark:border-slate-700">
          <p className="text-sm text-slate-500 mb-4">No products match this filter.</p>
          <Button variant="primary" size="sm" onClick={() => navigate('/dashboard/add')}>
            Track a product
          </Button>
        </div>
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((tracker) => {
            const isDrop = tracker.priceChange <= 0;
            return (
              <div
                key={tracker.id}
                className={`rounded-[20px] p-4 bg-white dark:bg-[#121832] border flex flex-col gap-4 ${
                  tracker.active
                    ? 'border-slate-200 dark:border-slate-800 shadow-sm'
                    : 'border-slate-200/70 dark:border-slate-800/70 opacity-75'
                }`}
              >
                <div className="flex items-start gap-3">
                  <Link to={`/dashboard/product/${tracker.id}`} className="flex items-center gap-3 min-w-0 flex-1 group">
                    <div className="w-14 h-14 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-1.5 shrink-0 overflow-hidden">
                      <img src={tracker.product.imageUrl} alt="" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                        {tracker.product.brand}
                      </p>
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                        {tracker.product.title}
                      </h3>
                    </div>
                  </Link>
                  <button
                    type="button"
                    onClick={() => setItemToDelete(tracker)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer"
                    aria-label="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-end justify-between border-t border-slate-100 dark:border-slate-800 pt-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Lowest</p>
                    <p className="font-mono text-xl font-bold tabular-nums text-slate-900 dark:text-white">
                      ${tracker.currentLowestPrice.toFixed(2)}
                    </p>
                    <p className={`text-xs font-bold font-mono inline-flex items-center gap-0.5 ${isDrop ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {isDrop ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
                      {Math.abs(tracker.priceChangePercent)}%
                    </p>
                  </div>
                  <Sparkline data={tracker.sparklineData} isDrop={isDrop} />
                </div>

                <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => handleToggle(tracker)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium border cursor-pointer ${
                      tracker.active
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {tracker.active ? <Bell className="w-3.5 h-3.5" /> : <BellOff className="w-3.5 h-3.5" />}
                    {tracker.active ? 'Active' : 'Paused'}
                  </button>
                  <Link
                    to={`/dashboard/product/${tracker.id}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    <LineChart className="w-3 h-3" />
                    History
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-[20px] overflow-hidden border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#121832] shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[720px]">
              <thead className="bg-slate-50 dark:bg-slate-900/60 text-[11px] uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Product</th>
                  <th className="px-4 py-3 font-semibold">Price</th>
                  <th className="px-4 py-3 font-semibold">Change</th>
                  <th className="px-4 py-3 font-semibold">Store</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((tracker) => {
                  const isDrop = tracker.priceChange <= 0;
                  return (
                    <tr key={tracker.id} className="border-t border-slate-100 dark:border-slate-800/80 hover:bg-slate-50/70 dark:hover:bg-slate-900/40">
                      <td className="px-4 py-3">
                        <Link to={`/dashboard/product/${tracker.id}`} className="flex items-center gap-3 min-w-0 group">
                          <div className="w-10 h-10 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-1 shrink-0 overflow-hidden">
                            <img src={tracker.product.imageUrl} alt="" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-900 dark:text-white truncate max-w-[240px] group-hover:text-indigo-600">
                              {tracker.product.title}
                            </p>
                            <p className="text-[11px] text-slate-500">{tracker.product.brand}</p>
                          </div>
                        </Link>
                      </td>
                      <td className="px-4 py-3 font-mono font-semibold tabular-nums">
                        ${tracker.currentLowestPrice.toFixed(2)}
                      </td>
                      <td className={`px-4 py-3 font-mono text-xs font-bold ${isDrop ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {isDrop ? '↓' : '↑'} {Math.abs(tracker.priceChangePercent)}%
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{tracker.bestStoreName}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            tracker.active
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                              : 'bg-slate-100 text-slate-500 dark:bg-slate-800'
                          }`}
                        >
                          {tracker.active ? 'Active' : 'Paused'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleToggle(tracker)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 cursor-pointer"
                            title="Toggle alerts"
                          >
                            {tracker.active ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
                          </button>
                          <Link
                            to={`/results?url=${encodeURIComponent(tracker.productId)}`}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600"
                            title="Stores"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => setItemToDelete(tracker)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
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
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setItemToDelete(null)}>
              Cancel
            </Button>
            <Button variant="danger" isLoading={deleting} onClick={confirmDelete}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
