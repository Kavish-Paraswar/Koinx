import { create } from 'zustand';
import type { DashboardState, HarvestSelection, CapitalGains } from '../types';
import { apiService } from '../services/api';
import { normalizeCapitalGains, normalizeHoldings } from '../utils/normalizers';
import { calculateHarvestImpact } from '../utils/calculations';

interface DashboardActions {
  initializeDashboard: (forceRetry?: boolean) => Promise<void>;
  toggleSelection: (id: string) => void;
  updateSellAmount: (id: string, amount: number) => void;
  selectAll: () => void;
  resetSelections: () => void;
  executeHarvest: () => void; // Commits selected post-harvest values as pre-harvest baselines
  clearError: () => void;
}

export type HarvestStore = DashboardState & DashboardActions;

export const useHarvestStore = create<HarvestStore>((set, get) => ({
  // Raw State
  holdings: [],
  preHarvestGains: {
    stcg: { profits: 0, losses: 0 },
    ltcg: { profits: 0, losses: 0 }
  },
  selections: {},
  loading: false,
  error: null,

  // Actions
  initializeDashboard: async (forceRetry = false) => {
    // If retry is forced, clear simulation error flags
    if (forceRetry) {
      localStorage.removeItem('simulate_api_error');
    }

    set({ loading: true, error: null });
    try {
      // Parallel fetch using Promise.all
      const [gainsDto, holdingsDto] = await Promise.all([
        apiService.fetchCapitalGains(),
        apiService.fetchHoldings(),
      ]);

      const preHarvestGains = normalizeCapitalGains(gainsDto);
      const holdings = normalizeHoldings(holdingsDto);

      // Initialize all selections to not selected and sell amount = 0
      const selections: Record<string, HarvestSelection> = {};
      holdings.forEach((h) => {
        selections[h.id] = {
          isSelected: false,
          amountToSell: 0,
        };
      });

      set({
        preHarvestGains,
        holdings,
        selections,
        loading: false,
        error: null,
      });
    } catch (err: any) {
      set({
        loading: false,
        error: err?.message || 'An error occurred while loading financial data.',
      });
    }
  },

  toggleSelection: (id: string) => {
    const { selections, holdings } = get();
    const current = selections[id];
    if (!current) return;

    const holding = holdings.find((h) => h.id === id);
    if (!holding) return;

    const nextSelected = !current.isSelected;
    
    set({
      selections: {
        ...selections,
        [id]: {
          isSelected: nextSelected,
          // Auto-populate with total quantity when selected, reset to 0 when deselected
          amountToSell: nextSelected ? holding.holdingQuantity : 0,
        },
      },
    });
  },

  updateSellAmount: (id: string, amount: number) => {
    const { selections, holdings } = get();
    const current = selections[id];
    if (!current) return;

    const holding = holdings.find((h) => h.id === id);
    if (!holding) return;

    // Clamp input amount between 0 and total holding quantity
    const validatedAmount = Math.max(0, Math.min(amount, holding.holdingQuantity));

    set({
      selections: {
        ...selections,
        [id]: {
          ...current,
          amountToSell: validatedAmount,
        },
      },
    });
  },

  selectAll: () => {
    const { holdings } = get();
    const nextSelections: Record<string, HarvestSelection> = {};

    holdings.forEach((h) => {
      nextSelections[h.id] = {
        isSelected: true,
        amountToSell: h.holdingQuantity,
      };
    });

    set({ selections: nextSelections });
  },

  resetSelections: () => {
    const { holdings } = get();
    const nextSelections: Record<string, HarvestSelection> = {};

    holdings.forEach((h) => {
      nextSelections[h.id] = {
        isSelected: false,
        amountToSell: 0,
      };
    });

    set({ selections: nextSelections });
  },

  executeHarvest: () => {
    const { holdings, selections, preHarvestGains } = get();
    const result = calculateHarvestImpact(preHarvestGains, holdings, selections);

    // Map postHarvestReport back to preHarvestGains shape
    const nextGains: CapitalGains = {
      stcg: {
        profits: result.postHarvest.stcg.profits,
        losses: result.postHarvest.stcg.losses,
      },
      ltcg: {
        profits: result.postHarvest.ltcg.profits,
        losses: result.postHarvest.ltcg.losses,
      },
    };

    // We also remove sold quantities from holdings!
    // That completes the realistic fintech broker integration simulation.
    const nextHoldings = holdings
      .map((h) => {
        const selection = selections[h.id];
        if (selection && selection.isSelected) {
          const remainingQuantity = Math.max(0, h.holdingQuantity - selection.amountToSell);
          
          // Adjust proportional gains and balance remaining
          const fractionRemaining = h.holdingQuantity > 0 ? remainingQuantity / h.holdingQuantity : 0;
          return {
            ...h,
            holdingQuantity: remainingQuantity,
            stcgGain: h.stcgGain * fractionRemaining,
            stcgBalance: h.stcgBalance * fractionRemaining,
            ltcgGain: h.ltcgGain * fractionRemaining,
            ltcgBalance: h.ltcgBalance * fractionRemaining,
          };
        }
        return h;
      })
      .filter((h) => h.holdingQuantity > 0); // remove position if fully sold

    // Initialize new selections for remaining assets
    const nextSelections: Record<string, HarvestSelection> = {};
    nextHoldings.forEach((h) => {
      nextSelections[h.id] = {
        isSelected: false,
        amountToSell: 0,
      };
    });

    set({
      preHarvestGains: nextGains,
      holdings: nextHoldings,
      selections: nextSelections,
    });
  },

  clearError: () => set({ error: null }),
}));
