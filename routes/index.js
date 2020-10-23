const router = require("express").Router();
const { getDbSize, getLongUrl } = require("../helpers/redis");
const { messages } = require("../models/message");

router.get("/", async (req, res) => {
  res.render("index", {
    result: messages.resultMessage,
    error: messages.errorMessage,
    count: await getDbSize(),
  });

  messages.errorMessage = null;
  messages.resultMessage = null;
});

router.get("/:url", async (req, res) => {
  var longUrl = await getLongUrl(req.params.url);
  if (!longUrl) return res.render("notFound");

  return res.redirect(longUrl);
});

module.exports = router;
