import rateLimit, { RateLimit } from "express-rate-limit";

const requestLimitHours = parseInt(
  process.env.REQUEST_RATE_LIMIT_HOURS as string,
  10
);
const requestLimitTimeframe = requestLimitHours * 60 * 60 * 1000;
const requestLimitCount = parseInt(
  process.env.REQUEST_RATE_LIMIT_COUNT as string,
  10
);

export const requestRateLimiter: RateLimit = rateLimit({
  windowMs: requestLimitTimeframe,
  max: requestLimitCount,
  handler: async (req, res) => {
    return res
      .header("Access-Control-Allow-Origin", "*")
      .status(500)
      .send({
        error: `You have exceeded the ${requestLimitCount} requests in ${requestLimitHours} hrs limit!`,
      });
  },
});
