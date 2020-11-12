import * as dotenv from "dotenv";
if (process.env.NODE_ENV !== "production") dotenv.config();

import express, { NextFunction, Request, Response } from "express";
import { join } from "path";
import { logger } from "./modules/logger";
import { utils } from "./utils";

import indexRouter from "./routes/index";
import configurationApiRouter from "./routes/configuration";
import urlApiRouter from "./routes/url";
import statsApiRouter from "./routes/stats";

utils.checkEnvironmentVariables([
  "PORT",
  "REDIS_URL",
  "SITE_URL",
  "SHORT_URL_TTL_DAYS",
  "LOG_LEVEL",
  "REQUEST_RATE_LIMIT_HOURS",
  "REQUEST_RATE_LIMIT_COUNT",
  "SHORL_URL_LENGTH",
]);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/api/config", configurationApiRouter);
app.use("/api/url", urlApiRouter);
app.use("/api/stats", statsApiRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
  return res.redirect("/notFound.html");
});

app.listen(process.env.PORT, () => {
  logger.info("Server is running");
});
