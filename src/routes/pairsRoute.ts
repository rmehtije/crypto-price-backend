import { FastifyInstance as IFastifyInstance } from "fastify";
import { PrismaClient as IPrismaClient } from "@prisma/client";

export default async function pairsRoute(
  fastify: IFastifyInstance,
  prisma: IPrismaClient
) {
  fastify.get("/api/pairs", async () => {
    try {
      const pairs = await prisma.coinPair.findMany({
        include: {
          baseCoin: true,
          quoteCoin: true,
        },
      });
      return pairs;
    } catch (error) {
      fastify.log.error(error);
      throw new Error("Failed to fetch pairs");
    }
  });
}
