import { Request, Response, Router } from "express";
import { validateUrl } from "../middleware/url";
import ISessionData from "../models/ISessionData";
import IUrlStatistics from "../models/IUrlStatistics";
import { redis } from "../modules/redis";

const router = Router();

router.post("/", validateUrl, async (req: Request, res: Response) => {
  const sessionId = req.session?.id as string;
  const sessionData = {} as ISessionData;

  const key: string = req.body.url.split("/").slice(-1)[0];
  const clicksCount: number | null = await redis.getClicksCount(key);
  if (clicksCount === null) {
    sessionData.errorMessage = "Such short URL was not found in the system";
    await redis.setSessionData(
      req.session?.id as string,
      JSON.stringify(sessionData)
    );
  } else {
    sessionData.statsObject = {
      url: req.body.url,
      clicksCount,
    } as IUrlStatistics;
    await redis.setSessionData(sessionId, JSON.stringify(sessionData));
  }
  return res.redirect("/");
});

export default router;
