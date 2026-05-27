import React from 'react';
import { ArrowRight, ArrowDown } from 'lucide-react';
import { CurrencyText } from '../ui/CurrencyText';

interface DeltaIndicatorProps {
  difference: number;
}

export const DeltaIndicator: React.FC<DeltaIndicatorProps> = ({ difference }) => {
  const hasSavings = difference > 0;

  return (
    <div className="flex xl:flex-col justify-center items-center gap-2 py-2 xl:py-0 select-none">
      {/* Horizontal connector on desktop, vertical on mobile */}
      <div className="flex xl:hidden items-center justify-center w-8 h-8 rounded-full bg-slate-900 border border-brand-border text-brand-textMuted shadow-md">
        <ArrowDown className="w-4 h-4 animate-bounce" />
      </div>

      <div className="hidden xl:flex flex-col items-center gap-1.5 py-8">
        <div className="w-12 h-12 rounded-full bg-slate-900 border border-brand-border flex items-center justify-center text-brand-textMuted shadow-md glow-border">
          <ArrowRight className="w-5 h-5 text-indigo-400" />
        </div>
        
        {hasSavings && (
          <div className="absolute transform translate-y-16 flex flex-col items-center bg-indigo-500/10 border border-brand-accent/35 rounded-lg px-2.5 py-1 backdrop-blur-md shadow-glow">
            <span className="text-[9px] font-extrabold uppercase tracking-widest text-indigo-300">
              Tax Saved
            </span>
            <CurrencyText 
              value={difference} 
              className="text-xs font-bold text-emerald-400" 
              decimals={0} 
            />
          </div>
        )}
      </div>
    </div>
  );
};
