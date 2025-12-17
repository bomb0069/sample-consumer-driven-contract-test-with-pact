"use strict";

const path = require("path");
const { Verifier } = require("@pact-foundation/pact");
const app = require("../src/server");

const port = process.env.PORT || 4001;

async function verifyProvider() {
  const server = app.listen(port);

  try {
    const pactFiles = [
      path.resolve(
        __dirname,
        "../../consumer_a/pacts/inventoryweba-productservice.json"
      ),
      path.resolve(
        __dirname,
        "../../consumer_b/pacts/inventorywebb-productservice.json"
      ),
    ];

    const options = {
      provider: "ProductService",
      providerBaseUrl: `http://localhost:${port}`,
      pactUrls: pactFiles,
      stateHandlers: {
        "a product with ID 10 exists": async () => Promise.resolve(),
      },
    };

    const output = await new Verifier(options).verifyProvider();
    // eslint-disable-next-line no-console
    console.log("Pact verification complete:\n", output);
  } finally {
    server.close();
  }
}

if (require.main === module) {
  verifyProvider().catch((error) => {
    // eslint-disable-next-line no-console
    console.error("Pact verification failed", error);
    process.exit(1);
  });
}
