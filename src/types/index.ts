// API Data Transfer Objects (DTOs)
export interface APICapitalGainsDTO {
  stcg_profits?: string | number | null;
  stcg_losses?: string | number | null;
  ltcg_profits?: string | number | null;
  ltcg_losses?: string | number | null;
}

export interface APICoinDTO {
  coin_id: string;
  coin_symbol?: string | null;
  coin_name?: string | null;
  logo_url?: string | null;
}

export interface APIHoldingDTO {
  id: string;
  coin?: APICoinDTO | null;
  qty?: string | number | null;
  avg_buy_price?: string | number | null;
  current_price?: string | number | null;
  stcg_gain_potential?: string | number | null;
  stcg_bal?: string | number | null;
  ltcg_gain_potential?: string | number | null;
  ltcg_bal?: string | number | null;
}

// Stable Domain Models
export interface GainBucket {
  profits: number;
  losses: number;
}

export interface CapitalGains {
  stcg: GainBucket;
  ltcg: GainBucket;
}

export interface CoinMetadata {
  id: string;
  symbol: string;
  name: string;
  logoUrl: string;
}

export interface Holding {
  id: string;
  coin: CoinMetadata;
  holdingQuantity: number;
  avgBuyPrice: number;
  currentPrice: number;
  stcgGain: number;     // Short term gain/loss if 100% sold
  stcgBalance: number;  // Current market value of STCG holdings
  ltcgGain: number;     // Long term gain/loss if 100% sold
  ltcgBalance: number;  // Current market value of LTCG holdings
}

// User Action State Models
export interface HarvestSelection {
  isSelected: boolean;
  amountToSell: number;
}

// Computed Calculations Models
export interface GainSummary {
  profits: number;
  losses: number;
  net: number;
}

export interface CapitalGainsReport {
  stcg: GainSummary;
  ltcg: GainSummary;
  realised: number;
}

export interface HarvestResult {
  preHarvest: CapitalGainsReport;
  postHarvest: CapitalGainsReport;
  taxSavings: number;
}

export interface DashboardState {
  holdings: Holding[];
  preHarvestGains: CapitalGains;
  selections: Record<string, HarvestSelection>;
  loading: boolean;
  error: string | null;
}
