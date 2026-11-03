import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

export type PresentationRole = 'leader' | 'follower';

export interface PresentationState {
  enabled: boolean;
  role: PresentationRole | null;
  room: string;
  connected: boolean;
  lastProgress: number;
  error: string | null;
}

interface SyncPayload {
  progress: number;
  path: string;
  search: string;
  ts: number;
}

function getScrollProgress(): number {
  const el = document.documentElement;
  const max = el.scrollHeight - window.innerHeight;
  if (max <= 0) return 0;
  return Math.min(1, Math.max(0, window.scrollY / max));
}

function applyScrollProgress(progress: number) {
  const el = document.documentElement;
  const max = el.scrollHeight - window.innerHeight;
  const top = Math.max(0, progress) * Math.max(0, max);
  window.scrollTo({ top, behavior: 'auto' });
}

function throttle(fn: () => void, wait: number) {
  let last = 0;
  let timer: ReturnType<typeof setTimeout> | null = null;

  return () => {
    const now = Date.now();
    const remaining = wait - (now - last);

    if (remaining <= 0) {
      last = now;
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      fn();
      return;
    }

    if (timer) return;
    timer = setTimeout(() => {
      last = Date.now();
      timer = null;
      fn();
    }, remaining);
  };
}

function withPresentationParams(baseSearch: string, present: URLSearchParams): string {
  const next = new URLSearchParams(baseSearch);
  for (const key of ['present', 'role', 'room'] as const) {
    const v = present.get(key);
    if (v) next.set(key, v);
  }
  return next.toString();
}

/**
 * Temporary Presentation / Scroll Sync Mode.
 * Enable with: ?present=1&role=leader|follower&room=demo
 */
export function usePresentationSync(): PresentationState {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const enabled = searchParams.get('present') === '1' || searchParams.get('present') === 'true';
  const roleParam = searchParams.get('role');
  const role: PresentationRole | null =
    roleParam === 'leader' || roleParam === 'follower' ? roleParam : enabled ? 'leader' : null;
  const room = (searchParams.get('room') || 'demo').trim() || 'demo';

  const [connected, setConnected] = useState(false);
  const [lastProgress, setLastProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const applyingRemote = useRef(false);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const locationRef = useRef(location);
  const searchParamsRef = useRef(searchParams);
  const navigateRef = useRef(navigate);

  locationRef.current = location;
  searchParamsRef.current = searchParams;
  navigateRef.current = navigate;

  const channelName = useMemo(() => `present:${room}`, [room]);

  useEffect(() => {
    if (!enabled || !role) return;

    if (!isSupabaseConfigured || !supabase) {
      setError('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY');
      setConnected(false);
      return;
    }

    setError(null);
    let cancelled = false;

    const channel = supabase.channel(channelName, {
      config: {
        broadcast: { self: false },
      },
    });
    channelRef.current = channel;

    const publish = throttle(() => {
      if (applyingRemote.current || role !== 'leader') return;
      const loc = locationRef.current;
      const payload: SyncPayload = {
        progress: getScrollProgress(),
        path: loc.pathname,
        search: loc.search,
        ts: Date.now(),
      };
      setLastProgress(payload.progress);
      void channel.send({
        type: 'broadcast',
        event: 'scroll',
        payload,
      }).then((res) => {
        if (res !== 'ok' && res && typeof res === 'object' && 'error' in (res as object)) {
          // ignore transient send errors while connecting
        }
      });
    }, 50);

    if (role === 'follower') {
      channel.on('broadcast', { event: 'scroll' }, ({ payload }) => {
        const data = payload as SyncPayload;
        if (!data || typeof data.progress !== 'number') return;

        applyingRemote.current = true;
        setLastProgress(data.progress);

        const loc = locationRef.current;
        const present = searchParamsRef.current;
        const targetPath = data.path || '/';
        const nextSearch = withPresentationParams(data.search || '', present);
        const nextFull = nextSearch ? `${targetPath}?${nextSearch}` : targetPath;
        const currentFull = `${loc.pathname}${loc.search}`;

        if (targetPath !== loc.pathname || nextFull !== currentFull) {
          if (targetPath !== loc.pathname) {
            navigateRef.current(nextFull, { replace: true });
            requestAnimationFrame(() => {
              applyScrollProgress(data.progress);
              requestAnimationFrame(() => {
                applyingRemote.current = false;
              });
            });
            return;
          }
        }

        applyScrollProgress(data.progress);
        requestAnimationFrame(() => {
          applyingRemote.current = false;
        });
      });
    }

    channel.subscribe((status) => {
      if (cancelled) return;
      if (status === 'SUBSCRIBED') {
        setConnected(true);
        setError(null);
        if (role === 'leader') publish();
      } else if (status === 'CHANNEL_ERROR') {
        setConnected(false);
        setError('Supabase Realtime channel error');
      } else if (status === 'TIMED_OUT') {
        setConnected(false);
        setError('Supabase Realtime timed out');
      }
    });

    if (role === 'leader') {
      const onScroll = () => publish();
      window.addEventListener('scroll', onScroll, { passive: true });
      return () => {
        cancelled = true;
        window.removeEventListener('scroll', onScroll);
        void supabase.removeChannel(channel);
        channelRef.current = null;
        setConnected(false);
      };
    }

    return () => {
      cancelled = true;
      void supabase.removeChannel(channel);
      channelRef.current = null;
      setConnected(false);
    };
  }, [enabled, role, channelName]);

  // Broadcast immediately when leader changes route
  useEffect(() => {
    if (!enabled || role !== 'leader' || !channelRef.current || !connected) return;
    const payload: SyncPayload = {
      progress: getScrollProgress(),
      path: location.pathname,
      search: location.search,
      ts: Date.now(),
    };
    void channelRef.current.send({
      type: 'broadcast',
      event: 'scroll',
      payload,
    });
  }, [enabled, role, connected, location.pathname]);

  return {
    enabled,
    role: enabled ? role : null,
    room,
    connected,
    lastProgress,
    error,
  };
}
