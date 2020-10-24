import * as express from "express";
import { getDbSize, getLongUrl } from "../helpers/redis";
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
  const longUrl = await getLongUrl(req.params.url);
  if (!longUrl) return res.render("notFound");

  return res.redirect(longUrl);
});

export default router;
