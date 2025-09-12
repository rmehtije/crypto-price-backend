import { IProviderResponse, IPriceData } from "../types";
import { DataProvider as IDataProvider } from "@prisma/client";

const apiKeyError = "API key not found for environment variable:";
const priceFetchError = "Failed to fetch price from CoinMarketCap:";
const providerUrlError = "Provider URL is not configured";
const unknowFetchError =
  "Unknown error occurred while fetching price from CoinMarketCap.";

export class CoinMarketCapProvider {
  protected provider: IDataProvider;
  protected headers: { [key: string]: string };

  constructor(provider: IDataProvider) {
    this.provider = provider;

    const apiKey = process.env[provider.apiKeyEnvVar];
    if (!apiKey) {
      throw new Error(`${apiKeyError} ${provider.apiKeyEnvVar}`);
    }

    this.headers = {
      [provider.apiKeyHeader]: apiKey,
    };
  }

  async fetchPrice(
    baseSymbol: string,
    quoteSymbol: string
  ): Promise<IPriceData> {
    const endpoint = "/cryptocurrency/quotes/latest";

    let priceData: IProviderResponse<IPriceData>;

    const url = this.buildUrl(
      {
        symbol: baseSymbol,
        convert: quoteSymbol,
      },
      endpoint
    );

    try {
      const response = await fetch(url, {
        headers: this.headers,
        method: "GET",
      });

      priceData = (await response.json()) as IProviderResponse<IPriceData>;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`${priceFetchError} ${error.message}`);
      }
      throw new Error(unknowFetchError);
    }

    return priceData.data[baseSymbol]?.[0]?.quote[quoteSymbol];
  }

  private buildUrl(params: Record<string, string>, endpoint: string): string {
    if (!this.provider.url) {
      throw new Error(providerUrlError);
    }

    const searchParams = new URLSearchParams(params);

    return `${this.provider.url}${endpoint}?${searchParams}`;
  }
}
