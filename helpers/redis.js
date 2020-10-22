const redis = require("redis");

const redisClient = redis.createClient(process.env.REDIS_URL);

redisClient.on("connect", () => {
  console.log(`Connected to the Redis.`);
});
redisClient.on("error", (error) => {
  console.log(error);
});

module.exports.redisClient = redisClient;

module.exports.getDbSize = () => {
  return new Promise((resolve, reject) => {
    redisClient.DBSIZE((err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
};
