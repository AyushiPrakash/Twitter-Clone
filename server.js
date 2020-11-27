const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const saltRounds = 5;
const path = require("path");
const jwt = require("jsonwebtoken");

const tweetRoute = require("./routes/tweetRoute");

app.set("view engine", "ejs");

app.use(bodyparser.json());
app.use(express.static("./client/public"));
app.use(bodyparser.urlencoded({ extended: false }));

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "twitter",
});

app.get("/", (req, res) => {
  if (req.query.token) {
    let query = "SELECT * from TWEETS";
    con.query(query, (err, results) => {
      if (err) {
        res.send({
          status: 500,
          message: err.message,
        });
      } else {
        res.render("index", {
          token: req.query.token,
          tweets: results,
        });
      }
    });
  } else res.sendFile(path.join(__dirname, "./client", "login.html"));
});

app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "./client", "signup.html"));
});

//sign up

app.post("/signup", (req, res) => {
  let { name, userName, email, password } = req.body;
  con.query(
    `SELECT email FROM USERS WHERE email ='${email}'`,
    (err, result) => {
      if (err) throw err;

      if (result.length == 0) {
        let hashedPassword;
        bcrypt.genSalt(saltRounds, (err, salt) => {
          if (err) {
            throw err;
          } else {
            bcrypt.hash(password, salt, (err, hash) => {
              if (err) {
                throw err;
              } else {
                hashedPassword = hash;

                // let query = `INSERT INTO USERS (userName, name, email, password) VALUES ('${userName}',${name}','${email}','${hashedPassword}')`;
                let query =
                  'INSERT INTO USERS (name,userName, email, password) VALUES ("' +
                  name +
                  '" , "' +
                  userName +
                  '" , "' +
                  email +
                  '" , "' +
                  hashedPassword +
                  '")';
                con.query(query, (err, results) => {
                  if (err) {
                    res.send({
                      status: 500,
                      message: err.message,
                    });
                  } else {
                    const payload = {
                      //defining payload
                      user: {
                        email: email,
                      },
                    };
                    jwt.sign(
                      //generates token
                      payload, //email here
                      "jwtsecret",
                      {
                        //extra options
                      },
                      (err, token) => {
                        if (err) throw err;
                        res.redirect("/?token=" + token);
                      }
                    );
                  }
                });
              }
            }); //bcrypt end
          }
        });
      } else {
        res.send({
          status: 500,
          message: "User already exists",
        });
      }
    }
  );
});

//Log in

app.post("/login", (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  con.query(
    `SELECT * FROM USERS WHERE email ='${email}'`,
    async (err, result) => {
      if (err) throw err;

      if (result.length == 0) {
        res.send({
          status: 500,
          message: "Email not found",
        });
      } else {
        let savedPassword = result[0].Password;
        // console.log(result[0].Password);
        const isMatch = await bcrypt.compare(password, savedPassword);
        if (!isMatch) {
          return res.send({
            status: 500,
            message: "Incorrect Password",
          });
        }
        if (isMatch) {
          //pass match: return jwt token else throw error
          const payload = {
            //defining payload
            user: {
              email: email,
            },
          };
          jwt.sign(
            //generates token
            payload, //email here
            "jwtsecret",
            {
              //extra options
            },
            (err, token) => {
              if (err) throw err;
              res.redirect("/?token=" + token);
            }
          );
        }
      }
    }
  );
});

app.use("/tweet", tweetRoute);

const PORT = 6001;
app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});
