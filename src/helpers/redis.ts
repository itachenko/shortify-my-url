import { RedisClient, createClient } from "redis";

const redisClient: RedisClient = createClient(process.env.REDIS_URL as string);

redisClient.once("connect", () => {
  console.log("Connected to the Redis.");
});
redisClient.on("error", (error) => {
  console.error(`Smth wrong with Redis.\nReason: ${error}`);
});

export function getDbSize(): Promise<number> {
  return new Promise((resolve, reject) => {
    redisClient.DBSIZE((err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
}

export function getLongUrl(shortUrl: string): Promise<string | null> {
  return new Promise((resolve, reject) => {
    redisClient.GET(shortUrl, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
}

export function checkIfExist(shortUrl: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    redisClient.EXISTS(shortUrl, (err, data) => {
      if (err) reject(err);
      if (data === 0) resolve(false);
      resolve(true);
    });
  });
}

export function saveShortUrl(shortUrl: string,longUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const ttl = parseInt(process.env.TTL_SECONDS as string);
    redisClient.SETEX(shortUrl, ttl, longUrl, (err, data) => {
      if (err) reject(err);
        resolve(data);
      }
    );
  });
}
