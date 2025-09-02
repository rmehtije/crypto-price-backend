import { IPriceResponse } from "../types";

describe("API Tests", () => {
  const basePath = "http://localhost:" + process.env.PORT;

  const baseSymbol = "TON";
  const quoteSymbol = "USDT";

  test("GET /api/price/:pair returns price data", async () => {
    const pair = `${baseSymbol}/${quoteSymbol}`;
    const response = await fetch(
      `${basePath}/api/price/${encodeURIComponent(pair)}`
    );

    expect(response.status).toBe(200);

    const data = (await response.json()) as IPriceResponse;

    expect(data.success).toBe(true);
    expect(data.timestamp).toBeDefined();
    expect(typeof data.timestamp).toBe("number");
    expect(data.data?.price).toBeGreaterThan(0);

    expect(data.pair?.base).toBe(baseSymbol);
    expect(data.pair?.quote).toBe(quoteSymbol);
  });
});
