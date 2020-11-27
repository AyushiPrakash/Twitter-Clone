const express = require("express");
const mysql = require("mysql");
const auth = require("../middlewares/auth");
const router = express.Router();

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "twitter",
});

//handler for add tweet

router.post("/add", auth, (req, res) => {
  let { tweetInput } = req.body;
  let userQuery = `SELECT * FROM USERS WHERE email ="${req.user.email}"`;
  con.query(userQuery, (err, results) => {
    if (err) {
      res.send({
        status: 500,
        message: err.message,
      });
    } else {
      let insertQuery = `INSERT into tweets (name,userName,content) values ( "${results[0].Name}" ,"${results[0].userName}" ,"${tweetInput}" )`;

      con.query(insertQuery, (err, results) => {
        if (err) {
          res.send({
            status: 500,
            message: err.message,
          });
        } else {
          res.redirect("/?token=" + req.query.token);
        }
      });
    }
  });
});

//delete tweet
//list all tweets
//update likes

module.exports = router;
