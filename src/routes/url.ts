import * as express from "express";
import * as Joi from "joi";
import { nanoid } from "nanoid";
import { checkIfExist, saveShortUrl } from "../helpers/redis";
import { messages } from "../models/message";

const schema: Joi.ObjectSchema = Joi.object({
  url: Joi.string().trim().uri().required(),
});

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    await schema.validateAsync(req.body);
  } catch (error) {
    messages.errorMessage = "Invalid URL";

    return res.redirect("/");
  }

  const short: string = nanoid(5).toLowerCase();
  const keyExist: boolean = await checkIfExist(short);
  if (!keyExist) {
    await saveShortUrl(short, req.body.url);
    messages.resultMessage = `${process.env.SITE_URL}/${short}`;

    return res.redirect("/");
  }
});

export default router;
