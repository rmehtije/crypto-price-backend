import {
  FastifyInstance as IFastifyInstance,
  FastifyRequest as IFastifyRequest,
  FastifyReply as IFastifyReply,
} from "fastify";
import { PrismaClient } from "@prisma/client";
import { IPairParams, IPriceResponse } from "../types";
import { createRequestService } from "../ProviderRequest";

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

        const RequestService = createRequestService(prisma);

        const price = await RequestService.fetchPrice(
          baseSymbol.toUpperCase(),
          quoteSymbol.toUpperCase()
        );

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
