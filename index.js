if (process.env.NODE_ENV !== "production") require("dotenv").config();
require("./helpers/envVariables").check([
  "PORT",
  "REDIS_URL",
  "SITE_URL",
  "TTL_SECONDS",
]);

const path = require("path");
const express = require("express");
const Joi = require("joi");
const { nanoid } = require("nanoid");
const { redisClient, getDbSize } = require("./helpers/redis");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.locals.title = "Shortify My URL";

const schema = Joi.object({
  url: Joi.string().trim().uri().required(),
});

const messages = {
  errorMessage: "",
  resultMessage: "",
};

app.get("/", async (req, res) => {
  res.render("index", {
    result: messages.resultMessage,
    error: messages.errorMessage,
    count: await getDbSize(),
  });

  messages.errorMessage = "";
  messages.resultMessage = "";
});

app.get("/:url", (req, res) => {
  redisClient.GET(req.params.url, (err, reply) => {
    if (!reply) {
      res.render("not-found");
    } else {
      res.redirect(reply);
    }
  });
});

app.post("/generate", async (req, res) => {
  try {
    await schema.validateAsync(req.body);
  } catch (error) {
    messages.errorMessage = "Invalid URL";
    return res.json({ success: false });
  }

  const short = nanoid(5).toLowerCase();
  redisClient.EXISTS(short, (err, reply) => {
    if (!reply) {
      redisClient.SETEX(short, process.env.TTL_SECONDS, req.body.url);
      messages.resultMessage = `${process.env.SITE_URL}/${short}`;
      res.json({ success: true });
    }
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running`);
});
