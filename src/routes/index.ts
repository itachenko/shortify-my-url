import { Request, Response, Router } from "express";
import { redis } from "../modules/redis";

const router: Router = Router();

router.get("/:url", async (req: Request, res: Response) => {
  const shortUrl = req.params.url;
  const longUrl = await redis.getLongUrl(shortUrl);

  if (!longUrl) return res.redirect("/404");

  await redis.incrClicks(shortUrl);
  return res.redirect(longUrl);
});

export default router;
