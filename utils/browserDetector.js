const UAParser = require("ua-parser-js");

function userBrowser(req) {
  let userAgent = req.userAgent;
  let parser = new UAParser();
  parser.setUA(userAgent);

  let result = parser.getResult();
  console.log({ result });

  return {
    os: result.os,
    browser: result.browser,
  };
}


module.exports = userBrowser;
