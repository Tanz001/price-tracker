import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Cast, Copy, Radio, X } from 'lucide-react';
import type { PresentationState } from '../../hooks/usePresentationSync';
import { useToast } from '../../context/ToastContext';

interface Props {
  state: PresentationState;
}

export const PresentationBanner: React.FC<Props> = ({ state }) => {
  const { addToast } = useToast();
  const [params] = useSearchParams();

  if (!state.enabled) return null;

  const exitHref = (() => {
    const next = new URLSearchParams(params);
    next.delete('present');
    next.delete('role');
    next.delete('room');
    const q = next.toString();
    return q ? `?${q}` : '/';
  })();

  const siteBase =
    (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/$/, '') ||
    window.location.origin;

  const copyPairLink = async (role: 'leader' | 'follower') => {
    const url = new URL(window.location.pathname + window.location.search, siteBase);
    url.searchParams.set('present', '1');
    url.searchParams.set('role', role);
    url.searchParams.set('room', state.room);
    try {
      await navigator.clipboard.writeText(url.toString());
      addToast({ type: 'success', message: `${role} link copied` });
    } catch {
      addToast({ type: 'info', message: url.toString() });
    }
  };

  return (
    <div className="fixed bottom-3 left-3 right-3 sm:left-auto sm:right-4 sm:bottom-4 z-[60] sm:max-w-md">
      <div className="rounded-2xl border border-indigo-200 dark:border-indigo-900/60 bg-white/95 dark:bg-[#121832]/95 backdrop-blur shadow-xl shadow-indigo-500/15 p-3.5 sm:p-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-radar-gradient text-white flex items-center justify-center shrink-0">
            <Cast className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-bold text-slate-900 dark:text-white">Presentation Mode</p>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  state.connected
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                    : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                }`}
              >
                {state.connected ? 'Live' : 'Connecting'}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300">
                {state.role || '—'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Room <span className="font-mono font-semibold text-slate-700 dark:text-slate-200">{state.room}</span>
              {' · '}
              scroll {(state.lastProgress * 100).toFixed(0)}%
            </p>
            {state.error && (
              <p className="text-[11px] font-medium text-rose-500 leading-relaxed">{state.error}</p>
            )}
            {!state.connected && !state.error && (
              <p className="text-[11px] text-amber-600 dark:text-amber-400">
                Waiting for Supabase Realtime… keep both tabs open on the same room.
              </p>
            )}
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                onClick={() => copyPairLink('leader')}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 cursor-pointer"
              >
                <Copy className="w-3 h-3" />
                Copy leader
              </button>
              <button
                type="button"
                onClick={() => copyPairLink('follower')}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 cursor-pointer"
              >
                <Radio className="w-3 h-3" />
                Copy follower
              </button>
              <Link
                to={exitHref}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
              >
                <X className="w-3 h-3" />
                Exit
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
