function userAgent(req, res, next) {
  req.userAgent = req.get("User-Agent");
  return next();
}
module.exports = userAgent;
