import type { HarvestStore } from './useHarvestStore';
import { calculateHarvestImpact } from '../utils/calculations';
import type { HarvestResult } from '../types';

/**
 * Computes pre/post harvest gains and tax savings from store state.
 */
export const selectHarvestResult = (state: HarvestStore): HarvestResult => {
  return calculateHarvestImpact(
    state.preHarvestGains,
    state.holdings,
    state.selections
  );
};

/**
 * Returns the count of currently selected holdings.
 */
export const selectTotalSelectedCount = (state: HarvestStore): number => {
  return Object.values(state.selections).filter((s) => s.isSelected).length;
};

/**
 * Checks if all holdings are currently selected.
 */
export const selectIsAllSelected = (state: HarvestStore): boolean => {
  if (state.holdings.length === 0) return false;
  return state.holdings.every((h) => state.selections[h.id]?.isSelected);
};

/**
 * Returns a list of holding IDs that are selected.
 */
export const selectSelectedIds = (state: HarvestStore): string[] => {
  return Object.entries(state.selections)
    .filter(([_, value]) => value.isSelected)
    .map(([id]) => id);
};

/**
 * Aggregates summary metadata of selected assets (e.g. total value, net harvested gain).
 */
export interface SelectedSummary {
  ids: string[];
  count: number;
  totalMarketValue: number;
  harvestedGainsSTCG: number;
  harvestedGainsLTCG: number;
}

export const selectSelectedSummary = (state: HarvestStore): SelectedSummary => {
  const selectedSummary: SelectedSummary = {
    ids: [],
    count: 0,
    totalMarketValue: 0,
    harvestedGainsSTCG: 0,
    harvestedGainsLTCG: 0,
  };

  state.holdings.forEach((h) => {
    const selection = state.selections[h.id];
    if (selection && selection.isSelected) {
      selectedSummary.ids.push(h.id);
      selectedSummary.count += 1;

      // Scale value proportionally by sell amount
      const sellAmount = selection.amountToSell;
      const totalAmount = h.holdingQuantity;
      const proportion = totalAmount > 0 ? Math.min(sellAmount / totalAmount, 1) : 0;

      // Proportional market value of positions to be sold
      const positionValue = h.holdingQuantity * h.currentPrice;
      selectedSummary.totalMarketValue += positionValue * proportion;

      // Proportional gains harvested
      selectedSummary.harvestedGainsSTCG += h.stcgGain * proportion;
      selectedSummary.harvestedGainsLTCG += h.ltcgGain * proportion;
    }
  });

  return selectedSummary;
};
