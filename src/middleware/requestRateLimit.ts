import rateLimit, { RateLimit } from "express-rate-limit";
import ISessionData from "../models/ISessionData";
import { redis } from "../modules/redis";

const requestLimitHours = parseInt(process.env.REQUEST_RATE_LIMIT_HOURS as string, 10);
const requestLimitTimeframe = requestLimitHours * 60 * 60 * 1000;
const requestLimitCount = parseInt(process.env.REQUEST_RATE_LIMIT_COUNT as string, 10);

export const requestRateLimiter: RateLimit = rateLimit({
  windowMs: requestLimitTimeframe,
  max: requestLimitCount,
  handler: async (req, res) => {
    const sessionId = req.session?.id as string;
    const sessionData = {} as ISessionData;

    sessionData.errorMessage = `You have exceeded the ${requestLimitCount} requests in ${requestLimitHours} hrs limit!`;
    await redis.setSessionData(sessionId, JSON.stringify(sessionData));

    res.redirect('/');
  }
});
