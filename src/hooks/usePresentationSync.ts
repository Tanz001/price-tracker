import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import {
  isPresentationFlag,
  presentationAwareHref,
  readPresentationSession,
  type PresentationRole,
} from '../lib/presentation';

export type { PresentationRole };

export interface PresentationState {
  enabled: boolean;
  role: PresentationRole | null;
  room: string;
  connected: boolean;
  lastProgress: number;
  error: string | null;
}

interface SyncPayload {
  type?: 'scroll' | 'navigate';
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

function followerHref(path: string, leaderSearch: string): string {
  const session = readPresentationSession() || {
    role: 'follower' as const,
    room: 'demo',
  };
  // Prefer follower's own role/room from session; strip leader role from incoming search
  const cleaned = new URLSearchParams(
    leaderSearch.startsWith('?') ? leaderSearch.slice(1) : leaderSearch
  );
  cleaned.delete('present');
  cleaned.delete('role');
  cleaned.delete('room');
  const rest = cleaned.toString();
  return presentationAwareHref(path || '/', rest ? `?${rest}` : '', {
    ...session,
    role: 'follower',
  });
}

/**
 * Temporary Presentation / Scroll + Navigation Sync Mode.
 * Enable with: ?present=1&role=leader|follower&room=demo
 */
export function usePresentationSync(): PresentationState {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const enabled = isPresentationFlag(searchParams.get('present'));
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
  const navigateRef = useRef(navigate);
  const lastSentPathRef = useRef<string>('');

  locationRef.current = location;
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

    const send = (event: 'scroll' | 'navigate', extra?: Partial<SyncPayload>) => {
      if (applyingRemote.current && role === 'leader') return;
      const loc = locationRef.current;
      const payload: SyncPayload = {
        type: event,
        progress: getScrollProgress(),
        path: loc.pathname,
        search: loc.search,
        ts: Date.now(),
        ...extra,
      };
      setLastProgress(payload.progress);
      void channel.send({
        type: 'broadcast',
        event,
        payload,
      });
    };

    const publishScroll = throttle(() => {
      if (role !== 'leader') return;
      send('scroll');
    }, 50);

    const applyRemotePayload = (data: SyncPayload, forceNavigate: boolean) => {
      if (!data || typeof data.progress !== 'number') return;

      applyingRemote.current = true;
      setLastProgress(data.progress);

      const loc = locationRef.current;
      const targetPath = data.path || '/';
      const nextFull = followerHref(targetPath, data.search || '');
      const pathChanged = targetPath !== loc.pathname;

      if (forceNavigate || pathChanged) {
        if (nextFull !== `${loc.pathname}${loc.search}` || pathChanged) {
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
    };

    if (role === 'follower') {
      channel.on('broadcast', { event: 'scroll' }, ({ payload }) => {
        applyRemotePayload(payload as SyncPayload, false);
      });
      channel.on('broadcast', { event: 'navigate' }, ({ payload }) => {
        applyRemotePayload(payload as SyncPayload, true);
      });
    }

    channel.subscribe((status) => {
      if (cancelled) return;
      if (status === 'SUBSCRIBED') {
        setConnected(true);
        setError(null);
        if (role === 'leader') {
          lastSentPathRef.current = locationRef.current.pathname;
          send('navigate');
        }
      } else if (status === 'CHANNEL_ERROR') {
        setConnected(false);
        setError('Supabase Realtime channel error');
      } else if (status === 'TIMED_OUT') {
        setConnected(false);
        setError('Supabase Realtime timed out');
      }
    });

    if (role === 'leader') {
      const onScroll = () => publishScroll();
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

  // Broadcast navigate whenever leader route changes
  useEffect(() => {
    if (!enabled || role !== 'leader' || !channelRef.current || !connected) return;
    if (applyingRemote.current) return;
    if (lastSentPathRef.current === location.pathname) {
      // still notify search-only changes lightly via scroll payload path
    }
    lastSentPathRef.current = location.pathname;
    const payload: SyncPayload = {
      type: 'navigate',
      progress: getScrollProgress(),
      path: location.pathname,
      search: location.search,
      ts: Date.now(),
    };
    setLastProgress(payload.progress);
    void channelRef.current.send({
      type: 'broadcast',
      event: 'navigate',
      payload,
    });
  }, [enabled, role, connected, location.pathname, location.search]);

  return {
    enabled,
    role: enabled ? role : null,
    room,
    connected,
    lastProgress,
    error,
  };
}
