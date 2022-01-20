module.exports = (callback) => {
  return (req, res, next) => {
    console.log(req);
    callback(req, res, next).catch((error) => next(error));
  };
};
