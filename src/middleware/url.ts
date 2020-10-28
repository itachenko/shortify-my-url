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
    await redis.setSessionData(req.session?.id as string, JSON.stringify(sessionData));

    return res.redirect("/");
  }
  next();
}
