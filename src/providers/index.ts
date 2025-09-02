import { CoinMarketCapProvider } from "./CoinMarketCap";

const providersMap = {
  CoinMarketCap: CoinMarketCapProvider,
} as const;

export { providersMap };
