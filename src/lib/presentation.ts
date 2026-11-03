export const PRESENTATION_STORAGE_KEY = 'priceradar_presentation_session_v1';

export type PresentationRole = 'leader' | 'follower';

export interface PresentationSession {
  role: PresentationRole;
  room: string;
}

export function readPresentationSession(): PresentationSession | null {
  try {
    const raw = sessionStorage.getItem(PRESENTATION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PresentationSession;
    if (parsed?.role !== 'leader' && parsed?.role !== 'follower') return null;
    if (!parsed.room) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writePresentationSession(session: PresentationSession | null) {
  try {
    if (!session) sessionStorage.removeItem(PRESENTATION_STORAGE_KEY);
    else sessionStorage.setItem(PRESENTATION_STORAGE_KEY, JSON.stringify(session));
  } catch {
    // ignore
  }
}

export function isPresentationFlag(value: string | null): boolean {
  return value === '1' || value === 'true';
}

/** Merge presentation params onto any search string / URLSearchParams. */
export function withPresentationParams(
  baseSearch: string,
  session: PresentationSession
): string {
  const next = new URLSearchParams(
    baseSearch.startsWith('?') ? baseSearch.slice(1) : baseSearch
  );
  next.set('present', '1');
  next.set('role', session.role);
  next.set('room', session.room);
  return next.toString();
}

/** Build a same-app path that always keeps presentation query params. */
export function presentationAwareHref(
  pathname: string,
  search: string,
  session: PresentationSession | null
): string {
  if (!session) {
    return search ? `${pathname}${search.startsWith('?') ? search : `?${search}`}` : pathname;
  }
  const q = withPresentationParams(search, session);
  return q ? `${pathname}?${q}` : pathname;
}
