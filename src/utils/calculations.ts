import type { CapitalGains, Holding, HarvestSelection, HarvestResult } from '../types';

/**
 * Rounds a number to a fixed decimal length using EPSILON to avoid floating-point errors.
 */
export const roundCurrency = (value: number, decimals: number = 4): number => {
  const multiplier = Math.pow(10, decimals);
  return Math.round((value + Number.EPSILON) * multiplier) / multiplier;
};

/**
 * Calculates net gains (profits minus losses).
 */
export const calculateNetGain = (profits: number, losses: number): number => {
  return roundCurrency(profits - losses);
};

/**
 * Calculates the proportional gain or loss based on the amount of asset sold.
 */
export const calculatePartialSellImpact = (
  gainIfFullySold: number,
  sellAmount: number,
  totalQuantity: number
): number => {
  if (totalQuantity <= 0 || sellAmount <= 0) return 0;
  // Make sure we never sell more than the total quantity
  const fraction = Math.min(sellAmount / totalQuantity, 1);
  return roundCurrency(gainIfFullySold * fraction);
};

/**
 * Computes the complete pre- and post-harvest reports and estimated tax savings.
 */
export const calculateHarvestImpact = (
  preHarvestGains: CapitalGains,
  holdings: Holding[],
  selections: Record<string, HarvestSelection>
): HarvestResult => {
  // 1. Calculate Pre-Harvest Summary
  const preSTCGNet = calculateNetGain(preHarvestGains.stcg.profits, preHarvestGains.stcg.losses);
  const preLTCGNet = calculateNetGain(preHarvestGains.ltcg.profits, preHarvestGains.ltcg.losses);
  const preRealised = roundCurrency(preSTCGNet + preLTCGNet);

  const preHarvestReport = {
    stcg: {
      profits: preHarvestGains.stcg.profits,
      losses: preHarvestGains.stcg.losses,
      net: preSTCGNet,
    },
    ltcg: {
      profits: preHarvestGains.ltcg.profits,
      losses: preHarvestGains.ltcg.losses,
      net: preLTCGNet,
    },
    realised: preRealised,
  };

  // 2. Initialize Post-Harvest Gains (start with pre-harvest baselines)
  let postSTCGProfits = preHarvestGains.stcg.profits;
  let postSTCGLosses = preHarvestGains.stcg.losses;
  let postLTCGProfits = preHarvestGains.ltcg.profits;
  let postLTCGLosses = preHarvestGains.ltcg.losses;

  // 3. Compute adjustments based on active selections
  holdings.forEach((holding) => {
    const selection = selections[holding.id];
    if (selection && selection.isSelected && selection.amountToSell > 0) {
      // Calculate proportional harvested gains
      const harvestedSTCG = calculatePartialSellImpact(
        holding.stcgGain,
        selection.amountToSell,
        holding.holdingQuantity
      );
      
      const harvestedLTCG = calculatePartialSellImpact(
        holding.ltcgGain,
        selection.amountToSell,
        holding.holdingQuantity
      );

      // Apply STCG harvesting rules
      if (harvestedSTCG > 0) {
        postSTCGProfits += harvestedSTCG;
      } else if (harvestedSTCG < 0) {
        postSTCGLosses += Math.abs(harvestedSTCG);
      }

      // Apply LTCG harvesting rules
      if (harvestedLTCG > 0) {
        postLTCGProfits += harvestedLTCG;
      } else if (harvestedLTCG < 0) {
        postLTCGLosses += Math.abs(harvestedLTCG);
      }
    }
  });

  // Round intermediate values
  postSTCGProfits = roundCurrency(postSTCGProfits);
  postSTCGLosses = roundCurrency(postSTCGLosses);
  postLTCGProfits = roundCurrency(postLTCGProfits);
  postLTCGLosses = roundCurrency(postLTCGLosses);

  // Calculate Net outcomes
  const postSTCGNet = calculateNetGain(postSTCGProfits, postSTCGLosses);
  const postLTCGNet = calculateNetGain(postLTCGProfits, postLTCGLosses);
  const postRealised = roundCurrency(postSTCGNet + postLTCGNet);

  const postHarvestReport = {
    stcg: {
      profits: postSTCGProfits,
      losses: postSTCGLosses,
      net: postSTCGNet,
    },
    ltcg: {
      profits: postLTCGProfits,
      losses: postLTCGLosses,
      net: postLTCGNet,
    },
    realised: postRealised,
  };

  // 4. Calculate Tax Savings
  // Only show savings if realized capital gains are reduced
  const taxSavings = preRealised > postRealised 
    ? roundCurrency(preRealised - postRealised) 
    : 0;

  return {
    preHarvest: preHarvestReport,
    postHarvest: postHarvestReport,
    taxSavings,
  };
};
