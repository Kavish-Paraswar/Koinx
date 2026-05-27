import React from 'react';
import { Checkbox } from '../ui/Checkbox';

interface HoldingsHeaderProps {
  isAllSelected: boolean;
  onSelectAllChange: (checked: boolean) => void;
  hasItems: boolean;
}

export const HoldingsHeader: React.FC<HoldingsHeaderProps> = ({
  isAllSelected,
  onSelectAllChange,
  hasItems,
}) => {
  return (
    <thead className="bg-slate-900/60 border-b border-brand-border/60 text-[10px] font-bold text-brand-textMuted uppercase tracking-wider select-none">
      <tr>
        {/* Checkbox Header */}
        <th className="py-3.5 pl-4 sm:pl-6 pr-2 text-left w-12">
          <Checkbox 
            checked={isAllSelected} 
            onChange={onSelectAllChange} 
            disabled={!hasItems}
          />
        </th>

        {/* Asset Header */}
        <th className="py-3.5 px-3 text-left">Asset</th>

        {/* Buy Price Header */}
        <th className="py-3.5 px-3 text-right">Holdings Avg Price</th>

        {/* Current Price Header */}
        <th className="py-3.5 px-3 text-right">Current Price</th>

        {/* STCG Header */}
        <th className="py-3.5 px-3 text-right">STCG (Gain / Val)</th>

        {/* LTCG Header */}
        <th className="py-3.5 px-3 text-right">LTCG (Gain / Val)</th>

        {/* Amount to Sell Header */}
        <th className="py-3.5 pl-3 pr-4 sm:pr-6 text-right w-[140px]">Amount to Sell</th>
      </tr>
    </thead>
  );
};
