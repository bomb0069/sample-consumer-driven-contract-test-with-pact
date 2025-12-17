"use strict";

const path = require("path");
const { Pact, Matchers } = require("@pact-foundation/pact");
const { getProduct } = require("../src/client");

const { like } = Matchers;

describe("Product API consumer contract", () => {
  const provider = new Pact({
    consumer: "InventoryWebA",
    provider: "ProductService",
    port: 1234,
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

  describe("when a product exists", () => {
    beforeEach(async () => {
      await provider.addInteraction({
        state: "a product with ID 10 exists",
        uponReceiving: "a request for product 10",
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
            price: 450,
            currency: "THB",
          }),
        },
      });
    });

    it("returns the product payload", async () => {
      const product = await getProduct(10);
      expect(product).toMatchObject({
        id: 10,
        sku: "A-10",
        name: "Premium Coffee Beans",
      });
    });
  });
});
