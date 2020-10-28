import { Request, Response, Router } from "express";
import Constants from "../constants";
import { redis } from "../modules/redis";
import { loadSessionData, resetSessionData } from "../middleware/sessionData";

const router = Router();

router.get("/", loadSessionData, async (req: Request, res: Response) => {
  const sessionData = res.locals.sessionData;
  const renderOptions = {
    result: sessionData.resultMessage,
    error: sessionData.errorMessage,
    statistics: sessionData.statsObject,
  };

  res.render(Constants.PUG_TEMPLATE_INDEX, renderOptions);

  resetSessionData(req.session?.id as string);
});

router.get("/:url", async (req, res) => {
  const shortUrl = req.params.url;
  const longUrl = await redis.getLongUrl(shortUrl);

  if (!longUrl) return res.render(Constants.PUG_TEMPLATE_NOTFOUND);

  await redis.incrClicks(shortUrl);
  return res.redirect(longUrl);
});

export default router;
