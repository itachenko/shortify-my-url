const redis = require("redis");

const redisClient = redis.createClient(process.env.REDIS_URL);

redisClient.once("connect", () => {
  console.log(`Connected to the Redis.`);
});
redisClient.on("error", (error) => {
  console.log(error);
});

module.exports.redisClient = redisClient;

module.exports.getDbSize = () => {
  return new Promise((resolve, reject) => {
    redisClient.DBSIZE((err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

module.exports.getLongUrl = (shortUrl) => {
  return new Promise((resolve, reject) => {
    redisClient.GET(shortUrl, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

module.exports.checkIfExist = (shortUrl) => {
  return new Promise((resolve, reject) => {
    redisClient.EXISTS(shortUrl, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

module.exports.saveShortUrl = (shortUrl, longUrl) => {
  return new Promise((resolve, reject) => {
    redisClient.SETEX(shortUrl, process.env.TTL_SECONDS, longUrl, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};
