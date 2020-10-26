import { Request, Response, NextFunction } from "express";
import * as Joi from "joi";
import { nanoid } from "nanoid";
import { redisHelpers } from "../helpers/redis";

/**
 * Middleware function which validates input URL.
 */
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

/**
 * Creates new short URL and saves it in the database.
 * @param longUrl URL to shortify.
 */
export async function createShortUrl(longUrl: string): Promise<string> {
  let short: string;
  let keyExist: boolean;
  do {
    short = nanoid(5).toLowerCase();
    keyExist = await redisHelpers.checkIfExist(short);
  } while (keyExist !== false);

  await redisHelpers.saveShortUrl(short, longUrl);
  return Promise.resolve(short);
}
