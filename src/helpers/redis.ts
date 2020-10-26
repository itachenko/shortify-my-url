import { RedisClient, createClient } from "redis";
import logger from "./logger";
import { RedisConstants } from "../constants";

const redisClient: RedisClient = createClient(process.env.REDIS_URL as string);

redisClient.once("connect", () => {
  logger.info("Connected to the Redis.");
});
redisClient.on("error", (error) => {
  logger.error(`Smth wrong with Redis.\nReason: ${error}`);
});

/**
 * Gets the number of keys in the database.
 */
export function getDbSize(): Promise<number> {
  return new Promise((resolve, reject) => {
    redisClient.DBSIZE((err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
}

/**
 * Get the value stored at field LONGURL_FIELDNAME.
 * @param shortUrl key of the hash.
 */
export function getLongUrl(shortUrl: string): Promise<string | null> {
  return new Promise((resolve, reject) => {
    redisClient.HGET(
      shortUrl,
      RedisConstants.LONGURL_FIELDNAME,
      (err, data) => {
        if (err) reject(err);
        resolve(data);
      }
    );
  });
}

/**
 * Increments the value stored at field CLICKS_FIELDNAME by 1.
 * @param shortUrl key of the hash.
 */
export function incrClicks(shortUrl: string): Promise<number> {
  return new Promise((resolve, reject) => {
    redisClient.HINCRBY(
      shortUrl,
      RedisConstants.CLICKS_FIELDNAME,
      1,
      (err, data) => {
        if (err) reject(err);
        resolve(data);
      }
    );
  });
}

/**
 * Checks whether key exists in the database.
 * @param shortUrl key to look for.
 */
export function checkIfExist(shortUrl: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    redisClient.EXISTS(shortUrl, (err, data) => {
      if (err) reject(err);
      if (data === 0) resolve(false);
      resolve(true);
    });
  });
}

/**
 * Saves new object in the database
 * Sets a timeout on key specified in TTL_SECONDS environment variable.
 * @param shortUrl key of the hash.
 * @param longUrl value to store at field LONGURL_FIELDNAME.
 */
export function saveShortUrl(
  shortUrl: string,
  longUrl: string
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const ttl: number = parseInt(process.env.TTL_SECONDS as string, 10);
    redisClient.HMSET(
      shortUrl,
      RedisConstants.LONGURL_FIELDNAME,
      longUrl,
      RedisConstants.CLICKS_FIELDNAME,
      0,
      (err, data) => {
        if (err) reject(err);
      }
    );
    redisClient.EXPIRE(shortUrl, ttl, (err, data) => {
      if (err) reject(err);
    });
    resolve(true);
  });
}
