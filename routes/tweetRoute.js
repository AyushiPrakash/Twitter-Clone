const { response } = require("express");
const express = require("express");
const auth = require("../middlewares/auth");
const router = express.Router();

router.get("/", auth, (req, res) => {
  res.send({
    status: 200,
    message: "hi",
  });
});

//handler for add tweet

router.post("/add", (req, res) => {
  res.render("index", {
    token: req.query.token,
  });
});

//delete tweet
//list all tweets
//update likes

module.exports = router;
