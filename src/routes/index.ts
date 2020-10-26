import { Request, Response, Router } from "express";
import { redisHelpers } from "../helpers/redis";
import { messages } from "../models/message";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  res.render("index", {
    result: messages.resultMessage,
    error: messages.errorMessage,
    count: await redisHelpers.getDbSize(),
  });

  messages.resetMessages();
});

router.get("/:url", async (req, res) => {
  const shortUrl = req.params.url;
  const longUrl = await redisHelpers.getLongUrl(shortUrl);
  if (!longUrl) return res.render("notFound");

  await redisHelpers.incrClicks(shortUrl);
  return res.redirect(longUrl);
});

export default router;
