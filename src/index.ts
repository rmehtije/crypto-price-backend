import Fastify, { FastifyInstance as IFastifyInstance } from "fastify";
import fastifyCaching from "@fastify/caching";
import { PrismaClient } from "@prisma/client";
import { pairPriceRoute, pairsRoute } from "./routes";

const prisma = new PrismaClient();
const port = Number(process.env.PORT) ?? 3001;

export const createServer = (): IFastifyInstance => {
  const server = Fastify({
    logger: true,
  });

  server.register(fastifyCaching);

  server.register(async (instance) => {
    pairPriceRoute(instance, prisma);
  });

  server.register(async (instance) => {
    pairsRoute(instance, prisma);
  });

  return server;
};

const server = createServer();

const gracefulShutdown = async (signal: string) => {
  console.log(`Received ${signal}, shutting down gracefully`);

  await server.close();
  await prisma.$disconnect();

  process.exit(0);
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

server.listen({ port, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});

export default createServer;
