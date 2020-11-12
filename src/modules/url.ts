import { nanoid } from "nanoid";
import { redis } from "../modules/redis";

const shortUrlLength: number = parseInt(
  process.env.SHORL_URL_LENGTH as string,
  10
);

/**
 * Creates new short URL and saves it in the database.
 * @param longUrl URL to shortify.
 */
export const createShortUrl = async (longUrl: string): Promise<string> => {
  let short: string;
  let keyExist: boolean;

  do {
    short = nanoid(shortUrlLength).toLowerCase();
    keyExist = await redis.checkIfExist(short);
  } while (keyExist !== false);

  await redis.saveShortUrl(short, longUrl);
  return Promise.resolve(short);
};
