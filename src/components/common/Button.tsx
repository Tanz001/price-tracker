import React, { useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  magnetic?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  magnetic = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // Optional magnetic effect on primary CTA (max 8px offset)
  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!magnetic || disabled || isLoading) return;
    const btn = btnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    // Dampen to max 8px
    setOffset({
      x: Math.max(-8, Math.min(8, x * 0.15)),
      y: Math.max(-8, Math.min(8, y * 0.15)),
    });
  };

  const handleMouseLeave = () => {
    if (!magnetic) return;
    setOffset({ x: 0, y: 0 });
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs rounded-xl gap-1.5 font-medium',
    md: 'px-5 py-2.5 text-sm rounded-xl gap-2 font-semibold',
    lg: 'px-6 py-3.5 text-base rounded-2xl gap-2.5 font-semibold',
  };

  const variantClasses = {
    primary:
      'bg-radar-gradient text-white shadow-md shadow-indigo-500/25 hover:shadow-lg hover:shadow-indigo-500/35 hover:-translate-y-0.5 active:translate-y-0',
    secondary:
      'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 hover:-translate-y-0.5 active:translate-y-0',
    outline:
      'border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-900/70 text-slate-700 dark:text-slate-200 hover:border-indigo-500 dark:hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:-translate-y-0.5 active:translate-y-0',
    ghost:
      'bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white',
    danger:
      'bg-rose-500 hover:bg-rose-600 text-white shadow-sm shadow-rose-500/20 hover:-translate-y-0.5 active:translate-y-0',
  };

  return (
    <button
      ref={btnRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={
        magnetic && (offset.x !== 0 || offset.y !== 0)
          ? { transform: `translate3d(${offset.x}px, ${offset.y}px, 0)` }
          : undefined
      }
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center whitespace-nowrap shrink-0 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none select-none ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : (
        leftIcon && <span className="shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
};
