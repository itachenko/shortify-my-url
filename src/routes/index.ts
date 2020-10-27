import { Request, Response, Router } from "express";
import { redisHelpers } from "../helpers/redis";
import Constants from "../constants";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  const renderOptions = {
    result: res.app.get(Constants.MESSAGE_RESULT_KEY),
    error: res.app.get(Constants.MESSAGE_ERROR_KEY),
    count: await redisHelpers.getDbSize(),
    statistics: null
  };

  if (res.app.get(Constants.MESSAGE_URL_STAT_KEY) !== undefined) {
    renderOptions.statistics = JSON.parse(res.app.get(Constants.MESSAGE_URL_STAT_KEY));
  }
  res.render(Constants.PUG_TEMPLATE_INDEX, renderOptions);

  resetAppSettings(res);
});

router.get("/:url", async (req, res) => {
  const shortUrl = req.params.url;
  const longUrl = await redisHelpers.getLongUrl(shortUrl);
  if (!longUrl) return res.render(Constants.PUG_TEMPLATE_NOTFOUND);

  await redisHelpers.incrClicks(shortUrl);
  return res.redirect(longUrl);
});

function resetAppSettings(res: Response) {
  res.app.set(Constants.MESSAGE_RESULT_KEY, null);
  res.app.set(Constants.MESSAGE_ERROR_KEY, null);
  res.app.set(Constants.MESSAGE_URL_STAT_KEY, null);
}

export default router;
