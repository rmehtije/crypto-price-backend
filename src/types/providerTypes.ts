import { IPriceData } from "./pairTypes";

export interface IProviderService {
  fetchPrice(baseSymbol: string, quoteSymbol: string): Promise<IPriceData>;
}

export interface IDataProvider {
  name: string;
  url: URL;
  apiKeyEnvVar: string;
  apiKeyHeader: string;
  isActive: boolean;
}

export interface IProviderResponse<T> {
  data: {
    [key: string]: Array<{
      quote: {
        [key: string]: T;
      };
    }>;
  };
}
