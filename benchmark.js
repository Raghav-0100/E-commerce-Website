/**
 * Simple before/after load test for the cached endpoints.
 *
 * Usage:
 *   1. Make sure your server is running (npm run server) — with or without Redis.
 *   2. node benchmark.js
 *
 * Run this ONCE before adding Redis (or with Redis temporarily disconnected)
 * and ONCE after, and compare the printed averages. Those are your real,
 * honest numbers for a resume bullet.
 */
import autocannon from "autocannon";

const BASE_URL = process.env.BENCHMARK_URL || "http://localhost:8080";

const endpoints = [
  { name: "GET /product/get-product", path: "/api/v1/product/get-product" },
  { name: "GET /product/product-list/1", path: "/api/v1/product/product-list/1" },
  { name: "GET /category/get-category", path: "/api/v1/category/get-category" },
];

const runOne = (url) =>
  new Promise((resolve, reject) => {
    autocannon(
      {
        url,
        connections: 10,
        amount: 100, // total requests, matches "run 100 requests" from the checklist
      },
      (err, result) => (err ? reject(err) : resolve(result))
    );
  });

const main = async () => {
  console.log(`Benchmarking against ${BASE_URL} — 100 requests per endpoint\n`);
  for (const ep of endpoints) {
    const result = await runOne(`${BASE_URL}${ep.path}`);
    console.log(`--- ${ep.name} ---`);
    console.log(`  Requests completed: ${result.requests.total}`);
    console.log(`  Avg latency:        ${result.latency.average} ms`);
    console.log(`  p99 latency:        ${result.latency.p99} ms`);
    console.log(`  Errors:             ${result.errors}`);
    console.log("");
  }
};

main().catch((err) => {
  console.error("Benchmark failed:", err.message);
  process.exit(1);
});
