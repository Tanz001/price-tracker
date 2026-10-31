import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Mail, Check, Sparkles } from 'lucide-react';
import { Button } from '../common/Button';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  onOpenEmailPreview: () => void;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  email,
  onOpenEmailPreview,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const confettiContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // GSAP Confetti Burst without any external library
    const container = confettiContainerRef.current;
    if (!container) return;

    // Clear previous particles
    container.innerHTML = '';
    const colors = ['#4F46E5', '#7C3AED', '#06B6D4', '#10B981', '#F59E0B', '#EC4899'];
    const particleCount = 45;

    for (let i = 0; i < particleCount; i++) {
      const p = document.createElement('div');
      const size = Math.floor(Math.random() * 8) + 6;
      p.style.width = `${size}px`;
      p.style.height = `${Math.random() > 0.5 ? size : size * 1.6}px`;
      p.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      p.style.position = 'absolute';
      p.style.left = '50%';
      p.style.top = '35%';
      p.style.borderRadius = Math.random() > 0.5 ? '2px' : '50%';
      p.style.pointerEvents = 'none';
      container.appendChild(p);

      const angle = Math.random() * Math.PI * 2;
      const velocity = Math.random() * 260 + 80;
      const targetX = Math.cos(angle) * velocity;
      const targetY = Math.sin(angle) * velocity - 40;

      gsap.to(p, {
        x: targetX,
        y: targetY,
        rotation: Math.random() * 720 - 360,
        opacity: 0,
        scale: Math.random() * 0.5 + 0.5,
        duration: Math.random() * 0.8 + 1.0,
        ease: 'power3.out',
        onComplete: () => {
          p.remove();
        },
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Confetti container layer */}
      <div
        ref={confettiContainerRef}
        className="fixed inset-0 pointer-events-none z-50 overflow-hidden"
      />

      {/* Modal Surface */}
      <div
        ref={containerRef}
        className="relative w-full max-w-md rounded-[24px] bg-white dark:bg-[#121832] border border-slate-200 dark:border-slate-800 shadow-2xl p-7 text-center z-10 space-y-6 animate-in zoom-in-95 duration-200"
      >
        {/* Animated Checkmark SVG with stroke drawing */}
        <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-emerald-100 dark:bg-emerald-950/60 animate-ping opacity-25" />
          <svg className="w-20 h-20" viewBox="0 0 52 52">
            <circle
              className="text-emerald-500/20"
              strokeWidth="3"
              stroke="currentColor"
              fill="none"
              cx="26"
              cy="26"
              r="24"
            />
            <path
              className="text-emerald-500 animate-draw-check"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.1 27.2l7.1 7.2 16.7-16.8"
            />
          </svg>
        </div>

        {/* Text Copy */}
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
            You're all set! 🎉
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            We'll email <strong className="text-indigo-600 dark:text-indigo-400 font-semibold">{email}</strong> the second this price changes on any store.
          </p>
        </div>

        {/* Highlight pill */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300 flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
          <span>Active radar: Watching prices across the internet</span>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2.5 pt-2">
          <Button
            variant="outline"
            onClick={() => {
              onClose();
              onOpenEmailPreview();
            }}
            leftIcon={<Mail className="w-4 h-4 text-indigo-500" />}
            className="w-full"
          >
            Preview alert email
          </Button>

          <Button
            variant="primary"
            onClick={onClose}
            className="w-full"
          >
            Got it, thanks!
          </Button>
        </div>
      </div>
    </div>
  );
};
