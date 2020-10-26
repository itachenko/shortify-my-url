import { Request, Response, Router } from "express";
import { validateUrl } from "../models/url";
import { statistics } from "../models/stats";
import { redisHelpers } from "../helpers/redis";

const router = Router();

router.post("/", validateUrl, async (req: Request, res: Response) => {
  if (req.body.isValid === false) {
    return res.redirect("/");
  }

  const key: string = req.body.url.split("/").slice(-1)[0];
  const clicksCount: number | null = await redisHelpers.getClicksCount(key);
  if (clicksCount !== null) {
    statistics.stats = {
      url: req.body.url,
      clicksCount,
    }
  }
  return res.redirect("/");
});

export default router;
