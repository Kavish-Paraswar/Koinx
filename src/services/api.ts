import type { APICapitalGainsDTO, APIHoldingDTO } from '../types';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Deterministic raw DTO mock data matching fintech requirements
const MOCK_CAPITAL_GAINS: APICapitalGainsDTO = {
  stcg_profits: 100,
  stcg_losses: 500,  // Net STCG = -400
  ltcg_profits: 1200,
  ltcg_losses: 100,  // Net LTCG = 1100
  // Pre-harvest realized = 700
};

const MOCK_HOLDINGS: APIHoldingDTO[] = [
  {
    id: 'btc-holding',
    coin: {
      coin_id: 'bitcoin',
      coin_symbol: 'btc',
      coin_name: 'Bitcoin',
      logo_url: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
    },
    qty: 1.25,
    avg_buy_price: 62000.0,
    current_price: 66000.0,
    stcg_gain_potential: 5000.0, // positive stcg gain
    stcg_bal: 82500.0,
    ltcg_gain_potential: 0.0,
    ltcg_bal: 0.0,
  },
  {
    id: 'eth-holding',
    coin: {
      coin_id: 'ethereum',
      coin_symbol: 'eth',
      coin_name: 'Ethereum',
      logo_url: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
    },
    qty: 8.5,
    avg_buy_price: 3400.0,
    current_price: 3100.0,
    stcg_gain_potential: 0.0,
    stcg_bal: 0.0,
    ltcg_gain_potential: -2550.0, // negative ltcg (harvestable loss)
    ltcg_bal: 26350.0,
  },
  {
    id: 'sol-holding',
    coin: {
      coin_id: 'solana',
      coin_symbol: 'sol',
      coin_name: 'Solana',
      logo_url: 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
    },
    qty: 120.0,
    avg_buy_price: 155.0,
    current_price: 130.0,
    stcg_gain_potential: -3000.0, // negative stcg (harvestable loss)
    stcg_bal: 15600.0,
    ltcg_gain_potential: 0.0,
    ltcg_bal: 0.0,
  },
  {
    id: 'ada-holding',
    coin: {
      coin_id: 'cardano',
      coin_symbol: 'ada',
      coin_name: 'Cardano',
      logo_url: 'https://assets.coingecko.com/coins/images/975/large/cardano.png',
    },
    qty: 4000.0,
    avg_buy_price: 0.45,
    current_price: 0.58,
    stcg_gain_potential: 520.0, // positive stcg gain
    stcg_bal: 2320.0,
    ltcg_gain_potential: 0.0,
    ltcg_bal: 0.0,
  },
  {
    id: 'link-holding',
    coin: {
      coin_id: 'chainlink',
      coin_symbol: 'link',
      coin_name: 'Chainlink',
      logo_url: 'https://assets.coingecko.com/coins/images/877/large/chainlink.png',
    },
    qty: 150.0,
    avg_buy_price: 18.5,
    current_price: 15.0,
    stcg_gain_potential: 0.0,
    stcg_bal: 0.0,
    ltcg_gain_potential: -525.0, // negative ltcg (harvestable loss)
    ltcg_bal: 2250.0,
  },
  {
    id: 'matic-holding',
    coin: {
      coin_id: 'matic-network',
      coin_symbol: 'matic',
      coin_name: 'Polygon',
      logo_url: 'https://assets.coingecko.com/coins/images/4713/large/matic-token.png',
    },
    qty: 5000.0,
    avg_buy_price: 0.95,
    current_price: 0.75,
    stcg_gain_potential: -1000.0, // negative stcg (harvestable loss)
    stcg_bal: 3750.0,
    ltcg_gain_potential: 0.0,
    ltcg_bal: 0.0,
  },
  {
    id: 'uni-holding',
    coin: {
      coin_id: 'uniswap',
      coin_symbol: 'uni',
      coin_name: 'Uniswap',
      logo_url: 'https://assets.coingecko.com/coins/images/12504/large/uniswap.png',
    },
    qty: 300.0,
    avg_buy_price: 8.0,
    current_price: 11.50,
    stcg_gain_potential: 0.0,
    stcg_bal: 0.0,
    ltcg_gain_potential: 1050.0, // positive ltcg gain
    ltcg_bal: 3450.0,
  }
];

export interface APIService {
  fetchCapitalGains: () => Promise<APICapitalGainsDTO>;
  fetchHoldings: () => Promise<APIHoldingDTO[]>;
}

export const apiService: APIService = {
  fetchCapitalGains: async (): Promise<APICapitalGainsDTO> => {
    await delay(1200); // Simulate network load
    
    // Check if error simulation is enabled via localStorage
    if (localStorage.getItem('simulate_api_error') === 'true') {
      throw new Error('Database connection failed. [Code: 503]');
    }

    return { ...MOCK_CAPITAL_GAINS };
  },

  fetchHoldings: async (): Promise<APIHoldingDTO[]> => {
    await delay(1500); // Simulate network load

    if (localStorage.getItem('simulate_api_error') === 'true') {
      throw new Error('Could not fetch portfolio positions. [Code: 500]');
    }

    return [...MOCK_HOLDINGS];
  },
};
