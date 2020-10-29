import * as dotenv from "dotenv";
if (process.env.NODE_ENV !== "production") dotenv.config();

import express from "express";
import session from "express-session";
import { join } from "path";
import indexRouter from "./routes/index";
import urlRouter from "./routes/url";
import statsRouter from "./routes/stats";
import logger from "./modules/logger";
import { utils } from "./utils";

utils.checkEnvironmentVariables([
  "PORT",
  "REDIS_URL",
  "SITE_URL",
  "SHORT_URL_TTL_DAYS",
  "LOG_LEVEL",
  "SESSION_SECRET",
  "SESSION_TTL_SECONDS",
  "REQUEST_RATE_LIMIT_HOURS",
  "REQUEST_RATE_LIMIT_COUNT",
  "SHORL_URL_LENGTH",
]);

const app = express();

app.set("view engine", "pug");
app.set("views", join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(join(__dirname, "public")));
app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: true,
  })
);
app.use("/", indexRouter);
app.use("/url", urlRouter);
app.use("/stats", statsRouter);

app.listen(process.env.PORT, () => {
  logger.info("Server is running");
});
