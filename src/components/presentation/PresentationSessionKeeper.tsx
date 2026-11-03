import React, { useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import {
  isPresentationFlag,
  presentationAwareHref,
  readPresentationSession,
  writePresentationSession,
  type PresentationRole,
} from '../../lib/presentation';
import { useAuth } from '../../context/AuthContext';

/**
 * Keeps ?present=&role=&room= across in-app navigations and auto-logs in
 * a demo user so protected dashboard routes work during recording.
 */
export const PresentationSessionKeeper: React.FC = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();

  const presentFlag = isPresentationFlag(searchParams.get('present'));
  const roleParam = searchParams.get('role');
  const role: PresentationRole | null =
    roleParam === 'leader' || roleParam === 'follower' ? roleParam : presentFlag ? 'leader' : null;
  const room = (searchParams.get('room') || 'demo').trim() || 'demo';

  // Persist / clear session from URL
  useEffect(() => {
    if (presentFlag && role) {
      writePresentationSession({ role, room });
    }
  }, [presentFlag, role, room]);

  // If session exists but URL lost present params (e.g. Link to="/dashboard"), restore them
  useEffect(() => {
    const session = readPresentationSession();
    if (!session) return;
    if (isPresentationFlag(searchParams.get('present'))) return;

    const next = presentationAwareHref(location.pathname, location.search, session);
    navigate(next, { replace: true });
  }, [location.pathname, location.search, searchParams, navigate]);

  // Intercept plain <a> / React Router Link clicks that drop presentation params
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const session = readPresentationSession();
      if (!session) return;

      const target = (event.target as HTMLElement | null)?.closest?.('a[href]') as
        | HTMLAnchorElement
        | null;
      if (!target) return;

      const hrefAttr = target.getAttribute('href');
      if (!hrefAttr || hrefAttr.startsWith('#') || hrefAttr.startsWith('mailto:')) return;

      let url: URL;
      try {
        url = new URL(target.href, window.location.origin);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;

      if (
        isPresentationFlag(url.searchParams.get('present')) &&
        url.searchParams.get('role') === session.role &&
        url.searchParams.get('room') === session.room
      ) {
        return;
      }

      event.preventDefault();
      const next = presentationAwareHref(url.pathname, url.search, session);
      navigate(next);
    };

    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [navigate]);

  // Auto demo login so /dashboard works on both devices during presentation
  useEffect(() => {
    if (!presentFlag || isAuthenticated) return;
    let cancelled = false;
    (async () => {
      try {
        await login('shopper@example.com', 'demo1234');
      } catch {
        if (!cancelled) {
          // ignore — RequireAuth may still allow present mode
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [presentFlag, isAuthenticated, login]);

  return null;
};
