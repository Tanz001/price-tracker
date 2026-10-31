import React, { useEffect, useState } from 'react';
import {
  Bell,
  Mail,
  Moon,
  Newspaper,
  Package,
  Sparkles,
  Target,
  TrendingDown,
  Save,
} from 'lucide-react';
import { NotificationSettings } from '../types';
import { getNotificationSettings, saveNotificationSettings } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';
import { useToast } from '../context/ToastContext';

interface ToggleRowProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  checked: boolean;
  onChange: (next: boolean) => void;
}

const ToggleRow: React.FC<ToggleRowProps> = ({ icon, title, description, checked, onChange }) => (
  <div className="flex items-start justify-between gap-4 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40">
    <div className="flex items-start gap-3 min-w-0">
      <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{title}</h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{description}</p>
      </div>
    </div>
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors shrink-0 cursor-pointer ${
        checked ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  </div>
);

export const NotificationsPage: React.FC = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [settings, setSettings] = useState<NotificationSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewSent, setPreviewSent] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!user) return;
      setLoading(true);
      try {
        const data = await getNotificationSettings(user.email);
        if (alive) setSettings(data);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [user]);

  const update = <K extends keyof NotificationSettings>(key: K, value: NotificationSettings[K]) => {
    setSettings((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      await saveNotificationSettings(settings);
      addToast({
        type: 'success',
        title: 'Preferences saved',
        message: 'Email notification settings updated.',
      });
    } catch {
      addToast({ type: 'error', message: 'Could not save notification settings.' });
    } finally {
      setSaving(false);
    }
  };

  const sendPreview = () => {
    setPreviewSent(true);
    addToast({
      type: 'info',
      title: 'Preview queued',
      message: `A sample alert would be sent to ${user?.email} (frontend mock).`,
    });
    setTimeout(() => setPreviewSent(false), 2500);
  };

  if (loading || !settings) {
    return (
      <div className="py-24 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-[860px] space-y-6">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/50">
          <Mail className="w-3.5 h-3.5" />
          Email notifications
        </div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Alert preferences
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Control what lands in your inbox for{' '}
          <span className="font-semibold text-slate-700 dark:text-slate-200">{user?.email}</span>.
        </p>
      </div>

      {/* Sample email preview card */}
      <div className="rounded-[24px] overflow-hidden border border-slate-200 dark:border-slate-800 shadow-radar bg-white dark:bg-[#121832]">
        <div className="bg-radar-gradient px-5 py-4 text-white flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            <span className="text-sm font-semibold">Sample price-drop email</span>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={sendPreview}
            isLoading={previewSent}
            className="bg-white/95 text-slate-900 hover:bg-white"
          >
            {previewSent ? 'Queued' : 'Send preview'}
          </Button>
        </div>
        <div className="p-5 sm:p-6 space-y-3">
          <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Subject</p>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">
            📉 Price drop: Sony WH-1000XM5 now $328.00 from a top source
          </p>
          <div className="rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Hi {user?.name.split(' ')[0]}, the product you’re tracking dropped{' '}
            <span className="font-semibold text-emerald-600">18%</span> since you started watching.
            Lowest offer is <span className="font-mono font-bold">$328.00</span> with free 2-day shipping.
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <ToggleRow
          icon={<TrendingDown className="w-4 h-4" />}
          title="Price drop alerts"
          description="Email when any tracked product falls below its previous lowest."
          checked={settings.priceDrops}
          onChange={(v) => update('priceDrops', v)}
        />
        <ToggleRow
          icon={<Target className="w-4 h-4" />}
          title="Target price reached"
          description="Notify when a product hits the custom budget you set."
          checked={settings.targetReached}
          onChange={(v) => update('targetReached', v)}
        />
        <ToggleRow
          icon={<Newspaper className="w-4 h-4" />}
          title="Weekly digest"
          description="A Sunday summary of savings opportunities across your radar."
          checked={settings.weeklyDigest}
          onChange={(v) => update('weeklyDigest', v)}
        />
        <ToggleRow
          icon={<Package className="w-4 h-4" />}
          title="Back-in-stock alerts"
          description="Get notified when an out-of-stock item returns at a tracked store."
          checked={settings.stockAlerts}
          onChange={(v) => update('stockAlerts', v)}
        />
        <ToggleRow
          icon={<Sparkles className="w-4 h-4" />}
          title="Product tips & launches"
          description="Occasional ProductRadar tips. Easy to turn off."
          checked={settings.marketing}
          onChange={(v) => update('marketing', v)}
        />
      </div>

      <div className="rounded-[20px] bg-white dark:bg-[#121832] border border-slate-200 dark:border-slate-800 shadow-sm p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center">
              <Moon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Quiet hours</h3>
              <p className="text-xs text-slate-500">Pause non-critical emails overnight</p>
            </div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={settings.quietHoursEnabled}
            onClick={() => update('quietHoursEnabled', !settings.quietHoursEnabled)}
            className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${
              settings.quietHoursEnabled ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                settings.quietHoursEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {settings.quietHoursEnabled && (
          <div className="grid grid-cols-2 gap-3 animate-in fade-in">
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">From</label>
              <input
                type="time"
                value={settings.quietHoursStart}
                onChange={(e) => update('quietHoursStart', e.target.value)}
                className="mt-1.5 w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Until</label>
              <input
                type="time"
                value={settings.quietHoursEnd}
                onChange={(e) => update('quietHoursEnd', e.target.value)}
                className="mt-1.5 w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm"
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
        <Button variant="primary" isLoading={saving} onClick={handleSave} leftIcon={<Save className="w-4 h-4" />}>
          Save preferences
        </Button>
      </div>
    </div>
  );
};
