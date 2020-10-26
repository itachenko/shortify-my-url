import { RedisClient, createClient } from "redis";
import logger from "./logger";
import { RedisConstants } from "../constants";

/**
 * RedisHelpers class.
 */
class RedisHelpers {
  private redisClient: RedisClient;

  constructor() {
    this.redisClient = createClient(process.env.REDIS_URL as string);

    this.redisClient.once("connect", () => {
      logger.info("Connected to the Redis.");
    });
    this.redisClient.on("error", (error) => {
      logger.error(`Smth wrong with Redis.\nReason: ${error}`);
    });
  }

  /**
   * Gets the number of keys in the database.
   */
  getDbSize(): Promise<number> {
    return new Promise((resolve, reject) => {
      this.redisClient.DBSIZE((err, data) => {
        if (err) reject(err);
        resolve(data);
      });
    });
  }

  /**
   * Get the value stored at field LONGURL_FIELDNAME.
   * @param shortUrl key of the hash.
   */
  getLongUrl(shortUrl: string): Promise<string | null> {
    return new Promise((resolve, reject) => {
      this.redisClient.HGET(
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
  incrClicks(shortUrl: string): Promise<number> {
    return new Promise((resolve, reject) => {
      this.redisClient.HINCRBY(
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
  checkIfExist(shortUrl: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.redisClient.EXISTS(shortUrl, (err, data) => {
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
  saveShortUrl(shortUrl: string, longUrl: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const ttl: number = parseInt(process.env.TTL_SECONDS as string, 10);
      this.redisClient.HMSET(
        shortUrl,
        RedisConstants.LONGURL_FIELDNAME,
        longUrl,
        RedisConstants.CLICKS_FIELDNAME,
        0,
        (err, data) => {
          if (err) reject(err);
        }
      );
      this.redisClient.EXPIRE(shortUrl, ttl, (err, data) => {
        if (err) reject(err);
      });
      resolve(true);
    });
  }
}

export const redisHelpers = new RedisHelpers();
