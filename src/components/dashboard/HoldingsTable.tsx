import React, { useState, useMemo } from 'react';
import { useHarvestStore } from '../../store/useHarvestStore';
import { selectIsAllSelected } from '../../store/selectors';
import { HoldingsHeader } from './HoldingsHeader';
import { HoldingsRow } from './HoldingsRow';
import { MobileHoldingCard } from './MobileHoldingCard';
import { EmptyState } from '../ui/EmptyState';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Search, Coins } from 'lucide-react';

export const HoldingsTable: React.FC = () => {
  const { 
    holdings, 
    selections, 
    toggleSelection, 
    updateSellAmount, 
    selectAll, 
    resetSelections 
  } = useHarvestStore();

  const isAllSelected = useHarvestStore(selectIsAllSelected);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');

  // Handle checking all toggle
  const handleSelectAllChange = (checked: boolean) => {
    if (checked) {
      selectAll();
    } else {
      resetSelections();
    }
  };

  // Filter positions by search input
  const filteredHoldings = useMemo(() => {
    return holdings.filter(
      (h) =>
        h.coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [holdings, searchQuery]);

  // Sort filtered positions alphabetically by symbol
  const sortedHoldings = useMemo(() => {
    return [...filteredHoldings].sort((a, b) => a.coin.symbol.localeCompare(b.coin.symbol));
  }, [filteredHoldings]);

  const hasHoldings = holdings.length > 0;
  const hasFiltered = sortedHoldings.length > 0;

  return (
    <Card className="flex-1 w-full flex flex-col mb-8 select-none">
      <CardHeader className="flex-col sm:flex-row gap-4 items-start sm:items-center justify-between border-b border-brand-border/60 py-4">
        <div className="flex items-center gap-2">
          <Coins className="w-5 h-5 text-indigo-400" />
          <h2 className="text-sm font-bold text-brand-text tracking-tight uppercase">
            Brokerage Asset Holdings
          </h2>
        </div>
        
        {/* Search Field */}
        <div className="relative w-full sm:max-w-xs">
          <input
            type="text"
            disabled={!hasHoldings}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs font-semibold bg-slate-900 border border-brand-border rounded-lg text-brand-text placeholder-brand-textMuted focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent/50 disabled:opacity-40 transition-all"
            placeholder="Search assets (BTC, ETH...)"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-brand-textMuted" />
        </div>
      </CardHeader>

      <CardContent className="p-0 flex-1 flex flex-col relative">
        {!hasHoldings ? (
          <EmptyState
            title="No Positions Found"
            description="Your brokerage account has no active asset holdings available for tax loss harvesting."
          />
        ) : !hasFiltered ? (
          <EmptyState
            title="No Results Match"
            description="No holding assets match the current search term query."
          />
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto w-full">
              <table className="w-full table-auto border-collapse text-left">
                <HoldingsHeader
                  isAllSelected={isAllSelected}
                  onSelectAllChange={handleSelectAllChange}
                  hasItems={hasFiltered}
                />
                <tbody>
                  {sortedHoldings.map((holding) => {
                    const selection = selections[holding.id] || { isSelected: false, amountToSell: 0 };
                    return (
                      <HoldingsRow
                        key={holding.id}
                        holding={holding}
                        isSelected={selection.isSelected}
                        amountToSell={selection.amountToSell}
                        onSelectToggle={toggleSelection}
                        onAmountChange={updateSellAmount}
                      />
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden flex flex-col gap-3.5 p-4">
              <div className="flex justify-between items-center bg-slate-900/50 border border-brand-border/60 rounded-lg p-2.5 mb-1 text-xs">
                <span className="text-[10px] font-bold text-brand-textMuted uppercase">
                  Batch Operations
                </span>
                <button
                  onClick={() => handleSelectAllChange(!isAllSelected)}
                  className="text-[10.5px] font-bold text-indigo-400 hover:text-indigo-300"
                >
                  {isAllSelected ? 'Deselect All' : 'Select All Positions'}
                </button>
              </div>

              {sortedHoldings.map((holding) => {
                const selection = selections[holding.id] || { isSelected: false, amountToSell: 0 };
                return (
                  <MobileHoldingCard
                    key={holding.id}
                    holding={holding}
                    isSelected={selection.isSelected}
                    amountToSell={selection.amountToSell}
                    onSelectToggle={toggleSelection}
                    onAmountChange={updateSellAmount}
                  />
                );
              })}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
