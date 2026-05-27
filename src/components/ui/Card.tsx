import React from 'react';
import { clsx } from 'clsx';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'glass' | 'solid' | 'glow';
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'glass',
  hoverable = false,
  ...props
}) => {
  const cardClasses = clsx(
    'rounded-xl border overflow-hidden transition-all duration-300',
    {
      'bg-brand-card/75 border-brand-border/60 backdrop-blur-md shadow-glass': variant === 'glass',
      'bg-brand-card border-brand-border shadow-md': variant === 'solid',
      'bg-brand-card/90 border-brand-accent/30 shadow-glow': variant === 'glow',
      'hover:border-brand-accent/50 hover:shadow-glow hover:translate-y-[-2px]': hoverable,
    },
    className
  );

  return (
    <div className={cardClasses} {...props}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => (
  <div className={clsx('px-6 py-4 border-b border-brand-border/50 flex justify-between items-center', className)} {...props}>
    {children}
  </div>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => (
  <div className={clsx('p-6', className)} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => (
  <div className={clsx('px-6 py-4 border-t border-brand-border/50 bg-slate-900/40', className)} {...props}>
    {children}
  </div>
);
