const redis = require('redis');

const redisClient = redis.createClient(process.env.REDIS_URL);

redisClient.on('connect', () => {
    console.log(`Connected to the Redis.`);
});
redisClient.on('error', (error) => {
    console.log(error);
});

exports.redisClient = redisClient;
