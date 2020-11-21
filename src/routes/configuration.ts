import { Request, Response, Router } from "express";

const router: Router = Router();

router.get("/", (req: Request, res: Response) => {
  return res.header("Access-Control-Allow-Origin", "*").status(200).send({
    shortUrlTTL: process.env.SHORT_URL_TTL_DAYS,
    requestRateLimitCount: process.env.REQUEST_RATE_LIMIT_COUNT,
    requestRateLimitHours: process.env.REQUEST_RATE_LIMIT_HOURS,
  });
});

export default router;
