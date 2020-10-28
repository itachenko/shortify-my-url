import { Request, Response, NextFunction } from "express";
import * as Joi from "joi";

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
