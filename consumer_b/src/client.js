"use strict";

const axios = require("axios");

async function getProduct(productId) {
  const baseUrl = process.env.PROVIDER_BASE_URL || "http://localhost:4001";
  const response = await axios.get(`${baseUrl}/api/products/${productId}`);
  return response.data;
}

module.exports = {
  getProduct,
};
