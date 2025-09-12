import { PrismaClient } from "@prisma/client";
import { providersMap } from "./providers";
import { IProviderService, IPriceData } from "./types";

export class ProviderRequest {
  protected providerInstance: IProviderService | undefined;
  protected readonly prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async fetchPrice(
    baseSymbol: string,
    quoteSymbol: string
  ): Promise<IPriceData> {
    await this.initiateProvider();

    return (await this.providerInstance?.fetchPrice(
      baseSymbol,
      quoteSymbol
    )) as IPriceData;
  }

  private async initiateProvider(): Promise<void> {
    const provider = await this.prisma.dataProvider.findFirst({
      where: {
        isActive: true,
      },
    });

    if (!provider) {
      throw new Error(`No active data providers available`);
    }

    const ProviderClass =
      providersMap[provider.name as keyof typeof providersMap];

    if (!ProviderClass) {
      throw new Error(`Provider ${provider.name} not found in providers map`);
    }
    this.providerInstance = new ProviderClass(provider);
  }
}

export const createRequestService = (
  prisma: PrismaClient
): IProviderService => {
  return new ProviderRequest(prisma);
};
