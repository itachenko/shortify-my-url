import * as dotenv from "dotenv";
if (process.env.NODE_ENV !== "production") dotenv.config();

import express from "express";
import { join } from "path";
import indexRouter from "./routes/index";
import urlRouter from "./routes/url";
import statsRouter from "./routes/stats";
import logger from "./helpers/logger";
import { utils } from "./helpers/utils";

utils.checkEnvironmentVariables(["PORT", "REDIS_URL", "SITE_URL", "TTL_SECONDS", "LOG_LEVEL"]);

const app = express();

app.set("view engine", "pug");
app.set("views", join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(join(__dirname, "public")));
app.use("/", indexRouter);
app.use("/url", urlRouter);
app.use("/stats", statsRouter);

app.listen(process.env.PORT, () => {
  logger.info("Server is running");
});
