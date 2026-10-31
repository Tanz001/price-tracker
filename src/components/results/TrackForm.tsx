import React, { useState } from 'react';
import { Mail, Bell, Shield, ArrowRight, DollarSign } from 'lucide-react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { createTracker } from '../../services/api';
import { useToast } from '../../context/ToastContext';

interface TrackFormProps {
  productId: string;
  currentLowestPrice: number;
  onSuccess: (email: string) => void;
  onOpenEmailPreview?: () => void;
}

export const TrackForm: React.FC<TrackFormProps> = ({
  productId,
  currentLowestPrice,
  onSuccess,
  onOpenEmailPreview,
}) => {
  const [email, setEmail] = useState('');
  const [targetPrice, setTargetPrice] = useState(
    Math.floor(currentLowestPrice * 0.95).toString()
  );
  const [mode, setMode] = useState<'any' | 'drop' | 'target'>('drop');
  const [emailError, setEmailError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shakeInput, setShakeInput] = useState(false);
  const { addToast } = useToast();

  const validateEmail = (val: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(val);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEmail(val);
    if (emailError) {
      if (validateEmail(val)) {
        setEmailError('');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      setShakeInput(true);
      setTimeout(() => setShakeInput(false), 500);
      return;
    }

    setEmailError('');
    setIsSubmitting(true);

    try {
      await createTracker({
        email,
        productId,
        mode,
        targetPrice: mode === 'target' ? parseFloat(targetPrice) || undefined : undefined,
      });

      addToast({
        type: 'success',
        title: 'Price alert activated!',
        message: `Radar is now tracking ${email} for any price drops.`,
      });

      onSuccess(email);
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Failed to start tracker',
        message: 'Something went wrong. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#121832] rounded-[20px] p-6 border border-slate-200 dark:border-slate-800 shadow-radar sticky top-24 space-y-5">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Bell className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-lg">
            Track this product
          </h3>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Get notified immediately when prices decrease across any verified store.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <Input
          label="Your email address"
          type="email"
          placeholder="you@domain.com"
          value={email}
          onChange={handleEmailChange}
          error={emailError}
          triggerShake={shakeInput}
          leftIcon={<Mail className="w-4 h-4" />}
          required
        />

        {/* Radio Alert Mode */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Alert frequency
          </label>
          <div className="space-y-2">
            {[
              { id: 'drop', label: 'Price drops only (Recommended)', desc: 'Only when price is lower than today' },
              { id: 'target', label: 'Below target price', desc: 'When price drops under your custom budget' },
              { id: 'any', label: 'Any price change', desc: 'Notify on drops or price increases' },
            ].map((option) => (
              <label
                key={option.id}
                className={`flex items-start gap-3 p-3 rounded-xl border text-xs cursor-pointer transition-colors ${
                  mode === option.id
                    ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 text-slate-900 dark:text-white'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                <input
                  type="radio"
                  name="alert-mode"
                  value={option.id}
                  checked={mode === option.id}
                  onChange={() => setMode(option.id as any)}
                  className="mt-0.5 text-indigo-600 focus:ring-indigo-500"
                />
                <div className="flex-1">
                  <div className="font-semibold text-slate-900 dark:text-slate-200">
                    {option.label}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {option.desc}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Optional Target Price Input */}
        {mode === 'target' && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-150">
            <Input
              label="Target Price Threshold ($)"
              type="number"
              step="1"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              helperText={`Current lowest is $${currentLowestPrice.toFixed(2)}`}
              leftIcon={<DollarSign className="w-4 h-4" />}
            />
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
          magnetic
          className="w-full h-12 text-sm"
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Start tracking
        </Button>

        {onOpenEmailPreview && (
          <button
            type="button"
            onClick={onOpenEmailPreview}
            className="w-full text-center text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline pt-1 cursor-pointer"
          >
            Preview sample alert email ↗
          </button>
        )}

        {/* Privacy trust micro-copy */}
        <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
          <Shield className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          <span>We'll only email you about this product. Unsubscribe anytime.</span>
        </div>
      </form>
    </div>
  );
};
