const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.query.token;
  console.log(token);
  if (!token) res.redirect("/?tokenError");

  try {
    const decoded = jwt.verify(token, "jwtsecret");
    req.user = decoded.user; //token correct
    next();
  } catch (err) {
    console.log(err);
    res.redirect("/?jwtError");
  }
};
