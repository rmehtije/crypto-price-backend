export interface IPairParams {
  pair: string;
}

export interface IPriceData {
  price: number;
  volume_24h: number;
  percent_change_24h: number;
  market_cap: number;
}

export interface IPriceResponse {
  success: boolean;
  data?: IPriceData;
  timestamp?: number;
  pair?: {
    base: string;
    quote: string;
    pairId: number;
  };
  dataProvider?: {
    name: string;
    id: number;
  };
  error?: string;
}
