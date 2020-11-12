import { Request, Response, Router } from "express";
import { requestRateLimiter } from "../middleware/requestRateLimit";
import { checkOriginalUrlLength, validateUrl } from "../middleware/url";
import { createShortUrl } from "../modules/url";

const router: Router = Router();

router.options("/", (req: Request, res: Response) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "POST");
  res.header("Access-Control-Allow-Headers", "Content-Type");

  return res.status(200).send();
});

router.post(
  "/",
  validateUrl,
  checkOriginalUrlLength,
  requestRateLimiter,
  async (req: Request, res: Response) => {
    const short = await createShortUrl(req.body.url);
    return res
      .header("Access-Control-Allow-Origin", "*")
      .status(200)
      .send({ shortUrl: `${process.env.SITE_URL}/${short}` });
  }
);

export default router;
