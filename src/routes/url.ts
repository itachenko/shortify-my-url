import { Request, Response, Router } from "express";
import { nanoid } from "nanoid";
import { requestRateLimiter } from "../middleware/requestRateLimit";
import { checkOriginalUrlLength, validateUrl } from "../middleware/url";
import ISessionData from "../models/ISessionData";
import { redis } from "../modules/redis";

const router = Router();
const shortUrlLength = parseInt(process.env.SHORL_URL_LENGTH as string, 10);

router.post(
  "/",
  validateUrl,
  checkOriginalUrlLength,
  requestRateLimiter,
  async (req: Request, res: Response) => {
    const sessionId = req.session?.id as string;
    const sessionData = {} as ISessionData;

    const short = await createShortUrl(req.body.url);
    sessionData.resultMessage = `${process.env.SITE_URL}/${short}`;
    await redis.setSessionData(sessionId, JSON.stringify(sessionData));

    return res.redirect("/");
  }
);

/**
 * Creates new short URL and saves it in the database.
 * @param longUrl URL to shortify.
 */
async function createShortUrl(longUrl: string): Promise<string> {
  let short: string;
  let keyExist: boolean;

  do {
    short = nanoid(shortUrlLength).toLowerCase();
    keyExist = await redis.checkIfExist(short);
  } while (keyExist !== false);

  await redis.saveShortUrl(short, longUrl);
  return Promise.resolve(short);
}

export default router;
