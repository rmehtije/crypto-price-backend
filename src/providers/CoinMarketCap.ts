import { IProviderService } from "../types";
import { DataProvider as IDataProvider } from "@prisma/client";

const apiKeyError = "API key not found for environment variable:";
const priceFetchError = "Failed to fetch price from CoinMarketCap:";
const providerUrlError = "Provider URL is not configured";
const unknowFetchError =
  "Unknown error occurred while fetching price from CoinMarketCap.";

export class CoinMarketCapProvider implements IProviderService {
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

  async fetchPrice(baseSymbol: string, quoteSymbol: string) {
    const endpoint = "/cryptocurrency/quotes/latest";
    try {
      const url = this.buildUrl(baseSymbol, quoteSymbol, endpoint);

      return fetch(url, {
        headers: this.headers,
        method: "GET",
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`${priceFetchError} ${error.message}`);
      }
      throw new Error(unknowFetchError);
    }
  }

  private buildUrl(
    baseSymbol: string,
    quoteSymbol: string,
    endpoint: string
  ): string {
    if (!this.provider.url) {
      throw new Error(providerUrlError);
    }

    const params = new URLSearchParams({
      symbol: baseSymbol.toUpperCase(),
      convert: quoteSymbol.toUpperCase(),
    });

    return `${this.provider.url}${endpoint}?${params}`;
  }
}
