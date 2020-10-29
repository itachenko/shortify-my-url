import { Request, Response, NextFunction } from "express";
import * as Joi from "joi";
import ISessionData from "../models/ISessionData";
import { redis } from "../modules/redis";

export async function validateUrl(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const schema: Joi.ObjectSchema = Joi.object({
    url: Joi.string().trim().uri().required(),
  });

  try {
    await schema.validateAsync(req.body);
  } catch (error) {
    const sessionData = {} as ISessionData;
    sessionData.errorMessage = "Invalid URL";
    await redis.setSessionData(
      req.session?.id as string,
      JSON.stringify(sessionData)
    );

    return res.redirect("/");
  }
  next();
}

export async function checkOriginalUrlLength(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const originalUrlLength = req.body.url.length;
  const potentialShortUrlLength =
    (process.env.SITE_URL as string).length +
    parseInt(process.env.SHORL_URL_LENGTH as string, 10);

  if (potentialShortUrlLength >= originalUrlLength) {
    const sessionData = {} as ISessionData;
    sessionData.errorMessage = `Result URL won't be shorter than original one`;
    await redis.setSessionData(
      req.session?.id as string,
      JSON.stringify(sessionData)
    );

    return res.redirect("/");
  }

  next();
}
