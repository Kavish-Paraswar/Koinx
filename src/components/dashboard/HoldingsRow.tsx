import React, { useState, useEffect } from 'react';
import { Checkbox } from '../ui/Checkbox';
import { CurrencyText } from '../ui/CurrencyText';
import type { Holding } from '../../types';
import { Tooltip } from '../ui/Tooltip';
import { Info } from 'lucide-react';

interface HoldingsRowProps {
  holding: Holding;
  isSelected: boolean;
  amountToSell: number;
  onSelectToggle: (id: string) => void;
  onAmountChange: (id: string, amount: number) => void;
}

export const HoldingsRow: React.FC<HoldingsRowProps> = React.memo(({
  holding,
  isSelected,
  amountToSell,
  onSelectToggle,
  onAmountChange,
}) => {
  // Local state for the input field to prevent typing lag
  const [localAmount, setLocalAmount] = useState(String(amountToSell));

  // Sync local amount when store changes selections (e.g. select all/deselect all)
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
      // Clamping is handled in the store, so we send the parsed value
      onAmountChange(holding.id, parsed);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    }
  };

  const stcgLoss = holding.stcgGain < 0;
  const ltcgLoss = holding.ltcgGain < 0;

  return (
    <tr 
      className={`border-b border-brand-border/40 hover:bg-slate-900/40 transition-colors select-none ${
        isSelected ? 'bg-indigo-500/5' : ''
      }`}
    >
      {/* Checkbox Column */}
      <td className="py-4 pl-4 sm:pl-6 pr-2">
        <Checkbox 
          checked={isSelected} 
          onChange={() => onSelectToggle(holding.id)} 
        />
      </td>

      {/* Asset Metadata Column */}
      <td className="py-4 px-3">
        <div className="flex items-center gap-3">
          {holding.coin.logoUrl ? (
            <img 
              src={holding.coin.logoUrl} 
              alt={holding.coin.name} 
              className="w-7 h-7 rounded-full object-cover border border-slate-800 bg-slate-900"
              onError={(e) => {
                // Remove broken image and let fallback letters render
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : null}
          <div className="flex flex-col">
            <span className="text-sm font-bold text-brand-text leading-tight uppercase">
              {holding.coin.symbol}
            </span>
            <span className="text-[10px] text-brand-textMuted font-semibold truncate max-w-[100px]">
              {holding.coin.name}
            </span>
          </div>
        </div>
      </td>

      {/* Avg Buy Price Column */}
      <td className="py-4 px-3 text-right">
        <div className="flex flex-col items-end">
          <CurrencyText value={holding.avgBuyPrice} className="text-sm text-slate-200 font-semibold" />
          <span className="text-[10px] text-brand-textMuted font-medium">
            Qty: {holding.holdingQuantity}
          </span>
        </div>
      </td>

      {/* Current Price Column */}
      <td className="py-4 px-3 text-right">
        <CurrencyText value={holding.currentPrice} className="text-sm text-slate-200 font-semibold" />
      </td>

      {/* STCG Column */}
      <td className="py-4 px-3 text-right">
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1">
            <CurrencyText 
              value={holding.stcgGain} 
              colorCoded 
              showSign={holding.stcgGain !== 0} 
              className="text-xs sm:text-sm font-semibold" 
            />
            {stcgLoss && (
              <Tooltip content="Harvestable Short-Term Loss. Selling this asset offsets STCG profits.">
                <Info className="w-3 h-3 text-indigo-400 cursor-help" />
              </Tooltip>
            )}
          </div>
          <span className="text-[10px] text-brand-textMuted font-medium">
            Val: <CurrencyText value={holding.stcgBalance} prefix="" decimals={0} />
          </span>
        </div>
      </td>

      {/* LTCG Column */}
      <td className="py-4 px-3 text-right">
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1">
            <CurrencyText 
              value={holding.ltcgGain} 
              colorCoded 
              showSign={holding.ltcgGain !== 0} 
              className="text-xs sm:text-sm font-semibold" 
            />
            {ltcgLoss && (
              <Tooltip content="Harvestable Long-Term Loss. Selling this asset offsets LTCG profits.">
                <Info className="w-3 h-3 text-indigo-400 cursor-help" />
              </Tooltip>
            )}
          </div>
          <span className="text-[10px] text-brand-textMuted font-medium">
            Val: <CurrencyText value={holding.ltcgBalance} prefix="" decimals={0} />
          </span>
        </div>
      </td>

      {/* Amount to Sell Column */}
      <td className="py-4 pl-3 pr-4 sm:pr-6 text-right">
        <div className="flex justify-end items-center">
          <div className="relative max-w-[120px]">
            <input
              type="number"
              disabled={!isSelected}
              value={localAmount}
              onChange={handleInputChange}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              className={`w-full px-2.5 py-1 text-right text-xs font-bold bg-slate-900 border rounded-lg transition-all focus:outline-none focus:ring-1 ${
                !isSelected 
                  ? 'opacity-40 border-slate-800 text-brand-textMuted cursor-not-allowed' 
                  : 'border-brand-border text-brand-text hover:border-slate-700 focus:border-brand-accent focus:ring-brand-accent/50'
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
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[9px] font-extrabold text-indigo-400 hover:text-indigo-300 uppercase select-none"
                title="Populate 100% quantity"
              >
                Max
              </button>
            )}
          </div>
        </div>
      </td>
    </tr>
  );
});

HoldingsRow.displayName = 'HoldingsRow';
