import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Bell,
  Package,
  Plus,
  Target,
  TrendingDown,
  Wallet,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useTrackers } from '../../hooks/useTrackers';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../hooks/useTheme';
import { Button } from '../../components/common/Button';

const MiniSpark: React.FC<{ data: number[]; positive: boolean }> = ({ data, positive }) => {
  if (data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 88;
  const h = 28;
  const pts = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / range) * (h - 4) - 2;
      return `${x},${y}`;
    })
    .join(' ');
  return (
    <svg width={w} height={h}>
      <polyline
        fill="none"
        stroke={positive ? '#10B981' : '#F43F5E'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={pts}
      />
    </svg>
  );
};

export const OverviewPage: React.FC = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const { trackers, loading } = useTrackers();
  const isDark = theme === 'dark';

  const stats = useMemo(() => {
    const active = trackers.filter((t) => t.active).length;
    const withTarget = trackers.filter((t) => t.mode === 'target').length;
    const saved = trackers.reduce((sum, t) => sum + Math.max(0, -t.priceChange), 0);
    const avgDrop =
      trackers.length === 0
        ? 0
        : trackers.reduce((sum, t) => sum + Math.abs(Math.min(0, t.priceChangePercent)), 0) /
          trackers.length;
    return { active, withTarget, saved, avgDrop, total: trackers.length };
  }, [trackers]);

  const chartData = useMemo(() => {
    // Aggregate sparkline averages into a mock weekly savings curve
    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return labels.map((day, i) => {
      const base = stats.saved * (0.45 + i * 0.08);
      const noise = Math.sin(i * 1.4) * (stats.saved * 0.04);
      return {
        day,
        savings: Math.round((base + noise) * 100) / 100,
        tracked: Math.max(1, Math.round(stats.total * (0.6 + i * 0.05))),
      };
    });
  }, [stats.saved, stats.total]);

  const recent = trackers.slice(0, 4);

  if (loading) {
    return (
      <div className="py-24 flex justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero strip */}
      <div className="rounded-[24px] bg-radar-gradient p-6 sm:p-8 text-white relative overflow-hidden shadow-xl shadow-indigo-500/20">
        <div className="absolute -right-10 -top-10 w-56 h-56 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute right-20 bottom-0 w-40 h-40 rounded-full bg-cyan-300/20 blur-2xl" />
        <div className="relative flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <p className="text-indigo-100 text-xs font-semibold uppercase tracking-wider">
              Good to see you
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {user?.name.split(' ')[0]}, your radar is live
            </h2>
            <p className="text-sm text-indigo-100/90 leading-relaxed">
              {stats.active} active product{stats.active === 1 ? '' : 's'} · estimated savings so far{' '}
              <span className="font-mono font-bold text-white">${stats.saved.toFixed(2)}</span>
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/dashboard/add">
              <Button
                variant="secondary"
                className="bg-white text-slate-900 hover:bg-slate-100"
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Add product
              </Button>
            </Link>
            <Link to="/dashboard/products">
              <Button
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 hover:text-white"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                View all
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        {[
          {
            label: 'Tracked',
            value: String(stats.total),
            hint: 'Products on radar',
            icon: Package,
            tone: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50',
          },
          {
            label: 'Active alerts',
            value: String(stats.active),
            hint: 'Currently notifying',
            icon: Bell,
            tone: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40',
          },
          {
            label: 'Est. saved',
            value: `$${stats.saved.toFixed(0)}`,
            hint: 'Vs first tracked price',
            icon: Wallet,
            tone: 'text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/40',
          },
          {
            label: 'Avg drop',
            value: `${stats.avgDrop.toFixed(1)}%`,
            hint: `${stats.withTarget} with targets`,
            icon: TrendingDown,
            tone: 'text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/40',
          },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="rounded-[20px] bg-white dark:bg-[#121832] border border-slate-200/80 dark:border-slate-800 p-4 sm:p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{card.label}</p>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${card.tone}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-bold font-mono tabular-nums tracking-tight text-slate-900 dark:text-white">
                {card.value}
              </p>
              <p className="text-xs text-slate-500 mt-1">{card.hint}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4 sm:gap-6">
        {/* Chart */}
        <div className="xl:col-span-3 rounded-[22px] bg-white dark:bg-[#121832] border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">Savings trajectory</h3>
              <p className="text-xs text-slate-500 mt-0.5">Cumulative value unlocked this week</p>
            </div>
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
              +{stats.avgDrop.toFixed(0)}% avg
            </span>
          </div>
          <div className="h-56 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="savingsFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4F46E5" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#4F46E5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={isDark ? '#1F2748' : '#EEF2FF'} vertical={false} />
                <XAxis dataKey="day" tick={{ fill: isDark ? '#64748B' : '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: isDark ? '#64748B' : '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} width={36} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: isDark ? '1px solid #1F2748' : '1px solid #E2E8F0',
                    background: isDark ? '#121832' : '#fff',
                    fontSize: 12,
                  }}
                  formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Savings']}
                />
                <Area type="monotone" dataKey="savings" stroke="#4F46E5" strokeWidth={2.5} fill="url(#savingsFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Activity / quick list */}
        <div className="xl:col-span-2 rounded-[22px] bg-white dark:bg-[#121832] border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">Watching now</h3>
              <p className="text-xs text-slate-500 mt-0.5">Latest tracked items</p>
            </div>
            <Link to="/dashboard/products" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
              See all
            </Link>
          </div>

          <div className="space-y-3 flex-1">
            {recent.length === 0 ? (
              <div className="py-10 text-center text-sm text-slate-500">No products yet.</div>
            ) : (
              recent.map((t) => {
                const drop = t.priceChange <= 0;
                return (
                  <Link
                    key={t.id}
                    to={`/dashboard/product/${t.id}`}
                    className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-colors group"
                  >
                    <div className="w-11 h-11 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-1.5 shrink-0 overflow-hidden">
                      <img src={t.product.imageUrl} alt="" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                        {t.product.title}
                      </p>
                      <p className="text-[11px] text-slate-500 font-mono tabular-nums">
                        ${t.currentLowestPrice.toFixed(2)} · {t.bestStoreName}
                      </p>
                    </div>
                    <MiniSpark data={t.sparklineData} positive={drop} />
                  </Link>
                );
              })
            )}
          </div>

          <Link
            to="/dashboard/alerts"
            className="mt-4 flex items-center justify-between rounded-2xl border border-slate-200 dark:border-slate-800 px-3.5 py-3 hover:border-indigo-400 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Target className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-900 dark:text-white">Alert preferences</p>
                <p className="text-[11px] text-slate-500">Quiet hours & digests</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </Link>
        </div>
      </div>
    </div>
  );
};
