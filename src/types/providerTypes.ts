export interface IProviderService {
  fetchPrice(baseSymbol: string, quoteSymbol: string): Promise<any>;
}

export interface IDataProvider {
  name: string;
  url: URL;
  apiKeyEnvVar: string;
  apiKeyHeader: string;
  isActive: boolean;
}
export interface IProviderResponse {
  data: {
    [key: string]: Array<{
      quote: {
        [key: string]: number;
      };
    }>;
  };
}
