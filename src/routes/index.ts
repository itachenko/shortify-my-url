import * as express from "express";
import { getDbSize, getLongUrl, incrClicks } from "../helpers/redis";
import { messages } from "../models/message";

const router = express.Router();

router.get("/", async (req, res) => {
  res.render("index", {
    result: messages.resultMessage,
    error: messages.errorMessage,
    count: await getDbSize(),
  });

  messages.resetMessages();
});

router.get("/:url", async (req, res) => {
  const shortUrl = req.params.url;
  const longUrl = await getLongUrl(shortUrl);
  if (!longUrl) return res.render("notFound");

  await incrClicks(shortUrl);
  return res.redirect(longUrl);
});

export default router;
