//TODO: create middleware to verify jwt tokens
//TODO: add verifyToken middleware to all protected routes
const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("./../models/User");

const verifyToken = async (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (!bearerHeader) return res.sendStatus(403).json({ message: "Forbidden" });
  const token = bearerHeader.split(" ")[1];
  try {
    const userToken = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findById(userToken._id);
    if (user.passwordChangedAt) {
      const lastTimePasswordChanged = user.passwordChangedAt.getTime() / 1000;
      if (!(lastTimePasswordChanged < userToken.iat)) {
        console.log(lastTimePasswordChanged < userToken.iat);
        return res.status(403).json({
          message: "this account password has been changed please login!",
        });
      }
    }
    req.user = userToken;
    return next();
  } catch (err) {
    console.log(err);
    return res.status(403).json({ message: "Forbidden!" });
  }
};

module.exports = verifyToken;
