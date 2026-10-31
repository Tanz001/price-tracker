import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Filter,
  RefreshCw,
  ServerCrash,
  Shield,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { TrackingFailure } from '../types';
import { getTrackingFailures, retryFailure, updateFailureStatus } from '../services/api';
import { Button } from '../components/common/Button';
import { useToast } from '../context/ToastContext';
import { useTheme } from '../hooks/useTheme';

type StatusFilter = 'all' | TrackingFailure['status'];

export const AdminPage: React.FC = () => {
  const [failures, setFailures] = useState<TrackingFailure[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<StatusFilter>('all');
  const [busyId, setBusyId] = useState<string | null>(null);
  const { addToast } = useToast();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const load = async () => {
    setLoading(true);
    try {
      setFailures(await getTrackingFailures());
    } catch {
      addToast({ type: 'error', message: 'Failed to load tracking failures.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const stats = useMemo(() => {
    const open = failures.filter((f) => f.status === 'open').length;
    const retrying = failures.filter((f) => f.status === 'retrying').length;
    const resolved = failures.filter((f) => f.status === 'resolved').length;
    const high = failures.filter((f) => f.severity === 'high' && f.status !== 'resolved').length;
    return { open, retrying, resolved, high, total: failures.length };
  }, [failures]);

  const storeChart = useMemo(() => {
    const map = new Map<string, number>();
    failures.forEach((f) => {
      if (f.status === 'resolved') return;
      map.set(f.storeName, (map.get(f.storeName) || 0) + 1);
    });
    return Array.from(map.entries())
      .map(([store, count]) => ({ store, count }))
      .sort((a, b) => b.count - a.count);
  }, [failures]);

  const visible = failures.filter((f) => (filter === 'all' ? true : f.status === filter));

  const handleRetry = async (id: string) => {
    setBusyId(id);
    try {
      const updated = await retryFailure(id);
      setFailures((prev) => prev.map((f) => (f.id === id ? updated : f)));
      addToast({ type: 'info', title: 'Retry queued', message: 'Scraper will attempt this URL again.' });
    } catch {
      addToast({ type: 'error', message: 'Retry failed.' });
    } finally {
      setBusyId(null);
    }
  };

  const handleResolve = async (id: string) => {
    setBusyId(id);
    try {
      await updateFailureStatus(id, 'resolved');
      setFailures((prev) => prev.map((f) => (f.id === id ? { ...f, status: 'resolved' } : f)));
      addToast({ type: 'success', message: 'Marked as resolved.' });
    } catch {
      addToast({ type: 'error', message: 'Could not update status.' });
    } finally {
      setBusyId(null);
    }
  };

  const severityStyles = {
    high: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900/50',
    medium:
      'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/50',
    low: 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
  };

  const statusStyles = {
    open: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
    retrying: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    resolved: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  };

  const barColors = ['#4F46E5', '#7C3AED', '#06B6D4', '#F59E0B', '#EF4444', '#10B981'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-slate-900 text-white dark:bg-white dark:text-slate-900">
            <Shield className="w-3.5 h-3.5" />
            Ops console
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Tracking failures
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Scrape errors, retries, and selector breakage across stores.
          </p>
        </div>
        <Button variant="secondary" size="sm" onClick={load} leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: 'Open', value: stats.open, icon: AlertTriangle, tone: 'text-rose-500 bg-rose-50 dark:bg-rose-950/40' },
          { label: 'Retrying', value: stats.retrying, icon: RefreshCw, tone: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40' },
          { label: 'High severity', value: stats.high, icon: ServerCrash, tone: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/40' },
          { label: 'Resolved', value: stats.resolved, icon: CheckCircle2, tone: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40' },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="rounded-[20px] p-4 sm:p-5 bg-white dark:bg-[#121832] border border-slate-200 dark:border-slate-800 shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{card.label}</span>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${card.tone}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">{card.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        <div className="xl:col-span-3 rounded-[22px] bg-white dark:bg-[#121832] border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <div className="mb-4">
            <h3 className="font-bold text-slate-900 dark:text-white">Failures by store</h3>
            <p className="text-xs text-slate-500 mt-0.5">Open + retrying incidents</p>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={storeChart} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid stroke={isDark ? '#1F2748' : '#EEF2FF'} vertical={false} />
                <XAxis dataKey="store" tick={{ fill: isDark ? '#64748B' : '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fill: isDark ? '#64748B' : '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} width={28} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: isDark ? '1px solid #1F2748' : '1px solid #E2E8F0',
                    background: isDark ? '#121832' : '#fff',
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="count" radius={[8, 8, 4, 4]}>
                  {storeChart.map((_, i) => (
                    <Cell key={i} fill={barColors[i % barColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="xl:col-span-2 rounded-[22px] bg-white dark:bg-[#121832] border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3">
          <h3 className="font-bold text-slate-900 dark:text-white">Health snapshot</h3>
          <div className="space-y-2.5">
            {[
              { label: 'Success rate (24h)', value: '96.4%', tone: 'text-emerald-500' },
              { label: 'Avg scrape latency', value: '1.8s', tone: 'text-indigo-500' },
              { label: 'Open critical', value: String(stats.high), tone: 'text-rose-500' },
              { label: 'Queue depth', value: String(stats.open + stats.retrying), tone: 'text-amber-500' },
            ].map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between rounded-xl bg-slate-50 dark:bg-slate-900/50 px-3.5 py-3 border border-slate-100 dark:border-slate-800"
              >
                <span className="text-xs text-slate-500">{row.label}</span>
                <span className={`text-sm font-bold font-mono ${row.tone}`}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-slate-500 inline-flex items-center gap-1.5 mr-1">
          <Filter className="w-3.5 h-3.5" />
          Status
        </span>
        {(['all', 'open', 'retrying', 'resolved'] as StatusFilter[]).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors cursor-pointer capitalize ${
              filter === s
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-16 flex justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
        </div>
      ) : (
        <div className="space-y-3">
          {visible.map((failure) => (
            <div
              key={failure.id}
              className="rounded-[20px] bg-white dark:bg-[#121832] border border-slate-200 dark:border-slate-800 shadow-sm p-4 sm:p-5"
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                <div className="space-y-2 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${severityStyles[failure.severity]}`}>
                      {failure.severity}
                    </span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${statusStyles[failure.status]}`}>
                      {failure.status}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">{failure.errorCode}</span>
                  </div>
                  <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white leading-snug">
                    {failure.productTitle}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{failure.errorMessage}</p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500">
                    <span className="inline-flex items-center gap-1">
                      <Activity className="w-3 h-3" />
                      {failure.storeName}
                    </span>
                    <span>{failure.attempts} attempts</span>
                    <span>Last: {failure.lastAttemptAt}</span>
                    <a
                      href={failure.productUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      Open URL
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {failure.status !== 'resolved' ? (
                    <>
                      <Button
                        variant="secondary"
                        size="sm"
                        isLoading={busyId === failure.id}
                        onClick={() => handleRetry(failure.id)}
                        leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
                      >
                        Retry
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={busyId === failure.id}
                        onClick={() => handleResolve(failure.id)}
                        leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                      >
                        Resolve
                      </Button>
                    </>
                  ) : (
                    <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Cleared
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}

          {visible.length === 0 && (
            <div className="py-16 text-center rounded-[24px] border border-dashed border-slate-300 dark:border-slate-700">
              <p className="text-sm text-slate-500">No failures in this filter.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
