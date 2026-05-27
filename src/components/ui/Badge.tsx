import React from 'react';
import { clsx } from 'clsx';

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'outline';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className = '',
  variant = 'primary',
}) => {
  const badgeClasses = clsx(
    'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold select-none border tracking-wider uppercase',
    {
      'bg-brand-accent/15 border-brand-accent/35 text-indigo-300': variant === 'primary',
      'bg-slate-800/80 border-slate-700/60 text-slate-300': variant === 'secondary',
      'bg-emerald-500/10 border-emerald-500/30 text-emerald-400': variant === 'success',
      'bg-rose-500/10 border-rose-500/30 text-rose-400': variant === 'danger',
      'bg-amber-500/10 border-amber-500/30 text-amber-400': variant === 'warning',
      'bg-transparent border-slate-700 text-slate-400': variant === 'outline',
    },
    className
  );

  return <span className={badgeClasses}>{children}</span>;
};
