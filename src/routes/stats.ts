import { Request, Response, Router } from "express";
import { validateUrl } from "../middleware/url";
import { redis } from "../modules/redis";
import cors from "cors";
import { corsOptions } from "../corsOptions";

const router = Router();

router.post(
  "/",
  cors(corsOptions),
  validateUrl,
  async (req: Request, res: Response) => {
    const key: string = req.body.url.split("/").slice(-1)[0];
    const clicksCount: number | null = await redis.getClicksCount(key);
    if (clicksCount === null) {
      return res
        .header("Access-Control-Allow-Origin", "*")
        .status(500)
        .send({ error: "Such short URL was not found in the system" });
    } else {
      return res
        .header("Access-Control-Allow-Origin", "*")
        .status(200)
        .send({ url: req.body.url, clicksCount });
    }
  }
);

export default router;
