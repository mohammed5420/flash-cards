function userAgent(req, res, next) {
  req.userAgent = req.get("User-Agent");
  console.log(req.userAgent);
  return next();
}
module.exports = userAgent;
