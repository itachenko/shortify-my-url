import * as dotenv from "dotenv";
import express from "express";
import { join } from "path";
import { check } from "./helpers/variables";
import indexRouter from "./routes/index";
import urlRouter from "./routes/url";

if (process.env.NODE_ENV !== "production") dotenv.config();

check(["PORT", "REDIS_URL", "SITE_URL", "TTL_SECONDS"]);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(join(__dirname, "public")));
app.set("view engine", "pug");
app.set("views", join(__dirname, "views"));

app.use("/", indexRouter);
app.use("/url", urlRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server is running`);
});
