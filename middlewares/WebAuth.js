const WebUser = require("../models/WebUser");
const jwt = require("jsonwebtoken");

const NotLoggedIn = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (authorization == null)
      return res.status(401).send("please check authorization");
    const token = authorization.replace("Bearer ", "");

    try {
      const payload = jwt.verify(token, process.env.TOKEN_SECRET);
      if (payload == null) return res.status(401).send("token is required");

      const webuser = await WebUser.findById(payload.id);
      if (!webuser) return res.status(401).send("user not found");
      req.web_user = payload;
      req.id = payload.id;
      req.login_web_user = webuser;
    } catch (err) {
      return res.status(401).send("Invalid or Expired Token");
    }
  } catch (error) {
    console.log(error);
    return res.status(401).send("Something went wrong");
  }
  next();
};

module.exports = {
  NotLoggedIn,
};
