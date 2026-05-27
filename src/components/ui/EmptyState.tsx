import React from 'react';
import { HelpCircle } from 'lucide-react';
import { clsx } from 'clsx';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  action,
  className = '',
}) => {
  return (
    <div
      className={clsx(
        'flex flex-col items-center justify-center p-8 text-center glass-panel min-h-[300px]',
        className
      )}
    >
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-slate-800 text-brand-textMuted mb-4 border border-brand-border/60">
        {icon || <HelpCircle className="w-6 h-6 stroke-[1.5]" />}
      </div>
      <h3 className="text-base font-semibold text-brand-text mb-1 tracking-tight">{title}</h3>
      <p className="text-sm text-brand-textMuted max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {action && <div className="flex items-center justify-center">{action}</div>}
    </div>
  );
};
