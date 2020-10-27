import { Request, Response, Router } from "express";
import { validateUrl, createShortUrl } from "../models/url";
import Constants from "../constants";

const router = Router();

router.post("/", validateUrl, async (req: Request, res: Response) => {
  if (req.body.isValid === false) {
    res.app.set(Constants.MESSAGE_ERROR_KEY, "Invalid URL");
    return res.redirect("/");
  }

  const short = await createShortUrl(req.body.url);
  res.app.set(Constants.MESSAGE_RESULT_KEY, `${process.env.SITE_URL}/${short}`);
  return res.redirect("/");
});

export default router;
