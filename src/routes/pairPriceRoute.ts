import {
  FastifyInstance as IFastifyInstance,
  FastifyRequest as IFastifyRequest,
  FastifyReply as IFastifyReply,
} from "fastify";
import { PrismaClient, DataProvider } from "@prisma/client";
import { providersMap } from "../providers";
import {
  IProviderService,
  IPairParams,
  IPriceResponse,
  IProviderResponse,
} from "../types";

export default async function pairPriceRoute(
  fastify: IFastifyInstance,
  prisma: PrismaClient
) {
  fastify.get<{
    Params: IPairParams;
  }>(
    "/api/price/:pair",
    {
      schema: {
        params: {
          type: "object",
          properties: {
            pair: { type: "string", pattern: "^[A-Z]+/[A-Z]+$" },
          },
          required: ["pair"],
        },
      },
    },
    async (
      request: IFastifyRequest<{ Params: IPairParams }>,
      reply: IFastifyReply
    ) => {
      const { pair } = request.params;

      try {
        const [baseSymbol, quoteSymbol] = pair.split("/");

        const coinPair = await prisma.coinPair.findFirst({
          where: {
            isActive: true,
            baseCoin: {
              symbol: baseSymbol.toUpperCase(),
            },
            quoteCoin: {
              symbol: quoteSymbol.toUpperCase(),
            },
          },
          include: {
            baseCoin: true,
            quoteCoin: true,
          },
        });

        if (!coinPair) {
          return reply.status(404).send({
            success: false,
            error: `Pair ${pair} not found or not active`,
          } satisfies IPriceResponse);
        }

        const dataProvider = await prisma.dataProvider.findFirst({
          where: {
            isActive: true,
          },
        });

        if (!dataProvider) {
          return reply.status(503).send({
            success: false,
            error: "No active data providers available",
          } satisfies IPriceResponse);
        }

        const priceData = await fetchFromDataProvider(
          dataProvider,
          baseSymbol.toUpperCase(),
          quoteSymbol.toUpperCase(),
          fastify.log
        );

        const price =
          priceData.data[coinPair.baseCoin.symbol]?.[0]?.quote[
            coinPair.quoteCoin.symbol
          ];

        if (!price) {
          return reply.status(404).send({
            success: false,
            error: `Price data not available for pair ${pair}`,
          } satisfies IPriceResponse);
        }

        const response: IPriceResponse = {
          success: true,
          data: price,
          timestamp: Date.now(),
          pair: {
            base: coinPair.baseCoin.symbol,
            quote: coinPair.quoteCoin.symbol,
            pairId: coinPair.id,
          },
          dataProvider: {
            name: dataProvider.name,
            id: dataProvider.id,
          },
        };

        return reply
          .header("Cache-Control", "public, max-age=60")
          .send(response);
      } catch (error) {
        fastify.log.error(error);

        return reply.status(500).send({
          success: false,
          error: "Internal server error",
        });
      }
    }
  );
}

async function fetchFromDataProvider(
  provider: DataProvider,
  baseSymbol: string,
  quoteSymbol: string,
  logger: IFastifyInstance["log"]
): Promise<any> {
  try {
    const ProviderClass =
      providersMap[provider.name as keyof typeof providersMap];

    if (!ProviderClass) {
      throw new Error(`Provider ${provider.name} not found in providers map`);
    }

    const providerInstance: IProviderService = new ProviderClass(provider);
    const response = await providerInstance.fetchPrice(baseSymbol, quoteSymbol);

    if (!response.ok) {
      throw new Error(
        `Data provider API error: ${response.status} ${response.statusText}`
      );
    }

    const data: IProviderResponse = await response.json();

    if (!data?.data || typeof data.data !== "object") {
      throw new Error("Invalid response format from data provider");
    }

    return data;
  } catch (error) {
    logger.error(error);
    throw new Error("Failed to fetch data from provider");
  }
}
