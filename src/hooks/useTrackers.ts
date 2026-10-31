import { useCallback, useEffect, useState } from 'react';
import { Tracker } from '../types';
import { getTrackers } from '../services/api';
import { useAuth } from '../context/AuthContext';

export function useTrackers() {
  const { user } = useAuth();
  const [trackers, setTrackers] = useState<Tracker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      let list = await getTrackers(user.email);
      if (list.length === 0) {
        const seed = await getTrackers('shopper@example.com');
        list = seed.map((t) => ({ ...t, email: user.email }));
      }
      setTrackers(list);
    } catch {
      setError('Could not load tracked products.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { trackers, setTrackers, loading, error, reload };
}
