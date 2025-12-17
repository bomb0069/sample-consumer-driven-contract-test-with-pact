"use strict";

const path = require("path");
const { Pact, Matchers } = require("@pact-foundation/pact");
const { getProduct } = require("../src/client");

const { like, boolean, iso8601DateTime } = Matchers;

describe("Product API consumer B contract", () => {
  const provider = new Pact({
    consumer: "InventoryWebB",
    provider: "ProductService",
    port: 1235,
    log: path.resolve(__dirname, "../logs", "pact.log"),
    dir: path.resolve(__dirname, "../pacts"),
    spec: 2,
  });

  beforeAll(async () => {
    await provider.setup();
    const baseUrl = provider.mockServer?.url || provider.mockService?.baseUrl;
    if (!baseUrl) {
      throw new Error("Unable to determine mock server URL from Pact setup");
    }
    process.env.PROVIDER_BASE_URL = baseUrl;
  });

  afterEach(async () => {
    await provider.verify();
  });

  afterAll(async () => {
    await provider.finalize();
  });

  describe("when a product is requested for availability", () => {
    beforeEach(async () => {
      await provider.addInteraction({
        state: "a product with ID 10 exists",
        uponReceiving: "a request for product 10 availability",
        withRequest: {
          method: "GET",
          path: "/api/products/10",
        },
        willRespondWith: {
          status: 200,
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
          body: like({
            id: 10,
            sku: "A-10",
            name: "Premium Coffee Beans",
            stockStatus: like("IN_STOCK"),
            available: boolean(true),
            lastRestockDate: iso8601DateTime("2025-01-01T00:00:00Z"),
          }),
        },
      });
    });

    it("describes the availability details", async () => {
      const product = await getProduct(10);
      expect(product).toMatchObject({
        id: 10,
        sku: "A-10",
        stockStatus: "IN_STOCK",
      });
    });
  });
});
