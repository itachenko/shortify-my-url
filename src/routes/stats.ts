import { Request, Response, Router } from "express";
import { validateUrl } from "../models/url";
import { redisHelpers } from "../helpers/redis";
import Constants from "../constants";

const router = Router();

router.post("/", validateUrl, async (req: Request, res: Response) => {
  if (req.body.isValid === false) {
    return res.redirect("/");
  }

  const key: string = req.body.url.split("/").slice(-1)[0];
  const clicksCount: number | null = await redisHelpers.getClicksCount(key);
  if (clicksCount !== null) {
    const statistics = {
      url: req.body.url,
      clicksCount,
    };
    res.app.set(Constants.MESSAGE_URL_STAT_KEY, JSON.stringify(statistics));
  }
  return res.redirect("/");
});

export default router;
