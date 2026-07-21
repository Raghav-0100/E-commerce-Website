import redisClient from "../config/redisClient.js";

const DEFAULT_TTL_SECONDS = 60 * 10; // 10 minutes

/**
 * cacheMiddleware(keyPrefix)
 * Wraps a GET route. Builds a cache key from keyPrefix + the request URL
 * (so /product-list/1 and /product-list/2 get separate cache entries),
 * checks Redis first, and only calls the real controller on a miss.
 *
 * If Redis is unreachable, this fails open — it just calls next() so the
 * app keeps working off MongoDB directly instead of crashing.
 */
export const cacheMiddleware = (keyPrefix, ttlSeconds = DEFAULT_TTL_SECONDS) => {
  return async (req, res, next) => {
    if (!redisClient.isOpen) {
      return next();
    }

    const cacheKey = `${keyPrefix}:${req.originalUrl}`;

    try {
      const cached = await redisClient.get(cacheKey);
      if (cached) {
        res.setHeader("X-Cache", "HIT");
        return res.status(200).send(JSON.parse(cached));
      }
    } catch (err) {
      console.log("❌ Redis GET error:", err.message);
      return next();
    }

    // Monkey-patch res.send so whatever the controller sends, we also cache it.
    const originalSend = res.send.bind(res);
    res.send = (body) => {
      res.setHeader("X-Cache", "MISS");
      try {
        // Only cache successful JSON responses
        if (res.statusCode === 200) {
          redisClient
            .setEx(cacheKey, ttlSeconds, typeof body === "string" ? body : JSON.stringify(body))
            .catch((err) => console.log("❌ Redis SET error:", err.message));
        }
      } catch (err) {
        console.log("❌ Redis cache-write error:", err.message);
      }
      return originalSend(body);
    };

    next();
  };
};

/**
 * clearCacheByPrefix(prefix)
 * Deletes every cache key starting with the given prefix. Call this from
 * admin create/update/delete controllers so stale data never gets served.
 */
export const clearCacheByPrefix = async (prefix) => {
  if (!redisClient.isOpen) return;
  try {
    let cursor = 0;
    do {
      const result = await redisClient.scan(cursor, { MATCH: `${prefix}:*`, COUNT: 100 });
      cursor = result.cursor;
      if (result.keys.length > 0) {
        await redisClient.del(result.keys);
      }
    } while (cursor !== 0);
  } catch (err) {
    console.log("❌ Redis cache-clear error:", err.message);
  }
};
