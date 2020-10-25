import { Request, Response, NextFunction } from "express";
import * as Joi from "joi";
import { nanoid } from "nanoid";
import { checkIfExist, saveShortUrl } from "../helpers/redis";

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
    req.body.isValid = false;
  }
  next();
}

export async function createShortUrl(longUrl: string): Promise<string> {
  let short: string;
  let keyExist: boolean;
  do {
    short = nanoid(5).toLowerCase();
    keyExist = await checkIfExist(short);
  } while (keyExist !== false);

  await saveShortUrl(short, longUrl);
  return Promise.resolve(short);
}
