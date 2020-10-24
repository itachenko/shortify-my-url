import * as dotenv from "dotenv";
if (process.env.NODE_ENV !== "production") dotenv.config();

import { check } from "./helpers/variables";
check(["PORT", "REDIS_URL", "SITE_URL", "TTL_SECONDS", "LOG_LEVEL"]);

import express from "express";
import { join } from "path";
import indexRouter from "./routes/index";
import urlRouter from "./routes/url";
import logger from "./helpers/logger";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(join(__dirname, "public")));
app.set("view engine", "pug");
app.set("views", join(__dirname, "views"));

app.use("/", indexRouter);
app.use("/url", urlRouter);

app.listen(process.env.PORT, () => {
  logger.info("Server is running");
});
