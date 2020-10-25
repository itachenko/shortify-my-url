import * as express from "express";
import { messages } from "../models/message";
import { validateUrl, createShortUrl } from "../models/url";

const router = express.Router();

router.post("/", validateUrl, async (req, res) => {
  if (req.body.isValid === false) {
    messages.errorMessage = "Invalid URL";
    return res.redirect("/");
  }

  const short = await createShortUrl(req.body.url);
  messages.resultMessage = `${process.env.SITE_URL}/${short}`;
  return res.redirect("/");
});

export default router;
