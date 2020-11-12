import { Request, Response, Router } from "express";
import { validateUrl } from "../middleware/url";
import { redis } from "../modules/redis";

const router = Router();

router.options("/", (req: Request, res: Response) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "POST");
  res.header("Access-Control-Allow-Headers", "Content-Type");

  return res.status(200).send();
});

router.post("/", validateUrl, async (req: Request, res: Response) => {
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
});

export default router;
