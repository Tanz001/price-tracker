import React, { forwardRef, useEffect, useRef } from 'react';
import gsap from 'gsap';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightElement?: React.ReactNode;
  triggerShake?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightElement,
      triggerShake,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const inputId = id || (label ? `input_${label.toLowerCase().replace(/\s+/g, '_')}` : undefined);

    useEffect(() => {
      if (triggerShake && containerRef.current) {
        gsap.fromTo(
          containerRef.current,
          { x: 0 },
          {
            x: 8,
            duration: 0.08,
            repeat: 5,
            yoyo: true,
            ease: 'power2.out',
            onComplete: () => {
              gsap.set(containerRef.current, { x: 0 });
            },
          }
        );
      }
    }, [triggerShake]);

    return (
      <div ref={containerRef} className="w-full flex flex-col gap-1.5 text-left">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center w-full">
          {leftIcon && (
            <div className="absolute left-3.5 text-slate-400 dark:text-slate-500 pointer-events-none flex items-center justify-center">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-help` : undefined}
            className={`w-full h-12 rounded-[14px] bg-white dark:bg-[#121832] border text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm md:text-base font-normal transition-all duration-200 ${
              leftIcon ? 'pl-11' : 'pl-4'
            } ${rightElement ? 'pr-24 md:pr-28' : 'pr-4'} ${
              error
                ? 'border-rose-500 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                : 'border-slate-200 dark:border-slate-800 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/15'
            } ${className}`}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-2 flex items-center gap-1.5">
              {rightElement}
            </div>
          )}
        </div>
        {error ? (
          <p id={`${inputId}-error`} className="text-xs font-medium text-rose-500 dark:text-rose-400 flex items-center gap-1 mt-0.5">
            {error}
          </p>
        ) : helperText ? (
          <p id={`${inputId}-help`} className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
