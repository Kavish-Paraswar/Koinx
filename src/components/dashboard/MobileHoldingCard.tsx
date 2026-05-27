import React, { useState, useEffect } from 'react';
import { Checkbox } from '../ui/Checkbox';
import { CurrencyText } from '../ui/CurrencyText';
import type { Holding } from '../../types';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface MobileHoldingCardProps {
  holding: Holding;
  isSelected: boolean;
  amountToSell: number;
  onSelectToggle: (id: string) => void;
  onAmountChange: (id: string, amount: number) => void;
}

export const MobileHoldingCard: React.FC<MobileHoldingCardProps> = React.memo(({
  holding,
  isSelected,
  amountToSell,
  onSelectToggle,
  onAmountChange,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [localAmount, setLocalAmount] = useState(String(amountToSell));

  useEffect(() => {
    setLocalAmount(String(amountToSell));
  }, [amountToSell]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalAmount(e.target.value);
  };

  const handleBlur = () => {
    const parsed = parseFloat(localAmount);
    if (isNaN(parsed) || parsed < 0) {
      onAmountChange(holding.id, 0);
      setLocalAmount('0');
    } else {
      onAmountChange(holding.id, parsed);
    }
  };



  return (
    <div 
      className={`border rounded-xl transition-all duration-300 ${
        isSelected 
          ? 'bg-indigo-500/5 border-brand-accent/40 shadow-glow' 
          : 'bg-brand-card/50 border-brand-border/60 hover:border-slate-800'
      }`}
    >
      {/* Top Header Card Info */}
      <div className="p-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <Checkbox 
            checked={isSelected} 
            onChange={() => onSelectToggle(holding.id)} 
          />
          <div className="flex items-center gap-2">
            {holding.coin.logoUrl && (
              <img 
                src={holding.coin.logoUrl} 
                alt={holding.coin.name} 
                className="w-7 h-7 rounded-full object-cover border border-slate-800"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            )}
            <div className="flex flex-col">
              <span className="text-sm font-bold text-brand-text uppercase leading-tight">
                {holding.coin.symbol}
              </span>
              <span className="text-[10px] text-brand-textMuted font-semibold">
                {holding.coin.name}
              </span>
            </div>
          </div>
        </div>

        {/* Quick status displays */}
        <div className="flex items-center gap-4 text-right">
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-brand-textMuted uppercase tracking-wider">
              Total Gain
            </span>
            <CurrencyText 
              value={holding.stcgGain + holding.ltcgGain} 
              colorCoded 
              showSign
              className="text-xs font-bold" 
            />
          </div>

          <button 
            onClick={() => setExpanded(!expanded)}
            className="p-1 rounded-lg bg-slate-900 border border-brand-border text-brand-textMuted hover:text-brand-text transition-colors"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded Details Section */}
      {(expanded || isSelected) && (
        <div className="px-4 pb-4 pt-2 border-t border-brand-border/40 bg-slate-950/20 rounded-b-xl flex flex-col gap-3.5">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="block text-[9px] font-bold text-brand-textMuted uppercase tracking-wider mb-0.5">
                Avg Buy Price
              </span>
              <CurrencyText value={holding.avgBuyPrice} className="text-slate-200 font-semibold" />
              <span className="block text-[9.5px] text-brand-textMuted font-medium">
                Holdings: {holding.holdingQuantity}
              </span>
            </div>

            <div>
              <span className="block text-[9px] font-bold text-brand-textMuted uppercase tracking-wider mb-0.5">
                Current Market Price
              </span>
              <CurrencyText value={holding.currentPrice} className="text-slate-200 font-semibold" />
            </div>

            <div>
              <span className="block text-[9px] font-bold text-brand-textMuted uppercase tracking-wider mb-0.5">
                Short-Term Gain (STCG)
              </span>
              <CurrencyText value={holding.stcgGain} colorCoded showSign className="font-semibold" />
              <span className="block text-[9.5px] text-brand-textMuted font-medium">
                Value: <CurrencyText value={holding.stcgBalance} prefix="" decimals={0} />
              </span>
            </div>

            <div>
              <span className="block text-[9px] font-bold text-brand-textMuted uppercase tracking-wider mb-0.5">
                Long-Term Gain (LTCG)
              </span>
              <CurrencyText value={holding.ltcgGain} colorCoded showSign className="font-semibold" />
              <span className="block text-[9.5px] text-brand-textMuted font-medium">
                Value: <CurrencyText value={holding.ltcgBalance} prefix="" decimals={0} />
              </span>
            </div>
          </div>

          {/* Amount to Sell Input */}
          <div className="flex items-center justify-between gap-3 pt-2.5 border-t border-brand-border/45">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-brand-textMuted uppercase tracking-wider">
                Harvest Quantity
              </span>
              <span className="text-[9.5px] text-brand-textMuted font-semibold">
                Max available: {holding.holdingQuantity}
              </span>
            </div>

            <div className="relative max-w-[140px] flex-1">
              <input
                type="number"
                disabled={!isSelected}
                value={localAmount}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full px-2.5 py-1.5 text-right text-xs font-bold bg-slate-900 border rounded-lg transition-all focus:outline-none focus:ring-1 ${
                  !isSelected 
                    ? 'opacity-40 border-slate-800 text-brand-textMuted cursor-not-allowed' 
                    : 'border-brand-border text-brand-text focus:border-brand-accent focus:ring-brand-accent/50'
                }`}
                placeholder="0.00"
                step="any"
                min="0"
                max={holding.holdingQuantity}
              />
              {isSelected && (
                <button
                  onClick={() => {
                    setLocalAmount(String(holding.holdingQuantity));
                    onAmountChange(holding.id, holding.holdingQuantity);
                  }}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[9px] font-extrabold text-indigo-400 hover:text-indigo-300 uppercase"
                >
                  Max
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

MobileHoldingCard.displayName = 'MobileHoldingCard';
