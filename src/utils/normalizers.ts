import type { 
  APICapitalGainsDTO, 
  APIHoldingDTO, 
  CapitalGains, 
  Holding 
} from '../types';

/**
 * Sanitizes and parses raw inputs into standard numbers, returning a safe fallback on NaN.
 */
const safeParseFloat = (value: string | number | null | undefined, fallback: number = 0): number => {
  if (value === null || value === undefined) return fallback;
  const parsed = typeof value === 'number' ? value : parseFloat(value);
  return isNaN(parsed) ? fallback : parsed;
};

/**
 * Converts Capital Gains DTO to stable domain model structure.
 */
export const normalizeCapitalGains = (dto?: APICapitalGainsDTO | null): CapitalGains => {
  return {
    stcg: {
      profits: safeParseFloat(dto?.stcg_profits),
      losses: Math.abs(safeParseFloat(dto?.stcg_losses)), // enforce absolute loss value
    },
    ltcg: {
      profits: safeParseFloat(dto?.ltcg_profits),
      losses: Math.abs(safeParseFloat(dto?.ltcg_losses)), // enforce absolute loss value
    },
  };
};

/**
 * Converts single raw holding item to normalized domain holding layout.
 */
export const normalizeHolding = (dto: APIHoldingDTO): Holding => {
  const quantity = safeParseFloat(dto.qty);
  const avgPrice = safeParseFloat(dto.avg_buy_price);
  const current = safeParseFloat(dto.current_price);
  
  return {
    id: dto.id || `holding_${Math.random().toString(36).substr(2, 9)}`,
    coin: {
      id: dto.coin?.coin_id || 'unknown',
      symbol: (dto.coin?.coin_symbol || 'UNKN').toUpperCase(),
      name: dto.coin?.coin_name || 'Unknown Coin',
      logoUrl: dto.coin?.logo_url || '',
    },
    holdingQuantity: quantity,
    avgBuyPrice: avgPrice,
    currentPrice: current,
    stcgGain: safeParseFloat(dto.stcg_gain_potential),
    stcgBalance: safeParseFloat(dto.stcg_bal, quantity * current), // fall back to qty * price if not specified
    ltcgGain: safeParseFloat(dto.ltcg_gain_potential),
    ltcgBalance: safeParseFloat(dto.ltcg_bal, 0),
  };
};

/**
 * Maps a list of raw holding DTOs.
 */
export const normalizeHoldings = (dtos?: APIHoldingDTO[] | null): Holding[] => {
  if (!dtos || !Array.isArray(dtos)) return [];
  return dtos.map(normalizeHolding);
};
