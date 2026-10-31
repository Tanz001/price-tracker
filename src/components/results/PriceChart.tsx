import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { PricePoint, PriceRange } from '../../types';
import { getPriceHistory } from '../../services/api';
import { useTheme } from '../../hooks/useTheme';
import { TrendingDown, Calendar, Eye, EyeOff } from 'lucide-react';

interface PriceChartProps {
  productId: string;
}

const STORE_COLORS: Record<string, { label: string; stroke: string }> = {
  amazon: { label: 'Amazon', stroke: '#F59E0B' },
  walmart: { label: 'Walmart', stroke: '#0284C7' },
  bestbuy: { label: 'Best Buy', stroke: '#2563EB' },
  ebay: { label: 'eBay', stroke: '#E11D48' },
};

export const PriceChart: React.FC<PriceChartProps> = ({ productId }) => {
  const { theme } = useTheme();
  const [range, setRange] = useState<PriceRange>('30D');
  const [data, setData] = useState<PricePoint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [visibleStores, setVisibleStores] = useState<Record<string, boolean>>({
    amazon: true,
    walmart: true,
    bestbuy: false,
    ebay: false,
  });

  useEffect(() => {
    let isCurrent = true;
    setLoading(true);
    getPriceHistory(productId, range).then((points) => {
      if (isCurrent) {
        setData(points);
        setLoading(false);
      }
    });
    return () => {
      isCurrent = false;
    };
  }, [productId, range]);

  const toggleStore = (storeKey: string) => {
    setVisibleStores((prev) => ({
      ...prev,
      [storeKey]: !prev[storeKey],
    }));
  };

  const isDark = theme === 'dark';
  const gridColor = isDark ? '#1F2748' : '#F1F5F9';
  const axisColor = isDark ? '#64748B' : '#94A3B8';

  // Compute stats for range
  const lowestInPeriod = data.length > 0 ? Math.min(...data.map((d) => d.lowest)) : 0;
  const startPrice = data.length > 0 ? data[0].lowest : 0;
  const currentPrice = data.length > 0 ? data[data.length - 1].lowest : 0;
  const priceChange = currentPrice - startPrice;
  const percentChange = startPrice > 0 ? ((priceChange / startPrice) * 100).toFixed(1) : '0';

  return (
    <div className="bg-white dark:bg-[#121832] rounded-[20px] p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Price History & Trends
            </h3>
            {priceChange < 0 && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                <TrendingDown className="w-3.5 h-3.5" />
                <span>{percentChange}% in {range}</span>
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Lowest in this period: <span className="font-mono font-semibold text-slate-800 dark:text-slate-200 tabular-nums">${lowestInPeriod.toFixed(2)}</span>
          </p>
        </div>

        {/* Range Selector Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl shrink-0 self-start sm:self-auto">
          {(['7D', '30D', '90D', '1Y'] as PriceRange[]).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                range === r
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Store Lines Legend Filter Bar */}
      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800/60 text-xs">
        <span className="text-slate-500 dark:text-slate-400 font-medium mr-1 flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5" />
          <span>Toggle stores:</span>
        </span>
        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/50">
          <span className="w-2.5 h-2.5 rounded-full bg-[#4F46E5]" />
          <span className="font-semibold">Lowest Market</span>
        </div>
        {Object.entries(STORE_COLORS).map(([key, config]) => {
          const isVisible = visibleStores[key];
          return (
            <button
              key={key}
              onClick={() => toggleStore(key)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs transition-colors cursor-pointer border ${
                isVisible
                  ? 'bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                  : 'bg-transparent text-slate-400 dark:text-slate-600 border-transparent hover:text-slate-600'
              }`}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: isVisible ? config.stroke : '#94A3B8' }}
              />
              <span>{config.label}</span>
              {isVisible ? (
                <Eye className="w-3 h-3 text-slate-400" />
              ) : (
                <EyeOff className="w-3 h-3 text-slate-400" />
              )}
            </button>
          );
        })}
      </div>

      {/* Recharts Area Chart */}
      <div className="h-[280px] w-full pt-2">
        {loading ? (
          <div className="h-full flex items-center justify-center text-xs text-slate-400">
            Updating chart data...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="lowestGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
              <XAxis
                dataKey="date"
                tick={{ fill: axisColor, fontSize: 11 }}
                axisLine={{ stroke: gridColor }}
                tickLine={false}
              />
              <YAxis
                domain={['dataMin - 15', 'dataMax + 15']}
                tick={{ fill: axisColor, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(val) => `$${val}`}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white dark:bg-[#0B1020] border border-slate-200 dark:border-slate-800 p-3 rounded-xl shadow-xl text-xs space-y-1.5 min-w-[150px]">
                        <p className="font-semibold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-1">
                          {label}
                        </p>
                        {payload.map((item, index) => (
                          <div key={index} className="flex items-center justify-between gap-4">
                            <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                              <span
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: item.color }}
                              />
                              <span>{item.name}:</span>
                            </span>
                            <span className="font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                              ${Number(item.value).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              {/* Lowest Market Area */}
              <Area
                type="monotone"
                dataKey="lowest"
                name="Lowest Price"
                stroke="#4F46E5"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#lowestGradient)"
              />
              {/* Optional individual store lines */}
              {visibleStores.amazon && (
                <Line
                  type="monotone"
                  dataKey="amazon"
                  name="Amazon"
                  stroke={STORE_COLORS.amazon.stroke}
                  strokeWidth={1.5}
                  dot={false}
                  strokeDasharray="4 2"
                />
              )}
              {visibleStores.walmart && (
                <Line
                  type="monotone"
                  dataKey="walmart"
                  name="Walmart"
                  stroke={STORE_COLORS.walmart.stroke}
                  strokeWidth={1.5}
                  dot={false}
                />
              )}
              {visibleStores.bestbuy && (
                <Line
                  type="monotone"
                  dataKey="bestbuy"
                  name="Best Buy"
                  stroke={STORE_COLORS.bestbuy.stroke}
                  strokeWidth={1.5}
                  dot={false}
                />
              )}
              {visibleStores.ebay && (
                <Line
                  type="monotone"
                  dataKey="ebay"
                  name="eBay"
                  stroke={STORE_COLORS.ebay.stroke}
                  strokeWidth={1.5}
                  dot={false}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
