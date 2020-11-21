import { Request, Response, Router } from "express";
import { corsOptions } from "../corsOptions";
import cors from "cors";

const router: Router = Router();

router.get("/", cors(corsOptions), (req: Request, res: Response) => {
  return res.header("Access-Control-Allow-Origin", "*").status(200).send({
    shortUrlTTL: process.env.SHORT_URL_TTL_DAYS,
    requestRateLimitCount: process.env.REQUEST_RATE_LIMIT_COUNT,
    requestRateLimitHours: process.env.REQUEST_RATE_LIMIT_HOURS,
  });
});

export default router;
