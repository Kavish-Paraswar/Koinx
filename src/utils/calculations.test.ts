import { describe, it, expect } from 'vitest';
import { 
  roundCurrency, 
  calculateNetGain, 
  calculatePartialSellImpact, 
  calculateHarvestImpact 
} from './calculations';
import { normalizeCapitalGains, normalizeHolding } from './normalizers';
import type { CapitalGains, Holding, HarvestSelection } from '../types';

describe('Financial Calculation Engine Tests', () => {
  
  describe('roundCurrency', () => {
    it('should round numbers to 4 decimal places by default', () => {
      expect(roundCurrency(1.234567)).toBe(1.2346);
      expect(roundCurrency(0.1 + 0.2)).toBe(0.3); // Safe floating point addition
    });

    it('should round numbers to specified decimal length', () => {
      expect(roundCurrency(1.234567, 2)).toBe(1.23);
      expect(roundCurrency(10.5, 0)).toBe(11);
    });
  });

  describe('calculateNetGain', () => {
    it('should calculate profits minus losses', () => {
      expect(calculateNetGain(100, 500)).toBe(-400);
      expect(calculateNetGain(1200, 100)).toBe(1100);
      expect(calculateNetGain(0, 0)).toBe(0);
    });
  });

  describe('calculatePartialSellImpact', () => {
    it('should scale potential gains linearly by sell fraction', () => {
      // Selling 50% of 10 coins with 1000 potential gain
      expect(calculatePartialSellImpact(1000, 5, 10)).toBe(500);
      // Selling 100% of holdings
      expect(calculatePartialSellImpact(-500, 2, 2)).toBe(-500);
      // Selling 0% of holdings
      expect(calculatePartialSellImpact(300, 0, 1.5)).toBe(0);
    });

    it('should clamp fraction to 1 maximum (cannot sell more than total holdings)', () => {
      expect(calculatePartialSellImpact(500, 10, 5)).toBe(500); // clamps to 100%
    });
  });

  describe('calculateHarvestImpact', () => {
    it('should accurately calculate outcomes matching assignment context examples', () => {
      // Initial gains: Net STCG = -400, Net LTCG = 1100, Realised = 700
      const preHarvestGains: CapitalGains = {
        stcg: { profits: 100, losses: 500 },
        ltcg: { profits: 1200, losses: 100 },
      };

      // Holdings mock
      const mockHoldings: Holding[] = [
        {
          id: 'test-coin-1',
          coin: { id: 'coin1', symbol: 'C1', name: 'Coin 1', logoUrl: '' },
          holdingQuantity: 10,
          avgBuyPrice: 100,
          currentPrice: 150,
          stcgGain: 500, // +500 stcg gain
          stcgBalance: 1500,
          ltcgGain: 0,
          ltcgBalance: 0,
        },
        {
          id: 'test-coin-2',
          coin: { id: 'coin2', symbol: 'C2', name: 'Coin 2', logoUrl: '' },
          holdingQuantity: 5,
          avgBuyPrice: 200,
          currentPrice: 100,
          stcgGain: 0,
          stcgBalance: 0,
          ltcgGain: -1000, // -1000 ltcg loss
          ltcgBalance: 500,
        }
      ];

      // Selections: both checked, fully sold
      const selections: Record<string, HarvestSelection> = {
        'test-coin-1': { isSelected: true, amountToSell: 10 },
        'test-coin-2': { isSelected: true, amountToSell: 5 },
      };

      const result = calculateHarvestImpact(preHarvestGains, mockHoldings, selections);

      // Verify Pre-Harvest Summary values
      expect(result.preHarvest.stcg.net).toBe(-400);
      expect(result.preHarvest.ltcg.net).toBe(1100);
      expect(result.preHarvest.realised).toBe(700);

      // Verify Post-Harvest Accumulations
      // stcg.profits should grow by 500 (100 + 500 = 600)
      // stcg.losses stays 500
      expect(result.postHarvest.stcg.profits).toBe(600);
      expect(result.postHarvest.stcg.losses).toBe(500);
      expect(result.postHarvest.stcg.net).toBe(100);

      // ltcg.losses should grow by |-1000| (100 + 1000 = 1100)
      // ltcg.profits stays 1200
      expect(result.postHarvest.ltcg.profits).toBe(1200);
      expect(result.postHarvest.ltcg.losses).toBe(1100);
      expect(result.postHarvest.ltcg.net).toBe(100);

      // Verify Realised
      expect(result.postHarvest.realised).toBe(200);

      // Verify Savings: 700 - 200 = 500
      expect(result.taxSavings).toBe(500);
    });

    it('should report zero savings if post-harvest realized is greater than pre-harvest realized', () => {
      const preGains: CapitalGains = {
        stcg: { profits: 100, losses: 500 },
        ltcg: { profits: 100, losses: 100 },
      }; // realised = -400

      const holdings: Holding[] = [
        {
          id: 'test-coin-3',
          coin: { id: 'coin3', symbol: 'C3', name: 'Coin 3', logoUrl: '' },
          holdingQuantity: 1,
          avgBuyPrice: 10,
          currentPrice: 20,
          stcgGain: 1000, // profit of 1000
          stcgBalance: 20,
          ltcgGain: 0,
          ltcgBalance: 0,
        }
      ];

      const selections: Record<string, HarvestSelection> = {
        'test-coin-3': { isSelected: true, amountToSell: 1 },
      };

      const result = calculateHarvestImpact(preGains, holdings, selections);
      // realised increases, so tax savings should be 0
      expect(result.taxSavings).toBe(0);
    });
  });
});

describe('Normalization Layer Tests', () => {
  it('should normalize raw gains DTO safely', () => {
    const rawGains = {
      stcg_profits: '150.75',
      stcg_losses: null, // missing loss
      ltcg_profits: undefined,
      ltcg_losses: 12.50
    };
    const norm = normalizeCapitalGains(rawGains);
    expect(norm.stcg.profits).toBe(150.75);
    expect(norm.stcg.losses).toBe(0);
    expect(norm.ltcg.profits).toBe(0);
    expect(norm.ltcg.losses).toBe(12.50);
  });

  it('should normalize raw holdings DTO safely', () => {
    const rawHolding = {
      id: 'coin-btc',
      coin: {
        coin_id: 'btc',
        coin_symbol: 'btc',
        coin_name: 'Bitcoin',
        logo_url: 'logo.png'
      },
      qty: '0.5',
      avg_buy_price: 50000,
      current_price: '55000',
      stcg_gain_potential: 2500,
      stcg_bal: '27500',
      ltcg_gain_potential: 0,
      ltcg_bal: 0
    };

    const norm = normalizeHolding(rawHolding);
    expect(norm.id).toBe('coin-btc');
    expect(norm.coin.symbol).toBe('BTC');
    expect(norm.holdingQuantity).toBe(0.5);
    expect(norm.avgBuyPrice).toBe(50000);
    expect(norm.currentPrice).toBe(55000);
    expect(norm.stcgGain).toBe(2500);
    expect(norm.stcgBalance).toBe(27500);
  });
});
