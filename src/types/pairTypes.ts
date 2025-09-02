export interface IPairParams {
  pair: string;
}

export interface IPriceResponse {
  success: boolean;
  data?: {
    price: number;
    volume_24h: number;
    percent_change_24h: number;
    market_cap: number;
  };
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
