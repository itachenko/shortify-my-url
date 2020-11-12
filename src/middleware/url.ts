import { Request, Response, NextFunction } from "express";
import * as Joi from "joi";

export const validateUrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const schema: Joi.ObjectSchema = Joi.object({
    url: Joi.string().trim().uri().required(),
  });

  try {
    await schema.validateAsync(req.body);
  } catch (error) {
    return res
      .header("Access-Control-Allow-Origin", "*")
      .status(500)
      .send({ error: "Invalid URL" });
  }

  next();
};

export const checkOriginalUrlLength = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const originalUrlLength = req.body.url.length;
  const potentialShortUrlLength =
    (process.env.SITE_URL as string).length +
    parseInt(process.env.SHORL_URL_LENGTH as string, 10);

  if (potentialShortUrlLength >= originalUrlLength) {
    return res
      .header("Access-Control-Allow-Origin", "*")
      .status(500)
      .send({ error: "Result URL won't be shorter than original one" });
  }

  next();
};
