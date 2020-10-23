if (process.env.NODE_ENV !== "production") require("dotenv").config();
require("./helpers/variables").check([
  "PORT",
  "REDIS_URL",
  "SITE_URL",
  "TTL_SECONDS",
]);

const path = require("path");
const express = require("express");
const indexRoute = require("./routes/index");
const urlsRoute = require("./routes/url");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use("/", indexRoute);
app.use("/url", urlsRoute);

app.listen(process.env.PORT, () => {
  console.log(`Server is running`);
});
