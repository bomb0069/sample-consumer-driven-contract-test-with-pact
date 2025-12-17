"use strict";

const express = require("express");

const app = express();
const port = process.env.PORT || 4001;

const PRODUCTS = [
  {
    id: 10,
    sku: "A-10",
    name: "Premium Coffee Beans",
    price: 450,
    currency: "THB",
    stockStatus: "IN_STOCK",
    available: true,
    lastRestockDate: "2025-12-01T00:00:00Z",
  },
  {
    id: 11,
    sku: "A-11",
    name: "Dark Roast Coffee Beans",
    price: 420,
    currency: "THB",
    stockStatus: "LOW_STOCK",
    available: true,
    lastRestockDate: "2025-11-20T00:00:00Z",
  },
];

app.get("/api/products/:id", (req, res) => {
  const productId = parseInt(req.params.id, 10);
  const product = PRODUCTS.find((item) => item.id === productId);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  return res.json(product);
});

if (require.main === module) {
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Product service listening on port ${port}`);
  });
}

module.exports = app;
