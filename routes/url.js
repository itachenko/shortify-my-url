const router = require("express").Router();
const Joi = require("joi");
const { nanoid } = require("nanoid");
const { checkIfExist, saveShortUrl } = require("../helpers/redis");
const { messages } = require("../models/message");

const schema = Joi.object({
  url: Joi.string().trim().uri().required(),
});

router.post("/", async (req, res) => {
  try {
    await schema.validateAsync(req.body);
  } catch (error) {
    messages.errorMessage = "Invalid URL";

    return res.redirect("/");
  }

  const short = nanoid(5).toLowerCase();
  const keyExist = await checkIfExist(short);
  if (!keyExist) {
    await saveShortUrl(short, req.body.url);
    messages.resultMessage = `${process.env.SITE_URL}/${short}`;

    return res.redirect("/");
  }
});

module.exports = router;
