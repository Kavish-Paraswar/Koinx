import React, { useState } from 'react';
import { clsx } from 'clsx';

interface TooltipProps {
  content: string | React.ReactNode;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  className = '',
}) => {
  const [visible, setVisible] = useState(false);

  const showTooltip = () => setVisible(true);
  const hideTooltip = () => setVisible(false);

  const tooltipClasses = clsx(
    'absolute z-50 px-3 py-2 text-xs font-normal text-slate-200 bg-slate-900 border border-slate-700/85 rounded-lg shadow-xl backdrop-blur-md max-w-xs transition-all duration-200 pointer-events-none whitespace-normal leading-relaxed',
    {
      'opacity-100 scale-100': visible,
      'opacity-0 scale-95': !visible,
      
      // Top positioning
      'bottom-full left-1/2 -translate-x-1/2 mb-2': position === 'top',
      // Bottom positioning
      'top-full left-1/2 -translate-x-1/2 mt-2': position === 'bottom',
      // Left positioning
      'right-full top-1/2 -translate-y-1/2 mr-2': position === 'left',
      // Right positioning
      'left-full top-1/2 -translate-y-1/2 ml-2': position === 'right',
    }
  );

  return (
    <div
      className={clsx('relative inline-flex items-center', className)}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      {visible && (
        <div role="tooltip" className={tooltipClasses}>
          {content}
          
          {/* Tooltip triangle indicator */}
          <div
            className={clsx(
              'absolute w-2 h-2 bg-slate-900 border border-slate-700/85 rotate-45 pointer-events-none',
              {
                'bottom-[-5px] left-1/2 -translate-x-1/2 border-t-0 border-l-0': position === 'top',
                'top-[-5px] left-1/2 -translate-x-1/2 border-b-0 border-r-0': position === 'bottom',
                'right-[-5px] top-1/2 -translate-y-1/2 border-b-0 border-l-0': position === 'left',
                'left-[-5px] top-1/2 -translate-y-1/2 border-t-0 border-r-0': position === 'right',
              }
            )}
          />
        </div>
      )}
    </div>
  );
};
