import { createClient } from "redis";

const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://127.0.0.1:6379",
});

redisClient.on("error", (err) => console.log("❌ Redis Client Error", err));
redisClient.on("connect", () => console.log("✅ Redis connected".bgGreen.black));

// Connect once at startup. If Redis is down, we log it but don't crash the app —
// caching just gets skipped (see cacheMiddleware.js safeguards).
export const connectRedis = async () => {
  try {
    await redisClient.connect();
  } catch (err) {
    console.log("❌ Redis connection error:", err.message);
  }
};

export default redisClient;
