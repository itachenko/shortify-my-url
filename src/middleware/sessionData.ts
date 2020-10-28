import { Request, Response, NextFunction } from "express";
import ISessionData from "../models/ISessionData";
import { redis } from "../modules/redis";

export async function loadSessionData(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const sessionId = req.session?.id as string;

  const sessionData: string | null = await redis.getSessionData(sessionId);
  if (sessionData === null) {
    await redis.setSessionData(sessionId, JSON.stringify({}));
    res.locals.sessionData = {} as ISessionData;
  } else {
    res.locals.sessionData = JSON.parse(sessionData) as ISessionData;
  }

  next();
}

export async function resetSessionData(sessionId: string): Promise<void> {
  await redis.setSessionData(sessionId, JSON.stringify({} as ISessionData));
}
