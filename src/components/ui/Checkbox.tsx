import React, { useId } from 'react';
import { clsx } from 'clsx';
import { Check } from 'lucide-react';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  className?: string;
  indeterminate?: boolean;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  label,
  className = '',
  indeterminate = false,
  disabled = false,
  ...props
}) => {
  const id = useId();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onChange(!checked);
    }
  };

  return (
    <div className={clsx('flex items-center gap-2 select-none', className)}>
      <div
        role="checkbox"
        aria-checked={indeterminate ? 'mixed' : checked}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={handleKeyDown}
        onClick={() => !disabled && onChange(!checked)}
        className={clsx(
          'w-5 h-5 rounded border flex items-center justify-center cursor-pointer transition-all focus:outline-none focus:ring-1 focus:ring-brand-accent/70',
          {
            'bg-brand-accent border-brand-accent shadow-glow text-white': checked && !indeterminate,
            'bg-brand-accent border-brand-accent text-white': indeterminate,
            'bg-slate-900/60 border-slate-700 hover:border-slate-500': !checked && !indeterminate,
            'opacity-50 cursor-not-allowed': disabled,
          }
        )}
      >
        {checked && !indeterminate && <Check className="w-3.5 h-3.5 stroke-[3]" />}
        {indeterminate && <div className="w-2.5 h-0.5 bg-white rounded-sm" />}
      </div>
      
      {/* Hidden native input for form accessibility */}
      <input
        type="checkbox"
        id={id}
        checked={checked}
        disabled={disabled}
        ref={(el) => {
          if (el) {
            el.indeterminate = indeterminate;
          }
        }}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
        {...props}
      />
      
      {label && (
        <label
          htmlFor={id}
          className={clsx('text-sm font-medium cursor-pointer', {
            'text-brand-textMuted': disabled,
            'text-brand-text': !disabled,
          })}
        >
          {label}
        </label>
      )}
    </div>
  );
};
