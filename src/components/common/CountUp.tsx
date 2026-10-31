import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface CountUpProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}

export const CountUp: React.FC<CountUpProps> = ({
  value,
  duration = 1.2,
  prefix = '$',
  suffix = '',
  decimals = 2,
  className = '',
}) => {
  const [displayValue, setDisplayValue] = useState<number>(0);
  const numberRef = useRef<{ val: number }>({ val: 0 });

  useEffect(() => {
    // Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setDisplayValue(value);
      numberRef.current.val = value;
      return;
    }

    const tween = gsap.to(numberRef.current, {
      val: value,
      duration,
      ease: 'power2.out',
      onUpdate: () => {
        setDisplayValue(numberRef.current.val);
      },
    });

    return () => {
      tween.kill();
    };
  }, [value, duration]);

  const formatted = displayValue.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span className={`font-mono tabular-nums tracking-tight ${className}`}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
};
