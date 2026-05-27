import React from 'react';
import { CurrencyText } from '../ui/CurrencyText';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface GainSectionProps {
  label: string;
  profits: number;
  losses: number;
  net: number;
}

export const GainSection: React.FC<GainSectionProps> = ({
  label,
  profits,
  losses,
  net,
}) => {
  const isLoss = net < 0;

  return (
    <div className="border border-brand-border/40 rounded-lg p-4 bg-slate-900/30 flex flex-col gap-3 select-none">
      <div className="flex justify-between items-center pb-2 border-b border-brand-border/40">
        <span className="text-xs font-bold tracking-wider text-brand-textMuted uppercase">
          {label}
        </span>
        <div className={`flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-full ${
          isLoss 
            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
        }`}>
          {isLoss ? <ArrowDownRight className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
          <span>{isLoss ? 'Net Loss' : 'Net Gain'}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div>
          <span className="block text-[10px] font-semibold text-brand-textMuted uppercase tracking-wider mb-0.5">
            Profits
          </span>
          <CurrencyText value={profits} className="text-xs sm:text-sm text-slate-300 font-medium" />
        </div>
        <div>
          <span className="block text-[10px] font-semibold text-brand-textMuted uppercase tracking-wider mb-0.5">
            Losses
          </span>
          <CurrencyText value={losses} className="text-xs sm:text-sm text-slate-300 font-medium" />
        </div>
        <div>
          <span className="block text-[10px] font-semibold text-brand-textMuted uppercase tracking-wider mb-0.5">
            Net Value
          </span>
          <CurrencyText 
            value={net} 
            colorCoded 
            showSign 
            className="text-xs sm:text-sm font-semibold" 
          />
        </div>
      </div>
    </div>
  );
};
